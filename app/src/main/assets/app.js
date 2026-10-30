/* FIK Fire TV v1.1 / uses only installed apps in native mode / offline */
(function(){'use strict';
const $=id=>document.getElementById(id);
const bridge=window.FIKNative&&typeof window.FIKNative.getApps==='function'?window.FIKNative:null;
const sample=[
  {name:'Netflix',pkg:'preview.netflix'}, {name:'YouTube',pkg:'preview.youtube'},
  {name:'Prime Video',pkg:'preview.prime'}, {name:'Disney+',pkg:'preview.disney'},
  {name:'Hulu',pkg:'preview.hulu'}, {name:'Max',pkg:'preview.max'},
  {name:'Spotify',pkg:'preview.spotify'}, {name:'Plex',pkg:'preview.plex'}
];
const read=(k,v)=>{try{let t=JSON.parse(localStorage.getItem(k));return t===null?v:t}catch{return v}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
const state={view:'home',ambient:false,modal:false,theme:read('fik-theme','night'),apps:[],pinned:read('fik-pinned',null),lastFocus:null,toastId:null,libraryRendered:false,iconQueue:[],iconPending:false};
const themes=[['night','Night'],['dusk','Dusk'],['mono','Monochrome'],['cobalt','Cobalt']];
const lower=s=>String(s||'').toLowerCase();
const iconFor=(a)=>{const n=lower(a.name+' '+a.pkg);if(n.includes('netflix'))return['N','#d82026'];if(n.includes('youtube'))return['▶','#df262c'];if(n.includes('prime'))return['p','#1178b3'];if(n.includes('disney'))return['D+','#142759'];if(n.includes('hulu'))return['h','#236e46'];if(n.includes('max'))return['m','#554399'];if(n.includes('spotify'))return['≋','#19744c'];if(n.includes('plex'))return['›','#bb8d38'];if(n.includes('twitch'))return['t','#7252a3'];return[a.name.slice(0,2).toUpperCase(),'#334254']};
function timeTick(){const d=new Date();const t=d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}).replace(/\s?(AM|PM)/,'');const date=d.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}).toUpperCase();$('topDate').textContent=date;$('topTime').textContent=t;$('ambientTime').textContent=t;$('ambientDate').textContent=date;$('heroGreeting').textContent=(d.getHours()<12?'Good morning.':d.getHours()<17?'Good afternoon.':'Good evening.')}
function toast(m){const el=$('toast');el.textContent=m;el.classList.remove('hidden');clearTimeout(state.toastId);state.toastId=setTimeout(()=>el.classList.add('hidden'),3500)}
function getApps(){if(!bridge)return sample;try{const a=JSON.parse(bridge.getApps());if(!Array.isArray(a))throw Error('bad app data');return a.filter(x=>x&&typeof x.name==='string'&&typeof x.pkg==='string'&&x.pkg!=='com.fik.tv').sort((a,b)=>a.name.localeCompare(b.name))}catch{toast('Unable to read installed apps');return []}}
function pins(){if(state.pinned===null){const preferred=['netflix','youtube','prime','disney','hulu','max','spotify','plex'];const selected=[];for(const term of preferred){const app=state.apps.find(a=>lower(a.name+' '+a.pkg).includes(term));if(app&&!selected.includes(app))selected.push(app)}selected.push(...state.apps.filter(x=>!selected.includes(x)));state.pinned=selected.slice(0,8).map(x=>x.pkg);save('fik-pinned',state.pinned)}return state.pinned.map(pkg=>state.apps.find(x=>x.pkg===pkg)).filter(Boolean).slice(0,8)}
function lazyIcon(app,span){
 if(!bridge || typeof bridge.getIcon!=='function')return;
 state.iconQueue.push({app,span});
 if(state.iconPending)return;
 state.iconPending=true;
 function batch(){
   const job=state.iconQueue.shift();
   if(job && job.span.isConnected){
     try{
       const src=bridge.getIcon(job.app.pkg);
       if(src && /^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(src)){
         const img=document.createElement('img');img.alt='';img.decoding='async';img.src=src;
         job.span.replaceChildren(img);
         if($('spotlightMark') && state.spotlightPkg===job.app.pkg)showSpotlight(job.app,src);
       }
     }catch{} // default initials remain visible if icon loading fails
   }
   if(state.iconQueue.length)setTimeout(batch,22);
   else state.iconPending=false;
 }
 setTimeout(batch,36);
}
function makeTile(app){
 const btn=document.createElement('button');btn.type='button';btn.className='app-tile focusable';btn.setAttribute('aria-label','Launch '+app.name);btn.dataset.pkg=app.pkg;
 let [initial,bg]=iconFor(app);let icon=document.createElement('span');icon.className='app-icon';icon.style.setProperty('--app-brand',bg);icon.textContent=initial;
 const label=document.createElement('span');label.className='app-label';label.textContent=app.name;btn.append(icon,label);
 btn.addEventListener('click',()=>launch(app));lazyIcon(app,icon);
 return btn;
}
function renderLibrary(){
 if(state.libraryRendered)return;
 state.libraryRendered=true;
 const all=$('allApps');const fragment=document.createDocumentFragment();
 for(const app of state.apps)fragment.append(makeTile(app));all.replaceChildren(fragment);
}
function render(){
 let home=$('pinnedApps');home.replaceChildren();
 for(const app of pins())home.append(makeTile(app));
 if(!home.children.length){let b=document.createElement('button');b.className='app-tile focusable is-empty';b.textContent='Browse installed apps ↗';b.dataset.action='apps';home.append(b)}
 state.iconQueue=state.iconQueue.filter(x=>x.span.isConnected);
 state.libraryRendered=false;
 $('allApps').replaceChildren();
 if(state.view==='apps')renderLibrary();
 $('appCount').textContent=state.apps.length+' APPS';
 $('appsNote').textContent=bridge?'Apps are discovered locally on your television.':'PREVIEW ONLY — SAMPLE APPS. Native FIK launches applications actually installed on your television.';
 $('nativeMode').textContent=bridge?'LOCAL · INSTALLED APPS':'BROWSER PREVIEW · SAMPLE APPS';
}
function showSpotlight(app,iconSrc){
 if(!app)return;
 state.spotlightPkg=app.pkg;
 $('heroGreeting').textContent=app.name;
 $('heroSubtitle').textContent=bridge?'Press OK to open on this TV':'Preview · native app launch after installation';
 $('spotlightName').textContent=app.name;
 const mark=$('spotlightMark');const [letter,color]=iconFor(app);
 mark.style.setProperty('--app-brand',color);
 const src=iconSrc||document.querySelector('.app-tile[data-pkg="'+CSS.escape(app.pkg)+'"] .app-icon img')?.src;
 if(src){const img=document.createElement('img');img.alt='';img.src=src;img.decoding='async';mark.replaceChildren(img)} else mark.textContent=letter;
}
function launch(app){if(!bridge){toast('Preview mode — install the Android APK to launch TV apps.');return}try{if(!bridge.launchPackage(app.pkg))toast('This app could not be launched: '+app.name)}catch{toast('Unable to open '+app.name)}}
function focus(el){if(!el)return;document.querySelectorAll('.focused').forEach(x=>x.classList.remove('focused'));el.focus({preventScroll:true});el.classList.add('focused');if(el.dataset.pkg){const app=state.apps.find(a=>a.pkg===el.dataset.pkg);if(app)showSpotlight(app)}el.scrollIntoView?.({block:'nearest',inline:'nearest',behavior:'auto'})}
function candidates(){const root=state.modal?$('modalShade'):$('interface');return[...root.querySelectorAll('.focusable')].filter(el=>{const rect=el.getBoundingClientRect();return rect.width>0&&rect.height>0&&getComputedStyle(el).visibility!=='hidden'})}
function first(){const items=candidates();let el=state.view==='apps'?items.find(x=>x.classList.contains('library-grid')||x.closest('.library-grid')):items.find(x=>x.closest('#pinnedApps'));focus(el||items[0])}
function move(dir){const items=candidates();if(!items.length)return;let cur=document.activeElement;if(!items.includes(cur)){focus(items[0]);return}const a=cur.getBoundingClientRect(),ax=a.x+a.width/2,ay=a.y+a.height/2;let best=null,score=1e15;for(const el of items){if(el===cur)continue;const b=el.getBoundingClientRect(),dx=b.x+b.width/2-ax,dy=b.y+b.height/2-ay;let f=dir==='left'?-dx:dir==='right'?dx:dir==='up'?-dy:dy;if(f<3)continue;const side=dir==='left'||dir==='right'?Math.abs(dy):Math.abs(dx);let sc=f+side*2.4+(side>f*1.5?200:0);if(sc<score){best=el;score=sc}}if(best)focus(best)}
function view(name){if(state.modal)close();if(state.ambient)ambient(false);state.view=name;if(name==='apps')renderLibrary();$('homeView').classList.toggle('hidden',name!=='home');$('appsView').classList.toggle('hidden',name!=='apps');document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('selected',x.dataset.action===name));first()}
function ambient(on){state.ambient=on;$('ambientView').classList.toggle('hidden',!on);$('ambientView').setAttribute('aria-hidden',String(!on));$('interface').setAttribute('aria-hidden',String(on));if(on)document.activeElement?.blur();else first()}
function prefs(){state.modal=true;state.lastFocus=document.activeElement;$('modalShade').classList.remove('hidden');$('modalShade').setAttribute('aria-hidden','false');renderThemes();renderPinChoices();focus($('modalShade').querySelector('.close-control'))}
function close(){state.modal=false;$('modalShade').classList.add('hidden');$('modalShade').setAttribute('aria-hidden','true');if(state.lastFocus&&document.contains(state.lastFocus))focus(state.lastFocus);else first()}
function renderThemes(){const root=$('themes');root.replaceChildren();for(const [id,label]of themes){const btn=document.createElement('button');btn.className='theme-card focusable'+(state.theme===id?' active':'');btn.setAttribute('aria-pressed',state.theme===id?'true':'false');const prev=document.createElement('span');prev.className='theme-preview '+id;btn.append(prev,document.createTextNode(label));btn.addEventListener('click',()=>{state.theme=id;document.body.dataset.theme=id;save('fik-theme',id);renderThemes();focus(root.querySelector('.active'))});root.append(btn)}}
function renderPinChoices(){const root=$('pinApps');if(!root)return;root.replaceChildren();for(const app of state.apps){const isPinned=state.pinned?.includes(app.pkg);const btn=document.createElement('button');btn.className='pin-choice focusable';btn.setAttribute('aria-pressed',String(isPinned));const label=document.createElement('span');label.textContent=app.name;const mark=document.createElement('b');mark.textContent=isPinned?'✓':'+';btn.append(label,mark);btn.addEventListener('click',()=>{let i=state.pinned.indexOf(app.pkg);if(i>=0)state.pinned.splice(i,1);else if(state.pinned.length<8)state.pinned.push(app.pkg);else{toast('Choose up to eight favorites');return}save('fik-pinned',state.pinned);render();renderPinChoices();focus([...root.querySelectorAll('button')].find(x=>x.querySelector('span')?.textContent===app.name))});root.append(btn)}}
function activateAction(action){if(action==='home'||action==='apps')view(action);if(action==='ambient')ambient(true);if(action==='prefs')prefs();if(action==='close')close();if(action==='system'){if(bridge&&typeof bridge.exitToSystem==='function')bridge.exitToSystem();else toast('System Home is available in the Android version.');}}
document.addEventListener('click',e=>{const btn=e.target.closest?.('[data-action]');if(btn)activateAction(btn.dataset.action)});
function key(k){if(state.ambient){if(k==='back'||k==='enter')ambient(false);return true}if(k==='back'){if(state.modal)close();else if(state.view!=='home')view('home');else {if(bridge&&typeof bridge.exitToSystem==='function')bridge.exitToSystem();else toast('Browser preview: Back would return to Fire TV Home.')}return true}if(k==='enter'){const cur=document.activeElement;if(candidates().includes(cur))cur.click();else first();return true}if(['left','right','up','down'].includes(k)){move(k);return true}return false}
window.onTVKey=key;
document.addEventListener('keydown',e=>{const m={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down',Enter:'enter',' ':'enter',Escape:'back',Backspace:'back'};if(m[e.key]){if(key(m[e.key]))e.preventDefault()}});
window.addEventListener('load',()=>{document.body.dataset.theme=state.theme;timeTick();setInterval(timeTick,60000);state.apps=getApps();render();showSpotlight(pins()[0]);requestAnimationFrame(first)})
})();
