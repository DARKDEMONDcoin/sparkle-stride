/**
 * اختيار موفّر الربط لكل منصة إعلانية وقدراته. الوكيل والواجهة يقرآن القدرات
 * بدل افتراضها، فيُعطّلان ما لا يدعمه الموفّر مع شرح السبب بلغة مفهومة.
 */
import type { AdPlatform } from "./provider";

export type AdProviderKind = "direct" | "pipeboard" | "windsor";

export type ProviderCapabilities = {
  canCreatePMax: boolean;
  canCreateDemandGen: boolean;
  canCreateAdvantagePlus: boolean;
  canAuditConversions: boolean;
  canEditAssets: boolean;
  canReadChangeHistory: boolean;
  canReadLandingPageMetrics: boolean;
  canReadConversionLag: boolean;
  canWrite: boolean;
};

export const PROVIDER_CAPABILITIES: Record<AdProviderKind, ProviderCapabilities> = {
  pipeboard: {
    canCreatePMax: false,
    canCreateDemandGen: false,
    canCreateAdvantagePlus: true,
    canAuditConversions: true,
    canEditAssets: true,
    canReadChangeHistory: false,
    canReadLandingPageMetrics: false,
    canReadConversionLag: false,
    canWrite: true,
  },
  direct: {
    canCreatePMax: true,
    canCreateDemandGen: true,
    canCreateAdvantagePlus: true,
    canAuditConversions: true,
    canEditAssets: true,
    canReadChangeHistory: true,
    canReadLandingPageMetrics: true,
    canReadConversionLag: true,
    canWrite: true,
  },
  windsor: {
    canCreatePMax: false,
    canCreateDemandGen: false,
    canCreateAdvantagePlus: false,
    canAuditConversions: false,
    canEditAssets: false,
    canReadChangeHistory: false,
    canReadLandingPageMetrics: false,
    canReadConversionLag: false,
    canWrite: false,
  },
};

/** شرح عربي مبسّط لكل قدرة غير متاحة — يظهر في الواجهة وردود عبدالله. */
export const CAPABILITY_EXPLANATIONS: Record<keyof ProviderCapabilities, string> = {
  canCreatePMax: "إنشاء حملات Performance Max يحتاج الربط المباشر بجوجل.",
  canCreateDemandGen: "إنشاء حملات Demand Gen يحتاج الربط المباشر بجوجل.",
  canCreateAdvantagePlus: "إنشاء حملات Advantage+‎ غير متاح عبر هذا الموفّر.",
  canAuditConversions: "تدقيق إعداد التحويلات غير متاح عبر هذا الموفّر.",
  canEditAssets: "تعديل الأصول الإعلانية غير متاح عبر هذا الموفّر.",
  canReadChangeHistory: "سجل التغييرات التاريخي غير متاح عبر هذا الموفّر؛ ستنخفض ثقة خط الأساس.",
  canReadLandingPageMetrics: "مقاييس صفحات الهبوط من المنصة غير متاحة عبر هذا الموفّر.",
  canReadConversionLag: "قياس تأخر التحويلات غير متاح عبر هذا الموفّر.",
  canWrite: "هذا الموفّر للقراءة فقط؛ لا يمكن تنفيذ أي تغيير من خلاله.",
};

const VALID_PROVIDERS: readonly AdProviderKind[] = ["direct", "pipeboard", "windsor"];

export function isAdProviderKind(value: string | null | undefined): value is AdProviderKind {
  return VALID_PROVIDERS.includes(value as AdProviderKind);
}

/**
 * يحسم الموفّر الفعلي لمنصة داخل مساحة عمل: تجاوز مساحة العمل المخزّن أولاً،
 * ثم متغيّر البيئة AD_PROVIDER_<PLATFORM>، ثم الافتراضي (Pipeboard).
 */
export function resolveProvider(
  platform: AdPlatform,
  envValue: string | null | undefined,
  workspaceOverride: string | null | undefined,
): AdProviderKind {
  if (isAdProviderKind(workspaceOverride)) return workspaceOverride;
  if (isAdProviderKind(envValue)) return envValue;
  return "pipeboard";
}

export function providerLabel(kind: AdProviderKind): string {
  return kind === "pipeboard" ? "Pipeboard" : kind === "windsor" ? "Windsor" : "الربط المباشر";
}

/** أطراف خارجية تعالج بيانات الإعلانات — تُذكر في إشعار الموافقة داخل تبويب الاتصالات. */
export function thirdPartyNotice(kind: AdProviderKind): string | null {
  if (kind === "pipeboard")
    return "عند الربط ستعالج Pipeboard (شريك ميتا المعتمد) بيانات حساباتك الإعلانية لتمريرها إلينا بأمان.";
  if (kind === "windsor") return "عند الربط ستعالج Windsor بيانات حساباتك الإعلانية للقراءة فقط.";
  return null;
}
