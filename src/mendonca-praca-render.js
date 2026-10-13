import { project as P } from './projection.js';
import { CROSS_Y } from './mendonca-data.js';
import { MENDONCA_ROAD, FERNANDO_PROFILE } from './road-profiles.js';
import { JULHO_END } from './julho-data.js';
import { MENDONCA_PRACA_WALK, ALCEBIADES_MOUTH, ALCEBIADES_CORNER, MENDONCA_FIELD, MENDONCA_WEST_END } from './mendonca-praca.js';
function rect(c,x,y,w,h,color,z=0){const ps=[[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z]].map(p=>P(...p));c.beginPath();ps.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();c.fillStyle=color;c.fill();}
function line(c,a,b,color,width=1){const p=P(...a),q=P(...b);c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(q.x,q.y);c.stroke();}
export function drawMendoncaPracaGround(c,asphalt,paving){
  const r=MENDONCA_PRACA_WALK,t=ALCEBIADES_MOUTH,k=ALCEBIADES_CORNER;
  rect(c,r.x,r.y,JULHO_END.x-FERNANDO_PROFILE.outerHalfWidth-r.x,r.h,paving);
  rect(c,t.x,t.y,t.w,t.h,paving);rect(c,k.x,k.y,k.w,k.h,paving);
  rect(c,r.x,CROSS_Y-MENDONCA_ROAD.halfWidth,r.w,MENDONCA_ROAD.width,asphalt);
  rect(c,t.x+MENDONCA_ROAD.sidewalkWidth,t.y,MENDONCA_ROAD.width,t.h,asphalt);
  const start=r.x,finish=JULHO_END.x-FERNANDO_PROFILE.outerHalfWidth;
  for(const sign of [-1,1])for(let x=start;x<finish-4;x+=18){
    if(sign<0&&x>t.x&&x<t.x+t.w)continue;
    const y=CROSS_Y+sign*MENDONCA_ROAD.halfWidth;
    line(c,[x,y,1],[Math.min(x+18,finish),y,1],'#c9c9ab',2);
    line(c,[x,y,1],[x,y+sign*(MENDONCA_ROAD.sidewalkWidth-2),1],'#7f887066',.7);
  }
  // Vacant lot, with a deeper western portion behind the existing Fernando lots.
  let seed=963;
  const random=()=>((seed=Math.imul(seed,1664525)+1013904223>>>0)/4294967296);
  for(const f of MENDONCA_FIELD){
    rect(c,f.x,f.y,f.w,f.h,'#8e9564');
    for(let n=0;n<Math.round(f.w*f.h/48);n++){
      const x=f.x+3+random()*(f.w-6),y=f.y+3+random()*(f.h-6);
      line(c,[x,y,0],[x+(random()-.5)*5,y,3+random()*12],n%3?'#7b8c4f':'#adb076',.7);
    }
  }
  rect(c,-1783,CROSS_Y+105,135,156,'#8e9b77');
  // Small planted island at the mouth, not a reconstruction of the whole plaza.
  const px=MENDONCA_WEST_END.x-172,py=CROSS_Y-175;
  for(let i=0;i<32;i++){
    const a=i*Math.PI/16,b=(i+1)*Math.PI/16;
    line(c,[px+42*Math.cos(a),py+34*Math.sin(a),3],[px+42*Math.cos(b),py+34*Math.sin(b),3],'#d0d1b3',4);
  }
  rect(c,px-29,py-21,58,42,'#758950',1);
}
export function drawMendoncaPracaFacade(c,b,w,h){
  const d=b.detail,fill=(u,v,ww,hh,color)=>{c.fillStyle=color;c.fillRect(u*w,v*h,ww*w,hh*h);};
  const ln=(u,v,uu,vv,color,width=.7)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(u*w,v*h);c.lineTo(uu*w,vv*h);c.stroke();};
  if(d==='cm-p-sublime'){
    fill(.35,0,.20,1,'#c4c8b8');
    for(let y=0;y<h;y+=4)for(let x=w*.35;x<w*.55;x+=4){c.fillStyle=(Math.floor(x+y)%3)?'#e0e2d188':'#86968d77';c.fillRect(x,y,2.5,3);}
    fill(.79,0,.21,1,'#ddd8c6');fill(.79,0,.07,.56,'#ad9778');
    for(let v=.015;v<.56;v+=.045)ln(.79,v,.86,v,'#7c705659');
    fill(.79,.43,.21,.13,'#315d95');
    fill(.59,.20,.11,.02,'#e0e4d2');
    c.fillStyle='#e0e4d2';c.beginPath();c.ellipse(w*.635,h*.15,w*.026,h*.04,-.6,0,Math.PI*2);c.fill();
  }
  if(d==='cm-p-white-yard'){
    fill(0,.32,.32,.68,'#d2d6c8');fill(.32,.13,.33,.07,'#e1e2cf');
    for(let n=0;n<35;n++)fill((n*17%30)/100,.80+(n%10)/100,.02,.045,n%3?'#939e8155':'#65795855');
    for(let u=.04;u<1;u+=.17){ln(u,0,u,.11,'#485a43');ln(u,.02,u+.12,.02,'#59634d',.5);}
  }
  if(d==='cm-p-pink-stone'){
    fill(0,.34,.68,.66,'#b49d87');
    for(let y=h*.35;y<h;y+=8)for(let x=0;x<w*.68;x+=9){
      c.fillStyle=['#c9bba2','#b39984','#d8cdb5','#a3927e'][(Math.round(x+y))%4];
      c.beginPath();c.moveTo(x+2,y);c.lineTo(x+8,y+2);c.lineTo(x+7,y+7);c.lineTo(x,y+6);c.closePath();c.fill();
    }
    fill(0,.29,1,.05,'#d1c5b1');fill(.66,.34,.025,.66,'#e0dfc9');
  }
  if(d==='cm-p-clinic-ramp'){
    fill(.03,.31,.94,.04,'#9da99a');fill(.05,.83,.90,.17,'#c9cdb9');
    for(let i=0;i<7;i++)ln(.19+i*.08,.94-i*.008,.42+i*.055,.77-i*.015,'#6e897c',1.2);
    ln(.14,.93,.46,.71,'#8b9d8c',2);ln(.55,.95,.87,.71,'#8b9d8c',2);
  }
  if(d==='cm-p-crea'){
    fill(.51,.25,.49,.75,'#8c98a1');fill(.055,.09,.05,.91,'#34488b');fill(.075,.09,.40,.24,'#34488b');
    fill(.09,.09,.385,.035,'#626d98');
  }
  if(d==='cm-p-girassol'){
    fill(.015,0,.97,.45,'#354c4b');
    const colors=['#aaa899','#7e97a0','#d1c1a0','#819574','#bcc2b6'];
    for(let row=0;row<3;row++)for(let col=0;col<4;col++){
      const u=.045+col*.235,v=.035+row*.135;fill(u,v,.205,.108,colors[(col+row)%5]);
      for(let n=0;n<2;n++)ln(u+.025,v+.036+n*.025,u+.175,v+.036+n*.025,'#54665599',.6);
    }
    fill(.025,.56,.035,.44,'#d4b740');fill(.47,.56,.04,.44,'#d4b740');
    for(let n=0;n<26;n++)fill(.02+(n%2)*.96,.55+n*.016,.025,.025,n%3?'#56713c':'#849346');
  }
  if(d==='cm-p-field-wall'){
    fill(0,0,.20,1,'#a6a48a');
    for(let y=2;y<h;y+=4)for(let x=0;x<w;x+=11){
      if(x>w*.20&&(Math.floor(x+y)%11)>2)continue;
      c.strokeStyle='#6c715b70';c.lineWidth=.5;c.strokeRect(x,y,10,3);
    }
    for(let n=0;n<120;n++)fill((n*23%98)/100,(n*13%91)/100,.006+n%3*.006,.06,n%3?'#77795a55':'#e4debd66');
    for(let u=.06;u<1;u+=.115)fill(u,0,.012,1,'#aaa689');
    fill(0,0,1,.06,'#777e5f');
  }
  if(d==='cm-p-metalmar'){
    for(let n=0;n<120;n++)fill((n*29%99)/100,(n*17%95)/100,.005+n%4*.006,.03+n%3*.025,n%3?'#e0d3aa55':'#806f4e44');
    fill(0,.91,1,.09,'#9d8a69');
    if(!b.facadeAxis){
      for(const u of [.46,.65,.82,.99])fill(u,0,.013,.94,'#ba947c');
      fill(.66,0,.34,.05,'#6f715b');
    }
    for(let x=0;x<w;x+=12)for(let y=h*.91;y<h;y+=4){c.strokeStyle='#76695088';c.lineWidth=.5;c.strokeRect(x,y,11,3);}
  }
}
