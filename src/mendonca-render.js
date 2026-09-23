import { project as P, PROJECTION } from './projection.js';
import { CROSS_Y, MENDONCA_END, CHURCH_PLAZA, PLAZA_CHURCH, CHURCH_TOWER, plazaRoads, mendoncaTrees } from './mendonca-data.js';
function poly(c,vertices,fill,stroke) {
  c.beginPath();vertices.forEach((v,i)=>{const p=P(...v);i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y);});c.closePath();
  if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=.7;c.stroke();}
}
function line(c,a,b,color,width=1){const p=P(...a),q=P(...b);c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(q.x,q.y);c.stroke();}
function rect(c,x,y,w,h,color,z=0){poly(c,[[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z]],color);}
export function drawMendoncaGround(c,asphalt,paving) {
  rect(c,0,CROSS_Y-65,MENDONCA_END+70,130,paving);
  rect(c,-80,CROSS_Y-50,MENDONCA_END+150,100,asphalt);
  for(const r of plazaRoads)rect(c,r.x,r.y,r.w,r.h,asphalt);
  for(const y of [CROSS_Y-50,CROSS_Y+50]){
    line(c,[0,y,1],[1190,y,1],'#c0c1a3',2);
    line(c,[1325,y,1],[MENDONCA_END-70,y,1],'#b6bb9b',2);
  }
  for(let x=2;x<MENDONCA_END-70;x+=19)for(const y of [2282,2398]){
    if(x>1190&&x<1325)continue;
    line(c,[x,y],[x,y+12],'#79806b77',.7);
  }
  for(let x=17;x<MENDONCA_END;x+=49){
    const y=CROSS_Y+Math.sin(x*.12)*26;
    poly(c,[[x,y],[x+28,y-4],[x+37,y+9],[x+23,y+25],[x-3,y+18]],'#434e413e');
    line(c,[x,y],[x+40,y+5],'#35423766',.6);
  }
  const {x,y,w,h}=CHURCH_PLAZA;
  // The full elevated paving continues underneath the church and around it.
  for(let i=0;i<4;i++){
    rect(c,x+i*5,y+i*7,w-i*10,h-i*12,i%2?'#c98c84':'#d4a095',i*1.5);
    line(c,[x+i*5,y+i*7,i*1.5],[x+w-i*5,y+i*7,i*1.5],'#7b806a',1);
  }
  rect(c,x+20,y+28,w-40,h-48,paving,6);
  for(let xx=x+20;xx<x+w-20;xx+=23)for(let yy=y+28;yy<y+h-20;yy+=23){
    line(c,[xx,yy,6],[Math.min(xx+22,x+w-20),yy,6],'#7f89766b',.7);
    line(c,[xx,yy,6],[xx,Math.min(yy+22,y+h-20),6],'#7f89766b',.7);
  }
  // Sandy grass beds separated by faded red paths toward the church.
  for(const [xx,yy,ww,hh] of [[x+40,y+190,180,100],[x+265,y+190,w-310,100],[x+40,y+350,180,65],[x+260,y+350,w-305,65]]){
    rect(c,xx,yy,ww,hh,'#b4ae8a',6);
    for(let n=0;n<70;n++){const p=P(xx+(n*37)%ww,yy+(n*53)%hh,6);c.fillStyle=n%3?'#7e8b5066':'#879556';c.fillRect(p.x,p.y,3,2);}
  }
  rect(c,x+222,y+150,37,290,'#b48278',6);
  rect(c,x+30,y+306,w-60,35,'#b48278',6);
  for(const t of mendoncaTrees.filter(t=>t.plaza)){rect(c,t.x-16,t.y-16,32,32,'#d4d6be',7);rect(c,t.x-12,t.y-12,24,24,'#7b825b',8);}
  for(let n=0;n<140;n++){
    const x=40+(n*113)%(MENDONCA_END-80),y=CROSS_Y+(n%2?1:-1)*(51+n%11),p=P(x,y);
    c.fillStyle=n%3?'#7b885752':'#a4a27360';c.fillRect(p.x,p.y,2,3);
  }
}
function box(c,x,y,w,l,z,h,color){
  const nearY=PROJECTION.d>0?y+l:y,nearX=PROJECTION.c>0?x+w:x;
  poly(c,[[x,nearY,z],[x+w,nearY,z],[x+w,nearY,z+h],[x,nearY,z+h]],color,'#7c8065');
  poly(c,[[nearX,y,z],[nearX,y+l,z],[nearX,y+l,z+h],[nearX,y,z+h]],'#b9aa88','#797f61');
  rect(c,x,y,w,l,'#d5c7a4',z+h);
}
export function drawChurchTower(c){
  const {x,y,w,h:l}=CHURCH_TOWER;
  box(c,x,y,w,l,7,248,'#d4c49b');
  const nearY=PROJECTION.d>0?y+l:y,nearX=PROJECTION.c>0?x+w:x;
  for(const z of [140,193])for(const u of [.28,.67]){
    poly(c,[[x+w*u-3,nearY,z],[x+w*u+3,nearY,z],[x+w*u+3,nearY,z+22],[x+w*u,nearY,z+28],[x+w*u-3,nearY,z+22]],'#565c4e');
    poly(c,[[nearX,y+l*u-3,z],[nearX,y+l*u+3,z],[nearX,y+l*u+3,z+22],[nearX,y+l*u,z+28],[nearX,y+l*u-3,z+22]],'#525d51');
  }
  box(c,x-2,y-2,w+4,l+4,247,7,'#d5c49e');
  const peak=[x+w/2,y+l/2,350];
  poly(c,[[x+9,y+9,254],[x+w-9,y+9,254],peak],'#6e7c7c','#4e635d');
  poly(c,[[x+w-9,y+9,254],[x+w-9,y+l-9,254],peak],'#89938c','#526a60');
  poly(c,[[x+w-9,y+l-9,254],[x+9,y+l-9,254],peak],'#7e8c85','#526a60');
  poly(c,[[x+9,y+l-9,254],[x+9,y+9,254],peak],'#687b74','#526a60');
  for(const dx of [0,w-8])for(const dy of [0,l-8]){
    box(c,x+dx,y+dy,8,8,250,25,'#c5b48f');
    poly(c,[[x+dx-1,y+dy,275],[x+dx+9,y+dy+8,275],[x+dx+4,y+dy+4,298]],'#758b83');
  }
  line(c,[x+w/2,y+l/2,349],[x+w/2,y+l/2,362],'#617267',1.2);
  line(c,[x+w/2-4,y+l/2,358],[x+w/2+4,y+l/2,358],'#617267',1.2);
}

function arch(c,axis,fixed,start,width,bottom,height,color){
  const v=(u,z)=>axis==='x'?[u,fixed,z]:[fixed,u,z];
  poly(c,[v(start,bottom),v(start+width,bottom),v(start+width,bottom+height*.72),v(start+width*.73,bottom+height*.90),v(start+width*.5,bottom+height),v(start+width*.27,bottom+height*.90),v(start,bottom+height*.72)],color,'#b4b496');
  line(c,v(start+width*.5,bottom+2),v(start+width*.5,bottom+height-5),'#77816b',.8);
}
function naveRoof(c,x,y,w,l,z,rise){
  const ridge=y+l/2;
  const halves=[[[x,y,z],[x+w,y,z],[x+w,ridge,z+rise],[x,ridge,z+rise]],[[x,ridge,z+rise],[x+w,ridge,z+rise],[x+w,y+l,z],[x,y+l,z]]];
  for(const [i,verts] of halves.entries())poly(c,verts,i?'#a77b58':'#b98a65','#69593f');
  for(let xx=x;xx<x+w;xx+=5){line(c,[xx,y,z],[xx,ridge,z+rise],'#ddba8490',.8);line(c,[xx,ridge,z+rise],[xx,y+l,z],'#d5a87988',.8);}
  for(let yy=y;yy<=y+l;yy+=7){const h=z+rise*(1-Math.abs(yy-ridge)/(l/2));line(c,[x,yy,h],[x+w,yy,h],'#6c583f75',.6);}
}
export function drawChurchNave(c){
  const {x,y,w,h:l}=PLAZA_CHURCH,sideY=PROJECTION.d>0?y+l:y,frontX=PROJECTION.c>0?x+w:x;
  box(c,x,y,w,l,7,128,'#d7cda8');
  poly(c,[[x,sideY,7],[x+w,sideY,7],[x+w,sideY,16],[x,sideY,16]],'#63818c');
  for(let i=0;i<=8;i++){
    const xx=x+6+i*(w-18)/8;
    poly(c,[[xx,sideY,13],[xx+7,sideY,13],[xx+7,sideY,135],[xx,sideY,135]],'#e0ddcb');
    if(i<8)arch(c,'x',sideY,xx+24,15,29,70,'#617566');
  }
  arch(c,'y',frontX,y+l*.40,l*.20,8,89,'#776f53');
  for(const u of [.12,.77])arch(c,'y',frontX,y+l*u,17,29,66,'#677366');
  naveRoof(c,x-5,y-5,w+10,l+10,135,27);
  // A narrower upper nave produces the two tiled eaves visible in the photographs.
  box(c,x+2,y+44,w-4,l-88,149,32,'#d4c59e');
  const upperY=PROJECTION.d>0?y+l-44:y+44;
  for(let i=0;i<10;i++)arch(c,'x',upperY,x+20+i*(w-37)/10,9,153,15,'#536851');
  naveRoof(c,x-2,y+39,w+4,l-78,181,20);
}
export function drawPlazaSeat(c,s){box(c,s.x,s.y,s.w,s.h,6,15,'#ae796d');}
export function drawPlazaStatue(c,s){
  box(c,s.x-4,s.y-4,s.w+8,s.h+8,6,6,'#d6d2ba');
  box(c,s.x,s.y,s.w,s.h,12,28,'#d8d5c3');
  const cx=s.x+s.w/2,cy=s.y+s.h/2,p=P(cx,cy,67);
  poly(c,[[cx-7,cy,40],[cx+7,cy,40],[cx+4,cy,66],[cx-4,cy,66]],'#536151');
  c.fillStyle='#4d5e50';c.beginPath();c.arc(p.x,p.y-3,4,0,Math.PI*2);c.fill();
}
