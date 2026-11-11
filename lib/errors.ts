import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export class InputError extends Error {}

export function fail(error: unknown) {
  if (error instanceof HttpError) return Response.json({error: error.message}, {status: error.status});
  if (error instanceof ZodError) {
    const issues = error.issues.map(issue => ({field: issue.path.join('.'), message: issue.code === 'invalid_type' ? 'This field is required and must use the expected type.' : issue.message}));
    const detail = issues.map(issue => `${issue.field.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/Id\b/g, 'ID') || 'Input'}: ${issue.message}`).join('; ');
    return Response.json({error: `Please check your input. ${detail}`, issues}, {status: 400});
  }
  if (error instanceof InputError) return Response.json({error: error.message}, {status: 400});
  if (error instanceof SyntaxError) return Response.json({error: 'The request could not be read. Please check your input and try again.'}, {status: 400});
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const messages: Record<string, [number, string]> = {
      P2002: [409, 'A record with these unique details already exists. Use a different code, name, or SKU.'],
      P2003: [400, 'A linked record is missing or still in use. Check the full record ID in this workspace.'],
      P2025: [404, 'This record no longer exists. Refresh the list before continuing.'],
      P2034: [409, 'Another update happened at the same time. Refresh the data before trying again.'],
      P2024: [503, 'The service is busy. Please try again shortly.'],
    };
    const match = messages[error.code];
    if (match) return Response.json({error: match[1]}, {status: match[0]});
  }
  console.error('Request failed:', error);
  return Response.json({error: 'Something went wrong on the server. Refresh to check whether your change was saved before trying again.'}, {status: 500});
}
