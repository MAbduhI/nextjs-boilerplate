/**
 * Standard HTTP Client untuk Frontend & Kubb Generated Code
 *
 * Mengarahkan seluruh request browser ke endpoint reverse proxy Next.js (`/api/v1/…`),
 * sehingga di Network tab browser terlihat seperti memanggil origin lokal tanpa CORS.
 *
 * Pada sisi server (SSR / Server Component / Node), URL otomatis mengarah langsung
 * ke endpoint backend (`API_BACKEND_URL`) untuk memangkas latency.
 */

const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";

export function getApiBaseUrl(): string {
  if (isBrowser) {
    // Browser selalu menggunakan same-origin relatif untuk memanfaatkan reverse-proxy
    return "";
  }
  return (process.env.API_BACKEND_URL ?? "http://localhost:8080").replace(/\/+$/, "");
}

export interface RequestConfig<TVariables = unknown> extends RequestInit {
  params?: Record<string, any>;
  data?: TVariables | FormData | any;
}

export type ResponseErrorConfig<TError = unknown> = Error & {
  data?: TError;
  status?: number;
};

export type ResponseConfig<TData = unknown> = {
  data: TData;
  status: number;
  statusText: string;
  headers: Headers;
};

export default async function customClient<
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
>(
  config: RequestConfig<TVariables> & { url: string; data?: TVariables | FormData | any }
): Promise<ResponseConfig<TData>> {
  const { url, params, data, headers, ...rest } = config;

  const base = getApiBaseUrl();
  let fullUrl = `${base}${url}`;

  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    }
    const queryString = searchParams.toString();
    if (queryString) {
      fullUrl += (fullUrl.includes("?") ? "&" : "?") + queryString;
    }
  }

  const reqHeaders = new Headers(headers);
  if (!reqHeaders.has("Content-Type") && data && typeof data === "object") {
    reqHeaders.set("Content-Type", "application/json");
  }

  const res = await fetch(fullUrl, {
    ...rest,
    headers: reqHeaders,
    body: data && typeof data === "object" ? JSON.stringify(data) : (data as any),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    const error = new Error(
      errorBody.message || errorBody.error || `HTTP error ${res.status}`
    ) as ResponseErrorConfig<TError>;
    error.status = res.status;
    error.data = errorBody as TError;
    throw error;
  }

  let responseData: any;
  const contentType = res.headers.get("Content-Type") || "";
  if (contentType.includes("application/json")) {
    responseData = (await res.json()) as TData;
  } else {
    responseData = (await res.text()) as unknown as TData;
  }

  return {
    data: responseData,
    status: res.status,
    statusText: res.statusText,
    headers: res.headers,
  };
}
