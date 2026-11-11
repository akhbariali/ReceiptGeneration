import { db } from '@/lib/db';import {getUser,fail} from '@/lib/auth';
export async function GET(){try{const user=await getUser();if(!user)return Response.json({user:null,workspaces:[]});const memberships=await db.workspaceMember.findMany({where:{userId:user.id},include:{workspace:true}});return Response.json({user,workspaces:memberships.map(m=>m.workspace)});}catch(e){return fail(e);}}
