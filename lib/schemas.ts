import {z} from 'zod';
const id=z.string().min(1).max(100);
const text=z.string().trim().min(1).max(250);
const optionalId=id.nullish();
const amount=z.string().regex(/^\d+(\.\d{1,4})?$/);
export const resources={
 businesses:z.object({name:text,kind:z.string().max(50).default('BUSINESS')}),
 counterparties:z.object({name:text,type:z.enum(['PERSON','ORGANIZATION']).default('ORGANIZATION'),email:z.email().optional().or(z.literal('')),phone:z.string().max(60).optional(),notes:z.string().max(5000).optional(),tags:z.array(z.string()).optional()}),
 accounts:z.object({name:text,code:z.string().min(1).max(30),type:z.enum(['ASSET','LIABILITY','EQUITY','REVENUE','EXPENSE']),currencyCode:z.enum(['IRR','USD','EUR','RUB']),businessId:optionalId,isCash:z.boolean().optional()}),
 opportunities:z.object({title:text,counterpartyId:id,businessId:optionalId,stage:z.enum(['IDENTIFIED','QUALIFIED','CONTACTED','NEEDS_ASSESSMENT','QUOTATION','NEGOTIATION','WON','LOST']).optional(),nextAction:text,ownerName:text,currencyCode:z.string().max(3).optional(),value:amount.optional(),followUpAt:z.iso.datetime().optional()}),
 projects:z.object({title:text,businessId:optionalId,description:z.string().max(5000).optional()}),
 tasks:z.object({title:text,projectId:optionalId,status:z.enum(['TODO','IN_PROGRESS','BLOCKED','DONE']).optional(),priority:z.number().int().min(1).max(4).optional(),dueAt:z.iso.datetime().optional()}),
 products:z.object({name:text,sku:z.string().min(1).max(80),unit:z.string().min(1).max(20).optional(),businessId:optionalId}),
 warehouses:z.object({name:text,businessId:optionalId}),
 orders:z.object({counterpartyId:id,businessId:optionalId,direction:z.enum(['PURCHASE','SALE']),status:z.enum(['DRAFT','CONFIRMED','CANCELLED']).optional(),total:amount,currencyCode:z.enum(['IRR','USD','EUR','RUB'])}),
 shipments:z.object({reference:text,businessId:optionalId,status:z.enum(['PLANNED','IN_TRANSIT','DELIVERED','CANCELLED']).optional(),currencyCode:z.enum(['IRR','USD','EUR','RUB']),freight:amount.optional(),customs:amount.optional(),handling:amount.optional()}),
 agents:z.object({name:text,description:z.string().max(1000).optional(),status:z.enum(['ENABLED','PAUSED','DISABLED']).optional()}),
} as const;
export type Resource=keyof typeof resources;
export function isResource(v:string):v is Resource{return Object.hasOwn(resources,v);}
