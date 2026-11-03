// ================= NAV / SHELL =================
let ticked=new Set(),modalLock=false,survSel=new Set(),debutLock=false;
function nav(v,param=null){if(S.view===v&&S.param===param)return;S.hist.push([S.view,S.param]);S.hist=S.hist.slice(-40);S.fwd=[];S.view=v;S.param=param;closeSide();render();window.scrollTo(0,0)}
function back(){if(!S.hist.length)return;S.fwd.push([S.view,S.param]);[S.view,S.param]=S.hist.pop();render();window.scrollTo(0,0)}
function fwd(){if(!S.fwd.length)return;S.hist.push([S.view,S.param]);[S.view,S.param]=S.fwd.pop();render();window.scrollTo(0,0)}
function setSub(v,t){S.sub[v]=t;render()}
function openLink(l){if(!l)return;if(l[0]==='p'&&!isNaN(+l.slice(1)))return nav('person',+l.slice(1));if(l[0]==='g'&&!isNaN(+l.slice(1)))return nav('group',+l.slice(1));nav(l)}
function toggleSide(){document.querySelector('.side').classList.toggle('open');document.querySelector('.scrim').classList.toggle('open')}
function closeSide(){const s=document.querySelector('.side');if(s){s.classList.remove('open');document.querySelector('.scrim').classList.remove('open')}}
function stepDay(){
  S.day=(S.day||0)+1;
  if(S.day>6){advance();return{type:'week',rep:S.lastReport}}
  const show=runShow(S.day-1);
  if(conf()<5)S.over=true;save();return{type:'show',show};
}
function weekNotable(r){return r.rel.length||r.awards.length||r.goals.length||r.surv||r.tour.length||r.allkill.length}
function procOverlay(t){const pr=document.createElement('div');pr.className='proc';pr.innerHTML=`<div><span class="spin"></span>${t}</div>`;document.body.appendChild(pr);return pr}
function cont(){
  if(S.over)return showGameOver();closeModal();
  const pr=procOverlay('Processing…');
  setTimeout(()=>{const r=stepDay();pr.remove();render();
    if(S.over)return showGameOver();
    if(r.type==='week'){if(weekNotable(r.rep))showReport(r.rep)}
    else if(r.show&&(r.show.myPos||r.show.allkill))showShowResult(r.show)},40);
}
function contWeek(){
  if(S.over)return showGameOver();closeModal();
  const pr=procOverlay('Processing to next week…');
  setTimeout(()=>{const shows=[];let r;do{r=stepDay();if(r.type==='show'&&r.show)shows.push(r.show)}while(r.type!=='week'&&!S.over);
    pr.remove();render();if(S.over)return showGameOver();
    const rep=r.rep;rep.shows=shows;rep.allkill=[...rep.allkill,...shows.filter(s=>s.allkill).map(s=>s.allkill)];
    if(weekNotable(rep)||shows.some(x=>x.myPos))showReport(rep)},40);
}
function showShowResult(sh){
  const rows=sh.top.map((t,i)=>{const s=SG(t.id),g=G(s.groupId),me=g.agencyId===0;return `<tr class="${me?'me':''}"><td><b>${i===0?'🏆':i+1}</b></td><td><b>${esc(g.name)}</b><div class="xs muted">"${esc(s.title)}"</div></td><td style="text-align:right"><b>${fmtN(t.v)}</b></td></tr>`}).join('');
  const ms=sh.mine?SG(sh.mine):null,won=sh.myPos===1;
  const extra=sh.myPos>5&&ms?`<tr class="me"><td><b>${sh.myPos}</b></td><td><b>${esc(G(ms.groupId).name)}</b><div class="xs muted">"${esc(ms.title)}"</div></td><td></td></tr>`:'';
  openModal(M(`${sh.day} · ${sh.show}`,`<div style="text-align:center;padding:6px 0 12px"><div class="xs muted">${dayStr(S.week,S.day,true)}</div><div style="font-size:30px;font-family:'Barlow Condensed',sans-serif;font-weight:700;color:${won?'var(--good)':'#fff'}">${won?'🏆 WIN!':'#'+sh.myPos+' of '+sh.total}</div>${ms?`<div class="sm muted">"${esc(ms.title)}" – ${esc(G(ms.groupId).name)} · ${ms.wweek} win${ms.wweek===1?'':'s'} this week</div>`:''}${sh.allkill?'<div class="pill p" style="margin-top:6px">💥 ALL-KILL</div>':''}</div><table><tr><th>#</th><th>Artist</th><th style="text-align:right">Points</th></tr>${rows}${extra}</table>`,`<button class="btn" onclick="closeModal()">Close</button><button class="btn club" onclick="cont()">Continue ›</button>`));
}
function M(title,body,foot){return `<div class="mh"><h2>${title}</h2></div><div class="mc">${body}</div><div class="mf">${foot||'<button class="btn" onclick="closeModal()">Close</button>'}</div>`}
function openModal(h,lock){modalLock=!!lock;document.getElementById('mbox').innerHTML=h;document.getElementById('modal').classList.remove('hidden')}
function closeModal(){modalLock=false;document.getElementById('modal').classList.add('hidden')}
function okModal(t,b){openModal(M(t,`<p>${b}</p>`,'<button class="btn pri" onclick="closeModal()">OK</button>'))}
function toast(t){const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function load(){try{const d=localStorage.getItem(KEY);return d?JSON.parse(d):null}catch(e){return null}}
function resetGame(){try{localStorage.removeItem(KEY)}catch(e){}S=null;closeModal();renderSetup()}
function pay(c){if(S.money<c){toast('Not enough money ('+fmtM(c)+')');return false}S.money-=c;return true}
function done(){save();render()}
function removePerson(p){S.people=S.people.filter(x=>x!==p);S.groups.forEach(g=>{if(!g.members.includes(p.id))return;g.members=g.members.filter(i=>i!==p.id);if(g.leader===p.id)g.leader=g.members[0]||null;if(g.center===p.id)g.center=g.members[0]||null});ticked.delete(p.id)}
// ================= FIND =================
function openFind(){const f=document.getElementById('find');f.classList.remove('hidden');const i=document.getElementById('findq');i.value='';renderFind('');setTimeout(()=>i.focus(),30)}
function closeFind(){document.getElementById('find').classList.add('hidden')}
function renderFind(q){q=q.toLowerCase().trim();let res=[];
  if(q){res=[...S.groups.filter(g=>!g.disbanded&&g.name.toLowerCase().includes(q)).map(g=>({h:`<span style="font-size:20px">👥</span><div class="f1"><b>${esc(g.name)}</b><div class="xs muted">${esc(AG(g.agencyId).name)} · ${fmtN(g.fans)} fans</div></div>`,a:g.agencyId===0?`nav('group',${g.id})`:`showRival(${g.id})`})),
    ...S.people.filter(p=>p.name.toLowerCase().includes(q)||p.given.toLowerCase().includes(q)).slice(0,25).map(p=>({h:`${avatar(p,30)}<div class="f1"><b>${esc(p.given)}</b> <span class="xs muted">${esc(p.name)}</span><div class="xs muted">${p.status==='rival'?esc(G(p.groupId)?.name||'')+' · '+esc(AG(p.agencyId).name):p.status==='free'?'Free agent':p.status}</div></div>`,a:p.agencyId===0?`nav('person',${p.id})`:`showPerson(${p.id})`})),
    ...TABS_ALL.filter(t=>t[1].toLowerCase().includes(q)).map(t=>({h:`<span style="font-size:18px">${t[2]}</span><b>${t[1]}</b>`,a:`nav('${t[0]}')`}))].slice(0,30)}
  document.getElementById('findr').innerHTML=res.map(r=>`<div class="fi" onclick="closeFind();${r.a}">${r.h}</div>`).join('')||`<div class="fi muted">${q?'No results':'Type a name: idol, group, actor or screen…'}</div>`;
}
document.addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'&&S){e.preventDefault();openFind();return}
  if(e.key==='Escape'){closeFind();if(!modalLock)closeModal()}
  if(e.key===' '&&S&&!S.over&&document.getElementById('modal').classList.contains('hidden')&&document.getElementById('find').classList.contains('hidden')&&!['INPUT','SELECT','TEXTAREA'].includes(document.activeElement.tagName)){e.preventDefault();cont()}
});
// ================= TRAINEES / GROUPS =================
function tick(id,on){on?ticked.add(id):ticked.delete(id);const el=document.getElementById('tickbar');if(el)el.outerHTML=tickBar()}
function tickBar(){
  const n=ticked.size,gs=myGroups();
  if(!n)return '<div id="tickbar"></div>';
  return `<div id="tickbar" class="tickbar"><div class="row wrap"><b>${n} selected</b><span class="f1"></span><button class="btn club" onclick="showDebut()" ${n<3||n>9?'disabled':''}>Form new group</button>
  ${gs.length?`<select id="addG">${gs.map(g=>`<option value="${g.id}">${esc(g.name)}</option>`).join('')}</select><button class="btn pri" onclick="addToGroup()">Add to group</button>`:''}<button class="btn" onclick="showPredebut()" ${S.predebut?'disabled':''}>Pre-debut series</button><button class="btn s" onclick="ticked.clear();render()">Clear</button></div>${n<3?'<div class="muted xs" style="margin-top:4px">Tick 3–9 to form a new group.</div>':''}</div>`;
}
function addToGroup(){
  const g=G(+document.getElementById('addG').value);
  if(g.members.length+ticked.size>12)return toast('Max 12 members');
  const ids=[...ticked].filter(id=>P(id)&&!g.members.includes(id));
  ids.forEach(id=>{const p=P(id);p.status='idol';p.groupId=g.id;p.focus='all';g.members.push(id);p.morale=clamp(p.morale+15,0,100);if(!p.contract||!p.contract.end)newContract(p);g.fans+=p.prefans||0;p.prefans=0});
  mail(`New members join ${g.name}`,`${ids.map(i=>esc(P(i).given)).join(', ')} joined ${g.name}.`,'news','g'+g.id);
  ticked.clear();done();
}
function showPredebut(){const ids=[...ticked].filter(i=>P(i)&&P(i).status==='trainee');if(!ids.length)return toast('Tick trainees first');
  openModal(M('Pre-debut series',`<p class="muted sm">A 4-week web series following ${ids.length} trainee(s). Builds pre-fans (based on Visuals and Variety) that carry over when they debut. Cost ${fmtM(150)}.</p><label>Series title</label><input id="pdt" style="width:100%" value="${pick(['Trainee Diaries','Road to Debut','Before the Light','Project Zero'])}">`,`<button class="btn" onclick="closeModal()">Cancel</button><button class="btn club" onclick="startPredebut()">Produce</button>`))}
function startPredebut(){const ids=[...ticked].filter(i=>P(i)&&P(i).status==='trainee');if(!pay(150))return;S.predebut={title:pdt.value||'Trainee Diaries',ids,ep:0};mail('Pre-debut series greenlit',`"${esc(S.predebut.title)}" starts next week.`);closeModal();done()}
function lineupPlanner(ids){
  if(!ids.length)return '';const ps=ids.map(P);const best=k=>Math.max(...ps.map(p=>p.attrs[k]));
  const fake={members:ids};const bc=CK.map(c=>[c,groupSkill(fake,c)]).sort((a,b)=>b[1]-a[1])[0];
  const chk=(l,k)=>{const v=best(k);return `<div class="stat"><span>${l}</span><span>${aNum(v)} ${v>=11?'<span class="good">✓</span>':'<span class="bad">✗</span>'}</span></div>`};
  const visA=avg(ps.map(p=>p.attrs.vis)),c=chemPct(chem(ids));
  return `<div class="panel" style="margin-top:10px"><div class="ph"><h2>Lineup planner</h2></div><div class="pb"><div class="kpi"><div><small>Chemistry</small><b class="${c>=55?'good':c<45?'bad':''}">${c}%</b></div><div><small>Visual avg</small><b>${visA.toFixed(1)}</b></div><div><small>Best concept</small><b style="font-size:15px">${bc[0]} ${bc[1].toFixed(1)}</b></div><div><small>Pre-fans</small><b>${fmtN(sum(ps.map(p=>p.prefans||0)))}</b></div></div>
  ${chk('Main Vocal','voc')}${chk('Main Dancer','dan')}${chk('Main Rapper','rap')}${chk('Visual','vis')}${chk('Center (Stage)','stg')}</div></div>`;
}
function releaseForm(g,opts={}){
  const fit=c=>g.members.length?groupSkill(g,c).toFixed(1):'–';
  const ls=lastSong(g);const canRe=ls&&['Mini','Full'].includes(ls.type)&&S.week-ls.week<=10;
  return `<label>Song</label><select id="rdemo" style="width:100%" onchange="const d=S.demos.find(x=>x.id==this.value);if(d){rtitle.value=d.title;rconcept.value=d.concept}"><option value="">Outsource a song (unknown quality)</option>${S.demos.map(d=>{const pr=S.producers.find(x=>x.id===d.prod);const ch=pr&&g.id?(pr.chem[g.id]||0):0;return `<option value="${d.id}">"${esc(d.title)}" · ${d.concept} · ${grade(d.quality)} ${d.quality}${d.hit?' ★hit':''}${ch?' · chem +'+ch:''}</option>`}).join('')}</select>
  <label>Title</label><div class="row"><input id="rtitle" value="${esc(songName())}" class="f1"><button class="btn" onclick="rtitle.value=songName()">🎲</button></div>
  <div class="row wrap"><div class="f1"><label>Concept <span class="pill w">Trend ${S.trend}</span></label><select id="rconcept" style="width:100%">${CK.map(c=>`<option ${c===S.trend?'selected':''} value="${c}">${c} — fit ${fit(c)}${c===S.trend?' 🔥':''}${g.streak&&g.streak.c===c?' (streak '+g.streak.n+')':''}</option>`).join('')}</select></div>
  <div class="f1"><label>Album type</label><select id="rtype" style="width:100%">${Object.entries(ALBUM).map(([k,a])=>`<option value="${k}" ${k==='Mini'?'selected':''} ${k==='Repackage'&&!canRe?'disabled':''}>${a.n} · ${a.prep} wk prep</option>`).join('')}</select></div></div>
  <div class="row wrap"><div class="f1"><label>Budget</label><select id="rbudget" style="width:100%">${Object.entries(BUDGET).map(([k,b])=>`<option value="${k}" ${k==='Standard'?'selected':''}>${k} — ${fmtM(b.cost*prodScale(g))} base</option>`).join('')}</select></div>
  <div class="f1"><label>Line distribution</label><select id="rlines" style="width:100%">${Object.entries(LINES).map(([k,l])=>`<option value="${k}">${l[0]}</option>`).join('')}</select></div></div>
  <p class="muted xs">Budget scales with album type (Single ×0.6, Full ×1.6, Repackage ×0.5) and with the group's size (bigger stars, bigger MVs). Line distribution: ${Object.values(LINES).map(l=>`<b>${l[0]}</b> – ${l[1]}`).join('; ')}. ${SEASONL[season(S.week)]?SEASONL[season(S.week)]+' active.':''}</p>`;
}
const prodScale=g=>g&&g.fans?clamp(1+Math.log10(Math.max(1,g.fans/50000))*0.8,1,3):1;
function readRelease(g){const d=S.demos.find(x=>x.id==rdemo.value)||null,t=rtype.value;return{title:rtitle.value.trim()||songName(),concept:rconcept.value,budget:rbudget.value,demo:d,type:t,lines:rlines.value,weeks:ALBUM[t].prep,cost:Math.round(BUDGET[rbudget.value].cost*ALBUM[t].cost*prodScale(g))}}
function showDebut(){
  const ids=[...ticked].filter(id=>{const p=P(id);return p&&(p.status==='trainee'||(p.status==='idol'&&!p.groupId))});
  if(ids.length<3||ids.length>9)return toast('Tick 3–9 trainees first');
  openModal(M('Form a new group',`<div class="mem">${ids.map(i=>`<div>${avatar(P(i),44)}<div>${esc(P(i).given)}</div></div>`).join('')}</div>${lineupPlanner(ids)}
  <label>Group name</label><div class="row"><input id="dname" value="${freeName()}" class="f1"><button class="btn" onclick="dname.value=freeName()">🎲</button></div>
  ${releaseForm({members:ids})}<p class="muted sm">Debut costs ${fmtM(500)} + production. Members sign 7-year contracts at a 10% split.</p>`,
  `<button class="btn" onclick="closeModal()">Cancel</button><button class="btn club" onclick="confirmDebut()">Debut ${ids.length} members</button>`));
}
function confirmDebut(){
  const ids=[...ticked].filter(id=>P(id)),r=readRelease();if(r.type==='Repackage')return toast('A debut cannot be a repackage');
  if(!pay(500+r.cost))return;
  if(r.demo)S.demos=S.demos.filter(x=>x!==r.demo);
  const g=newGroupObj(dname.value.trim()||freeName(),ids,Math.round(2000+S.rep*500));g.debutWeek=S.week+r.weeks;g.prep={...r};
  S.groups.push(g);ticked.clear();
  mail(`${g.name} debut announced`,`Teasers are out! ${g.name} debut in ${r.weeks} weeks with "${esc(r.title)}". Fandom name: <b>${g.fandom}</b>.`,'release','g'+g.id);
  closeModal();save();nav('group',g.id);
}
function showComeback(gid){const g=G(gid);openModal(M(`${esc(g.name)} · Comeback planner`,`<p class="muted sm">Preparation, then a 4-week promotion cycle with 6 music shows a week (Tue–Sun). Condition ${Math.round(gCond(g))}% · Chemistry ${chemPct(chem(g.members))}%.</p>${releaseForm(g)}`,`<button class="btn" onclick="closeModal()">Cancel</button><button class="btn club" onclick="confirmComeback(${gid})">Start preparation</button>`))}
function confirmComeback(gid){const g=G(gid),r=readRelease(g);if(!pay(r.cost))return;if(r.demo)S.demos=S.demos.filter(x=>x!==r.demo);g.prep={...r};mail(`${g.name} comeback confirmed`,`The ${ALBUM[r.type].n.toLowerCase()} "${esc(r.title)}" (${r.concept}) drops in ${r.weeks} weeks.`,'release','g'+g.id);closeModal();done()}
function gset(gid,k,v){G(gid)[k]=v;done()}
function showSubunit(gid){const g=G(gid);openModal(M(`Create a ${esc(g.name)} sub-unit`,`<p class="muted sm">Pick 2–4 members. The unit starts with 30% of ${esc(g.name)}'s fandom and promotes separately.</p>${members(g).map(p=>`<label class="opt" style="text-transform:none;letter-spacing:0;font-size:13px;color:var(--text)"><input type="checkbox" class="suck" value="${p.id}">${avatar(p,30)}<b>${esc(p.given)}</b> <span class="muted">${role(p)}</span></label>`).join('')}<label>Unit name</label><input id="sun" style="width:100%" value="${esc(g.name)} ${pick(['UNIT','S','X','Duo','Vocal Line','Dance Line'])}">`,`<button class="btn" onclick="closeModal()">Cancel</button><button class="btn club" onclick="createSubunit(${gid})">Create (${fmtM(100)})</button>`))}
function createSubunit(gid){const g=G(gid),ids=[...document.querySelectorAll('.suck:checked')].map(x=>+x.value);if(ids.length<2||ids.length>4)return toast('Pick 2–4 members');if(!pay(100))return;
  const u=mkGroup(sun.value.trim()||g.name+' UNIT',0,Math.round(g.fans*0.3),g.gender);u.members=ids;u.parent=gid;u.fandom=g.fandom;u.color=g.color;u.lore=g.lore;u.reg={...g.reg};u.leader=ids[0];u.center=ids[0];u.debutWeek=S.week+3;S.groups.push(u);
  mail(`Sub-unit announced: ${u.name}`,`${ids.map(i=>esc(P(i).given)).join(' & ')} form ${esc(g.name)}'s new unit. Plan their debut in the comeback planner.`,'release','g'+u.id);closeModal();save();nav('group',u.id)}
function showIdentity(gid){const g=G(gid);openModal(M(`${esc(g.name)} identity`,`<label>Fandom name</label><input id="idf" style="width:100%" value="${esc(g.fandom)}"><label>Lightstick colour</label><input id="idc" type="color" value="${g.color}"><label>Story world</label><input id="idl" style="width:100%" value="${esc(g.lore)}"><p class="muted xs">Releasing the same concept back-to-back builds an identity streak (+2 hype per release, up to +6).</p>`,`<button class="btn" onclick="closeModal()">Cancel</button><button class="btn pri" onclick="const g=G(${gid});g.fandom=idf.value||g.fandom;g.color=idc.value;g.lore=idl.value||g.lore;closeModal();done()">Save</button>`))}
function disband(gid){const g=G(gid);openModal(M(`Disband ${esc(g.name)}?`,`<p>This is permanent. Members become unassigned idols and fans will be upset.</p>`,`<button class="btn" onclick="closeModal()">Cancel</button><button class="btn dan" onclick="disbandGroup(${gid});closeModal();save();nav('groups')">Disband</button>`))}
function setMerch(gid,t){const c=[0,50,120,250][t];if(t&&!S.merch[gid]&&!pay(c))return;S.merch[gid]=t;done()}
function openFanclub(gid){if(!pay(50))return;S.fanclub[gid]=true;const g=G(gid);const v=g.fans*0.05*(g.mood/70)*0.01*share(g);S.money+=v;mail(`${g.fandom} fan club opens`,`Official ${esc(g.fandom)} membership launched, bringing in ${fmtM(v)}. It renews every January.`);done()}
// tours
function bestVenue(g,r){const rf=regFans(g,r)*0.12;let v='Hall';Object.entries(VENUES).forEach(([k,x])=>{if(rf>=x.cap*0.7)v=k});return v}
function showTour(){const gs=myGroups().filter(g=>g.songs.length&&!g.prep&&!touring(g));if(!gs.length)return toast('No group is free to tour');
  openModal(M('Plan a tour',`<label>Group</label><select id="tg" style="width:100%" onchange="showTourCities()">${gs.map(g=>`<option value="${g.id}">${esc(g.name)} (${fmtN(g.fans)} fans)</option>`).join('')}</select><label>Tour name</label><input id="tn" style="width:100%" value="${pick(['WORLD TOUR','ASIA TOUR','1ST CONCERT','ON STAGE'])}"><label>Cities (one show per week, max 8)</label><div id="tcities"></div><p class="muted xs">Venue size is chosen from regional fans. Overseas cities need that market entered (Global). Tickets: agency takes ₩20,000 each.</p>`,`<button class="btn" onclick="closeModal()">Cancel</button><button class="btn club" onclick="startTour()">Announce tour</button>`));showTourCities()}
function showTourCities(){const g=G(+tg.value);tcities.innerHTML=CITIES.map(([c,r],i)=>{const ok=r==='kr'||S.markets[r];const v=bestVenue(g,r),sold=Math.round(Math.min(VENUES[v].cap,regFans(g,r)*0.12+500));return `<label class="opt" style="text-transform:none;letter-spacing:0;font-size:13px;color:var(--text);${ok?'':'opacity:.4'}"><input type="checkbox" class="tck" value="${i}" ${ok?'':'disabled'}><b class="f1">${c}</b><span class="muted">${v} · ~${fmtN(sold)}/${fmtN(VENUES[v].cap)} · ${fmtM(sold*0.02-VENUES[v].cost)}</span></label>`}).join('')}
function startTour(){const g=G(+tg.value),idx=[...document.querySelectorAll('.tck:checked')].map(x=>+x.value);if(!idx.length||idx.length>8)return toast('Pick 1–8 cities');
  S.tours.push({id:nid(),gid:g.id,name:`${g.name} ${tn.value||'TOUR'}`,stops:idx.map(i=>({city:CITIES[i][0],r:CITIES[i][1],venue:bestVenue(g,CITIES[i][1])})),idx:0,rev:0,start:S.week+1});
  mail(`🎫 ${g.name} tour announced`,`${idx.length} shows starting next week.`,'release','schedule');closeModal();done()}
// ================= PEOPLE =================
function setFocus(id,v){P(id).focus=v;done()}
function showRenew(id){const p=P(id),d=demand(p);if(p.renewBlock&&p.renewBlock>S.week)return toast(`${p.given}'s camp won't talk until week ${wkOf(p.renewBlock)}`);
  openModal(M(`Renew ${esc(p.given)}`,`<div class="stat"><span>Current split</span><b>${p.contract.split}%</b></div><div class="stat"><span>Expected demand</span><b>~${d}%</b></div><div class="stat"><span>Personality</span><span>${persLabel(p)}</span></div>
  <label>Idol revenue split (%)</label><input id="rs" type="number" min="5" max="70" value="${d}" style="width:100%" oninput="rch.textContent=Math.round(renewChance(P(${id}),+rs.value,+ry.value)*100)+'%'">
  <label>Length</label><select id="ry" style="width:100%" onchange="rch.textContent=Math.round(renewChance(P(${id}),+rs.value,+ry.value)*100)+'%'">${[2,3,5,7].map(y=>`<option value="${y}" ${y===3?'selected':''}>${y} years</option>`).join('')}</select>
  <p>Acceptance chance: <b id="rch">${Math.round(renewChance(p,d,3)*100)}%</b></p><p class="muted xs">A higher split costs you a share of this idol's group income. Loyalty and morale help.</p>`,`<button class="btn" onclick="closeModal()">Cancel</button><button class="btn club" onclick="const ok=tryRenew(P(${id}),+rs.value,+ry.value);closeModal();done();okModal(ok?'Renewal signed ✍':'Offer rejected',ok?'${esc(p.given)} is staying.':'They want more. Try again in 4 weeks.')">Offer</button>`))}
function removeFromGroup(id){const p=P(id),g=G(p.groupId);if(g.members.length<=2)return toast('A group needs at least 2 members');g.members=g.members.filter(i=>i!==id);if(g.leader===id)g.leader=g.members[0];if(g.center===id)g.center=g.members[0];p.groupId=null;p.morale-=15;g.mood-=8;mail(`${p.given} leaves ${g.name}`,`${esc(p.name)} is now an unassigned idol.`);closeModal();done()}
function releaseContract(id){const p=P(id);openModal(M(`Release ${esc(p.given)}?`,`<p>Their contract will be terminated${p.status!=='trainee'?` (buyout ${fmtM(30)})`:''}.</p>`,`<button class="btn" onclick="closeModal()">Cancel</button><button class="btn dan" onclick="const p=P(${id});if(p.status!=='trainee'&&!pay(30))return;if(p.groupId){const g=G(p.groupId);if(g)g.mood-=10}removePerson(p);mail('Contract ended','${esc(p.name)} has been released.');closeModal();save();nav('trainees')">Release</button>`))}
function grantHome(id,yes){const p=P(id);p.wantsHome=false;if(yes){p.ownHome=true;p.dormId=null;p.morale+=10;mail(`${p.given} moves out`,`${esc(p.name)} now lives in their own place (₩3M/week allowance).`)}else{p.morale-=10}done()}
// ================= DORMS =================
const dormMax=()=>S.board.hq?8:6;
function dormUp(id){const d=D(id),c=150*d.q;if(d.q>=5)return;if(!pay(c))return;d.q++;done()}
function dormBeds(id){const d=D(id);if(d.beds>=4+d.q*3)return toast('Upgrade quality to fit more beds');if(!pay(60))return;d.beds+=2;done()}
function dormNew(){if(S.dorms.length>=dormMax())return toast('Max dorms reached');if(!pay(500))return;S.dorms.push({id:nid(),name:['Main','Hannam','Seongsu','Mapo','Gangnam','Itaewon','Yeouido','Jamsil'][S.dorms.length]+' Dorm',q:1,beds:6});done()}
function moveDorm(pid,did){const p=P(pid);p.dormId=+did;assignDorm2(p);done()}
function assignDorm2(p){const d=D(p.dormId),rooms=Math.ceil(d.beds/2);for(let r=0;r<rooms;r++){if(mine().filter(x=>x.dormId===d.id&&x.room===r&&x!==p).length<2){p.room=r;return}}p.room=0}
function moveRoom(pid,r){P(pid).room=+r;done()}
function setRule(k,v){S.rules[k]=v;done()}
// ================= ACTORS =================
function signActor(i){const a=S.actorPool[i];if(!pay(a.cost))return;delete a.cost;joinAgency(a);S.actorPool.splice(i,1);mail('Actor signed: '+a.name,`${esc(a.name)} joined your acting division.`);closeModal();done()}
function castChance(p,r){const fame=fameOf(p);return clamp(0.3+(p.attrs.act-r.req)*0.08+Math.log10(fame+10)*0.03+sf('act')*0.15+sf('casting')*0.1+(p.image-60)/200+(hasTrait('Networker')?0.05:0),0.05,0.95)}
function showCast(rid){
  const r=S.roles.find(x=>x.id===rid);
  const c=mine().filter(p=>(p.status==='actor'||p.status==='idol')&&avail(p)&&p.g===r.g&&!r.tried.includes(p.id));
  openModal(M(esc(r.title),`<p class="muted sm">${r.type} · ${r.net} · <b>${TIERS[r.tier]}</b> tier · <b>${r.part}</b> (${r.g==='F'?'female':'male'})${r.costar?' opposite '+esc(r.costar):''} · Acting ${r.req}+ · ${r.weeks} weeks · Fee ${fmtM(r.fee)}</p>
  ${c.map(p=>{const ok=r.tier<=p.tier+1,ch=castChance(p,r);return `<div class="opt" ${ok?`onclick="audition(${rid},${p.id})"`:'style="opacity:.45"'}>${avatar(p,34)}<div class="f1"><b>${esc(p.given)}</b> <span class="muted xs">${p.status==='actor'?'Actor':'Idol'} · ${TIERS[p.tier]} tier</span><div class="sm">Acting ${aNum(p.attrs.act)} · Image ${Math.round(p.image)}</div></div>${ok?`<span class="pill ${ch>0.6?'g':ch>0.3?'w':'r'}">${Math.round(ch*100)}%</span>`:'<span class="pill">Tier too high</span>'}</div>`}).join('')||'<p class="muted">No available actors or idols of the right gender.</p>'}`));
}
function audition(rid,pid){
  const r=S.roles.find(x=>x.id===rid),p=P(pid);
  if(Math.random()<castChance(p,r)){
    const d={id:nid(),title:r.title,type:r.type,tier:r.tier,net:r.net,part:r.part,prest:r.prest,pid,costar:r.costar,score:null,aired:null,newc:!p.dramas,idol:p.status==='idol',year:yearOf(S.week)};
    S.dramas.unshift(d);p.dramas=(p.dramas||0)+1;p.busy={kind:'film',until:S.week+r.weeks,dramaId:d.id};S.money+=r.fee;S.roles=S.roles.filter(x=>x!==r);
    mail(`🎬 ${p.given} cast in "${r.title}"`,`${esc(p.name)} landed the ${r.part.toLowerCase()} role. Fee ${fmtM(r.fee)}. Filming ${r.weeks} weeks.`,'release','actors');
    okModal('Cast! 🎬',`<b>${esc(p.given)}</b> landed the ${r.part.toLowerCase()} role in "${esc(r.title)}". ${fmtM(r.fee)} received.`);
  }else{r.tried.push(pid);openModal(M('Not this time',`<p>The director passed on ${esc(p.given)}.</p>`,`<button class="btn" onclick="showCast(${rid})">Back</button>`))}
  save();render();
}
function cfRespond(id,yes){const c=S.cfOffers.find(x=>x.id===id);S.cfOffers=S.cfOffers.filter(x=>x!==c);if(yes){S.cfs.push({pid:c.pid,brand:c.brand,weekly:c.weekly,until:S.week+c.weeks});const p=P(c.pid);p.image=clamp(p.image+2,0,100);mail(`📸 ${p.given} × ${c.brand}`,`A 12-week endorsement at ${fmtM(c.weekly)}/week.`)}done()}
// ================= STUDIO =================
function hireProducer(i){const p=S.prodPool[i];if(!pay(p.wage*4))return;S.producers.push(p);S.prodPool.splice(i,1);mail('Producer hired',`${esc(p.name)} joins the studio (${p.styles.join('/')}).`);closeModal();done()}
function fireProducer(id){const p=S.producers.find(x=>x.id===id);S.producers=S.producers.filter(x=>x!==p);S.money-=p.wage*2;done()}
function songCamp(){if(S.demos.length>7)return toast('Demo bank too full');if(!pay(250))return;for(let i=0;i<3;i++)S.demos.push(newDemo(S.producers.length?pick(S.producers):null,-2));mail('Song camp complete','Three new demos arrived from the songwriting camp.');done()}
function buyForeign(){if(S.demos.length>9)return toast('Demo bank full');if(!pay(300))return;const d=newDemo(null,22,{foreign:true,credit:pick(['Swedish pop team','LA topliners','London hitmakers'])});S.demos.push(d);mail('Foreign song acquired',`"${esc(d.title)}" (${d.concept}) rated ${grade(d.quality)} (${d.quality}).`);done()}
function showCowrite(){const ids=idols().filter(avail);if(!ids.length||!S.producers.length)return toast('Need an available idol and a producer');
  openModal(M('Idol co-write session',`<p class="muted sm">An idol writes with a producer. Their credit boosts authenticity: group fan mood rises when it's released. Cost ${fmtM(40)}.</p><label>Idol</label><select id="cwi" style="width:100%">${ids.map(p=>`<option value="${p.id}">${esc(p.given)} (VOC ${Math.floor(p.attrs.voc)} / RAP ${Math.floor(p.attrs.rap)} · ${p.credits} credits)</option>`).join('')}</select><label>Producer</label><select id="cwp" style="width:100%">${S.producers.map(p=>`<option value="${p.id}">${esc(p.name)} (skill ${p.skill})</option>`).join('')}</select>`,`<button class="btn" onclick="closeModal()">Cancel</button><button class="btn club" onclick="doCowrite()">Write</button>`))}
function doCowrite(){const p=P(+cwi.value),pr=S.producers.find(x=>x.id==cwp.value);if(!pay(40))return;const d=newDemo(pr,(p.attrs.voc+p.attrs.rap)/2-8+p.credits,{idol:p.id});d.credits.push(p.given);S.demos.push(d);p.morale+=4;mail('Co-write finished',`${esc(p.given)} and ${esc(pr.name)} wrote "${esc(d.title)}" (${grade(d.quality)} ${d.quality}).`);closeModal();done()}
function sellDemo(id){const d=S.demos.find(x=>x.id===id),price=Math.round(d.quality*d.quality/25);S.money+=price;S.demos=S.demos.filter(x=>x!==d);mail(`Song sold: "${d.title}"`,`${pick(S.agencies.slice(1)).name} bought it for <b>${fmtM(price)}</b>.`);done()}
function jpVersion(sid){const s=SG(sid),g=G(s.groupId);if(!S.markets.jp)return toast('Enter the Japanese market first');if(!pay(60))return;s.jp=true;const j=releaseSong(g,s.title+' (Japanese ver.)',s.quality,4,S.week,{type:'JP'});const v=Math.round(30+regFans(g,'jp')/2000);S.money+=v;addReg(g,'jp',regFans(g,'jp')*0.1+3000);mail('Japanese version released',`"${esc(j.title)}" brought in ${fmtM(v)} and new Japanese fans.`);done()}
function remix(sid){const s=SG(sid);if(!pay(50))return;s.remix=3;s.remixed=true;mail('Remix released',`A remix of "${esc(s.title)}" pushes it back up the chart.`);done()}
function ostRespond(id,yes){const o=S.ostOffers.find(x=>x.id===id);S.ostOffers=S.ostOffers.filter(x=>x!==o);if(yes){const p=P(o.pid),g=G(p.groupId);if(!g)return done();const s=releaseSong(g,`${songName()} (${o.drama} OST)`,clamp(p.attrs.voc*4+R(0,12),10,95),2,S.week,{type:'OST',credits:['Drama OST team']});S.money+=o.fee;p.image=clamp(p.image+3,0,100);mail(`🎵 ${p.given} sings "${o.drama}" OST`,`"${esc(s.title)}" is out. Fee ${fmtM(o.fee)}.`)}done()}
// ================= MARKET =================
function bidChance(p,amt){const ag=AG(p.agencyId);return clamp((amt/value(p)-0.85)*1.6+(S.rep-ag.rep)/150+0.1,0.02,0.95)}
function agentChance(p,split){return clamp(0.5+(split-demand(p))/12+(S.rep-AG(p.agencyId).rep)/200+sf('legal')*0.06,0.03,0.97)}
function showBid(pid){
  const p=P(pid),v=value(p),d=demand(p);
  const upd=`bch.textContent=Math.round(bidChance(P(${pid}),+bamt.value)*100)+'%';ach.textContent=Math.round(agentChance(P(${pid}),+bsp.value)*100)+'%'`;
  openModal(M(`Bid for ${esc(p.given)}`,`<div class="row">${avatar(p,52)}<div><b>${esc(p.name)}</b><div class="muted sm">${esc(G(p.groupId)?.name||'')} · ${esc(AG(p.agencyId).name)} · Value ${fmtM(v)}</div><div class="sm">${stars(ovr(p))} · Age ${p.age}</div></div></div>
  <label>Step 1 · Transfer fee to ${esc(AG(p.agencyId).name)} (₩M)</label><input id="bamt" type="number" value="${v}" step="10" style="width:100%" oninput="${upd}"><div class="sm">Agency accepts: <b id="bch">${Math.round(bidChance(p,v)*100)}%</b></div>
  <label>Step 2 · Contract split for the idol's agent (%)</label><input id="bsp" type="number" value="${d}" style="width:100%" oninput="${upd}"><div class="sm">Agent accepts: <b id="ach">${Math.round(agentChance(p,d)*100)}%</b> <span class="muted">(demand ~${d}%)</span></div>`,
  `<button class="btn" onclick="closeModal()">Cancel</button><button class="btn club" onclick="doBid(${pid})">Submit bid</button>`));
}
function doBid(pid){
  const p=P(pid),amt=+bamt.value,sp=+bsp.value,g=G(p.groupId);
  if(!(amt>0)||S.money<amt)return toast('Not enough money');
  if(p.bidBlock&&p.bidBlock>S.week)return toast(`They won't talk until week ${wkOf(p.bidBlock)}`);
  if(Math.random()>bidChance(p,amt)){p.bidBlock=S.week+4;return okModal('Bid rejected',`${esc(AG(p.agencyId).name)} turned down the fee and won't negotiate for 4 weeks.`)}
  if(Math.random()>agentChance(p,sp)){p.bidBlock=S.week+4;return okModal('Agent said no',`The agency accepted, but ${esc(p.given)}'s agent rejected a ${sp}% split.`)}
  S.money-=amt;g.members=g.members.filter(i=>i!==pid);p.status='idol';p.agencyId=0;p.groupId=null;p.morale=75;p.joined=S.week;p.contract={end:S.week+5*52,split:sp,salary:Math.round(4+sp/4),signed:S.week};assignDorm(p);
  mail(`✍ ${p.given} signs with ${S.agency}`,`Signed from ${esc(AG(g.agencyId).name)} for <b>${fmtM(amt)}</b> at a ${sp}% split. Add them to a group from <b>Trainees</b>.`,'offer','p'+p.id);
  okModal('Deal done ✍',`${esc(p.given)} is now an unassigned idol. Tick them in <b>Trainees</b> to add them to a group.`);done();
}
function showFree(pid){const p=P(pid),d=demand(p),bonus=Math.round(value(p)*0.3);
  openModal(M(`Sign free agent ${esc(p.given)}`,`<p class="muted sm">${stars(ovr(p))} · ${role(p)} · Age ${p.age} · ${persLabel(p)}</p><div class="stat"><span>Signing bonus</span><b>${fmtM(bonus)}</b></div><label>Split offered (%)</label><input id="fsp" type="number" value="${d}" style="width:100%" oninput="fch.textContent=Math.round(clamp(0.55+(+this.value-${d})/12,0.03,0.97)*100)+'%'"><p>Acceptance: <b id="fch">55%</b></p>`,`<button class="btn" onclick="closeModal()">Cancel</button><button class="btn club" onclick="signFree(${pid},${bonus})">Offer</button>`))}
function signFree(pid,bonus){const p=P(pid),sp=+fsp.value;if(S.money<bonus)return toast('Not enough money');if(Math.random()>clamp(0.55+(sp-demand(p))/12,0.03,0.97)){p.freeUntil=Math.min(p.freeUntil,S.week+1);closeModal();return okModal('Rejected',`${esc(p.given)} chose to look elsewhere.`)}
  S.money-=bonus;S.free=S.free.filter(i=>i!==pid);p.status=p.attrs.act>ovr(p)+3?'actor':'idol';p.agencyId=0;p.groupId=null;p.morale=75;p.joined=S.week;p.contract={end:S.week+4*52,split:sp,salary:Math.round(4+sp/4),signed:S.week};if(p.status!=='actor')assignDorm(p);mail(`✍ Free agent ${p.given} signs`,`${esc(p.name)} joined on a 4-year deal.`,'offer','p'+p.id);closeModal();done()}
function respondOffer(oid,accept,quiet){
  const o=S.offers.find(x=>x.id===oid);if(!o)return;const p=P(o.pid);S.offers=S.offers.filter(x=>x!==o);
  if(!p)return done();
  if(accept){
    const g=G(p.groupId);if(g&&g.members.length<=2){if(!quiet)toast('Group would be too small');return}
    S.money+=o.amount;removePerson(p);const tg=pick(rivalGroups().filter(x=>x.agencyId===o.aid))||pick(rivalGroups());
    p.status='rival';p.agencyId=tg.agencyId;p.groupId=tg.id;p.dormId=null;p.busy=null;p.contract={end:S.week+260,split:30,salary:5};S.people.push(p);tg.members.push(p.id);
    if(g){g.fans*=0.95;g.mood-=12}mail(`${p.given} transfers to ${AG(o.aid).name}`,`You accepted ${fmtM(o.amount)}. ${esc(p.given)} joins ${tg.name}.`,'offer');
  }else{if(p.wants){p.morale-=20;mail(`${p.given} is unhappy`,`${esc(p.given)} wanted the move and is upset you rejected it.`,'news','p'+p.id)}else mail('Offer rejected',`You rejected ${AG(o.aid).name}'s bid for ${esc(p.given)}.`)}
  if(!quiet)done();
}
function showCollab(){const gs=myGroups().filter(g=>g.songs.length&&!g.prep&&!promoting(g)&&!touring(g));if(!gs.length)return toast('No group is free');
  openModal(M('Collab single',`<p class="muted sm">Team up with a rival group for a digital single. The song draws on both fandoms. 2 weeks of prep.</p><label>Your group</label><select id="cg" style="width:100%">${gs.map(g=>`<option value="${g.id}">${esc(g.name)}</option>`).join('')}</select><label>Partner</label><select id="cr" style="width:100%">${rivalGroups().sort((a,b)=>b.fans-a.fans).map(g=>`<option value="${g.id}">${esc(g.name)} · ${fmtN(g.fans)} fans · fee ${fmtM(100+g.fans/10000)}</option>`).join('')}</select>`,`<button class="btn" onclick="closeModal()">Cancel</button><button class="btn club" onclick="startCollab()">Propose</button>`))}
function startCollab(){const g=G(+cg.value),r=G(+cr.value),fee=Math.round(100+r.fans/10000);if(Math.random()>clamp(0.4+(S.rep-AG(r.agencyId).rep)/100+g.fans/(r.fans+1)*0.3,0.1,0.95)){closeModal();return okModal('Declined',`${esc(AG(r.agencyId).name)} passed on the collab.`)}if(!pay(fee))return;
  g.prep={weeks:2,title:`${songName()} (with ${r.name})`,concept:S.trend,budget:'Standard',demo:null,type:'Single',lines:'equal',collab:r.id,extraHype:6};mail(`🤝 ${g.name} × ${r.name}`,`Collab single confirmed for 2 weeks from now.`,'release','g'+g.id);closeModal();done()}
function poachRespond(match){const pc=S.poach;if(!pc)return;const s=S.staff[pc.role];if(match&&s){s.wage=pc.wage;mail(`${s.name} stays`,`You matched the offer: ${fmtM(s.wage)}/week.`)}else if(s){S.staff[pc.role]=null;mail(`${s.name} leaves`,`Your ${STAFF[pc.role][0]} left for ${AG(pc.aid).name}.`)}S.poach=null;done()}
// ================= TV =================
function pitchChance(t,sh){const v=t.kind==='group'?gAttr(t.o,'var'):t.o.attrs.var,f=t.kind==='group'?t.o.fans:fameOf(t.o);return clamp(0.2+v/35+sf('var')*0.2+sf('pr')*0.1+sf('media')*0.12+(hasTrait('Networker')?0.08:0)+(f>=sh.min?0.15:-0.3)-sh.tier*0.06,0.03,0.95)}
function tvTargets(){const busy=new Set(S.tv.map(t=>t.kind+t.tid));return[...myGroups().filter(g=>g.songs.length&&!busy.has('group'+g.id)).map(o=>({kind:'group',o})),...mine().filter(p=>(p.status==='idol'||p.status==='actor')&&avail(p)&&!busy.has('person'+p.id)).map(o=>({kind:'person',o}))]}
function showPitch(si){const sh=TVSHOWS[si];
  openModal(M(`Pitch to ${sh.name}`,`<p class="muted sm">An 8-week regular spot. ${fmtM(sh.fee)}/week. Producers prefer ${fmtN(sh.min)}+ fans and strong Variety. Each week there's a chance of a viral moment.</p>${tvTargets().map(t=>{const ch=pitchChance(t,sh);return `<div class="opt" onclick="doPitch(${si},'${t.kind}',${t.o.id})">${t.kind==='person'?avatar(t.o,34):'<span style="font-size:24px">👥</span>'}<div class="f1"><b>${esc(t.kind==='group'?t.o.name:t.o.given)}</b> <span class="muted xs">${t.kind==='group'?'Group':t.o.status}</span></div><span class="pill ${ch>0.6?'g':ch>0.3?'w':'r'}">${Math.round(ch*100)}%</span></div>`}).join('')||'<p class="muted">No one available.</p>'}`))}
function doPitch(si,kind,id){const sh=TVSHOWS[si],o=kind==='group'?G(id):P(id);S.tvCool[sh.name]=S.week+4;
  if(Math.random()<pitchChance({kind,o},sh)){S.tv.push({id:nid(),show:sh.name,kind,tid:id,until:S.week+8});mail(`📺 ${o.name} land ${sh.name}`,`An 8-week regular spot starts next week.`);okModal('Pitch accepted 📺',`${esc(o.name)} will appear on ${sh.name} for 8 weeks.`)}
  else okModal('Pitch declined',`${sh.name}'s producers passed. Try again in 4 weeks.`);save();render()}
function showReality(){const gs=myGroups().filter(g=>g.songs.length||g.prep);if(!gs.length)return toast('You need a debuted group');
  openModal(M('Produce a reality show',`<p class="muted sm">6 weekly episodes following one group. Fan growth scales with Variety, and the members grow closer. ${fmtM(250)}.</p><label>Group</label><select id="rlg" style="width:100%">${gs.map(g=>`<option value="${g.id}">${esc(g.name)} (Variety ${gAttr(g,'var').toFixed(1)})</option>`).join('')}</select><label>Show title</label><input id="rlt" style="width:100%" value="${pick(['Off Duty','Dorm Diaries','Behind the Light','Road Trip'])}">`,`<button class="btn" onclick="closeModal()">Cancel</button><button class="btn club" onclick="startReality()">Produce</button>`))}
function startReality(){if(!pay(250))return;const g=G(+rlg.value);S.reality={gid:g.id,title:`${g.name}: ${rlt.value.trim()||'Off Duty'}`,ep:0,rating:0};mail('Reality show greenlit',`"${esc(S.reality.title)}" starts next week.`);closeModal();done()}
function showSurvival(){
  survSel=new Set();const ts=trainees().sort((a,b)=>ovr(b)-ovr(a));
  if(ts.length<6)return toast('You need at least 6 trainees');
  openModal(M('Survival show',`<p class="muted sm">Pick 6–16 trainees. 8 episodes with missions, ranking reveals and eliminations. You choose edits each week. The winners debut with a ready-made fandom. ${fmtM(800)}.</p>
  ${ts.map(p=>`<div class="opt" onclick="survSel.has(${p.id})?survSel.delete(${p.id}):survSel.add(${p.id});this.classList.toggle('sel');svc.textContent=survSel.size">${avatar(p,32)}<div class="f1"><b>${esc(p.given)}</b> <span class="muted xs">${p.age} · ${role(p)}</span></div>${stars(ovr(p))}</div>`).join('')}
  <p class="sm"><b id="svc">0</b> selected</p><label>Show title</label><input id="svt" style="width:100%" value="${pick(['Project: Debut','Road to Stage','Star Maker','Final Group','Next Light'])}"><label>Winning group name</label><input id="svg" style="width:100%" value="${freeName()}"><label>Debut lineup size</label><select id="svs">${[3,4,5,6,7,8,9].map(n=>`<option ${n===5?'selected':''}>${n}</option>`).join('')}</select>`,
  `<button class="btn" onclick="closeModal()">Cancel</button><button class="btn club" onclick="startSurvival()">Launch</button>`));
}
function startSurvival(){const n=survSel.size,size=+svs.value;if(n<6||n>16)return toast('Pick 6–16 trainees');if(size>=n)return toast('Lineup must be smaller than the cast');if(!pay(800))return;
  S.survival={title:svt.value.trim()||'Project: Debut',groupName:svg.value.trim()||freeName(),size,cont:[...survSel],out:[],votes:{},mission:{},prevRank:{},ep:0,len:8,rating:0,focus:null,evil:null};
  mail(`📺 ${S.survival.title} announced`,`${n} trainees compete over 8 episodes. The final ${size} debut as ${esc(S.survival.groupName)}.`);closeModal();done()}
function survEdit(k,id){S.survival[k]=S.survival[k]===id?null:id;if(S.survival.focus&&S.survival.focus===S.survival.evil)S.survival[k==='focus'?'evil':'focus']=null;done()}
function setChannel(gid,t){S.channel.plan[gid]=t;done()}
// ================= AWARDS =================
function campaign(cer,cat,amt){if(!pay(amt))return;const k=cer+'|'+cat;S.camp[k]=(S.camp[k]||0)+amt;done()}
function setSpecial(){const a=+document.getElementById('sp1').value,b=+document.getElementById('sp2').value;if(!a||!b||a===b)return toast('Pick two different groups');if(!pay(80))return;S.special=[a,b];done()}
// ================= STAFF =================
function showHire(role,asst){const pool=S.staffPool[role];
  openModal(M(`${asst?'Assistant':'Hire'} ${STAFF[role][0]}`,`<p class="muted sm">${STAFF[role][1]}. ${asst?'An assistant adds 35% of their rating to the department.':'Hiring costs 4 weeks of wages up front.'}</p>
  ${pool.map((s,i)=>`<div class="opt"><div class="f1"><b>${esc(s.name)}</b> <span class="pill c">${s.trait}</span><div>${stars(s.rating)} <span class="muted xs">${s.rating}/20 · ${TRAITS[s.trait]}</span></div></div><span class="sm">${fmtM(s.wage)}/wk</span><button class="btn pri s" onclick="hire('${role}',${i},${!!asst})">Hire</button></div>`).join('')}<p class="muted xs">New candidates every 8 weeks.</p>`))}
function hire(role,i,asst){const s=S.staffPool[role][i];if(!pay(s.wage*4))return;if(asst){S.staff[role].asst={...s,wage:Math.max(1,Math.round(s.wage*0.6))}}else{const old=S.staff[role];S.staff[role]={...s,asst:old?old.asst:null}}S.staffPool[role].splice(i,1);mail('Staff hired',`${esc(s.name)} joins as ${asst?'assistant ':''}${STAFF[role][0]}.`);closeModal();done()}
function fire(role,asst){const s=asst?S.staff[role].asst:S.staff[role];S.money-=s.wage*2;if(asst)S.staff[role].asst=null;else{const a=S.staff[role].asst;S.staff[role]=a?{...a,asst:null}:null;if(a)mail('Assistant promoted',`${esc(a.name)} steps up as ${STAFF[role][0]}.`)}done()}
function hireIntern(){if(S.interns.length>=4)return toast('Max 4 interns');if(!pay(20))return;const[n]=genName(pick(['F','M']),'KR',-1);S.interns.push({id:nid(),name:n,rating:R(3,7),since:S.week});done()}
function promoteIntern(id){const i=S.interns.find(x=>x.id===id),role=document.getElementById('ir'+id).value;const r=Math.round(i.rating);const s={name:i.name,rating:r,wage:Math.round(2+r*r*0.05),trait:pick(Object.keys(TRAITS)),end:S.week+104,asst:null};
  if(!S.staff[role])S.staff[role]=s;else if(!S.staff[role].asst)S.staff[role].asst=s;else return toast('That role already has a head and an assistant');S.interns=S.interns.filter(x=>x!==i);mail('Intern promoted',`${esc(i.name)} joins the ${STAFF[role][0]} department.`);done()}
function setDelegate(k,v){S.delegate[k]=v;done()}
// ================= BOARD / FINANCE / GLOBAL =================
const facMax=()=>S.board.hq?7:5;
function upgrade(k){const c=(S.fac[k]+1)*400;if(conf()<35)return toast('The board refuses: confidence too low');if(S.fac[k]>=facMax())return;if(!pay(c))return;S.fac[k]++;mail('Facility upgraded',`${FAC[k][0]} is now level ${S.fac[k]}.`,'board');done()}
function boardRequest(type){
  const b=S.board,c=conf();
  if(type==='invest'){if(S.week-b.lastInvest<26)return;b.lastInvest=S.week;
    if(Math.random()<c/120){const amt=Math.round(500+S.rep*10);S.money+=amt;boardAdj('profit',-5);okModal('Investment approved',`The board injected <b>${fmtM(amt)}</b>. The profit-minded member expects returns.`)}else{boardAdj('all',-4);okModal('Request denied','The board turned down extra investment.')}}
  if(type==='patience'){if(S.week-b.lastPatience<52)return;b.lastPatience=S.week;
    if(Math.random()<c/100+0.1){boardAdj('all',8);b.patience=true;b.targets.wins=Math.max(1,Math.round(b.targets.wins*0.7));okModal('The board agrees',`Win target lowered to <b>${b.targets.wins}</b>; missed targets cost half as much.`)}else{boardAdj('all',-4);okModal('Request denied','The board expects you to hit the targets.')}}
  if(type==='ipo'){if(b.ipo)return;if(S.rep<50||c<60||agencyFans(0)<1e6)return toast('IPO needs reputation 50+, confidence 60%+ and 1M+ total fans');
    const cash=Math.round(2000+agencyFans(0)/1000);S.money+=cash;b.ipo=true;S.share={price:10000,hist:[10000],lastFans:agencyFans(0)};boardAdj('profit',10);mail('🔔 IPO day!',`${esc(S.agency)} is now listed. The offering raised <b>${fmtM(cash)}</b>. Shareholders will watch every result.`,'board','finances');okModal('Listed! 🔔',`The IPO raised ${fmtM(cash)}.`)}
  if(type==='label'){if(b.label)return;if(c<45)return toast('Needs 45%+ confidence');if(!pay(1500))return;b.label=true;
    for(let i=0;i<3;i++)joinAgency(genPerson(rosterG(),R(0.35,0.6)));const gg=rosterG(),ids=[];for(let i=0;i<4;i++){const p=genPerson(gg,R(0.45,0.65),{ageMin:18,ageMax:24});p.status='idol';joinAgency(p);ids.push(p.id)}
    const g=newGroupObj(freeName(),ids,40000);g.debutWeek=S.week-80;S.groups.push(g);ids.forEach(i=>P(i).contract.end=S.week+52*4);releaseSong(g,songName(),45,0,S.week-20,{type:'Mini'});S.rep=clamp(S.rep+3,0,100);
    mail('🏢 Label acquired',`You bought a boutique label: ${g.name} and 3 trainees join the agency.`,'board','g'+g.id);okModal('Acquisition complete',`${esc(g.name)} and 3 trainees are now yours.`)}
  if(type==='hq'){if(b.hq)return;if(c<55)return toast('Needs 55%+ confidence');if(!pay(2500))return;b.hq=true;mine().forEach(p=>p.morale=clamp(p.morale+10,0,100));S.rep=clamp(S.rep+5,0,100);mail('🏙 New headquarters',`The agency moved into a new HQ. Facilities can now reach level 7 and up to 8 dorms.`,'board');okModal('New HQ opened 🏙','Facility caps raised to level 7.')}
  done();
}
function takeLoan(a){if(S.loans.length>=2)return toast('Max 2 active loans');S.money+=a;S.loans.push({amount:a,weekly:Math.round(a*1.08/52*10)/10,left:52});boardAdj('profit',-3);mail('Loan taken',`${fmtM(a)} borrowed, repaid over 52 weeks at 8%.`);done()}
function enterMarket(r){const m=MARKETS[r];if(S.markets[r])return;if(!pay(m.cost))return;S.markets[r]={since:S.week};boardAdj('global',6);myGroups().forEach(g=>addReg(g,r,g.fans*0.02));mail(`🌏 Entered ${REGIONS[r]}`,`A local label partnership is in place. Regional fans will grow and ${REGIONS[r]} tour cities are unlocked.`,'board','global');done()}
function showPromo(r){const gs=myGroups().filter(g=>g.songs.length&&!g.prep&&!g.promo&&!touring(g));if(!gs.length)return toast('No group is free');const m=MARKETS[r];
  openModal(M(`${m.promo} · ${REGIONS[r]}`,`<p class="muted sm">2 weeks of local promotion. Strong regional fan growth. ${fmtM(m.pc)}.</p><label>Group</label><select id="pg" style="width:100%">${gs.map(g=>`<option value="${g.id}">${esc(g.name)} (${fmtN(regFans(g,r))} ${REGIONS[r]} fans)</option>`).join('')}</select>`,`<button class="btn" onclick="closeModal()">Cancel</button><button class="btn club" onclick="doPromo('${r}')">Go</button>`))}
function doPromo(r){const g=G(+pg.value);if(!pay(MARKETS[r].pc))return;g.promo={r,until:S.week+2};boardAdj('global',1);if(r==='jp'){const ls=lastSong(g);releaseSong(g,`${songName()} (Japan debut)`,ls?ls.quality:50,5,S.week,{type:'JP'})}mail(`${g.name} head to ${REGIONS[r]}`,`${MARKETS[r].promo} begins.`,'news','global');closeModal();done()}
function fanStatement(id){const f=S.fanwars.find(x=>x.id===id);f.until=S.week-1;const g=G(f.gid);g.mood=clamp(g.mood+4,10,100);mail('Statement issued',`${esc(g.name)} asked fans to support all artists kindly. Tensions eased.`);done()}
function scandalRespond(id,r){const msg=resolveScandal(id,r);if(r==='legal'&&S.money<0)toast('Legal fees paid');done();okModal('Response issued',msg)}
// ================= REPORT / GAME OVER =================
function showReport(rep){
  let h='';
  rep.goals.forEach(t=>h+=`<div class="news">✅ <b>Milestone:</b> ${esc(t)}</div>`);
  rep.allkill.forEach(id=>{const s=SG(id);h+=`<div class="news">💥 <b>ALL-KILL</b>: "${esc(s.title)}" – ${esc(G(s.groupId).name)}</div>`});
  rep.rel.forEach(id=>{const s=SG(id),g=G(s.groupId);h+=`<div class="news"><span class="pill p">${ALBUM[s.type]?ALBUM[s.type].n:s.type}</span> <b>"${esc(s.title)}"</b> – ${esc(g.name)}<div class="muted sm">${s.concept} · Quality <b>${grade(s.quality)}</b> ${s.quality} · Debuts <b>#${s.rank}</b> · First-week sales ${fmtN(s.sales)}</div></div>`});
  if(rep.surv)h+=`<div class="news">📺 <b>${esc(rep.surv.title)}</b> ${rep.surv.final?`finale: <b>${esc(rep.surv.group)}</b> debut with ${rep.surv.winners.map(i=>esc(P(i).given)).join(', ')}`:`ep ${rep.surv.ep} (${rep.surv.mission}) · top: ${rep.surv.top.map(i=>esc(P(i).given)).join(', ')}${rep.surv.out.length?' · out: '+rep.surv.out.map(i=>esc(P(i).given)).join(', '):''}`}</div>`;
  rep.tour.forEach(t=>h+=`<div class="news">🎤 ${esc(t.g)} in <b>${t.city}</b> (${t.venue}): ${fmtN(t.sold)}/${fmtN(t.cap)} sold</div>`);
  if(rep.shows.some(x=>x.myPos)){h+=`<h3 style="margin:10px 0 6px">This week's music shows</h3><div class="tw"><table><tr><th>Day</th><th>Show</th><th>Winner</th><th>You</th></tr>${rep.shows.map(sh=>{const w=SG(sh.top[0].id),wg=G(w.groupId),me=wg.agencyId===0;return `<tr class="${me?'me':''}"><td>${sh.day}</td><td>${sh.show}</td><td>${me?'🏆 ':''}${esc(wg.name)}</td><td>${sh.myPos?'#'+sh.myPos:'–'}</td></tr>`}).join('')}</table></div>`}
  rep.awards.forEach(a=>{h+=`<h3 style="margin:10px 0 4px">🎤 ${a.cer}</h3>`+a.res.map(r=>`<div class="sm" style="${r.aid===0?'color:var(--club);font-weight:800':''}">${r.cat}: ${esc(r.name)} ${esc(r.detail)}</div>`).join('')});
  openModal(M(dayStr(S.week,0,true)+' · Weekly report',h,'<button class="btn club" onclick="toInbox()">Continue ›</button>'));
}
function showGameOver(){openModal(M('Sacked',`<p>The board has lost all confidence. You have been removed as CEO of ${esc(S.agency)}.</p><p class="muted">You lasted until ${dateStr(S.week)}, with ${myGroups().length} group(s), ${sum(S.groups.filter(g=>g.agencyId===0).map(g=>g.trophies))} music show wins and ${S.awardHist.filter(a=>a.aid===0).length} awards.</p>`,'<button class="btn club" onclick="resetGame()">New game</button>'),true)}

function survRig(id,d){const sv=S.survival;if(!sv||sv.exposed)return;sv.rig=sv.rig||{};sv.rig[id]=clamp((sv.rig[id]||0)+d,-3,3);if(!sv.rig[id])delete sv.rig[id];done()}
function survFix(){const sv=S.survival;if(!sv||sv.exposed)return;const ids=[...sv.cont].sort((a,b)=>(sv.votes[b]||0)-(sv.votes[a]||0));
  openModal(M('Fix the final lineup',`<p class="sm">Secretly decide exactly who debuts, regardless of votes. Pick <b>${sv.size}</b>. This is the riskiest rig: suspicion jumps by about 35 at the finale, and the scandal can surface for up to two years after debut.</p>${ids.map((id,i)=>`<label class="opt" style="text-transform:none;letter-spacing:0;font-size:13px;color:var(--text)"><input type="checkbox" class="fxk" value="${id}" ${(sv.fixed||[]).includes(id)?'checked':''}>${avatar(P(id),28)}<b class="f1">${esc(P(id).given)}</b><span class="muted">#${i+1} · ${stars(ovr(P(id)))}</span></label>`).join('')}`,
  `<button class="btn" onclick="S.survival.fixed=null;closeModal();done()">Clear fix</button><button class="btn dan" onclick="const f=[...document.querySelectorAll('.fxk:checked')].map(x=>+x.value);if(f.length!==${sv.size})return toast('Pick exactly ${sv.size}');S.survival.fixed=f;closeModal();done()">Fix lineup</button>`))}
