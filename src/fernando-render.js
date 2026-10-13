import { FERNANDO_PROFILE, MENDONCA_ROAD } from './road-profiles.js';
import { FERNANDO_FRONT } from './fernando-data.js';
import { project as P } from './projection.js';
import { FERNANDO_X as X, FERNANDO_WALK, FERNANDO_CROSS, FERNANDO_TRAVESSA } from './fernando-data.js';
function rect(c,x,y,w,h,fill,z=0){c.beginPath();[[x,y],[x+w,y],[x+w,y+h],[x,y+h]].forEach(([xx,yy],i)=>{const p=P(xx,yy,z);i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y);});c.closePath();c.fillStyle=fill;c.fill();}
export function drawFernandoGround(c,asphalt,paving){
  const r=FERNANDO_WALK;
  rect(c,r.x,r.y,r.w,r.h,paving);
  rect(c,X-FERNANDO_PROFILE.halfWidth,r.y,FERNANDO_PROFILE.width,r.h,asphalt);
  for(let y=10;y<r.y+r.h;y+=18)for(const x of [X-FERNANDO_FRONT+1,X+FERNANDO_PROFILE.halfWidth+1])rect(c,x,y,FERNANDO_PROFILE.sidewalkWidth-2,16,'#b5ad95');
  for(const x of [X-FERNANDO_PROFILE.halfWidth,X+FERNANDO_PROFILE.halfWidth])rect(c,x,r.y,1.4,r.h,'#d1c5a8',1);
  for(let i=0;i<45;i++){
    const y=190+i*44,x=X-31+(i*19%47);
    rect(c,x,y,8+i%4*4,4+i%3*3,['#a39c81','#838777','#9b957c'][i%3]);
  }
  for(const a of [FERNANDO_CROSS,FERNANDO_TRAVESSA]){rect(c,a.x,a.y,a.w,a.h,paving);rect(c,a.x,a.y+(a===FERNANDO_CROSS?MENDONCA_ROAD.sidewalkWidth:FERNANDO_PROFILE.sidewalkWidth),a.w,a.h-2*(a===FERNANDO_CROSS?MENDONCA_ROAD.sidewalkWidth:15),asphalt);rect(c,X-FERNANDO_PROFILE.halfWidth,a.y,FERNANDO_PROFILE.width,a.h,asphalt);}
  // Interior observado do terreno murado, sem telhado inventado.
  rect(c,X-FERNANDO_FRONT-178,2182,176,FERNANDO_CROSS.y-2182,'#919968');
  for(let i=0;i<160;i++)rect(c,X-FERNANDO_FRONT-176+(i*29%173),2183+(i*17%(FERNANDO_CROSS.y-2187)),1.5,4+i%6,'#728553',2);
  // Degraus e piso do laboratório; recuo fica dentro do seu lote.
  rect(c,X+FERNANDO_FRONT,980,27,180,'#c2bea5');
  for(let i=0;i<4;i++)rect(c,X+FERNANDO_FRONT+i*6,1024,6,45,i%2?'#b4b39a':'#d0ccb4',i);
}
export function drawFernandoFacade(c,b,w,h){
  const fill=(x,y,ww,hh,color)=>{c.fillStyle=color;c.fillRect(x*w,y*h,ww*w,hh*h);};
  const line=(x,y,xx,yy,color,width=.7)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x*w,y*h);c.lineTo(xx*w,yy*h);c.stroke();};
  const air=(u,v,cage=true)=>{
    fill(u,v,.095,.16,'#bfc4b5');c.strokeStyle='#78877b';c.lineWidth=.6;c.beginPath();c.ellipse((u+.04)*w,(v+.08)*h,Math.min(w*.028,h*.052),h*.052,0,0,Math.PI*2);c.stroke();
    if(cage){for(let x=u-.01;x<u+.12;x+=.024)line(x,v-.015,x,v+.19,'#626f61',.5);for(let y=v;y<v+.2;y+=.045)line(u-.015,y,u+.12,y,'#626f61',.5);}
  };
  if(b.detail==='fc-clinic-side')for(const u of [.10,.42,.74])air(u,.27);
  if(b.detail==='fc-white-clinic')for(const u of [.07,.29])air(u,.24);
  if(b.detail==='fc-green-side'){fill(0,.24,1,.038,'#d2d2bb');line(0,.28,1,.28,'#6d886d',1);}
  if(['fc-brick-white','fc-sealed','fc-rough'].includes(b.detail)){
    for(let y=2;y<h;y+=4)for(let x=0;x<w;x+=9){
      if(b.detail==='fc-rough'){c.fillStyle='#545d4655';c.fillRect(x+(y%3),y,3,1.1);}
      else {c.strokeStyle='#8e796560';c.lineWidth=.45;c.strokeRect(x+(y%8?4:0),y,8,3.5);}
    }
  }
  if(b.detail==='fc-sealed'){for(const u of [.27,.64])fill(u,.72,.025,.14,'#4b513a');fill(0,.10,1,.027,'#a5a089');}
  if(b.detail==='fc-open-shed')for(let x=0;x<1;x+=.17){line(x,0,x+.16,.13,'#c0c6b7');line(x+.16,.13,x+.17,0,'#bdc5b5');}
  if(b.detail==='fc-cross'){fill(0,.21,1,.045,'#a2c644');fill(.97,.21,.03,.79,'#a2c644');}
  if(b.detail==='fc-justica'){fill(.66,0,.34,.70,'#496c9a');fill(.43,0,.20,.70,'#77776c');}
  if(b.detail==='fc-katia'){
    fill(.015,.035,.27,.40,'#a1a29b');
    c.fillStyle='#d9d9cf';c.beginPath();c.ellipse(w*.15,h*.16,w*.055,h*.085,0,0,Math.PI*2);c.fill();
    c.fillStyle='#5f655d';c.beginPath();c.moveTo(w*.08,h*.26);c.lineTo(w*.20,h*.26);c.lineTo(w*.25,h*.43);c.lineTo(w*.045,h*.43);c.fill();
    line(0,.50,1,.50,'#e3ddc7',2);
  }
  if(b.detail==='fc-arches'){
    c.fillStyle='#5b5f49';c.beginPath();c.ellipse(w*.14,h*.50,w*.055,h*.23,0,0,Math.PI*2);c.fill();
    c.strokeStyle='#beb095';c.lineWidth=2;c.stroke();
    for(const u of [.33,.68]){c.fillStyle='#343e31';c.beginPath();c.ellipse(w*(u+.145),h*.23,w*.145,h*.14,0,Math.PI,Math.PI*2);c.fill();}
  }
  if(b.detail==='fc-lab'){fill(.20,.28,.08,.72,'#4778ac');fill(.66,.28,.08,.72,'#4778ac');fill(0,.87,1,.035,'#86a6bd');}
  if(b.detail==='fc-white-awning')fill(.18,.14,.70,.035,'#e0ddc9');
  if(b.detail==='fc-stone-pier'){fill(.78,.23,.22,.77,'#c5b597');for(let y=.24;y<1;y+=.045)line(.78,y,1,y,'#e4d4b6');}
  if(b.detail==='fc-green-awning'){fill(.01,.27,.98,.07,'#387956');line(.01,.34,.99,.34,'#225840',2);}
  if(b.detail==='fc-centro'||b.detail==='fc-centro-side'){fill(0,.10,1,.04,'#e3dcc5');fill(0,.96,1,.04,'#a66955');}
  if(b.detail==='fc-sublime'){fill(0,0,.15,1,'#4c75a5');fill(.15,0,.22,.60,'#b99c78');for(let y=0;y<.60;y+=.03)line(.15,y,.37,y,'#9d8766');fill(.40,.39,.60,.18,'#315f9e');}
  if(b.detail==='fc-agencia'||b.detail==='fc-agencia-side'){
    fill(0,0,.045,1,'#345780');for(let y=0;y<1;y+=.055)line(0,y,.045,y,'#7e9ca7');
    if(b.detail==='fc-agencia-side')air(.26,.32,false);
    else {fill(.04,.79,.91,.022,'#cddacc');for(let x=.04;x<1;x+=.045)fill(x,.31,.024,.10,'#dbe0d0');}
  }
}
