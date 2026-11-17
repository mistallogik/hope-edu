import test from 'node:test';
import assert from 'node:assert/strict';
import {parseHTML} from 'linkedom';
const {window}=parseHTML('<html><body></body></html>');
Object.assign(globalThis,{window,document:window.document});
const {enhanceTables,compareValues,csvText}=await import('../src/tables.js');
function fixture(count=23){
 document.body.innerHTML=`<div class="table-scroll"><table><thead><tr><th>Name</th><th>Amount</th><th>Actions</th></tr></thead><tbody>${Array.from({length:count},(_,i)=>`<tr><td><strong>Record ${i+1}</strong><small>ID-${i+1}</small></td><td>${count-i}</td><td><a href="#record/${i+1}">View</a></td></tr>`).join('')}</tbody></table></div>`;
 enhanceTables(document);return document.querySelector('.at-host');
}
const click=el=>el.dispatchEvent(new window.Event('click',{bubbles:true}));
const change=el=>el.dispatchEvent(new window.Event('change',{bubbles:true}));
test('table pagination handles final partial page and preserves action links',()=>{
 const host=fixture();assert.equal(host.querySelectorAll('tbody tr').length,10);
 click(host.querySelector('[aria-label="Last page"]'));
 assert.equal(host.querySelectorAll('tbody tr').length,3);
 assert.match(host.querySelector('.at-page-label').textContent,/Page 3 of 3/);
 assert.equal(host.querySelector('tbody a').getAttribute('href'),'#record/21');
 assert.ok(host.querySelector('[aria-label="Next page"]').hasAttribute('disabled'));
});
test('numeric sorting resets pagination and toggles direction',()=>{
 const host=fixture();click(host.querySelector('[aria-label="Next page"]'));
 const sort=host.querySelector('[aria-label="Sort by Amount"]');click(sort);
 assert.equal(host.querySelector('tbody tr').children[2].textContent,'1');
 assert.match(host.querySelector('.at-page-label').textContent,/Page 1/);
 assert.equal(sort.parentElement.getAttribute('aria-sort'),'ascending');click(sort);
 assert.equal(host.querySelector('tbody tr').children[2].textContent,'23');
 assert.equal(sort.parentElement.getAttribute('aria-sort'),'descending');
});
test('select all applies to visible rows and selection persists between pages',()=>{
 const host=fixture();const all=host.querySelector('thead input');all.checked=true;change(all);
 assert.match(host.querySelector('.at-selection').textContent,/10 selected/);
 click(host.querySelector('[aria-label="Next page"]'));assert.equal(all.checked,false);
 const first=host.querySelector('tbody input');first.checked=true;change(first);
 assert.equal(all.indeterminate,true);assert.match(host.querySelector('.at-selection').textContent,/11 selected/);
 click(host.querySelector('.at-clear'));assert.equal(host.querySelector('.at-selection').hidden,true);
});
test('page size and empty tables remain consistent and enhancement is idempotent',()=>{
 const host=fixture();const select=host.querySelector('select');select.querySelector('[value="25"]').setAttribute('selected','');select.querySelector('[value="10"]').removeAttribute('selected');change(select);
 assert.equal(host.querySelectorAll('tbody tr').length,23);enhanceTables(document);assert.equal(host.querySelectorAll('thead input').length,1);
 const empty=fixture(0);assert.match(empty.textContent,/0 records/);assert.ok(empty.querySelector('thead input').disabled);
});
test('printing includes every filtered row and restores pagination',()=>{
 const host=fixture();window.dispatchEvent(new window.Event('beforeprint'));assert.equal(host.querySelectorAll('tbody tr').length,23);
 window.dispatchEvent(new window.Event('afterprint'));assert.equal(host.querySelectorAll('tbody tr').length,10);
});
test('CSV exports escape commas, quotes and spreadsheet formulas',()=>{
 assert.equal(csvText(['Name'],[['=1+1'],['a,"b"']]),'"Name"\r\n"\'=1+1"\r\n"a,""b"""');
 assert.ok(compareValues('9%','83%')<0);assert.ok(compareValues('₦1,200','₦900')>0);assert.ok(compareValues('30 Jun 2027','12 Nov 2026')>0);
});
