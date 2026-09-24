import { PROJECTION } from './projection.js';
import { drawAntonioFacade, drawAntonioOpeningDetails } from './antonio-facades.js';
import { drawSimeaoFacade } from './simeao-facades.js';
// Desenho das frentes catalogadas em street-data.js. Todas as aberturas são
// explícitas: o mesmo recorte de fotografia não cria portas/janelas duplicadas.
function random(seed) { let n=seed>>>0; return () => ((n=Math.imul(n,1664525)+1013904223>>>0)/4294967296); }
function hash(text) { let n=23; for (const c of text) n=Math.imul(n,31)+c.charCodeAt(0); return n>>>0; }
function line(c,x,y,xx,yy,color,width=.6) { c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.stroke(); }
function polygon(c,points,color) { c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill(); }

function wallPattern(c,b,w,h) {
  const p=b.pattern;
  if (!p) return;
  if (p==='horizontal' || p==='horizontal-base') {
    const top=p==='horizontal' ? h*.41 : h*.60, end=p==='horizontal' ? h*.74 : h*.82;
    for(let y=top;y<end;y+=3) { line(c,0,y,w,y,'#8e96856b');line(c,0,y+1,w,y+1,'#ece9d753',.5); }
    return;
  }
  if(p==='pebble-bands') {
    for(const x of [w*.39,w*.68]) { c.fillStyle='#aaa58e';c.fillRect(x,0,w*.04,h);for(let i=0;i<40;i++){c.fillStyle=i%2?'#dad2b988':'#787e6755';c.fillRect(x+(i%3)*w*.012,i*h/40,w*.011,1.2);} }
    return;
  }
  const size=p==='small-tile'?4:p==='orange-tile'?3:p==='white-tile'?8:p==='brown-tile'?12:p==='circle-base'?7:5;
  const start=p==='circle-base'?h*.49:0;
  for(let y=start;y<h;y+=size) for(let x=0;x<w;x+=size) {
    c.strokeStyle=p==='orange-tile'?'#e3a15377':p==='brown-tile'?'#5d5b4266':'#7c82634d';c.lineWidth=.35;c.strokeRect(x,y,size,size);
    if(p==='diamond-tile') {
      polygon(c,[[x+size/2,y+.5],[x+size-.5,y+size/2],[x+size/2,y+size-.5],[x+.5,y+size/2]],'#ac89577d');
      polygon(c,[[x+size/2,y+1.5],[x+size-1.5,y+size/2],[x+size/2,y+size-1.5],[x+1.5,y+size/2]],'#ded1af');
      c.fillStyle='#a28b5b';c.fillRect(x+size/2-.35,y+size/2-.35,.7,.7);
    }
    if(p==='circle-base') { c.strokeStyle='#90a192';c.beginPath();c.arc(x+size/2,y+size/2,size*.28,0,Math.PI*2);c.stroke(); }
  }
}
function weather(c,b,w,h,r) {
  const amount=b.wear??.2;
  for(let i=0;i<Math.round(w*h*amount*.018);i++) {
    const x=r()*w,y=r()>.48?h*(.82+r()*.18):r()*h;
    const radius=.4+r()*3.2*amount;
    const points=Array.from({length:7},(_,k)=>[x+Math.cos(k*Math.PI*2/7)*radius*(.4+r()),y+Math.sin(k*Math.PI*2/7)*radius*(.4+r())]);
    polygon(c,points,['#64705b32','#93846855','#d9cdb377','#4f5d482a'][i%4]);
  }
  if(amount>.4) {
    for(let i=0;i<amount*10;i++) {
      const x=r()*w,y=(i%2?.76:.16)*h+r()*h*.13, rw=2+r()*w*.13,rh=3+r()*h*.14;
      polygon(c,[[x,y],[x+rw*.6,y-rh*.2],[x+rw,y+rh*.25],[x+rw*.8,y+rh],[x+rw*.3,y+rh*.8],[x-rw*.1,y+rh*.4]],i%2?'#8c806961':'#dfd2b765');
    }
  }
  for(let i=0;i<w*amount*.17;i++) {
    const x=r()*w, len=r()*h*.27;
    line(c,x,0,x+r()*2,len,'#47594036',.4+r());
    if(i%3===0) line(c,x,h,x+1,h-r()*h*.19,'#3e554b35',1.5+r()*2);
  }
  for(let i=0;i<3*amount;i++) {
    let x=r()*w,y=r()*h*.6;
    for(let j=0;j<5;j++) { const nx=x+(r()-.5)*4,ny=y+2+r()*4;line(c,x,y,nx,ny,'#58604e66',.35);x=nx;y=ny; }
  }
}
function grille(c,x,y,w,h,kind,color,solid=0) {
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
  const spacing=kind==='diamond'?3:kind==='square'?5:kind==='scroll'?5:4;
  if(solid) { c.fillStyle=color;c.globalAlpha=.8;c.fillRect(x,y+h*(1-solid),w,h*solid);c.globalAlpha=1; }
  c.strokeStyle=color;c.lineWidth=.7;
  if(kind==='wide-diagonal') {
    c.fillStyle='#344139';c.fillRect(x,y,w,h);
    for(let xx=x-h;xx<x+w;xx+=10)line(c,xx,y+h,xx+h,y,color,4);
  } else if(kind==='horizontal') {
    for(let yy=y;yy<y+h;yy+=1.7) line(c,x,yy,x+w,yy,color,.6);
  } else if(kind==='diamond' || kind==='diagonal') {
    const top=kind==='diagonal'?y+h*.36:y;
    if(kind==='diagonal') for(let xx=x;xx<x+w;xx+=spacing) line(c,xx,y,xx,top,color,.7);
    for(let xx=x-h;xx<x+w+h;xx+=spacing) {
      line(c,xx,top,xx+h*.7,y+h,color,.6);
      if(kind==='diamond') line(c,xx,top,xx-h*.7,y+h,color,.6);
    }
    line(c,x,top,x+w,top,color,1);
  } else if(kind==='chevron') {
    for(let xx=x+1;xx<x+w;xx+=3) line(c,xx,y,xx,y+h*.37,color,.75);
    for(let yy=y+h*.30;yy<y+h*.89;yy+=4) { line(c,x,yy,x+w*.5,yy+h*.19,color,.9);line(c,x+w*.5,yy+h*.19,x+w,yy,color,.9); }
    line(c,x,y+h*.88,x+w,y+h*.88,color,1);
  } else if(kind==='sunburst') {
    for(let yy=y+5;yy<y+h;yy+=11) {
      for(let i=0;i<12;i++) { const a=i*Math.PI/6;line(c,x+w*.5,yy,x+w*.5+Math.cos(a)*w*.6,yy+Math.sin(a)*7,color,.45); }
    }
    for(let yy=y;yy<y+h;yy+=3) line(c,x,yy,x+w,yy,color,.5);
  } else {
    for(let xx=x+1;xx<x+w;xx+=spacing) line(c,xx,y,xx,y+h,color,.65);
    if(kind==='square') for(let yy=y+1;yy<y+h;yy+=spacing) line(c,x,yy,x+w,yy,color,.65);
    if(kind==='scroll' || kind==='star') for(let yy=y+2;yy<y+h-1;yy+=7) for(let xx=x+2;xx<x+w-1;xx+=5) {
      if(kind==='scroll') {
        c.strokeStyle=color;c.lineWidth=.5;
        for(const dir of [-1,1]) { c.beginPath();c.arc(xx+dir*.8,yy,1.4,0,Math.PI*1.8);c.stroke(); }
        line(c,xx,y,xx,y+h,color,.35);
      } else {
        line(c,xx-2,yy-3,xx+2,yy+3,color,.55);line(c,xx+2,yy-3,xx-2,yy+3,color,.55);line(c,xx-2,yy,xx+2,yy,color,.5);
      }
    }
  }
  c.restore();c.strokeStyle=color;c.lineWidth=.9;c.strokeRect(x,y,w,h);
  if(w>22) line(c,x+w/2,y,x+w/2,y+h,color,.8);
}
function drawOpening(c,o,w,h,lightPass=false) {
  const x=o.u*w,ww=o.w*w,hh=o.h*h,y=h*(1-o.bottom-o.h), color=o.color||'#667260';
  c.fillStyle='#364337aa';c.fillRect(x-1.3,y-1.4,ww+2.6,hh+2.1);
  c.fillStyle=o.frame||'#b7b59d';c.fillRect(x-.7,y-.7,ww+1.4,hh+1.4);
  c.fillStyle=color;c.fillRect(x,y,ww,hh);
  if(lightPass && o.kind==='window') {
    // Light stays behind the frame; wooden shutters transmit only through slits.
    c.save();c.globalCompositeOperation='source-over';
    c.beginPath();c.rect(x+1,y+1,ww-2,hh-2);c.clip();
    const light=c.createRadialGradient(x+ww*.48,y+hh*.28,0,x+ww*.48,y+hh*.28,Math.max(ww,hh));
    light.addColorStop(0,'#edc778');light.addColorStop(.55,'#bf8b42');light.addColorStop(1,'#785025');
    c.fillStyle=light;
    if(o.wood)for(let yy=y+hh*.20;yy<y+hh*.78;yy+=1.8)c.fillRect(x+1,yy+.45,ww-2,.65);
    else c.fillRect(x+1,y+1,ww-2,hh-2);
    c.restore();
    if(o.glass) {
      line(c,x+ww*.53,y,x+ww*.53,y+hh,'#ffffff',1);
      line(c,x,y+hh*.69,x+ww,y+hh*.69,'#ffffff',1);
    }
  }
  if(o.kind==='bricked') {
    c.fillStyle=color;c.fillRect(x,y,ww,hh);
    for(let yy=y+2;yy<y+hh;yy+=2.7) { line(c,x,yy,x+ww,yy,'#776c5740',.4);for(let xx=x+(Math.round(yy)%2)*2;xx<x+ww;xx+=4)line(c,xx,yy,xx,yy+2.6,'#776c5730',.35); }
    return;
  }
  if(o.recess || o.kind==='porch' || o.kind==='balcony') {
    c.fillStyle='#1c2d23a0';c.fillRect(x,y,ww,hh);
    polygon(c,[[x,y],[x+ww*.10,y+hh*.10],[x+ww*.10,y+hh*.86],[x,y+hh]],'#9e9c7d');
    polygon(c,[[x,y+hh],[x+ww*.10,y+hh*.86],[x+ww,y+hh*.86],[x+ww,y+hh]],'#a49d7f');
    c.fillStyle='#817054';c.fillRect(x+ww*.42,y+hh*.23,ww*.23,hh*.61);
    line(c,x+ww*.60,y+hh*.24,x+ww*.60,y+hh*.79,'#343e2e',.7);
  }
  if(o.kind==='shutter') {
    for(let yy=y+1;yy<y+hh;yy+=1.65) { line(c,x,yy,x+ww,yy,'#525e515f',.5);line(c,x,yy+.6,x+ww,yy+.6,'#e1debe55',.35); }
    if(o.double) line(c,x+ww*.5,y,x+ww*.5,y+hh,'#646f60',1);
    line(c,x,y+hh-1,x+ww,y+hh-1,'#343e31',1);
  }
  if(o.wood) {
    const panels=ww>20?4:2;
    for(let i=0;i<panels;i++) { const px=x+ww*i/panels;c.strokeStyle='#4f4b377d';c.lineWidth=.5;c.strokeRect(px+1,y+2,ww/panels-2,hh-4); }
    if(o.kind==='window') for(let yy=y+hh*.20;yy<y+hh*.78;yy+=1.8)line(c,x+1,yy,x+ww-1,yy,'#4b4f3575',.4);
    else for(let yy=y+5;yy<y+hh;yy+=hh/4)line(c,x+2,yy,x+ww-2,yy,'#756245',.65);
  }
  if(o.glass && !lightPass) {
    c.fillStyle='#849d9566';c.fillRect(x+1,y+1,ww-2,hh-2);
    polygon(c,[[x+1,y+hh*.3],[x+ww-1,y+hh*.10],[x+ww-1,y+hh*.30],[x+1,y+hh*.5]],'#e1e7cf8a');
    line(c,x+ww*.53,y,x+ww*.53,y+hh,'#ced1bf',1);line(c,x,y+hh*.69,x+ww,y+hh*.69,'#d1d6c4',1);
    c.fillStyle='#d4d6c4';c.fillRect(x+ww*.43,y+hh*.5,1,hh*.16);
  }
  if(o.open) {
    c.fillStyle='#1d312a';c.fillRect(x+1,y+3,ww-2,hh-3);
    c.fillStyle='#455746';c.fillRect(x+2,y+hh*.53,ww-4,hh*.21);line(c,x+2,y+hh*.60,x+ww-2,y+hh*.60,'#a78d64',1);
    c.fillStyle='#4386a4';c.fillRect(x,y,ww,4);for(let xx=x+1;xx<x+ww;xx+=2)line(c,xx,y,xx,y+4,'#204756',.55);
  }
  if(o.grille) grille(c,x+.5,y+.5,ww-1,hh-1,o.grille,o.bars||'#bdc5b0',o.solid);
  if(o.kind==='gate' && !o.grille) grille(c,x+.5,y+.5,ww-1,hh-1,'vertical',o.bars||'#b7c1b3',o.solid);
  if(o.kind==='door' && !o.open && !o.glass) { c.fillStyle='#cfbc80';c.fillRect(x+ww*.83,y+hh*.54,.7,2.5); }
  if(o.awning) {
    c.fillStyle='#aeaf97';c.fillRect(x-2,y-4,ww+4,2);for(let xx=x-2;xx<x+ww+2;xx+=2) { c.fillStyle='#dce0cb';c.fillRect(xx,y-4,1,2.2); }
  }
  if(o.projecting) { c.strokeStyle='#d9dbcc';c.lineWidth=2;c.strokeRect(x-1,y-1,ww+2,hh+2);line(c,x-2,y+hh+2,x+ww+2,y+hh+2,'#575f5288',2); }
}

export function makeDetailedFacade(b,image,lightPass=false) {
  const w=Math.max(64,b.length),h=b.height,texture=document.createElement('canvas');
  texture.width=Math.ceil(w*3);texture.height=Math.ceil(h*3);const c=texture.getContext('2d');c.scale(3,3);
  // In the emissive pass, every ordinary facade detail masks light behind it.
  if(lightPass)c.globalCompositeOperation='destination-out';
  const r=random(hash(b.id));c.fillStyle=b.color;c.fillRect(0,0,w,h);
  // A restrained photographic layer supplies plaster variation; explicit geometry
  // below supplies the counted openings, instead of stretching an entire street view.
  if(image && !lightPass) { c.save();c.globalCompositeOperation='soft-light';c.globalAlpha=.15;c.drawImage(image,140,190,620,280,0,0,w,h);c.restore(); }
  c.fillStyle=b.base;c.fillRect(0,h*(1-(b.baseHeight??.22)),w,h*(b.baseHeight??.22));
  if(b.detail==='school') { c.fillStyle='#dca77e';c.fillRect(0,0,w,h*.40); }
  if(b.detail==='cm-school-extension') { c.fillStyle='#c5a089';c.fillRect(0,0,w,h*.42); }
  if(b.detail==='cm-white-house') { c.fillStyle='#c7a63e';c.fillRect(w*.73,0,w*.27,h*.48); }
  if(b.detail==='cm-green-house') { c.fillStyle='#d3d6c6';c.fillRect(0,0,w,h*.45); }
  if(b.detail==='exposed-plaster') {
    polygon(c,[[0,0],[w,0],[w,h*.38],[w*.90,h*.35],[w*.82,h*.40],[w*.71,h*.27],[w*.59,h*.34],[w*.51,h*.25],[w*.38,h*.32],[w*.24,h*.27],[w*.16,h*.44],[0,h*.36]],'#94978b');
  }
  wallPattern(c,b,w,h);weather(c,b,w,h,r);
  for(const panel of b.panels||[]) { c.fillStyle=panel.color;c.fillRect(panel.u*w,h*.25,panel.w*w,h*.64);c.strokeStyle='#d0cbb35c';c.lineWidth=1;c.strokeRect(panel.u*w,h*.25,panel.w*w,h*.64); }
  if(b.trim==='blank-fascia') { c.fillStyle='#dadccd';c.fillRect(0,0,w,h*.33);line(c,0,h*.33,w,h*.33,'#67756277',1); }
  if(b.trim==='historic') {
    line(c,0,h*.10,w,h*.10,'#716d5566',2);line(c,0,h*.49,w,h*.49,'#a8a98b',1.2);
    c.strokeStyle='#786e5366';c.lineWidth=.9;c.beginPath();c.ellipse(w*.25,h*.15,w*.19,h*.15,0,Math.PI,Math.PI*2);c.stroke();
  }
  if(b.trim==='storey') { c.fillStyle='#dedbcc';c.fillRect(0,h*.46,w,h*.095);for(let yy=h*.47;yy<h*.55;yy+=2)line(c,0,yy,w,yy,'#a1a89499',.4); }
  if(b.trim==='white-line') { line(c,0,h*.19,w,h*.19,'#e5dfc7',1.2); }
  if(b.detail==='dental') {
    polygon(c,[[w*.59,0],[w*.72,h*.20],[w*.65,h],[w, h],[w,0]],'#abb7b5');
    for(let y=h*.35;y<h;y+=h*.17)line(c,w*.62,y,w,y,'#3e5a506e',1);
  }
  if(b.detail==='mauve-clinic') { c.fillStyle='#d8d6c6';c.fillRect(0,0,w,h*.21);c.fillRect(0,h*.36,w*.54,h*.64);line(c,0,h*.32,w,h*.32,'#675e5755',2); }
  if(b.detail==='workshop' || b.detail==='bar') {
    for(let x=10;x<w;x+=52) { line(c,x,0,x,h,'#bdba9d',1.2);line(c,x+1,0,x+1,h,'#62695230',.8); }
  }
  drawAntonioFacade(c,b,w,h,r);
  drawSimeaoFacade(c,b,w,h);
  for(const o of b.openings) drawOpening(c,o,w,h,lightPass);
  drawAntonioOpeningDetails(c,b,w,h);
  if(b.detail==='aa-print'){
    const door=b.openings[0];for(let i=0;i<5;i++){c.fillStyle=['#3979a3','#d1af3f','#ca604d','#63884d','#a486ac'][i];c.fillRect((door.u+door.w*i/5)*w,h*.44,door.w*w/5,h*.13);}
  }
  if(b.detail==='cm-security-wall')for(let x=0;x<w;x+=30){line(c,x,0,x,h,'#7a8c7b',1.2);line(c,x+2,0,x+2,h,'#d1d2bc',1);}
  if(b.detail==='cm-pink-house') {
    for(const [u,v] of [[.23,.10],[.46,.18],[.73,.22],[.32,.48],[.68,.49]]){
      const x=u*w,y=v*h;c.fillStyle='#776956';c.fillRect(x+2,y+2,10,8);c.fillStyle='#d6cfb8';c.fillRect(x,y,10,8);
      c.strokeStyle='#6f7864';c.lineWidth=.5;c.beginPath();c.arc(x+4,y+4,2.6,0,Math.PI*2);c.stroke();
      for(let n=0;n<3;n++)line(c,x+7,y+2+n*2,x+9,y+2+n*2,'#7f826d',.5);
      line(c,x+5,y+8,x+8,y+18,'#b8ad91',.5);
    }
  }
  if(b.detail==='cm-ide') {
    for(const offset of [0,2]){line(c,0,h*.76+offset,w*.35,h*.76+offset,'#ddd4aa',.7);line(c,w*.35,h*.76+offset,w*.42,h*.70+offset,'#ddd4aa',.7);line(c,w*.42,h*.70+offset,w,h*.70+offset,'#ddd4aa',.7);}
  }
  if(b.detail==='cm-diagonal-wall') {
    c.save();c.beginPath();c.rect(0,0,w,h);c.clip();
    for(let x=-w*.2;x<w;x+=w*.34)polygon(c,[[x,h],[x+6,h],[x+w*.23,0],[x+w*.23-6,0]],'#e0ddcc');
    c.restore();
  }
  if(b.detail==='cm-gym')for(const u of [.04,.065,.09]){c.fillStyle='#cbd8d5';c.fillRect(w*u,0,2,h);}
  for(const u of b.meters||[]) {
    c.fillStyle='#596953';c.fillRect(u*w,h*.50,3.3,5.7);c.fillStyle='#b6c4a2';c.fillRect(u*w+.7,h*.51,2,2);line(c,u*w+1.6,h*.51,u*w+1.6,h*.31,'#536751',.35);
  }
  if(b.mailbox) { c.fillStyle='#adaf98';c.fillRect(b.mailbox*w,h*.45,6,3);c.fillStyle='#3b5143';c.fillRect(b.mailbox*w+.5,h*.46,5,.8); }
  for(const s of b.signs||[]) {
    const x=s.u*w,y=s.top*h,ww=s.w*w,hh=s.h*h;
    if(s.color) { c.fillStyle=s.color;c.fillRect(x,y,ww,hh); }
    // Keep letters readable when increasing world-y projects to screen-left.
    // Only glyphs reverse here: door/window positions remain in world order.
    c.save();
    if((b.facadeAxis==='x'?PROJECTION.a:PROJECTION.b)<0){c.translate(2*x+ww,0);c.scale(-1,1);}
    let size=Math.min(hh*(s.sub?.55:.85),ww/(s.text.length*.59));
    c.font=`bold ${size}px Arial`;c.textAlign='center';c.textBaseline='middle';
    if(s.shadow) { c.fillStyle='#4c5650';c.fillText(s.text,x+ww/2+.65,y+hh*.48+.7); }
    if(s.outline) { c.strokeStyle=s.outline;c.lineWidth=.6;c.strokeText(s.text,x+ww/2,y+hh*.48); }
    c.fillStyle=s.ink||'#dfd9be';c.fillText(s.text,x+ww/2,y+hh*(s.sub?.35:.48));
    if(s.sub) { c.font=`${Math.min(hh*.26,ww/(s.sub.length*.56))}px Arial`;c.fillText(s.sub,x+ww/2,y+hh*.80); }
    c.restore();
  }
  if(b.brickBand) {
    c.fillStyle='#a97651';c.fillRect(0,0,w,h*b.brickBand);
    for(let x=0;x<w;x+=4)line(c,x,0,x,h*b.brickBand,'#5d5d465d',.5);
  }
  if(b.detail==='cinema') {
    line(c,0,h*.40,w,h*.40,'#877d614f',1.2);line(c,0,3,w,3,'#9a927970',1.5);
    for(let i=0;i<14;i++) { const x=r()*w;c.fillStyle='#94826455';c.fillRect(x,h*.38,1+r()*3,h*.5*r()); }
  }
  line(c,0,1,w,1,'#ddd7bf88',1);line(c,0,h-.8,w,h-.8,'#475d4688',1.1);
  return texture;
}
