import { cookieName,sessionCookieSecure } from '@/lib/auth';
export async function POST(){const res=Response.json({ok:true});res.headers.set('Set-Cookie',`${cookieName}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${sessionCookieSecure()?'; Secure':''}`);return res;}
