import {describe,it,expect} from 'vitest';import {parseFixed,formatFixed,checkJournal,allocateLandedCost,inventoryBalance} from '../lib/finance';
describe('exact money and journal invariants',()=>{
 it('keeps decimal precision without floats',()=>{expect(formatFixed(parseFixed('0.1')+parseFixed('0.2'))).toBe('0.3');});
 it('rejects excess precision',()=>expect(()=>parseFixed('0.00001')).toThrow());
 it('accepts balanced entry',()=>expect(checkJournal([{accountId:'a',debit:'120.25',credit:'0'},{accountId:'b',debit:'0',credit:'120.25'}]).debits).toBe('120.25'));
 it('rejects unbalanced entry',()=>expect(()=>checkJournal([{accountId:'a',debit:'10',credit:'0'},{accountId:'b',debit:'0',credit:'9'}])).toThrow(/not balanced/));
 it('rejects double-sided lines',()=>expect(()=>checkJournal([{accountId:'a',debit:'5',credit:'5'},{accountId:'b',debit:'0',credit:'0'}])).toThrow());
 it('allocates total exactly despite rounding',()=>expect(allocateLandedCost('10',['1','1','1']).reduce((a,b)=>a+parseFixed(b),0n)).toBe(parseFixed('10')));
 it('computes inventory balance',()=>expect(inventoryBalance(['10','-2.5','1'])).toBe('8.5'));
});
