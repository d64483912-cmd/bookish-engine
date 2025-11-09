/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENROUTER_API_KEY: string
  readonly VITE_OPENROUTER_BASE_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_ENABLE_EXPERIMENTAL_FEATURES: string
  readonly VITE_ENABLE_ADVANCED_AI: string
  readonly VITE_ENABLE_CUSTOM_AGENTS: string
  readonly VITE_DEV_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}