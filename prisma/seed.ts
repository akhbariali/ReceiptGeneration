import {PrismaClient} from '@prisma/client';import bcrypt from 'bcryptjs';
const db=new PrismaClient();
async function main(){const email=process.env.ADMIN_EMAIL?.trim().toLowerCase(),password=process.env.ADMIN_PASSWORD;if(!email||!password||password.length<12)throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) in .env');
 for(const [code,precision] of [['IRR',0],['USD',2],['EUR',2],['RUB',2]] as const)await db.currency.upsert({where:{code},create:{code,precision},update:{precision}});
 const user=await db.user.upsert({where:{email},create:{email,name:'Workspace owner',passwordHash:await bcrypt.hash(password,12)},update:{}});
 const membership=await db.workspaceMember.findFirst({where:{userId:user.id}});
 if(!membership){const w=await db.workspace.create({data:{name:'My Business OS'}});await db.workspaceMember.create({data:{userId:user.id,workspaceId:w.id,role:'OWNER'}});console.log('Workspace created:',w.id);}console.log('Admin ready:',email);
}
main().catch(e=>{console.error(e.message);process.exitCode=1}).finally(()=>db.$disconnect());
