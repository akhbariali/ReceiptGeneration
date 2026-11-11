import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { db } from './db';
import { HttpError } from './errors';
export { HttpError, fail } from './errors';
export const cookieName = 'business_os_session';
export function sessionCookieSecure() { return process.env.SESSION_COOKIE_SECURE === undefined ? process.env.NODE_ENV === 'production' : process.env.SESSION_COOKIE_SECURE !== 'false'; }
function secret() { const s=process.env.SESSION_SECRET; if(!s || s.length<32) throw new Error('SESSION_SECRET must have at least 32 characters'); return new TextEncoder().encode(s); }
export async function issueSession(userId:string) { return new SignJWT({ sub:userId }).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('7d').sign(secret()); }
export async function getUser() {
  const token=(await cookies()).get(cookieName)?.value;
  if(!token) return null;
  const key=secret();
  let userId:string|undefined;
  try { const {payload}=await jwtVerify(token,key); userId=payload.sub; } catch {return null;}
  if(!userId) return null;
  return db.user.findUnique({where:{id:userId},select:{id:true,name:true,email:true}});
}
export async function requireUser(){const user=await getUser(); if(!user) throw new HttpError(401,'Authentication required');return user;}
export async function requireWorkspace(workspaceId:string){
 const user=await requireUser();
 if(!workspaceId.trim()) throw new HttpError(400,'Select a workspace before continuing.');
 const membership=await db.workspaceMember.findUnique({where:{userId_workspaceId:{userId:user.id,workspaceId}}});
 if(!membership) throw new HttpError(403,'Workspace access denied');
 return {user,membership};
}
export async function audit(userId:string,workspaceId:string,action:string,entity:string,entityId:string){await db.auditLog.create({data:{userId,workspaceId,action,entity,entityId}});}
