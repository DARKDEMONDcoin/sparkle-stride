import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getAdsHistory } from "@/lib/ads/history.functions";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw } from "lucide-react";

const number = (value: number | null) => value === null ? "—" : value.toLocaleString("ar-EG-u-nu-latn", { maximumFractionDigits: 2 });

export function AdsCampaignHistory({ workspaceId }: { workspaceId: string }) {
  const [accountId, setAccountId] = useState<string>();
  const [days, setDays] = useState<30 | 90>(90);
  const load = useServerFn(getAdsHistory);
  const query = useQuery({ queryKey: ["ads-history", workspaceId, accountId, days], queryFn: () => load({ data: { workspaceId, accountId, days } }), retry: false });
  const data = query.data;
  return <section className="space-y-5 border-t border-border py-5" dir="rtl">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="font-semibold">تاريخ الحملات</h2>
      <div className="flex flex-wrap items-center gap-2">
        {Boolean(data?.accounts.length) && <Select value={accountId ?? data?.account?.id} onValueChange={setAccountId}>
          <SelectTrigger className="w-52 max-w-full" aria-label="الحساب الإعلاني"><SelectValue /></SelectTrigger>
          <SelectContent>{data?.accounts.map((account) => <SelectItem key={account.id} value={account.id}>{account.name ?? account.external_id}</SelectItem>)}</SelectContent>
        </Select>}
        <Select value={String(days)} onValueChange={(value) => setDays(value === "30" ? 30 : 90)}>
          <SelectTrigger className="w-36" aria-label="الفترة"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="90">آخر 90 يوماً</SelectItem><SelectItem value="30">آخر 30 يوماً</SelectItem></SelectContent>
        </Select>
        <Button variant="ghost" size="icon" title="تحديث البيانات المحفوظة" aria-label="تحديث البيانات المحفوظة" disabled={query.isFetching} onClick={() => void query.refetch()}><RefreshCw className="size-4" /></Button>
      </div>
    </div>
    {query.isPending && <p role="status" className="text-muted-foreground">جارٍ تحميل التاريخ…</p>}
    {query.error && <p role="alert" className="text-destructive">{query.error.message}</p>}
    {data && !data.account && <p className="text-muted-foreground">لا توجد حسابات إعلانية محفوظة بعد.</p>}
    {data?.account && <>
      <p className="text-sm text-muted-foreground" dir="auto">{data.account.currency ?? "العملة غير متاحة"} · {data.account.timezone} · {data.since} — {data.until} (غير شامل)</p>
      {data.jobs.map((job) => <p key={job.id} role="status" className="text-sm text-muted-foreground">{job.status === "running" || job.status === "queued" ? "جارٍ تعلّم حسابك…" : job.status} {job.pause_reason ?? job.last_error ?? ""}</p>)}
      {data.truncated && <p role="alert" className="text-destructive">الفترة تتجاوز حجم العرض المتاح؛ لم تُحسب إجماليات جزئية.</p>}
      {!data.truncated && data.campaigns.length === 0 && <p className="text-muted-foreground">لم تتم مزامنة تاريخ الحملات بعد.</p>}
      {data.campaigns.length > 0 && <>
        <dl className="grid grid-cols-2 gap-4 border-y border-border py-4 sm:grid-cols-4">
          {[["الإنفاق", data.summary.totals.spend], ["النقرات", data.summary.totals.clicks], ["التحويلات", data.summary.totals.conversions], ["تكلفة التحويل", data.summary.cpa]].map(([label, value]) => <div key={String(label)}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 font-semibold">{number(typeof value === "number" ? value : null)}</dd></div>)}
        </dl>
        <p className="text-xs text-muted-foreground">استُبعدت {number(data.summary.excluded)} سجلات غير ناضجة أو غير موثوقة أو غير مكتملة من الإجماليات.</p>
        <div className="overflow-x-auto"><table className="w-full min-w-[36rem] text-sm"><thead><tr>{["الحملة", "الإنفاق", "النقرات", "التحويلات", "CPA", "ROAS"].map((label) => <th key={label} className="border-b border-border p-3 text-start">{label}</th>)}</tr></thead><tbody>{data.campaigns.map((campaign) => <tr key={campaign.id}><td className="max-w-64 break-words border-b border-border p-3">{campaign.name}</td>{[campaign.totals.spend, campaign.totals.clicks, campaign.totals.conversions, campaign.cpa, campaign.roas].map((value, index) => <td key={index} className="border-b border-border p-3">{campaign.included ? number(value) : "—"}</td>)}</tr>)}</tbody></table></div>
      </>}
    </>}
  </section>;
}