import { db } from '@/lib/db';
import { issueSession,cookieName,sessionCookieSecure,fail } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
export async function POST(req:Request){
 try{const {email,password}=z.object({email:z.string().trim().min(1).max(254),password:z.string().min(1)}).parse(await req.json());const user=await db.user.findUnique({where:{email:email.toLowerCase()}});if(!user||!(await bcrypt.compare(password,user.passwordHash)))return Response.json({error:'Invalid credentials'},{status:401});const token=await issueSession(user.id);const response=Response.json({ok:true});response.headers.append('Set-Cookie',`${cookieName}=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax${sessionCookieSecure()?'; Secure':''}`);return response;}catch(error){return fail(error);}
}
