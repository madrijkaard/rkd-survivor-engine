import { project as P } from './projection.js';
import { BENEDITO_X as X } from './mendonca-benedito.js';
import { BENEDITO_WALK, BENEDITO_JULHO, beneditoShelter } from './benedito-data.js';
import { BENEDITO_PROFILE as R, JULHO_PROFILE } from './road-profiles.js';
import { drawMendoncaBeneditoFacade, drawMendoncaBeneditoOpeningDetails } from './mendonca-benedito-render.js';
function poly(c,ps,color){c.beginPath();ps.forEach((p,i)=>{const q=P(...p);i?c.lineTo(q.x,q.y):c.moveTo(q.x,q.y);});c.closePath();c.fillStyle=color;c.fill();}
function rect(c,x,y,w,h,color,z=0){poly(c,[[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z]],color);}
function line(c,a,b,color,width=1){const p=P(...a),q=P(...b);c.beginPath();c.moveTo(p.x,p.y);c.lineTo(q.x,q.y);c.strokeStyle=color;c.lineWidth=width;c.stroke();}
export function drawBeneditoGround(c,asphalt,paving){
  const a=BENEDITO_WALK,j=BENEDITO_JULHO;
  // Termina antes da pista da Cônego para conservar a junção transversal.
  rect(c,a.x,a.y,a.w,2241-a.y,paving);rect(c,X-R.halfWidth,a.y,R.width,2281-a.y,asphalt);
  rect(c,j.x,j.y,j.w,j.h,paving);rect(c,j.x,-95-JULHO_PROFILE.halfWidth,j.w,JULHO_PROFILE.width,asphalt);
  // Recuo de vagas e jardins existente fora do passeio integral da avenida.
  rect(c,X+R.outerHalfWidth,1730,115,460,paving);
  for(let y=1760;y<2170;y+=93)line(c,[X+R.halfWidth+5,y,1],[X+R.outerHalfWidth+90,y+18,1],'#d8d6bb',1.2);
  for(let y=10;y<2241;y+=18){
    line(c,[X-R.halfWidth,y,1],[X-R.halfWidth,Math.min(y+18,2241),1],'#c9ccb3',2);
    line(c,[X+R.halfWidth,y,1],[X+R.halfWidth,Math.min(y+18,2241),1],'#c9ccb3',2);
  }
  for(let y=18;y<2240;y+=14)for(let x=a.x;x<X-R.halfWidth;x+=17)line(c,[x,y,0],[x+13,y+3,0],'#7f89726b',.6);
  rect(c,X-R.outerHalfWidth-270,810,270,120,'#ab9978');
  // Reformas vistas em junho de 2025: areia, blocos e piso incompleto na praça.
  rect(c,X+R.outerHalfWidth,930,115,220,'#c1b38d');
  poly(c,[[X+210,1050,0],[X+265,1010,0],[X+255,1055,32],[X+220,1100,0]],'#c9bd9d');
  for(let n=0;n<20;n++)rect(c,X+210+n%5*10,953+Math.floor(n/5)*11,8,9,'#a9b0a1',4+n%3*3);
  for(let x=X-64;x<X+64;x+=27)rect(c,x,27,14,60,'#d9d8bc');
  for(let y=-150;y<-40;y+=27)rect(c,X+103,y,56,14,'#d9d8bc');
  for(let n=0;n<60;n++)rect(c,X-38+n*37%70,60+n*41%2120,4+n%3*4,3+n%5,'#7a806c');
  rect(c,beneditoShelter.x,beneditoShelter.y,beneditoShelter.w,beneditoShelter.h,'#c2b797');
}
export function drawBeneditoFurniture(c,b){
  if(!b.kind){
    for(const y of [b.y,b.y+b.h]){line(c,[b.x-4,y,0],[b.x,y,b.height],'#9a8050',1.5);line(c,[b.x+5,y,0],[b.x,y,b.height],'#9a8050',1.5);}
    for(const z of [10,b.height])line(c,[b.x,b.y,z],[b.x,b.y+b.h,z],'#b59b59',1.5);
    return;
  }
  if(b.kind==='phone'){
    line(c,[b.x,b.y,0],[b.x,b.y,31],'#819484',2);
    const p=P(b.x,b.y,34);c.fillStyle='#85aaa2';c.beginPath();c.ellipse(p.x,p.y,12,9,-.4,Math.PI,Math.PI*2);c.lineTo(p.x+8,p.y+8);c.quadraticCurveTo(p.x-10,p.y+6,p.x-12,p.y);c.fill();
    c.fillStyle='#3b5c55';c.fillRect(p.x-3,p.y+1,6,9);return;
  }
  // Semáforo fotografado na face sul do banco. A luz é sinalização, não poste.
  const {x,y}=b;
  line(c,[x,y,0],[x,y,150],'#78877c',3);line(c,[x,y,150],[X-30,y,150],'#78877c',3);
  for(const yy of [y,y+4]){rect(c,X-32,yy,8,5,'#2a3a32',144);}
  const p=P(X-27,y,140);c.fillStyle='#ac5041';c.fillRect(p.x-2,p.y-2,4,4);
}
export function drawBeneditoFacade(c,b,w,h){
  const d=b.detail,F=(u,v,ww,hh,color)=>{c.fillStyle=color;c.fillRect(u*w,v*h,ww*w,hh*h);},L=(u,v,uu,vv,color,width=.7)=>{c.beginPath();c.moveTo(u*w,v*h);c.lineTo(uu*w,vv*h);c.strokeStyle=color;c.lineWidth=width;c.stroke();};
  if(d==='sb-arc-gates')drawMendoncaBeneditoFacade(c,{...b,detail:'cb-arc-stone'},w,h);
  if(d==='sb-school'){
    for(const u of [.12,.83]){F(u-.035,0,.07,.045,'#ebead8');L(u-.06,.07,u,.015,'#bdbfae',2);L(u,.015,u+.06,.07,'#bdbfae',2);}
    for(const v of [.025,.055,.91])L(0,v,1,v,'#bfc1a8',1.3);
  }
  if(d==='sb-agrogeo'){
    F(0,.56,.51,.44,'#b46184');F(.01,.55,.49,.025,'#d47e9c');F(0,.39,1,.04,'#73684f');F(0,0,1,.07,'#9f9574');
    for(let i=0;i<60;i++)F((i*37%98)/100,.28+(i*13%11)/100,.016,.02+i%3*.017,'#645e4666');
  }
  if(d==='sb-aged-side')for(let i=0;i<100;i++)F((i*29%98)/100,.35+(i*11%62)/100,.007+i%3*.01,.02+i%5*.012,'#74755588');
  if(d==='sb-iesi'){F(0,.80,1,.023,'#d7d9c9');for(const v of [.025,.055,.085])L(0,v,1,v,'#c7cbbc',1);}
  if(d==='sb-banco'){F(0,0,1,.39,'#677c8c');F(0,.36,1,.07,'#668096');for(let u=.10;u<1;u+=.17)F(u,.42,.025,.56,'#e0e4d6');}
  if(d==='sb-bank-corner'){F(0,0,1,.39,'#677d8f');F(0,.88,1,.12,'#e0e3d5');}
  if(d==='sb-library-front'){F(.82,.75,.18,.25,'#6689ad');F(.38,.04,.02,.76,'#e2e2cf');F(.60,.04,.02,.76,'#e2e2cf');}
  if(d==='sb-hotel'){
    for(let row=0;row<5;row++)for(let col=0;col<5;col++){const u=.05+col*.19,v=.08+row*.18;F(u,v,.095,.052,'#5b7376');L(u+.042,v,u+.042,v+.052,'#aab6ab');}
    for(let v=.19;v<1;v+=.18)L(0,v,1,v,'#b1bdaf');
  }
  if(d==='sb-historic-side'){
    for(let col=0;col<7;col++){
      const u=(col+.20)/7;F((col+.03)/7,0,.018,1,'#e1ddc7');
      for(const v of [.18,.69]){const x=u*w,y=v*h,ww=w*.074,hh=h*.19;c.fillStyle='#505b44';c.beginPath();c.moveTo(x,y+hh);c.lineTo(x,y+5);c.quadraticCurveTo(x+ww/2,y-8,x+ww,y+5);c.lineTo(x+ww,y+hh);c.fill();for(let n=1;n<4;n++)L(u+ww/w*n/4,v+.04,u+ww/w*n/4,v+.19,'#a49e7a');}
      if(col%2===0){F(u+.085,.23,.04,.045,'#b7b7a1');F(u+.09,.24,.03,.025,'#7d8d81');}
    }
    for(let n=0;n<100;n++)F((n*31%98)/100,.80+(n*13%17)/100,.007+n%3*.012,.016+n%4*.01,'#6c775b70');
  }
}
export function drawBeneditoOpeningDetails(c,b,w,h){
  if(b.detail==='sb-arc-gates'){
    drawMendoncaBeneditoOpeningDetails(c,{...b,detail:'cb-arc-stone'},w,h);
    for(const u of [.12,.62]){c.fillStyle='#ced2bf';c.fillRect(u*w,.65*h,.22*w,.35*h);for(let t=.015;t<.22;t+=.017){c.strokeStyle='#8d9a87';c.lineWidth=.7;c.beginPath();c.moveTo((u+t)*w,.66*h);c.lineTo((u+t)*w,h);c.stroke();}}
  }
  if(!['sb-ogives','sb-school','sb-star-grille','sb-copy-side'].includes(b.detail))return;
  for(const o of b.openings){
    const x=o.u*w,y=(1-o.bottom-o.h)*h,ww=o.w*w,hh=o.h*h;
    if(b.detail==='sb-star-grille'){
      c.strokeStyle='#a3b29f';c.lineWidth=.65;
      for(let xx=x+5;xx<x+ww-4;xx+=9)for(let yy=y+5;yy<y+hh-4;yy+=9)for(let a=0;a<8;a++){c.beginPath();c.moveTo(xx,yy);c.lineTo(xx+4*Math.cos(a*Math.PI/4),yy+4*Math.sin(a*Math.PI/4));c.stroke();}continue;
    }
    c.fillStyle=b.color;c.beginPath();c.moveTo(x,y+hh*.22);c.lineTo(x,y);c.lineTo(x+ww,y);c.lineTo(x+ww,y+hh*.22);
    if(b.detail==='sb-ogives'){c.quadraticCurveTo(x+ww*.85,y+hh*.02,x+ww*.5,y);c.quadraticCurveTo(x+ww*.15,y+hh*.02,x,y+hh*.22);}
    else c.bezierCurveTo(x+ww*.85,y-hh*.07,x+ww*.15,y-hh*.07,x,y+hh*.22);
    c.fill();
  }
}
