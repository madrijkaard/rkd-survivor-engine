import { project as P } from './projection.js';
import { ALCEBIADES_JULHO, ALCEBIADES_COURT as court } from './alcebiades-julho.js';
import { ALCEBIADES_PROFILE as R } from './road-profiles.js';
const X=-2223;
function poly(c,ps,color,stroke){c.beginPath();ps.forEach((p,i)=>{const q=P(...p);i?c.lineTo(q.x,q.y):c.moveTo(q.x,q.y);});c.closePath();if(color){c.fillStyle=color;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=.8;c.stroke();}}
function rect(c,x,y,w,h,color,z=0){poly(c,[[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z]],color);}
function line(c,a,b,color,width=1){const p=P(...a),q=P(...b);c.beginPath();c.moveTo(p.x,p.y);c.lineTo(q.x,q.y);c.strokeStyle=color;c.lineWidth=width;c.stroke();}
export function drawAlcebiadesJulhoGround(c,asphalt,paving){
  const r=ALCEBIADES_JULHO;
  rect(c,r.x,r.y,r.w,r.h,paving);rect(c,r.x,r.y+R.sidewalkWidth,r.w,R.width,asphalt);
  for(const y of [r.y+R.sidewalkWidth,r.y+r.h-R.sidewalkWidth])line(c,[r.x,y,1],[r.x+r.w,y,1],'#c7c5a7',2);
  // Red walking strip turns around the garden at the Vinte e Oito corner.
  rect(c,X-275,55,52,920,'#a76e60');rect(c,X-745,55,522,48,'#a76e60');
  for(const x of [X-268,X-230])line(c,[x,80,1],[x,945,1],'#d1c9a8',1);
  line(c,[X-735,64,1],[X-235,64,1],'#d1c9a8',1);line(c,[X-735,96,1],[X-235,96,1],'#d1c9a8',1);
  rect(c,X-660,115,370,140,'#90996c');rect(c,X-715,260,385,290,'#c4c0a6');
  rect(c,court.x,court.y,court.w,court.h,'#aaa88a');
  rect(c,court.x+24,court.y+25,court.w-48,court.h-50,'#8d9780');
  poly(c,[[court.x+24,court.y+25,1],[court.x+court.w-24,court.y+25,1],[court.x+court.w-24,court.y+court.h-25,1],[court.x+24,court.y+court.h-25,1]],null,'#e1d6b4');
  line(c,[court.x+24,court.y+court.h/2,1],[court.x+court.w-24,court.y+court.h/2,1],'#e1d6b4',1);
  poly(c,Array.from({length:40},(_,i)=>[court.x+court.w/2+38*Math.cos(i*Math.PI/20),court.y+court.h/2+38*Math.sin(i*Math.PI/20),1]),null,'#e1d6b4');
  // Entrance ramps, painted blue, stop at the facade and leave the sidewalk.
  for(const [y,h] of [[660,30],[405,24],[245,20],[95,30]])rect(c,X+R.outerHalfWidth-8,y,8,h,'#5987a5',1);
}
export function drawAlcebiadesSport(c,p){
  const {x,y,w,h,height:z,kind}=p;
  if(kind==='fence'){
    const a=[x,y],b=[x+w,y+h];
    poly(c,[[...a,0],[...b,0],[...b,15],[...a,15]],'#d2cfb8','#8d967d');
    const len=Math.hypot(w,h);
    for(let d=0;d<=len;d+=10){const t=d/len,xx=x+w*t,yy=y+h*t;line(c,[xx,yy,15],[xx,yy,z],'#587d7977',.55);}
    for(let zz=18;zz<=z;zz+=10)line(c,[...a,zz],[...b,zz],'#587d7977',.55);
    for(let d=0;d<=len;d+=80){const t=d/len;line(c,[x+w*t,y+h*t,0],[x+w*t,y+h*t,z+2],'#3e7381',2);}
    line(c,[...a,z],[...b,z],'#3e7381',2);
  }
  if(kind==='ramp'){
    // Low curved concrete skate ramp; the same footprint blocks walking.
    const north=y>400;
    for(let i=0;i<12;i++){
      const t=i/12,u=(i+1)/12,za=z*(north?t*t:(1-t)**2),zb=z*(north?u*u:(1-u)**2);
      poly(c,[[x,y+h*t,za],[x+w,y+h*t,za],[x+w,y+h*u,zb],[x,y+h*u,zb]],i%2?'#b6b8a5':'#c7c5ae');
    }
    const yy=north?y+h:y;
    poly(c,[[x,yy,0],[x+w,yy,0],[x+w,yy,z],[x,yy,z]],'#b2b49f','#7e8c77');
    for(const xx of [x,x+w])poly(c,[[xx,y,0],[xx,y+h,0],[xx,y+h,north?z:0],[xx,y,north?0:z]],'#c6c4af','#8d967e');
    line(c,[x,yy,z],[x+w,yy,z],'#798478',1.3);
  }
  if(kind==='rail'){
    for(const xx of [x+8,x+w-8])line(c,[xx,y,0],[xx,y,z],'#555f54',2);
    line(c,[x,y,z],[x+w,y,z],'#899487',3);
  }
  if(kind==='shelter'){
    for(const xx of [x,x+w])for(const yy of [y,y+h]){line(c,[xx,yy,0],[xx,yy,z],'#607065',2.5);line(c,[xx,yy,22],[xx,yy,43],'#c0c7b1',3);}
    const ridge=x+w/2;
    poly(c,[[x-8,y-8,z],[ridge,y-8,z+9],[ridge,y+h+8,z+9],[x-8,y+h+8,z]],'#abb1a2','#7a8577');
    poly(c,[[ridge,y-8,z+9],[x+w+8,y-8,z],[x+w+8,y+h+8,z],[ridge,y+h+8,z+9]],'#c0c4b5','#7a8577');
    for(let yy=y-7;yy<y+h+8;yy+=6){line(c,[x-8,yy,z],[ridge,yy,z+9],'#849586',.7);line(c,[ridge,yy,z+9],[x+w+8,yy,z],'#849586',.7);}
    line(c,[x+w,y+10,19],[x+w,y+h-10,19],'#4c5d4e',4);
  }
  if(kind==='table'){
    rect(c,x+10,y+10,7,7,'#aeaf96',22);rect(c,x,y,w,h,'#d1cbb0',z);
    for(const xx of [x-15,x+w+8])rect(c,xx,y+4,9,19,'#c9c5aa',13);
  }
  if(kind==='billboard'){
    for(const yy of [y+12,y+h-12])line(c,[x,yy,0],[x,yy,z],'#985f57',3);
    const a=P(x,y,z),b=P(x,y+h,z),d=P(x,y,z-56);
    c.save();c.transform((b.x-a.x)/240,(b.y-a.y)/240,(d.x-a.x)/112,(d.y-a.y)/112,a.x,a.y);
    c.fillStyle='#dedcc7';c.fillRect(0,0,240,112);
    for(let n=0;n<4;n++){c.fillStyle=['#587394','#7b9b64','#b47762','#6d8094'][n];c.fillRect(24+n*48,35,37,32);}
    // Mirror only lettering when its projected axis points left.
    if(b.x<a.x){c.translate(240,0);c.scale(-1,1);}
    c.fillStyle='#3b586a';c.font='bold 16px Arial';c.textAlign='center';c.fillText('Codó cidade de Deus',120,22);
    c.fillStyle='#9f6255';c.font='bold 13px Arial';c.fillText('CODÓ DIGITAL',120,91);c.restore();
  }
}
export function drawAlcebiadesJulhoFacade(c,b,w,h){
  const d=b.detail,fill=(u,v,ww,hh,color)=>{c.fillStyle=color;c.fillRect(u*w,v*h,ww*w,hh*h);};
  if(d==='as-sicoob-complete'){
    fill(0,.73,1,.27,'#a5b0a9');fill(.32,.40,.52,.60,'#3e757d');fill(.91,0,.09,1,'#b99d85');
    for(let v=.75;v<1;v+=.035)fill(0,v,1,.004,'#d1d5c3');
    for(let u=.02;u<1;u+=.018)fill(u,.75,.003,.25,'#c4cec3');
  }
  if(d==='as-corpus'){
    for(let v=.02;v<1;v+=.06){fill(0,v,1,.007,'#856449');for(let u=.05;u<1;u+=.25)fill(u+(Math.round(v*100)%2)*.12,v,.004,.06,'#946f4c');}
    fill(0,.05,1,.25,'#2f413a');
  }
  if(d==='as-crefisa'||d==='as-crefisa-side'){
    fill(0,.42,1,.58,'#dbddd0');fill(.60,.46,.40,.54,d==='as-crefisa'?'#8c9691':'#dddccc');
    fill(0,.40,1,.025,'#b3a882');fill(0,.04,1,.022,'#bcad85');
    for(const u of d==='as-crefisa'?[.025,.39]:[.04,.85])fill(u,.075,.025,.32,'#e5dfc9');
  }
  if(d==='as-ceo'){
    fill(0,.03,1,.035,'#465749');fill(0,.36,.61,.50,'#a7a489');
    for(const u of [.02,.30,.60])fill(u,.31,.025,.53,'#e0dfcd');
    c.strokeStyle='#63705c';c.lineWidth=2;c.beginPath();c.arc(.765*w,.28*h,.11*w,Math.PI,2*Math.PI);c.stroke();
  }
}
export function drawAlcebiadesJulhoOpeningDetails(c,b,w,h){
  if(b.detail==='as-ceo'){
    c.fillStyle='#b76356';c.fillRect(0,h*.83,w,h*.17);c.strokeStyle='#dbe0cf';c.lineWidth=1;
    for(let x=2;x<w;x+=4){c.beginPath();c.moveTo(x,h*.69);c.lineTo(x,h*.86);c.stroke();}
    for(const y of [.72,.84]){c.beginPath();c.moveTo(0,h*y);c.lineTo(w,h*y);c.stroke();}
  }
  if(!['as-corpus','as-crefisa'].includes(b.detail))return;
  for(const o of b.openings.filter(o=>o.awning)){
    const x=o.u*w,ww=o.w*w,y=(1-o.bottom-o.h)*h;
    c.fillStyle=o.awning;c.beginPath();c.moveTo(x-2,y-4);c.lineTo(x+ww+2,y-4);c.lineTo(x+ww+4,y+15);c.lineTo(x-4,y+15);c.closePath();c.fill();
    c.fillStyle=b.detail==='as-corpus'?'#ae784f':'#426182';c.fillRect(x-4,y+15,ww+8,3);
  }
}
