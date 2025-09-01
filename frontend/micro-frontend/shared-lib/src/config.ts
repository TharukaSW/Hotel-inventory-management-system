// Shared configuration constants
// Expect VITE_API_BASE_URL to be defined (e.g. https://api.example.com/api)
// Optionally a host page can inject window.__API_BASE_URL__ before bundles execute.
// We deliberately avoid hardcoded localhost fallbacks to force explicit configuration in each environment.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const runtime = (typeof window !== 'undefined' && (window as any).__API_BASE_URL__) as string | undefined;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const envVar = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;

const raw = (envVar || runtime || '').trim();

if (!raw) {
  // Surface a clear error early in development / deployment.
  // Using console.error instead of throw to avoid breaking unit tests that might stub fetch.
  // Apps should verify API_BASE_URL before making requests.
  // You can set VITE_API_BASE_URL in a .env file at the project root.
  // Example: VITE_API_BASE_URL=http://localhost:8082/api
  // eslint-disable-next-line no-console
  console.error('[config] Missing VITE_API_BASE_URL (and window.__API_BASE_URL__). Configure it to point to your backend /api root.');
}

export const API_BASE_URL = raw.replace(/\/$/, '');
