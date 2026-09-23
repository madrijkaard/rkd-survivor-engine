import { project as P } from './world.js';
import { BAR } from './bar-layout.js';
import { makeDetailedFacade } from './facades.js';
import { drawDetailedBuilding } from './architecture.js';
import { PROJECTION } from './projection.js';
function poly(c,v,fill,stroke){c.beginPath();v.forEach((a,i)=>{const p=P(...a);i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y);});c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=.8;c.stroke();}}
function line(c,a,b,color,width=1){const p=P(...a),q=P(...b);c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(q.x,q.y);c.stroke();}
function slab(c,x,y,w,h,z,color,stroke){poly(c,[[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z]],color,stroke);}
function wall(c,a,b,h,color){poly(c,[[...a,0],[...b,0],[...b,h],[...a,h]],color,'#48523c77');}
function ball(c,x,y,z,color,r=1.4){const p=P(x,y,z);c.fillStyle='#273a3166';c.beginPath();c.ellipse(p.x+.7,p.y+1,r+1,r*.65,0,0,Math.PI*2);c.fill();c.fillStyle=color;c.beginPath();c.arc(p.x,p.y,r,0,Math.PI*2);c.fill();c.fillStyle='#efebc299';c.fillRect(p.x-.5,p.y-.8,.7,.7);}
function drawPoolTable(c,t,index){
  const {x,y,w,h}=t;
  for(const [xx,yy] of [[x+7,y+6],[x+w-7,y+6],[x+7,y+h-6],[x+w-7,y+h-6]])wall(c,[xx-2,yy],[xx+2,yy],20,'#775439');
  poly(c,[[x,y,15],[x+w,y,15],[x+w,y,21],[x,y,21]],'#79543a');
  const sideX=PROJECTION.c>0?x+w:x;
  poly(c,[[sideX,y,15],[sideX,y+h,15],[sideX,y+h,21],[sideX,y,21]],'#5c4935');
  slab(c,x,y,w,h,22,'#a27847','#3e4030');slab(c,x+4,y+4,w-8,h-8,22.5,'#447454','#2c573f');
  line(c,[x+5,y+5,23],[x+w-5,y+5,23],'#729362',1);
  for(const [xx,yy] of [[x+3,y+3],[x+w/2,y+2],[x+w-3,y+3],[x+3,y+h-3],[x+w/2,y+h-2],[x+w-3,y+h-3]])ball(c,xx,yy,23,'#1c2b22',2.3);
  const colors=['#e4cf72','#ab5b3e','#dbd9c4','#466f9e','#d6a260','#7e517c','#c0664b'];
  for(let i=0;i<6;i++)ball(c,x+w*(.48+(i%3)*.053),y+h*(.38+Math.floor(i/3)*.13),24,colors[(i+index)%colors.length],1.35);
  ball(c,x+w*.23,y+h*.67,24,'#e7e0c0',1.5);
  for(let xx=x+12;xx<x+w-10;xx+=15){const p=P(xx,y+1,23);c.fillStyle='#e1cb95';c.fillRect(p.x,p.y,1,1);}
}
function drawCounter(c){
  const t=BAR.counter;
  const sideX=PROJECTION.c>0?t.x+t.w:t.x;
  wall(c,[t.x,t.y],[t.x+t.w,t.y],27,'#936744');wall(c,[sideX,t.y],[sideX,t.y+t.h],27,'#755238');
  for(let xx=t.x+4;xx<t.x+t.w;xx+=15){line(c,[xx,t.y-.1,3],[xx,t.y-.1,25],'#c49a66',.6);line(c,[xx+1,t.y-.1,3],[xx+1,t.y-.1,25],'#68472f',.5);}
  slab(c,t.x-2,t.y-2,t.w+4,t.h+4,29,'#c79c61','#594d36');
  line(c,[t.x,t.y,30],[t.x+t.w,t.y,30],'#e0bc84',1.4);
  for(let i=0;i<3;i++){const p=P(t.x+30+i*37,t.y+6,31);c.fillStyle='#cfd6b9';c.fillRect(p.x,p.y-5,3,5);c.fillStyle='#8b653c';c.fillRect(p.x+.4,p.y-3,2.2,2.5);}
}
function bottles(c){
  const yy=2212;
  for(const z of [29,43]){
    slab(c,-224,yy-4,130,5,z,'#9f8154');
    for(let i=0;i<15;i++){
      const p=P(-219+i*8.2,yy-2,z),height=6+(i%3)*2;
      c.fillStyle=['#477448','#7c5635','#6d8361','#758d85'][i%4];c.fillRect(p.x-1.7,p.y-height,3.4,height);c.fillRect(p.x-.8,p.y-height-3,1.6,3);
      c.fillStyle=i%2?'#cdb889':'#dad2b4';c.fillRect(p.x-1.4,p.y-height*.62,2.8,2.4);c.fillStyle='#b19661';c.fillRect(p.x-.9,p.y-height-3,1.8,.8);
    }
  }
}
function cues(c){
  const x=-231,start=1968;
  for(const z of [12,42])line(c,[x,start,z],[x,start+117,z],'#856344',2);
  for(let i=0;i<10;i++){const yy=start+5+i*11;line(c,[x-.2,yy,6],[x-.2,yy+.8,49],'#cba66c',1.5);line(c,[x-.3,yy,6],[x-.3,yy+.3,18],'#78553a',1.9);line(c,[x-.3,yy+.8,47],[x-.3,yy+.8,50],'#dcd1ac',.75);}
}
export function createPericlesSprite(){
  const image=document.createElement('canvas');image.width=40;image.height=66;const c=image.getContext('2d');
  const limb=(x,y,xx,yy,color,width)=>{c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.stroke();};
  limb(16,39,16,60,'#485c61',5);limb(24,39,25,60,'#405358',5);limb(14,61,19,61,'#30372d',3);limb(23,61,29,61,'#30372d',3);
  c.fillStyle='#bac1ab';c.beginPath();c.moveTo(12,23);c.lineTo(27,23);c.lineTo(28,43);c.lineTo(12,43);c.fill();
  c.fillStyle='#899f91';c.fillRect(13,25,4,15);c.fillStyle='#e0debe';c.fillRect(21,25,5,17);c.fillStyle='#566052';c.fillRect(12,41,16,2);
  limb(12,26,9,36,'#b5bfab',5);limb(9,36,12,44,'#946744',3.5);limb(27,26,31,35,'#bac5b3',5);limb(31,35,29,42,'#ad7d54',3.5);
  c.fillStyle='#986946';c.fillRect(18,18,5,8);c.fillStyle='#b28159';c.beginPath();c.ellipse(20,14,6,8.5,0,0,Math.PI*2);c.fill();
  c.fillStyle='#322e25';c.beginPath();c.ellipse(20,8,6,3.5,-.1,0,Math.PI*2);c.fill();c.fillRect(14,8,2,8);c.fillRect(25,8,1.5,7);
  c.fillStyle='#302c25';c.fillRect(17,13,1.3,1);c.fillRect(23,13,1.3,1);c.fillStyle='#c69969';c.fillRect(20,14,1.2,3);
  // A clearly visible black moustache on the taller, brown-skinned bartender.
  c.fillStyle='#32291f';c.fillRect(16.5,17,3.5,2);c.fillRect(20,17,4,2);c.fillRect(16,18,1,2);c.fillRect(24,18,1,2);
  c.fillStyle='#895838';c.fillRect(19,21,3,1);
  return image;
}
export function createBarScene(bake,boundsFor,building){
  const {bounds:b}=BAR,sprites=[];
  const floor=bake(c=>{
    slab(c,b.x,b.y,b.w,b.h,0,'#ada486');
    for(let yy=b.y;yy<b.y+b.h;yy+=17)for(let xx=b.x;xx<b.x+b.w;xx+=17)slab(c,xx,yy,16.6,16.6,.1,((Math.round(yy/17)+Math.round(xx/17))%4===0)?'#b5ac90':'#bcb398','#898e714b');
    for(const t of BAR.tables)slab(c,t.x+6,t.y-4,t.w+5,t.h+8,.4,'#3a4c393e');
  },boundsFor(b.x,b.y,b.w,b.h),-Infinity,'bar-floor');
  // The far end stays roofed. Cut the foreground end down in the interior
  // composition so its roof cannot conceal the first pool table.
  for(const [start,end] of [[building.y,b.y],[b.y+b.h,building.y+building.length]]){
    const length=end-start;
    const openings=building.openings.map(o=>({...o,u:(building.y+o.u*building.length-start)/length,w:o.w*building.length/length})).filter(o=>o.u>=0 && o.u+o.w<=1.01);
    const part={...building,id:`bar-neighbor-${start}`,y:start,length,openings,signs:[]};
    if(start<b.y){part.height=14;part.roof='flat';part.parapet=0;part.openings=[];}
    const texture=makeDetailedFacade(part);
    sprites.push(bake(c=>drawDetailedBuilding(c,part,texture),boundsFor(part.x-8,start-6,part.depth+16,length+12,part.height+28),P(part.x+part.depth/2,start).y,part.id));
  }
  for(let yy=b.y+5;yy<b.y+b.h-5;yy+=55){
    const end=Math.min(yy+55,b.y+b.h-5);
    const panel=bake(c=>{wall(c,[-233,yy],[-233,end],55,'#c6bc9b');wall(c,[-232.8,yy],[-232.8,end],12,'#698894');line(c,[-233,yy,54],[-233,end,54],'#e0d3ad',1);},boundsFor(-239,yy,12,end-yy,62),P(-233,yy).y,'bar-wall');
    if(PROJECTION.c<0){panel.opacity=.22;panel.noFade=true;}
    sprites.push(panel);
  }
  sprites.push(bake(c=>{wall(c,[-233,2213],[-83,2213],57,'#c9c1a2');wall(c,[-233,2212.8],[-83,2212.8],12,'#68848a');bottles(c);},boundsFor(-241,2204,169,19,64),P(-158,2213).y,'bar-bottles'));
  sprites.push(bake(c=>cues(c),boundsFor(-237,1963,12,128,53),P(-231,1965).y,'bar-cues'));
  BAR.tables.forEach((t,i)=>sprites.push(bake(c=>drawPoolTable(c,t,i),boundsFor(t.x-4,t.y-4,t.w+8,t.h+8,31),P(t.x+t.w/2,t.y).y,`pool-table-${i+1}`)));
  sprites.push(bake(drawCounter,boundsFor(BAR.counter.x-5,BAR.counter.y-5,BAR.counter.w+10,BAR.counter.h+10,39),P(BAR.counter.x+BAR.counter.w/2,BAR.counter.y).y,'bar-counter'));
  // Low cutaway front wall keeps the character and all three tables visible.
  const ranges=[[1887,BAR.doors[0].y],[BAR.doors[0].y+BAR.doors[0].w,BAR.doors[1].y],[BAR.doors[1].y+BAR.doors[1].w,2218]];
  for(const [a,z] of ranges)sprites.push(bake(c=>{wall(c,[-82,a],[-82,z],11,'#558197');line(c,[-82,a,12],[-82,z,12],'#d3bf8e',2);},boundsFor(-87,a,14,z-a,17),P(-82,a).y,'bar-low-wall'));
  const npc=createPericlesSprite(),foot=P(BAR.owner.x,BAR.owner.y);
  sprites.push({image:npc,x:foot.x-20,y:foot.y-61,w:npc.width,h:npc.height,depth:foot.y,label:'pericles',noFade:true});
  return {floor,sprites};
}
