import { project as P, PROJECTION } from './projection.js';

function poly(c,vertices,fill,stroke){
  c.beginPath();vertices.forEach((v,i)=>{const p=P(...v);i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y);});c.closePath();c.fillStyle=fill;c.fill();
  if(stroke){c.strokeStyle=stroke;c.lineWidth=.7;c.stroke();}
}
function line(c,a,b,color,width=1){const p=P(...a),q=P(...b);c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(q.x,q.y);c.stroke();}
function tier(c,p,width,depth,z,h){
  const x=p.x-width/2,y=p.y-depth/2;
  const corners=[[x,y],[x+width,y],[x+width,y+depth],[x,y+depth]];
  const faces=corners.map((a,i)=>{const b=corners[(i+1)%4];return {a,b,depth:(P(...a).y+P(...b).y)/2};}).sort((a,b)=>a.depth-b.depth);
  for(const {a,b} of faces)poly(c,[[...a,z],[...b,z],[...b,z+h],[...a,z+h]],a[0]===b[0]?'#bfc3b4':'#deddd0','#868c7666');
  poly(c,corners.map(([x,y])=>[x,y,z+h]),'#e4e1d0','#aaa993');
}

export function drawCinemaMonument(c,p){
  // White square steps and a cream-panelled pedestal from the supplied photos.
  tier(c,p,58,58,0,4);tier(c,p,48,48,4,5);tier(c,p,38,38,9,5);
  tier(c,p,30,30,14,5);tier(c,p,25,25,19,29);
  const nearX=p.x+(PROJECTION.c>0?12.55:-12.55),nearY=p.y+(PROJECTION.d>0?12.55:-12.55);
  poly(c,[[p.x-8,nearY,24],[p.x+8,nearY,24],[p.x+8,nearY,43],[p.x-8,nearY,43]],'#b9a98a');
  poly(c,[[nearX,p.y-8,24],[nearX,p.y+8,24],[nearX,p.y+8,43],[nearX,p.y-8,43]],'#bdaf91');
  poly(c,[[p.x-4,nearY,29],[p.x+4,nearY,29],[p.x+4,nearY,36],[p.x-4,nearY,36]],'#788277','#d0c9b3');
  tier(c,p,31,31,48,3);tier(c,p,28,28,51,2);

  // Four sculpted, flared golden rays around concentric rings; all are world
  // geometry, so thickness and silhouette remain consistent in all four views.
  const farY=p.y+(PROJECTION.d>0?-3:3),faceY=p.y+(PROJECTION.d>0?3:-3);
  const rays=[
    [[-10,53],[10,53],[5,91],[-5,91]],
    [[-5,108],[5,108],[8,126],[0,128],[-8,126]],
    [[-9,94],[-29,91],[-32,102],[-10,107]],
    [[9,94],[29,91],[32,102],[10,107]],
  ];
  const circle=(radius,y)=>Array.from({length:48},(_,i)=>{const a=i*Math.PI/24;return [p.x+Math.cos(a)*radius,y,100+Math.sin(a)*radius];});
  poly(c,circle(14,farY),'#8d672f');
  for(const shape of rays){
    poly(c,shape.map(([x,z])=>[p.x+x,farY,z]),'#92713d');
    for(let i=0;i<shape.length;i++){
      const a=shape[i],b=shape[(i+1)%shape.length];
      poly(c,[[p.x+a[0],farY,a[1]],[p.x+b[0],farY,b[1]],[p.x+b[0],faceY,b[1]],[p.x+a[0],faceY,a[1]]],'#957039');
    }
    poly(c,shape.map(([x,z])=>[p.x+x,faceY,z]),'#b99a54','#d0b16a');
  }
  const insetY=faceY+(PROJECTION.d>0?.15:-.15);
  for(const s of [-1,1]){
    line(c,[p.x+s*7,insetY,54],[p.x+s*3,insetY,88],'#e0c17b',1.2);
    line(c,[p.x+s*5,insetY,125],[p.x+s*2.5,insetY,110],'#e0c17b',1);
    line(c,[p.x+s*12,insetY,98],[p.x+s*29,insetY,96],'#e0c17b',1.3);
    line(c,[p.x+s*12,insetY,102],[p.x+s*29,insetY,100],'#82622e',.8);
  }
  for(const [radius,color] of [[14,'#a48343'],[12.3,'#d5b570'],[10.6,'#91713d'],[9.1,'#c5ad79'],[7.4,'#eeecdb']])poly(c,circle(radius,insetY),color);
  // Small radial marks keep the pale medallion legible without inventing text.
  for(let i=0;i<12;i++){
    const a=i*Math.PI/6;
    line(c,[p.x+Math.cos(a)*5.8,insetY,100+Math.sin(a)*5.8],[p.x+Math.cos(a)*6.5,insetY,100+Math.sin(a)*6.5],'#9a9b86',.45);
  }
}
