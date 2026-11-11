export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}
export async function api(path: string, method = 'GET', body?: Record<string, unknown>) {
  let res: Response;
  try {
    res = await fetch(path, {method, headers: {'Content-Type': 'application/json'}, body: body ? JSON.stringify(body) : undefined});
  } catch {
    throw new Error('Unable to connect. Check your connection, then refresh to check whether your change was saved before trying again.');
  }
  let result;
  try { result = await res.json(); } catch {
    throw new Error('The server returned an unreadable response. Refresh to check your data before trying again.');
  }
  if (!res.ok) {
    if (res.status === 401) throw new Error(path === '/api/auth/login' ? 'The username or password is incorrect. Check your spelling and password capitalization.' : 'Your session has expired. Please sign in again.');
    throw new Error(typeof result?.error === 'string' ? result.error : 'The request failed. Please try again shortly.');
  }
  return result;
}
