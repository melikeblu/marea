import { useState, useMemo } from "react";
import { Leaf, Zap, Users, CalendarDays, Link2, Moon, Sun, Globe2, Check, ArrowLeft, Smartphone, Upload, PenLine, Info, Share2 } from "lucide-react";

const PC = {
  menstrual:"#C4614A", follicular:"#7A9E7A", ovulation:"#C4965A",
  luteal:"#4A8B86", late_luteal:"#9B8FA4",
  new_moon:"#C4614A", waxing:"#7A9E7A", full_moon:"#C4965A", waning:"#9B8FA4",
};
const TH = {
  light:{bg:"#F8F5EF",surface:"#FDFBF7",border:"#E8E3DB",text:"#2C2820",muted:"#9C9085",nav:"#FDFBF7"},
  dark: {bg:"#1A1D18",surface:"#222520",border:"#2E3229",text:"#F0EDE7",muted:"#8A8E84",nav:"#1E211C"},
};

const C = {
  tr:{
    app:"marea", tagline:"Döngünle yaşa.",
    stages:{
      pre:      {l:"Pre-menopoz",   d:"Düzenli regllerim var"},
      peri:     {l:"Peri-menopoz",  d:"Regllerim düzensizleşti"},
      meno:     {l:"Menopozda",     d:"Bir yılı aşkın süredir reglim yok"},
      post:     {l:"Post-menopoz",  d:"Menopoz sonrası dönem"},
      dont_know:{l:"Bilmiyorum",    d:"Birlikte keşfedelim"},
    },
    phases:{
      menstrual:  {n:"Menstrüel",  s:"Dinlen, içe dön"},
      follicular: {n:"Foliküler",  s:"Yeni başlangıçlar"},
      ovulation:  {n:"Ovülasyon",  s:"Parlak, bağlı"},
      luteal:     {n:"Luteal",     s:"Odaklı, derin"},
      late_luteal:{n:"Geç Luteal", s:"Yavaşla, hazırlan"},
      new_moon:   {n:"Yeni Ay",    s:"Yeniden başla"},
      waxing:     {n:"Artan Ay",   s:"Büyü, başla"},
      full_moon:  {n:"Dolunay",    s:"Parla, bağlan"},
      waning:     {n:"Azalan Ay",  s:"Yavaşla, tamamla"},
    },
    rec:{
      menstrual:{
        nut:{tip:"Demir (ıspanak, mercimek, kırmızı et), omega-3 (somon, ceviz). Kafein azalt, ılık içecekler iyi gelir.",warn:"IF bu dönem önerilmez",src:"ACOG Practice Bulletin, 2000"},
        mov:{tip:"Hafif yürüyüş, yin yoga, yüzme. Vücudunu dinle, ağır antrenman bekliyebilir.",warn:null,src:"McNulty et al., Sports Med 2020"},
        soc:{tip:"İçe dön. Küçük, samimi buluşmalar yeter. Kalabalık etkinlikler enerjini tüketir.",cal:"Bu dönemde büyük sosyal etkinlik varsa enerji ayarla.",warn:null},
      },
      follicular:{
        nut:{tip:"Fermente besinler (kefir, yoğurt), filiz, hafif protein. 16:8 IF için en uygun pencere.",warn:null,src:"Sims S, Roar. Rodale, 2016"},
        mov:{tip:"Kuvvet antrenmanı ve HIIT için en verimli dönem. Yeni bir spor denemek için ideal.",warn:null,src:"Wikström-Frisén et al., J Sports Sci 2017"},
        soc:{tip:"Ağ kurma, yeni tanışmalar, proje başlatma. Sosyal enerjin yüksek.",cal:"✓ Kritik toplantıları bu haftaya planla.",warn:null},
      },
      ovulation:{
        nut:{tip:"Antiinflamatuar besinler: zerdeçal, yeşil yapraklılar, yaban mersini. Lif öncelikli.",warn:null,src:""},
        mov:{tip:"Peak performans günlerin. Her türlü egzersiz. Yeni rekorlar için uygun.",warn:null,src:"Romero-Moraleda et al., Sports Med 2022"},
        soc:{tip:"Sunum, müzakere, önemli görüşmeler için ideal. En karizmatik dönemin.",cal:"✓ Sunumun veya büyük toplantın varsa mükemmel zamanlama.",warn:null},
      },
      luteal:{
        nut:{tip:"Magnezyum (badem, koyu çikolata), B6 (hindi, muz). IF penceresini 12-13 saate düşür.",warn:"Uzun açlık kortizol artırır",src:"Pelletier et al., Fertil Steril 2001"},
        mov:{tip:"Orta yoğunluk: pilates, yüzme, tempolu yürüyüş. Enerji dalgalanabilir.",warn:null,src:"McNulty et al., Sports Med 2020"},
        soc:{tip:"Derin, bire-bir görüşmeler tercih et. Kalabalıklar için enerji ayarla.",cal:"Kalabalık etkinlik varsa önceden enerji planla.",warn:null},
      },
      late_luteal:{
        nut:{tip:"Tuz ve şeker azalt, bol su. Omega-3 (somon), magnezyum (kabak çekirdeği, badem).",warn:"IF bu dönem önerilmez",src:"ACOG Practice Bulletin, 2000"},
        mov:{tip:"Hafif yürüyüş, restoratif yoga. Kendinle nazik ol.",warn:null,src:""},
        soc:{tip:"Büyük sosyal etkinliklerden kaçın. Küçük, güvenli çevrenle kal.",cal:"⚠ Bu dönemde sosyal etkinlik var — dikkat et.",warn:"⚠ Büyük sosyal etkinlikler bu dönemde yorucu olabilir"},
      },
    },
    ob:{
      lang:"Dil seç",
      hi:"Merhaba.", hi2:"marea, döngünü anlayarak sana eşlik eder.",
      nameQ:"Adın ne?", namePh:"İsmin",
      stageQ:"Şu an hangi dönemdesin?",
      periodQ:"Son menstruasyonun ne zaman başladı?",
      cycleQ:"Ortalama cycle uzunluğun (gün)?",
      connectQ:"Verilerini nasıl bağlamak istersin?",
      skip:"Atla", next:"Devam", start:"Başla",
      later:"Şimdilik geç → Başla",
    },
    nav:{today:"Bugün", calendar:"Takvim", connect:"Bağla"},
    conn:{
      title:"Veri Bağlantısı", sub:"Her zaman değiştirebilirsin.",
      connected:"Bağlandı",
      google:{n:"Google Calendar",d:"Takvimini oku ve yaz",btn:"Bağlan"},
      apple: {n:"Apple Health",   d:"Cycle, uyku ve aktivite verisi",btn:"Kurulum Rehberi"},
      import:{n:"Uygulama Aktar", d:"Flo, Clue veya CSV dosyası",btn:"Dosya Seç"},
      manual:{n:"Manuel Giriş",   d:"Verileri kendin girersin",btn:"Aktif"},
      note:"Kaynak: Helfrich-Förster et al., Science Advances, 2021 (ay döngüsü ritimsel planlama çerçevesi olarak kullanılmaktadır)",
      dis:"marea genel bilgi sunar. Tıbbi tavsiye değildir.",
    },
    share:{
      title:"Bugünkü Durumunu Paylaş",
      sub:"Bir etkinlikten neden enerji ayırdığını açıklamak için kullanabilirsin.",
      btn:"Paylaş",
      copy:"Kopyala",
      copied:"Kopyalandı ✓",
      footer:"— marea ile takip ediyorum",
    },
    day:"Gün", of:"/",
    monthNames:["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"],
    dayNames:["Pz","Pt","Sa","Ça","Pe","Cu","Ct"],
    source:"Kaynak",
  },
  en:{
    app:"marea", tagline:"Live with your cycle.",
    stages:{
      pre:      {l:"Pre-menopause",  d:"I have regular periods"},
      peri:     {l:"Perimenopause",  d:"My cycles are becoming irregular"},
      meno:     {l:"In menopause",   d:"No period for 12+ months"},
      post:     {l:"Post-menopause", d:"After menopause"},
      dont_know:{l:"Not sure",       d:"Let's figure it out together"},
    },
    phases:{
      menstrual:  {n:"Menstrual",   s:"Rest, turn inward"},
      follicular: {n:"Follicular",  s:"New beginnings"},
      ovulation:  {n:"Ovulation",   s:"Bright, connected"},
      luteal:     {n:"Luteal",      s:"Focused, deep"},
      late_luteal:{n:"Late Luteal", s:"Slow down, prepare"},
      new_moon:   {n:"New Moon",    s:"Begin again"},
      waxing:     {n:"Waxing Moon", s:"Grow, begin"},
      full_moon:  {n:"Full Moon",   s:"Shine, connect"},
      waning:     {n:"Waning Moon", s:"Slow down, complete"},
    },
    rec:{
      menstrual:{
        nut:{tip:"Iron-rich foods (spinach, lentils, red meat), omega-3 (salmon, walnuts). Reduce caffeine, warm drinks help.",warn:"IF not recommended now",src:"ACOG Practice Bulletin, 2000"},
        mov:{tip:"Light walking, yin yoga, swimming. Listen to your body — heavy training can wait.",warn:null,src:"McNulty et al., Sports Med 2020"},
        soc:{tip:"Turn inward. Small intimate gatherings are fine. Avoid large events.",cal:"Large social event today — manage your energy.",warn:null},
      },
      follicular:{
        nut:{tip:"Fermented foods (kefir, yogurt), sprouts, light protein. Best window for 16:8 IF.",warn:null,src:"Sims S, Roar. Rodale, 2016"},
        mov:{tip:"Best time for strength training and HIIT. Your energy is rising — try something new.",warn:null,src:"Wikström-Frisén et al., J Sports Sci 2017"},
        soc:{tip:"Networking, new connections, starting projects. Your social energy is at its best.",cal:"✓ Great week for important meetings and pitches.",warn:null},
      },
      ovulation:{
        nut:{tip:"Anti-inflammatory foods: turmeric, leafy greens, blueberries. Prioritize fiber.",warn:null,src:""},
        mov:{tip:"Peak performance days. Any exercise. Good time for personal bests.",warn:null,src:"Romero-Moraleda et al., Sports Med 2022"},
        soc:{tip:"Ideal for presentations, negotiations, important meetings. Most charismatic phase.",cal:"✓ Presentation or big meeting? Perfect timing.",warn:null},
      },
      luteal:{
        nut:{tip:"Magnesium (almonds, dark chocolate), B6 (turkey, banana). Reduce IF window to 12–13h.",warn:"Long fasting raises cortisol",src:"Pelletier et al., Fertil Steril 2001"},
        mov:{tip:"Moderate intensity: pilates, swimming, brisk walking. Energy may fluctuate.",warn:null,src:"McNulty et al., Sports Med 2020"},
        soc:{tip:"Deep one-on-ones preferred. Budget your energy for larger gatherings.",cal:"Large event coming — plan your energy ahead.",warn:null},
      },
      late_luteal:{
        nut:{tip:"Reduce salt and sugar. Hydrate well. Omega-3 (salmon), magnesium (pumpkin seeds, almonds).",warn:"IF not recommended now",src:"ACOG Practice Bulletin, 2000"},
        mov:{tip:"Light walking, restorative yoga. Be gentle with yourself.",warn:null,src:""},
        soc:{tip:"Avoid large social events. Stay close to your safe circle.",cal:"⚠ Social event today — consider your energy.",warn:"⚠ Large social events can be draining in this phase"},
      },
    },
    ob:{
      lang:"Choose language",
      hi:"Hello.", hi2:"marea accompanies you as you understand your cycle.",
      nameQ:"What's your name?", namePh:"Your name",
      stageQ:"Which stage are you in?",
      periodQ:"When did your last period start?",
      cycleQ:"Average cycle length (days)?",
      connectQ:"How would you like to connect your data?",
      skip:"Skip", next:"Continue", start:"Start",
      later:"Skip for now → Start",
    },
    nav:{today:"Today", calendar:"Calendar", connect:"Connect"},
    conn:{
      title:"Connect Data", sub:"Change anytime.",
      connected:"Connected",
      google:{n:"Google Calendar",d:"Read and write your calendar",btn:"Connect"},
      apple: {n:"Apple Health",   d:"Cycle, sleep & activity data",btn:"Setup Guide"},
      import:{n:"Import from App",d:"Flo, Clue or CSV file",btn:"Choose File"},
      manual:{n:"Manual Entry",   d:"Enter your own data",btn:"Active"},
      note:"Source: Helfrich-Förster et al., Science Advances, 2021 (lunar cycle used as rhythmic planning framework)",
      dis:"marea provides general information, not medical advice.",
    },
    share:{
      title:"Share Today's Status",
      sub:"Use this to explain why you're conserving your energy today.",
      btn:"Share",
      copy:"Copy",
      copied:"Copied ✓",
      footer:"— Tracked with marea",
    },
    day:"Day", of:"/",
    monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],
    dayNames:["Su","Mo","Tu","We","Th","Fr","Sa"],
    source:"Source",
  },
};

const RMAP = {menstrual:"menstrual",follicular:"follicular",ovulation:"ovulation",luteal:"luteal",late_luteal:"late_luteal",new_moon:"menstrual",waxing:"follicular",full_moon:"ovulation",waning:"luteal"};

function pToC(cx,cy,r,deg){const rad=(deg-90)*Math.PI/180;return{x:+(cx+r*Math.cos(rad)).toFixed(3),y:+(cy+r*Math.sin(rad)).toFixed(3)};}
function arcD(cx,cy,r,s,e){const p1=pToC(cx,cy,r,s),p2=pToC(cx,cy,r,e);return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${e-s>180?1:0} 1 ${p2.x} ${p2.y}`;}

function calcPhase(user){
  if(!user||!user.lastPeriod)return{phase:"follicular",day:8,total:28};
  const today=new Date();today.setHours(0,0,0,0);
  const last=new Date(user.lastPeriod);last.setHours(0,0,0,0);
  const diff=Math.max(0,Math.floor((today-last)/86400000));
  if(user.stage==="pre"||(user.stage==="peri"&&diff<90)){
    const cl=parseInt(user.cycleLength)||28;
    const d=(diff%cl)+1;
    const phase=d<=5?"menstrual":d<=13?"follicular":d<=16?"ovulation":d<=cl-5?"luteal":"late_luteal";
    return{phase,day:d,total:cl};
  }
  const ref=new Date("2025-01-29");
  const ld=Math.floor((Math.floor((today-ref)/86400000))%29.53)+1;
  return{phase:ld<=7?"new_moon":ld<=15?"waxing":ld<=22?"full_moon":"waning",day:ld,total:30};
}

function phaseForDate(date,user){
  if(!user||!user.lastPeriod)return"follicular";
  const d=new Date(date);d.setHours(0,0,0,0);
  const last=new Date(user.lastPeriod);last.setHours(0,0,0,0);
  const diff=Math.floor((d-last)/86400000);
  if(diff<0)return null;
  if(user.stage==="pre"||(user.stage==="peri"&&diff<90)){
    const cl=parseInt(user.cycleLength)||28;
    const day=(diff%cl)+1;
    return day<=5?"menstrual":day<=13?"follicular":day<=16?"ovulation":day<=cl-5?"luteal":"late_luteal";
  }
  const ref=new Date("2025-01-29");
  const ld=Math.floor((Math.floor((d-ref)/86400000))%29.53)+1;
  return ld<=7?"new_moon":ld<=15?"waxing":ld<=22?"full_moon":"waning";
}

// ── ORBITAL RING ──────────────────────────────────────────
function OrbitalRing({phase,day,total,stage,th}){
  const cx=120,cy=120,r=88,sw=11;
  const segs=(stage==="pre"||stage==="peri")
    ?[{k:"menstrual",d:5},{k:"follicular",d:8},{k:"ovulation",d:3},{k:"luteal",d:Math.max(2,total-21)},{k:"late_luteal",d:5}]
    :[{k:"new_moon",d:7},{k:"waxing",d:8},{k:"full_moon",d:7},{k:"waning",d:7.5}];
  const tot=segs.reduce((a,b)=>a+b.d,0);
  let cur=0;
  const arcs=segs.map(s=>{const sw2=(s.d/tot)*360;const start=cur,end=cur+sw2-1.5;cur+=sw2;return{...s,start,end};});
  const dot=pToC(cx,cy,r,((day-1)/total)*360);
  const color=PC[phase];
  return(
    <svg width="240" height="240" viewBox="0 0 240 240" style={{overflow:"visible"}}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={th.border} strokeWidth={sw}/>
      {arcs.map(a=><path key={a.k} d={arcD(cx,cy,r,a.start,a.end)} fill="none" stroke={PC[a.k]} strokeWidth={sw} strokeLinecap="round" opacity={a.k===phase?1:0.22}/>)}
      <circle cx={dot.x} cy={dot.y} r={14} fill={color} opacity={0.18}/>
      <circle cx={dot.x} cy={dot.y} r={7} fill={th.surface} stroke={color} strokeWidth={2.5}/>
      <text x={cx} y={cy-8} textAnchor="middle" fontSize="40" fontWeight="500" fill={th.text} fontFamily="'Playfair Display',Georgia,serif">{day}</text>
      <text x={cx} y={cy+18} textAnchor="middle" fontSize="13" fill={th.muted} fontFamily="'DM Sans',sans-serif">/ {total}</text>
    </svg>
  );
}

// ── REC CARD ──────────────────────────────────────────────
function RecCard({icon,label,tip,warn,cal,src,color,th,t}){
  return(
    <div style={{background:th.surface,borderRadius:20,padding:"18px 20px",border:`1px solid ${th.border}`,marginBottom:10}}>
      <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:10}}>
        <span style={{color,display:"flex"}}>{icon}</span>
        <span style={{fontSize:13,fontWeight:600,color,letterSpacing:.4,fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase"}}>{label}</span>
      </div>
      <p style={{fontSize:14,color:th.text,lineHeight:1.65,margin:0,fontFamily:"'DM Sans',sans-serif"}}>{tip}</p>
      {warn&&<div style={{marginTop:10,padding:"8px 12px",background:`${color}18`,borderRadius:10,fontSize:12,color,fontWeight:500,fontFamily:"'DM Sans',sans-serif"}}>{warn}</div>}
      {cal&&<div style={{marginTop:8,padding:"8px 12px",background:th.border,borderRadius:10,fontSize:12,color:th.muted,fontFamily:"'DM Sans',sans-serif"}}>📅 {cal}</div>}
      {src&&<div style={{marginTop:9,fontSize:11,color:th.muted,fontFamily:"'DM Sans',sans-serif",opacity:.8}}>↗ {t.source}: {src}</div>}
    </div>
  );
}

// ── MINI CALENDAR ─────────────────────────────────────────
function MiniCalendar({user,th,t}){
  const now=new Date();
  const[ym,setYm]=useState({y:now.getFullYear(),m:now.getMonth()});
  const{y,m}=ym;
  const daysIn=new Date(y,m+1,0).getDate();
  const firstDow=new Date(y,m,1).getDay();
  const todayD=now.getDate(),todayM=now.getMonth(),todayY=now.getFullYear();
  const cells=[];
  for(let i=0;i<firstDow;i++)cells.push(null);
  for(let d=1;d<=daysIn;d++)cells.push(d);
  return(
    <div style={{background:th.surface,borderRadius:20,padding:"18px 16px",border:`1px solid ${th.border}`}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
        <button onClick={()=>setYm(v=>v.m===0?{y:v.y-1,m:11}:{y:v.y,m:v.m-1})} style={{background:"none",border:"none",color:th.muted,cursor:"pointer",fontSize:18}}>‹</button>
        <span style={{fontSize:15,fontWeight:500,color:th.text,fontFamily:"'Playfair Display',Georgia,serif"}}>{t.monthNames[m]} {y}</span>
        <button onClick={()=>setYm(v=>v.m===11?{y:v.y+1,m:0}:{y:v.y,m:v.m+1})} style={{background:"none",border:"none",color:th.muted,cursor:"pointer",fontSize:18}}>›</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:6}}>
        {t.dayNames.map(d=><div key={d} style={{textAlign:"center",fontSize:10,color:th.muted,fontWeight:500,fontFamily:"'DM Sans',sans-serif"}}>{d}</div>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
        {cells.map((d,i)=>{
          if(!d)return<div key={`e${i}`}/>;
          const phase=phaseForDate(new Date(y,m,d),user);
          const isT=d===todayD&&m===todayM&&y===todayY;
          return<div key={d} style={{height:32,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:8,fontSize:12,background:phase?(isT?PC[phase]:`${PC[phase]}28`):"transparent",color:isT?"#fff":phase?th.text:th.muted,fontWeight:isT?600:400,fontFamily:"'DM Sans',sans-serif",border:isT?`2px solid ${PC[phase]}`:"2px solid transparent"}}>{d}</div>;
        })}
      </div>
    </div>
  );
}

// ── SHARE VIEW ────────────────────────────────────────────
function ShareView({user,lang,t,th,onBack}){
  const pd=useMemo(()=>calcPhase(user),[user]);
  const{phase,day,total}=pd;
  const color=PC[phase];
  const phaseInfo=t.phases[phase];
  const rec=t.rec[RMAP[phase]||"follicular"];
  const[copied,setCopied]=useState(false);
  const today=new Date();
  const dateStr=today.toLocaleDateString(lang==="tr"?"tr-TR":"en-GB",{weekday:"long",day:"numeric",month:"long"});

  const shareText=lang==="tr"
    ?`🌊 marea — ${dateStr}\n\n${phaseInfo.n} · Gün ${day}/${total}\n${phaseInfo.s}\n\n${rec.soc.tip}${rec.soc.warn?"\n\n"+rec.soc.warn:""}${rec.soc.cal?"\n📅 "+rec.soc.cal:""}\n\n${t.share.footer}`
    :`🌊 marea — ${dateStr}\n\n${phaseInfo.n} · Day ${day}/${total}\n${phaseInfo.s}\n\n${rec.soc.tip}${rec.soc.warn?"\n\n"+rec.soc.warn:""}${rec.soc.cal?"\n📅 "+rec.soc.cal:""}\n\n${t.share.footer}`;

  const handleShare=async()=>{
    if(navigator.share){try{await navigator.share({text:shareText,title:"marea"});}catch(e){}}
    else{try{await navigator.clipboard.writeText(shareText);setCopied(true);setTimeout(()=>setCopied(false),2500);}catch(e){}}
  };

  return(
    <div style={{padding:"20px 16px 24px"}}>
      <button onClick={onBack} style={{background:"none",border:"none",color:th.muted,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:14,fontFamily:"'DM Sans',sans-serif",padding:0,marginBottom:24}}>
        <ArrowLeft size={18}/>
      </button>
      <div style={{fontSize:22,fontWeight:500,color:th.text,fontFamily:"'Playfair Display',Georgia,serif",marginBottom:4}}>{t.share.title}</div>
      <div style={{fontSize:13,color:th.muted,marginBottom:24,fontFamily:"'DM Sans',sans-serif",lineHeight:1.5}}>{t.share.sub}</div>

      {/* Preview card */}
      <div style={{borderRadius:24,padding:"28px 24px",background:`${color}0E`,border:`1.5px solid ${color}35`,marginBottom:24}}>
        <div style={{fontSize:12,color:color,fontWeight:600,letterSpacing:.5,fontFamily:"'DM Sans',sans-serif",marginBottom:16,textTransform:"uppercase"}}>🌊 marea · {dateStr}</div>
        <div style={{fontSize:38,fontWeight:500,color,fontFamily:"'Playfair Display',Georgia,serif",letterSpacing:-.5,marginBottom:4}}>{phaseInfo.n}</div>
        <div style={{fontSize:14,color:th.muted,fontFamily:"'DM Sans',sans-serif",marginBottom:20}}>{t.day} {day}/{total} · {phaseInfo.s}</div>
        <div style={{fontSize:15,color:th.text,lineHeight:1.7,fontFamily:"'DM Sans',sans-serif",marginBottom:rec.soc.warn?16:0}}>{rec.soc.tip}</div>
        {rec.soc.warn&&<div style={{padding:"12px 14px",background:`${color}20`,borderRadius:12,fontSize:13,color,fontWeight:500,fontFamily:"'DM Sans',sans-serif"}}>{rec.soc.warn}</div>}
        {rec.soc.cal&&<div style={{marginTop:10,padding:"10px 14px",background:th.surface,borderRadius:12,fontSize:12,color:th.muted,fontFamily:"'DM Sans',sans-serif"}}>📅 {rec.soc.cal}</div>}
        <div style={{marginTop:20,fontSize:12,color:th.muted,fontFamily:"'DM Sans',sans-serif"}}>{t.share.footer}</div>
      </div>

      <button onClick={handleShare} style={{width:"100%",padding:"16px",borderRadius:16,background:color,color:"#fff",border:"none",fontSize:16,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
        <Share2 size={18}/>
        {copied?t.share.copied:(navigator.share?t.share.btn:t.share.copy)}
      </button>
    </div>
  );
}

// ── ONBOARDING ───────────────────────────────────────────
function Onboarding({lang,setLang,theme,setTheme,onDone}){
  const[step,setStep]=useState(0);
  const[name,setName]=useState("");
  const[stage,setStage]=useState("");
  const[lastPeriod,setLastPeriod]=useState("");
  const[cycleLength,setCycleLength]=useState("28");
  const[stepConn,setStepConn]=useState({manual:true});
  const t=C[lang];
  const th=TH[theme];
  const today=new Date().toISOString().split("T")[0];

  const isLunarStage=(s)=>s==="meno"||s==="post"||s==="dont_know";

  const finish=()=>{
    const lp=isLunarStage(stage)
      ?new Date(Date.now()-400*86400000).toISOString().split("T")[0]
      :(lastPeriod||today);
    onDone({name:name||"—",stage:stage||"dont_know",lastPeriod:lp,cycleLength:parseInt(cycleLength)||28});
  };

  const bg=th.bg,surface=th.surface,border=th.border,text=th.text,muted=th.muted;

  const inputStyle={width:"100%",padding:"14px 16px",borderRadius:14,border:`1.5px solid ${border}`,background:surface,color:text,fontSize:16,fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box"};
  const btnPrimary=(col)=>({width:"100%",padding:"16px",borderRadius:16,border:"none",background:col||text,color:col?"#fff":bg,fontSize:16,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"});
  const btnGhost={width:"100%",padding:"13px",borderRadius:16,border:`1px solid ${border}`,background:"transparent",color:muted,fontSize:14,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"};

  const navRow=(backStep,skipStep)=>(
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
      <button onClick={()=>setStep(backStep)} style={{background:"none",border:"none",color:muted,cursor:"pointer",display:"flex",alignItems:"center",padding:0,fontSize:14,fontFamily:"'DM Sans',sans-serif"}}>
        <ArrowLeft size={18}/>
      </button>
      {skipStep!=null&&(
        <button onClick={()=>skipStep==="finish"?finish():setStep(skipStep)} style={{background:"none",border:"none",color:muted,cursor:"pointer",fontSize:14,fontFamily:"'DM Sans',sans-serif",padding:0,textDecoration:"underline",textUnderlineOffset:3}}>
          {t.ob.skip}
        </button>
      )}
    </div>
  );

  const wrap=(children)=>(
    <div style={{minHeight:"100vh",background:bg,display:"flex",flexDirection:"column",justifyContent:"center",padding:"32px 24px",maxWidth:430,margin:"0 auto"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600&display=swap');`}</style>
      {children}
    </div>
  );

  // Step 0 — Language
  if(step===0)return wrap(<>
    <div style={{textAlign:"center",marginBottom:48}}>
      <div style={{fontSize:32,fontWeight:500,color:text,fontFamily:"'Playfair Display',Georgia,serif",letterSpacing:-1}}>marea</div>
      <div style={{fontSize:13,color:muted,marginTop:6,fontFamily:"'DM Sans',sans-serif"}}>Döngünle yaşa · Live with your cycle</div>
    </div>
    <div style={{display:"flex",gap:12,marginBottom:40}}>
      {["tr","en"].map(l=>(
        <button key={l} onClick={()=>{setLang(l);setStep(1);}} style={{flex:1,padding:"18px",borderRadius:16,border:`2px solid ${lang===l?text:border}`,background:lang===l?text:surface,color:lang===l?bg:text,fontSize:15,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
          {l==="tr"?"🇹🇷  Türkçe":"🇬🇧  English"}
        </button>
      ))}
    </div>
    <button onClick={()=>setTheme(t=>t==="light"?"dark":"light")} style={{...btnGhost,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
      {theme==="light"?<Moon size={16}/>:<Sun size={16}/>}
      {theme==="light"?"Dark mode":"Light mode"}
    </button>
  </>);

  // Step 1 — Name
  if(step===1)return wrap(<>
    <div style={{marginBottom:40}}>
      <div style={{fontSize:34,fontWeight:500,color:text,fontFamily:"'Playfair Display',Georgia,serif",lineHeight:1.2}}>{t.ob.hi}</div>
      <div style={{fontSize:15,color:muted,marginTop:10,fontFamily:"'DM Sans',sans-serif",lineHeight:1.6}}>{t.ob.hi2}</div>
    </div>
    <div style={{marginBottom:24}}>
      <div style={{fontSize:14,color:muted,marginBottom:10,fontFamily:"'DM Sans',sans-serif"}}>{t.ob.nameQ}</div>
      <input style={inputStyle} placeholder={t.ob.namePh} value={name} onChange={e=>setName(e.target.value)}/>
    </div>
    <button onClick={()=>setStep(2)} style={btnPrimary()}>{t.ob.next} →</button>
  </>);

  // Step 2 — Stage
  if(step===2)return wrap(<>
    {navRow(1,4)}
    <div style={{fontSize:26,fontWeight:500,color:text,fontFamily:"'Playfair Display',Georgia,serif",marginBottom:28,lineHeight:1.3}}>{t.ob.stageQ}</div>
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {Object.entries(t.stages).map(([k,v])=>(
        <button key={k} onClick={()=>{setStage(k);isLunarStage(k)?setStep(4):setStep(3);}} style={{padding:"18px 20px",borderRadius:16,border:`1.5px solid ${stage===k?text:border}`,background:stage===k?`${text}10`:surface,color:text,textAlign:"left",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:15,fontWeight:500,marginBottom:3}}>{v.l}</div>
            <div style={{fontSize:13,color:muted}}>{v.d}</div>
          </div>
          {stage===k&&<Check size={18} color={text}/>}
        </button>
      ))}
    </div>
  </>);

  // Step 3 — Cycle data
  if(step===3)return wrap(<>
    {navRow(2,4)}
    <div style={{fontSize:26,fontWeight:500,color:text,fontFamily:"'Playfair Display',Georgia,serif",marginBottom:28}}>{t.ob.periodQ}</div>
    <input type="date" style={{...inputStyle,marginBottom:24}} max={today} value={lastPeriod} onChange={e=>setLastPeriod(e.target.value)}/>
    <div style={{fontSize:14,color:muted,marginBottom:10,fontFamily:"'DM Sans',sans-serif"}}>{t.ob.cycleQ}</div>
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:32}}>
      <button onClick={()=>setCycleLength(v=>Math.max(21,parseInt(v)-1).toString())} style={{width:44,height:44,borderRadius:12,border:`1px solid ${border}`,background:surface,color:text,fontSize:20,cursor:"pointer"}}>−</button>
      <div style={{flex:1,textAlign:"center",fontSize:28,fontWeight:500,color:text,fontFamily:"'Playfair Display',serif"}}>{cycleLength}</div>
      <button onClick={()=>setCycleLength(v=>Math.min(45,parseInt(v)+1).toString())} style={{width:44,height:44,borderRadius:12,border:`1px solid ${border}`,background:surface,color:text,fontSize:20,cursor:"pointer"}}>+</button>
    </div>
    <button onClick={()=>setStep(4)} style={{...btnPrimary(),opacity:lastPeriod?1:.5}} disabled={!lastPeriod}>{t.ob.next} →</button>
  </>);

  // Step 4 — Connect
  const connItems=[
    {k:"google",icon:<Globe2 size={20}/>,color:"#4285F4"},
    {k:"apple", icon:<Smartphone size={20}/>, color:"#555"},
    {k:"import",icon:<Upload size={20}/>,color:"#7A9E7A"},
    {k:"manual",icon:<PenLine size={20}/>,color:muted},
  ];
  if(step===4)return wrap(<>
    {navRow(isLunarStage(stage)?2:3,null)}
    <div style={{fontSize:26,fontWeight:500,color:text,fontFamily:"'Playfair Display',Georgia,serif",marginBottom:6}}>{t.ob.connectQ}</div>
    <div style={{fontSize:13,color:muted,marginBottom:24,fontFamily:"'DM Sans',sans-serif"}}>{t.conn.sub}</div>
    {connItems.map(({k,icon,color})=>(
      <div key={k} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 18px",borderRadius:16,border:`1px solid ${stepConn[k]?`${color}55`:border}`,background:surface,marginBottom:10}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <span style={{color}}>{icon}</span>
          <div>
            <div style={{fontSize:14,fontWeight:500,color:text,fontFamily:"'DM Sans',sans-serif"}}>{t.conn[k].n}</div>
            <div style={{fontSize:12,color:muted,fontFamily:"'DM Sans',sans-serif"}}>{t.conn[k].d}</div>
          </div>
        </div>
        {stepConn[k]
          ?<div style={{display:"flex",alignItems:"center",gap:4,fontSize:12,color:"#7A9E7A",fontWeight:500,fontFamily:"'DM Sans',sans-serif"}}><Check size={14}/>{t.conn.connected}</div>
          :<button onClick={()=>setStepConn(c=>({...c,[k]:true}))} style={{padding:"8px 14px",borderRadius:10,border:`1px solid ${border}`,background:"transparent",color:text,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap"}}>{t.conn[k].btn}</button>
        }
      </div>
    ))}
    <button onClick={finish} style={{...btnPrimary(),marginTop:20}}>{t.ob.start} →</button>
    <button onClick={finish} style={{...btnGhost,marginTop:10}}>{t.ob.later}</button>
  </>);

  return null;
}

// ── DASHBOARD ─────────────────────────────────────────────
function DashboardScreen({user,lang,setLang,theme,setTheme,t,th,setScreen}){
  const pd=useMemo(()=>calcPhase(user),[user]);
  const{phase,day,total}=pd;
  const color=PC[phase];
  const phaseInfo=t.phases[phase];
  const rec=t.rec[RMAP[phase]||"follicular"];
  const today=new Date();
  return(
    <div style={{paddingBottom:16}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px 12px"}}>
        <div>
          <span style={{fontSize:22,fontWeight:500,color:th.text,fontFamily:"'Playfair Display',Georgia,serif"}}>
            {user.name&&user.name!=="—"?user.name:t.app}
          </span>
          <div style={{fontSize:12,color:th.muted,fontFamily:"'DM Sans',sans-serif",marginTop:1}}>
            {today.toLocaleDateString(lang==="tr"?"tr-TR":"en-GB",{weekday:"long",day:"numeric",month:"long"})}
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setScreen("share")} style={{width:36,height:36,borderRadius:10,border:`1px solid ${th.border}`,background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:th.muted}} title={t.share.btn}>
            <Share2 size={15}/>
          </button>
          <button onClick={()=>setLang(l=>l==="tr"?"en":"tr")} style={{width:36,height:36,borderRadius:10,border:`1px solid ${th.border}`,background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:th.muted}}>
            <Globe2 size={15}/>
          </button>
          <button onClick={()=>setTheme(t=>t==="light"?"dark":"light")} style={{width:36,height:36,borderRadius:10,border:`1px solid ${th.border}`,background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:th.muted}}>
            {theme==="light"?<Moon size={15}/>:<Sun size={15}/>}
          </button>
        </div>
      </div>

      <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"20px 0 12px"}}>
        <OrbitalRing phase={phase} day={day} total={total} stage={user.stage} th={th}/>
        <div style={{textAlign:"center",marginTop:4}}>
          <div style={{fontSize:28,fontWeight:500,color,fontFamily:"'Playfair Display',Georgia,serif",letterSpacing:-.5}}>{phaseInfo.n}</div>
          <div style={{fontSize:14,color:th.muted,marginTop:3,fontFamily:"'DM Sans',sans-serif"}}>{phaseInfo.s}</div>
        </div>
        {(user.stage==="meno"||user.stage==="post"||user.stage==="dont_know")&&(
          <div style={{marginTop:10,padding:"6px 14px",borderRadius:20,border:`1px solid ${th.border}`,fontSize:11,color:th.muted,fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:4}}>
            <Info size={10}/>
            {lang==="tr"?"Ay döngüsü ritimsel çerçeve olarak kullanılmaktadır":"Lunar cycle used as rhythmic planning framework"}
          </div>
        )}
      </div>

      <div style={{padding:"0 16px"}}>
        <RecCard icon={<Leaf size={16}/>} label={lang==="tr"?"Beslenme":"Nutrition"} tip={rec.nut.tip} warn={rec.nut.warn} src={rec.nut.src} color={color} th={th} t={t}/>
        <RecCard icon={<Zap size={16}/>} label={lang==="tr"?"Hareket":"Movement"} tip={rec.mov.tip} warn={rec.mov.warn} src={rec.mov.src} color={color} th={th} t={t}/>
        <RecCard icon={<Users size={16}/>} label={lang==="tr"?"Sosyal":"Social"} tip={rec.soc.tip} warn={rec.soc.warn} cal={rec.soc.cal} src={null} color={color} th={th} t={t}/>
      </div>
      <div style={{padding:"8px 16px 0"}}><MiniCalendar user={user} th={th} t={t}/></div>
      <div style={{padding:"14px 20px",fontSize:11,color:th.muted,textAlign:"center",fontFamily:"'DM Sans',sans-serif",lineHeight:1.5}}>{t.conn.dis}</div>
    </div>
  );
}

// ── CONNECT SCREEN ────────────────────────────────────────
function ConnectScreen({lang,t,th}){
  const[connected,setConnected]=useState({manual:true});
  const items=[
    {k:"google",icon:<Globe2 size={22}/>,color:"#4285F4",steps:null},
    {k:"apple", icon:<Smartphone size={22}/>, color:"#555",steps:lang==="tr"?["iPhone'unda Kısayollar uygulamasını aç","marea'nın gönderdiği .shortcut dosyasını ekle","Günlük otomatik sync çalışır"]:["Open Shortcuts app on iPhone","Add the .shortcut file marea provides","Daily auto-sync runs in background"]},
    {k:"import",icon:<Upload size={22}/>,color:"#7A9E7A",steps:lang==="tr"?["Flo / Clue → Ayarlar → Veriyi Dışa Aktar","CSV dosyasını buradan yükle"]:["Flo / Clue → Settings → Export Data","Upload the CSV file here"]},
    {k:"manual",icon:<PenLine size={22}/>,color:th.muted,steps:null},
  ];
  return(
    <div style={{padding:"20px 16px 16px"}}>
      <div style={{fontSize:24,fontWeight:500,color:th.text,fontFamily:"'Playfair Display',Georgia,serif",marginBottom:6}}>{t.conn.title}</div>
      <div style={{fontSize:13,color:th.muted,marginBottom:24,fontFamily:"'DM Sans',sans-serif"}}>{t.conn.sub}</div>
      {items.map(({k,icon,color,steps})=>(
        <div key={k} style={{borderRadius:18,border:`1px solid ${th.border}`,background:th.surface,marginBottom:12,overflow:"hidden"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"18px"}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:42,height:42,borderRadius:12,background:`${color}15`,display:"flex",alignItems:"center",justifyContent:"center",color}}>{icon}</div>
              <div>
                <div style={{fontSize:15,fontWeight:500,color:th.text,fontFamily:"'DM Sans',sans-serif"}}>{t.conn[k].n}</div>
                <div style={{fontSize:12,color:th.muted,fontFamily:"'DM Sans',sans-serif"}}>{t.conn[k].d}</div>
              </div>
            </div>
            {connected[k]
              ?<div style={{display:"flex",alignItems:"center",gap:4,fontSize:13,color:"#7A9E7A",fontWeight:500,fontFamily:"'DM Sans',sans-serif"}}><Check size={16}/>{t.conn.connected}</div>
              :<button onClick={()=>setConnected(c=>({...c,[k]:true}))} style={{padding:"9px 16px",borderRadius:10,border:`1px solid ${th.border}`,background:"transparent",color:th.text,fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{t.conn[k].btn}</button>
            }
          </div>
          {steps&&<div style={{padding:"0 18px 16px",borderTop:`1px solid ${th.border}`}}>
            {steps.map((s,i)=><div key={i} style={{display:"flex",gap:10,marginTop:10,fontSize:11,color:th.muted,fontFamily:"'DM Sans',sans-serif"}}>
              <span style={{fontWeight:600,minWidth:14}}>{i+1}.</span><span>{s}</span>
            </div>)}
          </div>}
        </div>
      ))}
      <div style={{marginTop:8,padding:"14px 16px",borderRadius:14,background:th.border,fontSize:11,color:th.muted,fontFamily:"'DM Sans',sans-serif",lineHeight:1.6}}>{t.conn.note}</div>
    </div>
  );
}

// ── BOTTOM NAV ────────────────────────────────────────────
function BottomNav({screen,setScreen,t,th,user}){
  const pd=calcPhase(user);
  const activeColor=PC[pd.phase];
  const tabs=[
    {k:"dashboard",icon:<Sun size={20}/>,label:t.nav.today},
    {k:"calendar", icon:<CalendarDays size={20}/>,label:t.nav.calendar},
    {k:"connect",  icon:<Link2 size={20}/>,label:t.nav.connect},
  ];
  return(
    <div style={{display:"flex",borderTop:`1px solid ${th.border}`,background:th.nav,padding:"8px 0 4px"}}>
      {tabs.map(tab=>{
        const active=screen===tab.k;
        return<button key={tab.k} onClick={()=>setScreen(tab.k)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,background:"none",border:"none",cursor:"pointer",padding:"6px 0",color:active?activeColor:th.muted,fontFamily:"'DM Sans',sans-serif"}}>
          {tab.icon}
          <span style={{fontSize:11,fontWeight:active?500:400}}>{tab.label}</span>
        </button>;
      })}
    </div>
  );
}

// ── CALENDAR SCREEN ───────────────────────────────────────
function CalendarScreen({user,t,th}){
  const now=new Date();
  const months=[-1,0,1].map(offset=>{
    let m=now.getMonth()+offset,y=now.getFullYear();
    if(m<0){m=11;y--;}if(m>11){m=0;y++;}
    return{y,m};
  });
  const todayD=now.getDate(),todayM=now.getMonth(),todayY=now.getFullYear();
  const legend=[["menstrual","follicular","ovulation"],["luteal","late_luteal"]].flat();
  return(
    <div style={{padding:"20px 16px 16px"}}>
      <div style={{fontSize:24,fontWeight:500,color:th.text,fontFamily:"'Playfair Display',Georgia,serif",marginBottom:16}}>{t.nav.calendar}</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:"8px 14px",marginBottom:20}}>
        {legend.map(k=><div key={k} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:th.muted,fontFamily:"'DM Sans',sans-serif"}}>
          <div style={{width:10,height:10,borderRadius:"50%",background:PC[k]}}/>
          {t.phases[k].n}
        </div>)}
      </div>
      {months.map(({y,m})=>{
        const daysIn=new Date(y,m+1,0).getDate();
        const firstDow=new Date(y,m,1).getDay();
        const cells=[];
        for(let i=0;i<firstDow;i++)cells.push(null);
        for(let d=1;d<=daysIn;d++)cells.push(d);
        return<div key={`${y}-${m}`} style={{marginBottom:24,background:th.surface,borderRadius:20,padding:"16px 14px",border:`1px solid ${th.border}`}}>
          <div style={{fontSize:15,fontWeight:500,color:th.text,fontFamily:"'Playfair Display',Georgia,serif",marginBottom:12}}>{t.monthNames[m]} {y}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:6}}>
            {t.dayNames.map(d=><div key={d} style={{textAlign:"center",fontSize:10,color:th.muted,fontWeight:500}}>{d}</div>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
            {cells.map((d,i)=>{
              if(!d)return<div key={`e${i}`}/>;
              const phase=phaseForDate(new Date(y,m,d),user);
              const isT=d===todayD&&m===todayM&&y===todayY;
              return<div key={d} style={{height:32,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:8,fontSize:12,background:phase?(isT?PC[phase]:`${PC[phase]}28`):"transparent",color:isT?"#fff":phase?th.text:th.muted,fontWeight:isT?600:400,border:isT?`2px solid ${PC[phase]}`:"2px solid transparent",fontFamily:"'DM Sans',sans-serif"}}>{d}</div>;
            })}
          </div>
        </div>;
      })}
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────
export default function Marea(){
  const[screen,setScreen]=useState("onboard");
  const[user,setUser]=useState(null);
  const[lang,setLang]=useState("tr");
  const[theme,setTheme]=useState(()=>typeof window!=="undefined"&&window.matchMedia?.("(prefers-color-scheme: dark)").matches?"dark":"light");
  const t=C[lang];
  const th=TH[theme];

  if(screen==="onboard"){
    return(
      <div style={{fontFamily:"'DM Sans',sans-serif"}}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600&display=swap');`}</style>
        <Onboarding lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} onDone={u=>{setUser(u);setScreen("dashboard");}}/>
      </div>
    );
  }

  const showNav=screen!=="share";

  return(
    <div style={{background:th.bg,maxWidth:430,margin:"0 auto",minHeight:"100vh",fontFamily:"'DM Sans',sans-serif",display:"flex",flexDirection:"column"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600&display=swap');`}</style>
      <div style={{flex:1,overflowY:"auto"}}>
        {screen==="dashboard"&&<DashboardScreen user={user} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} t={t} th={th} setScreen={setScreen}/>}
        {screen==="calendar" &&<CalendarScreen user={user} t={t} th={th}/>}
        {screen==="connect"  &&<ConnectScreen lang={lang} t={t} th={th}/>}
        {screen==="share"    &&<ShareView user={user} lang={lang} t={t} th={th} onBack={()=>setScreen("dashboard")}/>}
      </div>
      {showNav&&<BottomNav screen={screen} setScreen={setScreen} t={t} th={th} user={user}/>}
    </div>
  );
}
