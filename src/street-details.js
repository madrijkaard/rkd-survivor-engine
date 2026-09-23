import { project as P } from './world.js';
import { gardenWall, demolitionLot, brickRecess } from './street-data.js';
import { drawCinemaMonument } from './cinema-monument.js';
function rng(seed){let n=seed>>>0;return()=>((n=Math.imul(n,1664525)+1013904223>>>0)/4294967296);}
function poly(c,v,fill,stroke){c.beginPath();v.forEach((a,i)=>{const p=P(...a);i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y);});c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=.7;c.stroke();}}
function line(c,a,b,color,width=1){const p=P(...a),q=P(...b);c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(q.x,q.y);c.stroke();}
function disk(c,x,y,r,z,color){poly(c,Array.from({length:40},(_,i)=>[x+Math.cos(i*Math.PI/20)*r,y+Math.sin(i*Math.PI/20)*r,z]),color);}
function wall(c,a,b,h,color){poly(c,[[...a,0],[...b,0],[...b,h],[...a,h]],color);}
function slab(c,x,y,w,l,z,color){poly(c,[[x,y,z],[x+w,y,z],[x+w,y+l,z],[x,y+l,z]],color);}

export function drawTree(c,t){
  const r=rng(t.seed),p=P(t.x,t.y),height=t.height||t.size*.8,crown=P(t.x,t.y,height);
  if(t.kind==='palm'){
    c.strokeStyle='#77674e';c.lineWidth=5;c.beginPath();c.moveTo(p.x,p.y);c.quadraticCurveTo(p.x-7,p.y-height*.6,crown.x,crown.y);c.stroke();
    c.strokeStyle='#bdad81';c.lineWidth=1.4;c.stroke();
    for(let z=5;z<height;z+=5)line(c,[t.x-2,t.y,z],[t.x+2,t.y,z+1],'#4e5e4277',1);
    for(let i=0;i<13;i++){
      const a=i*Math.PI*2/13,dx=Math.cos(a)*t.size*.64,dy=Math.sin(a)*t.size*.34;
      c.strokeStyle=i%2?'#648346':'#8fa365';c.lineWidth=1.6;c.beginPath();c.moveTo(crown.x,crown.y);c.quadraticCurveTo(crown.x+dx*.48,crown.y+dy-19,crown.x+dx,crown.y+dy+14);c.stroke();
      for(let j=1;j<14;j++){const f=j/14,xx=crown.x+dx*f,yy=crown.y+dy*f-21*Math.sin(f*Math.PI)+14*f;for(const side of [-1,1]){c.strokeStyle=j%3?'#557540':'#9ea96b';c.lineWidth=.8;c.beginPath();c.moveTo(xx,yy);c.lineTo(xx+side*(1-f)*9,yy+8*(1-f)+3);c.stroke();}}
    }
    return;
  }
  const young=t.kind==='young'||t.kind==='sapling';
  if(t.spreading){
    c.lineCap='round';
    line(c,[t.x,t.y,0],[t.x-3,t.y,height*.74],'#66604a',t.size*.075);
    line(c,[t.x-2,t.y,2],[t.x-4,t.y,height*.69],'#b4aa8277',2);
    for(let i=0;i<7;i++){
      const a=i*Math.PI*2/7,dx=Math.cos(a)*t.size*.47,dy=Math.sin(a)*t.size*.28;
      line(c,[t.x-2,t.y,height*.45],[t.x+dx*.5,t.y+dy*.5,height*.76],'#696249',4);
      line(c,[t.x+dx*.5,t.y+dy*.5,height*.76],[t.x+dx,t.y+dy,height],'#716c4d',2);
    }
    for(let i=0;i<720;i++){
      const a=r()*Math.PI*2,rr=Math.sqrt(r())*t.size*.72,dx=Math.cos(a)*rr,dy=Math.sin(a)*rr*.64;
      const light=-dx/t.size*.35-dy/t.size*.8+r()*.6;
      c.fillStyle=light>.7?'#98a260':light>.38?'#6e8b49':light>.05?'#4e733e':'#355537';
      c.beginPath();c.ellipse(crown.x+dx,crown.y+dy,4+r()*7,3+r()*6,a,0,Math.PI*2);c.fill();
    }
    c.lineCap='butt';return;
  }
  c.strokeStyle='#686449';c.lineWidth=young?2:4;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(crown.x,crown.y+8);c.stroke();
  c.strokeStyle='#b1ab80';c.lineWidth=.7;c.stroke();
  const branches=young?7:10;
  for(let i=0;i<branches;i++){
    const angle=r()*Math.PI*2,rr=t.size*(young?.45:.33),dx=Math.cos(angle)*rr,dy=Math.sin(angle)*rr*.45;
    c.strokeStyle='#706b4e';c.lineWidth=young?.9:1.5;c.beginPath();c.moveTo(crown.x,crown.y+10);c.lineTo(crown.x+dx,crown.y+dy);c.stroke();
  }
  const count=young?(t.kind==='sapling'?36:80):330;
  for(let i=0;i<count;i++){
    const a=r()*Math.PI*2,rr=Math.sqrt(r())*t.size*.53,px=crown.x+Math.cos(a)*rr,py=crown.y+Math.sin(a)*rr*.6;
    const light=-Math.cos(a)*.4-Math.sin(a)*.7+r()*.8;
    c.fillStyle=light>.9?'#a9ad6c':light>.4?'#859855':light>-.1?'#587b47':'#3a593b';
    c.beginPath();c.ellipse(px,py,(young?1:3)+r()*(young?2.5:7),(young?1:2)+r()*(young?2:4),a,0,Math.PI*2);c.fill();
  }
}

export function drawPlanter(c,p){
  if(p.monument){
    drawCinemaMonument(c,p);return;
  }
  const tiers=p.tiers||2,r=rng(p.x+p.y);
  for(let tier=0;tier<tiers;tier++){
    const rad=p.r+4-tier*7,base=tier*6;
    for(let z=base;z<base+5;z++)disk(c,p.x,p.y,rad,z,tier===2?'#a89d62':tier===1?'#a65d57':'#b4af93');
    disk(c,p.x,p.y,rad,base+6,'#d0c9ac');
    for(let i=0;i<rad*2;i++){const a=r()*Math.PI*2,q=P(p.x+Math.cos(a)*rad,p.y+Math.sin(a)*rad,base+r()*5);c.fillStyle=i%3?'#7588756e':'#dad2b793';c.fillRect(q.x,q.y,1+r()*3,1+r()*2);}
  }
  const inner=p.r+4-(tiers-1)*7-3,z=tiers*6;
  disk(c,p.x,p.y,inner,z,'#90975f');
  for(let i=0;i<90;i++){const a=r()*Math.PI*2,rr=Math.sqrt(r())*inner,q=P(p.x+Math.cos(a)*rr,p.y+Math.sin(a)*rr,z);c.fillStyle=['#718745','#a7a26c','#aeb77b'][i%3];c.fillRect(q.x,q.y,1,2+r()*3);}
}
export function drawLampBench(c){
  const x=311,y=165;
  for(const a of [0,Math.PI/2,Math.PI,Math.PI*1.5])line(c,[x+Math.cos(a)*21,y+Math.sin(a)*21,0],[x+Math.cos(a)*21,y+Math.sin(a)*21,8],'#969f84',4);
  const outer=[],inner=[];for(let i=0;i<40;i++){const a=i*Math.PI/20;outer.push(P(x+Math.cos(a)*26,y+Math.sin(a)*26,9));inner.push(P(x+Math.cos(a)*19,y+Math.sin(a)*19,9));}
  c.beginPath();outer.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();inner.reverse().forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();c.fillStyle='#c6c9ab';c.fill('evenodd');
}
export function drawGardenWall(c){
  const {x,y,length:l,height:h,gateY,gateWidth,sealedY}=gardenWall,r=rng(300);
  wall(c,[x,y],[x,y+l],h,'#c1c5b1');wall(c,[x,gateY-9],[x,y+l],h+16,'#bbbeaa');
  for(let z=2;z<h+16;z+=3)for(let yy=y;yy<y+l;yy+=7){if(z>h && yy<gateY-9)continue;line(c,[x-.2,yy,z],[x-.2,yy+6.5,z],z%2?'#59684b73':'#e1dbc66a',.65);line(c,[x-.2,yy+(z%6?3:0),z],[x-.2,yy+(z%6?3:0),z+3],'#74806472',.45);}
  for(let yy=y+12;yy<y+l;yy+=58){wall(c,[x-.9,yy],[x-.9,yy+4],h+2,'#d0ceb8');}
  for(let i=0;i<330;i++){const yy=y+r()*l,zz=r()*(yy>gateY-9?h+16:h),p=P(x-.7,yy,zz);c.fillStyle=i%3?'#4e5e4847':'#ece2bc78';c.fillRect(p.x,p.y,1+r()*3,1+r()*3);}
  wall(c,[x-1,gateY],[x-1,gateY+gateWidth],44,'#737e55');
  for(let yy=gateY+2;yy<gateY+gateWidth;yy+=3)line(c,[x-1.2,yy,0],[x-1.2,yy,43],'#a5a477',.6);
  line(c,[x-1.3,gateY+gateWidth*.53,0],[x-1.3,gateY+gateWidth*.53,44],'#364d36',1.3);
  poly(c,[[x-1,sealedY,22],[x-1,sealedY+20,22],[x-1,sealedY+20,42],[x-1,sealedY,42]],'#c6bca3');
  for(let z=24;z<42;z+=3)line(c,[x-1.1,sealedY,z],[x-1.1,sealedY+20,z],'#9d8c7170',.6);
  for(let yy=y+15;yy<y+l;yy+=53)line(c,[x+1,yy,h],[x+1,yy,h+15],'#6b7156',1);
  for(const zz of [h+9,h+14])line(c,[x+1,y,zz],[x+1,y+l,zz],'#6c745150',.4);
}
export function drawDemolition(c){
  const {x,y,depth:w,length:l}=demolitionLot,r=rng(891);
  for(const yy of [y+l,y]){
    const v=[[x,yy,0],[x+w,yy,0],[x+w,yy,44],[x+w*.7,yy,50],[x+w*.55,yy,41],[x+w*.33,yy,55],[x,yy,55]];
    poly(c,v,'#aa7956');
    poly(c,[[x,yy,8],[x+w*.93,yy,8],[x+w*.93,yy,37],[x+w*.73,yy,38],[x+w*.57,yy,33],[x+w*.33,yy,47],[x,yy,46]],'#d3ccb6');
    for(let z=3;z<53;z+=3)for(let xx=x;xx<x+w;xx+=8){if(z<38&&xx>x+7&&xx<x+w-12)continue;line(c,[xx,yy,z],[xx+7,yy,z],'#6c674256',.5);}
    for(let i=0;i<90;i++){const p=P(x+r()*w,yy,r()*42);c.fillStyle='#917c6045';c.fillRect(p.x,p.y,1+r()*3,1+r()*5);}
  }
  wall(c,[x-2,y],[x-2,y+l],4,'#547e9b');
  for(let i=0;i<100;i++){const p=P(x+r()*w,y+r()*l,1);c.fillStyle=i%3?'#b49a7066':'#8f7b5b';c.fillRect(p.x,p.y,1+r()*3,1+r()*2);}
}
export function drawBrickRecess(c){
  const {x,y,depth:w,length:l}=brickRecess;
  const front=x+w*.7;
  wall(c,[front,y+3],[front,y+l-4],43,'#a66f48');
  for(let z=3;z<43;z+=3)for(let yy=y+3;yy<y+l-4;yy+=7){line(c,[front-.2,yy,z],[front-.2,yy+6,z],'#d0a57788',.5);line(c,[front-.2,yy,z],[front-.2,yy,z+3],'#755c3f',.4);}
  poly(c,[[front,y+3,43],[front,y+l*.47,58],[front,y+l-4,43]],'#9d6c49');
  poly(c,[[x,y+3,43],[x+w*.35,y+3,58],[x+w*.35,y+l-4,58],[front,y+l-4,43]],'#8c6949','#544f39');
  wall(c,[front-.8,y+9],[front-.8,y+20],32,'#7c7a5c');
  poly(c,[[front-1,y+31,28],[front-1,y+45,28],[front-1,y+45,35],[front-1,y+31,35]],'#3b4d38');
  wall(c,[x+w,y],[x+w,y+l*.54],14,'#a87853');
  for(let z=3;z<14;z+=3)line(c,[x+w,y,z],[x+w,y+l*.54,z],'#caa67c',.6);
  const r=rng(883);for(let i=0;i<100;i++){const p=P(front+r()*(x+w-front),y+r()*l,2+r()*10);c.fillStyle=i%2?'#547646':'#82945b';c.fillRect(p.x,p.y,2,2+r()*3);}
}
export function drawShrub(c,b){const r=rng(b.x+b.y);for(let i=0;i<120;i++){const a=r()*Math.PI*2,rr=Math.sqrt(r())*b.r,p=P(b.x+Math.cos(a)*rr,b.y+Math.sin(a)*rr,6+r()*13);c.fillStyle=i%4?'#55723a':'#a6a869';c.beginPath();c.ellipse(p.x,p.y,2+r()*3,1.7+r()*2,0,0,Math.PI*2);c.fill();if(b.flowers!==false&&i%3===0){c.fillStyle=i%2?'#cf6a44':'#e4814b';c.fillRect(p.x,p.y,2,2);}}}
export function drawBin(c,b){const p=P(b.x,b.y,23);line(c,[b.x,b.y,0],[b.x,b.y,22],'#546557',1.5);c.strokeStyle='#576650';c.lineWidth=.8;if(b.kind==='wire'){for(let i=0;i<6;i++){c.beginPath();c.moveTo(p.x,p.y+4);c.quadraticCurveTo(p.x-10+i*4,p.y-15,p.x-9+i*3.6,p.y-7);c.stroke();}c.beginPath();c.ellipse(p.x,p.y-6,9,3,0,0,Math.PI*2);c.stroke();}else{c.fillStyle='#657262';c.fillRect(p.x-6,p.y-8,12,14);c.fillStyle='#334b3b';c.beginPath();c.ellipse(p.x,p.y-8,6,2.5,0,0,Math.PI*2);c.fill();}}
export function drawBillboard(c){
  for(const x of [120,264])line(c,[x,495,0],[x,495,71],'#4e5b49',2.5);
  const image=document.createElement('canvas');image.width=360;image.height=130;const t=image.getContext('2d');
  t.fillStyle='#d3c8b4';t.fillRect(0,0,360,130);t.fillStyle='#85535c';t.fillRect(295,0,65,130);t.font='12px Arial';t.fillStyle='#595c54';t.fillText('PRODUTOS',24,21);t.font='italic bold 37px Georgia';t.fillText('Faxyna',22,62);t.font='bold 20px Arial';t.fillStyle='#d2b970';t.fillText('FC',310,27);
  for(let i=0;i<5;i++){t.fillStyle=['#3b4944','#5b5551','#6d715e'][i%3];t.fillRect(27+i*47,87-(i%2)*8,29,22+(i%2)*8);t.fillStyle='#a18762';t.fillRect(32+i*47,80-(i%2)*8,18,8);}
  t.fillStyle='#7c6d57';t.font='7px Arial';t.fillText('PRODUTOS PARA DEIXAR SUA CASA MAIS LIMPA',22,122);
  const a=P(104,495,78),b=P(280,495,78),d=P(104,495,24);c.save();c.transform((b.x-a.x)/360,(b.y-a.y)/360,(d.x-a.x)/130,(d.y-a.y)/130,a.x,a.y);c.drawImage(image,0,0);c.restore();
}
