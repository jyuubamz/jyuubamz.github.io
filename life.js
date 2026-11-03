// ================= v4 "LIFE" UPDATE =================
// talks, decision events, spread-out inbox, social media, free castings, room sizes, custom shows, panic votes
TABS_ALL.splice(TABS_ALL.findIndex(t=>t[0]==='fans')+1,0,['social','Social Media','📱','PUBLIC']);
MSG_FROM.decision=['mgr','Assistant Manager'];MSG_CAT.decision=['⚡','Decision','w'];
const fmtF=n=>Math.round(n).toLocaleString('en-US');
function visibleInbox(){const w=S.week,d=S.day||0;return S.inbox.filter(m=>m.w<w||(m.w===w&&(m.d||0)<=d))}
const visUnreadIds=()=>visibleInbox().filter(m=>!m.read).map(m=>m.id);

// ---------- DORM ROOMS (2–4 beds each) ----------
function dormRooms(d){if(!d.rooms||sum(d.rooms)!==d.beds){d.rooms=[];let b=d.beds;while(b>0){const c=Math.min(b,RI(2,4));d.rooms.push(c);b-=c}}return d.rooms}
const roomCap=(d,r)=>dormRooms(d)[r]||2;
function assignDorm(p){const d=S.dorms.find(d=>dormOcc(d)<d.beds)||S.dorms[0];p.dormId=d?d.id:null;if(d)assignDorm2(p)}
function assignDorm2(p){const d=D(p.dormId);if(!d)return;const rs=dormRooms(d);for(let r=0;r<rs.length;r++){if(mine().filter(x=>x.dormId===d.id&&x.room===r&&x!==p).length<rs[r]){p.room=r;return}}p.room=0}
function dormBeds(id){const d=D(id),c=RI(2,4);if(d.beds+c>4+d.q*3)return toast('Upgrade quality to fit another room');if(!pay(30*c))return;dormRooms(d).push(c);d.beds+=c;toast(`New ${c}-bed room added`);done()}
function dormNew(){if(S.dorms.length>=dormMax())return toast('Max dorms reached');if(!pay(500))return;const rooms=[RI(2,4),RI(2,4)];S.dorms.push({id:nid(),name:['Main','Hannam','Seongsu','Mapo','Gangnam','Itaewon','Yeouido','Jamsil'][S.dorms.length]+' Dorm',q:1,beds:sum(rooms),rooms});done()}
function vDorms(){
  const people=mine().filter(p=>p.status!=='actor'&&!p.ownHome),wants=mine().filter(p=>p.wantsHome);
  const seg=(k,v,l)=>`<button class="${S.rules[k]===v?'on':''}" onclick="setRule('${k}',${typeof v==='string'?`'${v}'`:v})">${l}</button>`;
  const rules=panel('House rules (agency-wide)',`<div class="stat"><span><b>Curfew</b><div class="xs muted">Scandal risk −20%, morale −</div></span><div class="seg">${seg('curfew',false,'Off')}${seg('curfew',true,'On')}</div></div>
    <div class="stat"><span><b>Phone policy</b><div class="xs muted">Limited −15% · Collected −30% risk</div></span><div class="seg">${seg('phone','free','Free')}${seg('phone','limited','Limited')}${seg('phone','collected','Collected')}</div></div>
    <div class="stat"><span><b>Dating ban</b><div class="xs muted">Scandal risk −30%, morale −</div></span><div class="seg">${seg('dating',false,'Off')}${seg('dating',true,'On')}</div></div>`);
  const req=wants.length?panel('Move-out requests',wants.map(p=>`<div class="stat"><span>${pLink(p)}</span><span><button class="btn s pri" onclick="grantHome(${p.id},true)">Grant</button> <button class="btn s" onclick="grantHome(${p.id},false)">Refuse</button></span></div>`).join('')):'';
  return `<div class="row wrap" style="margin-bottom:10px"><p class="muted sm f1" style="margin:0">Rooms hold 2–4 people, as in real idol dorms. A room is only cramped when it's over its bed count. Roommates build chemistry.</p><button class="btn club" onclick="dormNew()">Open new dorm (${fmtM(500)})</button></div>
  <div class="g2"><div class="grid">${S.dorms.map(d=>{const rs=dormRooms(d),occ=people.filter(p=>p.dormId===d.id),over=occ.length>d.beds,dm=(d.q-2.5)*0.5-Math.min(4,Math.max(0,occ.length-d.beds)*0.8);
  return panel(`${esc(d.name)} ${stars(d.q*4)}`,`<div class="kpi"><div><small>Beds</small><b class="${over?'bad':''}">${occ.length}/${d.beds}</b></div><div><small>Rooms</small><b>${rs.length}</b></div><div><small>Morale/wk</small><b class="${dm>=0?'good':'bad'}">${dm>=0?'+':''}${dm.toFixed(1)}</b></div></div>
  <div class="row wrap" style="margin:8px 0"><button class="btn pri s" onclick="dormUp(${d.id})" ${d.q>=5?'disabled':''}>Upgrade ${d.q<5?fmtM(150*d.q):''}</button><button class="btn s" onclick="dormBeds(${d.id})">+ Room (2–4 beds)</button><span class="muted xs">max ${4+d.q*3} beds</span></div>
  ${rs.map((cap,r)=>{const rp=occ.filter(p=>p.room===r);return `<div class="news"><div class="xs muted">ROOM ${r+1} · ${rp.length}/${cap} beds ${rp.length>cap?'<span class="bad">· cramped</span>':''}</div>${rp.map(p=>`<div class="row" style="padding:2px 0">${avatar(p,24)}<span class="f1 sm">${pLink(p)}</span><select class="xs" onchange="moveRoom(${p.id},this.value)">${rs.map((c,i)=>`<option value="${i}" ${i===r?'selected':''}>Room ${i+1} (${c})</option>`).join('')}</select><select class="xs" onchange="moveDorm(${p.id},this.value)">${S.dorms.map(x=>`<option value="${x.id}" ${x.id===d.id?'selected':''}>${esc(x.name)}</option>`).join('')}</select></div>`).join('')||'<span class="muted xs">Empty</span>'}</div>`}).join('')}`)}).join('')}</div><div>${req}${rules}</div></div>`;
}

// ---------- TALKS ----------
const TALKS={encourage:['Encourage','"You\'re doing great. I believe in you."'],listen:["Ask what's wrong",'"Talk to me. What\'s been bothering you?"'],praise:['Praise their work','"Your recent work has been outstanding."'],reward:['Promise a reward (₩10M)','"Hang in there. A break and a bonus are coming."'],firm:['Demand more focus','"I need more from you. Stay focused."']};
function talkReason(p){const r=[];const g=p.groupId?G(p.groupId):null;
  if(p.cond<35)r.push(['They are physically exhausted.','Schedule a Rest week.']);
  const d=p.dormId?D(p.dormId):null;if(d&&dormOcc(d)>d.beds)r.push(['The dorm is overcrowded.','Add a room or open a new dorm.']);
  const worst=Object.entries(p.rel||{}).filter(([id])=>P(+id)&&P(+id).agencyId===0).sort((a,b)=>a[1]-b[1])[0];if(worst&&worst[1]<-12)r.push([`They aren't getting along with ${P(+worst[0]).given}.`,'Move them to different rooms or try a reality show.']);
  if(p.status==='trainee'&&S.week-p.joined>40)r.push(['They are scared they will never debut.','Consider them for the next lineup or a pre-debut series.']);
  if(p.nat!=='KR')r.push(['They are homesick.','A rest week or a regional promotion back home could help.']);
  if(g){const ls=lastSong(g);if(ls&&ls.lines&&ls.lines[p.id]!=null&&ls.lines[p.id]<100/g.members.length*0.7)r.push(['They barely got any lines on the last song.','Use Equal line distribution next time.'])}
  if(p.contract&&p.contract.end&&p.contract.end-S.week<30)r.push(['They are anxious about their contract.','Open renewal talks.']);
  if(p.wantsHome)r.push(['They want to move out of the dorm.','Grant a housing allowance.']);
  if(S.rules.phone==='collected'||S.rules.dating)r.push(['The strict house rules are getting to them.','Relax the dorm rules.']);
  return r.length?pick(r):['Pressure and nerves are piling up.','Keep an eye on them.'];}
function showTalk(pid,who){
  const p=P(pid);if(!p)return;const used=(S.ceoTalks&&S.ceoTalks.w===S.week)?S.ceoTalks.n:0,cool=p.talkW&&S.week-p.talkW<2;
  openModal(M(`💬 Talk to ${esc(p.given)}`,`<div class="row">${avatar(p,52)}<div class="f1"><b>${esc(p.name)}</b><div class="sm muted">${p.groupId?esc(G(p.groupId).name)+' · ':''}${persLabel(p)}</div><div class="sm">Morale ${bar(p.morale,'var(--club2)',110)} ${Math.round(p.morale)}</div></div></div>
  ${cool?`<p class="warn sm">You spoke with ${esc(p.given)} recently. Wait until week ${wkOf(p.talkW+2)} before talking again.</p>`:''}
  <label>Who talks to them?</label><div class="seg" id="tw"><button class="${who!=='mgr'?'on':''}" onclick="this.parentNode.querySelectorAll('button').forEach(b=>b.classList.remove('on'));this.classList.add('on');this.parentNode.dataset.v='ceo'">CEO (you) · ${3-used}/3 left this week</button><button class="${who==='mgr'?'on':''}" ${S.staff.mgr?'':'disabled'} onclick="this.parentNode.querySelectorAll('button').forEach(b=>b.classList.remove('on'));this.classList.add('on');this.parentNode.dataset.v='mgr'">Road Manager${S.staff.mgr?' · '+esc(S.staff.mgr.name):' (not hired)'}</button></div>
  <label>Approach</label>${Object.entries(TALKS).map(([k,[l,q]])=>`<div class="opt" onclick="doTalk(${pid},document.getElementById('tw').dataset.v||'${who==='mgr'?'mgr':'ceo'}','${k}')" ${cool?'style="opacity:.4;pointer-events:none"':''}><div class="f1"><b>${l}</b><div class="xs muted">${q}</div></div></div>`).join('')}
  <p class="muted xs">The CEO's words carry more weight (×1.3) but you only have 3 talks a week. The Road Manager's effect scales with their rating. Personality matters: professionals respond to firmness, calm people to encouragement, and praise can feel hollow.</p>`));
}
function doTalk(pid,who,ap){
  const p=P(pid);if(!p)return;
  if(who==='mgr'&&!S.staff.mgr)return toast('No Road Manager hired');
  if(who==='ceo'){if(!S.ceoTalks||S.ceoTalks.w!==S.week)S.ceoTalks={w:S.week,n:0};if(S.ceoTalks.n>=3)return toast('You have no talks left this week');S.ceoTalks.n++}
  if(ap==='reward'&&!pay(10))return;
  const x=p.pers,mult=(who==='ceo'?1.3:0.7+sf('mgr')*0.6)*(1+sf('counsel')*0.3);let ok,d,react,extra='';
  if(ap==='encourage'){ok=Math.random()<0.7+x.tem/80;d=ok?R(6,12):R(0,3);react=ok?'smiles and nods. "Thank you… I needed to hear that."':'shrugs. "Okay."'}
  if(ap==='listen'){ok=Math.random()<0.65+x.loy/80;d=ok?R(8,15):R(2,5);const[why,fix]=talkReason(p);extra=`<div class="news"><b>What's wrong:</b> ${why}<br><span class="muted sm">Suggestion: ${fix}</span></div>`;react=ok?'opens up and looks relieved afterwards.':'says a little, but clearly holds back.'}
  if(ap==='praise'){ok=Math.random()<0.4+x.pro/45+(cur(p)>12?0.15:0);d=ok?R(10,18):-R(2,6);react=ok?'beams. "Really? I\'ll work even harder!"':'looks unconvinced. "You don\'t have to say that."'}
  if(ap==='reward'){ok=true;d=R(12,18);p.cond=clamp(p.cond+10,0,100);react='brightens up immediately. "Thank you so much!"'}
  if(ap==='firm'){ok=x.pro>=13||Math.random()<0.25;d=ok?R(3,8):-R(6,12);if(ok)train(p,0.6);react=ok?'straightens up. "Understood. I won\'t let you down."':(x.tem<8?'storms out of the room.':'goes quiet and looks hurt.')}
  if(d>0)d*=mult;p.morale=clamp(p.morale+d,0,100);p.talkW=S.week;if(d>0)p.lowWeeks=Math.max(0,(p.lowWeeks||0)-2);
  S.inbox.filter(m=>m.ev&&m.ev.k==='talk'&&m.ev.pid===pid&&!m.resolved).forEach(m=>{m.resolved=true;m.outcome=`${who==='ceo'?'You':'The Road Manager'} talked to ${p.given}: morale ${d>=0?'+':''}${Math.round(d)}.`});
  const speaker=who==='ceo'?'You':esc(S.staff.mgr.name);
  openModal(M(`💬 ${esc(p.given)}`,`<div class="news"><b>${speaker}:</b> ${TALKS[ap][1]}</div><div class="news"><b>${esc(p.given)}</b> ${react}</div>${extra}<div style="text-align:center;margin-top:10px;font-size:22px;font-weight:800" class="${d>=0?'good':'bad'}">Morale ${d>=0?'+':''}${Math.round(d)} → ${Math.round(p.morale)}</div>`,'<button class="btn pri" onclick="closeModal()">OK</button>'));
  save();render();
}

// ---------- DECISION EVENTS ----------
const anyGroup=()=>pick(myGroups().filter(g=>g.members.length));
const EVENTS={
  talk:{run:(m,i)=>{if(i===2){const p=P(m.ev.pid);if(p)p.morale-=3;return 'You left them to it. Morale −3.'}closeModal();setTimeout(()=>showTalk(m.ev.pid,i===1?'mgr':'ceo'),50);return null}},
  stunt:{make:()=>{const g=anyGroup();if(!g)return;return{t:`${g.name} offered a risky variety stunt`,b:`"Extreme Idol Challenge" wants ${esc(g.name)} for a bungee-and-obstacle episode. Great for buzz, but someone could get hurt.`,c:['Accept','Decline'],ev:{gid:g.id},link:'g'+g.id}},
    run:(m,i)=>{const g=G(m.ev.gid);if(!g||i)return 'Declined politely.';g.fans*=1.03;if(Math.random()<0.25){const p=pick(members(g));p.injury={until:S.week+RI(1,3),type:'sprained ankle'};return `The episode was a hit (fans +3%), but ${p.given} sprained an ankle.`}return 'The episode was a hit. Fans +3%.'}},
  dayoff:{make:()=>{const p=pick(idols().filter(avail));if(!p)return;return{t:`${p.given} asks for time off`,b:`${esc(p.name)} wants a few days off for a family event back home.`,c:['Grant it','Refuse'],ev:{pid:p.id},link:'p'+p.id}},
    run:(m,i)=>{const p=P(m.ev.pid);if(!p)return '';if(!i){p.morale+=12;p.cond=clamp(p.cond+20,0,100);return `${p.given} is grateful. Morale +12.`}p.morale-=12;return `${p.given} is upset. Morale −12.`}},
  adhoc:{make:()=>{const g=anyGroup();if(!g)return;const fee=Math.round(20+Math.sqrt(g.fans)*0.08);return{t:`Last-minute ad offer for ${g.name}`,b:`A snack brand needs ${esc(g.name)} for a shoot this weekend. Fee <b>${fmtM(fee)}</b>, but it eats into rest time.`,c:['Accept','Decline'],ev:{gid:g.id,fee},link:'g'+g.id}},
    run:(m,i)=>{const g=G(m.ev.gid);if(!g||i)return 'Declined.';S.money+=m.ev.fee;members(g).forEach(p=>p.cond-=8);return `Shoot done. ${fmtM(m.ev.fee)} earned; condition −8.`}},
  interview:{make:()=>{const g=anyGroup();if(!g)return;const p=P(g.leader)||pick(members(g));return{t:`Exclusive interview request: ${p.given}`,b:`A major magazine wants a cover interview with ${esc(p.name)} of ${esc(g.name)}.`,c:['Accept','Decline'],ev:{pid:p.id,gid:g.id},link:'p'+p.id}},
    run:(m,i)=>{const p=P(m.ev.pid),g=G(m.ev.gid);if(!p||i)return 'Declined.';if(Math.random()<0.15+p.pers.con/100){p.image-=8;return `${p.given} made an awkward comment that went viral for the wrong reasons. Image −8.`}p.image=clamp(p.image+4,0,100);if(g)g.fans*=1.015;return 'A glowing cover story. Image +4, fans +1.5%.'}},
  sasaeng:{make:()=>{const g=anyGroup();if(!g)return;return{t:`Obsessive fans spotted at the dorm`,b:`Sasaeng fans have been waiting outside ${esc(g.name)}'s dorm at night. The members are shaken.`,c:['Hire security (₩30M)','Ignore it'],ev:{gid:g.id},link:'dorms'}},
    run:(m,i)=>{const g=G(m.ev.gid);if(!g)return '';if(S.staff.sec&&i){members(g).forEach(p=>p.morale-=2);return 'Your security team handled it quietly. Morale −2.'}if(!i){if(!pay(30))return 'Not enough money.';members(g).forEach(p=>p.morale+=5);return 'Security hired. The members feel safer (morale +5).'}members(g).forEach(p=>p.morale-=6);return 'Nothing was done. Morale −6.'}},
  hair:{make:()=>{const p=pick(idols().filter(x=>x.groupId));if(!p)return;return{t:`${p.given} wants a bold new look`,b:`${esc(p.name)} wants to dye their hair a striking new colour for the next era.`,c:['Approve','Deny'],ev:{pid:p.id},link:'p'+p.id}},
    run:(m,i)=>{const p=P(m.ev.pid);if(!p)return '';if(i){p.morale-=6;return 'Denied. Morale −6.'}p.morale+=8;p.hair=pick(HAIR_D);const g=G(p.groupId);if(Math.random()<0.5){if(g)g.fans*=1.01;return 'Fans love the new look! Morale +8, fans +1%.'}if(g)g.mood-=2;return 'Morale +8, but fans are divided on the look.'}},
  solo:{make:()=>{const p=pick(idols().filter(x=>x.groupId&&x.pers.amb>=12));if(!p)return;return{t:`${p.given} asks about a solo debut`,b:`${esc(p.name)} has been writing and wants to know if a solo project is possible.`,c:['Promise to consider it','Not now'],ev:{pid:p.id},link:'p'+p.id}},
    run:(m,i)=>{const p=P(m.ev.pid);if(!p)return '';if(!i){p.morale+=10;return `${p.given} is thrilled (morale +10). Don't forget your promise…`}p.morale-=8;p.pers.loy=Math.max(1,p.pers.loy-1);return `${p.given} is disappointed. Morale −8, loyalty −1.`}},
  truck:{make:()=>{const g=myGroups().find(g=>g.mood<55&&g.songs.length);if(!g)return;return{t:`Protest trucks outside the agency`,b:`${esc(g.fandom)} sent protest trucks demanding better treatment of ${esc(g.name)} (fairer lines and better management).`,c:['Issue an apology and promise equal lines','Ignore it'],ev:{gid:g.id},link:'fans'}},
    run:(m,i)=>{const g=G(m.ev.gid);if(!g)return '';if(!i){g.mood+=8;g.lineMode='equal';return 'Fans accepted the apology. Mood +8.'}g.mood-=6;return 'The protest grew louder. Mood −6.'}},
  jointcon:{make:()=>{const g=anyGroup();if(!g||g.fans<30000)return;const r=pick(rivalGroups());return{t:`${AG(r.agencyId).name} proposes a joint concert`,b:`${esc(r.name)} and ${esc(g.name)} on one stage. Costs ₩40M and pulls in both fandoms.`,c:['Accept','Decline'],ev:{gid:g.id,rid:r.id},link:'g'+g.id}},
    run:(m,i)=>{const g=G(m.ev.gid);if(!g||i)return 'Declined.';if(!pay(40))return 'Not enough money.';g.fans+=G(m.ev.rid).fans*0.01+5000;S.money+=60;return 'Sold out! Fans grew and the night netted ₩20M.'}},
  trip:{make:()=>{if(!S.producers.length)return;const pr=pick(S.producers);return{t:`${pr.name} wants an overseas recording trip`,b:`Your producer wants ₩80M to record with session players in LA.`,c:['Approve (₩80M)','Decline'],ev:{pr:pr.id},link:'studio'}},
    run:(m,i)=>{const pr=S.producers.find(x=>x.id===m.ev.pr);if(!pr||i)return 'Declined.';if(!pay(80))return 'Not enough money.';const d=newDemo(pr,12);S.demos.push(d);return `They came back with "${d.title}" (${grade(d.quality)} ${d.quality}).`}},
  charity:{make:()=>{const g=anyGroup();if(!g)return;return{t:`Charity event invitation`,b:`${esc(g.name)} are invited to volunteer at a children's charity event.`,c:['Attend','Decline'],ev:{gid:g.id},link:'g'+g.id}},
    run:(m,i)=>{const g=G(m.ev.gid);if(!g||i)return 'Declined.';members(g).forEach(p=>{p.image=clamp(p.image+5,0,100);p.cond-=5});g.mood+=3;return 'Heart-warming photos everywhere. Image +5, mood +3.'}},
  quit:{run:(m,i)=>{const p=P(m.ev.pid);if(!p)return '';if(!i){closeModal();setTimeout(()=>showTalk(p.id,'ceo'),50);return null}removePerson(p);return `${p.given} left the agency.`}},
};
function postDecision(k,o){mail(o.t,o.b,'decision',o.link,{ev:{k,...o.ev},choices:o.c,exp:S.week+1})}
function resolveEv(id,i){const m=S.inbox.find(x=>x.id===id);if(!m||m.resolved)return;const E=EVENTS[m.ev.k];const r=E.run(m,i);if(r===null){save();return}m.resolved=true;m.outcome=r;m.picked=i;save();render()}
function decisionBlock(m){if(!m.choices)return '';
  if(m.resolved)return `<div class="att"><div class="ah">DECISION MADE</div><div class="pb sm">${m.picked!=null?`<b>${esc(m.choices[m.picked])}</b> · `:''}${m.outcome||''}</div></div>`;
  return `<div class="att" style="border-color:var(--warn)"><div class="ah" style="color:var(--warn)">⚡ YOUR DECISION · reply by ${dayStr(m.exp,m.d||0)}</div><div class="pb row wrap">${m.choices.map((c,i)=>`<button class="btn ${i===0?'club':''}" onclick="resolveEv(${m.id},${i})">${esc(c)}</button>`).join('')}</div></div>`}
function weeklyLife(rep){
  mine().filter(p=>p.status!=='actor'&&p.morale<30&&(!p.lowMsg||S.week-p.lowMsg>=4)).slice(0,2).forEach(p=>{p.lowMsg=S.week;
    if(p.status==='trainee'&&p.morale<20)postDecision('quit',{t:`${p.given} is thinking of quitting`,b:`${esc(p.name)} told the coaches they may leave the academy. A talk from you might change their mind.`,c:['Talk to them (CEO)','Let them go'],ev:{pid:p.id},link:'p'+p.id});
    else postDecision('talk',{t:`${p.given}'s morale is low`,b:`${esc(p.name)} has been withdrawn lately (morale ${Math.round(p.morale)}). A conversation could help.`,c:['CEO talk','Road manager talk','Leave it'],ev:{pid:p.id},link:'p'+p.id})});
  const keys=Object.keys(EVENTS).filter(k=>EVENTS[k].make);
  for(let n=0;n<2;n++){if(Math.random()<0.45){const k=pick(keys),o=EVENTS[k].make();if(o)postDecision(k,o)}}
}
function expireDecisions(){visibleInbox().filter(m=>m.choices&&!m.resolved&&m.exp!=null&&(S.week>m.exp||(S.week===m.exp&&(S.day||0)>(m.d||0)))).forEach(m=>{const i=m.choices.length-1;const E=EVENTS[m.ev.k];let r='';if(m.ev.k==='talk'||m.ev.k==='quit'){r=E.run(m,i)}else r=E.run(m,i);m.resolved=true;m.picked=i;m.outcome='No reply in time, so it defaulted. '+(r||'')})}

// ---------- SOCIAL MEDIA ----------
const HANDLES=['kpop_daily','idolwatch','netizen','stan_acc','chartbuzz','seoulpopnews','krnewsbot','music_nerd','dance_cover','fancam_hub'];
function soc(text,sent,gid,tags,mult=1){const g=gid?G(gid):null;const base=g?Math.sqrt(g.fans+100)*6:300;
  let h,name;if(g&&sent>0&&Math.random()<0.6){h=`${g.fandom.toLowerCase().replace(/[^a-z]/g,'')}_${pick(['forever','4ever','luv','daily','archive','official'])}${RI(1,99)}`;name=`${g.fandom} 💗`}else{const b=pick(HANDLES);h=`${b}${Math.random()<0.5?RI(10,9999):''}`;name=b.replace(/_/g,' ')}
  S.social=S.social||[];S.social.unshift({id:nid(),w:S.week,d:S._weekly?RI(0,6):(S.day||0),h,name,text,sent,gid:gid||null,tags:tags||[],likes:Math.round(base*R(0.3,2.2)*mult),rt:Math.round(base*R(0.05,0.6)*mult)});S.social=S.social.slice(0,250)}
const tagOf=s=>'#'+s.replace(/[^A-Za-z0-9]/g,'');
function socialFromMail(m){
  const gid=m.link&&m.link[0]==='g'?+m.link.slice(1):m.link&&m.link[0]==='p'&&P(+m.link.slice(1))?P(+m.link.slice(1)).groupId:null;const g=gid?G(gid):null;
  const song=(m.title.match(/"([^"]+)"/)||[])[1];const ag=S.agency;
  const P2=(t,s,tags,mul)=>soc(t,s,gid,tags,mul);
  if(/DEBUT|COMEBACK|COLLAB/.test(m.title)&&g){const ls=lastSong(g),q=ls?ls.quality:50;
    P2(pick([`${g.name} "${song}" is OUT and I've had it on repeat for an hour 🔁`,`the ${ls&&ls.concept||''} concept for "${song}" is everything 😭`,`${g.name} said comeback season and meant it. "${song}" slaps`]),1,[tagOf(g.name),tagOf(song||'')],1.5);
    P2(q<50?pick([`not feeling ${g.name}'s new song tbh… ${ag} what is this`,`"${song}" is mid. the b-sides deserved title track`]):pick([`${ag} finally gave ${g.name} a song that matches their talent`,`vocals on "${song}" are insane, ${g.name} never miss`]),q<50?-1:1,[tagOf(g.name)])}
  else if(/WIN|win on|#1|ALL-KILL/i.test(m.title)&&g){P2(pick([`${g.name} WON!!! I'm literally crying 😭🏆`,`congrats ${g.name}!!! ${g.fandom} we did it`,`that encore stage… ${g.name} deserved this so much`]),1,[tagOf(g.name+'Win'),tagOf(g.name)],2)}
  else if(m.type==='scandal'){P2(pick([`wait what is happening with ${g?g.name:ag}??`,`${ag} needs to release a statement NOW`,`this is so disappointing honestly`,`people are jumping to conclusions without proof, wait for facts`]),-1,[tagOf(ag+'Explain')],2);P2(pick([`we stand with ${g?g.name:'them'} 🤍`,`stop spreading rumours!!`]),1,[tagOf('Protect'+(g?g.name:'Artists'))])}
  else if(/Panic vote/i.test(m.title)){const nm=(m.title.match(/: (.+)$/)||[])[1]||'';P2(`EVERYONE VOTE FOR ${nm.toUpperCase()} RIGHT NOW I'M NOT JOKING 🚨🚨`,1,[tagOf('Save'+nm)],3);P2(`how is ${nm} in the elimination zone?? the editing is rigged`,-1,[tagOf('Save'+nm)],2)}
  else if(/Vote-rigging/i.test(m.title)){soc(`So the votes were FAKE?? ${ag} should be ashamed`,-1,gid,[tagOf(ag+'Out')],4);soc(`refunding every vote I made. disgusting`,-1,gid,[tagOf('JusticeForTrainees')],3)}
  else if(/premieres/.test(m.title)){P2(`just watched the first episode, the acting was ${pick(['incredible','surprisingly good','a bit stiff ngl'])}`,0.5,['#KDrama'])}
  else if(/viral/i.test(m.title)){P2(`who is this?? the fancam has me in a chokehold 😳`,1,['#Fancam',g?tagOf(g.name):'#KPop'],3)}
  else if(/transfer|leaves/i.test(m.title)&&g){P2(`I can't believe this is happening to ${g.name}…`,-1,[tagOf(g.name)])}
}
function dailySocial(){
  myGroups().forEach(g=>{if(Math.random()>0.55)return;const m=pick(members(g));if(!m)return;const good=Math.random()*100<g.mood+10+sf('content')*10;
    const gap=S.week-(g.lastRel||0);
    if(gap>16&&Math.random()<0.5)soc(pick([`it's been ${gap} weeks… ${S.agency} where is ${g.name}'s comeback`,`${S.agency} hire more staff and give ${g.name} a comeback challenge (impossible)`]),-0.5,g.id,[tagOf(g.name+'Comeback')]);
    else if(good)soc(pick([`${m.given}'s visuals today are illegal`,`${g.name} stage presence is unmatched, no one does it like them`,`watching old ${g.name} vlogs at 3am again`,`${m.given} laughing at their own joke is my roman empire`,`${g.name}'s chemistry on that live was so cute 🥹`]),1,g.id,[tagOf(m.given),tagOf(g.name)]);
    else soc(pick([`${S.agency} is working ${g.name} way too hard, they look exhausted`,`why does ${m.given} always get the least screen time??`,`${g.name}'s schedule is so empty, ${S.agency} wake up`]),-1,g.id,[tagOf(S.agency+'DoBetter')])});
  if(S.survival&&Math.random()<0.8){const sv=S.survival,id=pick(sv.cont),p=P(id);if(p)soc(pick([`${p.given} on ${sv.title} is my pick for the debut lineup!!`,`episode ${sv.ep} of ${sv.title} had me screaming`,`${p.given} deserves more screen time, ${sv.title} editors are biased`]),Math.random()<0.7?1:-0.5,null,[tagOf(sv.title),tagOf(p.given)],1.5)}
  if(Math.random()<0.5){const s=SG(S.chart[0]);if(s)soc(`"${s.title}" by ${G(s.groupId).name} is still #1 on the chart. unstoppable`,0.5,s.groupId,['#Chart']) }
}
function visibleSocial(){const w=S.week,d=S.day||0;return(S.social||[]).filter(p=>p.w<w||(p.w===w&&p.d<=d))}
function vSocial(){
  const all=visibleSocial(),f=S.socf||'all',list=all.filter(p=>f==='all'||(f==='mine'?(p.gid&&G(p.gid)?.agencyId===0):String(p.gid)===f)).slice(0,80);
  const recent=all.filter(p=>p.w>=S.week-1),pos=recent.filter(p=>p.sent>0).length,neg=recent.filter(p=>p.sent<0).length,score=recent.length?Math.round(pos/(pos+neg||1)*100):50;
  const tags={};recent.forEach(p=>p.tags.forEach(t=>{if(t.length>1)tags[t]=(tags[t]||0)+p.likes}));const trend=Object.entries(tags).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const buzz=myGroups().map(g=>{const ps=recent.filter(p=>p.gid===g.id);const ps2=ps.filter(p=>p.sent>0).length;return{g,n:ps.length,eng:sum(ps.map(p=>p.likes+p.rt)),pos:ps.length?Math.round(ps2/ps.length*100):null}});
  const card=p=>{const g=p.gid?G(p.gid):null,face=faceOf(p.h);return `<div class="news" style="display:flex;gap:10px">${avatar(face,38)}<div class="f1" style="min-width:0"><div class="sm"><b>${esc(p.name)}</b> <span class="muted">@${esc(p.h)} · ${dayStr(p.w,p.d)}</span></div><div style="margin:3px 0;white-space:normal">${esc(p.text)} ${p.tags.filter(t=>t.length>1).map(t=>`<span style="color:var(--blue)">${esc(t)}</span>`).join(' ')}</div><div class="xs muted">💬 ${fmtF(p.rt/4)} · 🔁 ${fmtF(p.rt)} · ❤️ ${fmtF(p.likes)} ${p.sent>0?'<span class="good">● positive</span>':p.sent<0?'<span class="bad">● negative</span>':''}${g?` · ${esc(g.name)}`:''}</div></div></div>`};
  return `<div class="g2"><div>${panel('Feed',list.map(card).join('')||'<p class="muted">Nothing yet. Keep playing and people will start talking.</p>',`<select onchange="S.socf=this.value;render()"><option value="all">Everyone</option><option value="mine" ${f==='mine'?'selected':''}>About my agency</option>${myGroups().map(g=>`<option value="${g.id}" ${f==String(g.id)?'selected':''}>${esc(g.name)}</option>`).join('')}</select>`)}</div>
  <div>${panel('Sentiment · last 2 weeks',`<div style="font-size:34px;font-weight:800;font-family:'Barlow Condensed',sans-serif" class="${score>=60?'good':score<40?'bad':'warn'}">${score}% positive</div>${bar(score,score>=60?'var(--good)':score<40?'var(--bad)':'var(--warn)','100%')}<div class="xs muted" style="margin-top:4px">${fmtF(recent.length)} posts · ${fmtF(pos)} positive · ${fmtF(neg)} negative</div>`)}
  ${panel('Trending',trend.map(([t,v],i)=>`<div class="stat"><span><span class="muted xs">${i+1}</span> <b style="color:var(--blue)">${esc(t)}</b></span><span class="xs muted">${fmtF(v)} interactions</span></div>`).join('')||'<p class="muted sm">No trends yet.</p>')}
  ${panel('Buzz by group',buzz.map(b=>`<div class="stat"><span>${gLink(b.g)}<div class="xs muted">${b.n} mentions · ${fmtF(b.eng)} interactions</div></span><span>${b.pos==null?'<span class="muted xs">quiet</span>':`<span class="${b.pos>=60?'good':b.pos<40?'bad':'warn'}">${b.pos}% 👍</span>`}</span></div>`).join('')||'<p class="muted sm">No groups yet.</p>')}</div></div>`;
}

// ---------- FREE CASTINGS ----------
function freeCast(kind){
  S.castCool=S.castCool||{};if((S.castCool[kind]||0)>S.week)return toast(`Available again in week ${wkOf(S.castCool[kind])}`);
  const n=kind==='street'?3:6,lvl=S.fac.scout,err=Math.max(0.6,3.8-lvl*0.45-sf('scout')*1.6);S.scout=[];S.scoutRegion='KR';S.scoutKind=kind;
  for(let i=0;i<n;i++){const gem=Math.random()<(kind==='street'?0.12:0.06);const q=gem?R(0.55,0.8):R(0.02,0.32)+S.rep/400;
    const p=genPerson(rosterG(),q,{nat:Math.random()<0.95?'KR':pick(['JP','CN'])});
    p.shown={};AK.forEach(k=>{const c=p.attrs[k]+R(-err,err);p.shown[k]=[Math.round(clamp(c-err,1,20)),Math.round(clamp(c+err,1,20))]});
    p.potShown=[clamp(p.pot-err*1.3+R(-1,1),1,20),clamp(p.pot+err*1.3+R(-1,1),1,20)];p.cost=Math.round((10+p.pot*2.5+ovr(p))*0.6);S.scout.push(p)}
  S.castCool[kind]=S.week+(kind==='street'?2:4);
  mail(kind==='street'?'Street casting results':'Open audition results',kind==='street'?`Your scouts approached people in Hongdae and Myeongdong. ${n} caught their eye.`:`Hundreds turned up to the free open audition. ${n} made the shortlist.`,'news','trainees');
  done();
}
function vScouting(){
  const reg=S.scoutRegion||'KR',cc=S.castCool||{},lbl=S.scoutKind==='street'?'Street casting':S.scoutKind==='open'?'Open audition':AUDITION[reg].n;
  const fc=(k,l,d)=>{const w=(cc[k]||0)-S.week;return `<div class="opt" style="cursor:default"><div class="f1"><b>${l}</b> <span class="pill g">FREE</span><div class="xs muted">${d}</div></div><button class="btn s club" onclick="freeCast('${k}')" ${w>0?'disabled':''}>${w>0?w+' wk':'Go'}</button></div>`};
  return `<div class="grid" style="margin-bottom:10px">${panel('Free talent searches',fc('street','🚶 Street casting','Scouts approach people in busy streets. 3 raw candidates, with a small chance of a hidden gem. Every 2 weeks.')+fc('open','📣 Open audition','Anyone can walk in. 6 mostly raw candidates. Every 4 weeks.'))}
  ${panel('Paid auditions',`<p class="muted xs">Stronger, more polished candidates.</p><div class="row wrap"><select id="aureg">${Object.entries(AUDITION).map(([k,a])=>`<option value="${k}" ${k===reg?'selected':''}>${FLAG[k]} ${a.n} (${fmtM(a.cost)})</option>`).join('')}</select><button class="btn club s" onclick="const r=aureg.value;if(pay(AUDITION[r].cost)){S.scoutKind=null;genScout(r);done()}">Hold auditions</button></div>`)}</div>`
  +panel(`Shortlist · ${lbl}`,`<p class="muted sm">Scouts report attribute ranges. Personality is revealed once signed.</p>${S.scout.map((p,i)=>`<div class="opt" onclick="showPerson(null,${i})">${avatar(p,42)}<div class="f1"><b>${esc(p.given)}</b> ${FLAG[p.nat]} <span class="muted xs">${p.age} · ${role(p)}</span><div class="xs muted">Potential ${stars(p.potShown[0])}–${stars(p.potShown[1])}</div></div><b>${fmtM(p.cost)}</b></div>`).join('')||'<p class="muted">Shortlist empty.</p>'}`);
}

// ---------- SURVIVAL SHOW (custom + panic votes + fixed elimination) ----------
const SURV_BUDGET={low:['Low',500,-1,0.8],standard:['Standard',800,0,1],premium:['Premium',1300,2,1.35]};
function missionFor(sv,ep){if(ep>=sv.len-1)return 'Final';return['Vocal','Dance','Concept','Variety'][ep%4]}
function finaleCast(sv){return Math.min(sv.n0||sv.cont.length,sv.size+Math.max(2,Math.ceil(sv.size/2)))}
function cutFor(sv,epAfter,curN){const left=sv.len-epAfter;if(left<=1)return 0;return Math.max(0,Math.ceil((curN-finaleCast(sv))/(left-1)))}
function showSurvival(){
  survSel=new Set();const ts=trainees().sort((a,b)=>ovr(b)-ovr(a));
  if(ts.length<6)return toast('You need at least 6 trainees');
  const opt=(id,arr,def)=>`<select id="${id}" style="width:100%">${arr.map(([v,l])=>`<option value="${v}" ${v==def?'selected':''}>${l}</option>`).join('')}</select>`;
  openModal(M('Create a survival show',`<p class="muted sm">Design your own show. Pick 6–20 trainees.</p>
  ${ts.map(p=>`<div class="opt" onclick="survSel.has(${p.id})?survSel.delete(${p.id}):survSel.add(${p.id});this.classList.toggle('sel');svc.textContent=survSel.size">${avatar(p,30)}<div class="f1"><b>${esc(p.given)}</b> <span class="muted xs">${p.age} · ${role(p)}</span></div>${stars(ovr(p))}</div>`).join('')}
  <p class="sm"><b id="svc">0</b> selected</p>
  <label>Show title</label><input id="svt" style="width:100%" value="${pick(['Project: Debut','Road to Stage','Star Maker','Final Group','Next Light','Idol Origin'])}">
  <label>Winning group name</label><input id="svg" style="width:100%" value="${freeName()}">
  <div class="row wrap"><div class="f1"><label>Episodes</label>${opt('sve',[[6,'6 episodes'],[8,'8 episodes'],[10,'10 episodes'],[12,'12 episodes']],8)}</div><div class="f1"><label>Debut lineup</label>${opt('svs',[3,4,5,6,7,8,9,10,11].map(n=>[n,n+' members']),5)}</div></div>
  <div class="row wrap"><div class="f1"><label>Production budget</label>${opt('svb',Object.entries(SURV_BUDGET).map(([k,b])=>[k,`${b[0]} · ${fmtM(b[1])}`]),'standard')}</div><div class="f1"><label>Voting</label>${opt('svv',[['domestic','Domestic votes'],['global','Global votes (+overseas fans)']],'domestic')}</div></div>
  <p class="muted xs">There's no elimination in the penultimate episode. The finale is a live vote that decides the debut lineup. Longer shows build bigger fandoms, and a premium budget lifts ratings.</p>`,
  `<button class="btn" onclick="closeModal()">Cancel</button><button class="btn club" onclick="startSurvival()">Launch</button>`));
}
function startSurvival(){const n=survSel.size,size=+svs.value,len=+sve.value,b=SURV_BUDGET[svb.value];
  if(n<6||n>20)return toast('Pick 6–20 trainees');if(size>=n)return toast('Lineup must be smaller than the cast');if(!pay(b[1]))return;
  S.survival={title:svt.value.trim()||'Project: Debut',groupName:svg.value.trim()||freeName(),size,cont:[...survSel],n0:n,out:[],votes:{},mission:{},prevRank:{},ep:0,len,rating:0,focus:null,evil:null,budget:svb.value,voting:svv.value,panic:{}};
  mail(`📺 ${S.survival.title} announced`,`${n} trainees compete over ${len} episodes. The final ${size} debut as ${esc(S.survival.groupName)}.`,'news','tv');closeModal();done()}
function survGain(sv,p,id,ms){const b=SURV_BUDGET[sv.budget||'standard'];return(ms+p.attrs.vis+p.attrs.var*0.5)*(1+sv.ep*0.15)*Math.max(0.2,1+0.15*((sv.rig||{})[id]||0))*(1+((sv.panic||{})[id]||0))*Math.max(2,sv.rating||4+b[2])*320*(sv.voting==='global'?1.4:1)}
function survivalEpisode(rep){
  const sv=S.survival;sv.len=sv.len||8;sv.n0=sv.n0||sv.cont.length+sv.out.length;
  sv.cont=sv.cont.filter(id=>{const p=P(id);return p&&p.status==='trainee'&&p.agencyId===0});
  const mission=missionFor(sv,sv.ep),key={Vocal:['voc'],Dance:['dan'],Concept:['stg','vis'],Variety:['var'],Final:IK}[mission];
  sv.ep++;
  const prev=[...sv.cont].sort((a,b)=>(sv.votes[b]||0)-(sv.votes[a]||0));
  sv.cont.forEach(id=>{const p=P(id),ms=avg(key.map(k=>p.attrs[k]))*3+R(0,15)+(sv.focus===id?12:0);sv.mission[id]=Math.round(ms);sv.votes[id]=(sv.votes[id]||0)+survGain(sv,p,id,ms)});
  let note='';
  if(sv.evil&&sv.votes[sv.evil]!=null){sv.votes[sv.evil]*=0.75;if(Math.random()<0.25){S.rep=clamp(S.rep-3,0,100);boardAdj('all',-2);note=' An editing controversy broke out online!';mail('⚠ Survival show editing controversy','Viewers accused the show of an "evil edit". Ratings spiked, but the agency\'s reputation took a hit.','scandal','tv')}}
  const B=SURV_BUDGET[sv.budget||'standard'];
  sv.rating=clamp(2+sf('casting')+avg(sv.cont.map(id=>ovr(P(id))))/3+sf('pr')*2+S.fac.pr*0.4+(sv.evil?1.5:0)+R(0,2)+(note?2:0)+B[2]+(Object.keys(sv.panic||{}).length?1:0),1,25);
  sv.focus=null;sv.evil=null;sv.panic={};sv.interim=null;
  const rl=sum(Object.values(sv.rig||{}).map(Math.abs));sv.susp=clamp((sv.susp||0)+rl*1.2*(1-sf('pr')*0.4)-(rl?0:2),0,100);
  if(rl&&!sv.exposed&&Math.random()<Math.pow(sv.susp/100,2)*0.15)rigExposed(sv.title,null);
  const sorted=[...sv.cont].sort((a,b)=>sv.votes[b]-sv.votes[a]);
  sv.prevRank={};prev.forEach((id,i)=>sv.prevRank[id]=i+1);
  if(sv.ep>=sv.len){
    const fx=(sv.fixed||[]).filter(id=>sv.cont.includes(id)),fixedUsed=fx.length===sv.size;
    const winners=fixedUsed?[...fx].sort((a,b)=>sv.votes[b]-sv.votes[a]):sorted.slice(0,sv.size);if(fixedUsed)sv.susp=clamp((sv.susp||0)+35*(1-sf('pr')*0.4),0,100);
    const g=newGroupObj(sv.groupName,winners,Math.round((30000+sv.rating*25000)*B[3]*(1+sv.len/16)));
    if(sv.voting==='global'){addReg(g,'jp',g.fans*0.08);addReg(g,'sea',g.fans*0.08);addReg(g,'us',g.fans*0.05)}
    g.prep={weeks:3,title:songName(),concept:S.trend,budget:'Standard',demo:null,extraHype:10,type:'Mini',lines:'equal'};S.groups.push(g);
    sorted.filter(id=>!winners.includes(id)).forEach(id=>P(id).morale-=10);
    mail(`🎉 ${sv.title} LIVE finale: ${g.name} is born!`,`Final ranking: ${sorted.slice(0,sv.size).map((i,k)=>`${k+1}. ${esc(P(i).given)} (${fmtF(sv.votes[i])} votes)`).join(', ')}.${fixedUsed?' (Lineup fixed behind the scenes.)':''} They debut as <b>${g.name}</b> in 3 weeks with ${fmtF(g.fans)} fans waiting.`,'win','g'+g.id);
    if(!sv.exposed&&(sv.susp>0||fixedUsed)){S.rigCases=S.rigCases||[];S.rigCases.push({gid:g.id,title:sv.title,susp:sv.susp,until:S.week+104})}
    rep.surv={final:true,title:sv.title,winners,group:g.name};S.survival=null;return;
  }
  const fxs=(sv.fixed||[]).filter(id=>sv.cont.includes(id)),cutOrder=[...sorted.filter(id=>fxs.includes(id)),...sorted.filter(id=>!fxs.includes(id))];
  const cut=cutFor(sv,sv.ep,sorted.length),out=cut?cutOrder.slice(cutOrder.length-cut):[];
  sv.cont=sorted.filter(id=>!out.includes(id));out.forEach(id=>{P(id).morale-=8;sv.out.push(id)});
  rep.surv={final:false,title:sv.title,ep:sv.ep,mission,out,top:sorted.slice(0,3)};
  mail(`${sv.title} – Ep ${sv.ep} (${mission} mission)`,`Top 3: ${sorted.slice(0,3).map(i=>`${esc(P(i).given)} (${fmtF(sv.votes[i])})`).join(', ')}.${out.length?' Eliminated: '+out.map(i=>esc(P(i).given)).join(', ')+'.':sv.ep===sv.len-1?' No elimination this week. Next is the <b>LIVE FINALE</b>!':' No elimination this week.'} Ratings ${sv.rating.toFixed(1)}%.${note}`,'news','tv');
}
function survInterim(){
  const sv=S.survival;if(!sv||!sv.cont.length)return;
  const nextFinal=sv.ep===sv.len-1,cut=nextFinal?Math.max(0,sv.cont.length-sv.size):cutFor(sv,sv.ep+1,sv.cont.length);
  const key={Vocal:['voc'],Dance:['dan'],Concept:['stg','vis'],Variety:['var'],Final:IK}[missionFor(sv,sv.ep)];
  const est={};sv.cont.forEach(id=>{const p=P(id);est[id]=(sv.votes[id]||0)+survGain(sv,p,id,avg(key.map(k=>p.attrs[k]))*3+7)*0.5*R(0.55,1.45)});
  const rank=[...sv.cont].sort((a,b)=>est[b]-est[a]),zone=cut?rank.slice(rank.length-cut):[];
  const favs=Object.entries(sv.prevRank||{}).filter(([id,r])=>r<=3&&sv.cont.includes(+id)).map(([id])=>+id);
  const pop=[...sv.cont].sort((a,b)=>(P(b).attrs.vis+P(b).attrs.var)-(P(a).attrs.vis+P(a).attrs.var)).slice(0,2);
  sv.panic=sv.panic||{};
  zone.filter(id=>favs.includes(id)||pop.includes(id)).forEach(id=>{sv.panic[id]=R(0.35,0.75);const p=P(id);sv.rating+=0.6;
    mail(`🚨 Panic vote: ${p.given}`,`The mid-week interim ranking shows fan favourite <b>${esc(p.name)}</b> at #${rank.indexOf(id)+1}, inside the ${nextFinal?'cut-off for the debut lineup':'elimination zone'}. Fans have launched a massive panic-voting campaign. Expect a surge in votes this episode.`,'news','tv')});
  sv.interim={rank,est,zone,cut,day:S.day};
}
function survInterimPanel(sv){const it=sv.interim;if(!it)return panel('Mid-week interim ranking','<p class="muted sm">Interim rankings are revealed every Thursday. If a fan favourite drops into the elimination zone, their fandom may launch a <b>panic vote</b>.</p>');
  return panel(`Mid-week interim ranking · ${it.cut?`bottom ${it.cut} at risk`:'no elimination this week'}`,`<div class="tw"><table><tr><th>#</th><th>Contestant</th><th>Interim votes</th><th></th></tr>${it.rank.map((id,i)=>{const p=P(id);if(!p)return '';const z=it.zone.includes(id);return `<tr style="${z?'background:rgba(255,91,107,.08)':''}"><td><b>${i+1}</b></td><td>${esc(p.given)}</td><td>${fmtF(it.est[id])}</td><td>${z?'<span class="pill r">Danger zone</span>':''}${(sv.panic||{})[id]?' <span class="pill w">🚨 Panic voting</span>':''}</td></tr>`}).join('')}</table></div>`,'',true)}

// ---------- REALITY SHOW (custom) ----------
const REALITY_FMT={dorm:['Dorm life','Chemistry ++, fan mood +'],travel:['Travel diary','Fan mood ++, overseas fans +'],cooking:['Cooking & games','Variety-driven fan growth ++'],docu:['Documentary','Image +, ratings depend on Stage Presence']};
function showReality(){const gs=myGroups().filter(g=>g.songs.length||g.prep);if(!gs.length)return toast('You need a debuted group');
  const opt=(id,arr,def)=>`<select id="${id}" style="width:100%" onchange="rlcost.textContent=fmtM(realityCost())">${arr.map(([v,l])=>`<option value="${v}" ${v==def?'selected':''}>${l}</option>`).join('')}</select>`;
  openModal(M('Produce a reality show',`<label>Group</label><select id="rlg" style="width:100%">${gs.map(g=>`<option value="${g.id}">${esc(g.name)} (Variety ${gAttr(g,'var').toFixed(1)})</option>`).join('')}</select>
  <label>Show title</label><input id="rlt" style="width:100%" value="${pick(['Off Duty','Dorm Diaries','Behind the Light','Road Trip','Our Little Kitchen'])}">
  <label>Format</label>${opt('rlf',Object.entries(REALITY_FMT).map(([k,[l,d]])=>[k,`${l}: ${d}`]),'dorm')}
  <div class="row wrap"><div class="f1"><label>Episodes</label>${opt('rle',[[4,'4 episodes'],[6,'6 episodes'],[8,'8 episodes'],[10,'10 episodes']],6)}</div><div class="f1"><label>Platform</label>${opt('rlp',[['tv','TV channel (higher reach)'],['online','Online (cheaper, grows the channel)']],'tv')}</div></div>
  <p class="sm">Cost: <b id="rlcost">${fmtM(250)}</b></p>`,`<button class="btn" onclick="closeModal()">Cancel</button><button class="btn club" onclick="startReality()">Produce</button>`));setTimeout(()=>{const e=document.getElementById('rlcost');if(e)e.textContent=fmtM(realityCost())},0)}
function realityCost(){const e=+document.getElementById('rle').value,p=document.getElementById('rlp').value;return Math.round(e*(p==='tv'?45:22))}
function startReality(){const c=realityCost();if(!pay(c))return;const g=G(+rlg.value);S.reality={gid:g.id,title:`${g.name}: ${rlt.value.trim()||'Off Duty'}`,ep:0,len:+rle.value,format:rlf.value,platform:rlp.value,rating:0};mail('Reality show greenlit',`"${esc(S.reality.title)}" (${REALITY_FMT[S.reality.format][0]}, ${S.reality.len} episodes) starts next week.`,'news','tv');closeModal();done()}
function realityEpisode(){
  const r=S.reality,g=G(r.gid);if(!g||g.disbanded){S.reality=null;return}
  const f=r.format||'dorm',on=r.platform==='online',v=gAttr(g,'var');
  const gm={dorm:1,travel:1.1,cooking:1.4,docu:0.9}[f]*(on?0.8:1);
  g.fans+=(3000+g.fans*0.02*v/12)*gm;g.mood+={dorm:1.5,travel:2.5,cooking:1,docu:1}[f];
  if(f==='travel'){addReg(g,'jp',g.fans*0.003);addReg(g,'sea',g.fans*0.003)}
  if(f==='docu')members(g).forEach(p=>p.image=clamp(p.image+1,0,100));
  if(on)S.channel.subs+=g.fans*0.01*(1+sf('content')*0.5);
  const relGain=f==='dorm'?0.8:0.4;members(g).forEach(m=>{for(const n of g.members)if(n!==m.id)addRel(m.id,n,relGain)});
  const rt=clamp((f==='docu'?gAttr(g,'stg'):v)/3+sf('pr')*2+R(0,3)+(on?-1:0),1,15);r.rating=(r.rating*r.ep+rt)/(r.ep+1);r.ep++;
  if(r.ep>=(r.len||6)){mail(`"${r.title}" wraps`,`The reality show ended with an average rating of <b>${r.rating.toFixed(1)}%</b>.`,'news','g'+g.id);S.reality=null}
}

// ---------- DAY FLOW: inbox jump, show result → inbox ----------
function stepDay(){
  S.day=(S.day||0)+1;let res;
  if(S.day>6){advance();res={type:'week',rep:S.lastReport}}
  else{const show=runShow(S.day-1);if(S.day===3&&S.survival)survInterim();res={type:'show',show}}
  expireDecisions();dailySocial();
  if(conf()<5)S.over=true;save();return res;
}
function goInbox(ids){const vis=visibleInbox().filter(m=>ids.includes(m.id)).sort((a,b)=>(b.w*7+(b.d||0))-(a.w*7+(a.d||0)));if(!vis.length)return false;S.ibSel=vis[0].id;vis[0].read=true;S.ibf='all';S.ibq='';if(S.view!=='inbox')nav('inbox');else render();return true}
function cont(){
  if(S.over)return showGameOver();closeModal();
  const before=new Set(visUnreadIds()),pr=procOverlay('Processing…');
  setTimeout(()=>{const r=stepDay();pr.remove();
    const fresh=visUnreadIds().filter(id=>!before.has(id));
    if(fresh.length)goInbox(fresh);else render();
    if(S.over)return showGameOver();
    if(r.type==='week'){if(weekNotable(r.rep))showReport(r.rep)}
    else if(r.show&&(r.show.myPos||r.show.allkill))showShowResult(r.show)},40);
}
function contWeek(){
  if(S.over)return showGameOver();closeModal();
  const before=new Set(visUnreadIds()),pr=procOverlay('Processing to next week…');
  setTimeout(()=>{const shows=[];let r;do{r=stepDay();if(r.type==='show'&&r.show)shows.push(r.show)}while(r.type!=='week'&&!S.over);
    pr.remove();const fresh=visUnreadIds().filter(id=>!before.has(id));if(fresh.length)goInbox(fresh);else render();
    if(S.over)return showGameOver();
    const rep=r.rep;rep.shows=shows;rep.allkill=[...rep.allkill,...shows.filter(s=>s.allkill).map(s=>s.allkill)];
    if(weekNotable(rep)||shows.some(x=>x.myPos))showReport(rep)},40);
}
function toInbox(){closeModal();const u=visUnreadIds();if(u.length)goInbox(u);else if(S.view!=='inbox')nav('inbox')}
function showShowResult(sh){
  const rows=sh.top.map((t,i)=>{const s=SG(t.id),g=G(s.groupId),me=g.agencyId===0;return `<tr class="${me?'me':''}"><td><b>${i===0?'🏆':i+1}</b></td><td><b>${esc(g.name)}</b><div class="xs muted">"${esc(s.title)}"</div></td><td style="text-align:right"><b>${fmtF(t.v)}</b></td></tr>`}).join('');
  const ms=sh.mine?SG(sh.mine):null,won=sh.myPos===1;
  const extra=sh.myPos>5&&ms?`<tr class="me"><td><b>${sh.myPos}</b></td><td><b>${esc(G(ms.groupId).name)}</b><div class="xs muted">"${esc(ms.title)}"</div></td><td></td></tr>`:'';
  openModal(M(`${sh.day} · ${sh.show}`,`<div style="text-align:center;padding:6px 0 12px"><div class="xs muted">${dayStr(S.week,S.day,true)}</div><div style="font-size:30px;font-family:'Barlow Condensed',sans-serif;font-weight:700;color:${won?'var(--good)':'#fff'}">${won?'🏆 WIN!':'#'+sh.myPos+' of '+sh.total}</div>${ms?`<div class="sm muted">"${esc(ms.title)}" – ${esc(G(ms.groupId).name)} · ${ms.wweek} win${ms.wweek===1?'':'s'} this week</div>`:''}${sh.allkill?'<div class="pill p" style="margin-top:6px">💥 ALL-KILL</div>':''}</div><table><tr><th>#</th><th>Artist</th><th style="text-align:right">Points</th></tr>${rows}${extra}</table>`,`<button class="btn club" onclick="toInbox()">Continue ›</button>`));
}
