import { project as P } from './projection.js';
import { antonioPoints, antonioCenter, CINEMA_GARDEN, JULHO_ROAD } from './antonio-data.js';
function poly(c,vertices,fill){c.beginPath();vertices.forEach((v,i)=>{const p=P(...v);i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y);});c.closePath();c.fillStyle=fill;c.fill();}
function rect(c,x,y,w,h,color,z=0){poly(c,[[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z]],color);}
function line(c,a,b,color,width=1){const p=P(...a),q=P(...b);c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(q.x,q.y);c.stroke();}
function strip(c,width,fill){poly(c,[...antonioPoints.map(p=>[p.x-width,p.y]),...antonioPoints.toReversed().map(p=>[p.x+width,p.y])],fill);}
export function drawAntonioCactus(c,b){
  c.lineCap='round';
  line(c,[b.x,b.y,0],[b.x,b.y,b.height],'#3e6448',4);
  line(c,[b.x-1,b.y,2],[b.x-1,b.y,b.height-1],'#abb479',.9);
  for(const s of [-1,1]){
    line(c,[b.x,b.y,b.height*.4],[b.x+s*7,b.y,b.height*.62],'#47704a',3);
    line(c,[b.x+s*7,b.y,b.height*.62],[b.x+s*9,b.y,b.height*.84],'#47704a',3);
    line(c,[b.x+s*7-1,b.y,b.height*.62],[b.x+s*9-1,b.y,b.height*.84],'#a5ad71',.7);
  }
  c.lineCap='butt';
}
export function drawAntonioGround(c,asphalt,paving,dirt,buildings=[]){
  rect(c,420,-140,1220,2450,dirt);
  const g=CINEMA_GARDEN;
  rect(c,g.x,g.y,g.w,g.h,paving);
  // Long stone paths and flower beds photographed on the east edge of the plaza.
  for(let y=375;y<1280;y+=145){
    rect(c,640,y,165,97,'#71855b');
    for(let x=640;x<805;x+=14){line(c,[x,y],[x,y+97],'#8b956750',.8);}
    for(const yy of [y-3,y+97])line(c,[637,yy,1],[808,yy,1],'#d0cdb1',3);
  }
  for(let y=330;y<1305;y+=28)for(let x=425;x<840;x+=27){
    line(c,[x,y],[x+25,y],'#7c826744',.7);line(c,[x,y],[x,y+26],'#89907844',.7);
  }
  // The empty circular basin is visible beside the school entrance.
  const ring=(radius,color)=>poly(c,Array.from({length:36},(_,i)=>[665+Math.cos(i*Math.PI/18)*radius,408+Math.sin(i*Math.PI/18)*radius,3]),color);
  ring(55,'#c2bea0');ring(47,'#7c8566');ring(42,'#aaa387');
  // Unbuilt lot, not a row of invented houses (points 9–12).
  rect(c,1010,945,520,375,'#788859');
  let seed=427;const random=()=>((seed=Math.imul(seed,1664525)+1013904223>>>0)/4294967296);
  for(let i=0;i<1400;i++){
    const x=1009+random()*520,y=949+random()*365,p=P(x,y);
    c.fillStyle=['#496c41','#779453','#98a165','#586f4388'][i%4];
    c.fillRect(p.x,p.y-2,2+(i%4),2+(i%5));
  }
  strip(c,79,paving);strip(c,59,asphalt);
  // Fill each sidewalk up to the actual frontage, including the corner lots.
  for(const b of buildings.filter(b=>b.antonioSide&&!b.setback)){
    const east=b.antonioSide==='east',a=b.footprint[east?0:1],z=b.footprint[east?3:2],sign=east?1:-1;
    const ys=[a[1],...antonioPoints.map(p=>p.y).filter(y=>y>a[1]&&y<z[1]),z[1]].sort((a,b)=>b-a);
    poly(c,[a,z,...ys.map(y=>[antonioCenter(y)+sign*60,y])],paving);
  }
  const r=JULHO_ROAD;rect(c,r.x,r.y,r.w,r.h,asphalt);
  for(let i=1;i<antonioPoints.length;i++)for(const side of [-1,1]){
    const a=antonioPoints[i-1],b=antonioPoints[i];
    // No curb across either intersection.
    line(c,[a.x+side*60,a.y,1],[b.x+side*60,b.y,1],'#bec2a2',2);
  }
  for(let y=-20;y<2280;y+=19){
    const x=antonioCenter(y);
    for(const side of [-1,1])line(c,[x+side*63,y],[x+side*76,y],'#65755c77',.7);
    if(y%5===0)poly(c,[[x-33,y],[x+7,y+5],[x+19,y+27],[x-26,y+39]],'#b2ab872e');
    if(y%3===0)line(c,[x-24,y],[x+15,y+18],'#3948385a',.6);
  }
  for(const y of [1220,1610,2140]){
    const x=antonioCenter(y)+12;poly(c,Array.from({length:16},(_,i)=>[x+Math.cos(i*Math.PI/8)*8,y+Math.sin(i*Math.PI/8)*8]),'#4b5949');
    for(let j=-4;j<6;j+=3)line(c,[x-5,y+j],[x+5,y+j],'#909c7c',.6);
  }
}
