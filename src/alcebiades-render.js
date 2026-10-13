import { project as P } from './projection.js';
import { ALCEBIADES_PROFILE as R } from './road-profiles.js';
import { ALCEBIADES_X as X, ALCEBIADES_END, ALCEBIADES_WALK, ALCEBIADES_CARDOSO, ALCEBIADES_GARDEN } from './alcebiades-data.js';
import { drawAlcebiadesJulhoGround, drawAlcebiadesJulhoFacade, drawAlcebiadesJulhoOpeningDetails } from './alcebiades-julho-render.js';
function poly(c,ps,color,stroke){c.beginPath();ps.forEach((p,i)=>{const q=P(...p);i?c.lineTo(q.x,q.y):c.moveTo(q.x,q.y);});c.closePath();c.fillStyle=color;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=.8;c.stroke();}}
function rect(c,x,y,w,h,color,z=0){poly(c,[[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z]],color);}
function line(c,a,b,color,width=1){const p=P(...a),q=P(...b);c.beginPath();c.moveTo(p.x,p.y);c.lineTo(q.x,q.y);c.strokeStyle=color;c.lineWidth=width;c.stroke();}
export function drawAlcebiadesGround(c,asphalt,paving){
  const a=ALCEBIADES_WALK,g=ALCEBIADES_GARDEN,t=ALCEBIADES_CARDOSO;
  rect(c,g.x,g.y,g.w,g.h,paving);
  rect(c,a.x,a.y,a.w,a.h,paving);
  rect(c,X-R.halfWidth,a.y,R.width,a.h,asphalt);
  rect(c,t.x,t.y,t.w,t.h,paving);
  rect(c,t.x,t.y+R.sidewalkWidth,t.w,R.width,asphalt);
  for(let y=a.y;y<a.y+a.h;y+=19){
    if(y<9)continue;
    for(const side of [-1,1]){
      if(side>0&&y>t.y&&y<t.y+t.h)continue;
      const x=X+side*R.halfWidth;
      line(c,[x,y,1],[x,Math.min(y+19,a.y+a.h),1],'#bfc4a9',2);
      line(c,[x,y,0],[x+side*R.sidewalkWidth,y,0],'#7a847055',.6);
    }
  }
  // Parking in hexagonal paving lies outside the full sidewalk width.
  for(let y=9;y<2205;y+=12)for(let x=X-195;x<X-R.outerHalfWidth-3;x+=14){
    const xx=x+((Math.floor(y/12)%2)*7);
    poly(c,Array.from({length:6},(_,i)=>[xx+7*Math.cos(i*Math.PI/3),y+7*Math.sin(i*Math.PI/3),0]),'#a5a98f','#7c886654');
  }
  for(const [y,h] of [[1115,175],[1360,220],[1670,80],[1780,310]]){
    rect(c,X-315,y,110,h,'#899568');
    for(let x=X-315;x<X-200;x+=115)line(c,[x,y,2],[x,y+h,2],'#b5b99e',2);
  }
  // Walkways and planted strips between the two public buildings.
  rect(c,X-745,1640,410,125,paving);
  for(const y of [1692,1725])rect(c,X-700,y,170,13,'#879362');
  const cx=X-535,cy=1692;
  poly(c,Array.from({length:40},(_,i)=>[cx+41*Math.cos(i*Math.PI/20),cy+41*Math.sin(i*Math.PI/20),4]),'#4f7293','#b5c2b0');
  poly(c,Array.from({length:40},(_,i)=>[cx+35*Math.cos(i*Math.PI/20),cy+35*Math.sin(i*Math.PI/20),5]),'#788774');
  // Low access ramps and plant bed remain outside the through sidewalk strip.
  rect(c,X+R.outerHalfWidth,1830,7,70,'#bfcac2',2);
  rect(c,X+R.outerHalfWidth,1480,8,23,'#8eaaa9',2);
  rect(c,X-715,1780,25,280,'#a8b49b');
  for(let i=0;i<28;i++){
    const y=1027.5+i*41,x=X-21+(i*17%42);
    rect(c,x,y,7+i%4*3,3+i%3*3,i%2?'#959980':'#737b69');
  }
  drawAlcebiadesJulhoGround(c,asphalt,paving);
}
export function drawAlcebiadesFacade(c,b,w,h){
  drawAlcebiadesJulhoFacade(c,b,w,h);
  const d=b.detail,fill=(u,v,ww,hh,color)=>{c.fillStyle=color;c.fillRect(u*w,v*h,ww*w,hh*h);};
  const ln=(u,v,uu,vv,color,width=.7)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(u*w,v*h);c.lineTo(uu*w,vv*h);c.stroke();};
  if(d==='as-cortez'){
    fill(.01,.29,.97,.71,'#dadfd6');
    for(let n=0;n<90;n++){const u=(n*37%99)/100,v=.3+(n*17%65)/100;ln(u,v,Math.min(.98,u+.08),Math.min(.99,v+.04),'#9ea99755',.6);}
    fill(.20,.26,.80,.105,'#899595');
    for(let u=.22;u<.47;u+=.033)fill(u,.21,.016,.14,'#6c7c79');
    for(let u=.015;u<.18;u+=.034){fill(u,0,.020,1,'#889994');ln(u+.019,0,u+.019,1,'#526661');}
    fill(.32,.89,.35,.08,'#e3e6d6');
    for(let u=.34;u<.67;u+=.023){ln(u,.90,u+.012,.75,'#607745',1.4);ln(u,.91,u-.012,.82,'#8c9d64',1);}
    fill(.92,.05,.065,.15,'#ab514b');
    fill(.50,.08,.018,.10,'#a34742');fill(.48,.115,.055,.025,'#a34742');
  }
  if(d==='as-old-wall'){
    for(let n=0;n<170;n++)fill((n*31%98)/100,(n*13%90)/100,.006+n%3*.008,.02+n%5*.018,n%3?'#5f6c5366':'#c4ccb077');
    fill(0,0,1,.07,'#7d8970');
  }
  if(['as-lc','as-councils','as-cream-house'].includes(d)){
    for(const v of [.03,.07,.105])ln(0,v,1,v,d==='as-cream-house'?'#a9894d':'#b5b79f',2);
    fill(.01,0,.025,.95,'#b4b59d');fill(.97,0,.025,.95,'#b4b59d');
    if(d==='as-lc')fill(.075,.30,.30,.05,'#597d9a');
  }
  if(d==='as-cartorio'){
    for(let y=0;y<h;y+=4)for(let x=0;x<w;x+=15){c.fillStyle=['#b19c82','#8e7864','#c1a48b','#99785f'][(Math.round(x+y))%4];c.fillRect(x+(y%8?5:0),y,14,3);}
    fill(0,.45,.31,.55,'#bc746b');fill(0,.42,1,.035,'#776f58');
  }
  if(d==='as-rayssa'){
    fill(.19,.37,.70,.63,'#3b5498');
    for(const v of [.06,.09,.12,.30,.33])ln(0,v,1,v,'#9aa8a0');
  }
  if(d==='as-rayssa-side'){fill(0,0,.36,.29,'#697d81');for(let v=.05;v<.28;v+=.05)ln(.04,v,.32,v,'#9caeaa');}
  if(d==='as-sicoob'){fill(.14,.41,.56,.59,'#447981');fill(.78,0,.22,1,'#bb9d87');}
  if(d==='as-red-kiosk')fill(0,.42,1,.12,'#c5a16c');
  if(d==='as-library'||d==='as-library-end'){
    const count=d==='as-library'?7:3;
    // Window arches and sealed recesses are drawn explicitly as seen in photos.
    for(let i=0;i<count;i++){
      const u=(i+.24)/count,ww=w*.48/count,x=u*w;
      fill((i+.07)/count,0,.025,.95,'#dcd9bd');
      for(const v of [.19,.68]){
        const yy=v*h,hh=h*.17;
        c.beginPath();c.moveTo(x,yy+hh);c.lineTo(x,yy+ww*.35);c.quadraticCurveTo(x+ww*.5,yy-ww*.35,x+ww,yy+ww*.35);c.lineTo(x+ww,yy+hh);c.closePath();
        const sealed=d==='as-library-end'&&i===0;
        c.fillStyle=sealed?'#bfbba4':'#4b5744';c.fill();c.strokeStyle='#b0ac91';c.lineWidth=1.3;c.stroke();
        if(!sealed){for(let n=1;n<4;n++)ln(u+ww/w*n/4,v+.04,u+ww/w*n/4,v+.17,'#93947c',.65);ln(u,v+.11,u+ww/w,v+.11,'#8b8f72',.7);}
      }
    }
    for(let n=0;n<160;n++){
      const u=(n*31%98)/100,v=.40+(n*17%59)/100;
      fill(u,v,.006+n%3*.012,.015+n%4*.019,n%3?'#8a90726b':'#b6b49877');
    }
    fill(0,.97,1,.03,'#707a64');
  }
}
export function drawAlcebiadesOpeningDetails(c,b,w,h){
  drawAlcebiadesJulhoOpeningDetails(c,b,w,h);
  if(b.detail!=='as-cartorio')return;
  for(const o of b.openings.filter(o=>typeof o.awning==='string')){
    const x=o.u*w,ww=o.w*w,y=(1-o.bottom-o.h)*h;
    c.fillStyle=o.awning;c.beginPath();c.moveTo(x-2,y-5);c.lineTo(x+ww+2,y-5);c.lineTo(x+ww+6,y+15);c.lineTo(x-5,y+15);c.closePath();c.fill();
    c.fillStyle=o.kind==='door'?'#a36562':'#355f86';c.fillRect(x-5,y+15,ww+11,4);
    c.strokeStyle='#d3d2b8';c.lineWidth=.6;c.beginPath();c.moveTo(x-2,y-5);c.lineTo(x-5,y+15);c.lineTo(x+ww+6,y+15);c.lineTo(x+ww+2,y-5);c.stroke();
    if(o.kind==='shutter'){c.fillStyle='#e5e3ce';c.font='bold 3.5px Arial';c.textAlign='center';c.fillText('CARTÓRIO DO 1º OFÍCIO',x+ww/2,y+18,ww+6);}
  }
}
