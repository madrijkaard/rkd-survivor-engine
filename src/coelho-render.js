import { COELHO_PROFILE as R } from './road-profiles.js';
import { coelhoCenter, coelhoEdge, COELHO_START, COELHO_END } from './coelho-geometry.js';
import { coelhoTruck } from './coelho-data.js';
import { project as P } from './projection.js';
function poly(c,points,color,stroke){c.beginPath();points.forEach(([x,y,z=0],i)=>{const p=P(x,y,z);i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y);});c.closePath();c.fillStyle=color;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=.8;c.stroke();}}
function strip(c,a,b,low,high,color,z=0){poly(c,[[coelhoEdge(a,low),a,z],[coelhoEdge(a,high),a,z],[coelhoEdge(b,high),b,z],[coelhoEdge(b,low),b,z]],color);}
export function drawCoelhoGround(c,asphalt,paving){
  const a=9,b=COELHO_END.y+20;
  strip(c,a,b,-R.outerHalfWidth,R.outerHalfWidth,paving);
  strip(c,COELHO_START.y,b,-R.halfWidth,R.halfWidth,asphalt);
  // Faixas de terra e vegetação observadas; não são passagens para outra rua.
  for(const [side,start,end] of [[1,175,370],[1,710,805],[1,1190,1640],[-1,1250,1690],[1,2030,2110]]){
    strip(c,start,end,side*R.outerHalfWidth,side*310,'#7e8b61');
    for(let i=0;i<170;i++){const y=start+i*19%(end-start),d=side*(R.outerHalfWidth+4+i*31%195);strip(c,y,y+2+i%4,d,d+side*4,['#8d9770','#60774c','#a09e77'][i%3]);}
  }
  for(let y=12;y<2241;y+=18)for(const side of [-1,1])strip(c,y,y+17,side*R.halfWidth,side*R.outerHalfWidth,'#afa992');
  for(const side of [-1,1])strip(c,a,2241,side*R.halfWidth,side*(R.halfWidth+1.3),'#d2c7aa',1);
  // Rampas e degraus elevados do ginásio e das casas; pista permanece livre.
  for(const [start,end,side] of [[485,575,1],[1770,1850,-1],[1850,1960,-1]]){
    strip(c,start,end,side*75,side*104,'#c2bda7',2);
    for(let i=0;i<4;i++)strip(c,start+8,start+35,side*(80+i*6),side*(86+i*6),'#c8c3ad',i*.8);
  }
  for(let i=0;i<5;i++)strip(c,909,979,-R.halfWidth-i*7,-R.halfWidth-(i+1)*7,i%2?'#aaa690':'#c5c1ac',i*1.2);
  for(let i=0;i<57;i++){const y=60+i*38,d=-30+i*29%62;strip(c,y,y+5+i%11,d,d+7+i%6,'#aa9d7d');}
  for(const y of [490,970,1570,2130]){const p=P(coelhoCenter(y),y);c.fillStyle='#797f70';c.beginPath();c.ellipse(p.x,p.y,7,3,0,0,Math.PI*2);c.fill();}
}
export function drawCoelhoFacade(c,b,w,h){
  const fill=(x,y,ww,hh,color)=>{c.fillStyle=color;c.fillRect(x*w,y*h,ww*w,hh*h);};
  const line=(x,y,xx,yy,color,width=1)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x*w,y*h);c.lineTo(xx*w,yy*h);c.stroke();};
  if(b.detail==='cn-gym'){
    fill(0,.015,1,.22,'#a4ad99');
    for(let y=.045;y<.22;y+=.055)for(let x=0;x<1;x+=.016)fill(x,y,.011,.022,'#59684f');
    for(let x=0;x<1;x+=.125){fill(x,.21,.014,.79,'#bdc6b7');fill(x+.004,0,.005,.57,'#846e53');}
    line(0,.34,1,.34,'#6c624e',1.8);
    fill(.72,0,.17,.47,'#655f4c');
    for(let x=.72;x<.89;x+=.012)line(x,0,x,.47,'#8b8062',.6);
    for(const x of [.71,.8,.89])line(x,0,x,.47,'#a68c66',1.3);
    line(.88,.49,.99,.65,'#b6c1b0',3);line(.88,.59,.99,.75,'#b6c1b0',3);
  }
  if(['cn-cracked','cn-old-plaster','cn-yellow-worn'].includes(b.detail)){
    for(let i=0;i<45;i++){const x=(i*29%101)/101,y=(i*17%89)/100;line(x,y,x+.014,y+.045,'#665f4b66',.65);line(x+.014,y+.045,x+.005,y+.080,'#665f4b66',.55);}
    if(b.detail==='cn-old-plaster'){fill(0,0,1,.29,'#9c9a8b');fill(.70,.3,.29,.4,'#cecbc0');fill(.07,.31,.58,.035,'#baa4b1');}
  }
  if(b.detail==='cn-brick')for(let y=0;y<h;y+=4)for(let x=0;x<w;x+=10){c.strokeStyle='#6f644e88';c.lineWidth=.6;c.strokeRect(x+(y%8?5:0),y,10,4);}
  if(b.detail==='cn-stone'){
    fill(.05,0,.21,1,'#c9b797');for(let y=0;y<1;y+=.06)line(.05,y,.26,y,'#e1cfab');
  }
  if(b.detail==='cn-balcony'){fill(0,.51,1,.085,'#7a8081');line(0,.60,1,.60,'#c3c9bd',1.2);}
  if(b.detail==='cn-gray-bands'){fill(0,.28,1,.03,'#d5d8ca');fill(0,.83,1,.035,'#d5d8ca');}
  if(b.detail==='cn-air')for(const u of [.30,.50]){fill(u,.20,.13,.23,'#d0d4c5');fill(u+.03,.25,.07,.12,'#899688');}
  if(b.detail==='cn-garage-trim'){fill(.015,.17,.72,.05,'#d5d8cb');fill(.015,.17,.035,.83,'#d5d8cb');fill(.71,.17,.035,.83,'#d5d8cb');fill(0,.85,1,.15,'#c2c6ba');}
  if(b.detail==='cn-tile-base'){for(let y=.65;y<1;y+=.06)for(let x=0;x<1;x+=.10)line(x,y,x+.095,y,'#d4d1bc',.7);}
  if(b.detail==='cn-speckle')for(let i=0;i<200;i++)fill((i*37%101)/101,.57+(i*19%42)/100,.008,.009,i%2?'#ced0bf':'#7c8879');
  if(b.detail==='cn-cream')for(const u of [.09,.42]){fill(u,0,.29,1,'#c6b899');for(let x=u;x<u+.29;x+=.018)line(x,0,x,1,'#a4987c',.7);}
  if(b.detail==='cn-security-wall')for(let x=.03;x<1;x+=.15){line(x,0,x,-.14,'#606352');for(let y=-.03;y>-.14;y-=.03)line(x-.012,y,x+.012,y,'#46513f');}
}
export function drawCoelhoOpeningDetails(c,b,w,h){
  if(b.detail!=='cn-arches')return;
  for(const o of b.openings){
    const x=o.u*w,ww=o.w*w,y=(1-o.bottom-o.h)*h,rise=h*.16;
    // Fill only the two upper corners of the rectangular opening, leaving an arch.
    c.fillStyle=b.color;c.beginPath();c.moveTo(x,y);c.lineTo(x+ww,y);c.lineTo(x+ww,y+rise);
    c.bezierCurveTo(x+ww,y-rise*.3,x,y-rise*.3,x,y+rise);c.closePath();c.fill();
  }
}
// Volumetria do caminhão observado, com a mesma planta usada em colisão/sombra.
export function drawCoelhoTruck(c){
  const {x,y,w,h}=coelhoTruck;
  const box=(xx,yy,ww,ll,z,hh,color)=>{
    poly(c,[[xx,yy,z],[xx+ww,yy,z],[xx+ww,yy,z+hh],[xx,yy,z+hh]],color,'#4a4b38');
    for(const sx of [xx,xx+ww])poly(c,[[sx,yy,z],[sx,yy+ll,z],[sx,yy+ll,z+hh],[sx,yy,z+hh]],color,'#4a4b38');
    poly(c,[[xx,yy,z+hh],[xx+ww,yy,z+hh],[xx+ww,yy+ll,z+hh],[xx,yy+ll,z+hh]],color,'#4a4b38');
  };
  box(x,y,w,h,5,8,'#485041');
  for(const xx of [x-2,x+w-4])for(const yy of [y+17,y+h-25])box(xx,yy,6,15,0,13,'#343b33');
  box(x,y,w,33,12,29,'#c1a34f');
  poly(c,[[x+3,y-.2,22],[x+w-3,y-.2,22],[x+w-3,y-.2,36],[x+3,y-.2,36]],'#4d6562');
  box(x+2,y+39,w-4,h-41,13,3,'#8d7751');
  for(const xx of [x,x+w-2])for(let z=18;z<30;z+=5)box(xx,y+37,2,h-37,z,3,'#b49a4b');
  for(let yy=y+39;yy<y+h;yy+=22)for(const xx of [x,x+w-2])box(xx,yy,2,2,15,18,'#424d3b');
}
