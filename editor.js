// ================= IN-GAME EDITOR =================
TABS_ALL.push(['editor','Editor','🛠','AGENCY']);
function edMark(){S.edited=true}
function edToggle(on){
  if(on&&!S.edited){openModal(M('Enable in-game editor?',`<p>The editor lets you change anything: money, attributes, fans, contracts, the board and more. This save will be marked <span class="pill w">EDITED</span> permanently.</p>`,`<button class="btn" onclick="closeModal()">Cancel</button><button class="btn club" onclick="S.editor=true;edMark();closeModal();done()">Enable editor</button>`));return}
  S.editor=on;done();
}
function edPath(path,val){const ks=path.split('.');let o=S;for(let i=0;i<ks.length-1;i++)o=o[ks[i]];o[ks[ks.length-1]]=val;edMark();done()}
const edNum=(label,path,val,min,max,step=1)=>`<div class="stat"><span class="sm">${label}</span><input type="number" value="${Math.round(val*100)/100}" min="${min}" max="${max}" step="${step}" style="width:120px" onchange="edPath('${path}',clamp(+this.value,${min},${max}))"></div>`;
const edRange=(label,val,min,max,step,on)=>`<div class="attr"><span class="sm">${label}</span><input type="range" min="${min}" max="${max}" step="${step}" value="${val}" style="width:100%;accent-color:var(--club)" oninput="this.nextElementSibling.textContent=this.value" onchange="${on}"><b class="a ${aCls(val)}">${Math.round(val*10)/10}</b></div>`;

const CHEATS=[
 ['money1','💰 +₩1B','Add ₩1,000,000,000 to the balance'],
 ['money10','💰 +₩10B','Add ₩10,000,000,000 to the balance'],
 ['debt','🧾 Clear debts','Pay off all loans and reset a negative balance to ₩0'],
 ['board','🏛 Board loves you','All board members to 100% satisfaction'],
 ['rep','⭐ Max reputation','Agency reputation to 100'],
 ['fac','🏗 Max facilities','All facilities to their maximum level'],
 ['heal','🩹 Heal everyone','Clear injuries and hiatuses, full condition'],
 ['morale','😊 Max morale','Everyone in the agency to 100 morale'],
 ['chem','💗 Perfect chemistry','Every relationship in your agency to +40'],
 ['train','📈 +2 all attributes','+2 to every attribute of your artists (up to 20)'],
 ['god','👑 Superstars','All your artists to 20 in every attribute and potential'],
 ['pot','🔮 Max potential','All your artists\' potential to 20'],
 ['fans','👥 Fans ×2','Double the fandom of every group you run'],
 ['mood','🎉 Ecstatic fans','All your fandoms to mood 100'],
 ['prep','⏩ Finish preparations','Every comeback in prep releases next week'],
 ['demos','🎧 Hit demo bank','Fill the demo bank with S-grade hit demos'],
 ['staff','🧑‍💼 Elite staff','Fill every staff role with a 20-rated head'],
 ['scandal','🧯 Bury scandals','Close every open scandal with no damage'],
 ['markets','🌏 Unlock all markets','Enter every overseas market for free'],
 ['contracts','✍ Extend contracts','Everyone\'s contract +7 years at a 10% split'],
 ['scout','🔍 Reveal scouting','Shortlist ranges collapse to exact values'],
 ['rivals','🧊 Freeze rivals','Push every rival comeback back 26 weeks'],
 ['nobids','🚫 Clear offers','Remove all rival bids and poaching attempts'],
 ['image','✨ Spotless image','Everyone\'s public image to 100'],
];
function cheat(k){
  const ms=mine();
  ({money1:()=>S.money+=1000,money10:()=>S.money+=10000,debt:()=>{S.loans=[];if(S.money<0)S.money=0},
    board:()=>S.board.members.forEach(m=>m.sat=100),rep:()=>S.rep=100,fac:()=>Object.keys(S.fac).forEach(f=>S.fac[f]=facMax()),
    heal:()=>ms.forEach(p=>{p.injury=null;p.hiatus=null;p.cond=100;p.lowWeeks=0}),morale:()=>ms.forEach(p=>p.morale=100),
    chem:()=>ms.forEach(a=>ms.forEach(b=>{if(a!==b){a.rel[b.id]=40;b.rel[a.id]=40}})),
    train:()=>ms.forEach(p=>AK.forEach(k=>p.attrs[k]=Math.min(20,p.attrs[k]+2))),
    god:()=>ms.forEach(p=>{AK.forEach(k=>p.attrs[k]=20);p.pot=20}),pot:()=>ms.forEach(p=>p.pot=20),
    fans:()=>myGroups().forEach(g=>g.fans*=2),mood:()=>myGroups().forEach(g=>g.mood=100),
    prep:()=>myGroups().forEach(g=>{if(g.prep)g.prep.weeks=1}),
    demos:()=>{while(S.demos.length<10){const d=newDemo(null,0);d.quality=RI(88,98);d.hit=true;d.credits=['Editor'];S.demos.push(d)}},
    staff:()=>Object.keys(STAFF).forEach(r=>{const s=genStaff();s.rating=20;s.wage=Math.round(2+400*0.05);S.staff[r]={...s,asst:S.staff[r]?S.staff[r].asst:null}}),
    scandal:()=>S.scandals.forEach(x=>{if(x.status==='open'){x.status='resolved';x.resp='buried';x.outcome='Buried by the editor.'}}),
    markets:()=>Object.keys(MARKETS).forEach(r=>{if(!S.markets[r])S.markets[r]={since:S.week}}),
    contracts:()=>ms.forEach(p=>{if(p.contract&&p.contract.end){p.contract.end=S.week+364;p.contract.split=10}}),
    scout:()=>S.scout.forEach(p=>{AK.forEach(k=>p.shown[k]=[Math.round(p.attrs[k]),Math.round(p.attrs[k])]);p.potShown=[p.pot,p.pot]}),
    rivals:()=>rivalGroups().forEach(g=>g.next+=26),nobids:()=>{S.offers=[];S.poach=null},
    image:()=>ms.forEach(p=>p.image=100)})[k]();
  edMark();done();toast('Cheat applied: '+CHEATS.find(c=>c[0]===k)[1]);const t=document.querySelector('.toast:last-of-type');if(t)t.style.background='var(--good)';
}
function vEditor(){
  if(!S.editor)return panel('In-game editor',`<p>Edit anything in your save, FM-style: balances, attributes, fans, contracts, staff, rivals, plus one-click cheats.</p>${S.edited?'<p class="warn sm">This save is already marked as edited.</p>':''}<button class="btn club" onclick="edToggle(true)">Enable editor</button>`);
  const[c,st]=subtabs('editor',[['cheats','Cheats'],['agency','Agency'],['people','People'],['groups','Groups'],['staff','Staff & studio']]);
  const top=`<div class="row" style="margin-bottom:10px"><span class="pill w">EDITOR ON</span><span class="muted sm f1">Changes apply instantly. Tap Edit on any profile too.</span><button class="btn s" onclick="edToggle(false)">Turn off</button></div>`;
  let body='';
  if(c==='cheats')body=`<div class="grid">${CHEATS.map(([k,l,d])=>`<div class="panel"><div class="pb row"><div class="f1"><b>${l}</b><div class="xs muted">${d}</div></div><button class="btn club s" onclick="cheat('${k}')">Apply</button></div></div>`).join('')}</div>`;
  if(c==='agency')body=`<div class="grid">${panel('Agency',edNum('Balance (₩M)','money',S.money,-99999,9999999,100)+edNum('Reputation','rep',S.rep,0,100)+`<div class="stat"><span class="sm">Agency name</span><input value="${esc(S.agency)}" onchange="S.agency=this.value||S.agency;S.agencies[0].name=S.agency;edMark();done()"></div><div class="stat"><span class="sm">Agency colour</span><input type="color" value="${S.color}" onchange="edPath('color',this.value)"></div><div class="stat"><span class="sm">Current trend</span><select onchange="edPath('trend',this.value)">${CK.map(k=>`<option ${S.trend===k?'selected':''}>${k}</option>`).join('')}</select></div><div class="stat"><span class="sm">Channel subscribers</span><input type="number" value="${Math.round(S.channel.subs)}" style="width:120px" onchange="edPath('channel.subs',Math.max(0,+this.value))"></div>`)}
    ${panel('Board',S.board.members.map((m,i)=>edNum(`${AGENDAS[m.agenda][0]} ${esc(m.name)}`,`board.members.${i}.sat`,m.sat,0,100)).join('')+`<div class="stat"><span class="sm">5-year vision</span><select onchange="S.board.vision.key=this.value;S.board.visionDone=false;edMark();done()">${Object.entries(VISIONS).map(([k,v])=>`<option value="${k}" ${S.board.vision.key===k?'selected':''}>${v[0]}</option>`).join('')}</select></div>`+edNum('Vision deadline (year)','board.vision.deadline',S.board.vision.deadline,2027,2099)+edNum('Target: agency position','board.targets.pos',S.board.targets.pos,1,7)+edNum('Target: music show wins','board.targets.wins',S.board.targets.wins,0,300)+`<div class="stat"><span class="sm">New HQ built</span><input type="checkbox" ${S.board.hq?'checked':''} onchange="edPath('board.hq',this.checked)"></div>`)}
    ${panel('Facilities & dorms',Object.entries(FAC).map(([k,[n]])=>edNum(n,'fac.'+k,S.fac[k],0,7)).join('')+S.dorms.map((d,i)=>edNum(`${esc(d.name)} quality`,`dorms.${i}.q`,d.q,1,5)+edNum(`${esc(d.name)} beds`,`dorms.${i}.beds`,d.beds,2,40)).join(''))}</div>`;
  if(c==='people'){const q=(S.edq||'').toLowerCase(),f=S.edf||'mine';
    let ps=S.people.filter(p=>(f==='all'||(f==='mine'&&p.agencyId===0)||(f==='rival'&&p.status==='rival')||(f==='free'&&p.status==='free'))&&(!q||p.name.toLowerCase().includes(q)||p.given.toLowerCase().includes(q)));
    body=panel(`People (${ps.length})`,`<div class="tw"><table><tr><th></th><th>Name</th><th>Status</th><th>Group / agency</th><th>Age</th><th>Ability</th><th>Pot.</th><th></th></tr>${ps.slice(0,80).map(p=>`<tr class="click" onclick="edPerson(${p.id})"><td>${avatar(p,26)}</td><td><b>${esc(p.given)}</b> <span class="muted xs">${esc(p.name)}</span></td><td class="sm">${p.status}</td><td class="sm">${esc(G(p.groupId)?.name||'')} <span class="muted xs">${p.agencyId>0?esc(AG(p.agencyId).name):''}</span></td><td>${p.age}</td><td>${stars(cur(p))}</td><td>${stars(p.pot)}</td><td><button class="btn s club">Edit</button></td></tr>`).join('')}</table></div>${ps.length>80?'<p class="muted xs" style="padding:0 10px">Showing 80. Search to narrow down.</p>':''}`,
    `<input placeholder="Search name…" value="${esc(S.edq||'')}" onchange="S.edq=this.value;render()" style="width:140px"><select onchange="S.edf=this.value;render()">${[['mine','My agency'],['rival','Rival idols'],['free','Free agents'],['all','Everyone']].map(([k,l])=>`<option value="${k}" ${f===k?'selected':''}>${l}</option>`).join('')}</select>`,true)}
  if(c==='groups'){const gs=S.groups.filter(g=>!g.disbanded).sort((a,b)=>(a.agencyId-b.agencyId)||b.fans-a.fans);
    body=panel('Groups',`<div class="tw"><table><tr><th>Group</th><th>Agency</th><th>Fans</th><th>Mood</th><th>Wins</th><th></th></tr>${gs.map(g=>`<tr class="click ${g.agencyId===0?'me':''}" onclick="edGroup(${g.id})"><td><b>${esc(g.name)}</b></td><td class="sm">${esc(AG(g.agencyId).name)}</td><td>${fmtN(g.fans)}</td><td>${Math.round(g.mood||0)}</td><td>${g.trophies}</td><td><button class="btn s club">Edit</button></td></tr>`).join('')}</table></div>`,'',true)}
  if(c==='staff')body=`<div class="grid">${panel('Staff ratings',Object.entries(STAFF).map(([k,[n]])=>S.staff[k]?edNum(`${n} · ${esc(S.staff[k].name)}`,`staff.${k}.rating`,S.staff[k].rating,1,20)+edNum(`↳ wage (₩M/wk)`,`staff.${k}.wage`,S.staff[k].wage,0,999):`<div class="stat"><span class="sm">${n}</span><button class="btn s" onclick="const s=genStaff();S.staff['${k}']=s;edMark();done()">Add random</button></div>`).join(''))}
    ${panel('Producers',S.producers.map((p,i)=>edNum(`${esc(p.name)} skill`,`producers.${i}.skill`,p.skill,1,20)+edNum(`↳ hit rate %`,`producers.${i}.hit`,p.hit,0,100)).join('')||'<p class="muted sm">No producers.</p>')}
    ${panel('Demo bank',S.demos.map((d,i)=>edNum(`"${esc(d.title)}" quality`,`demos.${i}.quality`,d.quality,1,100)).join('')||'<p class="muted sm">Empty.</p>')}</div>`;
  return st+top+body;
}
function edP(id,fn){const p=P(id);fn(p);edMark();done();edPerson(id)}
function edPerson(id){
  const p=P(id);if(!p)return;const mineP=p.agencyId===0;
  const set=(k,expr)=>`edP(${id},p=>{${expr}})`;
  openModal(M(`✎ Edit ${esc(p.given)}`,`<div class="row">${avatar(p,52)}<div class="f1"><input value="${esc(p.name)}" style="width:100%" onchange="${set('','p.name=this.value||p.name')}"><input value="${esc(p.given)}" style="width:100%;margin-top:4px" onchange="${set('','p.given=this.value||p.given')}"></div></div>
  <label>Attributes</label>${ATTRS.map(([k,l])=>edRange(l,Math.floor(p.attrs[k]),1,20,1,set('',`p.attrs.${k}=+this.value`))).join('')}${edRange('Potential',Math.round(p.pot),1,20,1,set('','p.pot=+this.value'))}
  <label>Personality</label>${PERS.map(([k,l])=>edRange(l,p.pers[k],1,20,1,set('',`p.pers.${k}=+this.value`))).join('')}
  <label>Status</label>${edRange('Morale',Math.round(p.morale),0,100,1,set('','p.morale=+this.value'))}${edRange('Condition',Math.round(p.cond),0,100,1,set('','p.cond=+this.value'))}${edRange('Public image',Math.round(p.image),0,100,1,set('','p.image=+this.value'))}
  <div class="stat"><span class="sm">Age</span><input type="number" value="${p.age}" min="13" max="60" style="width:90px" onchange="${set('','p.age=clamp(+this.value,13,60)')}"></div>
  ${p.status==='actor'||p.status==='idol'?`<div class="stat"><span class="sm">Actor tier</span><select onchange="${set('','p.tier=+this.value')}">${TIERS.map((t,i)=>`<option value="${i}" ${p.tier===i?'selected':''}>${t}</option>`).join('')}</select></div>`:''}
  ${p.status==='actor'?`<div class="stat"><span class="sm">Fame</span><input type="number" value="${Math.round(p.fame)}" style="width:120px" onchange="${set('','p.fame=Math.max(0,+this.value)')}"></div>`:''}
  ${p.contract&&p.contract.end?`<div class="stat"><span class="sm">Contract weeks left</span><input type="number" value="${p.contract.end-S.week}" min="1" max="1000" style="width:90px" onchange="${set('','p.contract.end=S.week+clamp(+this.value,1,1000)')}"></div><div class="stat"><span class="sm">Revenue split %</span><input type="number" value="${p.contract.split}" min="0" max="90" style="width:90px" onchange="${set('','p.contract.split=clamp(+this.value,0,90)')}"></div>`:''}
  ${p.injury||p.hiatus?`<button class="btn s" onclick="${set('','p.injury=null;p.hiatus=null;p.lowWeeks=0')}">🩹 Clear injury / hiatus</button>`:''}`,
  [!mineP?`<button class="btn pri" onclick="edSign(${id})">Move to my agency</button>`:'',
   mineP&&p.status==='trainee'?`<button class="btn" onclick="edP(${id},p=>{p.status='idol';if(!p.contract||!p.contract.end)newContract(p)})">Make idol</button>`:'',
   mineP&&p.status==='idol'?`<button class="btn" onclick="edP(${id},p=>{p.status='actor';p.groupId=null;p.dormId=null;S.groups.forEach(g=>g.members=g.members.filter(i=>i!==p.id))})">Make actor</button>`:'',
   mineP&&p.status==='actor'?`<button class="btn" onclick="edP(${id},p=>{p.status='idol';assignDorm(p)})">Make idol</button>`:'',
   '<button class="btn" onclick="closeModal()">Close</button>'].join('')));
}
function edSign(id){const p=P(id);S.groups.forEach(g=>{g.members=g.members.filter(i=>i!==id)});S.free=S.free.filter(i=>i!==id);
  p.status=p.status==='actor'?'actor':(p.attrs.act>ovr(p)+3&&p.status==='free'?'actor':'idol');p.agencyId=0;p.groupId=null;p.joined=S.week;p.morale=80;p.contract={end:S.week+5*52,split:15,salary:5,signed:S.week};if(p.status!=='actor')assignDorm(p);
  mail(`🛠 ${p.given} moved to ${S.agency}`,`Transferred by the editor. Add them to a group from Trainees.`,'news','p'+p.id);edMark();closeModal();done()}
function edG(gid,fn){const g=G(gid);fn(g);edMark();done();edGroup(gid)}
function edGroup(gid){
  const g=G(gid),my=g.agencyId===0,set=e=>`edG(${gid},g=>{${e}})`;
  openModal(M(`✎ Edit ${esc(g.name)}`,`<label>Name</label><input value="${esc(g.name)}" style="width:100%" onchange="${set('g.name=this.value||g.name')}">
  <div class="stat"><span class="sm">Fans</span><input type="number" value="${Math.round(g.fans)}" style="width:140px" onchange="${set('g.fans=Math.max(0,+this.value)')}"></div>
  ${edRange('Fan mood',Math.round(g.mood||70),10,100,1,set('g.mood=+this.value'))}
  <div class="stat"><span class="sm">Career wins</span><input type="number" value="${g.trophies}" style="width:90px" onchange="${set('g.trophies=Math.max(0,+this.value)')}"></div>
  <div class="stat"><span class="sm">Wins this year</span><input type="number" value="${g.yWins||0}" style="width:90px" onchange="${set('g.yWins=Math.max(0,+this.value)')}"></div>
  <label>Fans by region (%)</label>${Object.entries(REGIONS).map(([k,l])=>`<div class="stat"><span class="sm">${l}</span><input type="number" value="${Math.round((g.reg[k]||0)*100)}" min="0" max="100" style="width:80px" onchange="${set(`g.reg.${k}=Math.max(0,+this.value)/100;normReg(g.reg)`)}"></div>`).join('')}
  ${my?`<label>Identity</label><div class="stat"><span class="sm">Fandom</span><input value="${esc(g.fandom)}" onchange="${set('g.fandom=this.value||g.fandom')}"></div><div class="stat"><span class="sm">Lightstick</span><input type="color" value="${g.color}" onchange="${set('g.color=this.value')}"></div>
  <div class="stat"><span class="sm">Debut week (game week #)</span><input type="number" value="${g.debutWeek}" style="width:90px" onchange="${set('g.debutWeek=+this.value')}"></div>
  ${g.prep?`<button class="btn s" onclick="${set('g.prep.weeks=1')}">⏩ Release next week</button>`:''}`
  :`<div class="stat"><span class="sm">Next comeback in (weeks)</span><input type="number" value="${Math.max(0,g.next-S.week)}" style="width:90px" onchange="${set('g.next=S.week+Math.max(0,+this.value)')}"></div>`}
  <label>Members</label>${members(g).map(p=>`<div class="stat"><span class="sm">${esc(p.given)} ${stars(ovr(p))}</span><button class="btn s" onclick="edPerson(${p.id})">Edit</button></div>`).join('')}`));
}
