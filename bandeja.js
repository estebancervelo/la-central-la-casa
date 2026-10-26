(()=>{'use strict';
const css=`
#bandeja-launch{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:9100;background:linear-gradient(110deg,#e8429e,#754bff);color:white;border:1px solid #f6a5f0;box-shadow:0 12px 40px #0009;border-radius:100px;padding:14px 25px;font-weight:900;letter-spacing:.035em;cursor:pointer;font-size:14px}
#bandeja-launch:hover{filter:brightness(1.15)}
#bandeja-screen{position:fixed;inset:0;z-index:9500;background:radial-gradient(ellipse at 70% -15%,#1c3353,#081321 58%,#070d19);color:#f2f7ff;overflow-y:auto;font:15px/1.5 system-ui,Arial}
#bandeja-screen[hidden]{display:none!important}
#bandeja-screen *{box-sizing:border-box}
#bandeja-screen .bd-wrap{max-width:1520px;margin:auto;padding:24px clamp(16px,3vw,48px) 90px}
#bandeja-screen .bd-head{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap;border-bottom:1px solid #334760;padding-bottom:20px}
#bandeja-screen .bd-kicker{color:#7be1ff;font-size:11px;letter-spacing:.2em;font-weight:900}
#bandeja-screen h1{font-size:clamp(28px,3vw,46px);letter-spacing:-.04em;margin:6px 0}
#bandeja-screen .bd-sub{color:#b5c8e0;margin:0}
#bandeja-screen button,#bandeja-screen select,#bandeja-screen input{font:inherit}
#bandeja-screen button{cursor:pointer;background:#1b3453;border:1px solid #537394;color:#fff;border-radius:12px;padding:11px 16px;font-weight:800}
#bandeja-screen button:hover{filter:brightness(1.16)}
#bandeja-screen .bd-primary{background:linear-gradient(100deg,#f144a1,#8a52f5);border:0}
#bandeja-screen .bd-actions{display:flex;gap:10px;flex-wrap:wrap}
#bandeja-screen .bd-controls{display:grid;grid-template-columns:minmax(180px,1fr) repeat(2,minmax(150px,210px)) auto;gap:10px;margin:24px 0}
#bandeja-screen input,#bandeja-screen select{background:#101f35;border:1px solid #426280;border-radius:12px;padding:13px;color:white;width:100%}
#bandeja-screen .bd-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px}
#bandeja-screen .bd-tabs button{border-radius:100px;padding:10px 19px}
#bandeja-screen .bd-tabs button.active{background:#9b3bc5;border-color:#ce68ed}
#bandeja-screen .bd-cards{display:grid;gap:13px}
#bandeja-screen .bd-card{display:grid;grid-template-columns:165px minmax(0,1fr) minmax(170px,210px);gap:20px;align-items:center;border:1px solid #2d4766;border-radius:18px;background:linear-gradient(120deg,#14243b,#0d1a2e);padding:17px;box-shadow:0 8px 30px #0003}
#bandeja-screen .bd-art{height:145px;border-radius:13px;background:linear-gradient(135deg,#263d60,#17263f);display:grid;place-items:center;overflow:hidden;font-size:44px}
#bandeja-screen .bd-art img{width:100%;height:100%;object-fit:cover}
#bandeja-screen .bd-tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
#bandeja-screen .bd-tag{border-radius:100px;background:#263b59;padding:4px 11px;font-size:11px;font-weight:900;letter-spacing:.04em}
#bandeja-screen .bd-tag.show{background:#16b9c5;color:#05202b}
#bandeja-screen .bd-title{font-size:19px;line-height:1.25;font-weight:900;margin:0 0 8px}
#bandeja-screen .bd-desc{color:#b9c9df;margin:0 0 10px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
#bandeja-screen .bd-meta{color:#8eb4d7;font-size:12px}
#bandeja-screen .bd-meta a{color:#83dcff}
#bandeja-screen .bd-side{display:flex;flex-direction:column;align-items:stretch;gap:9px}
#bandeja-screen .bd-state{color:#ffd878;background:#40351c;border-radius:100px;padding:5px 11px;text-align:center;font-size:12px;font-weight:800;align-self:flex-start}
#bandeja-screen .bd-state.done{color:#74f3c5;background:#173b34}
#bandeja-screen .bd-empty{padding:45px 25px;border:1px dashed #486a8c;border-radius:16px;text-align:center;color:#b8cde3}
#bandeja-screen .bd-preview{margin-top:12px;border-top:1px solid #34506c;padding-top:10px;white-space:pre-wrap;overflow-wrap:anywhere;color:#dce8f7}
#bandeja-screen .bd-preview summary{cursor:pointer;color:#a7e4ff;font-weight:800}
#bandeja-screen .bd-small{font-size:12px;color:#91a9c3}
@media(max-width:850px){#bandeja-screen .bd-controls{grid-template-columns:1fr 1fr}#bandeja-screen .bd-controls input{grid-column:1/-1}#bandeja-screen .bd-card{grid-template-columns:130px 1fr}#bandeja-screen .bd-side{grid-column:1/-1;flex-direction:row;flex-wrap:wrap}#bandeja-screen .bd-side button{flex:1}}
@media(max-width:560px){#bandeja-screen .bd-controls{grid-template-columns:1fr}#bandeja-screen .bd-controls input{grid-column:auto}#bandeja-screen .bd-card{grid-template-columns:1fr}#bandeja-screen .bd-art{height:170px}#bandeja-screen .bd-title{font-size:17px}#bandeja-launch{font-size:12px;white-space:nowrap;bottom:12px}}
`;
const style=document.createElement('style');style.textContent=css;document.head.append(style);
const launch=document.createElement('button');launch.id='bandeja-launch';launch.textContent='✦ BANDEJA DE IDEAS';document.body.append(launch);
const screen=document.createElement('section');screen.id='bandeja-screen';screen.hidden=true;screen.innerHTML=`<div class="bd-wrap"><div class="bd-head"><div><div class="bd-kicker">LA CASA · CENTRAL DE PRODUCCIÓN</div><h1>✦ BANDEJA DE IDEAS</h1><p class="bd-sub">Todo lo que enviaste desde EL RADAR, listo para incorporar a tus rutinas.</p></div><div class="bd-actions"><button id="bd-refresh">↻ ACTUALIZAR</button><button id="bd-close">✕ VOLVER A LA CENTRAL</button></div></div><div class="bd-controls"><input id="bd-search" placeholder="⌕ Buscar por noticia, tema o fuente..." aria-label="Buscar ideas"><select id="bd-program" aria-label="Filtrar programa"><option value="">TODOS LOS PROGRAMAS</option><option>VALET PARKING</option><option>QUE ALGUIEN LE AVISE</option></select><select id="bd-sort" aria-label="Orden"><option value="new">MÁS RECIENTES</option><option value="old">MÁS ANTIGUAS</option></select><button id="bd-clear">LIMPIAR FILTROS</button></div><div class="bd-tabs"><button data-tab="all" class="active">TODAS <span id="bd-all">0</span></button><button data-tab="pendiente">PENDIENTES <span id="bd-pending">0</span></button><button data-tab="incorporado">INCORPORADAS <span id="bd-done">0</span></button></div><p class="bd-small" id="bd-msg">Conectando con tu bandeja privada...</p><div class="bd-cards" id="bd-cards"></div></div>`;document.body.append(screen);
const $=id=>document.getElementById(id),escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let items=[],tab='all';
function msg(t){$('bd-msg').textContent=t}
function render(){let arr=items.filter(x=>(tab==='all'||x.status===tab)&&(!$('bd-program').value||x.program===$('bd-program').value));const q=$('bd-search').value.toLowerCase().trim();if(q)arr=arr.filter(x=>[x.title,x.description,x.source,x.target_block,x.suggestion].join(' ').toLowerCase().includes(q));if($('bd-sort').value==='old')arr.reverse();$('bd-all').textContent=items.length;$('bd-pending').textContent=items.filter(x=>x.status!=='incorporado').length;$('bd-done').textContent=items.filter(x=>x.status==='incorporado').length;
$('bd-cards').innerHTML=arr.length?arr.map(x=>`<article class="bd-card"><div class="bd-art" aria-label="Imagen temática">${/deporte|f[uú]tbol|mess[ií]|ferro|river|boca|tenis/i.test(x.title+' '+x.description)?'⚽':/formula|f1|carrera|auto/i.test(x.title+' '+x.description)?'🏎️':/mundo|rusia|internacional/i.test(x.title+' '+x.description)?'🌍':'📰'}</div><div><div class="bd-tags"><span class="bd-tag show">${escape(x.program)}</span>${x.target_block?`<span class="bd-tag">${escape(x.target_block)}</span>`:''}</div><h2 class="bd-title">${escape(x.title)}</h2><p class="bd-desc">${escape(x.description||'Sin descripción disponible.')}</p><div class="bd-meta">${escape(x.source||'Fuente no indicada')} · ${new Date(x.created_at).toLocaleString('es-AR')}${/^https?:\/\//i.test(x.source_url||'')?` · <a href="${escape(x.source_url)}" target="_blank" rel="noopener noreferrer">↗ NOTICIA ORIGINAL</a>`:''}</div><details class="bd-preview"><summary>VER DETALLES Y PROPUESTA</summary><p>${escape([x.description,x.suggestion].filter(Boolean).join('\n\n'))}</p></details></div><div class="bd-side"><span class="bd-state ${x.status==='incorporado'?'done':''}">${x.status==='incorporado'?'✓ INCORPORADA':'● PENDIENTE'}</span>${x.status==='incorporado'?'<span class="bd-small">Ya enviada a una rutina</span>':`<button class="bd-primary" data-add="${escape(x.id)}">＋ INCORPORAR A RUTINA</button>`}<button data-delete="${escape(x.id)}">ELIMINAR IDEA</button></div></article>`).join(''):'<div class="bd-empty">No hay ideas con estos filtros. Probá cambiar la búsqueda o enviá una noticia desde EL RADAR.</div>';}
async function load(){const bridge=window.lacasaBandejaBridge;if(!bridge?.getClient()||!bridge.getUser()){items=[];render();msg('Para ver las ideas, primero iniciá sesión en RADAR ↔ CENTRAL.');return}msg('Cargando ideas de Supabase...');const {data,error}=await bridge.getClient().from('radar_inbox').select('id,program,title,description,source,source_url,suggestion,target_block,status,created_at').order('created_at',{ascending:false}).limit(100);if(error){msg('No se pudo leer la bandeja: '+error.message);return}items=data||[];render();msg(items.length+' ideas sincronizadas · datos reales de tu cuenta');}
launch.onclick=()=>{screen.hidden=false;load()};$('bd-close').onclick=()=>screen.hidden=true;$('bd-refresh').onclick=load;$('bd-clear').onclick=()=>{$('bd-search').value='';$('bd-program').value='';$('bd-sort').value='new';tab='all';screen.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));render()};$('bd-search').oninput=render;$('bd-program').onchange=render;$('bd-sort').onchange=render;screen.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;screen.querySelectorAll('[data-tab]').forEach(v=>v.classList.toggle('active',v===b));render()});
$('bd-cards').onclick=async e=>{const add=e.target.closest('[data-add]'),del=e.target.closest('[data-delete]');if(!add&&!del)return;const id=(add||del).dataset[add?'add':'delete'],entry=items.find(x=>x.id===id),bridge=window.lacasaBandejaBridge;if(!entry||!bridge?.getClient()||!bridge.getUser())return;if(add){if(!window.lacasaCentralImport){msg('No está disponible la función de incorporar a rutina.');return}const ok=await window.lacasaCentralImport(entry);if(!ok)return;const {error}=await bridge.getClient().from('radar_inbox').update({status:'incorporado'}).eq('id',id);msg(error?'Se agregó a la rutina local, pero falló la actualización en Supabase: '+error.message:'✓ Idea incorporada a la rutina seleccionada.');if(!error){await load();bridge.refresh()}}else{if(!confirm('¿Eliminar esta idea de la bandeja compartida?'))return;const {error}=await bridge.getClient().from('radar_inbox').delete().eq('id',id);if(error){msg(error.message);return}await load();bridge.refresh()}};
})();
