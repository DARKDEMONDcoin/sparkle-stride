# Marblism Deep Dive

السلام عليكم، بص الموقع دة اعمل ديب سيرش عميق جدا جدا جدا عنة وكل حاجة عنة اعمل اقصي ديب سيرش عميق جدا جدا جدا عن الموقع دة :

https://www.marblism.com/?via=mariam-el-sayed&gad_source=1&gad_campaignid=23961736462&gbraid=0AAAABD_7tf2sdH5scTcfMwp2wlRO7oOJu&gclid=Cj0KCQjw79nUBhCgARIsADSHka3-UTqSDyqd38PpEzPEmYFilZNXSvrSyp_wJs8bsZS-fQD3VIf_S-0aAjvTEALw_wcB

وقولي احنا نقدر نعمل مثلة وافضل ازاي ولاحظ لا نريد تكاليف كلة مجاني لكن الأفضل ، اعمل ديب سيرش عميق جدا جدا جدا لكلة حرفياً وقولي هننفذ ازاي قولي فقط تناقش معايا ولا تنفذ شئ

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cd8afcaa-5cb1-477a-ba5e-5620deec22db).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Media Buyer migration — step 1

Extend the permanent employee `abdullah`; preserve Adam's existing advertising actions. New Media Buyer internal calls use authenticated TanStack server functions; OAuth/webhook/scheduler callbacks use server routes with caller verification. Browser-supplied workspace IDs are checked against the authenticated owner. No new Supabase Edge Functions.

The additive schema uses the existing `workspace_id` tenant convention, owner RLS, cross-tenant/account reference validation and an immutable `change_log`. Baselines, history, outcomes, tracking/structure/page audits, experiments, creative concepts, API usage and resumable `ad_jobs` are storage foundations only: no history pull, evidence-gate execution, provider adapter or scheduler is activated in step 1.

Abdullah uses existing employee-scoped `brain_items` guidelines. Daily audit preference is saved in `ad_guardrails`, defaults off, and does not execute anything yet. The API health panel is platform-admin-only; `user_roles` assignments are privileged provisioning, never user-editable. No administrator is auto-assigned. Authenticated owner settings read/write through RLS; server-generated evidence/job tables grant owners read access only.

`GOOGLE_ADS_API_VERSION` and `META_MARKETING_API_VERSION` are server-side overrides; absent overrides use the database version registry (initially v26 and v26.0). Health reports unknown/unverified lifecycles, uses a 90-day warning, and represents Google's tentative November 2027 sunset as month precision—not an invented exact date. Meta Marketing's sunset is unknown; Graph lifecycle dates are not substitutes. This is lifecycle/configuration checking, not a live provider connectivity test. Existing Adam API paths remain unchanged.

Next: configured `AD_PROVIDER_GOOGLE`/`AD_PROVIDER_META` (direct/pipeboard/windsor), tenant overrides, Pipeboard first and capability-normalized adapters. No provider is active for Abdullah yet; no credentials are requested at step 1. Provider consent and required partner/direct OAuth secrets will be documented when the provider is implemented. PageSpeed will require a server-only Google API key in the landing-page step.

Approved later orchestration: daily Vercel Cron plus a durable external queue calling verified TanStack routes; confirm the queue service and cost before setup. Persist progress, leases, backoff and denial pauses. The Vercel project requests 300-second functions; deployed duration/memory are unverified (settings read denied). Design small resumable chunks, not work after an HTTP response. No cron or queue runner has been installed.
