// Details observed in points 18–31. Openings still come from the shared catalog.
export function drawSimeaoFacade(c,b,w,h) {
  if(b.detail==='sm-wood-column'||b.detail==='sm-office') {
    const x=b.detail==='sm-office'?0:w*.22,bw=b.detail==='sm-office'?w:w*.12;
    c.fillStyle='#997859';c.fillRect(x,0,bw,h);
    for(let y=1;y<h;y+=3){c.fillStyle=y%2?'#c29a704f':'#634b3d40';c.fillRect(x,y,bw,.7);}
  }
  if(b.detail==='sm-wine-lines')for(const y of [.28,.58,.84]){c.fillStyle='#d7d4c3';c.fillRect(0,h*y,w,1.4);}
  if(b.detail==='sm-green-house') {
    for(const x of [w*.37,w*.91]){c.fillStyle='#9b967b';c.fillRect(x,0,w*.03,h);}
    for(const [u,ww] of [[.08,.2],[.44,.42]]) {
      const x=u*w,y=h*.15;c.fillStyle='#355f50';c.fillRect(x,y,ww*w,h*.11);
      for(let i=0;i<3;i++){c.beginPath();c.moveTo(x+i*ww*w/3,y+1);c.lineTo(x+(i+1)*ww*w/3,y+1);c.lineTo(x+(i+.5)*ww*w/3,y+h*.10);c.closePath();c.fillStyle=i%2?'#7c9fb0':'#c8b276';c.fill();}
    }
  }
  if(b.detail==='sm-cristo-rei') {
    const colors=['#d9987c','#d3c694','#c6a39d'];
    for(let i=0;i<9;i++) {
      const x=i*w/9,top=(i%3)*h*.08;
      c.fillStyle=colors[i%3];c.beginPath();c.moveTo(x,top);c.lineTo(x+w*.065,top);
      c.bezierCurveTo(x+w*.14,h*.25,x-w*.025,h*.36,x+w*.09,h*.49);
      c.lineTo(x+w*.10,h);c.lineTo(x-w*.01,h);
      c.bezierCurveTo(x+w*.02,h*.68,x-w*.06,h*.38,x,top);c.fill();
    }
  }
  if(b.detail==='sm-brick-wall')for(let i=0;i<18;i++) {
    const x=((i*47+13)%101)/101*w,y=((i*31+17)%83)/83*h;
    c.fillStyle=i%2?'#ac7c54':'#877b5d';c.fillRect(x,y,3+i%4,1.8);
  }
}
