// Keep each table mounted so its sorting, selection and pagination survive tab changes.
const selections=new Map();
export function enhanceTableTabs(root,key){
 const panels=[...root.querySelectorAll('section.panel')].filter(panel=>panel.querySelector('table')&&!panel.closest('[data-table-tabs]'));
 if(panels.length<2||!panels.every(panel=>panel.parentElement===panels[0].parentElement))return;
 const wrapper=document.createElement('section');wrapper.className='table-tabs';wrapper.dataset.tableTabs='true';
 const list=document.createElement('div');list.className='table-tab-list ds-tabs';list.setAttribute('role','tablist');list.setAttribute('aria-label','Table views');wrapper.append(list);
 panels[0].before(wrapper);
 const buttons=panels.map((panel,i)=>{
  const button=document.createElement('button');button.type='button';button.className='ds-tab';button.textContent=panel.querySelector('h2')?.textContent||`Table ${i+1}`;
  button.id=`table-view-tab-${i}`;button.setAttribute('role','tab');button.setAttribute('aria-controls',`table-view-panel-${i}`);
  panel.id=`table-view-panel-${i}`;panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',button.id);panel.tabIndex=0;
  list.append(button);wrapper.append(panel);return button;
 });
 function activate(index,focus=false){
  selections.set(key,index);
  buttons.forEach((button,i)=>{button.setAttribute('aria-selected',String(i===index));button.tabIndex=i===index?0:-1;panels[i].hidden=i!==index;});
  if(focus)buttons[index].focus();
 }
 buttons.forEach((button,i)=>{
  button.addEventListener('click',()=>activate(i));
  button.addEventListener('keydown',event=>{const next={ArrowRight:(i+1)%buttons.length,ArrowLeft:(i+buttons.length-1)%buttons.length,Home:0,End:buttons.length-1}[event.key];if(next!==undefined){event.preventDefault();activate(next,true);}});
 });
 activate(Math.min(selections.get(key)||0,panels.length-1));
}
