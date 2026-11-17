const assets={sort:'4344a.svg',download:'d891d.svg',first:'ee9f4.svg',previous:'c8a40.svg',next:'7668a.svg',last:'627b0.svg',down:'65d76.svg'};
const img=name=>`<img src="/public/figma-table/${assets[name]}" alt="">`;
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=node=>{const copy=node.cloneNode(true);for(const child of copy.querySelectorAll('small,strong'))child.append(document.createTextNode(' '));return copy.textContent.trim().replace(/\s+/g,' ');};
const collator=new Intl.Collator('en',{numeric:true,sensitivity:'base'});
export function compareValues(a,b){
 const numeric=s=>/^[₦$€£]?\s*-?[\d,]+(?:\.\d+)?%?$/.test(s)?Number(s.replace(/[^\d.-]/g,'')):NaN;
 const na=numeric(a),nb=numeric(b);
 if(Number.isFinite(na)&&Number.isFinite(nb))return na-nb;
 if(/^\d{1,2} [A-Za-z]{3} \d{4}$/.test(a)&&/^\d{1,2} [A-Za-z]{3} \d{4}$/.test(b))return Date.parse(a)-Date.parse(b);
 return collator.compare(a,b);
}
export function csvText(headers,rows){const quote=v=>'"'+(/^[=+@-]/.test(String(v))?"'":'')+String(v).replaceAll('"','""')+'"';return [headers,...rows].map(row=>row.map(quote).join(',')).join('\r\n');}
function saveCSV(headers,rows){const url=URL.createObjectURL(new Blob([csvText(headers,rows)],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='hope-edu-selected-records.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
const tableControllers=new WeakMap();
if(typeof window!=='undefined'){
 window.addEventListener('beforeprint',()=>document.querySelectorAll('table[data-enhanced]').forEach(table=>tableControllers.get(table)?.print()));
 window.addEventListener('afterprint',()=>document.querySelectorAll('table[data-enhanced]').forEach(table=>tableControllers.get(table)?.draw()));
}
export function enhanceTables(root=document,{pageSize=10}={}){
 for(const table of root.querySelectorAll('table:not([data-enhanced])')){
  table.dataset.enhanced='true';table.classList.add('align-table');
  const head=table.querySelector('thead tr'),body=table.querySelector('tbody');if(!head||!body)continue;
  const headers=[...head.children].map(th=>text(th)||'Actions');
  const rows=[...body.children].filter(row=>!row.querySelector('[colspan]')).map((node,index)=>({node,index,values:[...node.children].map(text)}));
  const selected=new Set(),actionColumns=new Set();let page=1,size=[10,25,50].includes(Number(pageSize))?Number(pageSize):10,sort=-1,direction=1;
  const host=document.createElement('section');host.className='at-host';host.setAttribute('aria-label',root.closest?.('dialog')?'Report table':'Data table');
  const scroller=table.parentElement;
  scroller.before(host);host.append(scroller);scroller.classList.add('at-scroll');scroller.setAttribute('tabindex','0');scroller.setAttribute('aria-label','Scrollable data table');
  const bar=document.createElement('div');bar.className='at-selection';bar.hidden=true;host.prepend(bar);
  const footer=document.createElement('div');footer.className='at-footer';host.append(footer);
  const label=document.createElement('div');label.className='at-live sr-only';label.setAttribute('aria-live','polite');host.append(label);
  const selectHead=document.createElement('th');selectHead.className='at-check-cell';selectHead.scope='col';selectHead.innerHTML='<input class="at-checkbox" type="checkbox" aria-label="Select all rows on this page">';head.prepend(selectHead);
  const all=selectHead.querySelector('input');
  [...head.children].slice(1).forEach((th,i)=>{
   th.scope='col';th.classList.add(i===0?'at-primary-heading':'at-heading');
   if(headers[i]==='Actions'||rows.length&&rows.every(r=>r.node.children[i]?.querySelector('button,a')&&!r.node.children[i]?.querySelector('strong,small')&&i===headers.length-1)){
    actionColumns.add(i);th.textContent=headers[i]==='Actions'?'Actions':headers[i];th.classList.add('at-action-heading');return;
   }
   th.setAttribute('aria-sort','none');th.innerHTML=`<button type="button" class="at-sort" aria-label="Sort by ${escape(headers[i])}">${escape(headers[i])}${img('sort')}</button>`;
   th.querySelector('button').addEventListener('click',()=>{direction=sort===i?-direction:1;sort=i;page=1;rows.sort((a,b)=>direction*compareValues(a.values[i],b.values[i])||a.index-b.index);draw();});
  });
  rows.forEach(row=>{
   const cells=[...row.node.children];
   const td=document.createElement('td');td.className='at-check-cell';td.innerHTML=`<input class="at-checkbox" type="checkbox" aria-label="Select ${escape(row.values[0])}">`;row.node.prepend(td);
   td.querySelector('input').addEventListener('change',e=>{e.target.checked?selected.add(row.index):selected.delete(row.index);selection();});
   cells[0]?.classList.add('at-primary-cell');
   if(headers[0]==='Document'&&cells[0]){
    const format=(row.values[0].split('.').at(-1)||'FILE').toUpperCase();
    const icon=document.createElement('span');icon.className='at-file-icon';icon.setAttribute('aria-hidden','true');
    icon.innerHTML=`<img class="file-body" src="/public/figma-table/823e3.svg" alt=""><img class="file-fold" src="/public/figma-table/0e159.svg" alt=""><b>${escape(['PDF','TXT','PNG','JPG','CSV'].includes(format)?format:'FILE')}</b>`;
    const wrapper=document.createElement('div');wrapper.className='at-file';
    const name=document.createElement('span');while(cells[0].firstChild)name.append(cells[0].firstChild);wrapper.append(icon,name);cells[0].append(wrapper);
   }
   const last=cells.at(-1);if(last&&last.querySelector('a,button')){last.classList.add('at-actions');for(const a of last.querySelectorAll('a,button'))a.classList.add('at-row-action');}
  });
  function visible(){return rows.slice((page-1)*size,page*size);}
  function selection(){
   const current=visible();all.checked=current.length>0&&current.every(r=>selected.has(r.index));all.indeterminate=current.some(r=>selected.has(r.index))&&!all.checked;all.disabled=!rows.length;
   for(const r of rows){r.node.querySelector('input').checked=selected.has(r.index);r.node.classList.toggle('at-selected',selected.has(r.index));}
   bar.hidden=!selected.size;bar.innerHTML=`<span>${selected.size} selected</span><button type="button" class="at-export">${img('download')}Export selected CSV</button><button type="button" class="at-clear">Clear selection</button>`;
   bar.querySelector('.at-export').onclick=()=>saveCSV(headers.filter((_,i)=>!actionColumns.has(i)),rows.filter(r=>selected.has(r.index)).map(r=>r.values.filter((_,i)=>!actionColumns.has(i))));
   bar.querySelector('.at-clear').onclick=()=>{selected.clear();selection();};
  }
  all.addEventListener('change',()=>{for(const r of visible())all.checked?selected.add(r.index):selected.delete(r.index);selection();});
  function draw(){
   const total=Math.max(1,Math.ceil(rows.length/size));page=Math.min(page,total);
   body.replaceChildren();if(rows.length)for(const r of visible())body.append(r.node);else {const tr=document.createElement('tr');tr.innerHTML=`<td colspan="${headers.length+1}" class="empty">No records match these filters.</td>`;body.append(tr);}
   [...head.children].slice(1).forEach((th,i)=>{if(th.hasAttribute('aria-sort'))th.setAttribute('aria-sort',sort===i?(direction===1?'ascending':'descending'):'none');});
   const nav=(kind,target,disabled)=>`<button type="button" class="at-page-icon" data-page="${target}" aria-label="${kind[0].toUpperCase()+kind.slice(1)} page" ${disabled?'disabled':''}>${img(kind)}</button>`;
   const pages=[...new Set([1,...Array.from({length:5},(_,i)=>page-2+i).filter(p=>p>0&&p<=total),total])].sort((a,b)=>a-b);
   footer.innerHTML=`<span class="at-page-label">${rows.length?`Page ${page} of ${total}`:'0 records'}</span><nav aria-label="Table pagination">${nav('first',1,page===1)}${nav('previous',page-1,page===1)}${pages.map((p,i)=>`${i&&p-pages[i-1]>1?'<span class="at-ellipsis">…</span>':''}<button type="button" class="at-page ${p===page?'current':''}" data-page="${p}" ${p===page?'aria-current="page"':''} aria-label="Page ${p}">${p}</button>`).join('')}${nav('next',page+1,page===total)}${nav('last',total,page===total)}</nav><label class="at-size"><span class="sr-only">Rows per page</span><select aria-label="Rows per page">${[10,25,50].map(n=>`<option value="${n}" ${n===size?'selected':''}>${n} / page</option>`).join('')}</select>${img('down')}</label>`;
   footer.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>{page=Number(b.dataset.page);draw();footer.querySelector(`[data-page="${page}"].at-page`)?.focus();});
   footer.querySelector('select').onchange=e=>{size=Number(e.target.value);page=1;draw();footer.querySelector('select').focus();};
   label.textContent=`${rows.length} records. Page ${page} of ${total}.`;selection();
  }
  tableControllers.set(table,{draw,print:()=>{if(rows.length)body.replaceChildren(...rows.map(r=>r.node));}});
  draw();
 }
}
