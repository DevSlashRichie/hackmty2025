import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildQueryString(params: Record<string, unknown>): string {
  const queryString = Object.keys(params)
    .flatMap((key) => {
      if (params[key] === undefined) return [];

      const value = params[key];
      return `${key}=${encodeURI(String(value))}`;
    })
    .join("&");

  return queryString;
}

function makeUrl(
  base: string,
  data: {
    path: string[];
    params?: Record<string, unknown>;
  },
) {
  const url = data.path.reduce(
    (acc, p) => {
      if (p === "/") {
        return acc;
      }

      if (p.startsWith("/")) return `${acc}${p}`;
      return `${acc}/${p}`;
    },
    base.endsWith("/") ? base.slice(0, -1) : base,
  );

  if (data.params) {
    let urlReplaced = url;
    Object.entries(data.params).forEach(([key, value]) => {
      urlReplaced = urlReplaced.replace(`:${key}`, String(value));
    });

    return urlReplaced;
  }

  return url;
}

export class ApiError extends Error {
  public readonly httpCode: number;

  constructor(message: string, httpCode: number) {
    super(message);
    this.httpCode = httpCode;
  }
}

export class Client {
  private readonly t: string | undefined;
  private readonly baseUrl: string;

  constructor(baseUrl: string, t?: string) {
    this.baseUrl = baseUrl;
    this.t = t;
  }

  get hasToken() {
    return typeof this.t !== "undefined" && this.t.length > 0;
  }

  prepare<T>(
    path: string,
    method: "GET" | "POST" | "PUT" | "PATCH" | "OPTIONS" | "DELETE",
    body?:
      | Record<string, unknown>
      | Record<string, unknown>[]
      | FormData
      | string,
    params?: Record<string, unknown>,
    config?: {
      removeAuth?: boolean;
      credentials?: boolean;
      route: any;
      responseType?: "json" | "blob" | "text";
    },
  ) {
    const route = makeUrl(this.baseUrl, {
      path: ["/"],
    });
    let url = makeUrl(route, { path: [path] });

    if (params) {
      url = makeUrl(url, {
        path: [],
        params,
      });
    }

    if (method === "GET" && body) {
      if (typeof body === "string") {
        url = `${url}?${body}`;
      } else {
        const params = buildQueryString(body as Record<string, unknown>);
        if (params.length > 0) url = `${url}?${params}`;
      }
    }

    // we need to load the additional headers

    let headers = {} as any;
    let bodyToPass: any = method !== "GET" ? JSON.stringify(body) : undefined;

    if (method !== "GET") {
      if (body instanceof FormData) {
        //headers["Content-Type"] = "multipart/form-data";
        bodyToPass = body;
      } else {
        headers["Content-Type"] = "application/json";
      }
    }

    if (!config?.removeAuth && this.t) {
      headers = {
        ...headers,
        Authorization: `Bearer ${this.t}`,
      };
    }

    const request = new Request(url, {
      method,
      body: bodyToPass,
      headers,
    });

    return {
      request,
      operation: {
        submit: async () => {
          return await this.submit<T>(request, config?.responseType);
        },
        route: request.url,
        request,
        map: <U>(fn: (data: T) => U) => ({
          submit: async () => {
            const data = await this.submit<T>(request, config?.responseType);
            return fn(data);
          },
          route: request.url,
          request,
        }),
      },
    };
  }

  async submit<T>(
    request: Request,
    responseType: "json" | "blob" | "text" = "json",
  ): Promise<T> {
    const response = await fetch(request);

    if (response.ok) {
      if (responseType === "blob") {
        return response.blob() as any;
      }
      if (responseType === "text") {
        return response.text() as any;
      }
      return response.json();
    } else {
      let errorMessage: string;
      try {
        const errorResult = await response.json();
        errorMessage = errorResult.message || JSON.stringify(errorResult);
      } catch (e) {
        errorMessage = await response.text();
      }
      throw new ApiError(errorMessage, response.status ?? 500);
    }
  }
}
