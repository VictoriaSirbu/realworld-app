import { APIRequestContext } from "playwright/test";

export async function getCookies(context: APIRequestContext) {
  return Object.fromEntries(
    (await context.storageState()).cookies.map((cookie) => [cookie.name, cookie.value])
  );
}

export async function getCookieHeaders(
  context: APIRequestContext
): Promise<Record<string, string>> {
  const cookies = await getCookies(context);
  return {
    Cookie: Object.entries(cookies)
      .map(([key, value]) => `${key}=${value}`)
      .join("; "),
  };
}
