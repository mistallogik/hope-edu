import {activeUser,allUsers,demoUsers,scopedData,allowedRoute} from './access.js';
import {complete,stageName} from './domain.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const btn=(text,action,extra='',cls='comm-link')=>`<button type="button" class="${cls}" data-comm="${action}" ${extra}>${text}</button>`;
const portrait=u=>u?.avatar?`<img class="comm-avatar" src="${esc(u.avatar)}" alt="">`:`<span class="comm-avatar comm-initial">${esc(u?.name?.[0]||'?')}</span>`;
const time=at=>at?new Date(at).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}):'';
export const messageContacts=state=>demoUsers.filter(u=>u.id!==activeUser(state).id);
export function createCommunications({dialog,getState,commit,openDialog,closeDialog}){
 let selected='',composing=false,tab='All',oldest=false;
 const user=()=>activeUser(getState());
 const messages=()=> (getState().messages||[]).filter(m=>m.senderId===user().id||m.recipientId===user().id);
 const alerts=()=>scopedData(getState()).records.filter(r=>!complete(r)).sort((a,b)=>String(b.audit?.at(-1)?.at||'').localeCompare(String(a.audit?.at(-1)?.at||''))).slice(0,24);
 const prefs=()=>getState().notificationPreferences?.[user().id]||{};
 function show(html,kind,initial){
  if(initial){openDialog('');dialog.classList.add('comm-dialog',kind);dialog.setAttribute('aria-labelledby','comm-title');}
  dialog.innerHTML=html;
  if(initial)dialog.querySelector('button')?.focus();
 }
 const close=()=>'<button type="button" class="comm-close" data-action="close" aria-label="Close panel">×</button>';
 function showMessages(initial=true){
  if(initial){selected='';composing=false;}
  const list=messages(),ids=[...new Set(list.map(m=>m.senderId===user().id?m.recipientId:m.senderId))];
  ids.sort((a,b)=>String(list.filter(m=>m.senderId===b||m.recipientId===b).at(-1)?.at).localeCompare(String(list.filter(m=>m.senderId===a||m.recipientId===a).at(-1)?.at)));
  const contact=allUsers.find(u=>u.id===selected),thread=list.filter(m=>m.senderId===selected||m.recipientId===selected);
  const conversations=ids.map(id=>{const person=allUsers.find(u=>u.id===id),ms=list.filter(m=>m.senderId===id||m.recipientId===id),last=ms.at(-1);return btn(`${portrait(person)}<span class="comm-conversation-copy"><strong>${esc(person?.name||'Demo colleague')}</strong><small>${esc(person?.label)}</small><span>${esc(last.text)}</span><small>${last.synthetic?'Synthetic example':'Saved locally'}</small></span><time>${time(last.at)}</time>`,'conversation',`data-id="${esc(id)}" aria-pressed="${selected===id}"`,'comm-conversation');}).join('');
  const form=`<form id="message-form" class="comm-compose">${composing?`<label class="field">To<select name="recipient" required><option value="">Choose a colleague</option>${messageContacts(getState()).map(u=>`<option value="${u.id}">${esc(u.name)} · ${esc(u.label)}</option>`).join('')}</select></label>`:`<input type="hidden" name="recipient" value="${esc(selected)}">`}<label class="field"><span class="sr-only">Message</span><textarea name="message" required maxlength="2000" placeholder="Write a message…" rows="3"></textarea></label><div class="comm-compose-footer"><small>Local demo · no live delivery</small><button type="submit" class="ds-button ds-button-primary">Send message</button></div><p class="form-error" role="alert"></p></form>`;
  const detail=selected||composing?`<div class="comm-thread-head">${btn('Back','back','','comm-mobile-back')}${contact?portrait(contact):''}<div><h3>${composing?'New message':esc(contact?.name)}</h3><small>${composing?'Start a conversation with your team':esc(contact?.label)}</small></div></div><div class="chat-history comm-history" aria-live="polite">${thread.map(m=>`<article class="comm-bubble ${m.senderId===user().id?'outgoing':''}"><p>${esc(m.text)}</p><small>${time(m.at)} · ${m.synthetic?'synthetic example':'saved locally'}</small></article>`).join('')}</div>${form}`:`<div class="comm-empty"><img src="/public/icons/chat.svg" width="40" height="40" alt=""><h3>Conversations within HOPE EDU</h3><p>Select a conversation or start a new message.</p>${btn('New message','new','','ds-button ds-button-primary')}</div>`;
  show(`<header class="comm-header"><div><h2 id="comm-title">Messages</h2><p>Internal conversations</p></div>${btn('New message','new','','ds-button')}${close()}</header><div class="comm-message-body ${selected||composing?'has-thread':''}"><aside class="comm-conversations"><div class="comm-list-heading"><h3>Conversations</h3>${btn('Your profile','profile')}</div><div class="comm-conversation-list">${conversations||'<p class="comm-no-results">No conversations yet.</p>'}</div></aside><section class="comm-thread">${detail}</section></div>`,'messages-drawer',initial);
 }
 function showNotifications(initial=true){
  if(initial){tab='All';oldest=false;}
  const items=alerts(),p=prefs(),unread=items.filter(r=>!p[r.id]?.read&&!p[r.id]?.archived).length;
  let visible=items.filter(r=>tab==='Archived'?p[r.id]?.archived:!p[r.id]?.archived&&(tab!=='Inbox'||!p[r.id]?.read)&&(tab!=='Following'||p[r.id]?.following));
  if(oldest)visible=visible.toReversed();
  show(`<header class="comm-header"><h2 id="comm-title">Notifications</h2>${btn('Mark all as read','read-all')}${close()}</header><div class="comm-notification-tabs" role="tablist" aria-label="Notification filters">${['All','Inbox','Following','Archived'].map(t=>btn(`${t}${t==='Inbox'&&unread?`<span class="comm-count">${unread}</span>`:''}`,'tab',`role="tab" id="notification-tab-${t}" aria-controls="notification-list" aria-selected="${tab===t}" tabindex="${tab===t?0:-1}" data-tab="${t}"`)).join('')}${btn(oldest?'Oldest':'Newest','sort','aria-label="Toggle notification order"')}</div><div id="notification-list" class="comm-alert-list" role="tabpanel" aria-labelledby="notification-tab-${tab}">${visible.map(r=>`<article class="comm-alert"><span class="comm-alert-icon ${!p[r.id]?.read?'unread':''}"><img src="/public/icons/${r.module==='schools'?'settings':'document'}.svg" width="20" height="20" alt=""></span><div><h3>${esc(r.title)}</h3><p>${esc(r.id)} · ${esc(r.state)} · ${esc(stageName(r))}</p><div class="comm-alert-actions">${allowedRoute(getState(),r.module,'Record',r.id)?btn('View details','details',`data-id="${esc(r.id)}"`,'ds-button'):''}${btn(p[r.id]?.following?'Unfollow':'Follow','follow',`data-id="${esc(r.id)}"`)}${btn(p[r.id]?.archived?'Restore':'Archive','archive',`data-id="${esc(r.id)}"`)}</div></div></article>`).join('')||'<div class="comm-no-results">You’re all caught up.<p>No notifications in this view.</p></div>'}</div><div class="comm-notification-footer"><span>Updates within your assigned scope</span>${btn('Manage notifications','manage')}</div>`,'notifications-popover',initial);
 }
 async function update(id,field){const next=structuredClone(getState());next.notificationPreferences||={};next.notificationPreferences[user().id]||={};const p=next.notificationPreferences[user().id];p[id]||={};p[id][field]=!p[id][field];await commit(next);}
 dialog.addEventListener('click',async e=>{
  const a=e.target.closest('[data-comm]');if(!a)return;
  const action=a.dataset.comm;
  if(action==='close'){closeDialog();return;}
  if(action==='new'){selected='';composing=true;showMessages(false);dialog.querySelector('select')?.focus();}
  if(action==='back'){selected='';composing=false;showMessages(false);}
  if(action==='conversation'){selected=a.dataset.id;composing=false;showMessages(false);dialog.querySelector('textarea')?.focus();}
  if(action==='profile'){closeDialog();document.querySelector('[data-action=profile-toggle]')?.click();document.querySelector('[data-action=profile]')?.click();}
  if(action==='tab'){tab=a.dataset.tab;showNotifications(false);dialog.querySelector(`[data-tab="${tab}"]`)?.focus();}
  if(action==='sort'){oldest=!oldest;showNotifications(false);}
  if(action==='follow'||action==='archive'){if(!alerts().some(r=>r.id===a.dataset.id))return;await update(a.dataset.id,action==='follow'?'following':'archived');showNotifications(false);}
  if(action==='read-all'){const next=structuredClone(getState());next.notificationPreferences||={};next.notificationPreferences[user().id]||={};for(const r of alerts())next.notificationPreferences[user().id][r.id]={...prefs()[r.id],read:true};await commit(next);showNotifications(false);}
  if(action==='details'){const r=alerts().find(r=>r.id===a.dataset.id);if(r&&allowedRoute(getState(),r.module,'Record',r.id)){if(!prefs()[r.id]?.read)await update(r.id,'read');closeDialog();location.hash=`${r.module}/Record/${r.id}`;}}
  if(action==='manage'){closeDialog();location.hash=`${user().home}/Settings/general`;}
 });
 dialog.addEventListener('keydown',e=>{if(e.target.matches('.comm-notification-tabs [role=tab]')&&['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const tabs=[...dialog.querySelectorAll('[role=tab]')],i=tabs.indexOf(e.target),n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[n].click();}});
 dialog.addEventListener('click',e=>{if(e.target===dialog&&dialog.classList.contains('comm-dialog')){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();}});
 return {showMessages,showNotifications,afterSend(id){selected=id;composing=false;showMessages(false);dialog.querySelector('textarea')?.focus();}};
}
