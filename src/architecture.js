import { project } from './world.js';
import { PROJECTION } from './projection.js';
import { buildingPlanPoint } from './building-geometry.js';
let drawingBuilding=null;
function P(x,y,z=0){const p=drawingBuilding?buildingPlanPoint(drawingBuilding,x,y):{x,y};return project(p.x,p.y,z);}
function rng(seed) { let n=seed>>>0;return()=>((n=Math.imul(n,1664525)+1013904223>>>0)/4294967296); }
function poly(c,points,fill,stroke) { c.beginPath();points.forEach((v,i)=>{const p=P(...v);i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y);});c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=.7;c.stroke();} }
function line(c,a,b,color,width=1) {const p=P(...a),q=P(...b);c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(q.x,q.y);c.stroke();}
function surface(c,image,a,b,d,lightPass=false) {
  const p=P(...a),q=P(...b),r=P(...d);c.save();
  c.transform((q.x-p.x)/image.width,(q.y-p.y)/image.width,(r.x-p.x)/image.height,(r.y-p.y)/image.height,p.x,p.y);
  if(lightPass) {
    // The opaque wall hides any farther face before its windows emit light.
    c.fillStyle='#000';c.fillRect(0,0,image.width,image.height);
    c.globalCompositeOperation='source-over';
  }
  c.drawImage(image,0,0);c.restore();
}
function shade(hex,n){const v=parseInt(hex.slice(1),16);return `rgb(${Math.max(0,Math.min(255,(v>>16)+n))},${Math.max(0,Math.min(255,((v>>8)&255)+n))},${Math.max(0,Math.min(255,(v&255)+n))})`;}
function wall(c,a,b,h,color,base,ratio=.22) {poly(c,[[...a,0],[...b,0],[...b,h],[...a,h]],color,'#414f3a77');if(ratio)poly(c,[[...a,0],[...b,0],[...b,h*ratio],[...a,h*ratio]],base);}
function roof(c,x,y,w,l,h,kind,color,seed) {
  const r=rng(seed), rx=x-3,ry=y-3,rw=w+6,rl=l+6;
  if(kind==='barrel') {
    const z=t=>h+Math.sin(t*Math.PI)*29;
    for(let i=0;i<18;i++){
      const a=i/18,b=(i+1)/18;
      poly(c,[[rx+rw*a,ry,z(a)],[rx+rw*b,ry,z(b)],[rx+rw*b,ry+rl,z(b)],[rx+rw*a,ry+rl,z(a)]],i<9?'#a8b1a9':'#c3c9bc','#7e8980');
    }
    for(const yy of [ry,ry+rl])poly(c,Array.from({length:19},(_,i)=>[rx+rw*i/18,yy,z(i/18)]),'#b5bdb0','#758578');
    return;
  }
  if(kind==='flat') {
    poly(c,[[rx,ry,h],[rx+rw,ry,h],[rx+rw,ry+rl,h],[rx,ry+rl,h]],'#a4a18b','#6c7562');
    for(let i=0;i<500;i++) {const p=P(rx+r()*rw,ry+r()*rl,h);c.fillStyle=i%3?'#4a62502b':'#d6cfaa45';c.fillRect(p.x,p.y,2+r()*5,1+r()*3);}
    for(const [a,b] of [[[rx,ry],[rx+rw,ry]],[[rx+rw,ry],[rx+rw,ry+rl]],[[rx,ry+rl],[rx+rw,ry+rl]]])poly(c,[[...a,h],[...b,h],[...b,h+7],[...a,h+7]],'#a4a48e');
    return;
  }
  const ridge=rx+rw*.5,rise=kind==='shed'?8:17,base=color||'#a47753';
  poly(c,[[rx,ry,h],[ridge,ry,h+rise],[ridge,ry+rl,h+rise],[rx,ry+rl,h]],shade(base,-20),'#5a503b');
  poly(c,[[ridge,ry,h+rise],[rx+rw,ry,h],[rx+rw,ry+rl,h],[ridge,ry+rl,h+rise]],base,'#675039');
  for(let xx=rx+1;xx<rx+rw;xx+=4.7) {const z=h+rise*(1-Math.abs(xx-ridge)/(rw/2));line(c,[xx,ry,z],[xx,ry+rl,z],xx<ridge?'#baa27a80':'#d6ad7973',1.15);}
  for(let yy=ry;yy<ry+rl;yy+=7.6) {line(c,[rx,yy,h+.5],[ridge,yy,h+rise+.5],'#57453083',.65);line(c,[ridge,yy,h+rise+.5],[rx+rw,yy,h+.5],'#5e473078',.65);}
  for(let i=0;i<rw*rl*.009;i++) {const xx=rx+r()*rw,yy=ry+r()*rl,zz=h+rise*(1-Math.abs(xx-ridge)/(rw/2)),p=P(xx,yy,zz+.6);c.fillStyle=['#bf896464','#463d2e70','#d1a47661'][i%3];c.fillRect(p.x,p.y,2+r()*3,1+r()*2);}
  line(c,[ridge,ry,h+rise],[ridge,ry+rl,h+rise],'#c39765',2.4);
  line(c,[rx+rw,ry,h],[rx+rw,ry+rl,h],'#4d4932',2);
  // Individual curved clay ends, visible along the eaves.
  for(let yy=ry;yy<ry+rl;yy+=4.8){const p=P(rx+rw,yy,h);c.fillStyle='#b78c63';c.fillRect(p.x,p.y,1.4,1.6);}
}
function plant(c,x,y,z,size,seed) {
  const r=rng(seed),p=P(x,y,z);line(c,[x,y,0],[x,y,z],'#65634a',1.4);
  for(let i=0;i<28;i++){const a=r()*Math.PI*2,len=size*(.4+r()*.6);c.strokeStyle=i%3?'#587448':'#91a266';c.lineWidth=1.1;c.beginPath();c.moveTo(p.x,p.y);c.quadraticCurveTo(p.x+Math.cos(a)*len*.55,p.y-9+Math.sin(a)*len*.3,p.x+Math.cos(a)*len,p.y+Math.sin(a)*len*.55);c.stroke();}
}
function libraryRoof(c,x,y,w,l,h){
  // Hipped clay roofs around the raised, ventilated central roof lantern.
  function hip(xx,yy,ww,ll,z,rise,ridge=false){
    const ix=xx+ww*(ridge?.5:.19),iy=yy+ll*.13,iw=ridge?0:ww*.62,il=ll*.74;
    for(const [a,b,d,e,color] of [
      [[xx,yy,z],[xx+ww,yy,z],[ix+iw,iy,z+rise],[ix,iy,z+rise],'#ab8059'],
      [[xx+ww,yy,z],[xx+ww,yy+ll,z],[ix+iw,iy+il,z+rise],[ix+iw,iy,z+rise],'#b88a5e'],
      [[xx+ww,yy+ll,z],[xx,yy+ll,z],[ix,iy+il,z+rise],[ix+iw,iy+il,z+rise],'#976c49'],
      [[xx,yy+ll,z],[xx,yy,z],[ix,iy,z+rise],[ix,iy+il,z+rise],'#896344']]){
      poly(c,[a,b,d,e],color,'#69573e');
      const count=Math.max(8,Math.round(Math.hypot(b[0]-a[0],b[1]-a[1])/5));
      for(let n=0;n<=count;n++){const t=n/count;line(c,a.map((v,k)=>v+(b[k]-v)*t),e.map((v,k)=>v+(d[k]-v)*t),'#dab18577',.9);}
      for(const t of [.25,.5,.75])line(c,a.map((v,k)=>v+(e[k]-v)*t),b.map((v,k)=>v+(d[k]-v)*t),'#66513b77',.65);
    }
    poly(c,[[ix,iy,z+rise],[ix+iw,iy,z+rise],[ix+iw,iy+il,z+rise],[ix,iy+il,z+rise]],'#b38d63');
  }
  hip(x-5,y-5,w+10,l+10,h,18);
  const ix=x+w*.17,iy=y+l*.12,iw=w*.66,il=l*.76,z=h+18;
  for(const xx of [ix,ix+iw]){
    poly(c,[[xx,iy,z],[xx,iy+il,z],[xx,iy+il,z+20],[xx,iy,z+20]],'#625d49');
    for(let yy=iy;yy<iy+il;yy+=45)poly(c,[[xx,yy,z],[xx,Math.min(yy+7,iy+il),z],[xx,Math.min(yy+7,iy+il),z+20],[xx,yy,z+20]],'#c4bfa2');
  }
  for(const yy of [iy,iy+il])poly(c,[[ix,yy,z],[ix+iw,yy,z],[ix+iw,yy,z+20],[ix,yy,z+20]],'#9b957b');
  hip(ix-4,iy-4,iw+8,il+8,z+20,12,true);
}
function fence(c,b,x,y,l) {
  const f=b.fence,h=f.height,gateStart=f.gate*l,gateEnd=gateStart+l*.14;
  for(let s=0;s<l;s+=l/5) {
    const end=Math.min(l,s+l/5);
    if(s>gateStart && end<gateEnd)continue;
    wall(c,[x,y+s],[x,y+end],12,f.base,'#8b7863',.32);
  }
  for(let s=0;s<=l;s+=l/5) {wall(c,[x-.8,y+s],[x-.8,y+s+4],h+2,'#c6bfa4','#9b9073',.30);}
  for(let s=0;s<l;s+=5) {
    const base=s>gateStart&&s<gateEnd?1:12;
    line(c,[x,y+s,base],[x,y+s,h],f.color,.7);
    for(let z=base+4;z<h;z+=7) {line(c,[x,y+s-2,z-3],[x,y+s+2,z+3],f.color,.55);line(c,[x,y+s+2,z-3],[x,y+s-2,z+3],f.color,.55);}
  }
  line(c,[x,y,h],[x,y+l,h],f.color,1);
}
function dish(c,x,y,z,large) {
  const p=P(x,y,z),radius=large?20:10;line(c,[x,y,z-24],[x,y,z],'#7a8970',1.2);
  c.save();c.translate(p.x,p.y);c.rotate(-.48);c.strokeStyle='#9ba590';c.lineWidth=1;c.beginPath();c.ellipse(0,0,radius,radius*.42,0,0,Math.PI*2);c.stroke();
  if(large){for(let a=0;a<Math.PI*2;a+=Math.PI/8){c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(a)*radius,Math.sin(a)*radius*.42);c.stroke();}c.beginPath();c.ellipse(0,0,radius*.57,radius*.24,0,0,Math.PI*2);c.stroke();}
  else {c.fillStyle='#b9bbaa';c.fill();c.fillStyle='#6d8d9b';c.font='4px Arial';c.textAlign='center';c.fillText('SKY',0,1);}
  c.restore();line(c,[x,y,z],[x-9,y-8,z+8],'#6c816c',1);
}

function garden(c,b) {
  const {x,y,depth:w,length:l,height:h}=b,front=x+w;
  poly(c,[[x,y],[x+w,y],[x+w,y+l],[x,y+l]],'#6d8053');
  wall(c,[x,y+l*.53],[x+w*.45,y+l*.53],47,'#c9927c','#ae8970',.15);
  roof(c,x,y+l*.50,w*.46,l*.42,47,'flat','#ac8e68',777);
  wall(c,[front,y],[front,y+l*.64],h,b.color,b.base,0);
  for(let s=0;s<l*.64;s+=55)wall(c,[front+.5,y+s],[front+.5,y+s+4],h+1,'#d0c4a3','#c3b795',0);
  const barred={...b,fence:{height:h,gate:.99,base:b.color,color:'#b6beaa'}};
  fence(c,barred,front,y+l*.64,l*.36);
  wall(c,[x,y+l],[front,y+l],22,b.color,b.base,0);
  for(let i=0;i<13;i++)plant(c,x+w*(.15+(i%3)*.23),y+l*(.08+i*.065),25,15,71+i);
}
export function drawDetailedBuilding(c,b,texture,crossTexture,backTexture,lightPass=false) {
  const previous=drawingBuilding;drawingBuilding=b;
  c.save();
  if(lightPass)c.globalCompositeOperation='destination-out';
  try{return drawBuilding(c,b,texture,crossTexture,backTexture,lightPass);}
  finally{c.restore();drawingBuilding=previous;}
}
function drawBuilding(c,b,texture,crossTexture,backTexture,lightPass) {
  const {x,y,depth:w,length:l,height:h}=b;
  if(b.roof==='garden'){
    garden(c,b);
    if(crossTexture&&(b.crossFacade.face==='maxY'?PROJECTION.d>0:PROJECTION.d<0)){
      const yy=b.crossFacade.face==='maxY'?y+l:y;
      surface(c,crossTexture,[x,yy,h],[x+w,yy,h],[x,yy,0],lightPass);
    }
    return;
  }
  const inset=b.frontSetback||(b.fence?24:0),front=b.side==='west'?x+w-inset:x+inset,street=b.side==='west'?x+w:x;
  const rx=b.side==='east'?x+inset:x,rw=w-inset;
  const side=b.sideColor||b.color,ratio=b.baseHeight??.22;
  const nearX=PROJECTION.c>0?rx+rw:rx;
  const frontVisible=b.side==='west'?PROJECTION.c>0:PROJECTION.c<0;
  const nearY=PROJECTION.d>0?y+l:y,farY=PROJECTION.d>0?y:y+l;
  wall(c,[rx,farY],[rx+rw,farY],h,shade(side,-17),shade(b.base,-13),ratio);
  wall(c,[rx,nearY],[rx+rw,nearY],h,shade(side,-7),shade(b.base,-6),ratio);
  wall(c,[nearX,y],[nearX,y+l],h,shade(side,PROJECTION.c>0?-3:-15),b.base,ratio);
  if(b.detail==='am-electric-wall'){
    for(let yy=y+5;yy<y+l;yy+=45)line(c,[street,yy,h],[street,yy,h+16],'#465145',1);
    for(const z of [h+5,h+10,h+15])line(c,[street,y,z],[street,y+l,z],'#657064',.55);
  }
  if(b.detail==='school') {for(const [a,d] of [[[x,y],[x+w,y]],[[nearX,y],[nearX,y+l]]])poly(c,[[...a,h*.6],[...d,h*.6],[...d,h],[...a,h]],'#cda17e');}
  if(b.roof==='courtyard') {
    poly(c,[[x+4,y+4,1],[x+w-4,y+4,1],[x+w-4,y+l-4,1],[x+4,y+l-4,1]],'#afa68a');
    const backX=b.side==='west'?x:x+w*.48;
    roof(c,backX,y+5,w*.52,l-10,h-9,'tile',b.roofColor,b.point*117);
    // The photographed frontage is a wall; the roof is set back behind its yard.
    wall(c,[x,y],[x+w,y],h*.78,shade(side,-6),b.base,ratio);
  } else if(b.detail==='as-library') {
    libraryRoof(c,rx,y,rw,l,h);
  } else if(b.detail==='cm-p-metalmar') {
    // One corner volume: visible tiles west, weathered parapet on the eastern wing.
    roof(c,rx,y,rw,l*.46,h,'tile',b.roofColor,b.point*137+x);
    roof(c,rx,y+l*.46,rw,l*.54,h,'flat',b.roofColor,b.point*137+x+1);
  } else if(b.roof!=='none')roof(c,rx,y,rw,l,b.roof==='hidden-tile'?h-17:h,b.roof==='hidden-tile'?'tile':b.roof,b.roofColor,b.point*137+x);
  if(b.detail==='jl-e-porch') {
    const canopyX=b.side==='west'?front:x;
    roof(c,canopyX,y,inset,l,h-4,'shed',b.roofColor,b.point*137);
    for(const u of [.015,.35,.65,.985])line(c,[street,y+l*u,0],[street,y+l*u,h-2],'#8c8268',2.4);
  }
  if(b.detail==='raised-roof') {
    const xx=x+33;
    wall(c,[xx,y+13],[xx,y+l-11],h+15,'#dfdbc6','#c3c3a9',.04);
    poly(c,[[xx,y+13,h+15],[xx,y+l*.57,h+43],[xx,y+l-11,h+15]],'#e2ddc8','#a39e84');
    for(let z=h+8;z<h+32;z+=7)line(c,[xx,y+20,z],[xx,y+l-20,z],'#b3b49b',.7);
    line(c,[xx,y+13,h+16],[xx,y+l*.57,h+44],'#917f62',2);
  }
  if(b.detail==='jl-ceo-side'){
    // Caixa cilíndrica elevada observada atrás do anexo; pertence ao mesmo lote.
    const tx=x+w*.66,ty=y+l*.88,z=h+22,r=13;
    for(const dx of [-9,9])for(const dy of [-9,9])line(c,[tx+dx,ty+dy,h],[tx+dx,ty+dy,z],'#cbcdbd',2);
    for(let i=0;i<20;i++){const a=i*Math.PI/10,aa=(i+1)*Math.PI/10;
      poly(c,[[tx+Math.cos(a)*r,ty+Math.sin(a)*r,z],[tx+Math.cos(aa)*r,ty+Math.sin(aa)*r,z],[tx+Math.cos(aa)*r,ty+Math.sin(aa)*r,z+25],[tx+Math.cos(a)*r,ty+Math.sin(a)*r,z+25]],i<10?'#c4c8b8':'#daddcb');
    }
    poly(c,Array.from({length:20},(_,i)=>[tx+Math.cos(i*Math.PI/10)*r,ty+Math.sin(i*Math.PI/10)*r,z+25]),'#dce0ce','#a0aa96');
  }
  if(crossTexture && (b.detail==='as-library'||(b.crossFacade.face==='maxY'?PROJECTION.d>0:PROJECTION.d<0))) {
    // Both photographed short ends of the library use the arched composition.
    const yy=b.detail==='as-library'?nearY:b.crossFacade.face==='maxY'?y+l:y;
    surface(c,crossTexture,[x,yy,h],[x+w,yy,h],[x,yy,0],lightPass);
  }
  if(!frontVisible) {
    if(backTexture)surface(c,backTexture,[nearX,y,h],[nearX,y+l,h],[nearX,y,0],lightPass);
    if(b.dish)dish(c,x+w*.59,y+l*.82,h+29,b.detail==='green-veranda');
    return;
  }
  if(inset) {
    poly(c,[[street,y,1],[front,y,1],[front,y+l,1],[street,y+l,1]],b.detail==='mauve-clinic'?'#c4bca0':'#8d8f70');
    for(let yy=y;yy<y+l;yy+=12)line(c,[street,yy,1],[front,yy,1],'#8b917978',.5);
    wall(c,[street,y],[front,y],h*.67,'#d6d6be','#a3aa90',.10);
    wall(c,[street,y+l],[front,y+l],h*.67,'#d6d6be','#a3aa90',.10);
  }
  // Only the street-facing side toward this camera receives its facade.
  // Hidden fronts never appear through the roof in the opposite orientation.
  surface(c,texture,[front,y,h],[front,y+l,h],[front,y,0],lightPass);
  line(c,[front,y,0],[front,y+l,0],'#47513d',1.4);
  if(b.parapet) {
    line(c,[front,y,h],[front,y+l,h],shade(b.color,10),2.5);
    line(c,[front,y,h-3],[front,y+l,h-3],'#576b4a44',.6);
  }
  if(b.trim==='cinema') {
    // Stepped art-deco crown; the actual facade has no new "CINEMA" lettering.
    for(let n=0;n<3;n++) {
      const a=y+l*.50-(22-n*6),end=y+l*.50+(22-n*6),z=h+5+n*7;
      poly(c,[[front,a,h],[front,end,h],[front,end,z],[front,a,z]],'#c7bfa7','#9c9377');
    }
    line(c,[front,y,h-3],[front,y+l,h-3],'#ece0be',1.5);
  }
  if(b.trim==='curved') {
    const vertices=[[front,y,h],[front,y+l*.5,h+4],[front,y+l,h+10],[front,y+l,h-1],[front,y,h-1]];
    poly(c,vertices,b.color);line(c,[front,y,h],[front,y+l*.5,h+4],'#a6a28a',1.5);
  }
  if(b.detail==='sb-school') {
    // Dois frontões fotografados nos extremos da fachada, acima dos beirais.
    for(const u of [.14,.84]){
      const cy=y+l*u,half=l*.065;
      const outline=[[front,cy-half,h],[front,cy-half*.80,h+9],[front,cy-half*.40,h+13],[front,cy-half*.48,h+19],[front,cy,h+23],[front,cy+half*.48,h+19],[front,cy+half*.40,h+13],[front,cy+half*.80,h+9],[front,cy+half,h]];
      poly(c,outline,'#dcdcc8','#aeb4a0');
      line(c,[front,cy-half*.8,h+8],[front,cy+half*.8,h+8],'#ece9d5',1.7);
    }
  }
  const stepSide=b.side==='west'?1:-1;
  for(const o of b.openings.filter(o=>['door','gate','shutter','porch'].includes(o.kind))) {
    const yy=y+o.u*l,ww=o.w*l,projection=b.steps?6:3;
    poly(c,[[front,yy,2],[front+stepSide*projection,yy,2],[front+stepSide*projection,yy+ww,2],[front,yy+ww,2]],'#a8ad92','#616f5144');
    line(c,[front+stepSide*projection,yy,0],[front+stepSide*projection,yy+ww,0],'#3e523e',1);
  }
  if(b.ramp!==undefined) {
    const yy=y+b.ramp*l;
    poly(c,[[street,yy,5],[street-14,yy,0],[street-14,yy+l*.3,0],[street,yy+l*.3,5]],'#7c8b88','#495f54');
    for(let xx=street-13;xx<street;xx+=2)line(c,[xx,yy,1],[xx,yy+l*.3,1],'#536d6459',.5);
  }
  if(b.fence)fence(c,b,street,y,l);
  if(b.detail==='cm-security-wall'){
    line(c,[front,y,h+5],[front,y+l,h+5],'#75816b',.6);
    for(let yy=y+4;yy<y+l;yy+=9){const p=P(front,yy,h+7);c.strokeStyle='#8c927c';c.lineWidth=.55;c.beginPath();c.ellipse(p.x,p.y,5,7,0,0,Math.PI*2);c.stroke();}
  }
  if(b.plants==='vines' || b.plants==='full-vines') {
    const r=rng(862);
    for(let i=0;i<(b.plants==='full-vines'?1100:250);i++) {
      const yy=y+(b.plants==='full-vines'?(.4+r()*.6):(i<150?r()*.20:.85+r()*.15))*l,zz=7+r()*(b.plants==='full-vines'?h+14:h);
      const p=P(street-1,yy,zz);c.fillStyle=b.detail==='aa-flowering'&&i%9===0?'#bd526c':['#395d35','#588045','#779155','#9f9c64'][i%4];c.beginPath();c.ellipse(p.x,p.y,1+r()*3,1+r()*3,r(),0,Math.PI*2);c.fill();
    }
  }
  if(b.detail==='cm-diagonal-wall') {
    for(let yy=y;yy<=y+l;yy+=24){line(c,[front,yy,h],[front,yy,h+18],'#4d5b48',.8);for(let z=h+4;z<h+19;z+=4){line(c,[front,y,z],[front,y+l,z],'#77816b',.35);}}
  }
  if(b.detail==='sm-net-wall') {
    // Vegetation caught in the high mesh above the long west wall.
    for(let yy=y;yy<y+l;yy+=55)line(c,[front,yy,h],[front,yy,h+58],'#6f7560',1.1);
    for(let z=h+7;z<h+57;z+=7)line(c,[front,y,z],[front,y+l,z],'#786c4b88',.5);
    for(let yy=y;yy<y+l;yy+=9)line(c,[front,yy,h+3],[front,yy,h+55],'#776f5099',.45);
    const r=rng(Math.round(y));
    for(let i=0;i<l*1.5;i++) {
      const p=P(front,y+r()*l,h+15+r()*42);
      c.fillStyle=['#6a704966','#596b4588','#85754e88'][i%3];c.fillRect(p.x,p.y,1+r()*2,2+r()*5);
    }
  }
  if(b.pots)for(let i=0;i<b.pots;i++) {
    const xx=street+12,yy=y+l*(.17+i*.29),z=13;
    wall(c,[xx-4,yy-4],[xx+4,yy-4],z,'#d5d1b6','#aaa98e',.1);wall(c,[xx+4,yy-4],[xx+4,yy+4],z,'#b5b59b','#a0a88c',.1);
    poly(c,[[xx-4,yy-4,z],[xx+4,yy-4,z],[xx+4,yy+4,z],[xx-4,yy+4,z]],'#566748');plant(c,xx,yy,34,13,i+7);
  }
  if(b.dish)dish(c,x+w*.59,y+l*.82,h+29,b.detail==='green-veranda');
  if(b.portico) {
    // Yellow pavilion: a narrow porch with square columns, not extra doorways.
    for(const yy of [y+4,y+l-4])wall(c,[front-16,yy],[front-16,yy+5],h-4,'#ddd095','#b1ae86',.17);
    roof(c,front-19,y-2,22,l+4,h-2,'shed','#af7853',771);
  }
}
