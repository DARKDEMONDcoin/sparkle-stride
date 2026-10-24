import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { verifiedWorkspace } from "./settings.functions";
import { aggregateHistory } from "./history";

/** Cached campaign reads only; no platform writes or fabricated/demo rows. */
export const getAdsHistory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({
    workspaceId: z.string().uuid(), accountId: z.string().uuid().optional(), days: z.union([z.literal(30), z.literal(90)]).default(90),
  }).parse(input))
  .handler(async ({ data, context }) => {
    const workspaceId = await verifiedWorkspace(context.supabase, context.userId, data.workspaceId);
    const { data: accounts, error: accountError } = await context.supabase.from("ad_accounts")
      .select("id,name,external_id,currency,timezone,platform").eq("workspace_id", workspaceId).order("created_at");
    if (accountError) throw new Error(accountError.message);
    const account = data.accountId ? accounts?.find((row) => row.id === data.accountId) : accounts?.[0];
    if (data.accountId && !account) throw new Error("Forbidden: الحساب غير موجود في مساحتك.");
    if (!account) return { accounts: accounts ?? [], account: null, campaigns: [], summary: aggregateHistory([]), jobs: [], truncated: false };
    const { accountCalendarDay, historyWindows } = await import("./history");
    if (!account.timezone) throw new Error("المنطقة الزمنية غير متاحة من الحساب؛ أكمل الربط أولاً.");
    const today = accountCalendarDay(account.timezone);
    const since = new Date(Date.parse(today) - data.days * 86_400_000).toISOString().slice(0, 10);
    const [{ data: snapshots, error }, { data: jobs, error: jobError }] = await Promise.all([
      context.supabase.from("campaign_snapshots").select("external_id,name,day,metrics,data_maturity,fetched_at")
        .eq("workspace_id", workspaceId).eq("ad_account_id", account.id).eq("level", "campaign")
        .gte("day", since).lt("day", today).order("day").order("external_id").limit(1001),
      context.supabase.from("ad_jobs").select("id,kind,status,progress,pause_reason,last_error,updated_at")
        .eq("workspace_id", workspaceId).eq("ad_account_id", account.id).order("created_at", { ascending: false }).limit(5),
    ]);
    if (error) throw new Error(error.message);
    if (jobError) throw new Error(jobError.message);
    const truncated = (snapshots?.length ?? 0) > 1000;
    // Never display partial financial totals as complete.
    const rows = truncated ? [] : snapshots ?? [];
    const grouped = new Map<string, typeof rows>();
    for (const row of rows) grouped.set(row.external_id, [...(grouped.get(row.external_id) ?? []), row]);
    return {
      accounts: accounts ?? [], account, since, until: today, plannedWindows: historyWindows(today).length,
      campaigns: [...grouped].map(([id, values]) => ({ id, name: values[0]?.name ?? id, ...aggregateHistory(values) }))
        .sort((a, b) => b.totals.spend - a.totals.spend),
      summary: aggregateHistory(rows), jobs: jobs ?? [], truncated,
    };
  });