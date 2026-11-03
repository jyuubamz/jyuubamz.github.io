// ================= STAFF DEPARTMENTS (v5) =================
Object.assign(STAFF,{
  // relabel originals
  voc:['Vocal Coach','+Vocals growth for trainees and idols'],
  dan:['Dance & Choreography Instructor','+Dance growth'],
  rap:['Rap Trainer','+Rap growth'],
  stg:['Performance Director','+Stage Presence growth, stronger music show stages'],
  act:['Acting Coach','+Acting growth, better casting odds'],
  var:['Media & Variety Trainer','+Variety growth, better TV pitch odds'],
  vis:['Fashion Stylist','+Visuals growth, higher release quality'],
  prod:['Head Producer / Composer','Boosts every in-house producer: faster, better demos'],
  pr:['PR Manager','More hype & fan growth, softer scandal fallout'],
  scout:['Head Scout','Stronger, more accurate scouting; reveals personality at 12+'],
  mgr:['Main Road Manager','Condition recovery, morale, fewer injuries, better talks'],
  // executive
  cfo:['Chief Financial Officer (CFO)','Up to −30% corporate tax & overhead, cheaper loans'],
  acct:['Chief Accountant','Up to −6% on every weekly expense'],
  legal:['Legal Counsel','Cheaper and safer legal action, +renewal & transfer acceptance'],
  admin:['General Administration Director','Board satisfaction drifts up weekly; interns grow faster'],
  // A&R
  casting:['Casting Director','+Drama casting odds, +1 audition candidate, better survival show ratings'],
  selection:['Music Selection Council','+Release quality whenever a demo is used'],
  mdir:['Musical Director (A&R)','+Hype when a release matches the trend'],
  // training
  lang:['Language Tutor','Foreign members homesick less; faster overseas fan growth & promos'],
  life:['Lifestyle Mentor','+Trainee morale & growth, lower scandal risk'],
  // production & creative
  lyric:['Lyricist','+Demo quality for every song written in-house'],
  eng:['Sound Engineer','+Release quality on every song'],
  art:['Art Director','+Album sales (packaging) and +hype'],
  concept:['Concept & Visual Planner','+Release quality and +hype from stronger concepts'],
  // artist management
  sched:['Schedule Coordinator','Less condition lost in prep/promo, fewer injuries, +10% schedule income'],
  sec:['Security Team Lead','Handles sasaeng incidents, fewer injuries & scandals'],
  // styling
  hair:['Hair Stylist','+Visuals growth and public image'],
  makeup:['Makeup Artist','+Visuals growth, image and music show scores'],
  // PR & marketing
  media:['Media Planner','+TV pitch odds and +release hype'],
  content:['New Media / Content Producer','+Channel subscriber growth, more positive social buzz'],
  community:['Fan Club & Community Manager','+Fan mood weekly, +fan club income, calmer fan wars'],
  // global & business
  tour:['International Tour Manager','+20% tour revenue, less tour fatigue'],
  dist:['Distribution & Publishing Liaison','+12% streaming & album income'],
  counsel:['Mental Health Counselor','Morale support for everyone, fewer burnouts, stronger talks'],
});
const DEPTS=[
  ['exec','Executive & Management Planning','🏛',['cfo','acct','legal','admin'],'CEO, CFO, board of directors, legal, accounting and general administration.'],
  ['ar','A&R (Artists & Repertoire)','🔍',['scout','casting','selection','mdir'],'Talent scouting, casting directors, the music selection council and musical direction.'],
  ['train','Trainee Development & Training','🎓',['voc','dan','rap','stg','act','var','lang','life'],'Vocal, dance, rap and acting coaches, language tutors and lifestyle mentors.'],
  ['prod','Music Production & Creative Design','🎧',['prod','lyric','eng','art','concept'],'Composers, lyricists, sound engineers, art directors and concept planners.'],
  ['mgmt','Artist Management (Road & Team)','🚐',['mgr','sched','sec'],'Road managers, schedule coordinators and security.'],
  ['style','Styling & Visuals','💄',['vis','hair','makeup'],'Fashion stylists, hair stylists and makeup artists.'],
  ['pr','Public Relations & Marketing','📣',['pr','media','content','community'],'PR, media planning, content production and fan community management.'],
  ['global','Global & Business Operations','🌏',['tour','dist','counsel'],'International touring, distribution & publishing, and mental health support.']];
function ensureStaff(){S.staffPool=S.staffPool||{};Object.keys(STAFF).forEach(k=>{if(!(k in S.staff))S.staff[k]=null;if(!S.staffPool[k]||!S.staffPool[k].length)S.staffPool[k]=[genStaff(),genStaff(),genStaff()]})}
const deptStrength=d=>{const r=d[3].map(k=>S.staff[k]?S.staff[k].rating+(S.staff[k].asst?S.staff[k].asst.rating*0.35:0):0);return avg(r)};
const deptWage=d=>sum(d[3].map(k=>S.staff[k]?S.staff[k].wage+(S.staff[k].asst?S.staff[k].asst.wage:0):0));
function showHire(role,asst){ensureStaff();const pool=S.staffPool[role];
  openModal(M(`${asst?'Assistant':'Hire'} · ${STAFF[role][0]}`,`<p class="muted sm">${STAFF[role][1]}. ${asst?'An assistant adds 35% of their rating to the role and is paid 60% of the listed wage.':'Hiring costs 4 weeks of wages up front.'}</p>
  ${pool.map((s,i)=>`<div class="opt"><div class="f1"><b>${esc(s.name)}</b> <span class="pill c">${s.trait}</span><div>${stars(s.rating)} <span class="muted xs">${s.rating}/20 · ${TRAITS[s.trait]}</span></div></div><span class="sm">${fmtM(s.wage)}/wk</span><button class="btn pri s" onclick="hire('${role}',${i},${!!asst})">Hire</button></div>`).join('')}<p class="muted xs">New candidates every 8 weeks.</p>`))}
function staffRow(k){const s=S.staff[k],[n,e]=STAFF[k];
  return `<tr><td><b>${n}</b><div class="xs muted" style="white-space:normal;max-width:260px">${e}</div></td><td>${s?`${esc(s.name)}<div class="xs muted">${fmtM(s.wage)}/wk · to ${dateStr(s.end)}</div>`:'<span class="pill r">Vacant</span>'}</td><td>${s?`${stars(s.rating)} <span class="pill c" title="${TRAITS[s.trait]}">${s.trait}</span>`:''}</td>
  <td class="sm">${s?(s.asst?`${esc(s.asst.name)} ${stars(s.asst.rating)} <button class="btn s dan" onclick="fire('${k}',true)">✕</button>`:`<button class="btn s" onclick="showHire('${k}',true)">+ Assistant</button>`):''}</td>
  <td>${bar(sf(k)/1.4*100,'var(--club2)',60)}</td>
  <td>${s?`<button class="btn s" onclick="showHire('${k}')">Replace</button> <button class="btn s dan" onclick="if(this.dataset.c)fire('${k}');else{this.dataset.c=1;this.textContent='Sure?'}">Fire</button>`:`<button class="btn pri s" onclick="showHire('${k}')">Hire</button>`}</td></tr>`}
function vStaff(){
  ensureStaff();
  const SHORT={exec:'Executive',ar:'A&R',train:'Training',prod:'Production',mgmt:'Management',style:'Styling',pr:'PR & Marketing',global:'Global'};
  const tabs=[['overview','Overview'],...DEPTS.map(d=>[d[0],d[2]+' '+SHORT[d[0]]]),['interns','Interns'],['delegation','Delegation']];
  const[c,st]=subtabs('staff',tabs);
  const total=Object.values(S.staff).filter(Boolean).length,roles=Object.keys(STAFF).length,wage=sum(DEPTS.map(deptWage));
  const poach=S.poach&&S.staff[S.poach.role]?panel('⚠ Poaching attempt',`<p>${esc(AG(S.poach.aid).name)} offered your ${STAFF[S.poach.role][0]} <b>${esc(S.staff[S.poach.role].name)}</b> ${fmtM(S.poach.wage)}/week. Decide by week ${wkOf(S.poach.until)}.</p><button class="btn club" onclick="poachRespond(true)">Match offer</button> <button class="btn" onclick="poachRespond(false)">Let them go</button>`):'';
  if(c==='interns')return st+panel(`Interns (${S.interns.length}/4)`,`<p class="muted sm">Interns cost ₩1M/week and grow every week (faster with a Mentor or Admin Director). Promote them into any vacant head or assistant role.</p><table><tr><th>Name</th><th>Rating</th><th>Since</th><th>Promote to</th></tr>${S.interns.map(i=>`<tr><td><b>${esc(i.name)}</b></td><td>${stars(i.rating)} ${i.rating.toFixed(1)}</td><td class="sm">${dateStr(i.since)}</td><td><select id="ir${i.id}">${DEPTS.map(d=>`<optgroup label="${d[1]}">${d[3].map(k=>`<option value="${k}">${STAFF[k][0]}</option>`).join('')}</optgroup>`).join('')}</select> <button class="btn s pri" onclick="promoteIntern(${i.id})">Promote</button></td></tr>`).join('')||'<tr><td colspan="4" class="muted">No interns.</td></tr>'}</table>`,`<button class="btn club s" onclick="hireIntern()">Hire intern (${fmtM(20)})</button>`);
  if(c==='delegation')return st+panel('Delegate to assistants',[['classes','Trainee classes','Put each trainee in the class for their weakest skill'],['schedules','Group schedules','Rest tired groups, otherwise book brand deals or fan meetings'],['renewals','Contract renewals','Offer each idol their demand 6 months before expiry'],['offers','Transfer offers','Reject rival bids unless they pay 1.5× value']].map(([k,l,d])=>`<div class="news"><div class="row"><div class="f1"><b>${l}</b><div class="muted xs">${d}</div></div><div class="seg"><button class="${S.delegate[k]?'':'on'}" onclick="setDelegate('${k}',false)">Me</button><button class="${S.delegate[k]?'on':''}" onclick="setDelegate('${k}',true)">Assistant</button></div></div></div>`).join(''));
  if(c==='overview'){const b=S.board;
    return st+poach+`<div class="kpi" style="margin-bottom:10px"><div><small>Staff</small><b>${total} / ${roles}</b></div><div><small>Wage bill</small><b>${fmtM(wage)}/wk</b></div><div><small>Interns</small><b>${S.interns.length}</b></div><div><small>Departments</small><b>${DEPTS.length}</b></div></div>
    <div class="grid">${panel('Executive leadership',`<div class="row" style="gap:12px;margin-bottom:8px"><div style="width:44px;height:44px;border-radius:8px;background:var(--club);display:flex;align-items:center;justify-content:center;font-weight:800">CEO</div><div class="f1"><b>You</b><div class="xs muted">Chief Executive Officer · ${esc(S.agency)}</div></div></div>
      <div class="xs muted" style="margin-bottom:4px">BOARD OF DIRECTORS · ${Math.round(conf())}% confidence</div>${b.members.map(m=>`<div class="stat sm"><span>${AGENDAS[m.agenda][0]} ${esc(m.name)}</span><span>${Math.round(m.sat)}%</span></div>`).join('')}<button class="btn s" style="margin-top:6px" onclick="nav('board')">Board room ›</button>`)}
    ${DEPTS.map(d=>{const filled=d[3].filter(k=>S.staff[k]).length,str=deptStrength(d);return `<div class="panel" style="cursor:pointer" onclick="setSub('staff','${d[0]}')"><div class="ph"><h2>${d[2]} ${d[1]}</h2><span class="pill ${filled===d[3].length?'g':filled?'w':'r'}">${filled}/${d[3].length}</span></div><div class="pb"><div class="xs muted" style="margin-bottom:6px">${d[4]}</div><div class="stat"><span class="sm">Department strength</span><span>${stars(str)}</span></div><div class="stat"><span class="sm">Wages</span><span class="sm">${fmtM(deptWage(d))}/wk</span></div>${d[3].map(k=>`<div class="stat xs"><span>${STAFF[k][0]}</span><span>${S.staff[k]?esc(S.staff[k].name):'<span class="bad">vacant</span>'}</span></div>`).join('')}</div></div>`}).join('')}</div>`}
  const d=DEPTS.find(x=>x[0]===c);
  return st+poach+panel(`${d[2]} ${d[1]} · ${d[3].filter(k=>S.staff[k]).length}/${d[3].length} filled · ${fmtM(deptWage(d))}/wk`,`<p class="muted sm" style="padding:8px 10px 0">${d[4]}${d[0]==='exec'?' You are the CEO, and the board of directors sits in the Board room. Hire the executive team below.':''}</p><div class="tw"><table><tr><th>Role</th><th>Head</th><th>Rating</th><th>Assistant</th><th>Effect</th><th></th></tr>${d[3].map(staffRow).join('')}</table></div>`,'',true)+`<p class="muted xs">Each role's rating (1–20) scales its effect, and an assistant adds 35% of theirs. Traits: ${Object.entries(TRAITS).map(([k,v])=>`<b>${k}</b> ${v}`).join(' · ')}. Firing costs 2 weeks of wages; the assistant steps up if you fire the head.</p>`;
}
