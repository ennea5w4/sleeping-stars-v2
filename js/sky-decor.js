(function(){
  'use strict';
  // World-building decoration only. This dataset is deliberately separate from
  // SS_DATA.common.constellations, the approved Type 1–9 Quiet Lines results.
  const motifs=[
    {color:'#78b8ff',x:54,y:92,scale:.72,stars:[[0,28],[36,9],[75,22],[102,0],[130,38]],paths:[[[0,28],[36,9],[75,22],[102,0]],[[75,22],[130,38]]]},
    {color:'#ef9cce',x:782,y:124,scale:.68,stars:[[0,6],[31,37],[69,25],[98,63],[137,46]],paths:[[[0,6],[31,37],[69,25],[98,63],[137,46]]]},
    {color:'#f0cf77',x:826,y:430,scale:.76,stars:[[0,48],[34,14],[76,25],[105,0],[142,34],[120,73]],paths:[[[0,48],[34,14],[76,25],[105,0]],[[76,25],[142,34],[120,73]]]},
    {color:'#b39bea',x:35,y:530,scale:.7,stars:[[0,0],[28,42],[62,28],[96,64],[132,41]],paths:[[[0,0],[28,42],[62,28]],[[62,28],[96,64],[132,41]]]},
    {color:'#7fcfae',x:760,y:750,scale:.74,stars:[[0,41],[38,8],[73,31],[111,17],[145,54]],paths:[[[0,41],[38,8],[73,31],[111,17]],[[73,31],[145,54]]]},
    {color:'#77c8dc',x:92,y:825,scale:.64,stars:[[0,29],[31,0],[65,18],[93,55],[137,39]],paths:[[[0,29],[31,0],[65,18],[93,55]],[[65,18],[137,39]]]}
  ];
  const meteors=[
    {top:'11%',left:'72%',delay:'2s',duration:'18s'},
    {top:'38%',left:'18%',delay:'9s',duration:'21s'},
    {top:'69%',left:'80%',delay:'15s',duration:'24s'}
  ];
  window.SS_SKY_DECOR={motifs,meteors};

  const host=document.getElementById('skyDecor');
  if(!host)return;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const groups=motifs.map((m,i)=>{
    const lines=m.paths.map(path=>`<polyline points="${path.map(p=>p.join(',')).join(' ')}"/>`).join('');
    const stars=m.stars.map((p,j)=>`<circle cx="${p[0]}" cy="${p[1]}" r="${j===1||j===3?3.2:2.2}"/>`).join('');
    return `<g class="decor-motif decor-${i+1}" transform="translate(${m.x} ${m.y}) scale(${m.scale})" style="--decor-color:${esc(m.color)}">${lines}${stars}</g>`;
  }).join('');
  host.innerHTML=`<svg class="decor-constellations" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${groups}</svg><div class="meteor-field" aria-hidden="true">${meteors.map(m=>`<i class="meteor" style="--top:${m.top};--left:${m.left};--delay:${m.delay};--duration:${m.duration}"></i>`).join('')}</div>`;
})();
