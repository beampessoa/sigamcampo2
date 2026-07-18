/* ==========================================================================
   SIGMA PLANEJAMENTO — motor compartilhado (config + Supabase + render)
   Configure UMA vez abaixo. Sem anon key => modo demonstração.
   ========================================================================== */
const CONFIG = {
  SUPABASE_URL:      (typeof window!=="undefined" && window.SUPA_URL) || "https://kiwiykgzogcxiseynzyy.supabase.co",
  SUPABASE_ANON_KEY: (typeof window!=="undefined" && window.SUPA_KEY) || "COLE_SUA_ANON_KEY_AQUI",  // vem do supabase-config.js
  UNIDADE:"U-2700 · U-3500 · U-3400", REFINARIA:"REFINARIA DUQUE DE CAXIAS",
  LOGO_GCB_URL:"", FOTO_URL:"", QR_URL:"https://campo.sigmacode.com.br",
  DIA_INICIO:6, DIA_FIM:29,      // faixa de dias da matriz/curva (dia do mês)
  STALE_HORAS:3,                 // sem atualização há + de X h => avisa "dado desatualizado"
  TEMA:"claro",
};
const DEMO = CONFIG.SUPABASE_ANON_KEY.includes("COLE_");
const sb = DEMO ? null : supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

/* ---------- dados de demonstração (só quando não há anon key) ---------- */
const DEMO_DATA = {
  config:{ unidade:"U-2700 · U-3500 · U-3400", refinaria:"REFINARIA DUQUE DE CAXIAS", ultima_atualizacao:"01/06/2024 16:16:55",
    parada_inicio:"2024-05-06", parada_fim:"2024-05-29", termino_planejado:"29/05/24 14:30", termino_real:"29/05/24 14:30",
    clima_temp:"27°C", clima_chuva:"2%", clima_umidade:"68%", clima_vento:"8 km/h", paralizacoes:"", analise:"",
    foto_url:"https://kiwiykgzogcxiseynzyy.supabase.co/storage/v1/object/public/LOGO-Empresas/Reduc%20Drone.jpeg",
    logo_gcb_url:"https://kiwiykgzogcxiseynzyy.supabase.co/storage/v1/object/public/LOGO-Empresas/gcb.png" },
  escopo:[["EJETORES",7,7],["FILTRO",53,53],["GM'S",6,6],["HIDROJATO",16,16],["PSV'S",80,80],["REENGAXETAMENTO",92,92],["SERV. ESP.",21,21],["VÁLV. FLANGEADA",284,284],["VÁLV. RETENÇÃO",198,198],["VÁLV. ROSCADA",5,5],["VÁLV. SOLDADA",168,168],["VAZAMENTOS",8,8],["ZR'S",75,75]],
  extra:[["VAZAMENTOS",65,65],["ZR'S",113,113]],
  acumDia:[41,95,146,222,296,355,359,420,493,541,579,622,702,702,772,834,867,928,1002,1069,1108,1149,1167,1191],
  crit:[{segmento:"ÁGUA DE MÁQUINAS",status:"EM ANDAMENTO",pct_planejado:100,pct_realizado:100,pct_desvio:0}],
  psv:{total:80,removido:80,manutencao:80,instalado:80,pct_real:100},
  gm:[{categoria:"GM'S",total:6,pendente:0,iniciado:0,concluido:6},{categoria:"SERV. ESP.",total:21,pendente:0,iniciado:0,concluido:21},{categoria:"VAZAMENTOS",total:73,pendente:0,iniciado:0,concluido:73}],
  zr:[{item:"ESCOPO",total:75,pendente:0,iniciado:0,concluido:75},{item:"EXTRA",total:113,pendente:0,iniciado:0,concluido:113}],
  gantt:[{grupo:'24"',tarefa:"JUNTA 1",data_inicio:"2024-05-13",data_fim:"2024-05-14",status:"CONCLUIDO"},{grupo:'24"',tarefa:"JUNTA 2",data_inicio:"2024-05-14",data_fim:"2024-05-15",status:"CONCLUIDO"},{grupo:'24"',tarefa:"JUNTA 3",data_inicio:"2024-05-15",data_fim:"2024-05-16",status:"CONCLUIDO"},{grupo:'24"',tarefa:"JUNTA 4",data_inicio:"2024-05-16",data_fim:"2024-05-17",status:"CONCLUIDO"},{grupo:'8"',tarefa:"JUNTA 1",data_inicio:"2024-05-20",data_fim:"2024-05-21",status:"INICIADO"},{grupo:'8"',tarefa:"JUNTA 2",data_inicio:"2024-05-21",data_fim:"2024-05-22",status:"NAO_INICIADO"},{grupo:'4"',tarefa:"JUNTA 1",data_inicio:"2024-05-23",data_fim:"2024-05-24",status:"NAO_INICIADO"}],
  curva:(()=>{const a=[41,95,146,222,296,355,359,420,493,541,579,622,702,702,772,834,867,928,1002,1069,1108,1149,1167,1191];return a.map((v,i)=>({dia:`2024-05-${String(6+i).padStart(2,"0")}`,real_dia:i?v-a[i-1]:v,previsto_dia:i?v-a[i-1]:v,real_acum:v*0.98,previsto_acum:v}));})(),
  curvaResumo:[{tipo:"PERCENTUAL",previsto:100,realizado:100,restante:0},{tipo:"ATIVIDADES",previsto:4744,realizado:4744,restante:0},{tipo:"HH",previsto:16879,realizado:16879,restante:0}],
  listaOp:[[38,"D-5106","AMOSTRADOR ÁGUA DA DESSALGADORA DO D-51006 DESCONECTADO",100,"",false],[55,"D-5104","PSV-007 NÃO FORAM TORQUEADA",100,"Segunda Lista recebida 31/05",true],[56,"","PSV-015 NÃO FORAM TORQUEADA",100,"Segunda Lista recebida 31/05",true],[59,"H-5103","FV-053 FALTA REINSTALAR BLOQUEIO DO BY-PASS DA VÁLVULA",100,"",true],[62,"FV-56","FALTANDO FLANGE DO BLOQUEIO DE BY PASS",100,"",false],[69,"P-5123B","REMOVIDOS OS SPOOL DE DESCARGA — NÃO RETORNARAM",100,"",true],[81,"FV-5177","BY-PASS INSTALADA COM SENTIDO INVERTIDO",100,"",true],[119,"ACESSO T-5104","SEM CORRENTE DE PROTEÇÃO NO ACESSO",100,"",false],[136,"P-5146","INSTALAÇÃO DE VENTURE NA DESCARGA DA P-5146",100,"Segunda Lista recebida 31/05",true],[171,"T-5103","TUBULAÇÃO DESMONTADA E DESCONECTADA DO E-5116",100,"Segunda Lista recebida 31/05",true]],
  punch:[[62,"FV-56","FALTANDO FLANGE DO BLOQUEIO DE BY PASS",100],[59,"H-5103","FV-053 FALTA REINSTALAR BLOQUEIO",100]],
  standby:{DIA:{sup:"Carlinhos",f:[["CALDEIREIRO",24],["AJUDANTE",10],["MONTADOR DE ANDAIME",10],["SOLDADOR",6],["ALPINISTA",2],["INSPETOR",2],["MECÂNICO DE VÁLVULAS",2],["ELETRICISTA",1]]},
            NOITE:{sup:"Cícero",f:[["CALDEIREIRO",24],["AJUDANTE",10],["MONTADOR DE ANDAIME",10],["SOLDADOR",6],["ALPINISTA",2],["INSPETOR",2],["MECÂNICO DE VÁLVULAS",2],["ELETRICISTA",1]]}},
};

/* ---------- helpers ---------- */
const $=s=>document.querySelector(s);
const pct=(r,p)=> p? Math.min(100,(r/p)*100):0;
const pf=n=>(Number(n)||0).toFixed(2).replace(".",",")+"%";          // 87.3 -> "87,30%"
const pc=(r,p)=>pf(pct(r,p));                                        // razão -> "%"
const br=n=>(Number(n)||0).toLocaleString("pt-BR");
const dom=d=> d? new Date(d).getUTCDate():null;                    // dia do mês
const daysBetween=(a,b)=> Math.round((new Date(b)-new Date(a))/864e5);
const today0=()=>{ const d=new Date(); d.setHours(0,0,0,0); return d; };
function isDone(it){ return String(it.status||"").toUpperCase()==="CONCLUIDO" || Number(it.percentual_avanco)>=100; }
function isStarted(it){ const p=Number(it.percentual_avanco)||0; return !isDone(it) && p>0; }
function isOverdue(it){ return !isDone(it) && it.data_planejada && new Date(it.data_planejada) < today0(); }
function segStatus(r){ if(r.prev>0 && r.real>=r.prev) return {c:"done",t:"Concluído"};
  if(r.overdue>0) return {c:"bad",t:"Atrasado"}; if((r.started||0)>0 || r.real>0) return {c:"run",t:"Em andamento"}; return {c:"wait",t:"Pendente"}; }
function parseUpd(s){ if(!s) return null; const [dmy,hms]=String(s).trim().split(" "); const [d,m,y]=(dmy||"").split("/"); if(!y) return null;
  const t=new Date(`${y}-${m}-${d}T${hms||"00:00:00"}`); return isNaN(t)?null:t.getTime(); }

const STATE={ connected:!DEMO, lastUpd:null };
async function q(table){ if(DEMO) return []; try{ const {data,error}=await sb.from(table).select("*"); if(error) throw error; setConn(true); return data||[]; }catch(e){ console.warn("Supabase",table,e.message||e); setConn(false); return []; } }
function setConn(ok){ STATE.connected=ok; liveState(); }
function liveState(){ const e=$("#live"); if(!e) return; const t=$("#liveTxt");
  if(DEMO){ e.className="live on"; if(t)t.textContent="demonstração"; return; }
  if(!STATE.connected){ e.className="live off"; if(t)t.textContent="reconectando"; return; }
  if(STATE.lastUpd && (Date.now()-STATE.lastUpd)/3600000 > CONFIG.STALE_HORAS){ e.className="live off"; if(t)t.textContent="dado desatualizado"; return; }
  e.className="live on"; if(t)t.textContent="ao vivo"; }

/* ---------- velocímetro (gauge) SVG igual ao BI ---------- */
function setGauge(el,val,opts){ if(!el) return; opts=opts||{};
  const min=opts.min||"0%", max=opts.max||"100%", label=(opts.label!=null?opts.label:Math.round(val)+"%");
  const needleAt=(opts.needle!=null?opts.needle:val), f=Math.max(0,Math.min(100,val))/100;
  const cx=100,cy=100,r=80,sw=24,L=66, th=Math.PI*(1-Math.max(0,Math.min(100,needleAt))/100);
  const nx=(cx+L*Math.cos(th)).toFixed(1), ny=(cy-L*Math.sin(th)).toFixed(1), path=`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`;
  el.innerHTML=`<svg viewBox="0 0 200 126"><path class="gg-track" d="${path}" stroke-width="${sw}" pathLength="100"/>
    <path class="gg-fill" d="${path}" stroke-width="${sw}" pathLength="100" stroke-dasharray="${(f*100).toFixed(2)} 100"/>
    <line class="gg-needle" x1="${cx}" y1="${cy}" x2="${nx}" y2="${ny}"/><circle class="gg-pivot" cx="${cx}" cy="${cy}" r="4.5"/>
    <text class="gg-val" x="${cx}" y="${cy-4}" text-anchor="middle" font-size="30">${label}</text>
    <text class="gg-mm" x="${cx-r}" y="${cy+20}" text-anchor="middle" font-size="12">${min}</text>
    <text class="gg-mm" x="${cx+r}" y="${cy+20}" text-anchor="middle" font-size="12">${max}</text></svg>`;
}

/* ---------- shell (cabeçalho + rodapé/nav) ---------- */
const PAGES=[["01-menu.html","MENU"],["02-escopo.html","ESCOPO"],["03-resumo.html","RESUMO"],["04-lin24.html","LIN 24"],["05-punch.html","PUNCH LIST"],["06-curva-s.html","CURVA S"],["07-list-op.html","LIST OP"],["08-standby.html","STAND BY"]];
function buildShell(page,title){
  const cur=(location.pathname.split("/").pop())||page;
  const nav=PAGES.map(([h,l])=>`<a href="${h}" class="${h===cur?'on':''}">${l}</a>`).join("");
  const isMenu=page==="menu";
  if(!isMenu){
    $("#hdr").outerHTML=`<header class="hdr" id="hdr">
      <div class="brand"><div class="logo" id="logo">GCB</div><div><b style="font-size:1.1em">SIGMA</b><small>PLANEJAMENTO</small></div></div>
      <div class="htitle"><h1 id="hTitle">${title||""}</h1><div class="unit" id="hUnit">${CONFIG.UNIDADE}</div></div>
      <div class="counters"><div class="c"><b class="num" id="cMan">—</b><span>Dias de manutenção</span></div>
        <div class="c"><b class="num" id="cOco">—</b><span>Dias ocorridos</span></div>
        <div class="c"><b class="num" id="cRes">—</b><span>Dias restantes</span></div></div>
      <div class="upd"><span class="lbl">Última atualização:</span><b id="upd">—</b>
        <div class="live off" id="live"><span class="dot"></span><span id="liveTxt">conectando</span></div></div></header>`;
  } else { const h=$("#hdr"); if(h) h.remove(); }
  $("#ftr").outerHTML=`<footer class="ftr" id="ftr"><button class="btn" id="themeBtn" title="Claro/Escuro (T)">🌙</button>
    <nav class="nav">${nav}</nav><div class="spacer"></div>
    ${DEMO?'<span class="demo">Demonstração</span>':''}</footer>`;
  const logo=$("#logo"); if(logo&&CONFIG.LOGO_GCB_URL) logo.innerHTML=`<img src="${CONFIG.LOGO_GCB_URL}" alt="GCB">`;
  const stage=document.querySelector("main.stage");
  if(stage && !$("#alertbar")) stage.insertAdjacentHTML("beforebegin",`<div class="alertbar" id="alertbar" style="display:none"></div>`);
  initTheme();
}
/* faixa de alerta: itens atrasados + impeditivos SIM */
async function renderAlerts(){
  const bar=$("#alertbar"); if(!bar) return;
  let atras=0, imped=0;
  if(DEMO){ imped=DEMO_DATA.listaOp.filter(r=>r[5]).length; }
  else{ const its=await q("planejamento_itens"); atras=its.filter(isOverdue).length;
    const lo=await q("lista_operacional"); imped=lo.filter(r=>r.impeditivo).length; }
  const msgs=[];
  if(atras) msgs.push(`${atras} ${atras>1?"itens atrasados":"item atrasado"}`);
  if(imped) msgs.push(`${imped} ${imped>1?"impeditivos":"impeditivo"} (SIM)`);
  if(msgs.length){ bar.innerHTML=`<span class="ab-dot"></span> ATENÇÃO — ${msgs.join("  ·  ")}`; bar.style.display=""; }
  else bar.style.display="none";
}
function applyTheme(dark){ document.body.classList.toggle("dark",dark); const b=$("#themeBtn"); if(b)b.textContent=dark?"☀️":"🌙"; try{localStorage.setItem("sigma-tema",dark?"escuro":"claro");}catch(e){} }
function initTheme(){ let t=CONFIG.TEMA; try{t=localStorage.getItem("sigma-tema")||t;}catch(e){} applyTheme(t==="escuro");
  const b=$("#themeBtn"); if(b) b.onclick=()=>applyTheme(!document.body.classList.contains("dark")); }
document.addEventListener("keydown",e=>{ if(e.key==="t"||e.key==="T") applyTheme(!document.body.classList.contains("dark")); });

/* ---------- cabeçalho: config, contadores, última atualização ---------- */
async function fillHeader(){
  const cfg = DEMO ? DEMO_DATA.config : ((await q("painel_config"))[0]||{});
  if($("#hUnit")) $("#hUnit").textContent=cfg.unidade||CONFIG.UNIDADE;
  if($("#upd"))   $("#upd").textContent=cfg.ultima_atualizacao||"—";
  if(cfg.parada_inicio && cfg.parada_fim && $("#cMan")){
    const tot=daysBetween(cfg.parada_inicio,cfg.parada_fim), oco=Math.max(0,Math.min(tot,daysBetween(cfg.parada_inicio,new Date().toISOString().slice(0,10))));
    $("#cMan").textContent=tot; $("#cOco").textContent=DEMO?tot:oco; $("#cRes").textContent=DEMO?0:Math.max(0,tot-oco);
  }
  STATE.lastUpd=parseUpd(cfg.ultima_atualizacao);
  STATE.connected=!DEMO ? STATE.connected : true;
  liveState();
  return cfg;
}
const dias=()=>{ const a=[]; for(let d=CONFIG.DIA_INICIO; d<=CONFIG.DIA_FIM; d++) a.push(d); return a; };

/* ---------- agregação do ESCOPO a partir dos itens ---------- */
async function escopoAgg(){
  const DIAS=dias();
  if(DEMO){
    const mk=arr=>arr.map(([seg,prev,real])=>{ const daily={}; let rest=real; DIAS.forEach(d=>{ let v=(d%4===0&&rest>0)?Math.min(rest,Math.ceil(real/8)):0; rest-=v; daily[d]=v; }); return {seg,prev,real,daily,started:0,overdue:0}; });
    return { escopo:mk(DEMO_DATA.escopo), extra:mk(DEMO_DATA.extra), acum:DEMO_DATA.acumDia, geral:100 };
  }
  const items=await q("planejamento_itens");
  const build=tipo=>{ const g={}; items.filter(i=>String(i.tipo_lista||"ESCOPO").toUpperCase()===tipo).forEach(i=>{ const s=i.segmento||"—"; (g[s]=g[s]||[]).push(i); });
    return Object.entries(g).map(([seg,arr])=>{ const daily={}; DIAS.forEach(d=>daily[d]=0);
      arr.forEach(i=>{ if(isDone(i)){ const d=dom(i.data_conclusao); if(daily[d]!=null) daily[d]++; } });
      return { seg, prev:arr.length, real:arr.filter(isDone).length, started:arr.filter(isStarted).length, overdue:arr.filter(isOverdue).length, daily }; }).sort((a,b)=>b.prev-a.prev); };
  const esc=build("ESCOPO"), ext=build("EXTRA");
  // acumulado por dia (todos os itens concluídos)
  const acum=[]; let run=0; DIAS.forEach(d=>{ run+=items.filter(i=>isDone(i)&&dom(i.data_conclusao)===d).length; acum.push(run); });
  const prevT=items.length, realT=items.filter(isDone).length;
  return { escopo:esc, extra:ext, acum, geral:pct(realT,prevT) };
}

/* ---------- render por página ---------- */
function statusTable(rows,col){ let t=[0,0,0,0]; const b=rows.map(r=>{const total=r.total||0,pe=r.pendente||0,i=r.iniciado||0,c=r.concluido||0;t[0]+=total;t[1]+=pe;t[2]+=i;t[3]+=c;
  return `<tr><td class='seg'>${r.categoria||r.item}</td><td>${total}</td><td>${pe}</td><td>${i}</td><td class='cell-hi'>${c}</td><td>${pc(c,total)}</td></tr>`;}).join("");
  return `<thead><tr><th class='l'>${col}</th><th>Total</th><th>Pend.</th><th>Inic.</th><th>Concl.</th><th>% Real</th></tr></thead><tbody>${b}
    <tr style='font-weight:700'><td class='seg'>TOTAL</td><td>${t[0]}</td><td>${t[1]}</td><td>${t[2]}</td><td>${t[3]}</td><td>${pc(t[3],t[0])}</td></tr></tbody>`; }

async function renderEscopo(){
  const A=await escopoAgg(); const DIAS=dias();
  let head="<thead><tr><th class='l'>Segmento</th><th>Status</th><th>Prev.</th><th>Real.</th><th>Desv.</th><th>% Real</th>";
  DIAS.forEach(d=>head+="<th>"+String(d).padStart(2,"0")+"</th>"); head+="</tr></thead>";
  const rows=list=>{ if(!list.length) return head+"<tbody><tr><td colspan='30' class='empty'>Sem dados</td></tr></tbody>";
    let tot=[0,0,0,0]; let body=list.map(r=>{tot[0]+=r.prev;tot[1]+=r.real;tot[2]+=(r.started||0);tot[3]+=(r.overdue||0); let cells=DIAS.map(d=>`<td>${r.daily[d]||0}</td>`).join(""); const st=segStatus(r);
      return `<tr><td class='seg'>${r.seg}</td><td><span class='stat ${st.c}'>${st.t}</span></td><td>${r.prev}</td><td><span class='cell-hi'>${r.real}</span></td><td>${r.prev-r.real}</td><td><span class='cell-hi'>${pc(r.real,r.prev)}</span></td>${cells}</tr>`;}).join("");
    let tc=DIAS.map(()=>"<td>—</td>").join(""); const stt=segStatus({prev:tot[0],real:tot[1],started:tot[2],overdue:tot[3]});
    body+=`<tr style='font-weight:700'><td class='seg'>TOTAL</td><td><span class='stat ${stt.c}'>${stt.t}</span></td><td>${br(tot[0])}</td><td><span class='cell-hi'>${br(tot[1])}</span></td><td>${tot[0]-tot[1]}</td><td><span class='cell-hi'>${pc(tot[1],tot[0])}</span></td>${tc}</tr>`;
    return head+"<tbody>"+body+"</tbody>"; };
  if($("#tEscopo")) $("#tEscopo").innerHTML=rows(A.escopo);
  if($("#tExtra"))  $("#tExtra").innerHTML=rows(A.extra);
  const max=Math.max(1,...A.acum);
  if($("#dayBars")) $("#dayBars").innerHTML=A.acum.map((v,i)=>`<div class="daybar"><span>${DIAS[i]}</span><div class="t"><div class="f" style="width:${(v/max*100).toFixed(1)}%"><span>${br(v)}</span></div></div></div>`).join("");
  setGauge($("#gEsc"),A.geral);
}
async function renderResumo(){
  const A=await escopoAgg(); setGauge($("#gRes"),A.geral);
  const crit=DEMO?DEMO_DATA.crit:await q("caminho_critico");
  $("#tCrit").innerHTML="<thead><tr><th class='l'>Segmento</th><th>Status</th><th>% Plan.</th><th>% Real.</th><th>% Desv.</th></tr></thead><tbody>"+
    (crit.length?crit.map(c=>`<tr><td class='seg'>${c.segmento}</td><td><span class='stat run'>${c.status||""}</span></td><td>${pf(c.pct_planejado)}</td><td>${pf(c.pct_realizado)}</td><td>${pf(c.pct_desvio)}</td></tr>`).join(""):"<tr><td colspan='5' class='empty'>Sem dados</td></tr>")+"</tbody>";
  let tot=[0,0,0,0];
  $("#tResumo").innerHTML="<thead><tr><th class='l'>Segmento</th><th>Status</th><th>Plan.</th><th>Real.</th><th>Desv.</th><th>% Real</th></tr></thead><tbody>"+
    (A.escopo.length?A.escopo.map(r=>{tot[0]+=r.prev;tot[1]+=r.real;tot[2]+=(r.started||0);tot[3]+=(r.overdue||0);const st=segStatus(r);return `<tr><td class='seg'>${r.seg}</td><td><span class='stat ${st.c}'>${st.t}</span></td><td>${r.prev}</td><td><span class='cell-hi'>${r.real}</span></td><td>${r.prev-r.real}</td><td><span class='cell-hi'>${pc(r.real,r.prev)}</span></td></tr>`;}).join("")+(()=>{const s=segStatus({prev:tot[0],real:tot[1],started:tot[2],overdue:tot[3]});return `<tr style='font-weight:700'><td class='seg'>TOTAL</td><td><span class='stat ${s.c}'>${s.t}</span></td><td>${br(tot[0])}</td><td><span class='cell-hi'>${br(tot[1])}</span></td><td>${tot[0]-tot[1]}</td><td><span class='cell-hi'>${pc(tot[1],tot[0])}</span></td></tr>`;})():"<tr><td colspan='6' class='empty'>Sem dados</td></tr>")+"</tbody>";
  const v=DEMO?DEMO_DATA.psv:((await q("psv"))[0]||{});
  $("#tPsv").innerHTML=`<thead><tr><th>Total</th><th>Removido</th><th>Manut.</th><th>Inst.</th><th>% Real</th></tr></thead><tbody><tr><td>${v.total||0}</td><td style='background:rgba(220,38,38,.16)'>${v.removido||0}</td><td style='background:rgba(217,164,65,.22)'>${v.manutencao||0}</td><td class='cell-hi'>${v.instalado||0}</td><td>${pf(v.pct_real)}</td></tr></tbody>`;
  const gm=DEMO?DEMO_DATA.gm:await q("gm_servicos"); $("#tGm").innerHTML=gm.length?statusTable(gm,"Segmento"):"<tbody><tr><td class='empty'>Sem dados</td></tr></tbody>";
  const zr=DEMO?DEMO_DATA.zr:await q("medidas_zr"); $("#tZr").innerHTML=zr.length?statusTable(zr,"Item"):"<tbody><tr><td class='empty'>Sem dados</td></tr></tbody>";
}
async function renderGantt(){
  const rows=DEMO?DEMO_DATA.gantt:await q("gantt_tarefas");
  const body=$("#gBody"), axis=$("#gAxis");
  if(!rows.length){ body.innerHTML="<div class='empty'>Sem dados de cronograma</div>"; return; }
  const min=rows.reduce((m,r)=>r.data_inicio<m?r.data_inicio:m,rows[0].data_inicio);
  const max=rows.reduce((m,r)=>r.data_fim>m?r.data_fim:m,rows[0].data_fim);
  const nDays=Math.max(1,daysBetween(min,max)); const N=nDays+1;
  const mn=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];
  const labels=[]; for(let i=0;i<N;i++){ const d=new Date(min); d.setUTCDate(d.getUTCDate()+i); labels.push(`${d.getUTCDate()} ${mn[d.getUTCMonth()]}`); }
  axis.style.gridTemplateColumns=`repeat(${N},1fr)`; axis.innerHTML=labels.map(l=>`<span>${l}</span>`).join("");
  const grupos={}; rows.forEach(r=>{ (grupos[r.grupo]=grupos[r.grupo]||[]).push(r); });
  const cls={CONCLUIDO:"",INICIADO:"run",NAO_INICIADO:"wait"};
  let html=""; Object.entries(grupos).forEach(([g,arr])=>{ html+=`<div class="grow gh"><span class="name h">${g}</span><div class="gtrack"></div></div>`;
    arr.forEach(r=>{ const left=daysBetween(min,r.data_inicio)/N*100, w=Math.max(2,(daysBetween(r.data_inicio,r.data_fim)+1)/N*100);
      html+=`<div class="grow"><span class="name">${r.tarefa}</span><div class="gtrack"><div class="gbar ${cls[r.status]||''}" style="left:${left}%;width:${w}%"></div></div></div>`; }); });
  body.innerHTML=html;
}
async function renderPunch(){
  const rows=DEMO?DEMO_DATA.punch:(await q("punch_list")).map(r=>[r.item,r.equipamento,r.descricao,r.percentual_avanco]);
  $("#tPunch").innerHTML="<thead><tr><th>Item</th><th>Equip.</th><th class='l'>Descrição</th><th>% Avanço</th></tr></thead><tbody>"+
    (rows.length?rows.map(([it,eq,ds,av])=>`<tr><td>${it}</td><td>${eq||"—"}</td><td class='l'>${ds||""}</td><td><span class='cell-hi'>${pf(av)}</span></td></tr>`).join(""):"<tr><td colspan='4' class='empty'>Sem dados</td></tr>")+"</tbody>";
}
async function renderCurvaS(){
  const cfg=DEMO?DEMO_DATA.config:((await q("painel_config"))[0]||{});
  const sc=(id,v)=>{const e=$(id); if(e)e.textContent=v||"—";};
  sc("#termPlan",cfg.termino_planejado); sc("#termReal",cfg.termino_real);
  sc("#clima",cfg.clima_temp); sc("#climaX",[cfg.clima_chuva&&("Chuva "+cfg.clima_chuva),cfg.clima_umidade&&("Umidade "+cfg.clima_umidade),cfg.clima_vento&&("Vento "+cfg.clima_vento)].filter(Boolean).join(" · "));
  sc("#paraliz",cfg.paralizacoes); sc("#analise",cfg.analise);
  const rows=DEMO?DEMO_DATA.curva:(await q("curva_s")).sort((a,b)=>a.dia<b.dia?-1:1);
  const rz=DEMO?DEMO_DATA.curvaResumo:await q("curva_resumo");
  const g=t=>rz.find(r=>String(r.tipo).toUpperCase()===t)||{previsto:0,realizado:0,restante:0};
  const p=g("PERCENTUAL"); if($("#cpPrev")){$("#cpPrev").textContent=pf(p.previsto);$("#cpReal").textContent=pf(p.realizado);$("#cpDesv").textContent=pf((p.previsto||0)-(p.realizado||0));}
  const at=g("ATIVIDADES"), hh=g("HH");
  const set=(id,v)=>{const e=$(id); if(e)e.textContent=br(v);};
  set("#atP",at.previsto);set("#atR",at.realizado);set("#atS",at.restante);set("#hhP",hh.previsto);set("#hhR",hh.realizado);set("#hhS",hh.restante);
  const svg=$("#curvaS"); if(!svg) return;
  if(!rows.length){ svg.parentElement.innerHTML="<div class='empty'>Sem dados da curva</div>"; return; }
  const W=1000,H=380,pad=26,n=rows.length,bw=(W-2*pad)/n;
  const maxD=Math.max(1,...rows.map(r=>Math.max(r.previsto_dia||0,r.real_dia||0)));
  const totA=Math.max(1,...rows.map(r=>Math.max(r.previsto_acum||0,r.real_acum||0)));
  let out=""; rows.forEach((r,i)=>{ const x=pad+i*bw;
    const hp=((r.previsto_dia||0)/maxD)*(H-2*pad), hr=((r.real_dia||0)/maxD)*(H-2*pad);
    out+=`<rect x="${x+bw*0.16}" y="${H-pad-hp}" width="${bw*0.32}" height="${hp}" fill="#16A34A"/><rect x="${x+bw*0.52}" y="${H-pad-hr}" width="${bw*0.32}" height="${hr}" fill="#7BD8A6"/>`; });
  const line=(key,col)=>{ let pts=rows.map((r,i)=>`${pad+i*bw+bw/2},${H-pad-((r[key]||0)/totA)*(H-2*pad)}`).join(" "); return `<polyline points="${pts}" fill="none" stroke="${col}" stroke-width="3"/>`; };
  out+=line("previsto_acum","#D9A441")+line("real_acum","#0EA5A0")+`<line x1="${pad}" y1="${H-pad}" x2="${W-pad}" y2="${H-pad}" stroke="#CBD5D0"/>`;
  svg.innerHTML=out;
}
async function renderListOp(){
  const rows=DEMO?DEMO_DATA.listaOp:(await q("lista_operacional")).filter(r=>String(r.categoria||"PARADA").toUpperCase()==="PARADA").map(r=>[r.item_geral,r.equipamento,r.descricao,r.percentual_avanco,r.observacoes,r.impeditivo]);
  setGauge($("#gOp"),rows.length?rows.reduce((a,r)=>a+(Number(r[3])||0),0)/rows.length:0);
  if($("#opTot")){$("#opTot").textContent=rows.length;$("#opRea").textContent=rows.filter(r=>Number(r[3])>=100).length;$("#opPen").textContent=rows.filter(r=>Number(r[3])<100).length;}
  $("#tOp").innerHTML="<thead><tr><th>Item</th><th>Equip.</th><th class='l'>Descrição</th><th>% Avanço</th><th class='l'>Observações</th><th>Impeditivo</th></tr></thead><tbody>"+
    (rows.length?rows.map(([it,eq,ds,av,ob,im])=>`<tr><td>${it}</td><td>${eq||"—"}</td><td class='l'>${ds||""}</td><td><span class='cell-hi'>${pf(av)}</span></td><td class='l' style='color:var(--mut)'>${ob||""}</td><td><span class='badge ${im?"b-sim":"b-nao"}'>${im?"SIM":"NÃO"}</span></td></tr>`).join(""):"<tr><td colspan='6' class='empty'>Sem dados</td></tr>")+"</tbody>";
}
async function renderStandby(){
  let dia,noite;
  if(DEMO){ dia=DEMO_DATA.standby.DIA; noite=DEMO_DATA.standby.NOITE; }
  else{ const rows=await q("stand_by"); const grp=t=>{const r=rows.filter(x=>String(x.turno).toUpperCase()===t); return {sup:(r[0]||{}).supervisor||"",f:r.map(x=>[x.funcao,x.quantidade||0])};};
    dia=grp("DIA"); noite=grp("NOITE"); }
  const draw=(el,data)=>{ if(!el) return; const total=data.f.reduce((a,b)=>a+b[1],0), max=Math.max(1,...data.f.map(x=>x[1]));
    el.innerHTML=`<div class="node"><b>${total}</b><span>STAND BY</span></div><div class="node"><b>${total}</b><span>${data.sup||"—"}</span></div>
      <div class="funcs">${data.f.map(([f,qn])=>`<div class="func"><span class="fn">${f}</span><div class="ft"><div class="ff" style="width:${qn/max*100}%"></div></div><b>${qn}</b></div>`).join("")||"<div class='empty'>Sem dados</div>"}</div>`; };
  draw($("#treeDia"),dia); draw($("#treeNoite"),noite);
  const cd=$("#supDia"), cn=$("#supNoite"); if(cd)cd.textContent=dia.sup||"—"; if(cn)cn.textContent=noite.sup||"—";
}

/* ---------- menu (capa) ---------- */
async function renderMenu(){
  const cfg=DEMO?DEMO_DATA.config:((await q("painel_config"))[0]||{});
  const set=(id,v)=>{const e=$(id); if(e)e.textContent=v;};
  const units=String(cfg.unidade||CONFIG.UNIDADE).split(/[·,\/;]+/).map(s=>s.trim()).filter(Boolean);
  const ub=$("#unidade"); if(ub){ ub.innerHTML=units.join("<br>"); if(ub.parentElement) ub.parentElement.classList.toggle("multi",units.length>1); }
  set("#refinaria",cfg.refinaria||CONFIG.REFINARIA); set("#updMenu",cfg.ultima_atualizacao||"—");
  if($("#qr")) $("#qr").src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data="+encodeURIComponent(cfg.qr_url||CONFIG.QR_URL);
  const fundo=cfg.foto_url||CONFIG.FOTO_URL; const cov=document.querySelector(".cover");
  if(fundo&&cov) cov.style.setProperty("--fundo",`url("${fundo}")`);
  const logo=cfg.logo_gcb_url||CONFIG.LOGO_GCB_URL; if(logo&&$("#gcbMenu")) $("#gcbMenu").innerHTML=`<img src="${logo}" alt="GCB">`;
}

/* ---------- realtime + init ---------- */
const RENDER={menu:renderMenu,escopo:renderEscopo,resumo:renderResumo,lin24:renderGantt,punch:renderPunch,curvas:renderCurvaS,listop:renderListOp,standby:renderStandby};
const TABLES={escopo:["planejamento_itens"],resumo:["planejamento_itens","caminho_critico","psv","gm_servicos","medidas_zr"],lin24:["gantt_tarefas"],punch:["punch_list"],curvas:["curva_s","curva_resumo"],listop:["lista_operacional"],standby:["stand_by"],menu:["painel_config"]};
async function SIGMA_init(){
  const page=document.body.dataset.page, title=document.body.dataset.title||"";
  buildShell(page,title);
  await fillHeader();
  const fn=RENDER[page]; if(fn) await fn();
  await renderAlerts();
  if(!DEMO){ const ch=sb.channel("sigma-"+page);
    (TABLES[page]||[]).concat(["planejamento_itens","lista_operacional","painel_config"]).forEach(t=>ch.on("postgres_changes",{event:"*",schema:"public",table:t},async()=>{ await fillHeader(); if(fn) await fn(); await renderAlerts(); }));
    ch.subscribe(st=>setConn(st==="SUBSCRIBED")); }
  // rede de segurança: revê "dado velho" a cada minuto (mesmo sem evento)
  setInterval(liveState, 60000);
}
document.addEventListener("DOMContentLoaded",SIGMA_init);
