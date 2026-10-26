
(()=>{'use strict';
const IS_RADAR=!!document.querySelector('#feed');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','"':'&quot;',"'":'&#39;'}[c]));
const style=document.createElement('style');style.textContent=`
#lccloud{position:fixed;bottom:18px;right:18px;z-index:9000;width:min(560px,calc(100vw - 24px));max-height:min(88vh,900px);overflow:auto;background:linear-gradient(155deg,#12254b 0%,#0b1732 60%,#13102e 100%);border:1px solid #6089e4;border-radius:24px;box-shadow:0 28px 85px #000b,0 0 35px #3566e12b;color:#f3f8ff;padding:22px;font:15px/1.55 system-ui;backdrop-filter:blur(18px)}
#lccloud *{box-sizing:border-box}#lccloud input,#lccloud select{width:100%;padding:14px;margin:7px 0 15px;border-radius:13px;border:1px solid #5b75ad;background:#08132b;color:#fff;font-size:15px}
#lccloud button{cursor:pointer;border:1px solid #5c84c7;background:#203d76;color:#fff;border-radius:12px;padding:12px 16px;margin:4px;font-weight:800;transition:transform .15s ease,filter .15s ease}
#lccloud button:disabled{opacity:.5;cursor:wait}#lccloud button.lcmain{background:linear-gradient(100deg,#f34b9d,#7e53f8);border:0}
#lccloud .lcitem{border:1px solid #4b6395;border-radius:16px;padding:18px;margin-top:14px;background:linear-gradient(125deg,#1b3055,#131e3b);box-shadow:0 8px 25px #0003}
#lccloud small{color:#b6cbe8}#lccloud .lcstatus{color:#8fe6c9;white-space:pre-wrap}#lccloud .lcerror{color:#ffb4a7}#lccloud h3{margin:0 0 6px;font-size:21px}
#lccloud .lcrow{display:flex;justify-content:space-between;align-items:center;gap:5px}
#lccloud.lccollapsed .lcbody{display:none}
#lccloud button:hover{filter:brightness(1.17);transform:translateY(-1px)}
#lccloud button:focus-visible,#lccloud input:focus-visible,#lccloud select:focus-visible{outline:2px solid #71d7ff;outline-offset:2px}
#lccloud[hidden],#lccloud [hidden]{display:none!important}
#lccloud .lcitem b{font-size:16px;line-height:1.4;display:block;margin-bottom:10px}
#lccloud .lcitem .lctags{display:flex;gap:8px;flex-wrap:wrap;margin:9px 0}
#lccloud .lctag{background:#274775;color:#d6edff;border-radius:100px;padding:3px 10px;font-size:11px;font-weight:900;letter-spacing:.04em}
#lccloud .lcitem p{color:#c9d8ee;margin:8px 0;line-height:1.55}
#lccloud .lcitem a{display:inline-block;margin:10px 0;color:#80dbff!important;font-weight:700}
#lccloud .lcitem button[data-add]{background:linear-gradient(105deg,#f34b9d,#7758ff);border:0}
#lccloud .lcitem button[data-del]{background:transparent;color:#ffc2c2;border-color:#76546a}
#lccloud .lcstatus{margin:10px 0 0}
#lccloud .lcbody>p:first-child{border-bottom:1px solid #334e79;padding-bottom:12px}
#lccloud .lcrow h3{letter-spacing:.03em}
#lccloud .lcrow button{flex-shrink:0}
#lccloud #lcinbox{max-height:55vh;overflow:auto;scrollbar-color:#4e6ca4 transparent}
#lccloud .lcitem .lcactions{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
#lccloud .lcitem .lcdate{display:block;margin-top:4px}
#lccloud .lcitem .lcpreview{border-left:2px solid #6286d8;padding-left:12px;margin:12px 0}
#lccloud .lcitem .lcpreview summary{cursor:pointer;color:#a6e6ff;font-weight:700}
#lccloud .lcitem .lcpreview pre{white-space:pre-wrap;overflow-wrap:anywhere;font:13px/1.55 system-ui;color:#dce8ff;max-height:220px;overflow:auto}
@media(max-width:600px){#lccloud{bottom:8px;right:8px;padding:15px;border-radius:17px;width:calc(100vw - 16px)}#lccloud button{padding:10px}#lccloud h3{font-size:17px}}
`;document.head.append(style);
const el=document.createElement('section');el.id='lccloud';el.className='lccollapsed';
el.innerHTML=`<div class="lcrow"><h3>✦ RADAR ↔ CENTRAL</h3><button id="lctoggle" aria-label="Abrir conexión">ABRIR</button></div><div class="lcbody">
<p><small>Bandeja de producción sincronizada · Las rutinas solo cambian cuando vos lo confirmás.</small></p>
<div id="lcconfig"><label>URL del proyecto Supabase<input id="lcurl" placeholder="https://xxxx.supabase.co"></label><label>Clave pública (publishable o anon)<input id="lckey" placeholder="sb_publishable_... / eyJ..."></label><button id="lcset">GUARDAR CONEXIÓN</button></div>
<div id="lcauth" hidden><label>Correo de producción<input id="lcemail" type="email" autocomplete="email" placeholder="correo@ejemplo.com"></label><label>Contraseña<input id="lcpass" type="password" autocomplete="current-password"></label><button id="lcsignup">CREAR USUARIO</button><button id="lclogin">INGRESAR</button></div>
<div id="lclogged" hidden><div class="lcrow"><small id="lcwho"></small><button id="lclogout">SALIR</button></div>
${IS_RADAR?`<label>Enviar a<select id="lcprogram"><option>VALET PARKING</option><option>QUE ALGUIEN LE AVISE</option></select></label><label>Bloque sugerido<input id="lcblock" placeholder="Ej.: COSITAS A SABER"></label><button class="lcmain" id="lcsend">✦ ENVIAR IDEA A LA CENTRAL</button>`:`<button id="lcrefresh">↻ ACTUALIZAR IDEAS RECIBIDAS</button><div id="lcinbox"></div>`}
</div><p id="lcmsg" class="lcstatus"></p></div>`;
document.body.append(el);
// Accesos discretos bajo el titulo de Central, sin tapar la rutina.
if(!IS_RADAR){
 const titleArea=document.querySelector('body > header > div:first-child');
 if(titleArea){
  let nav=document.getElementById('lc-header-tools');
  if(!nav){nav=document.createElement('div');nav.id='lc-header-tools';titleArea.append(nav)}
  const button=document.createElement('button');button.type='button';button.id='lc-header-connection';button.textContent='↔ CONEXIÓN RADAR';button.setAttribute('aria-expanded','false');nav.append(button);
  button.addEventListener('click',()=>{document.getElementById('lctoggle').click();button.setAttribute('aria-expanded',String(!el.classList.contains('lccollapsed')))});
 }
 const layoutStyle=document.createElement('style');layoutStyle.textContent=`
 #lc-header-tools{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:10px}
 #lc-header-tools button{position:static!important;inset:auto!important;transform:none!important;box-shadow:none!important;white-space:nowrap;font:800 11px/1.2 system-ui,Arial!important;letter-spacing:.025em!important;padding:8px 12px!important;border-radius:9px!important;min-width:0!important;width:auto!important;height:auto!important;max-width:none!important;margin:0!important;cursor:pointer}
 #lc-header-connection{background:#17324b!important;color:#bde7fa!important;border:1px solid #3b7497!important}
 #lccloud.lccollapsed{display:none!important}
 #lccloud:not(.lccollapsed){position:fixed!important;top:155px!important;bottom:auto!important;left:16px!important;right:auto!important;transform:none!important;width:min(470px,calc(100vw - 32px))!important;max-height:calc(100vh - 175px)!important;z-index:9200!important}
 @media(max-width:680px){#lccloud:not(.lccollapsed){top:100px!important;max-height:calc(100vh - 115px)!important}#lc-header-tools{margin-top:8px;gap:6px}}
 `;document.head.append(layoutStyle);
}

const $=id=>document.getElementById(id), say=(msg,bad=false)=>{$('lcmsg').textContent=msg;$('lcmsg').className=bad?'lcerror':'lcstatus'};
$('lctoggle').onclick=()=>{el.classList.toggle('lccollapsed');$('lctoggle').textContent=el.classList.contains('lccollapsed')?'ABRIR':'CERRAR'};
let client=null,user=null;
const configKey='lacasa_supabase_public_v1';
function readConfig(){try{return JSON.parse(localStorage.getItem(configKey)||'null')}catch{return null}}
function setup(){const c=readConfig();if(!c)return; $('lcurl').value=c.url;$('lckey').value=c.key;
 if(!window.supabase?.createClient){say('No se pudo cargar la biblioteca de conexión. Comprobá internet.',true);return}
 client=window.supabase.createClient(c.url,c.key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true},global:{headers:{'X-Client-Info':'la-casa-radar-central'}}});
 client.auth.onAuthStateChange((_event,session)=>{user=session?.user||null;updateAuth()});
 client.auth.getUser().then(({data,error})=>{user=data?.user||null;updateAuth();if(error&&error.name!=='AuthSessionMissingError')say(error.message,true)});
 $('lcconfig').hidden=true;$('lcauth').hidden=false;
}
function updateAuth(){$('lcauth').hidden=!!user;$('lclogged').hidden=!user;if(user){$('lcwho').textContent=user.email||'Sesión activa';say('Conectado a la bandeja privada.');if(!IS_RADAR)loadInbox()}}
$('lcset').onclick=()=>{const url=$('lcurl').value.trim().replace(/\/$/,''),key=$('lckey').value.trim();
 if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url)||!key){say('Revisá URL y clave pública de Supabase.',true);return}
 localStorage.setItem(configKey,JSON.stringify({url,key}));location.reload()};
async function auth(mode){if(!client)return;const email=$('lcemail').value.trim(),password=$('lcpass').value;if(!email||password.length<6){say('Ingresá correo y contraseña de al menos 6 caracteres.',true);return}
 const {data,error}=await (mode==='signup'?client.auth.signUp({email,password}):client.auth.signInWithPassword({email,password}));
 if(error){say(error.message,true);return}user=data?.user||null;
 say(mode==='signup'&&!data?.session?'Cuenta creada. Revisá el correo para confirmar y después ingresá.':'Sesión iniciada.');updateAuth()}
$('lcsignup').onclick=()=>auth('signup');$('lclogin').onclick=()=>auth('login');
$('lclogout').onclick=async()=>{if(client)await client.auth.signOut();user=null;updateAuth();say('Sesión cerrada.')};
if(IS_RADAR){
 $('lcsend').onclick=async()=>{
  if(!client||!user){say('Primero ingresá con tu usuario.',true);return}
  const x=window.lacasaRadarSelected?.();if(!x){say('Primero elegí una noticia, tendencia o video en EL RADAR.',true);return}
  const program=$('lcprogram').value;
  const payload={user_id:user.id,program,title:String(x.title||'').slice(0,500),description:String(x.description||'').slice(0,4000),source:String(x.source||'').slice(0,250),source_url:String(x.url||'').slice(0,1500),suggestion:String(window.lacasaRadarIdeaText?.()||'').slice(0,6000),target_block:$('lcblock').value.trim().slice(0,150)};
  const b=$('lcsend');b.disabled=true;
  try{const {error}=await client.from('radar_inbox').insert(payload);if(error)throw error;say('✓ Enviado a LA CENTRAL. Abrí su bandeja con el mismo usuario.')}catch(e){say('No se pudo enviar: '+e.message,true)}finally{b.disabled=false}
 };
}else{
 async function loadInbox(){if(!user||!client)return;
  const {data,error}=await client.from('radar_inbox').select('id,program,title,description,source,source_url,suggestion,target_block,status,created_at').order('created_at',{ascending:false}).limit(100);
  if(error){say('No se pudo leer la bandeja: '+error.message,true);return}
  const pending=(data||[]).filter(x=>x.status!=='incorporado').length;
  $('lcinbox').innerHTML=`<div style="display:flex;align-items:center;justify-content:space-between;margin:12px 0"><strong>IDEAS RECIBIDAS</strong><span class="lctag">${pending} PENDIENTES · ${(data||[]).length} TOTALES</span></div>`+(data?.length?data.map(x=>`<article class="lcitem"><div class="lctags"><span class="lctag">${esc(x.program)}</span><span class="lctag">${x.status==='incorporado'?'✓ INCORPORADA':'● PENDIENTE'}</span>${x.target_block?`<span class="lctag">${esc(x.target_block)}</span>`:''}</div><b>${esc(x.title)}</b><small class="lcdate">${esc(x.source||'Fuente no indicada')} · ${new Date(x.created_at).toLocaleString('es-AR')}</small>${x.description?`<p>${esc(x.description).slice(0,380)}${x.description.length>380?'…':''}</p>`:''}<details class="lcpreview"><summary>VER CONTEXTO Y PROPUESTA</summary><pre>${esc([x.description,x.suggestion].filter(Boolean).join('\\n\\n'))}</pre></details>${x.source_url?`<a href="${esc(x.source_url)}" target="_blank" rel="noopener noreferrer">↗ ABRIR FUENTE ORIGINAL</a>`:''}<div class="lcactions">${x.status==='incorporado'?'✓ YA INCORPORADA':`<button data-add="${esc(x.id)}">＋ INCORPORAR A RUTINA</button>`}<button data-del="${esc(x.id)}">ELIMINAR</button></div></article>`).join(''):'<p><small>No hay ideas todavía. Elegí una noticia en EL RADAR y enviala a esta bandeja.</small></p>');
  $('lcinbox').onclick=async ev=>{const add=ev.target.closest('[data-add]'),del=ev.target.closest('[data-del]');if(!add&&!del)return;const id=(add||del).dataset[add?'add':'del'];const x=data.find(i=>i.id===id);if(!x)return;
   if(add){if(!window.lacasaCentralImport){say('La rutina todavía no está preparada para importar.',true);return}
    const ok=await window.lacasaCentralImport(x);if(!ok)return;
    const {error}=await client.from('radar_inbox').update({status:'incorporado'}).eq('id',id);if(error)say('Se agregó localmente, pero no se pudo marcar en la nube: '+error.message,true);else say('✓ Idea agregada a la rutina seleccionada. Guardada en este navegador.');
   }else{if(!confirm('¿Eliminar esta idea de la bandeja compartida?'))return;const {error}=await client.from('radar_inbox').delete().eq('id',id);if(error)say(error.message,true)}
   loadInbox();
  };
 }
 $('lcrefresh').onclick=loadInbox;
}
window.lacasaBandejaBridge={getClient:()=>client,getUser:()=>user,openLogin:()=>{el.classList.remove('lccollapsed');$('lctoggle').textContent='CERRAR'},refresh:()=>{if(!IS_RADAR)loadInbox()}};
window.dispatchEvent(new Event('lacasa-bandeja-ready'));
setup();
})();
