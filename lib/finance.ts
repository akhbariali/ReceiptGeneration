import { InputError } from './errors';
/* All authoritative money calculations use exact decimal-string arithmetic. */
export function parseFixed(input:string, scale=4):bigint {
 if(typeof input!=='string'|| !/^-?(?:0|[1-9]\d*)(?:\.\d+)?$/.test(input))throw new InputError('Invalid monetary amount');
 const negative=input.startsWith('-'); const raw=negative?input.slice(1):input;
 const [whole,fraction='']=raw.split('.');if(fraction.length>scale) throw new InputError(`Maximum ${scale} decimal places`);
 const number=BigInt(whole)*10n**BigInt(scale)+BigInt(fraction.padEnd(scale,'0')||'0');
 return negative?-number:number;
}
export function formatFixed(value:bigint,scale=4){const n=value<0n?-value:value;const power=10n**BigInt(scale);const decimal=(n%power).toString().padStart(scale,'0').replace(/0+$/,'');return (value<0n?'-':'')+(n/power).toString()+(decimal?'.'+decimal:'');}
export type LineInput={accountId:string;debit:string;credit:string};
export function checkJournal(lines:LineInput[]){
 if(lines.length<2)throw new InputError('At least two journal lines required');
 let debits=0n,credits=0n;
 for(const line of lines){const d=parseFixed(line.debit),c=parseFixed(line.credit);if(d<0n||c<0n|| (d===0n&&c===0n)|| (d>0n&&c>0n))throw new InputError('Each line must have exactly one positive side');debits+=d;credits+=c;}
 if(debits===0n||debits!==credits)throw new InputError('Journal entry is not balanced');
 return {debits:formatFixed(debits),credits:formatFixed(credits)};
}
export function allocateLandedCost(total:string,weights:string[]){const value=parseFixed(total);const sizes=weights.map(w=>parseFixed(w));if(value<0n||sizes.some(w=>w<0n))throw new InputError('Negative allocation');const sum=sizes.reduce((a,b)=>a+b,0n);if(sum===0n)throw new InputError('Allocation basis cannot be zero');let distributed=0n;return sizes.map((w,i)=>{const p=i===sizes.length-1?value-distributed:value*w/sum;distributed+=p;return formatFixed(p);});}
export function inventoryBalance(quantities:string[]){return formatFixed(quantities.reduce((a,q)=>a+parseFixed(q),0n));}
