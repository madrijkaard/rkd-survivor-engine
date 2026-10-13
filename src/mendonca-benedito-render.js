import { project as P } from './projection.js';
import { CROSS_Y as Y } from './mendonca-data.js';
import { MENDONCA_ROAD as R, BENEDITO_PROFILE as A } from './road-profiles.js';
import { BENEDITO_X as X, BENEDITO_CROSS, MENDONCA_BENEDITO_WALK, BENEDITO_PARKING } from './mendonca-benedito.js';
function rect(c,x,y,w,h,color,z=0){const ps=[[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z]].map(p=>P(...p));c.beginPath();ps.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();c.fillStyle=color;c.fill();}
function line(c,a,b,color,width=1){const p=P(...a),q=P(...b);c.beginPath();c.moveTo(p.x,p.y);c.lineTo(q.x,q.y);c.strokeStyle=color;c.lineWidth=width;c.stroke();}
export function drawMendoncaBeneditoGround(c,asphalt,paving){
  const r=MENDONCA_BENEDITO_WALK,t=BENEDITO_CROSS,k=BENEDITO_PARKING;
  rect(c,r.x,r.y,r.w,r.h,paving);rect(c,t.x,t.y,t.w,t.h,paving);
  rect(c,r.x,Y-R.halfWidth,r.w,R.width,asphalt);
  rect(c,X-A.halfWidth,t.y,A.width,t.h,asphalt);
  rect(c,k.x,k.y,k.w,k.h,paving);
  for(let x=k.x+35;x<k.x+k.w-12;x+=59){line(c,[x,k.y,1],[x+18,k.y+k.h,1],'#c5b774',1.6);}
  for(const dy of [-1,1])for(let x=r.x;x<-2223;x+=18){
    if(x>X-A.halfWidth&&x<X+A.halfWidth)continue;
    line(c,[x,Y+dy*R.halfWidth,1],[Math.min(x+18,-2223),Y+dy*R.halfWidth,1],'#cbd0b7',2);
  }
  for(const side of [-1,1])for(let y=t.y;y<t.y+t.h;y+=18){
    if(y>Y-R.halfWidth&&y<Y+R.halfWidth)continue;
    line(c,[X+side*A.halfWidth,y,1],[X+side*A.halfWidth,Math.min(y+18,t.y+t.h),1],'#ccd0b5',2);
  }
  // Blocos e vegetação observados na ponta da praça; fora da faixa do passeio.
  rect(c,X+A.outerHalfWidth+10,Y-255,68,48,'#8b9b6a');
  for(let x=-2870;x<-2400;x+=60)for(let y=Y-183;y<Y-108;y+=11)
    line(c,[x,y,0],[x+37,y,0],'#8b967766',.6);
  for(const x of [-3015,-2840,-2555])rect(c,x,Y-20,24,9,'#858c77');
  const p=P(-3085,Y+12);c.fillStyle='#626e62';c.beginPath();c.ellipse(p.x,p.y,9,4,0,0,Math.PI*2);c.fill();
  // Degraus pertencem à fachada, sem atravessar a largura livre dos passeios.
  rect(c,-2978,Y+R.outerHalfWidth,243,5,'#778c92',2);
}
export function drawMendoncaBeneditoFacade(c,b,w,h){
  const d=b.detail,fill=(u,v,ww,hh,color)=>{c.fillStyle=color;c.fillRect(u*w,v*h,ww*w,hh*h);};
  const ln=(u,v,uu,vv,color,width=.7)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(u*w,v*h);c.lineTo(uu*w,vv*h);c.stroke();};
  if(d==='cb-bank'){
    fill(0,.04,1,.27,'#b44548');
    for(let u=.02;u<.48;u+=.025)for(let v=.06;v<.28;v+=.035)fill(u,v,.008,.010,'#d4817a');
    fill(.02,.85,.51,.12,'#afbbaf');
    for(const v of [.76,.82,.88])ln(.03,v,.52,v,'#d0d4c5',1.5);
    for(const u of [.03,.19,.35,.52])ln(u,.75,u,.98,'#aebbb1',1.2);
  }
  if(d==='cb-court-wall'){
    fill(0,0,1,.08,'#9ba58d');
    for(let i=0;i<100;i++)fill((i*31%98)/100,.78+(i*13%20)/100,.007+i%3*.009,.025+i%3*.03,'#66735c66');
    fill(.005,.04,.54,.11,'#e0dfc9');
    for(let u=.02;u<.52;u+=.07)fill(u,0,.014,.17,'#adb29e');
  }
  if(d==='cb-impacto'){
    fill(.02,.28,.96,.25,'#b65e67');fill(.025,.30,.95,.015,'#ce8c8a');
    fill(.02,.50,.96,.035,'#5477aa');fill(.005,0,.035,1,'#b7b8a8');fill(.97,0,.03,1,'#b8b8a9');
    fill(.48,.51,.035,.49,'#d9d6c6');
    for(let row=0;row<3;row++)for(let col=0;col<9;col++){
      fill(.06+col*.095,.59+row*.12,.067,.018,'#b9bba3');
      for(let n=0;n<3;n++)fill(.065+col*.095+n*.017,.61+row*.12,.012,.045,['#877658','#b79a63','#526966'][(row+col+n)%3]);
    }
  }
  if(d==='cb-impacto-side'){
    fill(0,.43,1,.10,'#987a6c');fill(0,.88,1,.12,'#c6c4b3');
    for(const u of [.48,.66]){fill(u,.46,.075,.065,'#d0d0bd');for(let n=0;n<5;n++)ln(u+.01,.472+n*.008,u+.063,.472+n*.008,'#7f8b7e');}
    fill(.965,0,.035,1,'#b5b6a7');
  }
  if(d==='cb-camouflage'){
    for(let n=0;n<27;n++){
      const x=(n*37%95)/100*w,y=(n*19%89)/100*h;
      c.fillStyle=['#778f9a','#435b61','#9ba8a0'][n%3];c.beginPath();c.ellipse(x,y,w*.065,h*.037,(n%3-.5)*.3,0,Math.PI*2);c.fill();
    }
    for(let u=.03;u<1;u+=.27)fill(u,.24,.027,.76,'#d2c9a9');
  }
  if(d==='cb-arc-stone'){
    fill(0,.61,1,.39,'#aaa994');
    for(let row=0;row<7;row++)for(let col=0;col<14;col++){
      const u=(col+(row%2)*.5)/14,v=.615+row*.055;
      fill(u,v,.065,.049,['#b6b4a0','#949d8c','#c3bfaa','#a4ac99'][(row+col)%4]);
      ln(u,v,u+.064,v,'#d3d0bb',.6);
    }
    fill(0,.60,1,.022,'#c4c3aa');
  }
  if(d==='cb-public-pavilion'){fill(0,.70,1,.30,'#5681ad');fill(.35,.31,.04,.17,'#b65559');}
}
export function drawMendoncaBeneditoOpeningDetails(c,b,w,h){
  if(b.detail==='cb-impacto'){
    for(const opening of b.openings??[]){
      if(opening.kind!=='porch')continue;
      const x=opening.u*w,y=(1-opening.bottom-opening.h)*h,ww=opening.w*w,hh=opening.h*h;
      c.fillStyle='#697462';c.fillRect(x,y,ww,hh);
      for(let row=0;row<3;row++){
        c.fillStyle='#c3c6ad';c.fillRect(x+ww*.04,y+hh*(.28+row*.23),ww*.90,hh*.02);
        for(let col=0;col<5;col++){
          c.fillStyle=['#bc9770','#88998a','#d2c7aa','#6a5c50'][(row+col)%4];
          c.fillRect(x+ww*(.06+col*.18),y+hh*(.16+row*.23),ww*.11,hh*.09);
        }
      }
      for(let col=0;col<4;col++){c.fillStyle='#e7e3bc';c.fillRect(x+ww*(.1+col*.23),y+hh*.04,ww*.05,hh*.016);}
      c.fillStyle='#b3b9ad';c.fillRect(x,y+hh*.89,ww,hh*.11);
    }
    return;
  }
  if(b.detail!=='cb-arc-stone')return;
  for(const opening of b.openings??[]){
    if(opening.kind!=='porch')continue;
    const x=opening.u*w,y=(1-opening.bottom-opening.h)*h,ww=opening.w*w,hh=opening.h*h;
    c.fillStyle='#777967';c.fillRect(x,y,ww,hh);
    c.fillStyle='#555b49';c.fillRect(x+ww*.24,y+hh*.36,ww*.39,hh*.61);
    for(const v of [.65,.90]){c.fillStyle='#b9b39a';c.fillRect(x,y+hh*v,ww,hh*.065);}
    c.fillStyle=b.color;c.beginPath();c.moveTo(x,y+hh*.25);c.lineTo(x,y);c.lineTo(x+ww,y);c.lineTo(x+ww,y+hh*.25);c.bezierCurveTo(x+ww*.82,y-hh*.06,x+ww*.18,y-hh*.06,x,y+hh*.25);c.fill();
  }
}
