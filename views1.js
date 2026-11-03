// ================= SHELL =================
const TABS_ALL=[
 ['home','Home','🏠','OVERVIEW'],['inbox','Inbox','✉️','OVERVIEW'],['schedule','Schedule','📅','OVERVIEW'],
 ['groups','Groups','👥','ARTISTS'],['trainees','Trainees','🎓','ARTISTS'],['actors','Actors','🎬','ARTISTS'],['dorms','Dorms','🏠','ARTISTS'],
 ['studio','Studio','🎧','OPERATIONS'],['tv','TV Shows','📺','OPERATIONS'],['market','Market','💼','OPERATIONS'],['global','Global','🌏','OPERATIONS'],
 ['fans','Fans','💗','PUBLIC'],['scandals','Scandals & PR','🚨','PUBLIC'],['charts','Charts','📊','PUBLIC'],['awards','Awards','🏆','PUBLIC'],
 ['board','Board','🏛','AGENCY'],['staff','Staff','🧑‍💼','AGENCY'],['finances','Finances','💰','AGENCY']];
const panel=(t,b,x='',np)=>`<div class="panel"><div class="ph"><h2>${t}</h2>${x}</div><div class="pb ${np?'np':''}">${b}</div></div>`;
function subtabs(v,list){const c=S.sub[v]||list[0][0];return[c,`<div class="subtabs">${list.map(([k,l])=>`<button class="${c===k?'on':''}" onclick="setSub('${v}','${k}')">${l}</button>`).join('')}</div>`]}
const confCol=c=>c<25?'var(--bad)':c<50?'var(--warn)':'var(--good)';
const pLink=p=>`<a href="javascript:void 0" onclick="${p.agencyId===0?`nav('person',${p.id})`:`showPerson(${p.id})`}">${esc(p.given)}</a>`;
const gLink=g=>g?`<a href="javascript:void 0" onclick="${g.agencyId===0?`nav('group',${g.id})`:`showRival(${g.id})`}">${esc(g.name)}</a>`:'—';
function badge(k){if(k==='inbox')return visibleInbox().filter(m=>!m.read).length;if(k==='social')return 0;if(k==='market')return S.offers.length;if(k==='scandals')return S.scandals.filter(x=>x.status==='open').length;if(k==='staff')return S.poach?1:0;if(k==='actors')return S.cfOffers.length;if(k==='studio')return S.ostOffers.length;return 0}
function render(){
  if(!S)return renderSetup();
  document.documentElement.style.setProperty('--club',S.color||'#e8327c');
  const V={home:vHome,inbox:vInbox,schedule:vSchedule,groups:vGroups,group:vGroup,person:vPerson,trainees:vTrainees,actors:vActors,dorms:vDorms,studio:vStudio,tv:vTV,market:vMarket,global:vGlobal,fans:vFans,scandals:vScandals,charts:vCharts,awards:vAwards,board:vBoard,staff:vStaff,finances:vFinances,editor:vEditor,social:vSocial}[S.view]||vHome;
  const t=TABS_ALL.find(x=>x[0]===S.view);
  let title=t?t[1]:'',crumb=t?t[3]:'';
  if(S.view==='group'){const g=G(S.param);title=g?g.name:'Group';crumb='ARTISTS · GROUP'}
  if(S.view==='person'){const p=P(S.param);title=p?p.given:'Profile';crumb='ARTISTS · PROFILE'}
  let body;try{body=V()}catch(e){console.error(e);body=`<div class="panel"><div class="pb">Something went wrong rendering this screen. <button class="btn" onclick="nav('home')">Home</button></div></div>`}
  let secs='',last='';
  TABS_ALL.forEach(([k,l,ic,sec])=>{if(sec!==last){secs+=`<div class="nav-sec">${sec}</div>`;last=sec}const b=badge(k),on=S.view===k||(S.view==='group'&&k==='groups')||(S.view==='person'&&k==='trainees');secs+=`<button class="nav ${on?'on':''}" onclick="nav('${k}')"><i>${ic}</i>${l}${b?`<span class="nb">${b}</span>`:''}</button>`});
  const c=conf();
  document.getElementById('app').innerHTML=`<div class="shell"><aside class="side"><div class="crest"><div class="badge0">${esc(S.agency.split(' ').map(w=>w[0]).join('').slice(0,3))}</div><div><b>${esc(S.agency)}</b><small>Rep ${Math.round(S.rep)} · Board ${Math.round(c)}%${S.edited?' · <b style="color:#ffd36b">EDITED</b>':''}</small></div></div>${secs}<div style="padding:14px" class="xs muted">Ctrl/⌘ K to find · Space = next day · » = next week</div></aside><div class="scrim" onclick="toggleSide()"></div>
  <div class="mainw"><div class="topbar"><button class="ib burger" onclick="toggleSide()">☰</button><button class="ib hide-m" onclick="back()" ${S.hist.length?'':'disabled'}>‹</button><button class="ib hide-m" onclick="fwd()" ${S.fwd.length?'':'disabled'}>›</button>
  <div class="ttl"><div class="crumb">${crumb}</div><h1>${esc(title)}</h1></div><button class="ib" onclick="openFind()" title="Find (Ctrl K)">🔍</button>
  <div class="tmeta"><div class="hide-m">${dayStr(S.week,S.day||0)}</div><b style="color:${S.money<0?'var(--bad)':'#fff'}">${fmtM(S.money)}</b></div><button class="ib hide-m" title="Skip to next week" onclick="contWeek()">»</button><button class="cont" onclick="cont()">CONTINUE ›</button></div>
  <main>${body}</main></div></div>`;
}
function renderSetup(){
  const saved=load();
  document.documentElement.style.setProperty('--club','#e8327c');
  document.getElementById('app').innerHTML=`<div class="setup"><div class="panel"><div class="pb" style="padding:22px"><div class="logo">K-POP AGENCY<br>SIMULATOR</div><p class="muted">Run a K-pop agency for a decade. Scout, train, debut, chart, tour the world and win the daesang.</p>
  ${saved?`<button class="btn club" style="width:100%;margin:8px 0;padding:10px" onclick="S=load();render()">Continue: ${esc(saved.agency)} · ${dateStr(saved.week)}</button>`:''}
  <label>Agency name</label><input id="sName" value="Moonrise Entertainment">
  <div class="row"><div class="f1"><label>Agency colour</label><input id="sCol" type="color" value="#e8327c" style="width:100%"></div><div class="f1"><label>Roster</label><select id="sRoster"><option value="F">Girl groups</option><option value="M">Boy groups</option><option value="X">Mixed</option></select></div></div>
  <label>Start</label><select id="sMode"><option value="new">Startup – 8 trainees, ₩2.8B</option><option value="est">Established – 1 debuted group + 4 trainees, ₩2.4B</option></select>
  <label>Board's 5-year vision</label><select id="sVis">${Object.entries(VISIONS).map(([k,v])=>`<option value="${k}">${v[0]} – ${v[1]}</option>`).join('')}</select>
  <button class="btn pri" style="width:100%;margin-top:18px;padding:12px;font-size:15px" onclick="newGame({name:sName.value.trim()||'Moonrise Entertainment',color:sCol.value,roster:sRoster.value,mode:sMode.value,vision:sVis.value})">START NEW CAREER</button></div></div></div>`;
}
// ================= HOME =================
function vHome(){
  const b=S.board,t=b.targets,gs=myGroups(),c=conf(),ss=season(S.week);
  const next=[];gs.forEach(g=>{if(g.prep)next.push(`<b>${esc(g.name)}</b> ${g.songs.length?'comeback':'debut'} in ${g.prep.weeks} wk`)});CEREMONIES.forEach(x=>{const w=x.week-wkOf(S.week);if(w>0&&w<=8)next.push(`${x.name} in ${w} wk`)});if(S.survival)next.push(`${esc(S.survival.title)} ep ${S.survival.ep+1}`);S.tours.filter(x=>x.idx<x.stops.length).forEach(x=>next.push(`${esc(x.name)}: ${x.stops[x.idx].city}`));
  const alerts=[];if(S.offers.length)alerts.push(['r',`${S.offers.length} transfer bid(s) for your idols`,'market']);const os=S.scandals.filter(x=>x.status==='open');if(os.length)alerts.push(['r',`${os.length} open scandal(s) need a response`,'scandals']);if(S.poach)alerts.push(['w','A rival is poaching your staff','staff']);if(S.cfOffers.length)alerts.push(['g',`${S.cfOffers.length} CF offer(s)`,'actors']);if(S.ostOffers.length)alerts.push(['g',`${S.ostOffers.length} OST offer(s)`,'studio']);
  mine().filter(p=>p.contract&&p.contract.end&&p.contract.end-S.week<=26&&p.contract.end-S.week>0).forEach(p=>alerts.push(['w',`${esc(p.given)}'s contract ends in ${p.contract.end-S.week} wk`,'p'+p.id]));
  mine().filter(p=>p.wantsHome).forEach(p=>alerts.push(['w',`${esc(p.given)} wants to move out`,'dorms']));
  return `<div class="kpi" style="margin-bottom:10px"><div><small>Balance</small><b style="color:${S.money<0?'var(--bad)':''}">${fmtM(S.money)}</b></div><div><small>Board confidence</small><b style="color:${confCol(c)}">${Math.round(c)}%</b></div><div><small>Agency table</small><b>#${myPos()} <span class="xs muted">/ #${t.pos}</span></b></div><div><small>Wins ${t.year}</small><b>${yWins()} <span class="xs muted">/ ${t.wins}</span></b></div><div><small>Reputation</small><b>${Math.round(S.rep)}</b></div><div><small>Trend</small><b style="font-size:16px">${S.trend}</b></div></div>
  <div class="g2"><div>
  ${panel('Your artists',`<table class="z"><tr><th>Group</th><th>Stage</th><th>Fans</th><th>Mood</th><th>Status</th></tr>${gs.map(g=>`<tr class="click" onclick="nav('group',${g.id})"><td><span style="color:${g.color}">●</span> <b>${esc(g.name)}</b>${g.parent?' <span class="pill">unit</span>':''}</td><td class="sm">${stageOf(g)}</td><td>${fmtN(g.fans)}</td><td>${bar(g.mood,g.mood<40?'var(--bad)':'var(--good)',50)}</td><td>${groupStatus(g)}</td></tr>`).join('')||'<tr><td colspan="5" class="muted">No groups yet. Tick trainees in Trainees to form one.</td></tr>'}</table>`,`<button class="btn s" onclick="nav('trainees')">${trainees().length} trainees</button>`,true)}
  ${panel('Weekly chart · Top 10',`<table>${chartRows(S.chart.slice(0,10),true)}</table>`,`<button class="btn s" onclick="nav('charts')">Charts</button>`,true)}
  </div><div>
  ${alerts.length?panel('Needs attention',alerts.map(a=>`<div class="news click" style="cursor:pointer" onclick="openLink('${a[2]}')"><span class="pill ${a[0]}">!</span> ${a[1]}</div>`).join('')):''}
  ${panel('Coming up',(ss?`<div class="news">${SEASONL[ss]}</div>`:'')+(next.map(n=>`<div class="news sm">${n}</div>`).join('')||'<p class="muted sm">Nothing scheduled.</p>'),`<button class="btn s" onclick="nav('schedule')">Schedule</button>`)}
  ${panel('Latest news',visibleInbox().slice(0,6).map(m=>`<div class="news" style="cursor:pointer" onclick="S.ibSel=${m.id};nav('inbox')"><b class="sm">${m.title}</b><div class="xs muted">${dateStr(m.w)}</div></div>`).join(''))}
  ${panel('Milestones',GOALS.map(([k,l])=>`<div class="stat"><span class="sm ${S.goals[k+'_done']?'muted':''}">${l}</span><span>${S.goals[k+'_done']?'✅':'⬜'}</span></div>`).join(''))}
  </div></div>`;
}
function groupStatus(g){
  if(g.prep)return `<span class="pill w">${g.songs.length?'Comeback':'Debut'} ${g.prep.weeks}wk</span>`;
  if(touring(g))return `<span class="pill c">On tour</span>`;
  if(promoting(g)){const s=lastSong(g);return `<span class="pill p">Promo wk ${S.week-s.week+1}/4</span>`}
  if(g.promo)return `<span class="pill c">${REGIONS[g.promo.r]} promo</span>`;
  return `<span class="pill g">${SCHED[g.schedule||'rest']}</span>`;
}
function mvCell(s){return s.lastRank==null?'<span class="mv-new">NEW</span>':s.lastRank>s.rank?`<span class="mv-up">▲${s.lastRank-s.rank}</span>`:s.lastRank<s.rank?`<span class="mv-dn">▼${s.rank-s.lastRank}</span>`:'<span class="muted">–</span>'}
function chartRows(ids,compact){
  return ids.map(id=>{const s=SG(id),g=G(s.groupId),me=g.agencyId===0;
    return `<tr class="${me?'me':''}"><td><b>${s.rank}</b></td><td>${mvCell(s)}</td><td><b>${esc(s.title)}</b><div class="muted xs">${esc(g.name)}${s.collab?' × '+esc(G(s.collab)?.name):''}${compact?'':' · '+esc(AG(g.agencyId).name)}</div></td>${compact?'':`<td class="sm">${ALBUM[s.type]?ALBUM[s.type].n:s.type}</td><td>${s.weeks}</td><td>${s.peak}</td>`}<td>${Math.round(s.cur)}</td></tr>`}).join('');
}
// ================= SCHEDULE =================
function weekCell(g,w){
  const t=S.tours.find(x=>x.gid===g.id&&x.idx<x.stops.length);if(t){const i=t.idx+(w-S.week-1);if(i>=t.idx&&i<t.stops.length)return[`🎤 ${t.stops[i].city}`,'c']}
  if(g.prep){const rel=S.week+g.prep.weeks;if(w<rel)return['Prep','w'];if(w===rel)return[g.songs.length?'Release':'Debut','p'];if(w<=rel+3)return['Promo','p']}
  const s=lastSong(g);if(s&&w-s.week>=0&&w-s.week<=3)return['Promo','p'];
  if(g.promo&&w<=g.promo.until)return[REGIONS[g.promo.r],'c'];
  return[SCHED[g.schedule||'rest'],''];
}
function vSchedule(){
  const[c,st]=subtabs('schedule',[['week','This week'],['plan','8-week plan'],['tours','Tours']]);
  if(c==='tours')return st+vTours();
  if(c==='week'){
    const w=S.week,cells=DAYS.map(()=>[]),today=S.day||0;
    myGroups().forEach(g=>{const[l,cl]=weekCell(g,w);if(l==='Promo'||l==='Release'||l==='Debut'){if(l!=='Promo')cells[0].push(`<span class="cell p">${esc(g.name)} release (00:00 Mon)</span>`);DAYS.slice(1).forEach((d,i)=>cells[i+1].push(`<span class="cell p">${esc(g.name)} · ${SHOWS[i]}</span>`))}
      else if(cl==='c')[1,3,5].forEach(i=>cells[i].push(`<span class="cell c">${esc(g.name)} · ${l}</span>`));
      else if(l==='Prep')[0,2,4].forEach(i=>cells[i].push(`<span class="cell w">${esc(g.name)} recording/practice</span>`));
      else cells[RI(1,5)%7].push(`<span class="cell">${esc(g.name)} · ${l}</span>`)});
    S.tv.forEach(t=>{const o=t.kind==='group'?G(t.tid):P(t.tid);if(o)cells[5].push(`<span class="cell b">📺 ${esc(o.name)} – ${t.show}</span>`)});
    mine().filter(p=>p.busy).forEach(p=>[1,2,3,4].forEach(i=>cells[i].push(`<span class="cell b">🎬 ${esc(p.given)} filming</span>`)));
    if(S.survival)cells[4].push(`<span class="cell b">📺 ${esc(S.survival.title)} ep ${S.survival.ep+1}</span>`);
    if(S.reality)cells[6].push(`<span class="cell b">📺 ${esc(S.reality.title)}</span>`);
    if(wkOf(w)%4===0)cells[4].push('<span class="cell g">Monthly showcase</span>');
    CEREMONIES.forEach(x=>{if(wkOf(w)===x.week)cells[5].push(`<span class="cell p">🏆 ${x.name}</span>`)});
    return st+panel(`Week ${wkOf(w)} · day by day`,`<div class="tw"><table class="sch"><tr>${DAYS.map((d,i)=>`<th style="${i===today?'color:#fff;background:color-mix(in srgb,var(--club) 35%,#1d2330)':''}">${d} ${dateOf(w,i).getUTCDate()}${i===today?' · TODAY':''}</th>`).join('')}</tr><tr>${cells.map((cs,i)=>`<td style="${i<today?'opacity:.45':''}${i===today?';background:rgba(255,255,255,.03)':''}">${cs.join('')||'<span class="muted xs">—</span>'}</td>`).join('')}</tr></table></div>`,'',true)+`<p class="muted xs">Music shows run Tuesday to Sunday during promotion weeks. ${SEASONL[season(w)]}</p>`;
  }
  const ws=[];for(let i=1;i<=8;i++)ws.push(S.week+i);
  const ev=w=>{const k=wkOf(w),e=[];if(k%4===0)e.push('Showcase');if((w-1)%4===0)e.push('Auditions');CEREMONIES.forEach(x=>{if(k===x.week-3)e.push('Nominations');if(k===x.week)e.push('🏆 '+x.name.split(' ')[0])});if(k===52)e.push('📋 Board review');if((w-1)%13===0)e.push('Trend shift');if(k===1)e.push('New targets');if(k===22)e.push('☀️ Summer');if(k===44)e.push('❄️ Year-end');return e};
  let rows=myGroups().map(g=>`<tr><td>${gLink(g)}</td>${ws.map(w=>{const[l,c]=weekCell(g,w);const tv=S.tv.some(t=>t.kind==='group'&&t.tid===g.id&&t.until>=w);return `<td><span class="cell ${c}">${l}${tv?' 📺':''}</span></td>`}).join('')}</tr>`).join('');
  mine().filter(p=>p.busy).forEach(p=>rows+=`<tr><td>${pLink(p)} 🎬</td>${ws.map(w=>`<td>${w<p.busy.until?'<span class="cell b">Filming</span>':w===p.busy.until?'<span class="cell g">Premiere</span>':''}</td>`).join('')}</tr>`);
  mine().filter(p=>p.injury||p.hiatus).forEach(p=>{const u=(p.injury||p.hiatus).until;rows+=`<tr><td>${pLink(p)} ${p.injury?'🩹':'💤'}</td>${ws.map(w=>`<td>${w<u?`<span class="cell w">${p.injury?'Injured':'Hiatus'}</span>`:''}</td>`).join('')}</tr>`});
  if(S.survival)rows+=`<tr><td>${esc(S.survival.title)}</td>${ws.map((w,i)=>{const e=S.survival.ep+i+1;return `<td>${e<=S.survival.len?`<span class="cell ${e===S.survival.len?'p':'b'}">${e===S.survival.len?'Finale':'Ep '+e}</span>`:''}</td>`}).join('')}</tr>`;
  rows+=`<tr><td>Agency</td>${ws.map(w=>`<td class="xs">${ev(w).join('<br>')}</td>`).join('')}</tr>`;
  return st+panel('Next 8 weeks',`<div class="tw"><table class="sch"><tr><th></th>${ws.map(w=>`<th>Wk ${wkOf(w)}</th>`).join('')}</tr>${rows}</table></div>`,'',true);
}
function vTours(){
  return panel('World tours',`${S.tours.slice().reverse().map(t=>{const g=G(t.gid);return `<div class="news"><div class="row"><b class="f1">${esc(t.name)}</b>${t.idx>=t.stops.length?'<span class="pill g">Complete</span>':'<span class="pill c">On tour</span>'}</div><div class="tw"><table><tr><th>City</th><th>Venue</th><th>Sold</th><th>Revenue</th></tr>${t.stops.map((s,i)=>`<tr class="${i===t.idx?'me':''}"><td>${s.city}</td><td>${s.venue}</td><td>${s.sold!=null?fmtN(s.sold)+' / '+fmtN(VENUES[s.venue].cap):'—'}</td><td>${s.rev!=null?fmtM(s.rev):'—'}</td></tr>`).join('')}</table></div><div class="xs muted">${g?esc(g.name):''} · gross ${fmtM(t.rev)}</div></div>`}).join('')||'<p class="muted">No tours yet.</p>'}`,`<button class="btn club s" onclick="showTour()">Plan a tour</button>`);
}
// ================= BOARD =================
function vBoard(){
  const b=S.board,t=b.targets,c=conf(),ci=26-(S.week-b.lastInvest),cp=52-(S.week-b.lastPatience),v=VISIONS[b.vision.key];
  const req=(n,d,btn,dis,lbl)=>`<div class="news"><div class="row"><div class="f1"><b>${n}</b><div class="muted xs">${d}</div></div><button class="btn pri s" onclick="boardRequest('${btn}')" ${dis?'disabled':''}>${lbl}</button></div></div>`;
  return `<div class="g2"><div>
  ${panel('Board of directors',`<div class="row" style="gap:16px;margin-bottom:8px"><div style="font-size:44px;font-weight:700;font-family:'Barlow Condensed',sans-serif;color:${confCol(c)}">${Math.round(c)}%</div><div class="f1 sm muted">${c>=70?'The board is delighted.':c>=45?'The board is satisfied for now.':c>=25?'The board is growing uneasy.':'Your job is at serious risk.'} Below 5% you will be sacked.</div></div>
  <table class="z"><tr><th>Member</th><th>Agenda</th><th>Satisfaction</th></tr>${b.members.map(m=>`<tr><td><b>${esc(m.name)}</b></td><td>${AGENDAS[m.agenda][0]} ${AGENDAS[m.agenda][1]} <div class="xs muted">${AGENDAS[m.agenda][2]}</div></td><td>${bar(m.sat,confCol(m.sat),90)} ${Math.round(m.sat)}</td></tr>`).join('')}</table>`)}
  ${panel(`${t.year} targets`,`<div class="stat"><span>Agency table position</span><b>#${myPos()} <span class="muted xs">/ #${t.pos}</span></b></div><div class="stat"><span>Music show wins</span><b>${yWins()} <span class="muted xs">/ ${t.wins}</span></b></div>${bar(Math.min(100,yWins()/t.wins*100),'var(--club2)','100%')}<p class="muted xs">Reviewed at week 52. ${b.patience?'<span class="pill b">Patience granted</span>':''}</p>`)}
  ${panel('5-year vision',`<div class="stat"><span><b>${v[0]}</b><div class="xs muted">${v[1]}</div></span><span>${b.visionDone?'<span class="pill g">Achieved</span>':`<span class="pill w">By ${b.vision.deadline}</span>`}</span></div>`)}
  ${panel('Review history',b.history.map(h=>`<div class="news sm">${h}</div>`).join('')||'<p class="muted sm">First review at the end of the year.</p>')}
  </div><div>
  ${panel('Requests',req('Extra investment','Cash injection; likelier with high confidence. Every 26 weeks.','invest',ci>0,ci>0?ci+' wk':'Ask')+req('More patience','Lower this year\'s win target and soften the review. Once a year.','patience',cp>0,cp>0?cp+' wk':'Ask')+req('Stock market IPO','Needs rep 50+, confidence 60%+, 1M+ fans. Big cash, share price pressure.','ipo',b.ipo,b.ipo?'Listed':'Request')+req('Acquire a small label','₩1.5B · confidence 45%+. Adds a debuted group and 3 trainees.','label',b.label,b.label?'Done':'Request')+req('Build a new HQ','₩2.5B · confidence 55%+. Facility cap 7, up to 8 dorms, morale & rep boost.','hq',b.hq,b.hq?'Built':'Request'))}
  ${panel('Facilities',Object.entries(FAC).map(([k,[n,d]])=>{const l=S.fac[k],cc=(l+1)*400;return `<div class="news"><div class="row"><div class="f1"><b>${n}</b> <span class="muted xs">Lv ${l}/${facMax()}</span><div class="muted xs">${d}</div>${bar(l/facMax()*100,'var(--club)',120)}</div><button class="btn pri s" onclick="upgrade('${k}')" ${l>=facMax()||S.money<cc||c<35?'disabled':''}>${l>=facMax()?'Max':fmtM(cc)}</button></div></div>`}).join('')+'<p class="muted xs">Needs 35%+ confidence. +₩3M/week upkeep per level.</p>')}
  </div></div>`;
}
// ================= STAFF =================
function vStaff(){
  const[c,st]=subtabs('staff',[['heads','Departments'],['interns','Interns'],['delegation','Delegation']]);
  const wage=sum(Object.values(S.staff).filter(Boolean).map(s=>s.wage+(s.asst?s.asst.wage:0)));
  const poach=S.poach?panel('⚠ Poaching attempt',`<p>${esc(AG(S.poach.aid).name)} offered your ${STAFF[S.poach.role][0]} <b>${esc(S.staff[S.poach.role]?.name)}</b> ${fmtM(S.poach.wage)}/week. Decide by week ${wkOf(S.poach.until)}.</p><button class="btn club" onclick="poachRespond(true)">Match offer</button> <button class="btn" onclick="poachRespond(false)">Let them go</button>`):'';
  if(c==='interns')return st+panel(`Interns (${S.interns.length}/4)`,`<p class="muted sm">Interns cost ₩1M/week and grow every week (faster with a Mentor on staff). Promote them into a vacant head or assistant role.</p><table><tr><th>Name</th><th>Rating</th><th>Since</th><th>Promote to</th></tr>${S.interns.map(i=>`<tr><td><b>${esc(i.name)}</b></td><td>${stars(i.rating)} ${i.rating.toFixed(1)}</td><td class="sm">${dateStr(i.since)}</td><td><select id="ir${i.id}">${Object.entries(STAFF).map(([k,v])=>`<option value="${k}">${v[0]}</option>`).join('')}</select> <button class="btn s pri" onclick="promoteIntern(${i.id})">Promote</button></td></tr>`).join('')||'<tr><td colspan="4" class="muted">No interns.</td></tr>'}</table>`,`<button class="btn club s" onclick="hireIntern()">Hire intern (${fmtM(20)})</button>`);
  if(c==='delegation')return st+panel('Delegate to assistants',[['classes','Trainee classes','Automatically put each trainee in the class for their weakest skill'],['schedules','Group schedules','Rest tired groups, otherwise book brand deals or fan meetings'],['renewals','Contract renewals','Offer each idol their demand 6 months before expiry'],['offers','Transfer offers','Reject rival bids unless they pay 1.5× value']].map(([k,l,d])=>`<div class="news"><div class="row"><div class="f1"><b>${l}</b><div class="muted xs">${d}</div></div><div class="seg"><button class="${S.delegate[k]?'':'on'}" onclick="setDelegate('${k}',false)">Me</button><button class="${S.delegate[k]?'on':''}" onclick="setDelegate('${k}',true)">Assistant</button></div></div></div>`).join(''));
  return st+poach+panel(`Departments · wage bill ${fmtM(wage)}/wk`,`<div class="tw"><table><tr><th>Role</th><th>Head</th><th>Trait</th><th>Rating</th><th>Assistant</th><th>Contract</th><th></th></tr>${Object.entries(STAFF).map(([k,[n,e]])=>{const s=S.staff[k];return `<tr><td><b>${n}</b><div class="xs muted">${e}</div></td><td>${s?esc(s.name)+` <span class="muted xs">${fmtM(s.wage)}/wk</span>`:'<span class="pill r">Vacant</span>'}</td><td>${s?`<span class="pill c" title="${TRAITS[s.trait]}">${s.trait}</span>`:''}</td><td>${s?stars(s.rating):''}</td><td class="sm">${s?(s.asst?`${esc(s.asst.name)} ${stars(s.asst.rating)} <button class="btn s dan" onclick="fire('${k}',true)">✕</button>`:`<button class="btn s" onclick="showHire('${k}',true)">+ Assistant</button>`):''}</td><td class="sm">${s?'to '+dateStr(s.end):''}</td><td>${s?`<button class="btn s" onclick="showHire('${k}')">Replace</button> <button class="btn s dan" onclick="if(this.dataset.c)fire('${k}');else{this.dataset.c=1;this.textContent='Sure?'}">Fire</button>`:`<button class="btn pri s" onclick="showHire('${k}')">Hire</button>`}</td></tr>`}).join('')}</table></div>`,'',true)+`<p class="muted xs">Traits: ${Object.entries(TRAITS).map(([k,v])=>`<b>${k}</b> ${v}`).join(' · ')}. Firing costs 2 weeks' wages; an assistant steps up if you fire the head.</p>`;
}
// ================= FINANCES =================
function lineChart(h,col='var(--club2)'){if(h.length<2)return '<p class="muted sm">History appears after a couple of weeks.</p>';const mn=Math.min(...h,0),mx=Math.max(...h,1),W=600,H=120,sx=i=>i/(h.length-1)*W,sy=v=>H-(v-mn)/((mx-mn)||1)*H;
  return `<svg viewBox="0 0 ${W} ${H+4}" width="100%" height="140" preserveAspectRatio="none"><line x1="0" x2="${W}" y1="${sy(0)}" y2="${sy(0)}" stroke="#3a4560" stroke-dasharray="4 4"/><polyline fill="none" stroke="${col}" stroke-width="2.5" vector-effect="non-scaling-stroke" points="${h.map((v,i)=>sx(i)+','+sy(v)).join(' ')}"/></svg>`}
function vFinances(){
  const[c,st]=subtabs('finances',[['overview','Overview'],['streams','Revenue streams'],['loans','Loans & shares']]);
  const li=(o,cl)=>Object.entries(o||{}).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div class="stat"><span class="muted">${k}</span><span style="color:${cl}">${fmtM(v)}</span></div>`).join('')||'<p class="muted sm">—</p>';
  const yi=sum(Object.values(S.yfin.inc)),ye=sum(Object.values(S.yfin.exp));
  if(c==='loans')return st+`<div class="grid">${panel('Loans',`<p class="muted sm">Repaid weekly over 52 weeks at 8%. Max 2 active. The profit-minded board member dislikes debt.</p>${S.loans.map(l=>`<div class="stat"><span>${fmtM(l.amount)} loan</span><span>${fmtM(l.weekly)}/wk · ${l.left} wk left</span></div>`).join('')}<div class="row" style="margin-top:8px">${[500,1000,2000].map(a=>`<button class="btn pri" onclick="takeLoan(${a})">Borrow ${fmtM(a)}</button>`).join('')}</div>`)}
    ${panel('Share price',S.share?`<div class="kpi"><div><small>Price</small><b>₩${fmtN(S.share.price)}</b></div><div><small>Since IPO</small><b class="${S.share.price>=10000?'good':'bad'}">${((S.share.price/10000-1)*100).toFixed(1)}%</b></div></div>${lineChart(S.share.hist,'var(--good)')}`:'<p class="muted">The agency is private. Request an IPO from the Board.</p>')}</div>`;
  if(c==='streams'){const gs=myGroups();return st+panel('Merchandise & fan clubs',`<div class="tw"><table><tr><th>Group</th><th>Fans</th><th>Mood</th><th>Merch line</th><th>Fan club</th></tr>${gs.map(g=>`<tr><td><b>${esc(g.name)}</b></td><td>${fmtN(g.fans)}</td><td>${Math.round(g.mood)}</td><td><select onchange="setMerch(${g.id},+this.value)">${['None','Basic (₩50M)','Standard (₩120M)','Premium (₩250M)'].map((l,i)=>`<option value="${i}" ${(S.merch[g.id]||0)===i?'selected':''}>${l}</option>`).join('')}</select></td><td>${S.fanclub[g.id]?'<span class="pill g">Open</span>':`<button class="btn s pri" onclick="openFanclub(${g.id})" ${g.fans<20000?'disabled':''}>Open (${fmtM(50)})</button>`}</td></tr>`).join('')}</table></div><p class="muted xs">Merch earns weekly by fans × mood (setup cost first time only). Fan clubs pay yearly membership in January. All group income is shared with members by their contract split.</p>`,'',true)+panel(`${yearOf(S.week)} income by stream`,li(S.yfin.inc,'var(--good)'))}
  return st+panel(`Balance · ${fmtM(S.money)}`,lineChart(S.bal)+`<div class="xs muted">Last ${S.bal.length} weeks</div>`)+`<div class="grid">${panel(`Last week · ${fmtM((S.fin.ti||0)-(S.fin.te||0))} net`,`<h3 class="xs muted">INCOME ${fmtM(S.fin.ti||0)}</h3>${li(S.fin.inc,'var(--good)')}<h3 class="xs muted" style="margin-top:8px">EXPENSES ${fmtM(S.fin.te||0)}</h3>${li(S.fin.exp,'var(--bad)')}`)}${panel(`${yearOf(S.week)} so far · ${fmtM(yi-ye)} net`,`<h3 class="xs muted">INCOME ${fmtM(yi)}</h3>${li(S.yfin.inc,'var(--good)')}<h3 class="xs muted" style="margin-top:8px">EXPENSES ${fmtM(ye)}</h3>${li(S.yfin.exp,'var(--bad)')}`)}</div>`;
}
