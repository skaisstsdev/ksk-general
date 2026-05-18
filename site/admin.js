const SUPABASE_URL='YOUR_SUPABASE_URL',SUPABASE_KEY='YOUR_SUPABASE_ANON_KEY',PASSWORD='kskfarmos2025';
let db=null,bewerbungen=[],activeTab='alle',searchQuery='',filterQual='',curModal=null;
let lang=localStorage.getItem('ksk-admin-lang')||'de';

const avatarC={neu:'var(--violet)',bearbeitung:'#d97706',angenommen:'#059669',abgelehnt:'#dc2626',archiv:'var(--gray-600,#6b7280)'};

// ═══ i18n ═══
const T={
  de:{
    login_title:'Anmelden', login_btn:'Anmelden', login_ph:'Passwort eingeben', login_err:'Falsches Passwort. Bitte erneut versuchen.',
    tab_alle:'Alle', tab_neu:'Neu', tab_archiv:'Archiv', logout:'Abmelden', neue:'neue',
    stat_total:'Gesamt', stat_neu:'Neu', stat_bearb:'In Bearbeitung', stat_arch:'Archiviert',
    search_ph:'Suchen nach Name, Telefon, E-Mail...', all_qual:'Alle Qualifikationen', reset:'Zurücksetzen',
    details:'Details →', call:'Anrufen', email:'E-Mail senden',
    lbl_exp:'Erfahrung', lbl_fs:'Führerschein B', lbl_az:'Arbeitszeit', lbl_src:'Stelle', lbl_msg:'Nachricht',
    initiativ:'Initiativbewerbung', notes:'Interne Notizen', notes_ph:'Notizen hier eingeben...', save:'Speichern', saved:'Gespeichert',
    lbl_files:'Angehängte Dateien', no_files:'Keine Dateien',
    archive:'Archivieren', reject:'Ablehnen', reject_confirm:'Bewerbung wirklich ablehnen?',
    empty:'Keine Bewerbungen gefunden', empty_sub:'Versuchen Sie andere Filter',
    st_neu:'Neu', st_bearb:'In Bearbeitung', st_ang:'Angenommen', st_abg:'Abgelehnt', st_arch:'Archiviert',
    q_fach:'Exam. Pflegefachkraft', q_alten:'Altenpfleger/in', q_helfer:'Pflegehelfer/in', q_student:'Medizinstudent/in', q_sonst:'Sonstiges',
    e_keine:'Keine', e_12:'1–2 Jahre', e_35:'3–5 Jahre', e_5p:'Über 5 Jahre',
    fs_ja:'Ja', fs_nein:'Nein',
    time_now:'gerade eben', time_min:'vor {n} Min.', time_h:'vor {n} Std.', time_d:'vor {n} Tagen',
    toast_new:'🔔 Neue Bewerbung — '
  },
  ru:{
    login_title:'Вход', login_btn:'Войти', login_ph:'Введите пароль', login_err:'Неверный пароль. Попробуйте снова.',
    tab_alle:'Все', tab_neu:'Новые', tab_archiv:'Архив', logout:'Выйти', neue:'новых',
    stat_total:'Всего', stat_neu:'Новые', stat_bearb:'В обработке', stat_arch:'В архиве',
    search_ph:'Поиск по имени, телефону, e-mail...', all_qual:'Все квалификации', reset:'Сбросить',
    details:'Подробнее →', call:'Позвонить', email:'Написать e-mail',
    lbl_exp:'Опыт', lbl_fs:'Водительские права B', lbl_az:'Занятость', lbl_src:'Вакансия', lbl_msg:'Сообщение',
    initiativ:'Спонтанный отклик', notes:'Внутренние заметки', notes_ph:'Введите заметки...', save:'Сохранить', saved:'Сохранено',
    lbl_files:'Прикрепленные файлы', no_files:'Нет файлов',
    archive:'В архив', reject:'Отклонить', reject_confirm:'Действительно отклонить заявку?',
    empty:'Заявки не найдены', empty_sub:'Попробуйте другие фильтры',
    st_neu:'Новая', st_bearb:'В обработке', st_ang:'Принята', st_abg:'Отклонена', st_arch:'В архиве',
    q_fach:'Мед. специалист (экзамен)', q_alten:'Гериатрическая медсестра', q_helfer:'Помощник по уходу', q_student:'Студент-медик', q_sonst:'Другое',
    e_keine:'Нет', e_12:'1–2 года', e_35:'3–5 лет', e_5p:'Более 5 лет',
    fs_ja:'Да', fs_nein:'Нет',
    time_now:'только что', time_min:'мин. назад: {n}', time_h:'ч. назад: {n}', time_d:'дн. назад: {n}',
    toast_new:'🔔 Новая заявка — '
  }
};

function t(key){return T[lang][key]||T.de[key]||key}

const stMap=()=>({neu:t('st_neu'),bearbeitung:t('st_bearb'),angenommen:t('st_ang'),abgelehnt:t('st_abg'),archiv:t('st_arch')});
const qMap=()=>({fachkraft:t('q_fach'),altenpfleger:t('q_alten'),pflegehelfer:t('q_helfer'),student:t('q_student'),sonstiges:t('q_sonst'),exam:t('q_fach'),alten:t('q_alten'),helfer:t('q_helfer')});
const eMap=()=>({keine:t('e_keine'),'0':t('e_keine'),'1-2':t('e_12'),'3-5':t('e_35'),'5+':t('e_5p')});

function timeAgo(d){
  const x=Date.now()-new Date(d),m=Math.floor(x/6e4),h=Math.floor(x/36e5),dy=Math.floor(x/864e5);
  if(m<1)return t('time_now');
  if(m<60)return t('time_min').replace('{n}',m);
  if(h<24)return t('time_h').replace('{n}',h);
  return t('time_d').replace('{n}',dy);
}
function ini(v,n){return((v||'X')[0]+(n||'X')[0]).toUpperCase()}

// ═══ Language switcher ═══
function switchLang(l){
  lang=l;localStorage.setItem('ksk-admin-lang',l);
  applyLang();renderAll();
  document.querySelectorAll('.lang-select').forEach(s=>s.value=l);
}

function applyLang(){
  document.querySelectorAll('[data-t]').forEach(el=>{
    const key=el.getAttribute('data-t');
    const val=t(key);
    if(el.tagName==='INPUT'||el.tagName==='TEXTAREA')el.placeholder=val;
    else if(el.tagName==='OPTION')el.textContent=val;
    else el.textContent=val;
  });
}

// ═══ Auth ═══
function checkAuth(){if(sessionStorage.getItem('ksk-admin')==='1')showDash()}
function tryLogin(){const i=document.getElementById('pw'),e=document.getElementById('err');if(i.value===PASSWORD){sessionStorage.setItem('ksk-admin','1');showDash()}else{e.textContent=t('login_err');i.value='';i.focus()}}
function logout(){sessionStorage.removeItem('ksk-admin');document.getElementById('login').style.display='flex';document.getElementById('dash').classList.remove('active')}
function showDash(){document.getElementById('login').style.display='none';document.getElementById('dash').classList.add('active');initDB()}

async function initDB(){
  if(SUPABASE_URL==='YOUR_SUPABASE_URL'){bewerbungen=demo();renderAll();return}
  db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
  document.getElementById('la').innerHTML='<div class="skel"></div><div class="skel"></div><div class="skel"></div>';
  const{data}=await db.from('bewerbungen').select('*').order('created_at',{ascending:false});
  bewerbungen=data||[];renderAll();
  db.channel('bew').on('postgres_changes',{event:'INSERT',schema:'public',table:'bewerbungen'},(p)=>{bewerbungen.unshift(p.new);renderAll();showToast(t('toast_new')+`${p.new.vorname} ${p.new.nachname}`)}).on('postgres_changes',{event:'UPDATE',schema:'public',table:'bewerbungen'},(p)=>{const i=bewerbungen.findIndex(b=>b.id===p.new.id);if(i!==-1)bewerbungen[i]=p.new;renderAll()}).subscribe()
}

function renderAll(){applyLang();updateStats();renderList()}

function updateStats(){
  const tot=bewerbungen.length,n=bewerbungen.filter(b=>b.status==='neu').length,br=bewerbungen.filter(b=>b.status==='bearbeitung').length,a=bewerbungen.filter(b=>b.status==='archiv'||b.status==='abgelehnt').length;
  document.getElementById('sT').textContent=tot;document.getElementById('sN').textContent=n;document.getElementById('sB').textContent=br;document.getElementById('sA').textContent=a;
  document.getElementById('cAll').textContent=tot;document.getElementById('cNeu').textContent=n+br;document.getElementById('cArch').textContent=a;
  const bg=document.getElementById('bdg');if(n>0){bg.textContent=`${n} ${t('neue')}`;bg.classList.add('vis')}else bg.classList.remove('vis')
}

function getF(){
  return bewerbungen.filter(b=>{
    if(activeTab==='neu'&&b.status!=='neu'&&b.status!=='bearbeitung')return false;
    if(activeTab==='archiv'&&b.status!=='archiv'&&b.status!=='abgelehnt')return false;
    if(searchQuery){const q=searchQuery.toLowerCase();if(!`${b.vorname} ${b.nachname} ${b.telefon||''} ${b.email||''}`.toLowerCase().includes(q))return false}
    if(filterQual&&b.qualifikation!==filterQual)return false;
    if(filterQual&&b.qualifikation!==filterQual)return false;
    return true
  })
}

function renderList(){
  const c=document.getElementById('la'),f=getF(),sl=stMap(),ql=qMap();
  if(!f.length){c.innerHTML=`<div class="empty"><i data-lucide="inbox" style="width:48px;height:48px;color:var(--gray-400)"></i><p>${t('empty')}</p><div class="sub">${t('empty_sub')}</div></div>`;lucide.createIcons();return}
  c.innerHTML=f.map(b=>{
    const s=b.status||'neu',srcL=b.stelle||t('initiativ');
    return`<div class="a-card" onclick="openM('${b.id}')"><div class="c-left"><div class="av" style="background:${avatarC[s]||avatarC.neu}">${ini(b.vorname,b.nachname)}</div><div><div class="c-name">${b.vorname} ${b.nachname}</div><div class="c-meta">${ql[b.qualifikation]||b.qualifikation||'–'} · ${timeAgo(b.created_at)}</div></div></div><div class="c-center"><a href="tel:${(b.telefon||'').replace(/\s/g,'')}" onclick="event.stopPropagation()"><i data-lucide="phone" style="width:14px;height:14px"></i> ${b.telefon||'–'}</a><a href="mailto:${b.email||''}" onclick="event.stopPropagation()"><i data-lucide="mail" style="width:14px;height:14px"></i> ${b.email||'–'}</a><span class="src" style="background:rgba(59,130,246,.15);color:#3b82f6">${srcL}</span></div><div class="c-right"><span class="st ${s}">${sl[s]||s}</span><button class="btn btn-outline btn-sm" style="border-color:rgba(255,255,255,.15);color:var(--gray-400)">${t('details')}</button></div></div>`
  }).join('');
  lucide.createIcons()
}

function openM(id){
  const b=bewerbungen.find(x=>x.id===id);if(!b)return;curModal=b;
  const s=b.status||'neu',mo=document.getElementById('mo'),mc=document.getElementById('mc');
  const sl=stMap(),ql=qMap(),el=eMap();
  const msg=b.nachricht?`<div class="m-sec"><label>${t('lbl_msg')}</label><div class="m-msg">${b.nachricht}</div></div>`:'';
  
  const files = [];
  if (b.cv) files.push({ name: 'Lebenslauf / CV', url: b.cv });
  if (b.dateien && Array.isArray(b.dateien)) files.push(...b.dateien);
  const filesHtml = files.length > 0 
    ? files.map(f => `<a href="${f.url||f}" target="_blank" style="display:inline-flex;align-items:center;gap:6px;background:#ffffff;border:1px solid #e2e8f0;padding:8px 12px;border-radius:var(--r-md);color:#0f172a;text-decoration:none;font-size:.85rem;margin-right:8px;margin-bottom:8px;transition:all .2s" onmouseover="this.style.background='#f8fafc';this.style.borderColor='#cbd5e1'" onmouseout="this.style.background='#ffffff';this.style.borderColor='#e2e8f0'"><i data-lucide="paperclip" style="width:14px;height:14px;color:#64748b"></i> ${f.name||'Datei'}</a>`).join('')
    : `<div style="font-size:.85rem;color:#64748b">${t('no_files')}</div>`;

  mc.innerHTML=`<button class="m-close" onclick="closeM()"><i data-lucide="x" style="width:20px;height:20px"></i></button>
<div class="m-head"><div class="av" style="background:${avatarC[s]||avatarC.neu}">${ini(b.vorname,b.nachname)}</div><div><h2>${b.vorname} ${b.nachname}</h2><div class="qual">${ql[b.qualifikation]||b.qualifikation||'–'}</div><div class="date">${new Date(b.created_at).toLocaleDateString(lang==='ru'?'ru-RU':'de-DE',{day:'2-digit',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'})}</div></div></div>
<div class="m-acts"><a href="tel:${(b.telefon||'').replace(/\s/g,'')}" class="call"><i data-lucide="phone" style="width:16px;height:16px"></i> ${t('call')}</a><a href="mailto:${b.email||''}" class="mail"><i data-lucide="mail" style="width:16px;height:16px"></i> ${t('email')}</a></div>
<div class="d-grid"><div class="d-item"><div class="lbl">${t('lbl_exp')}</div><div class="val">${el[b.erfahrung]||b.erfahrung||'–'}</div></div><div class="d-item"><div class="lbl">${t('lbl_fs')}</div><div class="val">${b.fuehrerschein==='ja'?t('fs_ja'):b.fuehrerschein==='nein'?t('fs_nein'):'–'}</div></div><div class="d-item"><div class="lbl">${t('lbl_az')}</div><div class="val">${b.arbeitszeit||'–'}</div></div><div class="d-item"><div class="lbl">${t('lbl_src')}</div><div class="val">${b.stelle||t('initiativ')}</div></div></div>
${msg}
<div class="m-sec"><label>${t('lbl_files')}</label><div>${filesHtml}</div></div>
<div class="m-sec"><label>${t('status_change')}</label><select id="mSt" onchange="updSt('${b.id}',this.value)"><option value="neu"${s==='neu'?' selected':''}>${t('st_neu')}</option><option value="bearbeitung"${s==='bearbeitung'?' selected':''}>${t('st_bearb')}</option><option value="angenommen"${s==='angenommen'?' selected':''}>${t('st_ang')}</option><option value="abgelehnt"${s==='abgelehnt'?' selected':''}>${t('st_abg')}</option><option value="archiv"${s==='archiv'?' selected':''}>${t('st_arch')}</option></select><span id="spn"></span></div>
<div class="m-sec"><label>${t('notes')}</label><textarea id="mNo" rows="4" placeholder="${t('notes_ph')}">${b.notizen||''}</textarea><div style="margin-top:8px"><button class="btn btn-primary btn-sm" id="bSave" onclick="saveN('${b.id}')">${t('save')}</button></div></div>
<div class="danger"><button class="btn-arch" onclick="archI('${b.id}')"><i data-lucide="archive" style="width:14px;height:14px"></i> ${t('archive')}</button><button class="btn-rej" onclick="rejI('${b.id}')"><i data-lucide="x-circle" style="width:14px;height:14px"></i> ${t('reject')}</button></div>`;
  mo.classList.add('open');document.body.style.overflow='hidden';lucide.createIcons()
}
function closeM(){document.getElementById('mo').classList.remove('open');document.body.style.overflow='';curModal=null}

async function updSt(id,st){
  const sp=document.getElementById('spn');sp.innerHTML='<span class="spin"></span>';
  const i=bewerbungen.findIndex(b=>b.id===id);if(i!==-1)bewerbungen[i].status=st;
  if(db)await db.from('bewerbungen').update({status:st}).eq('id',id);
  sp.innerHTML=' ✓';setTimeout(()=>sp.innerHTML='',1500);renderAll()
}
async function saveN(id){
  const btn=document.getElementById('bSave'),n=document.getElementById('mNo').value;
  const i=bewerbungen.findIndex(b=>b.id===id);if(i!==-1)bewerbungen[i].notizen=n;
  if(db)await db.from('bewerbungen').update({notizen:n}).eq('id',id);
  btn.innerHTML=`<i data-lucide="check-circle" style="width:14px;height:14px"></i> ${t('saved')}`;btn.style.background='#059669';lucide.createIcons();
  setTimeout(()=>{btn.textContent=t('save');btn.style.background=''},2000)
}
async function archI(id){await updSt(id,'archiv');closeM()}
async function rejI(id){if(!confirm(t('reject_confirm')))return;await updSt(id,'abgelehnt');closeM()}

function showToast(msg){const e=document.querySelector('.toast');if(e)e.remove();const el=document.createElement('div');el.className='toast';el.textContent=msg;document.body.appendChild(el);requestAnimationFrame(()=>el.classList.add('vis'));setTimeout(()=>{el.classList.remove('vis');setTimeout(()=>el.remove(),400)},5000)}

function setTab(tab){activeTab=tab;document.querySelectorAll('.dash-tab').forEach(x=>x.classList.toggle('active',x.dataset.tab===tab));renderList()}
function onSI(v){searchQuery=v;renderList()}
function onQF(v){filterQual=v;renderList()}
function resetF(){searchQuery='';filterQual='';document.getElementById('si').value='';document.getElementById('qf').value='';renderList()}

function demo(){const n=Date.now();return[
{id:'d1',created_at:new Date(n-36e5).toISOString(),vorname:'Maria',nachname:'Schmidt',email:'maria@example.de',telefon:'0170 1234567',qualifikation:'fachkraft',erfahrung:'3-5',fuehrerschein:'ja',arbeitszeit:'Vollzeit',nachricht:'Ich freue mich auf Ihre Rückmeldung!',status:'neu',notizen:'',stelle:'Pflegefachkraft (m/w/d)',cv:'https://example.com/cv.pdf'},
{id:'d2',created_at:new Date(n-72e5).toISOString(),vorname:'Thomas',nachname:'Müller',email:'thomas.m@example.de',telefon:'0151 9876543',qualifikation:'altenpfleger',erfahrung:'5+',fuehrerschein:'ja',arbeitszeit:'Teilzeit',nachricht:'',status:'bearbeitung',notizen:'Termin nächste Woche',stelle:'Altenpfleger/in',dateien:[{name:'Zertifikat 1',url:'#'},{name:'Zertifikat 2',url:'#'}]},
{id:'d3',created_at:new Date(n-864e5).toISOString(),vorname:'Anna',nachname:'Weber',email:'anna.w@example.de',telefon:'0176 5551234',qualifikation:'pflegehelfer',erfahrung:'1-2',fuehrerschein:'nein',arbeitszeit:'Minijob',nachricht:'Bin ab Juli verfügbar.',status:'neu',notizen:'',stelle:''},
{id:'d4',created_at:new Date(n-1728e5).toISOString(),vorname:'Kemal',nachname:'Yilmaz',email:'kemal@example.de',telefon:'0172 3334455',qualifikation:'fachkraft',erfahrung:'5+',fuehrerschein:'ja',arbeitszeit:'Vollzeit',nachricht:'',status:'angenommen',notizen:'Start 01.06.',stelle:'Pflegefachkraft für Intensivpflege'},
{id:'d5',created_at:new Date(n-6048e5).toISOString(),vorname:'Olga',nachname:'Petrov',email:'olga.p@example.de',telefon:'0163 7778899',qualifikation:'student',erfahrung:'keine',fuehrerschein:'nein',arbeitszeit:'Flexibel',nachricht:'Suche Praktikumsplatz.',status:'archiv',notizen:'Praktikum beendet',stelle:'Praktikum / Studentenjob'}
]}

document.addEventListener('DOMContentLoaded',()=>{
  applyLang();
  document.querySelectorAll('.lang-select').forEach(s=>s.value=lang);
  checkAuth();
  document.getElementById('lBtn').addEventListener('click',tryLogin);
  document.getElementById('pw').addEventListener('keydown',e=>{if(e.key==='Enter')tryLogin()});
  document.getElementById('mo').addEventListener('click',e=>{if(e.target===e.currentTarget)closeM()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeM()});
  document.querySelectorAll('.dash-tab').forEach(t=>t.addEventListener('click',()=>setTab(t.dataset.tab)));
});
