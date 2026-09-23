function line(c,x,y,xx,yy,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.stroke();}
function brick(c,w,from,to,color){
  c.fillStyle=color;c.fillRect(0,from,w,to-from);
  for(let y=from;y<to;y+=3.2){line(c,0,y,w,y,'#b9aa8677',.55);for(let x=(Math.round(y/3.2)%2)*3;x<w;x+=6)line(c,x,y,x,y+3.2,'#6f71564f',.6);}
}
export function drawAntonioOpeningDetails(c,b,w,h){
  if(b.detail!=='aa-green-arches')return;
  for(const opening of b.openings.filter(o=>o.kind==='porch')){
    const x=opening.u*w,ww=opening.w*w,y=h*(1-opening.bottom-opening.h),hh=opening.h*h;
    // The tiled wall dips below each railing; these are not rectangular windows.
    c.fillStyle=b.color;c.fillRect(x-2,y-2,ww+4,hh+4);
    for(let xx=x;xx<x+ww;xx+=8)line(c,xx,y,xx,y+hh,'#d8d9b877',.6);
    for(let yy=y;yy<y+hh;yy+=8)line(c,x,yy,x+ww,yy,'#d8d9b877',.6);
    c.save();c.beginPath();c.moveTo(x,y-1);c.lineTo(x+ww,y-1);c.quadraticCurveTo(x+ww*.5,y+hh*1.45,x,y-1);c.clip();
    c.fillStyle='#344b36';c.fillRect(x,y-2,ww,hh+3);
    for(let xx=x+2;xx<x+ww;xx+=3)line(c,xx,y-2,xx,y+hh,'#cfd2b4',.8);
    c.restore();
    c.strokeStyle='#dedec4';c.lineWidth=1.5;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+ww*.5,y+hh*1.45,x+ww,y);c.stroke();
  }
}
export function drawAntonioFacade(c,b,w,h,r){
  if(b.detail==='aa-brick-white'||b.detail==='aa-brick-top'){
    const top=b.detail==='aa-brick-top';brick(c,w,0,top?h*.32:h,top?'#b7845d':b.color);
    if(!top)for(let i=0;i<80;i++){c.fillStyle=i%2?'#dbd7b7aa':'#7f896355';c.fillRect(r()*w,h*.2+r()*h*.75,4+r()*14,2+r()*8);}
    for(let x=0;x<w;x+=65){c.fillStyle='#a7a18a';c.fillRect(x,0,3,h);}
  }
  if(b.detail==='aa-stone-columns')for(const u of [0,.27,.95]){
    const x=u*w,bw=w*.065;c.fillStyle='#807f6e';c.fillRect(x,0,bw,h);
    for(let y=0;y<h;y+=2.6){c.fillStyle=['#c2bea5','#9f9f90','#646f65','#d2cbb2'][Math.floor(y)%4];c.fillRect(x+(Math.floor(y)%2),y,bw-1,1.8);}
  }
  if(b.detail==='aa-clinic')for(let x=w*.05;x<w*.92;x+=w*.13){c.fillStyle='#426c54';c.fillRect(x,h*.03,w*.043,h*.28);}
  if(b.detail==='aa-stetmed'){
    c.strokeStyle='#c4a769';c.lineWidth=2;c.beginPath();c.ellipse(w*.5,h*.22,w*.12,h*.14,-.25,0,Math.PI*2);c.stroke();line(c,w*.45,h*.22,w*.51,h*.29,'#c4a769',2);line(c,w*.51,h*.29,w*.63,h*.12,'#c4a769',2);
  }
  if(b.detail==='aa-pink-diamonds')for(const u of [.30,.68]){
    c.save();c.translate(w*u,h*.46);c.rotate(Math.PI/4);const s=h*.16;
    for(let x=-s;x<s;x+=4)for(let y=-s;y<s;y+=4){c.fillStyle=(Math.round(x/4)+Math.round(y/4))%2?'#abaf8a':'#d7d3b3';c.fillRect(x,y,4,4);}c.restore();
  }
  if(b.detail==='aa-school-wall'){
    for(let x=0;x<w;x+=42){c.fillStyle='#8b9caf';c.fillRect(x,0,5,h);}
    for(const y of [h*.07,h*.28]){
      c.fillStyle='#626f5e';c.fillRect(0,y,w,h*.15);
      for(let x=0;x<w;x+=8){c.strokeStyle='#dfdec4';c.lineWidth=1.3;c.beginPath();c.ellipse(x+4,y+h*.076,3.4,h*.06,0,0,Math.PI*2);c.stroke();line(c,x,y,x+8,y+h*.15,'#dbd9bd',.8);line(c,x+8,y,x,y+h*.15,'#dbd9bd',.8);}
    }
  }
  if(b.detail==='aa-school-mural'){
    const color='#4a7794';
    for(let n=0;n<4;n++){c.strokeStyle=n%2?color:'#ada578';c.lineWidth=1.3;c.beginPath();for(let x=w*.23;x<w*.94;x+=3){const y=h*(.42+n*.035)+Math.sin(x*.1+n)*1.7;x===w*.23?c.moveTo(x,y):c.lineTo(x,y);}c.stroke();}
    for(let i=0;i<4;i++){
      const x=w*(.08+i*.046),y=h*(.61-i*.055);c.fillStyle=['#b2a46e','#c2c1a1','#7099af','#466f89'][i];c.fillRect(x,y,w*.04,h*.85-y);
      c.beginPath();c.moveTo(x,y);c.lineTo(x+w*.02,y-8);c.lineTo(x+w*.04,y);c.fill();
    }
    const x=w*.85,y=h*.50;
    line(c,x,y-10,x,y+23,color,2.7);line(c,x-8,y-3,x+8,y-3,color,2);
    c.strokeStyle=color;c.lineWidth=2;c.beginPath();c.arc(x,y-14,4,0,Math.PI*2);c.stroke();c.beginPath();c.arc(x,y+9,14,0,Math.PI);c.stroke();
  }
  if(b.detail==='aa-school-secondary'){c.fillStyle='#c3a096';c.fillRect(0,0,w,h*.16);}
  if(b.detail==='aa-cinema-rear'){
    brick(c,w,h*.87,h,'#aa7b51');
    for(let x=0;x<w;x+=72){c.fillStyle='#726f5766';c.fillRect(x,0,5,h);line(c,x+5,0,x+5,h,'#cec09b99',1);}
    for(let i=0;i<280;i++){c.fillStyle=['#d3c8a999','#e0d7b66a','#46554266','#805f443b'][i%4];c.fillRect(r()*w,r()*h,1+r()*8,3+r()*14);}
    for(const u of [.08,.14,.22]){c.fillStyle='#d3d2bf';c.fillRect(u*w,h*.62,8,11);}
  }
  if(b.detail==='aa-reabilitar'){
    brick(c,w,h*.34,h*.82,'#a99e79');line(c,0,h*.32,w,h*.32,'#4d584b',3);line(c,0,h*.85,w,h*.85,'#4d584b',2);
  }
}
