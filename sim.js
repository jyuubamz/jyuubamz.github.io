// ================= WEEKLY SIMULATION =================
function advance(){
  if(S.over)return;
  S.week++;S.day=0;
  const wk=wkOf(S.week),rep={rel:[],shows:[],awards:[],goals:[],surv:null,tour:[],allkill:[],noms:null};
  const inc={},exp={};const add=(o,k,v)=>{if(v)o[k]=(o[k]||0)+v};
  const gInc=(g,k,v)=>add(inc,k,v*share(g));
  const prevMoney=S.money;
  if(wk===1){
    S.people.forEach(p=>p.age++);S.groups.forEach(g=>g.yWins=0);S.yfin={inc:{},exp:{}};setTargets();
    Object.entries(S.fanclub).forEach(([gid,on])=>{const g=G(+gid);if(on&&g&&!g.disbanded)gInc(g,'Fan clubs',g.fans*0.05*(g.mood/70)*0.01)});
    mail(`${yearOf(S.week)} board targets`,`Finish <b>#${S.board.targets.pos}</b> or better in the agency table and win <b>${S.board.targets.wins}</b> music shows.`,'board','board');
  }
  if((S.week-1)%13===0&&S.week>1){const old=S.trend;S.trend=pick(CK.filter(c=>c!==old));mail('New trend: '+S.trend,`<b>${S.trend}</b> concepts are what the public wants this season. Matching it gives releases extra hype.`)}
  if(S.delegate.classes)trainees().forEach(p=>{let w='voc';['voc','dan','rap','stg','var'].forEach(k=>{if(p.attrs[k]<p.attrs[w])w=k});p.focus=w});
  // ---- academy
  const mult=INTENS[S.academy][1],tough=hasTrait('Tough Love'),calm=hasTrait('Calm');
  trainees().forEach(p=>{
    train(p,mult);p.cond=clamp(p.cond+(S.academy==='intense'?2:12),0,100);
    if(S.academy==='intense')p.morale-=0.8;if(S.academy==='light')p.morale+=0.5;
    if(tough)p.morale-=0.3;if(S.week-p.joined>52)p.morale-=0.5;
    p.morale=clamp(p.morale+R(-1.2,1.2)*(1+(20-p.pers.tem)/15),0,100);
  });
  trainees().filter(p=>p.morale<12).forEach(p=>{removePerson(p);mail(p.given+' has left the agency',`${esc(p.name)} terminated their trainee contract after losing hope of debuting.`)});
  if(S.predebut){const pd=S.predebut;pd.ep++;pd.ids.forEach(id=>{const p=P(id);if(p)p.prefans+=Math.round((p.attrs.vis+p.attrs.var)*160*R(0.7,1.3)*(1+S.fac.pr*0.1))});
    if(pd.ep>=4){mail(`"${pd.title}" wraps`,`The pre-debut series built pre-fans for ${pd.ids.map(i=>P(i)?esc(P(i).given):'').join(', ')}. They'll carry over at debut.`);S.predebut=null}}
  // ---- health
  myGroups().filter(g=>!g.members.length).forEach(g=>disbandGroup(g.id,true));
  mine().forEach(p=>{
    p.morale+=(62-p.morale)*0.04;if(calm)p.morale+=0.3;
    if(p.injury&&S.week>=p.injury.until){p.injury=null;mail(`${p.given} is fit again`,`${esc(p.name)} has recovered and is back in training.`)}
    if(p.hiatus&&S.week>=p.hiatus.until){p.hiatus=null;p.morale=Math.max(p.morale,60);p.cond=100;p.image=clamp(p.image+5,0,100);mail(`${p.given} returns from hiatus`,`${esc(p.name)} is back and ready to work.`)}
    if(p.status==='idol'&&!p.injury&&!p.hiatus){
      const g=p.groupId?G(p.groupId):null;
      const risk=Math.max(0.001,0.003+(p.cond<30?0.01:0)+(g&&g.intensity==='intense'?0.003:0)+(g&&promoting(g)&&g.stage==='ambitious'?0.004:0)-sf('mgr')*0.0015);
      if(Math.random()<risk){const w=RI(1,6);p.injury={until:S.week+w,type:pick(['ankle sprain','back strain','knee injury','wrist injury','vocal cord strain'])};mail(`🩹 ${p.given} injured`,`${esc(p.name)} suffered a ${p.injury.type} and will be out for about ${w} week(s).`,'news','p'+p.id)}
      if(p.cond<15||p.morale<10)p.lowWeeks++;else p.lowWeeks=Math.max(0,p.lowWeeks-1);
      if(p.lowWeeks>=4){p.hiatus={until:S.week+RI(4,10),reason:'burnout'};p.lowWeeks=0;if(g)g.mood-=5;mail(`⚠ ${p.given} goes on hiatus`,`${esc(p.name)} is suffering from burnout and will take a break. Watch condition and morale more closely.`,'news','p'+p.id)}
    }
  });
  // ---- filming
  mine().filter(p=>p.busy&&S.week>=p.busy.until).forEach(p=>airDrama(p));
  actors().forEach(p=>{if(avail(p)){train(p,0.6,'act');p.cond=clamp(p.cond+15,0,100)}p.morale=clamp(p.morale+R(-1,1.2),0,100)});
  // ---- groups
  myGroups().forEach(g=>{
    const ms=members(g),act=ms.filter(avail),gi=INTENS[g.intensity][1];
    if(!g.parent)act.forEach(p=>train(p,0.3*gi,g.train));
    if(g.intensity==='intense')act.forEach(p=>{p.cond-=3;p.morale-=0.5});
    const L=P(g.leader);if(L)ms.forEach(p=>p.morale+=(L.attrs.var+L.attrs.stg)/40-0.35);
    const c=chem(g.members);ms.forEach(p=>p.morale+=c/120);
    for(let i=0;i<g.members.length;i++)for(let j=i+1;j<g.members.length;j++){addRel(g.members[i],g.members[j],0.3);if(rel(g.members[i],g.members[j])<-18&&Math.random()<0.05){const a=P(g.members[i]),b=P(g.members[j]);a.morale-=8;b.morale-=8;g.mood-=2;mail(`Tension in ${g.name}`,`${esc(a.given)} and ${esc(b.given)} had a heated argument at practice. Their relationship is poor.`,'news','g'+g.id)}}
    if(g.promo){if(S.week>g.promo.until)g.promo=null;else{addReg(g,g.promo.r,2000+g.fans*0.02);act.forEach(p=>p.cond-=6);boardAdj('global',0.3)}}
    if(g.prep){
      g.prep.weeks--;act.forEach(p=>p.cond-=5);
      if(g.prep.weeks<=0)doRelease(g,rep);
    }else if(touring(g)){/* handled in tours */}
    else if(promoting(g)){
      const cc={safe:5,standard:7,ambitious:10}[g.stage]-sf('mgr')*3;act.forEach(p=>p.cond-=cc);gInc(g,'Broadcast fees',3*ms.length);g.mood+=0.8;
    }else{
      if(S.delegate.schedules){g.schedule=gCond(g)<45?'rest':g.fans>=30000?'brand':'fanmeet'}
      let sc=g.schedule||'rest';
      if(sc==='festival'&&season(S.week)!=='festival')sc=g.schedule='rest';
      if(sc==='rest')ms.forEach(p=>{p.cond+=25+sf('mgr')*10;p.morale+=4});
      if(sc==='practice')act.forEach(p=>{train(p,0.7*gi,g.train);p.cond-=5});
      if(sc==='variety'){g.fans+=1500+g.fans*0.012*gAttr(g,'var')/10;act.forEach(p=>p.cond-=10);gInc(g,'Schedules',6)}
      if(sc==='fanmeet'){g.fans+=800+g.fans*0.008;g.mood+=1;act.forEach(p=>{p.morale+=3;p.cond-=6});gInc(g,'Schedules',10+Math.pow(g.fans,0.6)*0.02)}
      if(sc==='brand'){if(g.fans>=30000){gInc(g,'Brand deals',15+Math.pow(g.fans,0.6)*0.03);act.forEach(p=>p.cond-=5)}else g.schedule='rest'}
      if(sc==='concert'){if(g.fans>=300000){gInc(g,'Concerts & tours',Math.pow(g.fans,0.65)*0.035);g.fans*=1.01;act.forEach(p=>p.cond-=20)}else g.schedule='rest'}
      if(sc==='festival'){gInc(g,'Schedules',15+Math.pow(g.fans,0.6)*0.025);g.fans+=1000+g.fans*0.004;act.forEach(p=>p.cond-=8)}
    }
    if(S.week-g.lastRel>20)g.mood-=0.4;
    g.mood=clamp(g.mood+(70-g.mood)*0.02,10,100);
    ms.forEach(p=>{p.cond=clamp(p.cond+sf('mgr')*2,0,100);if(p.cond<25)p.morale-=2;p.morale=clamp(p.morale+sf('mgr')*0.5+R(-0.8,0.8)*(1+(20-p.pers.tem)/15),0,100)});
    if(ms.some(p=>p.cond<20)&&!g._warned){mail(g.name+' are exhausted','Several members have very low condition. Schedule <b>Rest</b> or risk injuries and burnout.','news','g'+g.id);g._warned=true}
    if(ms.every(p=>p.cond>=40))g._warned=false;
  });
  freeIdols().forEach(p=>{if(avail(p))train(p,0.5);p.cond=clamp(p.cond+15,0,100)});
  // ---- dorms & rules
  S.dorms.forEach(d=>{const occ=mine().filter(p=>p.dormId===d.id),over=Math.max(0,occ.length-d.beds),dm=(d.q-2.5)*0.5-Math.min(4,over*0.8);
    occ.forEach(p=>p.morale=clamp(p.morale+dm,0,100));
    const rooms={};occ.forEach(p=>(rooms[p.room]=rooms[p.room]||[]).push(p));
    Object.values(rooms).forEach(rs=>{if(rs.length>2)rs.forEach(p=>p.morale-=0.5);for(let i=0;i<rs.length;i++)for(let j=i+1;j<rs.length;j++)addRel(rs[i].id,rs[j].id,1-Math.abs(rs[i].pers.tem-rs[j].pers.tem)/12)});
    if(over>0&&!d._warned){mail(d.name+' is overcrowded',`${occ.length} people share ${d.beds} beds. Morale is dropping.`,'news','dorms');d._warned=true}if(!over)d._warned=false;
    add(exp,'Dorm upkeep',4+d.q*2+d.beds*0.5)});
  mine().filter(p=>p.status!=='actor'&&!p.ownHome).forEach(p=>{const f=1.3-p.pers.pro/20;p.morale-=((S.rules.curfew?0.25:0)+({free:0,limited:0.15,collected:0.5}[S.rules.phone])+(S.rules.dating?0.35:0))*f;
    if(p.status==='idol'&&p.groupId&&S.week-G(p.groupId).debutWeek>=208&&!p.wantsHome&&Math.random()<0.03){p.wantsHome=true;mail(`${p.given} asks to move out`,`${esc(p.name)} feels it's time for their own place. Grant a housing allowance in <b>Dorms</b>, or morale will slide.`,'news','dorms')}
    if(p.wantsHome)p.morale-=0.4;});
  const homes=mine().filter(p=>p.ownHome).length;if(homes)add(exp,'Housing allowance',homes*3);
  // ---- TV
  S.tv=S.tv.filter(t=>{
    const tg=t.kind==='group'?G(t.tid):P(t.tid);if(!tg||t.until<S.week){if(tg)mail(`${t.show} spot ends`,`${esc(tg.name)}'s regular spot on ${t.show} has wrapped.`);return false}
    const sh=TVSHOWS.find(x=>x.name===t.show);add(inc,'TV appearances',sh.fee);
    const v=t.kind==='group'?gAttr(tg,'var'):tg.attrs.var,viral=Math.random()<0.03+v/400;
    if(t.kind==='group'){tg.fans+=1200*sh.tier+tg.fans*(viral?0.05:0.006);members(tg).forEach(p=>p.cond-=3)}
    else{const g=tg.groupId?G(tg.groupId):null;if(g)g.fans+=800*sh.tier+g.fans*(viral?0.03:0.004);else tg.fame+=1500*sh.tier+tg.fame*(viral?0.05:0.01);tg.cond-=3}
    if(viral)mail(`📈 Viral moment on ${t.show}`,`A clip of ${esc(tg.name)} on ${t.show} is everywhere online. A wave of new fans.`);
    return true;});
  if(S.reality){const r=S.reality,g=G(r.gid);if(!g||g.disbanded)S.reality=null;else{g.fans+=3000+g.fans*0.02*gAttr(g,'var')/12;g.mood+=1;r.rating=(r.rating*r.ep+clamp(gAttr(g,'var')/3+sf('pr')*2+R(0,3),1,15))/(r.ep+1);r.ep++;members(g).forEach(m=>{for(const n of g.members)if(n!==m.id)addRel(m.id,n,0.4)});
    if(r.ep>=6){mail(`"${r.title}" wraps`,`The reality show ended with an average rating of <b>${r.rating.toFixed(1)}%</b>. The members grew closer.`);S.reality=null}}}
  if(S.survival)survivalEpisode(rep);
  S.rigCases=(S.rigCases||[]).filter(c=>{if(S.week>c.until)return false;if(Math.random()<Math.pow(c.susp/100,2)*0.02){rigExposed(c.title,c.gid);return false}return true});
  Object.entries(S.channel.plan).forEach(([gid,t])=>{const g=G(+gid);if(!g||g.disbanded||t==='none')return;const m=CHANNEL[t][1];S.channel.subs+=g.fans*0.004*m*R(0.5,1.5);g.fans+=200*m+S.channel.subs*0.0002*m;members(g).forEach(p=>p.cond-=1)});
  add(inc,'Channel ads',S.channel.subs/50000);
  // ---- tours
  S.tours.forEach(t=>{if(t.idx>=t.stops.length)return;const g=G(t.gid);if(!g||g.disbanded){t.idx=t.stops.length;return}
    const st=t.stops[t.idx],v=VENUES[st.venue],rf=regFans(g,st.r),sold=Math.round(Math.min(v.cap,rf*0.12+500)),rev=sold*0.02;
    gInc(g,'Concerts & tours',rev);add(exp,'Tour production',v.cost);addReg(g,st.r,rf*0.03+800);members(g).forEach(p=>p.cond-=12);g.mood+=1.5;
    st.sold=sold;st.rev=Math.round(rev);t.rev+=rev;if(st.r!=='kr')boardAdj('global',0.5);rep.tour.push({g:g.name,city:st.city,sold,cap:v.cap,venue:st.venue});t.idx++;
    if(t.idx>=t.stops.length)mail(`🎤 ${g.name} tour complete`,`"${esc(t.name)}" wrapped after ${t.stops.length} shows, grossing <b>${fmtM(t.rev)}</b> for the agency (before split).`,'release','g'+g.id)});
  // ---- rivals
  rivalGroups().forEach(g=>{
    members(g).forEach(p=>{train(p,0.25);p.cond=100;
      if(p.contract&&p.contract.end<=S.week){if(Math.random()<0.6)p.contract.end=S.week+RI(104,260);else{g.members=g.members.filter(i=>i!==p.id);makeFree(p);mail(`${p.given} leaves ${g.name}`,`${esc(p.name)} did not renew with ${esc(AG(g.agencyId).name)} and is now a <b>free agent</b>.`,'news','market')}}});
    if(g.members.length<3){const p=genPerson(g.gender,R(0.4,0.75),{agencyId:g.agencyId,status:'rival',ageMin:17,ageMax:22});p.groupId=g.id;p.contract={end:S.week+RI(150,350),split:20,salary:5};S.people.push(p);g.members.push(p.id)}
    if(S.week>=g.next){g.next=S.week+RI(6,14);releaseSong(g,songName(),rivalQuality(g),R(0,10)+(season(S.week)==='yearend'?3:0),S.week,{type:pick(['Single','Mini','Mini','Full'])})}
  });
  S.free=S.free.filter(id=>{const p=P(id);if(!p||p.status!=='free')return false;if(S.week>=p.freeUntil){const tg=pick(rivalGroups().filter(x=>x.gender===p.g)||rivalGroups());if(tg){p.status='rival';p.agencyId=tg.agencyId;p.groupId=tg.id;p.contract={end:S.week+RI(104,260),split:30,salary:5};tg.members.push(p.id)}return false}return true});
  // ---- charts & fans
  computeChart();
  S.songs.forEach(s=>{const g=G(s.groupId);if(g.agencyId!==0)return;if(s.rank===1&&s.lastRank!==1){boardAdj('fame',3);mail(`👑 "${s.title}" is #1!`,`${g.name} top the weekly digital chart.`,'win','charts')}else if(s.rank&&s.rank<=10&&(!s.lastRank||s.lastRank>10))boardAdj('fame',0.5)});
  S.groups.forEach(g=>{if(g.disbanded)return;
    const s=lastSong(g);
    if(s&&S.week-s.week<=6&&s.cur>0){const m=g.agencyId===0?1+S.fac.pr*0.15+sf('pr')*0.3:1;g.fans+=(s.cur*s.cur*0.4+g.fans*0.003*s.cur/100)*m*(g.agencyId===0?0.6+g.mood/175:1)}
    else g.fans*=g.agencyId===0?0.998:R(0.997,1.003);
    if(g.agencyId===0)Object.keys(S.markets).forEach(r=>addReg(g,r,g.fans*0.003));
  });
  // album sales
  S.songs.forEach(s=>{const age=S.week-s.week;if(age<0||age>8){s.wsales=0;return}const g=G(s.groupId),m=ALBUM[s.type]?ALBUM[s.type].sales:0.15;
    if(age===0){s.wsales=Math.round(g.fans*(g.mood/70)*m*(0.08+s.quality/1000)*R(0.85,1.15));s.sales=s.wsales;
      if(g.agencyId===0&&s.wsales&&(!S.rec.bestSales||s.wsales>S.rec.bestSales.v))S.rec.bestSales={v:s.wsales,t:s.title,g:g.name}}
    else s.wsales=Math.round(s.wsales*0.35);
    s.total+=s.wsales;if(g.agencyId===0&&s.wsales)gInc(g,'Album sales',s.wsales*0.003)});
  S.songs.forEach(s=>s.wweek=0);
  // fan wars & mood
  const top3=S.chart.slice(0,3).map(SG).filter(s=>S.week-s.week<=3);
  top3.filter(s=>G(s.groupId).agencyId===0).forEach(ms=>{const rv=top3.find(s=>G(s.groupId).agencyId!==0);if(rv&&Math.random()<0.15&&!S.fanwars.some(f=>f.gid===ms.groupId&&f.until>=S.week)){S.fanwars.push({id:nid(),gid:ms.groupId,rid:rv.groupId,until:S.week+3,w:S.week});mail(`🔥 Fan war: ${G(ms.groupId).fandom} vs ${G(rv.groupId).name} fans`,`Chart rivalry spilled into a fan war online. Votes are up, but fan mood suffers. You can issue a statement in <b>Fans</b>.`,'news','fans')}});
  S.fanwars.filter(f=>f.until>=S.week).forEach(f=>{const g=G(f.gid);if(g)g.mood-=2});
  // ---- studio
  S.producers.forEach(pr=>{pr.prog+=1+pr.skill/10+S.fac.studio*0.2+sf('prod')*1.5;if(pr.prog>=8){pr.prog=0;if(S.demos.length<10){const d=newDemo(pr);S.demos.push(d);mail(`New demo from ${pr.name}: "${d.title}"`,`A ${d.concept} demo rated <b>${grade(d.quality)}</b> (${d.quality})${d.hit?' — <b>hit potential!</b>':''}.`,'news','studio')}};add(exp,'Producer wages',pr.wage)});
  // ---- market & offers
  marketWeek();
  S.roles=S.roles.filter(r=>r.expires>=S.week);if(S.week%4===0)genRoles();
  // ---- contracts
  mine().filter(p=>p.contract&&p.contract.end).forEach(p=>{const left=p.contract.end-S.week;
    if([52,26,8].includes(left))mail(`Contract: ${p.given} (${left} weeks left)`,`${esc(p.name)}'s contract expires ${dateStr(p.contract.end)}. Open their profile to negotiate a renewal.`,'news','p'+p.id);
    if(S.delegate.renewals&&left<=26&&left>0&&!p.renewTried){p.renewTried=true;const d=demand(p);tryRenew(p,d,p.status==='actor'?3:5,true)}
    if(left<=0)contractExpire(p)});
  // ---- scandals
  const rm=(S.rules.curfew?0.8:1)*(S.rules.phone==='collected'?0.7:S.rules.phone==='limited'?0.85:1)*(S.rules.dating?0.7:1)*(1-sf('pr')*0.3);
  mine().filter(p=>(p.status==='idol'||p.status==='actor')&&!p.hiatus).forEach(p=>{if(Math.random()<0.0032*(p.pers.con/8)*rm)newScandal(p)});
  S.scandals.filter(x=>x.status==='open'&&S.week>x.deadline).forEach(x=>resolveScandal(x.id,'ignore',true));
  S.scandals.filter(x=>x.status==='denied'&&x.truth&&S.week-x.week<=8).forEach(x=>{if(Math.random()<0.2){x.status='exposed';const p=P(x.pid),g=x.gid?G(x.gid):null;if(p)p.image=clamp(p.image-20,0,100);if(g)g.mood-=15;S.rep=clamp(S.rep-4,0,100);boardAdj('all',-5);mail(`💣 Evidence emerges: ${p?p.given:''}`,`New evidence contradicts the agency's denial of the ${x.type.toLowerCase()}. The backlash is severe.`,'scandal','scandals')}});
  // ---- academy evals & pools
  if(wk%4===0&&trainees().length)monthlyEval();
  if((S.week-1)%4===0){genScout(S.scoutRegion||'KR');mail('New audition results','Your scouts have a fresh shortlist. See <b>Trainees → Scouting</b>.','news','trainees')}
  if(S.week%8===0){genStaffPool();genActorPool();S.prodPool=[genProducer(),genProducer(),genProducer()]}
  // ---- income
  S.cfs=S.cfs.filter(c=>{const p=P(c.pid);if(!p||p.agencyId!==0||c.until<S.week)return false;if(p.image<40){mail(`${c.brand} drops ${p.given}`,`Citing image concerns, ${c.brand} ended the endorsement early.`);return false}add(inc,'Endorsements (CF)',c.weekly);return true});
  Object.entries(S.merch).forEach(([gid,t])=>{const g=G(+gid);if(g&&!g.disbanded&&t)gInc(g,'Merchandise',g.fans*(g.mood/70)*[0,0.00002,0.00004,0.00007][t])});
  S.songs.forEach(s=>{if(s.cur>0){const g=G(s.groupId);if(g.agencyId===0)gInc(g,'Streaming',s.cur*0.45)}});
  // ---- expenses
  if(trainees().length)add(exp,'Trainee upkeep',trainees().length*2);
  const sal=sum(mine().filter(p=>p.status!=='trainee').map(p=>p.contract?p.contract.salary:4));if(sal)add(exp,'Artist salaries',sal);
  const sw=sum(Object.values(S.staff).filter(Boolean).map(s=>s.wage+(s.asst?s.asst.wage:0)));if(sw)add(exp,'Staff wages',sw);
  if(S.interns.length)add(exp,'Interns',S.interns.length);
  add(exp,'Facilities',6+sum(Object.values(S.fac))*3+(S.board.hq?20:0));
  S.loans=S.loans.filter(l=>{add(exp,'Loan repayments',l.weekly);l.left--;return l.left>0});
  // staff contracts & interns
  Object.entries(S.staff).forEach(([k,s])=>{if(!s)return;if(s.end-S.week===8)mail(`${s.name}'s contract`,`Your ${STAFF[k][0]}'s contract ends in 8 weeks. They'll renew at +15% wages unless you release them.`,'news','staff');if(s.end<=S.week){s.wage=Math.round(s.wage*1.15);s.end=S.week+104;mail(`${s.name} renews`,`${STAFF[k][0]} ${esc(s.name)} signed a new 2-year deal at ${fmtM(s.wage)}/week.`)}if(s.asst)s.asst.rating=Math.min(s.rating,s.asst.rating+(s.trait==='Mentor'?0.06:0.03))});
  S.interns.forEach(i=>i.rating=Math.min(18,i.rating+(hasTrait('Mentor')?0.25:0.15)));
  let gross=sum(Object.values(inc))-sum(Object.values(exp));if(gross>0)add(exp,'Corporate tax & overhead',gross*0.22);
  const ti=sum(Object.values(inc)),te=sum(Object.values(exp));
  S.money+=ti-te;S.fin={inc,exp,ti,te};
  Object.entries(inc).forEach(([k,v])=>add(S.yfin.inc,k,v));Object.entries(exp).forEach(([k,v])=>add(S.yfin.exp,k,v));
  S.bal.push(Math.round(S.money));S.bal=S.bal.slice(-52);
  if(S.share){const ch=(ti>te?0.004:-0.004)+(agencyFans(0)>S.share.lastFans?0.004:-0.002)+R(-0.025,0.025);S.share.lastFans=agencyFans(0);S.share.price=Math.max(500,Math.round(S.share.price*(1+ch)));S.share.hist.push(S.share.price);S.share.hist=S.share.hist.slice(-52);boardAdj('profit',ch*40)}
  randomEvent();
  CEREMONIES.forEach(c=>{if(wk===c.week-3){computeNoms(c);rep.noms=c.name}if(wk===c.week)ceremony(c,rep)});
  checkGoals(rep);
  // ---- board
  if(S.money<0){boardAdj('profit',-2.5);boardAdj('all',-0.6)}else if(ti>te)boardAdj('profit',0.2);else if(te-ti>60)boardAdj('profit',-0.2);
  if(S.money<0&&!S._neg){mail('⚠ The board is concerned','The agency is in the red. Board confidence falls every week until the balance recovers. Consider a loan in <b>Finances</b>.','board','finances');S._neg=true}if(S.money>=0)S._neg=false;
  if(!S.board.visionDone&&visionMet()){S.board.visionDone=true;boardAdj('all',20);mail('🌟 5-year vision achieved!',`You delivered the board's vision: <b>${VISIONS[S.board.vision.key][0]}</b>. Confidence soars.`,'board','board')}
  if(wk===52)boardReview();
  if(conf()<5)S.over=true;
  S.agencies[0].rep=S.rep;S.lastReport=rep;
  save();
}
function visionMet(){const k=S.board.vision.key;return k==='top3'?myPos()<=3:k==='global'?Object.keys(S.markets).length>=3:k==='daesang'?S.awardHist.some(a=>a.aid===0&&BIG.includes(a.cat)):!!S.board.ipo}
function makeFree(p){p.status='free';p.agencyId=-1;p.groupId=null;p.dormId=null;p.busy=null;p.freeUntil=S.week+8;p.contract=null;if(!S.free.includes(p.id))S.free.push(p.id)}
function contractExpire(p){
  const g=p.groupId?G(p.groupId):null;
  removePerson(p);S.people.push(p);makeFree(p);
  S.groups.forEach(x=>{if(x.members.includes(p.id))x.members=x.members.filter(i=>i!==p.id)});
  if(g){g.mood-=15;if(g.members.length<2)disbandGroup(g.id,true)}
  mail(`👋 ${p.given} leaves the agency`,`${esc(p.name)}'s contract expired without renewal. They're now a free agent.`,'news','market');
}
function disbandGroup(gid,auto){const g=G(gid);g.disbanded=true;g.prep=null;members(g).forEach(p=>{if(p.groupId===gid)p.groupId=null});S.groups.filter(x=>x.parent===gid).forEach(x=>x.disbanded=true);S.tv=S.tv.filter(t=>!(t.kind==='group'&&t.tid===gid));delete S.channel.plan[gid];mail(`${g.name} ${auto?'disband':'disbanded'}`,`${g.name} have officially disbanded after ${Math.max(0,Math.round((S.week-g.debutWeek)/52*10)/10)} years. Remaining members are unassigned idols.`)}
function renewChance(p,split,years){const d=demand(p);return clamp(0.5+(split-d)/12+(p.pers.loy-10)/25+(p.morale-50)/90-(years>5?0.1:0),0.02,0.98)}
function tryRenew(p,split,years,quiet){
  if(Math.random()<renewChance(p,split,years)){p.contract={end:S.week+years*52,split,salary:Math.round(4+split/4),signed:S.week};p.morale=clamp(p.morale+8,0,100);mail(`✍ ${p.given} renews`,`${esc(p.name)} signed a ${years}-year renewal at a ${split}% split.`,'news','p'+p.id);return true}
  p.renewBlock=S.week+4;p.morale-=5;if(!quiet)mail(`${p.given} rejects renewal`,`${esc(p.name)}'s camp rejected the ${split}% offer. Try again in 4 weeks.`);return false;
}
function doRelease(g,rep){
  const pr=g.prep,b=BUDGET[pr.budget],A=ALBUM[pr.type||'Mini'],demo=pr.demo,ms=members(g);
  const prd=demo&&demo.prod?S.producers.find(x=>x.id===demo.prod):null;
  const base=demo?demo.quality*0.35+(demo.concept===pr.concept?4:0)+(prd?(prd.chem[g.id]||0)/3:0):12+R(0,10);
  const c=chem(g.members),lm=pr.lines||'equal';
  const lineQ={equal:-1,skill:4,center:2}[lm];
  const injured=ms.filter(p=>p.injury||p.hiatus).length;
  const q=clamp(groupSkill(g,pr.concept)*2.6+base+b.bonus*0.8+A.q+S.fac.studio*2+sf('vis')*5+(hasTrait('Innovator')?2:0)+c/10+lineQ+R(-6,6)-(gCond(g)<40?8:0)-injured*3,5,99);
  const debut=!g.songs.length;
  if(g.streak.c===pr.concept)g.streak.n++;else g.streak={c:pr.concept,n:1};
  const ss=season(S.week);
  const hype=(pr.concept===S.trend?6:0)+(debut?5:0)+S.fac.pr*2+sf('pr')*4+b.bonus/3+(pr.extraHype||0)+Math.min(6,(g.streak.n-1)*2)+(ss==='summer'&&pr.concept==='Summer'?6:0)+(ss==='yearend'?3:0)+(lm==='center'?3:0);
  const lines=lineDist(g,lm);
  const s=releaseSong(g,pr.title,q,hype,S.week,{type:pr.type||'Mini',concept:pr.concept,credits:demo?demo.credits:['Outside writers'],lines,collab:pr.collab||null});
  if(prd)prd.chem[g.id]=Math.min(30,(prd.chem[g.id]||0)+5);
  if(demo&&demo.idol){const ip=P(demo.idol);if(ip){ip.credits++;g.mood+=4}}
  g.prep=null;rep.rel.push(s.id);
  // line distribution effects
  const sorted=Object.entries(lines).sort((a,b)=>a[1]-b[1]);
  if(lm==='equal')ms.forEach(p=>p.morale+=2);
  if(lm==='skill'){sorted.slice(0,Math.ceil(sorted.length/3)).forEach(([id])=>{const p=P(+id);if(p){p.morale-=6;g.members.forEach(o=>o!==p.id&&addRel(p.id,o,-1.5))}});g.mood-=2}
  if(lm==='center'){ms.forEach(p=>{if(p.id===g.center)p.morale+=5;else p.morale-=4});g.mood-=1}
  if(debut){g.debutWeek=S.week;ms.forEach(p=>{p.morale=clamp(p.morale+20,0,100);if(!p.contract||!p.contract.end)newContract(p)})}
  mail(`${debut?'DEBUT':pr.collab?'COLLAB':'COMEBACK'}: ${g.name} – "${pr.title}"`,`${g.name} ${debut?'officially debuted':'released'} the ${ALBUM[pr.type||'Mini'].n.toLowerCase()} "${esc(pr.title)}" (${pr.concept}). Critics rate it <b>${grade(q)}</b> (${Math.round(q)}/100).`,'release','g'+g.id);
}
function lineDist(g,lm){const ms=members(g);if(!ms.length)return{};let w;
  if(lm==='equal')w=ms.map(()=>1);
  else if(lm==='skill')w=ms.map(p=>Math.pow((p.attrs.voc+p.attrs.rap*0.7)/10,2.2));
  else w=ms.map(p=>p.id===g.center?ms.length*0.45:1);
  const t=sum(w);const o={};ms.forEach((p,i)=>o[p.id]=Math.round(w[i]/t*100));return o}
function runShow(i){
  const elig=S.songs.filter(s=>s.rank&&S.week-s.week<=3&&s.type!=='JP');if(!elig.length)return null;
  const show=SHOWS[i];
  const sc=elig.map(s=>{const g=G(s.groupId);let v=s.cur*0.7+Math.log10(g.fans+10)*8;
    if(g.agencyId===0){const st=g.stage,C=P(g.center),ms=members(g);v+=sf('stg')*5+(C&&avail(C)?(C.attrs.vis+C.attrs.stg)/6:0)-(gCond(g)<30?10:0)+chem(g.members)/5-ms.filter(p=>!avail(p)).length*6+(S.fanwars.some(f=>f.gid===g.id&&f.until>=S.week)?5:0);
      v+=st==='safe'?5+R(0,18):st==='ambitious'?-5+gAttr(g,'stg')*0.8+R(0,45):R(0,30)}else v+=R(0,30)+groupSkill(g)*0.5;
    return{s,v}}).sort((a,b)=>b.v-a.v);
  const win=sc[0].s,wg=G(win.groupId);
  win.wins++;win.wweek++;wg.trophies++;wg.yWins=(wg.yWins||0)+1;
  const mp=sc.findIndex(x=>G(x.s.groupId).agencyId===0)+1;
  const res={show,day:DAYS[i+1],top:sc.slice(0,5).map(x=>({id:x.s.id,v:Math.round(x.v*50)})),myPos:mp,mine:mp?sc[mp-1].s.id:null,total:sc.length};
  if(wg.agencyId===0){wg.fans=wg.fans*1.003+800;wg.mood+=0.5;S.rep=clamp(S.rep+0.4,0,100);boardAdj('awards',0.4);
    if(wg.trophies===1){const wks=S.week-wg.debutWeek;if(!S.rec.firstWin||wks<S.rec.firstWin.wks)S.rec.firstWin={g:wg.name,wks};mail(`🏆 ${wg.name} take their FIRST WIN!`,`"${esc(win.title)}" won on ${show}, ${wks} weeks after debut. The members broke down in tears on stage.`,'win','g'+wg.id)}
    else mail(`🏆 ${wg.name} win on ${show}`,`"${esc(win.title)}" took the trophy (${win.wins} win${win.wins>1?'s':''} for this song).`,'win','g'+wg.id)}
  const phys=S.songs.filter(s=>s.wsales>0).sort((a,b)=>b.wsales-a.wsales);
  S.songs.filter(s=>s.rank===1&&G(s.groupId).agencyId===0&&!s.allKill&&phys[0]===s&&s.wweek>=3).forEach(s=>{s.allKill=true;const g=G(s.groupId);g.fans*=1.03;boardAdj('fame',3);S.rec.allkills.push({t:s.title,g:g.name,w:S.week});res.allkill=s.id;mail(`💥 ALL-KILL: "${s.title}"`,`#1 digital, #1 physical and ${s.wweek} music show wins in one week. ${g.name} made history.`,'win','charts')});
  return res;
}
function airDrama(p){
  const d=S.dramas.find(x=>x.id===p.busy.dramaId);p.busy=null;if(!d)return;
  const ch=d.costar?Math.round(R(-10,15)+p.attrs.var/4):null;d.chem=ch;
  const score=clamp(p.attrs.act*2.6+p.attrs.vis*0.6+d.prest*6+({Lead:8,Supporting:3,Cameo:0}[d.part])+sf('act')*5+(ch||0)/2+R(-10,12),5,100);
  d.score=Math.round(score);d.aired=S.week;
  const pm={Lead:1,Supporting:0.5,Cameo:0.2}[d.part];
  if(p.status==='actor')p.fame+=score*score*3*pm*(1+d.tier*0.4);
  else if(p.groupId){const g=G(p.groupId);if(g)g.fans+=score*score*1.2*pm}
  p.image=clamp(p.image+(score-50)/10,0,100);
  let tierUp='';if(score>=60&&d.tier>=p.tier&&p.tier<3){p.tier++;tierUp=` ${esc(p.given)} steps up to <b>${TIERS[p.tier]}</b>-tier projects.`}
  S.rep=clamp(S.rep+score/60,0,100);
  mail(`📺 "${d.title}" premieres`,`${esc(p.name)}'s ${d.type.toLowerCase()} (${d.part}${d.costar?', opposite '+esc(d.costar):''}) debuted to ${dRating(d)}.${ch!=null?` On-screen chemistry: ${ch>8?'electric':ch>0?'solid':'awkward'}.`:''} ${score>70?'Critics are raving.':score>45?'A solid reception.':'Reviews were lukewarm.'}${tierUp}`,'release','actors');
}
const dRating=d=>d.type==='Film'?(d.score/9).toFixed(1)+'M admissions':(d.score/4).toFixed(1)+'% ratings';
function survivalEpisode(rep){
  const sv=S.survival;
  sv.cont=sv.cont.filter(id=>{const p=P(id);return p&&p.status==='trainee'&&p.agencyId===0});
  const mission=['Vocal','Dance','Concept','Variety','Vocal','Dance','Concept','Final'][sv.ep]||'Final';
  const key={Vocal:['voc'],Dance:['dan'],Concept:['stg','vis'],Variety:['var'],Final:IK}[mission];
  sv.ep++;
  const prev=[...sv.cont].sort((a,b)=>(sv.votes[b]||0)-(sv.votes[a]||0));
  sv.cont.forEach(id=>{const p=P(id),ms=avg(key.map(k=>p.attrs[k]))*3+R(0,15)+(sv.focus===id?12:0);sv.mission[id]=Math.round(ms);sv.votes[id]=(sv.votes[id]||0)+(ms+p.attrs.vis+p.attrs.var*0.5)*(1+sv.ep*0.15)*Math.max(0.2,1+0.15*((sv.rig||{})[id]||0))*100});
  let note='';
  if(sv.evil&&sv.votes[sv.evil]!=null){sv.votes[sv.evil]*=0.75;if(Math.random()<0.25){S.rep=clamp(S.rep-3,0,100);boardAdj('all',-2);note=' An editing controversy broke out online!';mail('⚠ Survival show editing controversy','Viewers accused the show of an "evil edit". Ratings spiked, but the agency\'s reputation took a hit.','scandal')}}
  sv.rating=clamp(2+avg(sv.cont.map(id=>ovr(P(id))))/3+sf('pr')*2+S.fac.pr*0.4+(sv.evil?1.5:0)+R(0,2)+(note?2:0),1,20);
  sv.focus=null;sv.evil=null;
  const rl=sum(Object.values(sv.rig||{}).map(Math.abs));sv.susp=clamp((sv.susp||0)+rl*1.2*(1-sf('pr')*0.4)-(rl?0:2),0,100);
  if(rl&&!sv.exposed&&Math.random()<Math.pow(sv.susp/100,2)*0.15)rigExposed(sv.title,null);
  const sorted=[...sv.cont].sort((a,b)=>sv.votes[b]-sv.votes[a]);
  sv.prevRank={};prev.forEach((id,i)=>sv.prevRank[id]=i+1);
  const left=sv.len-sv.ep;
  if(left<=0){
    const fx=(sv.fixed||[]).filter(id=>sv.cont.includes(id));const fixedUsed=fx.length===sv.size;
    const winners=fixedUsed?[...fx].sort((a,b)=>sv.votes[b]-sv.votes[a]):sorted.slice(0,sv.size);if(fixedUsed)sv.susp=clamp((sv.susp||0)+35*(1-sf('pr')*0.4),0,100);
    const g=newGroupObj(sv.groupName,winners,Math.round(30000+sv.rating*25000));
    g.prep={weeks:3,title:songName(),concept:S.trend,budget:'Standard',demo:null,extraHype:10,type:'Mini',lines:'equal'};S.groups.push(g);
    sorted.slice(sv.size).forEach(id=>P(id).morale-=10);
    mail(`🎉 ${sv.title} finale: ${g.name} is born!`,`${winners.map(i=>esc(P(i).given)).join(', ')} won and will debut as <b>${g.name}</b> in 3 weeks with ${fmtN(g.fans)} fans already waiting.`,'win','g'+g.id);
    if(!sv.exposed&&(sv.susp>0||fixedUsed)){S.rigCases=S.rigCases||[];S.rigCases.push({gid:g.id,title:sv.title,susp:sv.susp,until:S.week+104})}
    rep.surv={final:true,title:sv.title,winners,group:g.name};S.survival=null;return;
  }
  const fxs=(sv.fixed||[]).filter(id=>sv.cont.includes(id)),cutOrder=[...sorted.filter(id=>fxs.includes(id)),...sorted.filter(id=>!fxs.includes(id))];
  const cut=Math.floor((sorted.length-sv.size)/left),out=cutOrder.slice(cutOrder.length-cut);
  sv.cont=sorted.filter(id=>!out.includes(id));out.forEach(id=>{P(id).morale-=8;sv.out.push(id)});
  rep.surv={final:false,title:sv.title,ep:sv.ep,mission,out,top:sorted.slice(0,3)};
  mail(`${sv.title} – Ep ${sv.ep} (${mission} mission)`,`Top 3: ${sorted.slice(0,3).map(i=>esc(P(i).given)).join(', ')}.${out.length?' Eliminated: '+out.map(i=>esc(P(i).given)).join(', ')+'.':''} Ratings ${sv.rating.toFixed(1)}%.${note}`,'news','tv');
}
function monthlyEval(){
  const ts=trainees().map(p=>({p,s:ovr(p)*5+R(-4,4)+p.morale/20+p.pers.pro/10})).sort((a,b)=>b.s-a.s);
  ts.forEach((x,i)=>{x.p.lastRank=x.p.rank;x.p.rank=i+1});
  ts.slice(0,3).forEach(x=>x.p.morale=clamp(x.p.morale+8,0,100));
  if(ts.length>4)ts.slice(-2).forEach(x=>x.p.morale=clamp(x.p.morale-6,0,100));
  S.evals.unshift({w:S.week,list:ts.map(x=>({id:x.p.id,name:x.p.given,s:Math.round(x.s)}))});S.evals=S.evals.slice(0,12);
  mail('Monthly showcase rankings',`Top 3: ${ts.slice(0,3).map((x,i)=>`${i+1}. ${esc(x.p.given)}`).join(' · ')}.`,'news','trainees');
}
function fameOf(p){return p.status==='actor'?p.fame:p.groupId&&G(p.groupId)?G(p.groupId).fans*0.4:0}
function marketWeek(){
  S.offers=S.offers.filter(o=>{if(o.expires<S.week){const p=P(o.pid);if(p&&p.wants)p.morale-=10;mail('Offer expired',`${AG(o.aid).name}'s bid for ${p?esc(p.given):'an idol'} lapsed.`);return false}return true});
  const cand=myGroups().filter(g=>g.members.length>2).flatMap(members).filter(p=>ovr(p)>=9&&!S.offers.some(o=>o.pid===p.id));
  if(cand.length&&Math.random()<0.05){
    const p=pick(cand.sort((a,b)=>ovr(b)-ovr(a)).slice(0,5)),ag=pick(S.agencies.slice(1));
    const o={id:nid(),pid:p.id,aid:ag.id,amount:Math.round(value(p)*R(1.05,1.6)),expires:S.week+2};p.wants=p.pers.amb>12&&p.pers.loy<11||Math.random()<0.2;
    if(S.delegate.offers){if(o.amount>=value(p)*1.5){S.offers.push(o);respondOffer(o.id,true,true)}else mail(`Assistant rejected ${ag.name}'s bid`,`Your assistant turned down ${fmtM(o.amount)} for ${esc(p.name)}.`)}
    else{S.offers.push(o);mail(`💼 ${ag.name} bid for ${p.given}`,`${ag.name} offered <b>${fmtM(o.amount)}</b> for ${esc(p.name)} (${G(p.groupId).name}). ${p.wants?'<b>'+esc(p.given)+' is interested in the move.</b> ':''}Respond in <b>Market</b> within 2 weeks.`,'offer','market')}
  }
  if(S.poach&&S.poach.until<S.week){const s=S.staff[S.poach.role];if(s){mail(`${s.name} leaves for ${AG(S.poach.aid).name}`,`Your ${STAFF[S.poach.role][0]} accepted the rival offer.`);S.staff[S.poach.role]=null}S.poach=null}
  if(!S.poach&&Math.random()<0.012){const ks=Object.keys(S.staff).filter(k=>S.staff[k]&&S.staff[k].rating>=12);if(ks.length){const k=pick(ks),ag=pick(S.agencies.slice(1));S.poach={role:k,aid:ag.id,wage:Math.round(S.staff[k].wage*1.5),until:S.week+2};mail(`🕵 ${ag.name} target your ${STAFF[k][0]}`,`${esc(S.staff[k].name)} has an offer worth ${fmtM(S.poach.wage)}/week. Match it or let them go (see <b>Staff</b>).`,'offer','staff')}}
  S.cfOffers=S.cfOffers.filter(c=>c.expires>=S.week);
  mine().filter(p=>(p.status==='idol'||p.status==='actor')&&p.image>=55&&!S.cfs.some(c=>c.pid===p.id)&&!S.cfOffers.some(c=>c.pid===p.id)).forEach(p=>{if(Math.random()<0.012*Math.log10(fameOf(p)+10)*(hasTrait('Networker')?1.3:1)){S.cfOffers.push({id:nid(),pid:p.id,brand:pick(BRANDS),weekly:Math.round(4+fameOf(p)/25000),weeks:12,expires:S.week+3});mail(`📸 CF offer for ${p.given}`,`A brand wants ${esc(p.name)} as its face. See <b>Actors → Endorsements</b>.`,'offer','actors')}});
  S.ostOffers=S.ostOffers.filter(c=>c.expires>=S.week);
  const vocs=idols().filter(p=>p.groupId&&p.attrs.voc>=11&&avail(p));
  if(vocs.length&&Math.random()<0.04){const p=pick(vocs);S.ostOffers.push({id:nid(),pid:p.id,drama:dramaName(),fee:RI(30,80),expires:S.week+3});mail(`🎵 OST offer for ${p.given}`,`A drama wants ${esc(p.name)} to sing its OST. See <b>Studio</b>.`,'offer','studio')}
}
function newScandal(p){
  const[t,sev]=pick(SCANDALS),g=p.groupId?G(p.groupId):null;
  const x={id:nid(),pid:p.id,gid:p.groupId,type:t,sev,truth:Math.random()<0.4+p.pers.con/60,week:S.week,deadline:S.week+2,status:'open',resp:null};
  S.scandals.unshift(x);p.image=clamp(p.image-4*sev,0,100);if(g)g.mood-=3*sev;boardAdj('all',-sev);
  mail(`🚨 Scandal: ${p.given} — ${t}`,`Reports about ${esc(p.name)} are spreading fast (severity ${'●'.repeat(sev)}). Respond in <b>Scandals & PR</b> within 2 weeks or it will escalate.`,'scandal','scandals');
}
function resolveScandal(id,resp,auto){
  const x=S.scandals.find(s=>s.id===id);if(!x||x.status!=='open')return'';
  const p=P(x.pid),g=x.gid?G(x.gid):null,pr=sf('pr'),T=x.truth,sev=x.sev;
  let img=0,mood=0,repd=0,bd=0,msg='';
  if(resp==='deny'){if(T){img=-2;msg='The denial calmed things for now… but if evidence surfaces, it will be worse.';x.status='denied'}else{img=6;mood=3;msg='The denial held up. Fans rallied behind their idol.';x.status='resolved'}}
  else if(resp==='apologise'){img=T?-3*sev:-6;mood=T?-2:-4;repd=T?0.5:-1;msg=T?'The sincere apology was accepted by most fans.':'Apologising for something untrue frustrated fans.';x.status='resolved'}
  else if(resp==='hiatus'){if(p){p.hiatus={until:S.week+RI(6,12),reason:'scandal'};p.busy=null}img=4;mood=-5;msg='The idol steps back while things cool down.';x.status='resolved'}
  else if(resp==='legal'){S.money-=80;if(T){img=-8*sev;mood=-8;repd=-2;bd=-2;msg='Legal threats over a true story backfired badly.'}else{img=10;repd=1;msg='The agency won in court. Malicious posters apologised.'}x.status='resolved'}
  else{img=-6*sev;mood=-6*sev;repd=-sev;bd=-sev;msg='Silence let the story escalate.';x.status='resolved'}
  const soft=1-pr*0.4;if(img<0)img*=soft;if(mood<0)mood*=soft;
  if(p)p.image=clamp(p.image+img,0,100);if(g)g.mood=clamp(g.mood+mood,10,100);S.rep=clamp(S.rep+repd,0,100);if(bd)boardAdj('all',bd);
  x.resp=resp;x.outcome=msg;
  if(auto)mail(`Scandal escalated: ${p?p.given:''}`,`No response was given to the ${x.type.toLowerCase()}. ${msg}`,'scandal','scandals');
  return msg;
}
function randomEvent(){
  const r=Math.random(),gs=myGroups().filter(g=>g.songs.length&&!g.prep);
  if(r<0.05&&gs.length){const g=pick(gs),p=pick(members(g));if(!p)return;g.fans=g.fans*1.04+3000;p.image=clamp(p.image+3,0,100);mail(`📈 ${p.given}'s fancam goes viral`,`A fancam of ${esc(p.name)} (${g.name}) hit millions of views overnight.`,'news','p'+p.id)}
  else if(r<0.08&&trainees().length){const p=pick(trainees());p.morale=clamp(p.morale-18,0,100);mail(`${p.given} is struggling`,`${esc(p.name)} is homesick and doubting themselves. Morale has dropped.`,'news','p'+p.id)}
}
function computeNoms(c){
  const ys=yStart(S.week),out={};
  if(c.type==='music'){
    const act=S.groups.filter(g=>!g.disbanded&&g.songs.some(id=>SG(id).week>=ys));
    const gp=g=>sum(g.songs.map(SG).filter(s=>s.week>=ys).map(s=>s.pts))+(g.yWins||0)*15;
    const songs=S.songs.filter(s=>s.week>=ys&&s.type!=='JP');
    const G5=(arr,fn)=>arr.map(g=>({name:g.name,aid:g.agencyId,gid:g.id,detail:'',score:fn(g)})).sort((a,b)=>b.score-a.score).slice(0,5);
    c.cats.forEach(cat=>{let l=[];
      if(['Artist of the Year','Grand Prize'].includes(cat))l=G5(act,gp);
      else if(['Song of the Year','Record of the Year'].includes(cat))l=songs.sort((a,b)=>b.pts-a.pts).slice(0,5).map(s=>({name:G(s.groupId).name,detail:`"${s.title}"`,aid:G(s.groupId).agencyId,gid:s.groupId,score:s.pts}));
      else if(cat==='Album of the Year')l=songs.filter(s=>['Mini','Full','Repackage'].includes(s.type)).sort((a,b)=>b.total*(b.type==='Full'?1.3:1)-a.total*(a.type==='Full'?1.3:1)).slice(0,5).map(s=>({name:G(s.groupId).name,detail:`"${s.title}"`,aid:G(s.groupId).agencyId,gid:s.groupId,score:s.total/100}));
      else if(cat==='Best Female Group')l=G5(act.filter(g=>g.gender==='F'),gp);
      else if(cat==='Best Male Group')l=G5(act.filter(g=>g.gender==='M'),gp);
      else if(cat==='Best New Artist')l=G5(act.filter(g=>g.debutWeek>=ys),g=>g.fans/500+gp(g));
      else if(cat==='Best Dance Performance')l=G5(act,g=>gAttr(g,'dan')*Math.log10(gp(g)+10)*20);
      else if(cat==='Best Vocal Performance')l=G5(act,g=>gAttr(g,'voc')*Math.log10(gp(g)+10)*20);
      else if(cat==='Best Performance')l=G5(act,g=>gAttr(g,'stg')*Math.log10(gp(g)+10)*20);
      else if(cat==='Global Fan Choice')l=G5(act,g=>g.fans*(1-g.reg.kr)/1000);
      else if(cat==='Popularity Award')l=G5(act,g=>g.fans/1000);
      else if(cat==='Music Show King')l=G5(act,g=>(g.yWins||0)*10);
      out[cat]=l;
    });
  }else{
    const ent=S.dramas.filter(d=>d.aired&&d.aired>=ys).map(d=>{const p=P(d.pid);return{name:p?p.name:'(former artist)',g:p?p.g:'F',title:d.title,score:d.score*({Lead:1.1,Supporting:0.9,Cameo:0.5}[d.part])*(1+d.tier*0.08),newc:d.newc,idol:d.idol,aid:0,pid:d.pid,costar:d.costar,chem:d.chem}});
    for(let i=0;i<10;i++){const g=pick(['F','M']),[n]=genName(g,'KR',-1),ag=pick(S.agencies.slice(1));ent.push({name:n,g,title:dramaName(),score:R(30,85),newc:Math.random()<0.3,idol:Math.random()<0.25,aid:ag.id,costar:genName(g==='F'?'M':'F','KR',-1)[0],chem:RI(-5,15)})}
    const T5=f=>ent.filter(f).sort((a,b)=>b.score-a.score).slice(0,5);
    c.cats.forEach(cat=>{let l=[];
      if(cat==='Grand Prize')l=T5(()=>true).map(e=>({name:e.name,detail:`"${e.title}"`,aid:e.aid,pid:e.pid,score:e.score}));
      else if(cat==='Drama of the Year')l=T5(()=>true).map(e=>({name:`"${e.title}"`,detail:'',aid:e.aid,pid:e.pid,score:e.score}));
      else if(cat==='Best Couple')l=T5(e=>e.costar).map(e=>({name:`${e.name} & ${e.costar}`,detail:`"${e.title}"`,aid:e.aid,pid:e.pid,score:e.score*0.6+(e.chem||0)*2}));
      else{const f={'Best Actor':e=>e.g==='M','Best Actress':e=>e.g==='F','Best New Actor':e=>e.g==='M'&&e.newc,'Best New Actress':e=>e.g==='F'&&e.newc,'Best Idol Actor':e=>e.idol}[cat];l=T5(f).map(e=>({name:e.name,detail:`"${e.title}"`,aid:e.aid,pid:e.pid,score:e.score}))}
      out[cat]=l;});
  }
  S.noms[c.key]={y:yearOf(S.week),cats:out};
  const myN=Object.entries(out).filter(([k,l])=>l.some(e=>e.aid===0));
  mail(`📜 ${c.name} nominations`,myN.length?`Your agency is nominated in <b>${myN.length}</b> categories: ${myN.map(x=>x[0]).join(', ')}. Run fan vote campaigns in <b>Awards</b> before week ${c.week}.`:`Nominations are out. Your agency didn't make the shortlist this year.`,'win','awards');
}
function ceremony(c,rep){
  if(!S.noms[c.key]||S.noms[c.key].y!==yearOf(S.week))computeNoms(c);
  const y=yearOf(S.week),N=S.noms[c.key].cats,res=[];
  Object.entries(N).forEach(([cat,l])=>{if(!l.length)return;
    const w=l.map(e=>{const cp=e.aid===0?(S.camp[c.key+'|'+cat]||0):R(0,60);return{e,v:e.score*(1+Math.log10(1+cp/40)*0.25)*R(0.9,1.1)}}).sort((a,b)=>b.v-a.v)[0].e;
    res.push({cat,...w})});
  let txt='',mineN=0;
  res.forEach(r=>{S.awardHist.unshift({y,cer:c.key,cat:r.cat,name:r.name,detail:r.detail,aid:r.aid,gid:r.gid||null,pid:r.pid||null});
    txt+=`<b>${r.cat}:</b> ${esc(r.name)} ${esc(r.detail)} <span class="muted">(${esc(AG(r.aid).name)})</span><br>`;
    if(r.aid===0){mineN++;S.rep=clamp(S.rep+3,0,100);boardAdj('awards',4);boardAdj('all',0.5);if(r.gid&&G(r.gid))G(r.gid).fans*=1.04;if(r.pid&&P(r.pid)){const p=P(r.pid);if(p.status==='actor')p.fame*=1.1;p.image=clamp(p.image+5,0,100)}}});
  if(c.type==='music')myGroups().filter(g=>Object.values(N).some(l=>l.some(e=>e.gid===g.id))).forEach(g=>{g.fans*=1.02;members(g).forEach(p=>p.cond-=5)});
  if(c.key==='gsa'&&S.special){const a=G(S.special[0]),b=G(S.special[1]);[a,b].forEach(g=>{if(g)g.fans*=1.04});S.rep=clamp(S.rep+2,0,100);txt+=`<br>✨ Your special stage (${esc(a?.name)} × ${esc(b?.name)}) was the talk of the night.`;S.special=null}
  if(mineN)S.goals.award=true;
  Object.keys(S.camp).forEach(k=>{if(k.startsWith(c.key+'|'))delete S.camp[k]});
  rep.awards.push({cer:c.name,res});
  mail(`🎤 ${y} ${c.name}`,txt+(mineN?`<br>Your agency took home <b>${mineN}</b> award${mineN>1?'s':''}!`:''),'win','awards');
}
function boardReview(){
  const b=S.board,t=b.targets,pos=myPos(),w=yWins(),f=b.patience?0.5:1;
  let d=0,lines=[];
  if(pos<=t.pos){d+=12;lines.push(`✅ Agency table: #${pos} (target #${t.pos})`)}else{d-=10*f*Math.min(3,pos-t.pos);lines.push(`❌ Agency table: #${pos} (target #${t.pos})`)}
  if(w>=t.wins){d+=12;lines.push(`✅ Music show wins: ${w} (target ${t.wins})`)}else{d-=12*f;lines.push(`❌ Music show wins: ${w} (target ${t.wins})`)}
  if(S.money<0){d-=8;lines.push('❌ Finances in the red')}
  boardAdj('all',d);
  if(yearOf(S.week)>=b.vision.deadline&&!b.visionDone){boardAdj('all',-20);lines.push(`❌ 5-year vision missed: ${VISIONS[b.vision.key][0]}`);const nk=pick(Object.keys(VISIONS));b.vision={key:nk,deadline:yearOf(S.week)+5};b.visionDone=false;lines.push(`New vision: ${VISIONS[nk][0]} by ${b.vision.deadline}`)}
  else if(b.visionDone&&yearOf(S.week)>=b.vision.deadline){const nk=pick(Object.keys(VISIONS).filter(k=>k!==b.vision.key));b.vision={key:nk,deadline:yearOf(S.week)+5};b.visionDone=visionMet();lines.push(`New vision: ${VISIONS[nk][0]} by ${b.vision.deadline}`)}
  b.history.unshift(`<b>${yearOf(S.week)}</b>: ${lines.join(' · ')} → ${d>=0?'+':''}${Math.round(d)}`);
  mail(`📋 ${yearOf(S.week)} board review`,lines.join('<br>')+`<br><br>Board confidence ${d>=0?'rose':'fell'} by <b>${Math.abs(Math.round(d))}</b>.`,'board','board');
}
const GOALS=[['debut','Debut your first group',()=>myGroups().some(g=>g.songs.length)],['top10','Get a song into the Top 10',()=>S.songs.some(s=>G(s.groupId).agencyId===0&&s.peak<=10)],['win','Win a music show',()=>S.groups.some(g=>g.agencyId===0&&g.trophies>0)],['f100k','Reach 100K fans with a group',()=>myGroups().some(g=>g.fans>=1e5)],['no1','Hit #1 on the chart',()=>S.songs.some(s=>G(s.groupId).agencyId===0&&s.peak===1)],['drama','Land a drama or film role',()=>S.dramas.length>0],['award','Win an award',()=>!!S.goals.award],['two','Run two groups at once',()=>myGroups().filter(g=>!g.parent).length>=2],['tour','Complete a tour',()=>S.tours.some(t=>t.idx>=t.stops.length)],['market','Enter an overseas market',()=>Object.keys(S.markets).length>0],['ak','Score an all-kill',()=>S.rec.allkills.length>0],['f1m','Reach 1M fans with a group',()=>myGroups().some(g=>g.fans>=1e6)]];
function checkGoals(rep){GOALS.forEach(([k,l,fn])=>{if(!S.goals[k+'_done']&&fn()){S.goals[k+'_done']=true;S.rep=clamp(S.rep+4,0,100);S.money+=100;boardAdj('all',1);rep.goals.push(l);mail('✅ Milestone: '+l,'The board released a <b>₩100M</b> bonus.','board')}})}

function rigExposed(title,gid){
  const g=gid?G(gid):null;
  S.rep=clamp(S.rep-10,0,100);boardAdj('all',-12);S.money-=500;
  if(g&&!g.disbanded){g.mood=clamp(g.mood-30,10,100);g.fans*=0.75;members(g).forEach(p=>{p.morale=clamp(p.morale-20,0,100);p.image=clamp(p.image-15,0,100)})}
  if(S.survival&&S.survival.title===title){S.survival.exposed=true;S.survival.rating*=0.5;S.survival.rig={};S.survival.fixed=null}
  S.scandals.unshift({id:nid(),pid:null,gid:gid||null,type:`Vote-rigging on "${title}"`,sev:3,truth:true,week:S.week,deadline:S.week,status:'exposed',resp:'—',outcome:'Prosecutors confirmed vote manipulation. Fined ₩500M; reputation and board confidence collapsed.'});
  mail(`💣 Vote-rigging exposed: "${title}"`,`Leaked production data proves the agency manipulated the votes on <b>${esc(title)}</b>. Fined <b>₩500M</b>, reputation −10, the board is furious${g?`, and ${esc(g.name)}'s fans feel betrayed (fans −25%, mood −30)`:''}.`,'scandal','scandals');
}
