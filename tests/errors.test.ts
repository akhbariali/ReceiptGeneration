import {describe,it,expect,vi,afterEach} from 'vitest';
import {Prisma} from '@prisma/client';
import {z} from 'zod';
import {fail,HttpError} from '../lib/errors';
import {parseFixed} from '../lib/finance';
import {api} from '../lib/api-client';

afterEach(()=>{vi.unstubAllGlobals();vi.restoreAllMocks();});
describe('API errors',()=>{
 it('returns field guidance for validation errors',async()=>{
  const parsed=z.object({email:z.email()}).safeParse({email:'invalid'});
  if(parsed.success)throw new Error('Expected validation error');
  const response=fail(parsed.error);expect(response.status).toBe(400);
  expect((await response.json()).issues[0].field).toBe('email');
 });
 it('keeps domain validation readable',async()=>{
  try{parseFixed('1,000');throw new Error('Expected failure');}catch(e){
   const response=fail(e);expect(response.status).toBe(400);expect((await response.json()).error).toContain('Invalid monetary amount');
  }
 });
 it('keeps unexpected server details private',async()=>{
  vi.spyOn(console,'error').mockImplementation(()=>{});
  const response=fail(new Error('sensitive connection details'));
  expect(response.status).toBe(500);expect(JSON.stringify(await response.json())).not.toContain('sensitive');
 });
 it('maps duplicate and concurrent writes to actionable conflicts',async()=>{
  for(const code of ['P2002','P2034']){
   const response=fail(new Prisma.PrismaClientKnownRequestError('internal',{code,clientVersion:'6.16.2'}));
   expect(response.status).toBe(409);expect((await response.json()).error).not.toContain('internal');
  }
 });
 it('preserves authorization errors',()=>{expect(fail(new HttpError(403,'Workspace access denied')).status).toBe(403);});
 it('handles malformed JSON',()=>{expect(fail(new SyntaxError('bad JSON')).status).toBe(400);});
});
describe('browser requests',()=>{
 it('explains network failures',async()=>{
  vi.stubGlobal('fetch',vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
  await expect(api('/api/bootstrap')).rejects.toThrow('Check your connection');
 });
 it('handles non-JSON upstream errors',async()=>{
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue(new Response('<html>Bad gateway</html>',{status:502})));
  await expect(api('/api/bootstrap')).rejects.toThrow('unreadable response');
 });
 it('explains expired sessions',async()=>{
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue(Response.json({error:'Authentication required'},{status:401})));
  await expect(api('/api/journal')).rejects.toThrow('sign in again');
 });
 it('preserves actionable API messages',async()=>{
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue(Response.json({error:'Insufficient stock. Available 2'},{status:409})));
  await expect(api('/api/inventory','POST',{})).rejects.toThrow('Insufficient stock');
 });
});
