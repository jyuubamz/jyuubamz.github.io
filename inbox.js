// ================= FM-STYLE INBOX =================
const MSG_FROM={board:['board','Chairman'],release:['prod','Head of A&R'],win:['pr','Press Officer'],offer:['mgr','Director of Business'],scandal:['pr','PR Manager'],news:['mgr','Assistant Manager']};
const MSG_CAT={board:['🏛','Board','b'],release:['💿','Releases','p'],win:['🏆','Results','g'],offer:['💼','Offers','w'],scandal:['🚨','Crisis','r'],news:['📰','News','c']};
const SOURCES=['K-STAR DAILY','IDOL PULSE','CHART WATCH','SEOUL ENTERTAINMENT NEWS','STAGE NOW'];
function hashStr(s){let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))|0;return Math.abs(h)}
function faceOf(name){const h=hashStr(name);return{g:h%2?'F':'M',skin:h%5,hair:HAIR_N[h%5],bg:h%360}}
function msgMeta(m){
  if(m.from)return;
  const[role,title]=MSG_FROM[m.type]||MSG_FROM.news;let name;
  if(m.type==='board')name=S.board.members[0]?.name;
  else if(S.staff[role])name=S.staff[role].name;
  if(!name){S.sysNames=S.sysNames||{};if(!S.sysNames[title])S.sysNames[title]=genName(pick(['F','M']),'KR',-1)[0];name=S.sysNames[title]}
  m.from=name;m.role=title;m.time=`${RI(8,10)}:${String(RI(0,59)).padStart(2,'0')}`;m.src=pick(SOURCES);
}
function inboxList(){const f=S.ibf||'all',q=(S.ibq||'').toLowerCase();return S.inbox.filter(m=>(f==='all'||(f==='unread'&&!m.read)||m.type===f)&&(!q||(m.title+' '+m.body).toLowerCase().includes(q)))}
function openMsg(id){S.ibSel=id;const m=S.inbox.find(x=>x.id===id);if(m)m.read=true;save();render()}
function markAllRead(){S.inbox.forEach(m=>m.read=true);done()}
function delMsg(id){const l=inboxList(),i=l.findIndex(m=>m.id===id);S.inbox=S.inbox.filter(m=>m.id!==id);const nx=l[i+1]||l[i-1];S.ibSel=nx?nx.id:null;done()}
function toggleWeek(w){S.ibCol=S.ibCol||{};S.ibCol[w]=!S.ibCol[w];render()}
function msgAttachment(m){
  const l=m.link;if(!l)return '';
  const att=(h,b)=>`<div class="att"><div class="ah">${h}</div>${b}</div>`;
  if(l[0]==='p'&&!isNaN(+l.slice(1))){const p=P(+l.slice(1));if(!p)return '';const g=p.groupId?G(p.groupId):null;
    return att('PROFILE',`<div class="row" style="padding:12px;gap:14px">${avatar(p,56)}<div class="f1"><b style="font-size:16px">${esc(p.name)}</b><div class="sm muted">${FLAG[p.nat]} Age ${p.age} · ${role(p)} · ${persLabel(p)}${g?' · '+esc(g.name):''}</div><div style="margin-top:4px">${stars(cur(p))} <span class="xs muted">ability</span> ${stars(p.pot)} <span class="xs muted">potential</span></div></div></div><div class="tw"><table><tr>${AK.map(k=>`<th>${k.toUpperCase()}</th>`).join('')}<th>Morale</th><th>Cond</th></tr><tr>${AK.map(k=>`<td>${aNum(p.attrs[k])}</td>`).join('')}<td>${Math.round(p.morale)}</td><td>${Math.round(p.cond)}</td></tr></table></div>`)}
  if(l[0]==='g'&&!isNaN(+l.slice(1))){const g=G(+l.slice(1));if(!g)return '';
    return att('GROUP REPORT',`<div class="row" style="padding:12px;gap:12px"><div style="width:44px;height:44px;border-radius:8px;background:${g.color};display:flex;align-items:center;justify-content:center;font-weight:800;color:#111">${esc(g.name.slice(0,2))}</div><div class="f1"><b style="font-size:16px">${esc(g.name)}</b><div class="sm muted">${stageOf(g)} · ${fmtN(g.fans)} fans · mood ${Math.round(g.mood||0)} · ${g.trophies} wins</div></div></div><div class="tw"><table><tr><th>Release</th><th>Type</th><th>Date</th><th>Q</th><th>Peak</th><th>Wins</th><th>Sales</th></tr>${g.songs.slice(-6).reverse().map(id=>{const s=SG(id);return `<tr><td><b>${esc(s.title)}</b></td><td class="xs">${ALBUM[s.type]?ALBUM[s.type].n:s.type}</td><td class="xs muted">${s.week>0?dateStr(s.week):'—'}</td><td>${grade(s.quality)}</td><td>${s.peak>500?'–':'#'+s.peak}</td><td>${s.wins}</td><td>${fmtN(s.total)}</td></tr>`}).join('')||'<tr><td colspan="7" class="muted">No releases yet.</td></tr>'}</table></div>`)}
  if(l==='charts')return att('WEEKLY CHART · TOP 5',`<table>${chartRows(S.chart.slice(0,5),true)}</table>`);
  if(l==='awards'){const h=S.awardHist.filter(a=>a.y===yearOf(S.week)).slice(0,10);return h.length?att(`${yearOf(S.week)} WINNERS`,`<table><tr><th>Category</th><th>Winner</th><th>Agency</th></tr>${h.map(a=>`<tr class="${a.aid===0?'me':''}"><td class="sm">${a.cat}</td><td><b>${esc(a.name)}</b> <span class="xs muted">${esc(a.detail)}</span></td><td class="xs">${esc(AG(a.aid).name)}</td></tr>`).join('')}</table>`):''}
  if(l==='market'&&S.offers.length)return att('OPEN BIDS',S.offers.map(o=>{const p=P(o.pid);return p?`<div class="row" style="padding:8px 12px;border-bottom:1px solid #222a38">${avatar(p,30)}<div class="f1 sm"><b>${esc(p.given)}</b> · ${esc(AG(o.aid).name)} offer <b>${fmtM(o.amount)}</b> <span class="muted">(value ${fmtM(value(p))})</span></div><button class="btn s pri" onclick="respondOffer(${o.id},true)">Accept</button><button class="btn s" onclick="respondOffer(${o.id},false)">Reject</button></div>`:''}).join(''));
  if(l==='scandals'){const os=S.scandals.filter(x=>x.status==='open');return os.length?att('OPEN CRISES',os.map(x=>`<div class="row" style="padding:8px 12px"><span class="pill r">${'●'.repeat(x.sev)}</span><span class="f1 sm">${esc(x.type)} — ${esc(P(x.pid)?.given||'')} · respond by wk ${wkOf(x.deadline)}</span></div>`).join('')):''}
  if(l==='board'){const t=S.board.targets;return att('BOARD SNAPSHOT',`<div class="pb"><div class="stat"><span>Confidence</span><b style="color:${confCol(conf())}">${Math.round(conf())}%</b></div><div class="stat"><span>Agency table</span><span>#${myPos()} / target #${t.pos}</span></div><div class="stat"><span>Music show wins</span><span>${yWins()} / ${t.wins}</span></div></div>`)}
  return '';
}
const LINKNAME={board:'Board',charts:'Charts',awards:'Awards',market:'Market',scandals:'Scandals & PR',studio:'Studio',actors:'Actors',dorms:'Dorms',trainees:'Trainees',staff:'Staff',fans:'Fans',global:'Global',finances:'Finances',schedule:'Schedule',tv:'TV Shows'};
function linkLabel(l){if(!l)return '';if(l[0]==='p'&&!isNaN(+l.slice(1)))return 'View profile';if(l[0]==='g'&&!isNaN(+l.slice(1)))return 'Go to group';return 'Go to '+(LINKNAME[l]||l)}
function vInbox(){
  S.inbox.forEach(msgMeta);
  const list=inboxList(),f=S.ibf||'all';
  if(S.ibSel&&!S.inbox.find(m=>m.id===S.ibSel))S.ibSel=null;
  const wide=window.innerWidth>900;
  if(!S.ibSel&&wide&&list.length){S.ibSel=list[0].id;list[0].read=true;setTimeout(save,0)}
  const sel=S.inbox.find(m=>m.id===S.ibSel);
  const weeks=[];list.forEach(m=>{const k=m.w*7+(m.d||0);let w=weeks.find(x=>x.k===k);if(!w){w={k,w:m.w,d:m.d||0,items:[]};weeks.push(w)}w.items.push(m)});const tv=t=>{const[h,mm]=t.split(':');return +h*60+ +mm};weeks.forEach(w=>w.items.sort((a,b)=>tv(b.time)-tv(a.time)));
  const col=S.ibCol||{};
  const filters=[['all','All Items'],['unread','Unread'],['board','Board'],['release','Releases'],['win','Results & awards'],['offer','Offers'],['scandal','Crisis'],['news','News']];
  const left=`<div class="ibl"><div class="tb"><select onchange="S.ibf=this.value;S.ibSel=null;render()">${filters.map(([k,l])=>`<option value="${k}" ${f===k?'selected':''}>${l}</option>`).join('')}</select><input placeholder="🔍 Search" value="${esc(S.ibq||'')}" onchange="S.ibq=this.value;S.ibSel=null;render()"><button class="btn s" title="Mark all read" onclick="markAllRead()">✓</button></div>
  <div class="ls">${weeks.map(w=>`<div class="wk" onclick="toggleWeek(${w.k})">${dayStr(w.w,w.d,true)} <span>(${w.items.length} item${w.items.length>1?'s':''}) ${col[w.k]?'▸':'▾'}</span></div>${col[w.k]?'':w.items.map(m=>`<div class="mi ${m.read?'':'unread'} ${sel&&sel.id===m.id?'on':''}" onclick="openMsg(${m.id})"><div class="fr"><b>${esc(m.from)}</b><span>${m.time}</span></div><div class="sj">${m.title}</div></div>`).join('')}`).join('')||'<p class="muted" style="padding:14px">No messages.</p>'}</div></div>`;
  let right='<div class="ibp"><div class="bd muted">Select a message.</div></div>';
  if(sel){const cat=MSG_CAT[sel.type]||MSG_CAT.news,face=faceOf(sel.from),isArticle=['news','win','scandal','release'].includes(sel.type);
    const intro={news:"I'm forwarding the following for your attention:",win:"Great news from the press office:",scandal:"This story broke today. We need a decision from you quickly:",release:"Here's the latest from the studio:"}[sel.type];
    const body=isArticle?`<p>${intro}</p><div class="article"><div class="src"><span>${sel.src}</span></div><div class="ac"><h3>${sel.title.replace(/^[^\w"'#]+\s*/,'')}</h3><div>${sel.body}</div></div></div>`:`<p>Dear ${esc(S.agency)} CEO,</p><p>${sel.body}</p><p class="muted">— ${esc(sel.from)}, ${sel.role}</p>`;
    right=`<div class="ibp"><div class="hd"><button class="ib back" onclick="S.ibSel=null;render()">‹</button>${avatar(face,44)}<div class="f1" style="min-width:0"><div class="who">${esc(sel.from)} (${sel.role})</div><div class="sjt">${sel.title}</div></div><div style="text-align:right" class="xs"><span class="pill ${cat[2]}">${cat[0]} ${cat[1]}</span><div class="muted" style="margin-top:4px">${dayStr(sel.w,sel.d||0)} · ${sel.time}</div></div></div>
    <div class="bd">${body}${msgAttachment(sel)}</div>
    <div class="ft">${sel.link?`<button class="btn club" onclick="openLink('${sel.link}')">${linkLabel(sel.link)} ›</button>`:''}<span class="f1"></span><button class="btn s" onclick="const m=S.inbox.find(x=>x.id===${sel.id});m.read=false;S.ibSel=null;done()">Mark unread</button><button class="btn s dan" onclick="delMsg(${sel.id})">Delete</button></div></div>`}
  return `<div class="ibx ${sel?'reading':''}">${left}${right}</div>`;
}
