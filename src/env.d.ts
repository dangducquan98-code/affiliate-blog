/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module '*?raw' {
  const content: string;
  export default content;
}

interface ImportMetaEnv {
  readonly SITE_URL?: string;
  readonly SUPABASE_URL?: string;
  readonly SUPABASE_ANON_KEY?: string;
  readonly SUPABASE_SERVICE_ROLE_KEY?: string;
  readonly ADMIN_PASSWORD?: string;
  readonly ADMIN_SESSION_SECRET?: string;
  readonly AFFILIATE_CU_SAC_20W?: string;
  readonly AFFILIATE_UGREEN_HUB_UNO?: string;
  readonly AFFILIATE_TAI_NGHE_BT_300K?: string;
  readonly AFFILIATE_GAY_SELFIE_MINI?: string;
  readonly AFFILIATE_CAP_SILICON_IPHONE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
