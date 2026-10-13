// Motivos observados nas oito direções dos pontos 10–18.
export function drawJulhoWestFacade(c,b,w,h){
  const d=b.detail,f=(x,y,ww,hh,color)=>{c.fillStyle=color;c.fillRect(x*w,y*h,ww*w,hh*h);};
  if(d==='jl-wire-garage'){
    c.strokeStyle='#6b776b';c.lineWidth=.7;
    for(let x=5;x<w;x+=10){c.beginPath();c.ellipse(x,5,6,5,0,0,Math.PI*2);c.stroke();}
    for(let x=0;x<w;x+=30)f(x/w,0,.015,.12,'#475849');
  }
  if(d==='jl-pharmacy'){
    for(let x=0;x<w;x+=5)f(x/w,.24,5/w,.018,x%15===0?'#b45149':x%10===0?'#54745c':'#dbdacb');
  }
  if(d==='jl-super-optics'){
    f(0,0,1,.39,'#c86d45');f(.04,.025,.92,.32,'#825748');f(0,.40,1,.60,'#c5c0b8');
    for(let x=w*.06;x<w*.95;x+=3)f(x/w,.055,1/w,.25,'#976957');
  }
  if(d==='jl-red-annex')for(let y=.05;y<1;y+=.12)f(0,y,1,.008,'#884b43');
  if(d==='jl-blue-yard'){
    f(0,0,1,1,'#528aa3');f(.05,.05,.18,.52,'#31769b');f(.78,0,.20,.62,'#3c8bba');
    f(.05,.05,.75,.035,'#465e62');
    // Low weathered enclosure in front of the taller set-back blue pavilion.
    f(0,.49,1,.51,'#b4b9ad');
    for(let i=0;i<70;i++)f((i*17%98)/100,.5+(i*7%47)/100,.017,.035,['#8a9286','#c8cbbd','#9ba192'][i%3]);
    f(.40,.51,.51,.49,'#7199ac');
    for(const u of [.40,.655,.90])f(u,.51,.012,.49,'#587d8a');
    for(const v of [.64,.80,.96])f(.40,v,.51,.012,'#577b8b');
  }
  if(d==='jl-garden-house'){
    f(0,.06,1,.018,'#c5c7b6');f(.21,.10,.33,.016,'#bfc2b3');
    for(let v=.29;v<.9;v+=.045)f(.21,v,.33,.009,'#c4c6b4');
    c.strokeStyle='#9fa996';c.lineWidth=.8;c.beginPath();c.arc(w*.37,h*.31,w*.17,Math.PI,2*Math.PI);c.stroke();
  }
  if(d==='jl-crefisa-yard'){
    f(0,.42,1,.58,'#d6d9c9');f(.48,.43,.52,.57,'#a2aa96');
    for(const u of [.015,.45,.50,.98])f(u,.04,.023,.96,'#e0dfc9');
    f(0,.4,1,.025,'#b7ab8d');
  }
  if(d==='jl-ceo-side'){
    f(0,.76,1,.24,'#b56355');f(0,.29,1,.028,'#d4d5c6');
    for(const u of [.02,.29,.55,.96])f(u,.30,.022,.57,'#dddfce');
  }
  if(d==='jl-uniodonto-return'){
    f(0,.02,1,.035,'#477ca1');f(0,.29,1,.035,'#447ca6');
    f(0,.31,.12,.69,'#b29d80');
    for(let i=0;i<18;i++)f(i%2*.06,.32+Math.floor(i/2)*.07,.055,.06,i%3?'#c0ac90':'#a5967d');
  }
  if(d==='jl-cartorio-return'){
    f(.07,.25,.86,.75,'#aaa0ad');
    c.fillStyle='#aaa0ad';c.beginPath();c.ellipse(w*.5,h*.28,w*.30,h*.16,0,Math.PI,0);c.fill();
    for(const u of [.10,.59]){f(u,.34,.31,.065,'#617064');for(let i=0;i<5;i++)f(u+i*.058,.35,.04,.008,'#c9cdba');}
    f(.1,.96,.32,.04,'#879caa');
  }
}
export function drawJulhoWestOpeningDetails(c,b,w,h){
  const d=b.detail;
  if(d==='jl-ceo-side'){
    c.strokeStyle='#e0e2d1';c.lineWidth=.85;
    for(let x=2;x<w;x+=4){c.beginPath();c.moveTo(x,h*.64);c.lineTo(x,h*.81);c.stroke();}
    for(const y of [.66,.79]){c.beginPath();c.moveTo(0,h*y);c.lineTo(w,h*y);c.stroke();}
  }
  if(d==='jl-pharmacy'){
    c.fillStyle='#9ca78f';for(let i=0;i<3;i++)for(let k=0;k<4;k++)c.fillRect(w*.08+k*w*.045,h*(.42+i*.15),w*.032,h*.035);
    c.strokeStyle='#c6cbbb';c.lineWidth=1;for(let i=0;i<4;i++){const x=w*(.67+i*.06);c.strokeRect(x,h*.74,w*.045,h*.12);c.beginPath();c.moveTo(x,h*.86);c.lineTo(x,h*.97);c.moveTo(x+w*.045,h*.86);c.lineTo(x+w*.045,h*.97);c.stroke();}
  }
  if(d==='jl-uniodonto-return'){c.fillStyle='#3e6998';c.fillRect(w*.25,h*.66,w*.57,h*.06);}
}
