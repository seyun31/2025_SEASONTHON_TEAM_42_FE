// Lightweight, dependency-free SentryNetworkError implementation.
// We avoid importing axios types here to keep this file usable even if axios types
// are not installed. The constructor accepts the axios error-like object and
// extracts the fields we need to generate a descriptive name.

type AxiosLikeError = {
  message?: string;
  config?: { baseURL?: string; url?: string } | Record<string, unknown>;
  response?: { status?: number } | unknown;
  code?: string | number | null;
  request?: unknown;
  isAxiosError?: boolean;
};

export class SentryNetworkError extends Error {
  name: string;
  config?: { baseURL?: string; url?: string } | Record<string, unknown>;
  code?: string | number | null;
  request?: unknown;
  response?: { status?: number } | unknown;
  isAxiosError?: boolean;

  private static generateName(error: AxiosLikeError): string {
    const status =
      (error.response && (error.response as { status?: number }).status) ||
      'Unknown';
    const baseURL =
      (error.config && (error.config as { baseURL?: string }).baseURL) || '';
    const url = (error.config && (error.config as { url?: string }).url) || '';
    const path = String(url).split('?')[0];
    const replacePathParams = path.replace(/\/\d+(?=\/|$)/g, '/{id}');

    return `[${status} Error] - ${baseURL}${replacePathParams}`;
  }

  constructor(error: AxiosLikeError) {
    super(error.message || 'Network Error');
    this.name = SentryNetworkError.generateName(error);

    this.config = error.config;
    this.code = error.code ?? null;
    this.request = error.request;
    this.response = error.response;
    this.isAxiosError = error.isAxiosError ?? false;

    Object.setPrototypeOf(this, SentryNetworkError.prototype);
  }
}

export default SentryNetworkError;
