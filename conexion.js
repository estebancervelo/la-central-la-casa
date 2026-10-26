
(()=>{'use strict';
const IS_RADAR=!!document.querySelector('#feed');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','"':'&quot;',"'":'&#39;'}[c]));
const style=document.createElement('style');style.textContent=`
#lccloud{position:fixed;bottom:18px;right:18px;z-index:9000;width:min(390px,calc(100vw - 36px));max-height:85vh;overflow:auto;background:#101d37;border:1px solid #558cf7;border-radius:16px;box-shadow:0 18px 55px #000a;color:#f3f8ff;padding:15px;font:13px/1.5 system-ui}
#lccloud *{box-sizing:border-box}#lccloud input,#lccloud select{width:100%;padding:9px;margin:4px 0 9px;border-radius:8px;border:1px solid #5b6e9c;background:#0a1328;color:#fff}
#lccloud button{cursor:pointer;border:1px solid #5c84c7;background:#203d76;color:#fff;border-radius:8px;padding:9px 11px;margin:3px;font-weight:700}
#lccloud button:disabled{opacity:.5;cursor:wait}#lccloud button.lcmain{background:linear-gradient(100deg,#f34b9d,#7e53f8);border:0}
#lccloud .lcitem{border:1px solid #415779;border-radius:9px;padding:10px;margin-top:10px;background:#152543}
#lccloud small{color:#b6cbe8}#lccloud .lcstatus{color:#8fe6c9;white-space:pre-wrap}#lccloud .lcerror{color:#ffb4a7}#lccloud h3{margin:0 0 6px;font-size:17px}
#lccloud .lcrow{display:flex;justify-content:space-between;align-items:center;gap:5px}
#lccloud.lccollapsed .lcbody{display:none}
`;document.head.append(style);
const el=document.createElement('section');el.id='lccloud';el.className='lccollapsed';
el.innerHTML=`<div class="lcrow"><h3>🔗 RADAR ↔ CENTRAL</h3><button id="lctoggle" aria-label="Abrir conexión">ABRIR</button></div><div class="lcbody">
<p><small>Ideas compartidas entre tus dos páginas. La base de datos guarda la bandeja; ninguna rutina se modifica sin tu confirmación.</small></p>
<div id="lcconfig"><label>URL del proyecto Supabase<input id="lcurl" placeholder="https://xxxx.supabase.co"></label><label>Clave pública (publishable o anon)<input id="lckey" placeholder="sb_publishable_... / eyJ..."></label><button id="lcset">GUARDAR CONEXIÓN</button></div>
<div id="lcauth" hidden><label>Correo de producción<input id="lcemail" type="email" autocomplete="email" placeholder="correo@ejemplo.com"></label><label>Contraseña<input id="lcpass" type="password" autocomplete="current-password"></label><button id="lcsignup">CREAR USUARIO</button><button id="lclogin">INGRESAR</button></div>
<div id="lclogged" hidden><div class="lcrow"><small id="lcwho"></small><button id="lclogout">SALIR</button></div>
${IS_RADAR?`<label>Enviar a<select id="lcprogram"><option>VALET PARKING</option><option>QUE ALGUIEN LE AVISE</option></select></label><label>Bloque sugerido<input id="lcblock" placeholder="Ej.: COSITAS A SABER"></label><button class="lcmain" id="lcsend">📤 ENVIAR TEMA SELECCIONADO</button>`:`<button id="lcrefresh">↻ ACTUALIZAR BANDEJA</button><div id="lcinbox"></div>`}
</div><p id="lcmsg" class="lcstatus"></p></div>`;
document.body.append(el);
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
  $('lcinbox').innerHTML=data?.length?data.map(x=>`<div class="lcitem"><b>${esc(x.title)}</b><div><small>${esc(x.program)} · ${esc(x.source)} · ${new Date(x.created_at).toLocaleString('es-AR')}</small></div>${x.target_block?`<small>Bloque sugerido: ${esc(x.target_block)}</small>`:''}<div>${x.source_url?`<a href="${esc(x.source_url)}" target="_blank" rel="noopener noreferrer" style="color:#a3dfff">VER FUENTE ↗</a>`:''}</div><div>${x.status==='incorporado'?'✓ INCORPORADO':`<button data-add="${esc(x.id)}">➕ AGREGAR A RUTINA</button>`}<button data-del="${esc(x.id)}">ELIMINAR</button></div></div>`).join(''):'<p><small>Sin ideas recibidas. Enviá una desde EL RADAR.</small></p>';
  $('lcinbox').onclick=async ev=>{const add=ev.target.closest('[data-add]'),del=ev.target.closest('[data-del]');if(!add&&!del)return;const id=(add||del).dataset[add?'add':'del'];const x=data.find(i=>i.id===id);if(!x)return;
   if(add){if(!window.lacasaCentralImport){say('La rutina todavía no está preparada para importar.',true);return}
    const ok=window.lacasaCentralImport(x);if(!ok)return;
    const {error}=await client.from('radar_inbox').update({status:'incorporado'}).eq('id',id);if(error)say('Se agregó localmente, pero no se pudo marcar en la nube: '+error.message,true);else say('✓ Idea agregada a la rutina seleccionada. Guardada en este navegador.');
   }else{if(!confirm('¿Eliminar esta idea de la bandeja compartida?'))return;const {error}=await client.from('radar_inbox').delete().eq('id',id);if(error)say(error.message,true)}
   loadInbox();
  };
 }
 $('lcrefresh').onclick=loadInbox;
}
setup();
})();
