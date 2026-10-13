import { project as P } from './projection.js';
import { MENDONCA_ROAD } from './road-profiles.js';
import { CROSS_Y } from './mendonca-data.js';
import { MENDONCA_WEST_WALK, MENDONCA_WEST_PAVING } from './mendonca-west.js';
function rect(c,x,y,w,h,color){const ps=[[x,y],[x+w,y],[x+w,y+h],[x,y+h]].map(p=>P(...p));c.fillStyle=color;c.beginPath();ps.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();c.fill();}
function line(c,x,y,xx,yy,color,width=1){const a=P(x,y,1),b=P(xx,yy,1);c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();}
export function drawMendoncaWestGround(c,asphalt,paving){
  const r=MENDONCA_WEST_PAVING;
  rect(c,r.x,r.y,r.w,r.h,paving);
  rect(c,MENDONCA_WEST_WALK.x,CROSS_Y-MENDONCA_ROAD.halfWidth,MENDONCA_WEST_WALK.w,MENDONCA_ROAD.width,asphalt);
  for(const sign of [-1,1]){
    const y=CROSS_Y+sign*MENDONCA_ROAD.halfWidth;
    line(c,r.x,y,r.x+r.w,y,'#bcc0a4',2);
    for(let x=r.x;x<r.x+r.w;x+=22)line(c,x,y,x,y+sign*(MENDONCA_ROAD.sidewalkWidth-1),'#7c866c80',.6);
    for(let x=r.x+17;x<r.x+r.w-20;x+=131)rect(c,x,y-sign*5,14,3,'#576355');
  }
  // Painted wave paving at the agency and red tiles by the restaurant.
  for(let x=-1096;x<-940;x+=14)for(let y=CROSS_Y+MENDONCA_ROAD.halfWidth+2;y<CROSS_Y+MENDONCA_ROAD.outerHalfWidth-3;y+=4){
    const dx=Math.sin((y-CROSS_Y)/5)*4;
    line(c,x+dx,y,x+Math.sin((y+4-CROSS_Y)/5)*4,y+4,'#e1e0c5',3);
  }
  for(let x=-788;x<-688;x+=10)for(let y=CROSS_Y+MENDONCA_ROAD.halfWidth+3;y<CROSS_Y+MENDONCA_ROAD.outerHalfWidth-5;y+=9)rect(c,x,y,9,8,Math.round((x+y)/10)%2?'#a88c74':'#c5b798');
}
// Details observed in the complete contact sheets; surfaces use the same lots
// as navigation, shadows and normal/night facade baking.
export function drawMendoncaWestFacade(c,b,w,h){
  const d=b.detail;
  if(d==='cm-o-stone-wall'){
    c.fillStyle='#b3a98d';c.fillRect(0,h*.24,w*.88,h*.76);
    for(let y=h*.25;y<h;y+=5)for(let x=0;x<w*.88;x+=12){c.fillStyle=(Math.floor(y/5)+Math.floor(x/12))%3?'#cec4a977':'#847e6966';c.fillRect(x+(Math.floor(y/5)%2)*3,y,10,3);}
    c.fillStyle='#dfdec9';c.fillRect(0,0,w,h*.10);
  }
  if(d==='cm-o-yellow-wall'){
    c.fillStyle='#d9c574';c.fillRect(w*.52,h*.39,w*.48,h*.61);
    c.fillStyle='#eee6c3';c.fillRect(w*.52,h*.37,w*.48,3);
  }
  if(d==='cm-o-canopy'){
    c.fillStyle='#808b82';c.fillRect(0,0,w,h*.12);
    c.strokeStyle='#cad0bd';c.lineWidth=.6;for(let x=0;x<w;x+=5){c.beginPath();c.moveTo(x,0);c.lineTo(x+3,h*.12);c.stroke();}
  }
  if(d==='cm-o-balcony'){
    c.fillStyle='#9b805c';c.fillRect(0,h*.40,w,h*.60);
    c.strokeStyle='#685d4970';for(let y=h*.41;y<h;y+=5){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();}
    c.fillStyle='#d7cbb1';c.fillRect(w*.01,h*.50,w*.55,h*.15);
    c.fillStyle='#d6d4be';c.fillRect(0,h*.35,w,h*.05);c.fillRect(0,0,w,3);
  }
  if(d==='cm-o-centro-wing'){
    for(let n=0;n<180;n++){c.fillStyle=n%3?'#a9956460':'#f2edda80';c.fillRect(w*(.13+(n*37%85)/100),h*((n*13%94)/100),4+n%8,3+n%9);}
    c.fillStyle='#b5af8b';c.fillRect(w*.13,h*.44,w*.38,h*.56);
    c.fillStyle='#ddd5b7';c.fillRect(w*.13,h*.43,w*.38,3);c.fillRect(w*.52,h*.08,w*.48,3);
    for(let n=0;n<90;n++){c.fillStyle=n%3?'#6b735940':'#ece4c475';c.fillRect(w*(.13+(n*37%85)/100),h*(.53+(n*13%43)/100),3+n%6,2+n%4);}
    c.fillStyle='#d5ceb0';c.fillRect(w*.515,h*.14,3,h*.83);
  }
  if(d==='cm-o-agency'){
    c.fillStyle='#d8dfcf';c.fillRect(0,h*.52,w,h*.035);c.fillRect(0,h*.57,w,h*.025);
    c.fillStyle='#345576';for(const u of [0,.97]){c.fillRect(w*u,0,w*.03,h);c.strokeStyle='#7292a1';c.lineWidth=.5;for(let y=0;y<h;y+=4)c.strokeRect(w*u,y,w*.03,4);}
    c.fillStyle='#e2e5d5';for(const [u,ww] of [[.05,.23],[.36,.23],[.68,.28]])for(let x=w*u;x<w*(u+ww);x+=4)c.fillRect(x,h*.23,2,h*.06);
    c.fillStyle='#d2d7c8';c.fillRect(w*.81,h*.16,w*.14,h*.09);c.strokeStyle='#708780';c.strokeRect(w*.815,h*.165,w*.13,h*.08);
    for(let x=w*.83;x<w*.93;x+=2){c.beginPath();c.moveTo(x,h*.18);c.lineTo(x,h*.23);c.stroke();}
  }
}
