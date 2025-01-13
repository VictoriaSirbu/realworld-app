export class TestContext {
  public static STORAGE_STATE_COOKIES = resolve(
    process.env.STORAGE_STATE_COOKIES,
    "playwright/context/state.json"
  );

  public static REGISTERED_USER = resolve(process.env.REGISTERED_USER, "{}");

  public static REGISTERED_BANK_ACCOUNT = resolve(process.env.REGISTERED_BANK_ACCOUNT, "{}");

  public static USERS = resolve(process.env.USERS, "{}");
}
function resolve(variable: string | undefined, defaultValue: string): string {
  return variable === undefined ? defaultValue : variable;
}
