// ================= CONSTANTS =================
const KEY='kpopAgencySim_v3';
const ATTRS=[['voc','Vocals'],['dan','Dance'],['rap','Rap'],['vis','Visuals'],['stg','Stage Presence'],['var','Variety'],['act','Acting']];
const AK=ATTRS.map(a=>a[0]),IK=AK.slice(0,6),ALBL=Object.fromEntries(ATTRS);
const PERS=[['amb','Ambition'],['pro','Professionalism'],['loy','Loyalty'],['tem','Composure'],['con','Controversy']];
const ROLE={voc:'Vocalist',dan:'Dancer',rap:'Rapper',vis:'Visual',stg:'Performer',var:'Entertainer'};
const CONCEPTS={Cute:['vis','var'],Bold:['dan','rap','stg'],Elegant:['voc','vis'],Dark:['dan','stg'],Retro:['voc','stg'],Summer:['vis','dan'],'Hip-hop':['rap','dan']};
const CK=Object.keys(CONCEPTS);
const BUDGET={Low:{cost:100,bonus:0},Standard:{cost:300,bonus:7},Blockbuster:{cost:700,bonus:14}};
const ALBUM={Single:{n:'Digital Single',prep:2,cost:0.6,sales:0.3,q:-2},Mini:{n:'Mini Album',prep:3,cost:1,sales:1,q:0},Full:{n:'Full Album',prep:5,cost:1.6,sales:1.8,q:3},Repackage:{n:'Repackage',prep:2,cost:0.5,sales:0.7,q:0}};
const LINES={equal:['Equal','Everyone gets similar lines: morale up, slight quality cost'],skill:['Skill-based','Best singers & rappers carry the song: quality up, low-line members unhappy'],center:['Center-focused','The center gets the spotlight: hype up, others unhappy']};
const FAC={training:['Training Centre','Faster trainee & idol growth'],studio:['Recording Studio','Better demos and release quality'],pr:['PR Department','More hype and fan growth'],scout:['Scouting Network','Stronger, more accurately rated audition talent']};
const STAFF={voc:['Vocal Coach','+Vocals growth'],dan:['Dance Coach','+Dance growth'],rap:['Rap Coach','+Rap growth'],stg:['Performance Director','+Stage Presence growth, stronger music show stages'],vis:['Stylist','+Visuals growth, higher release quality'],act:['Acting Coach','+Acting growth, better casting odds'],var:['Media Trainer','+Variety growth, better TV pitch odds'],prod:['Head Producer','Boosts every in-house producer'],pr:['PR Manager','More hype & fan growth, better crisis outcomes'],scout:['Head Scout','Better, more accurate scouting; reveals personality'],mgr:['Road Manager','Condition recovery, morale, fewer injuries']};
const TRAITS={Workaholic:'Effect +15%, wage +20%',Mentor:'Assistant & interns grow faster','Tough Love':'Coaching +20%, trainee morale −',Calm:'Everyone\'s morale +',Innovator:'Release & demo quality +',Networker:'TV, casting & CF odds +'};
const SHOWS=['Music Pulse','Star Chart','The Stage','Music Express','Showtime Live','Popular Weekly'];
const DAYS=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const SCHED={rest:'Rest',practice:'Practice',variety:'Variety Appearances',fanmeet:'Fan Meeting',brand:'Brand Deal',concert:'Concert',festival:'Festival Gigs'};
const TRAIN={all:'Balanced',voc:'Vocal class',dan:'Dance class',rap:'Rap class',stg:'Performance class',vis:'Visual class',var:'Variety class',act:'Acting class'};
const INTENS={light:['Light',0.7],normal:['Normal',1],intense:['Intense',1.35]};
const STAGE={safe:['Safe','Low risk, low ceiling, less tiring'],standard:['Standard','Balanced'],ambitious:['Ambitious','Big moments or big mistakes; tiring; injury risk; rewards Stage Presence']};
const TVSHOWS=[{name:'Idol Arcade',min:5000,tier:1,fee:6},{name:'Kitchen Idol',min:20000,tier:1.5,fee:10},{name:'Brain Battle',min:60000,tier:2,fee:15},{name:'Weekend Getaway',min:150000,tier:3,fee:25},{name:'Talk Talk Night',min:400000,tier:4,fee:40}];
const CHANNEL={none:['None',0],vlog:['Vlog',1],bts:['Behind the Scenes',1.2],live:['Live Stream',1.4],practice:['Dance Practice',1.1]};
const CEREMONIES=[
 {key:'dwa',name:'Digital Wave Music Awards',week:47,type:'music',cats:['Artist of the Year','Song of the Year','Album of the Year','Best Female Group','Best Male Group','Best New Artist','Best Dance Performance','Best Vocal Performance','Global Fan Choice']},
 {key:'gsa',name:'Golden Stage Awards',week:50,type:'music',cats:['Grand Prize','Record of the Year','Popularity Award','Best New Artist','Best Performance','Music Show King']},
 {key:'sda',name:'Starlight Drama Awards',week:52,type:'drama',cats:['Grand Prize','Drama of the Year','Best Actor','Best Actress','Best New Actor','Best New Actress','Best Idol Actor','Best Couple']}];
const BIG=['Artist of the Year','Song of the Year','Album of the Year','Grand Prize','Record of the Year'];
const TIERS=['Web','Cable','Network','Film'];
const NETS=[['WebFlix Shorts','Kakao Drama Lab'],['HBN Cable','TVA'],['Channel K','SBC'],['Cinema Lumen','Lotte-Star Pictures']];
const DW1=['Midnight','Hidden','Spring','Royal','Second','Last','Silent','Blue','Crimson','Eternal','Little','Wild','Golden','Seoul','Rainy','Secret'];
const DW2=['Garden','Promise','Detective','Hospital','Diary','Kingdom','Chef','Lawyer','Summer','Letter','Hotel','Academy','Witness','Season','Office','Romance'];
const BRANDS=['Lumi Cosmetics','Velo Sportswear','Hana Bank','Pocari-ish Ion','Seoul Fried Chicken','K-Glow Skincare','Nova Phones','Urban Denim','Mintea','Starfield Coffee'];
const SURN=['Kim','Lee','Park','Choi','Jung','Kang','Cho','Yoon','Jang','Lim','Han','Oh','Seo','Shin','Kwon','Hwang','Ahn','Song','Yoo','Hong','Moon','Bae','Nam','Jeon'];
const F_GIV=['Min-ji','Ha-eun','Seo-yeon','Ji-woo','Yu-na','Chae-won','Da-hyun','Soo-ah','Ye-rin','Na-yeon','Hye-jin','Ga-eun','Ji-min','Si-eun','Yeon-woo','Bo-ra','Eun-bi','So-hee','Ha-rin','A-ri','Ye-ji','Ri-na','Su-min','Yu-ri','Seol-a','Da-in','Chae-rin','Ha-neul','Jin-ah','Min-seo','Ye-seo','Ji-yoo','Hae-won','Na-rae','Bo-mi','Eun-ji'];
const M_GIV=['Min-jun','Seo-jun','Ji-ho','Do-yun','Ha-jun','Eun-woo','Jae-hyun','Tae-min','Sung-ho','Woo-jin','Hyun-woo','Jun-seo','Yeon-jun','Dong-hyun','Sang-woo','Ji-hoon','Kyung-soo','Tae-yang','Min-ho','Jin-young','Si-woo','Gun-woo','Ha-ram','Joon-ki','Yu-chan','Seung-min','Dae-hyun','In-seong','Jae-won','Hyun-jin'];
const FOREIGN={JP:{F:['Hina','Yuki','Mio','Rin','Sakura','Aoi','Mei','Nana'],M:['Haruto','Ren','Sota','Riku','Yuto','Kaito','Sora'],S:['Sato','Tanaka','Ito','Mori','Kato','Suzuki']},TH:{F:['Ploy','Mint','Fah','Praew','Namtan'],M:['Bright','Tay','Nat','Win','Ohm'],S:['Srisuk','Chaiyo','Wongsa','Boonmee']},CN:{F:['Yi','Xin','Mei','Ling','Yuqi'],M:['Hao','Jun','Kai','Yang','Zihan'],S:['Wang','Zhang','Liu','Chen']},US:{F:['Sophie','Chloe','Emily','Grace','Elena'],M:['Ethan','Jason','Kevin','Ryan','Brian'],S:['Park','Kim','Lee','Choi','Jung']}};
const FLAG={KR:'🇰🇷',JP:'🇯🇵',TH:'🇹🇭',CN:'🇨🇳',US:'🇺🇸'};
const AUDITION={KR:{n:'Seoul auditions',cost:40,bias:{}},JP:{n:'Tokyo auditions',cost:80,bias:{dan:1.5,vis:1}},TH:{n:'Bangkok auditions',cost:80,bias:{vis:2,var:1}},US:{n:'Los Angeles auditions',cost:120,bias:{rap:2,voc:1}}};
const REGIONS={kr:'Korea',jp:'Japan',cn:'China',sea:'SE Asia',us:'Americas',eu:'Europe'};
const MARKETS={jp:{cost:600,promo:'Japanese debut single',pc:200},cn:{cost:800,promo:'Weibo & variety push',pc:220},sea:{cost:400,promo:'Fan-meeting tour',pc:150},us:{cost:1200,promo:'Radio & late-night tour',pc:350},eu:{cost:900,promo:'Festival & TV circuit',pc:300}};
const CITIES=[['Seoul','kr'],['Busan','kr'],['Tokyo','jp'],['Osaka','jp'],['Shanghai','cn'],['Bangkok','sea'],['Jakarta','sea'],['Manila','sea'],['Singapore','sea'],['Los Angeles','us'],['New York','us'],['London','eu'],['Paris','eu']];
const VENUES={Hall:{cap:3000,cost:25},Arena:{cap:12000,cost:60},Stadium:{cap:40000,cost:150},Dome:{cap:55000,cost:250}};
const SCANDALS=[['Dating rumour',1],['Attitude controversy',2],['Lip-sync accusation',1],['Plagiarism claim',2],['Past behaviour allegations',3],['Drunk livestream',2],['Rude to staff video',2]];
const AGENDAS={profit:['💰','Profit','Cares about finances and share price'],fame:['⭐','Fame','Cares about chart hits and fans'],awards:['🏆','Prestige','Cares about wins and awards'],global:['🌏','Global','Cares about overseas expansion']};
const VISIONS={top3:['Top 3 agency','Finish in the top 3 of the agency table'],global:['Global agency','Enter at least 3 overseas markets'],daesang:['Daesang winner','Win a grand prize (Artist/Song/Album of the Year or Grand Prize)'],ipo:['Public company','List the agency on the stock market (IPO)']};
const RIVALS=[['Starfield Entertainment',['LUMINA','VERTEX','GLASSHEART','TEMPO']],['Bluewave Music',['AURORA9','ZEPHYR','MERIDIAN']],['Mirae Label',['NEON ROSE','ORBIT','QUASAR','WILDFLOWER']],['Prism Creative',['HEXA','KALEIDO','NORTHSTAR']],['Nova Studio',['SOLARA','PULSE8','IRIS LANE']],['Halo Ent.',['VELVET HOUR','ARCADIA','CRESCENT','NEBULA']]];
const GROUPNAMES=['STARLIT','MOONWAVE','RE:VERIE','NOCTURNE','BLOSSOM','CHROMA','LYRA','ECHO//','VIVID','DAYBREAK','ASTRA','SPARKLE','MONOLITH','HALCYON','FLARE','SEOULMATE','OPALINE','RADIANT','PRISMA','AETHER'];
const FANDOMS=['Stellas','Moonies','Petals','Echoes','Orbits','Lumens','Dreamers','Sparks','Haloes','Comets'];
const LORE=['The Dreamscape','Neon City','The Garden of Seasons','Starship Odyssey','The Mirror World','Midnight Academy'];
const W1=['Midnight','Sugar','Neon','Crush','Firework','Paradise','Rush','Velvet','Echo','Dream','Siren','Fever','Gravity','Mirage','Wild','Butterfly','Lemonade','Heartbeat','Comet','Hologram','Candy','Thunder','Bloom','Gold','Starlight','Cherry','Ribbon','Voltage'];
const W2=['Love','Road','Dive','Game','Party','Drive','Signal','Bomb','Rain','City','Garden','Wave','Kiss','Runway','Rocket','','','',''];
const SKIN=['#f6dcc6','#f1d0b5','#efcfae','#e9c6a4','#f3d6bf'];
const HAIR_N=['#1b1514','#241a16','#2e211b','#3b2a20','#15100f'];
const HAIR_D=['#e8cf8f','#f29ac0','#c9ccd6','#b8323f','#5b7be0','#8a5bd6','#d9894a'];

// ================= UTILS =================
const R=(a,b)=>a+Math.random()*(b-a);
const RI=(a,b)=>Math.floor(R(a,b+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const avg=a=>a.reduce((s,x)=>s+x,0)/(a.length||1);
const sum=a=>a.reduce((s,x)=>s+x,0);
let S=null;
const nid=()=>S.uid++;
const P=id=>S.people.find(p=>p.id===id);
const G=id=>S.groups.find(g=>g.id===id);
const SG=id=>S.songs.find(s=>s.id===id);
const AG=id=>S.agencies.find(a=>a.id===id)||{name:'Independent',rep:30};
const D=id=>S.dorms.find(d=>d.id===id);
const fmtM=m=>{const s=m<0?'-':'';m=Math.abs(m);return s+(m>=1000?'₩'+(m/1000).toFixed(2)+'B':'₩'+Math.round(m)+'M')};
const fmtN=n=>n>=1e6?(n/1e6).toFixed(2)+'M':n>=1e3?(n/1e3).toFixed(1)+'K':Math.round(n)+'';
const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const yearOf=w=>2027+Math.floor((w-1)/52);
const wkOf=w=>((w-1)%52+52)%52+1;
const yStart=w=>(yearOf(w)-2027)*52+1;
const DAYFULL=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const MONFULL=['January','February','March','April','May','June','July','August','September','October','November','December'];
const dateOf=(w,d=0)=>new Date(Date.UTC(2027,0,4)+((w-1)*7+d)*864e5);
const ord=n=>n+(n%10===1&&n!==11?'st':n%10===2&&n!==12?'nd':n%10===3&&n!==13?'rd':'th');
const dayStr=(w,d=0,long)=>{const t=dateOf(w,d);return long?`${DAYFULL[d]} ${ord(t.getUTCDate())} ${MONFULL[t.getUTCMonth()]} ${t.getUTCFullYear()}`:`${DAYS[d]} ${t.getUTCDate()} ${MON[t.getUTCMonth()]} ${t.getUTCFullYear()}`};
const dateStr=w=>`Wk ${wkOf(w)} · ${MON[Math.min(11,Math.floor((wkOf(w)-1)/4.34))]} ${yearOf(w)}`;
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ovr=p=>avg(IK.map(k=>p.attrs[k]));
const aov=p=>p.attrs.act*0.55+p.attrs.vis*0.25+p.attrs.var*0.2;
const cur=p=>p.status==='actor'?aov(p):ovr(p);
const role=p=>{if(p.status==='actor')return 'Actor';let b='voc';IK.forEach(k=>{if(p.attrs[k]>p.attrs[b])b=k});return ROLE[b]};
const aCls=v=>v<6?'a1':v<11?'a2':v<16?'a3':'a4';
const aNum=v=>`<span class="a ${aCls(v)}">${Math.floor(v)}</span>`;
const stars=v=>`<span class="stars">★★★★★<span style="width:${clamp(v/20*100,0,100)}%">★★★★★</span></span>`;
const grade=q=>q>=85?'S':q>=72?'A':q>=60?'B':q>=48?'C':'D';
const songName=()=>{const a=pick(W1),b=pick(W2);return b?a+' '+b:a};
const dramaName=()=>`${pick(DW1)} ${pick(DW2)}`;
const bar=(v,c,w=110)=>`<span class="bar" style="width:${typeof w==='number'?w+'px':w}"><i style="width:${clamp(v,0,100)}%;background:${c}"></i></span>`;
const season=w=>{const k=wkOf(w);return k>=22&&k<=35?'summer':k>=44?'yearend':(k>=18&&k<=22)||(k>=37&&k<=42)?'festival':''};
const SEASONL={summer:'☀️ Summer season',yearend:'❄️ Year-end season',festival:'🎪 Festival season','':''};
function persLabel(p){const x=p.pers;if(!x)return 'Unknown';if(x.con>=15)return 'Controversial';if(x.tem<=5)return 'Temperamental';if(x.pro>=16&&x.amb>=14)return 'Driven Perfectionist';if(x.pro>=16)return 'Model Professional';if(x.loy>=16)return 'Loyal';if(x.amb>=15&&x.loy<=8)return 'Ambitious Mercenary';if(x.amb>=15)return 'Ambitious';if(x.pro<=5)return 'Unprofessional';return 'Balanced'}
function sf(r){const s=S.staff[r];if(!s)return 0;let v=s.rating+(s.asst?s.asst.rating*0.35:0);if(s.trait==='Workaholic')v*=1.15;if(s.trait==='Tough Love'&&['voc','dan','rap','stg','vis','act','var'].includes(r))v*=1.2;return Math.min(1.4,v/20)}
const hasTrait=t=>Object.values(S.staff).some(s=>s&&s.trait===t);

function avatar(p,size=40){
  const skin=SKIN[p.skin],long=p.g==='F';
  const back=long?`<path d="M8.5 22 Q8 6.5 20 6.5 Q32 6.5 31.5 22 L32.5 37 L7.5 37Z" fill="${p.hair}"/>`:'';
  const bangs=long?`<path d="M11.3 19 Q11.5 8.3 20 8.3 Q28.5 8.3 28.7 19 Q25 12.5 20 13 Q14.5 12.5 11.3 19Z" fill="${p.hair}"/>`:`<path d="M11.4 18.5 Q10.5 7.5 20 7.5 Q29.5 7.5 28.6 18.5 Q27.5 12.8 22 12.4 Q16 12.6 11.4 18.5Z" fill="${p.hair}"/>`;
  return `<svg class="av" width="${size}" height="${size}" viewBox="0 0 40 40"><rect width="40" height="40" rx="6" fill="hsl(${p.bg},40%,26%)"/>${back}<path d="M5 41 Q7 31 20 31 Q33 31 35 41Z" fill="hsl(${p.bg},55%,60%)"/><rect x="17" y="25" width="6" height="7" fill="${skin}"/><ellipse cx="20" cy="19" rx="8.3" ry="9.6" fill="${skin}"/>${bangs}<ellipse cx="16.8" cy="20.3" rx="1.1" ry="1.3" fill="#2a1d1a"/><ellipse cx="23.2" cy="20.3" rx="1.1" ry="1.3" fill="#2a1d1a"/><path d="M18 24.6 Q20 26 22 24.6" stroke="#c46a6a" stroke-width="1" fill="none" stroke-linecap="round"/></svg>`;
}

// ================= GENERATION =================
function genName(g,nat,agencyId){
  const used=new Set(agencyId===0?[...S.people.filter(p=>p.agencyId===0),...(S.scout||[]),...(S.actorPool||[])].map(p=>p.given):[]);
  let name,given,t=0;
  do{if(nat==='KR'){given=pick(g==='F'?F_GIV:M_GIV);name=pick(SURN)+' '+given}else{const f=FOREIGN[nat];given=pick(f[g]);name=given+' '+pick(f.S)}}while(used.has(given)&&++t<15);
  return[name,given];
}
function genPers(){return{amb:RI(3,19),pro:RI(3,19),loy:RI(3,19),tem:RI(3,19),con:Math.random()<0.15?RI(13,19):RI(2,11)}}
function genPerson(g,q,o={}){
  const agencyId=o.agencyId==null?0:o.agencyId;
  const nat=o.nat||(o.actor?(Math.random()<0.93?'KR':'US'):(Math.random()<0.8?'KR':pick(['JP','TH','CN','US'])));
  const[name,given]=genName(g,nat,agencyId);
  const base=3+q*9,a={};
  IK.forEach(k=>a[k]=clamp(base+R(-3.5,3.5),1,20));
  a.act=clamp(base-2+R(-3,3),1,20);
  if(o.actor){a.act=clamp(base+3+R(0,4),1,20);a.vis=clamp(a.vis+2,1,20);a.rap=clamp(a.rap-4,1,20);a.dan=clamp(a.dan-3,1,20)}
  else{const sp=pick(IK);a[sp]=clamp(a[sp]+R(2,5),1,20);if(Math.random()<0.4){const s2=pick(IK);a[s2]=clamp(a[s2]+R(1,3),1,20)}}
  if(o.bias)Object.entries(o.bias).forEach(([k,v])=>a[k]=clamp(a[k]+v,1,20));
  const age=RI(o.ageMin||14,o.ageMax||22);
  const c=o.actor?a.act*0.55+a.vis*0.25+a.var*0.2:avg(IK.map(k=>a[k]));
  const young=clamp((24-age)/10,0,1);
  const pot=clamp(c+R(1,5)+young*R(1,6)+q*3,c+0.5,20);
  return{id:nid(),g,name,given,nat,age,attrs:a,pot,focus:'all',morale:RI(60,80),cond:100,skin:RI(0,4),
    hair:Math.random()<0.25&&!o.actor?pick(HAIR_D):pick(HAIR_N),bg:RI(0,360),joined:S.week,status:o.status||'trainee',
    agencyId,groupId:null,dormId:null,room:0,busy:null,fame:o.actor?Math.round(Math.pow(10,R(3,5.3))):0,rank:null,lastRank:null,dramas:0,
    pers:genPers(),rel:{},contract:null,injury:null,hiatus:null,image:RI(50,75),prefans:0,credits:0,tier:o.actor?RI(0,1):0,ownHome:false,wantsHome:false,lowWeeks:0,history:[]};
}
const rosterG=()=>S.roster==='X'?pick(['F','M']):S.roster;
function genScout(region='KR'){
  const A=AUDITION[region],lvl=S.fac.scout,err=Math.max(0.4,3.4-lvl*0.45-sf('scout')*1.6);
  S.scout=[];S.scoutRegion=region;
  for(let i=0;i<5;i++){
    const q=clamp(0.1+S.rep/100*0.4+lvl*0.04+sf('scout')*0.15+R(0,0.3)+(region!=='KR'?0.05:0),0,1);
    const p=genPerson(rosterG(),q,{nat:region==='KR'?(Math.random()<0.9?'KR':pick(['JP','CN'])):region,bias:A.bias});
    p.shown={};AK.forEach(k=>{const c=p.attrs[k]+R(-err,err);p.shown[k]=[Math.round(clamp(c-err,1,20)),Math.round(clamp(c+err,1,20))]});
    p.potShown=[clamp(p.pot-err*1.2+R(-1,1),1,20),clamp(p.pot+err*1.2+R(-1,1),1,20)];
    p.cost=Math.round(15+p.pot*4+ovr(p)*2);
    S.scout.push(p);
  }
}
function genActorPool(){S.actorPool=[];for(let i=0;i<5;i++){const p=genPerson(pick(['F','M']),R(0.25,0.8),{actor:true,status:'actor',ageMin:19,ageMax:34});p.cost=Math.round(30+aov(p)*aov(p)*0.9+p.fame/2500);S.actorPool.push(p)}}
function genStaff(){const r=Math.round(clamp(R(5,13)+S.rep/12+R(0,4),3,20)),tr=pick(Object.keys(TRAITS));const[n]=genName(pick(['F','M']),'KR',-1);return{name:n,rating:r,wage:Math.round((2+r*r*0.05)*(tr==='Workaholic'?1.2:1)),trait:tr,end:S.week+RI(78,156),asst:null}}
function genStaffPool(){S.staffPool={};Object.keys(STAFF).forEach(k=>S.staffPool[k]=[genStaff(),genStaff(),genStaff()])}
function genProducer(){const[n]=genName(pick(['F','M']),'KR',-1);const sk=Math.round(clamp(R(6,15)+S.rep/15,3,20));return{id:nid(),name:n,styles:[pick(CK),pick(CK)],skill:sk,hit:RI(3,18),wage:Math.round(2+sk*sk*0.04),chem:{},prog:R(0,4)}}
function genRoles(){
  while(S.roles.length<7){
    const tier=clamp(Math.floor(Math.pow(Math.random(),1.3)*4),0,3),part=pick(['Lead','Lead','Supporting','Supporting','Supporting','Cameo']),type=tier===3?'Film':'Drama',prest=tier+1;
    const req=clamp(Math.round(R(4,9)+tier*2+(part==='Lead'?2:part==='Cameo'?-3:0)),2,18);
    const[co]=genName(pick(['F','M']),'KR',-1);
    S.roles.push({id:nid(),title:dramaName(),type,tier,net:pick(NETS[tier]),part,req,prest,g:pick(['F','M']),costar:part==='Lead'?co:null,weeks:part==='Lead'?(type==='Film'?6:10):part==='Supporting'?6:2,
      fee:Math.round((part==='Lead'?110:part==='Supporting'?45:15)*(1+tier*0.6)),expires:S.week+RI(4,8),tried:[]});
  }
}
function newContract(p,years=7,split=10){p.contract={end:S.week+years*52,split,salary:p.status==='actor'?3:4,signed:S.week}}

function newGame(o){
  S={v:3,uid:1,week:1,agency:o.name,roster:o.roster,color:o.color,money:o.mode==='est'?2400:2800,rep:o.mode==='est'?25:10,
    fac:{training:1,studio:1,pr:0,scout:1},people:[],groups:[],songs:[],agencies:[],inbox:[],scout:[],chart:[],
    view:'home',param:null,hist:[],fwd:[],trend:pick(CK),fin:{inc:{},exp:{}},yfin:{inc:{},exp:{}},bal:[],goals:{},over:false,
    board:{members:[],targets:null,vision:{key:o.vision,deadline:2031},lastInvest:-99,lastPatience:-99,patience:false,history:[],ipo:false,hq:false,label:false},
    dorms:[],rules:{curfew:false,phone:'limited',dating:false},staff:{},staffPool:{},interns:[],producers:[],prodPool:[],actorPool:[],roles:[],dramas:[],demos:[],offers:[],free:[],
    tv:[],tvCool:{},reality:null,survival:null,channel:{subs:1000,plan:{}},awardHist:[],noms:{},camp:{},special:null,academy:'normal',evals:[],
    cfs:[],cfOffers:[],ostOffers:[],scandals:[],fanwars:[],markets:{},tours:[],loans:[],merch:{},fanclub:{},share:null,poach:null,collabs:[],
    delegate:{classes:false,schedules:false,renewals:false,offers:false},rec:{allkills:[],firstWin:null,bestSales:null},sub:{}};
  Object.keys(STAFF).forEach(k=>S.staff[k]=null);
  const bn=()=>genName(pick(['F','M']),'KR',-1)[0];
  S.board.members=Object.keys(AGENDAS).map(k=>({name:bn(),agenda:k,sat:60}));
  S.agencies.push({id:0,name:o.name,player:true,rep:S.rep});
  RIVALS.forEach(([an,gs],i)=>{
    const ag={id:i+1,name:an,rep:RI(40,85)};S.agencies.push(ag);
    gs.forEach(gn=>{
      const fans=Math.round(Math.pow(10,R(4.3,6.9))),gender=pick(['F','M']),q=R(0.45,0.9);
      const g=mkGroup(gn,ag.id,fans,gender);g.debutWeek=-RI(20,300);g.trophies=RI(0,40);g.next=RI(1,10);
      g.reg=normReg({kr:R(0.4,0.7),jp:R(0.05,0.2),cn:R(0,0.1),sea:R(0.05,0.2),us:R(0.02,0.15),eu:R(0.01,0.08)});
      for(let k=0,n=RI(4,7);k<n;k++){const p=genPerson(gender,q,{agencyId:ag.id,status:'rival',ageMin:18,ageMax:27});p.groupId=g.id;p.contract={end:S.week+RI(10,300),split:30,salary:5};S.people.push(p);g.members.push(p.id)}
      S.groups.push(g);
      if(Math.random()<0.75)releaseSong(g,songName(),rivalQuality(g),0,-RI(0,10),{type:pick(['Single','Mini','Mini','Full'])});
    });
  });
  S.dorms.push({id:nid(),name:'Main Dorm',q:2,beds:10});
  const nT=o.mode==='est'?4:8;
  for(let i=0;i<nT;i++)joinAgency(genPerson(rosterG(),R(0.1,0.45)));
  ['voc','dan'].forEach(k=>{const st=genStaff();st.rating=RI(7,10);st.wage=Math.round(2+st.rating*st.rating*0.05);S.staff[k]=st});
  S.producers.push(genProducer());
  if(o.mode==='est'){
    ['mgr'].forEach(k=>{S.staff[k]=genStaff()});S.producers.push(genProducer());
    const gg=S.roster==='X'?pick(['F','M']):S.roster,ids=[];
    for(let i=0;i<5;i++){const p=genPerson(gg,R(0.5,0.72),{ageMin:18,ageMax:23});p.status='idol';joinAgency(p);ids.push(p.id)}
    const g=newGroupObj(freeName(),ids,60000);g.debutWeek=-40;g.schedule='brand';S.groups.push(g);
    ids.forEach(i=>{P(i).contract.end=S.week+52*6+12});
    releaseSong(g,songName(),48,0,-12,{type:'Mini'});S.goals.debut_done=true;
  }
  genScout();genActorPool();genStaffPool();genRoles();S.prodPool=[genProducer(),genProducer(),genProducer()];
  S.demos.push(newDemo(S.producers[0]));
  computeChart(true);setTargets();
  mail('Welcome to '+o.name,`The board has handed you the keys. Your 5-year vision: <b>${VISIONS[o.vision][0]}</b> by ${S.board.vision.deadline}. Targets for ${yearOf(1)}: finish <b>#${S.board.targets.pos}</b> or better in the agency table and win <b>${S.board.targets.wins}</b> music shows. Press <b>Continue</b> to advance one week.`,'board');
  save();render();
}
function normReg(r){const t=sum(Object.values(r));Object.keys(r).forEach(k=>r[k]/=t);return r}
function mkGroup(name,agencyId,fans,gender){return{id:nid(),name,agencyId,fans,gender,members:[],debutWeek:S.week,trophies:0,yWins:0,songs:[],reg:{kr:0.85,jp:0.05,cn:0.02,sea:0.05,us:0.02,eu:0.01},mood:70,schedule:'rest',prep:null,train:'all',intensity:'normal',stage:'standard',leader:null,center:null,fandom:pick(FANDOMS),color:'#'+Math.floor(R(0x333333,0xffffff)).toString(16).padStart(6,'0'),lore:pick(LORE),streak:{c:null,n:0},parent:null,lineMode:'equal',disbanded:false,lastRel:-99}}
function newGroupObj(name,ids,fans){
  const gs=ids.map(i=>P(i).g);
  const g=mkGroup(name,0,fans,gs.filter(x=>x==='F').length>=gs.length/2?'F':'M');
  g.members=[...ids];
  ids.forEach(i=>{const p=P(i);p.status='idol';p.groupId=g.id;p.focus='all';if(!p.contract||!p.contract.end)newContract(p);g.fans+=p.prefans||0;p.prefans=0});
  g.leader=[...ids].sort((a,b)=>(P(b).attrs.var+P(b).attrs.stg+P(b).age+P(b).pers.pro/2)-(P(a).attrs.var+P(a).attrs.stg+P(a).age+P(a).pers.pro/2))[0];
  g.center=[...ids].sort((a,b)=>(P(b).attrs.vis+P(b).attrs.stg)-(P(a).attrs.vis+P(a).attrs.stg))[0];
  return g;
}
function joinAgency(p){p.agencyId=0;p.joined=S.week;S.people.push(p);if(p.status==='actor'&&!p.contract)newContract(p,RI(2,4),20);if(p.status!=='actor')assignDorm(p);}
function assignDorm(p){const d=S.dorms.find(d=>dormOcc(d)<d.beds)||S.dorms[0];p.dormId=d?d.id:null;if(d){const rooms=Math.ceil(d.beds/2);for(let r=0;r<rooms;r++){if(S.people.filter(x=>x.agencyId===0&&x.dormId===d.id&&x.room===r&&x!==p).length<2){p.room=r;return}}p.room=0}}
const dormOcc=d=>S.people.filter(p=>p.agencyId===0&&p.dormId===d.id).length;
function freeName(){const used=S.groups.map(g=>g.name);const f=GROUPNAMES.filter(n=>!used.includes(n));return f.length?pick(f):pick(GROUPNAMES)+' '+RI(2,9)}
function newDemo(pr,bonus=0,o={}){
  const sk=pr?pr.skill:10,hit=pr&&Math.random()<pr.hit/100;
  const q=Math.round(clamp(25+sk*2.3+S.fac.studio*4+sf('prod')*10+(hasTrait('Innovator')?3:0)+R(-12,12)+(hit?12:0)+bonus,10,98));
  return{id:nid(),title:songName(),concept:o.concept||(pr?pick(pr.styles):pick(CK)),quality:q,week:S.week,prod:pr?pr.id:null,credits:[pr?pr.name:(o.credit||'Outside writers')],idol:o.idol||null,hit,foreign:!!o.foreign};
}

// ================= HELPERS =================
function mail(title,body,type='news',link){S.inbox.unshift({id:nid(),w:S.week,d:S.day||0,title,body,type,read:false,link});S.inbox=S.inbox.slice(0,250)}
const myGroups=()=>S.groups.filter(g=>g.agencyId===0&&!g.disbanded);
const rivalGroups=()=>S.groups.filter(g=>g.agencyId!==0&&!g.disbanded);
const mine=()=>S.people.filter(p=>p.agencyId===0);
const trainees=()=>S.people.filter(p=>p.agencyId===0&&p.status==='trainee');
const actors=()=>S.people.filter(p=>p.agencyId===0&&p.status==='actor');
const idols=()=>S.people.filter(p=>p.agencyId===0&&p.status==='idol');
const freeIdols=()=>idols().filter(p=>!p.groupId);
const members=g=>(g.members||[]).map(P).filter(Boolean);
const lastSong=g=>g.songs&&g.songs.length?SG(g.songs[g.songs.length-1]):null;
const promoting=g=>{const s=lastSong(g);return s&&S.week-s.week<=3&&S.week-s.week>=0};
const touring=g=>S.tours.some(t=>t.gid===g.id&&t.idx<t.stops.length);
const avail=p=>!p.busy&&!p.injury&&!p.hiatus;
const fanPow=f=>Math.log10(f+100)*18;
const regFans=(g,r)=>g.fans*(g.reg[r]||0);
function addReg(g,r,x){const abs={};Object.keys(REGIONS).forEach(k=>abs[k]=g.fans*(g.reg[k]||0));abs[r]+=x;g.fans=sum(Object.values(abs));Object.keys(abs).forEach(k=>g.reg[k]=abs[k]/g.fans)}
function groupSkill(g,concept){
  const ms=members(g);if(!ms.length)return 1;
  const keys=CONCEPTS[concept]||IK;
  return avg(ms.map(p=>avg(keys.map(k=>p.attrs[k]))*0.6+ovr(p)*0.4));
}
const gAttr=(g,k)=>avg(members(g).map(p=>p.attrs[k]));
const gCond=g=>avg(members(g).map(p=>p.cond));
const gSplit=g=>g.agencyId===0?avg(members(g).map(p=>p.contract?p.contract.split:10)):30;
const share=g=>1-gSplit(g)/100;
function rel(a,b){if(a===b)return 0;const A=P(a),B=P(b);if(!A||!B)return 0;if(A.rel[b]==null){const v=Math.round(6-Math.abs(A.pers.tem-B.pers.tem)/2+R(-10,10));A.rel[b]=v;B.rel[a]=v}return A.rel[b]}
function addRel(a,b,d){const v=clamp(rel(a,b)+d,-50,50);P(a).rel[b]=v;P(b).rel[a]=v}
function chem(ids){const pr=[];for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++)pr.push(rel(ids[i],ids[j]));return pr.length?avg(pr):0}
const chemPct=c=>Math.round(clamp(50+c,0,100));
const rivalQuality=g=>clamp(groupSkill(g,pick(CK))*3.5+R(5,24),10,99);
function releaseSong(g,title,quality,hype,week=S.week,o={}){
  const s={id:nid(),title,groupId:g.id,week,quality:Math.round(quality),hype,cur:0,pts:0,peak:999,rank:null,lastRank:null,wins:0,weeks:0,type:o.type||'Single',concept:o.concept||null,sales:0,wsales:0,total:0,credits:o.credits||[],collab:o.collab||null,daily:[],no1:0,allKill:false,remix:0,jp:false,lines:o.lines||null,wweek:0};
  S.songs.push(s);g.songs.push(s.id);g.lastRel=week;return s;
}
function songScore(s){
  const g=G(s.groupId),age=S.week-s.week;
  if(!g||age<0||age>14)return 0;
  let f=g.fans;if(s.collab&&G(s.collab))f+=G(s.collab).fans*0.6;
  return(s.quality*0.9+fanPow(f)+s.hype*(age<3?1:0.3)+(s.remix>0?15:0))*Math.pow(0.83,age)*R(0.92,1.08);
}
function computeChart(init){
  const active=S.songs.filter(s=>S.week-s.week<=14&&S.week-s.week>=0&&s.type!=='JP');
  S.songs.forEach(s=>{if(!active.includes(s))s.rank=null});
  active.forEach(s=>{s.lastRank=s.rank;s.cur=songScore(s);if(s.remix>0)s.remix--;if(!init){s.pts+=s.cur;s.weeks++}});
  active.sort((a,b)=>b.cur-a.cur);
  active.forEach((s,i)=>{s.rank=i+1;s.peak=Math.min(s.peak,i+1);if(s.rank===1&&!init)s.no1++;
    s.daily=DAYS.map(()=>clamp(Math.round(s.rank+R(-2.5,2.5)*(s.rank>3?1:0.5)),1,99))});
  S.chart=active.map(s=>s.id);
}
function train(p,mult,focus){
  if(p.injury||p.hiatus)return;
  focus=focus||p.focus||'all';
  const room=p.pot-cur(p);
  const ageF=p.age<=17?1.2:p.age<=21?1:p.age<=26?0.75:0.5;
  const roomF=room>0?clamp(room/3,0.08,1.3):0.03;
  const proF=p.pers?0.75+p.pers.pro/40:1;
  const base=0.12*ageF*(1+(p.agencyId===0?S.fac.training*0.12:0.3))*roomF*(0.6+p.morale/170)*mult*proF;
  AK.forEach(k=>{
    let r=base*(1+(p.agencyId===0?sf(k)*0.8:0.4));
    if(focus!=='all')r*=(k===focus?2.6:0.45);
    if(k==='vis')r*=0.5;
    if(k==='act'&&p.status!=='actor'&&focus!=='act')r*=0.5;
    if(p.status==='actor'&&!['act','vis','var'].includes(k)&&focus!==k)r*=0.3;
    p.attrs[k]=Math.min(20,p.attrs[k]+r*R(0.5,1.5));
  });
}
function agencyFans(id){return sum(S.groups.filter(g=>g.agencyId===id&&!g.disbanded&&!g.parent).map(g=>g.fans))+(id===0?sum(actors().map(a=>a.fame))*0.3:0)}
function agencyTable(){return S.agencies.map(a=>({a,f:agencyFans(a.id)})).sort((x,y)=>y.f-x.f)}
const myPos=()=>agencyTable().findIndex(x=>x.a.id===0)+1;
const conf=()=>avg(S.board.members.map(m=>m.sat));
function boardAdj(agenda,d){S.board.members.forEach(m=>{if(agenda==='all'||m.agenda===agenda)m.sat=clamp(m.sat+d,0,100)})}
function setTargets(){
  const pos=myPos();
  const wins=myGroups().length?Math.max(3,Math.round(myGroups().filter(g=>!g.parent).length*6+S.rep/8)):2;
  S.board.targets={pos:Math.max(1,pos-1),wins,year:yearOf(S.week)};S.board.patience=false;
}
function value(p){const g=p.groupId?G(p.groupId):null,o=ovr(p);return Math.round(o*o*1.3+(g?Math.log10(g.fans+10)*35:0)+(p.age<24?40:0))}
function demand(p){const g=p.groupId?G(p.groupId):null;const fame=p.status==='actor'?p.fame:g?g.fans:0;return Math.round(clamp(12+Math.log10(fame+10)*4+p.pers.amb*0.9-(p.pers.loy-10)*0.6,10,60))}
const stageOf=g=>{if(g.debutWeek>S.week)return 'Pre-debut';const y=(S.week-g.debutWeek)/52;return y<1?'Rookie':y<3?'Rising':y<5?'Peak':y<7?'Veteran':'Renewal era'};
const yWins=()=>sum(myGroups().map(g=>g.yWins||0));
function statusOf(p){if(p.injury)return['Injured','r'];if(p.hiatus)return['Hiatus','w'];if(p.busy)return['Filming','b'];return null}
