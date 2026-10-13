import { JULHO_PROFILE, FERNANDO_PROFILE, SIMEAO_ROAD } from './road-profiles.js';
import { JULHO_WALK, JULHO_Y } from './julho-data.js';
import { project as P } from './projection.js';
import { JULHO_END, FERNANDO_ROAD } from './julho-data.js';
function rect(c,x,y,w,h,fill,z=0){c.beginPath();[[x,y],[x+w,y],[x+w,y+h],[x,y+h]].forEach(([xx,yy],i)=>{const p=P(xx,yy,z);i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y);});c.closePath();c.fillStyle=fill;c.fill();}
export function drawJulhoGround(c,asphalt,paving){
  const end=JULHO_END.x,west=JULHO_WALK.x;
  rect(c,west,JULHO_WALK.y,-west,JULHO_WALK.h,paving);
  for(let x=west;x<0;x+=17)for(const y of [JULHO_WALK.y+2,JULHO_Y+JULHO_PROFILE.halfWidth+2])rect(c,x,y,15,JULHO_PROFILE.sidewalkWidth-4,'#a5a18d');
  rect(c,west,JULHO_Y-JULHO_PROFILE.halfWidth,-west,JULHO_PROFILE.width,asphalt);
  for(const y of [JULHO_Y-JULHO_PROFILE.halfWidth,JULHO_Y+JULHO_PROFILE.halfWidth])rect(c,west,y,-west,1.5,'#c8c6ad',1);
  const r=FERNANDO_ROAD;
  rect(c,r.x,r.y,r.w,r.h,paving);
  rect(c,end-FERNANDO_PROFILE.halfWidth,r.y,FERNANDO_PROFILE.width,r.h,asphalt);
  rect(c,west,JULHO_Y-JULHO_PROFILE.halfWidth,-west,JULHO_PROFILE.width,asphalt);
  rect(c,-SIMEAO_ROAD.halfWidth,JULHO_Y,SIMEAO_ROAD.width,JULHO_PROFILE.outerHalfWidth,asphalt);
  // Degraus da entrada do banco, visíveis na foto 9/L; mantêm a faixa livre.
  for(let i=0;i<4;i++)rect(c,end+FERNANDO_PROFILE.outerHalfWidth-24+i*6,-280,6,109,i%2?'#c9c4ae':'#a9aa97',i*1.7);
  for(let x=-1100;x<-220;x+=160){rect(c,x,JULHO_Y-JULHO_PROFILE.halfWidth+3,13,4,'#515e51');}
  // Faixas de passeio continuam até a ligação existente junto à praça.
  // The Simeão junction stays asphalted; no sidewalk across its axis.
}
export function drawJulhoFacade(c,b,w,h){
  const fill=(x,y,ww,hh,color)=>{c.fillStyle=color;c.fillRect(x*w,y*h,ww*w,hh*h);};
  if(b.detail==='jl-stone-base')for(let i=0;i<60;i++)fill((i*17%97)/100,.66+(i%6)*.055,.065,.047,['#b2a48a','#dfd2b6','#8c8873'][i%3]);
  if(b.detail==='jl-dark-frame'){fill(.05,.27,.9,.73,'#39403a');fill(0,.85,1,.15,'#d1cbbb');}
  if(b.detail==='jl-balcony'){
    fill(.28,.54,.56,.035,'#e1dcc8');
    for(let x=4;x<w*.25;x+=6){c.fillStyle='#8e8a70';c.fillRect(x,h*.41,3,h*.035);}
  }
  if(b.detail==='jl-coife'){fill(0,.32,.09,.68,'#cb672d');fill(.91,.32,.09,.68,'#f09b47');}
  if(b.detail==='jl-fenced'){
    fill(.07,.12,.88,.035,'#6e9b6e');
    for(const u of [0,.32,.66,.96])fill(u,.18,.04,.82,'#e4dfcd');
  }
  if(b.detail==='jl-bank-side'){
    fill(.025,.18,.045,.18,'#a93b3f');
    c.strokeStyle='#e7dcc2';c.lineWidth=1.2;c.beginPath();c.arc(w*.047,h*.27,h*.045,Math.PI,Math.PI*2);c.stroke();
    fill(.10,.36,.35,.025,'#dcd5ba');
  }
  if(b.detail==='jl-bank-entry'){fill(.16,.30,.04,.70,'#a43c3d');fill(.82,.30,.035,.70,'#a43c3d');}
  if(b.detail==='jl-cartorio'){
    fill(.71,0,.27,.23,'#aaa1a4');
    for(const u of [.74,.82,.90])fill(u,0,.035,.25,'#e9e4d6');
  }
  if(b.detail==='jl-cartorio-side'){
    fill(0,.30,1,.022,'#b6b5a4');
    for(let x=0;x<w;x+=8){c.strokeStyle='#b1b4a3';c.lineWidth=.6;c.strokeRect(x,h*.28,7,h*.07);}
  }
}
export function drawJulhoBankRails(c){
  const line=(a,b)=>{const dx=FERNANDO_PROFILE.outerHalfWidth-55;const p=P(a[0]+dx,a[1],a[2]),q=P(b[0]+dx,b[1],b[2]);c.beginPath();c.moveTo(p.x,p.y);c.lineTo(q.x,q.y);c.stroke();};
  c.strokeStyle='#c0c7bc';c.lineWidth=1.4;
  for(const y of [-280,-171]){
    for(const x of [-1169,-1158,-1147])line([x,y,0],[x,y,16+(x+1169)*.15]);
    for(const z of [7,16])line([-1171,y,z],[-1145,y,z+4]);
  }
}
