(function(){
  'use strict';
  const DATA=window.SS_DATA;
  const path=location.pathname;
  const parts=path.split('/').filter(Boolean);
  const repoIndex=parts.indexOf('sleeping-stars-v2');
  const basePath=repoIndex>=0?'/'+parts.slice(0,repoIndex+1).join('/')+'/':'/';
  const locale=parts.includes('en')?'en':parts.includes('ko')?'ko':'ja';
  const L=DATA.locales[locale],C=DATA.common,U=L.ui;
  const $=id=>document.getElementById(id);
  const fill=(s,v)=>s.replace(/\{(\w+)\}/g,(_,k)=>v[k]??'');
  let round=0,resultPrimary=5,lastMetrics=null;
  const selected=new Map();

  function setText(id,text){$(id).textContent=text}
  function setMultiline(id,text){$(id).innerHTML=text.split('\n').map(x=>escapeHtml(x)).join('<br>')}
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function show(id){document.body.dataset.screen=id;document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===id));scrollTo(0,0)}
  function localizedType(type){const d=L.types[type],ch=C.characters[type];return {name:d[0],attract:d[1],value:d[2],tired:d[3],hint:d[4],tie:d[5],family:ch.family[locale],parent:ch.parent,kid:ch.kid}}

  function localize(){
    document.documentElement.lang=L.meta.lang;document.title=L.meta.title;
    document.querySelector('meta[name="description"]').content=L.meta.description;
    setText('subhead',U.subhead);setText('lead',U.lead);setText('detail',U.detail);$('introArt').alt=U.introAlt;
    $('meta').innerHTML=U.meta.map(x=>`<span>${escapeHtml(x)}</span>`).join('');setText('start',U.start);setMultiline('notice',U.notice);
    setText('choiceGuide',U.choiceGuide);setText('counterLabel',U.found+'：');setText('back',U.back);
    setText('resultBrand',U.resultBrand);setText('pickedTitle',U.picked);U.insights.forEach((x,i)=>setText('insight'+i,x));setText('overlapTitle',U.overlap);
    setText('familyLead',U.familyLead);setText('saveTitle',U.saveTitle);setText('saveLead',U.saveLead);setText('saveWallpaper',U.wallpaper);setText('saveShare',U.share);
    setMultiline('paidLead',U.paidLead);setText('paidLink',U.paid);$('paidLink').href=C.paidUrl;setText('storyLead',U.storyLead);setText('storyLink',U.story);setText('storySource',U.storySource);$('storyLink').href=C.articleUrls[locale];setText('restart',U.restart);
    setText('tieBrand',U.tieBrand);setText('tieTitle',U.tieTitle);setText('tieLead',U.tieLead);
    document.querySelectorAll('[data-lang]').forEach(a=>a.setAttribute('aria-current',a.dataset.lang===locale?'page':'false'));
  }

  function fieldItems(index){
    const words=L.fields[index][1],shift=C.rotations[index];
    return Array.from({length:9},(_,pos)=>{const type=((pos+shift)%9)+1;return [type,words[type-1]]});
  }

  function render(){
    const field=L.fields[round];setText('step',`STAR FIELD ${round+1} / 8`);$('bar').style.width=`${(round+1)/8*100}%`;setText('fieldTitle',field[0]);$('words').innerHTML='';
    fieldItems(round).forEach(([type,text])=>{const key=`${round}-${type}`,b=document.createElement('button');b.className='word';b.textContent=text;b.setAttribute('aria-pressed',String(selected.has(key)));b.onclick=()=>{if(selected.has(key))selected.delete(key);else{const n=[...selected.keys()].filter(k=>k.startsWith(round+'-')).length;if(n>=3)return;selected.set(key,{round,type,text})}render()};$('words').appendChild(b)});
    setText('count',String(selected.size));$('back').style.visibility=round?'visible':'hidden';setText('next',round===7?U.see:U.next);$('next').disabled=!fieldItems(round).some(([t])=>selected.has(`${round}-${t}`));
  }

  function calculate(){
    const m={};for(let t=1;t<=9;t++)m[t]={type:t,score:0,solo:0,focus:0};
    for(let r=0;r<8;r++){const picks=[...selected.values()].filter(v=>v.round===r);const points=picks.length?6/picks.length:0;picks.forEach(v=>{m[v.type].score+=points;if(picks.length===1)m[v.type].solo++;if(r>=6)m[v.type].focus+=points})}
    const cmp=(a,b)=>b.score-a.score||b.solo-a.solo||b.focus-a.focus;
    const ranked=Object.values(m).sort(cmp),top=ranked[0],tied=ranked.filter(x=>x.score===top.score&&x.solo===top.solo&&x.focus===top.focus);
    return {m,ranked,tied};
  }

  function beginResults(){
    lastMetrics=calculate();
    if(lastMetrics.tied.length>1){$('tieChoices').innerHTML='';lastMetrics.tied.forEach(x=>{const t=localizedType(x.type),b=document.createElement('button');b.className='word tie-word';b.textContent=t.tie;b.onclick=()=>finishResults(x.type);$('tieChoices').appendChild(b)});show('tie');return}
    finishResults(lastMetrics.ranked[0].type);
  }

  function finishResults(first){
    const second=lastMetrics.ranked.find(x=>x.type!==first).type,T=localizedType(first),S=localizedType(second);resultPrimary=first;
    setText('resultType',`Type ${first}`);setText('resultName',T.name);$('constellation').innerHTML=constellationSvg(first);$('constellation').setAttribute('aria-label',U.constellationLabel);
    $('picked').innerHTML=[...selected.values()].sort((a,b)=>a.round-b.round).map(v=>`<span>${escapeHtml(v.text)}</span>`).join('');setText('attract',T.attract);setText('value',T.value);setText('tired',T.tired);setText('hintText',T.hint);
    setText('blend',fill(L.blend,{first,firstName:T.name,second,secondName:S.name}));$('parentImage').src=`${basePath}img/${T.parent}`;$('parentImage').alt=fill(U.parentAlt,{type:first});$('kidImage').src=`${basePath}img/${T.kid}`;$('kidImage').alt=fill(U.kidAlt,{type:first});setText('familyName',T.family);setText('familyType',fill(U.familyType,{type:first}));show('result');
  }

  function constellationSvg(type){
    const d=C.constellations[type],offset=[42,64];
    const lines=d.paths.map(p=>`<polyline class="official-line" points="${p.map(q=>q[0]+offset[0]+','+(q[1]+offset[1])).join(' ')}"/>`).join('');
    const fade=d.fade?`<path class="official-fade" d="M ${d.fade[0][0]+offset[0]} ${d.fade[0][1]+offset[1]} Q ${d.fade[1][0]+offset[0]} ${d.fade[1][1]+offset[1]} ${d.fade[2][0]+offset[0]} ${d.fade[2][1]+offset[1]}"/>`:'';
    const ambient=C.ambient.map(q=>`<circle class="star-d" cx="${q[0]+20}" cy="${q[1]+55}" r="1.55"/>`).join('');
    const stars=d.stars.map(q=>`<circle class="star-${q[2]}" cx="${q[0]+offset[0]}" cy="${q[1]+offset[1]}" r="${{a:5.8,b:4.5,c:3.1,d:1.55}[q[2]]}"/>`).join('');
    return `<svg viewBox="0 0 345 350" role="img" aria-hidden="true"><defs><linearGradient id="officialFade" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#b9cae0" stop-opacity=".28"/><stop offset="1" stop-color="#b9cae0" stop-opacity="0"/></linearGradient></defs>${ambient}${lines}${fade}${stars}</svg>`;
  }

  function loadImage(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=src})}
  function drawBackgroundStars(ctx,w,h,seed){for(let i=0;i<150;i++){const x=(i*83+seed*29)%w,y=(i*i*17+seed*53)%h,r=i%13===0?2.4:1.1;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=i%9===0?'rgba(239,217,154,.62)':'rgba(226,237,255,.38)';ctx.fill()}}
  function drawDecorativeSky(ctx,w,h){
    const decor=window.SS_SKY_DECOR;if(!decor)return;const sx=w/1000,sy=h/1000;ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
    decor.motifs.forEach(m=>{ctx.save();ctx.translate(m.x*sx,m.y*sy);ctx.scale(m.scale*Math.min(sx,sy),m.scale*Math.min(sx,sy));ctx.strokeStyle=m.color+'42';ctx.fillStyle=m.color+'62';ctx.lineWidth=1.2;m.paths.forEach(path=>{ctx.beginPath();path.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke()});m.stars.forEach((p,i)=>{ctx.beginPath();ctx.arc(p[0],p[1],i===1||i===3?3.2:2.2,0,Math.PI*2);ctx.fill()});ctx.restore()});ctx.restore();
  }
  function drawOfficialConstellation(ctx,type,cx,cy,width){
    const d=C.constellations[type],s=width/345,ox=cx-width/2,oy=cy-350*s/2,point=q=>[ox+(q[0]+42)*s,oy+(q[1]+64)*s];ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='rgba(170,187,210,.34)';ctx.lineWidth=Math.max(1,1.15*s);
    C.ambient.forEach(q=>{const x=ox+(q[0]+20)*s,y=oy+(q[1]+55)*s;ctx.beginPath();ctx.arc(x,y,1.55*s,0,Math.PI*2);ctx.globalAlpha=.28;ctx.fillStyle='#c8daed';ctx.shadowBlur=0;ctx.fill()});ctx.globalAlpha=1;
    d.paths.forEach(p=>{ctx.beginPath();p.forEach((q,i)=>{const [x,y]=point(q);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke()});
    if(d.fade){const p0=point(d.fade[0]),p1=point(d.fade[1]),p2=point(d.fade[2]),g=ctx.createLinearGradient(p0[0],p0[1],p2[0],p2[1]);g.addColorStop(0,'rgba(185,202,224,.28)');g.addColorStop(1,'rgba(185,202,224,0)');ctx.strokeStyle=g;ctx.beginPath();ctx.moveTo(p0[0],p0[1]);ctx.quadraticCurveTo(p1[0],p1[1],p2[0],p2[1]);ctx.stroke()}
    const specs={a:[5.8,'#fff0a8',18,1],b:[4.5,'#f6e7b2',12,.9],c:[3.1,'#dce9f2',8,.62],d:[1.55,'#c8daed',0,.42]};d.stars.forEach(q=>{const[x,y]=point(q),sp=specs[q[2]];ctx.beginPath();ctx.arc(x,y,sp[0]*s,0,Math.PI*2);ctx.globalAlpha=sp[3];ctx.fillStyle=sp[1];ctx.shadowColor=sp[1];ctx.shadowBlur=sp[2]*s;ctx.fill()});ctx.restore();ctx.globalAlpha=1;ctx.shadowBlur=0;
  }
  function contain(ctx,img,x,y,w,h){const s=Math.min(w/img.width,h/img.height),dw=img.width*s,dh=img.height*s;ctx.drawImage(img,x+(w-dw)/2,y+(h-dh)/2,dw,dh)}
  function wrapText(ctx,text,x,y,maxWidth,lineHeight,maxLines){const words=locale==='en'?text.split(' '):[...text],space=locale==='en'?' ':'';let line='',lines=[];for(const word of words){const test=line?line+space+word:word;if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=word}else line=test}if(line)lines.push(line);lines=lines.slice(0,maxLines);lines.forEach((l,i)=>ctx.fillText(l,x,y+i*lineHeight,maxWidth));return lines.length}
  function isMobileSaveEnvironment(){return /iPhone|iPad|iPod|Android|Mobile/i.test(navigator.userAgent)||('ontouchstart' in window&&navigator.maxTouchPoints>0)}
  function showMobileSavePreview(dataUrl,name){
    const existing=document.getElementById('mobileSavePreview');if(existing)existing.remove();
    const messages={ja:{title:'画像を保存',guide:'画像を長押しして「写真に保存」を選んでください。共有ボタンから保存することもできます。',share:'共有・保存',close:'閉じる'},en:{title:'Save image',guide:'Press and hold the image to save it to Photos, or use the share button.',share:'Share / Save',close:'Close'},ko:{title:'이미지 저장',guide:'이미지를 길게 눌러 사진에 저장하거나 공유 버튼을 이용해 주세요.',share:'공유・저장',close:'닫기'}};
    const m=messages[locale]||messages.ja,overlay=document.createElement('div');overlay.id='mobileSavePreview';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');
    overlay.style.cssText='position:fixed;inset:0;z-index:99999;background:rgba(2,8,22,.96);display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:calc(18px + env(safe-area-inset-top)) 16px calc(22px + env(safe-area-inset-bottom));overflow:auto;color:#f5f4ee;text-align:center';
    const title=document.createElement('h2');title.textContent=m.title;title.style.cssText='font-size:1.2rem;margin:6px 0 8px;color:#efd99a';
    const guide=document.createElement('p');guide.textContent=m.guide;guide.style.cssText='max-width:34em;margin:0 0 14px;color:#d2dbea;line-height:1.7;font-size:.92rem';
    const img=document.createElement('img');img.src=dataUrl;img.alt=m.title;img.style.cssText='display:block;max-width:min(92vw,520px);height:auto;border-radius:16px;box-shadow:0 18px 55px rgba(0,0,0,.45);-webkit-touch-callout:default;user-select:auto';
    const actions=document.createElement('div');actions.style.cssText='display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin:16px 0 4px';
    const share=document.createElement('button');share.type='button';share.textContent=m.share;share.style.cssText='min-height:48px;padding:12px 22px;border:0;border-radius:999px;background:#efd99a;color:#172038;font:inherit;font-weight:500';
    share.onclick=async()=>{try{const blob=await (await fetch(dataUrl)).blob(),file=new File([blob],name,{type:'image/png'});if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:'Sleeping Stars'})}else{const a=document.createElement('a');a.href=dataUrl;a.download=name;a.click()}}catch(e){if(e&&e.name!=='AbortError')console.error(e)}};
    const close=document.createElement('button');close.type='button';close.textContent=m.close;close.style.cssText='min-height:48px;padding:12px 22px;border:1px solid rgba(205,220,255,.35);border-radius:999px;background:transparent;color:#dce8f8;font:inherit';close.onclick=()=>overlay.remove();
    actions.append(share,close);overlay.append(title,guide,img,actions);document.body.appendChild(overlay);
  }
  function downloadCanvas(canvas,name){const dataUrl=canvas.toDataURL('image/png');if(isMobileSaveEnvironment()){showMobileSavePreview(dataUrl,name);return}const a=document.createElement('a');a.download=name;a.href=dataUrl;a.click()}
  async function saveResult(kind){
    const wallpaper=kind==='wallpaper',w=1080,h=wallpaper?1920:1350,T=localizedType(resultPrimary),canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d'),g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#0d2b54');g.addColorStop(.55,'#071832');g.addColorStop(1,'#030918');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);drawBackgroundStars(ctx,w,h,resultPrimary);drawDecorativeSky(ctx,w,h);ctx.textAlign='center';ctx.fillStyle='#efd99a';ctx.font='42px "Cormorant Garamond",serif';ctx.fillText('S L E E P I N G   S T A R S',w/2,105);ctx.fillStyle='#f5f4ee';ctx.font=locale==='ja'?'500 48px "Noto Serif JP",serif':locale==='ko'?'500 45px "Noto Sans KR",sans-serif':'500 44px "Cormorant Garamond",serif';ctx.fillText(U.wallTitle,w/2,180);drawOfficialConstellation(ctx,resultPrimary,w/2,wallpaper?410:350,wallpaper?560:500);
    const words=[...selected.values()].sort((a,b)=>a.round-b.round).slice(0,wallpaper?8:6).map(v=>v.text);ctx.font=locale==='ja'?'30px "Noto Serif JP",serif':locale==='ko'?'28px "Noto Sans KR",sans-serif':'29px "Cormorant Garamond",serif';ctx.fillStyle='#f5ebc8';words.forEach((word,i)=>{const col=i%2,row=Math.floor(i/2),x=w/2+(col?230:-230),y=(wallpaper?720:640)+row*64;ctx.fillText('✦ '+word,x,y,420)});
    const [parent,kid]=await Promise.all([loadImage(`${basePath}img/${T.parent}`),loadImage(`${basePath}img/${T.kid}`)]);if(wallpaper){contain(ctx,kid,220,970,640,650);contain(ctx,parent,55,1260,320,430)}else{contain(ctx,parent,105,760,455,420);contain(ctx,kid,520,790,390,390)}ctx.fillStyle='#efd99a';ctx.font=locale==='ja'?'500 38px "Noto Serif JP",serif':locale==='ko'?'500 37px "Noto Sans KR",sans-serif':'500 42px "Cormorant Garamond",serif';ctx.fillText(T.family,w/2,h-150);ctx.fillStyle='rgba(210,222,240,.78)';ctx.font=locale==='ja'?'25px "Noto Serif JP",serif':locale==='ko'?'24px "Noto Sans KR",sans-serif':'27px "Cormorant Garamond",serif';const note=wallpaper?U.wallNote:fill(U.shareNote,{value:T.value});wrapText(ctx,note,w/2,h-100,900,34,2);ctx.font='24px "Cormorant Garamond",serif';ctx.fillText('Rainy Muse',w/2,h-42);downloadCanvas(canvas,`${U.downloadName}-${wallpaper?'wallpaper':'share'}-type-${resultPrimary}-${locale}.png`)
  }

  $('start').onclick=()=>{selected.clear();round=0;render();show('quiz')};$('back').onclick=()=>{round--;render();scrollTo(0,0)};$('next').onclick=()=>{if(round<7){round++;render();scrollTo(0,0)}else beginResults()};$('saveWallpaper').onclick=()=>saveResult('wallpaper');$('saveShare').onclick=()=>saveResult('share');$('restart').onclick=()=>show('intro');
  localize();document.body.dataset.screen='intro';render();
})();
