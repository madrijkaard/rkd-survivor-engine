import { JULHO_PROFILE as R } from './road-profiles.js';
import { project as P } from './projection.js';
import { JULHO_EAST, COELHO_MOUTH } from './julho-east.js';

function poly(c,points,color){c.beginPath();points.forEach(([x,y,z=0],i)=>{const p=P(x,y,z);i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y);});c.closePath();c.fillStyle=color;c.fill();}
function rect(c,x,y,w,h,color,z=0){poly(c,[[x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z]],color);}
function line(c,a,b,color,width=1){const p=P(...a),q=P(...b);c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(q.x,q.y);c.stroke();}
export function drawJulhoEastGround(c,asphalt,paving){
  const end=JULHO_EAST.x,Y=-95;
  rect(c,836,Y-R.outerHalfWidth,end-836,R.totalWidth,paving);
  rect(c,COELHO_MOUTH.x,COELHO_MOUTH.y,COELHO_MOUTH.w,COELHO_MOUTH.h,paving);
  rect(c,836,Y-R.halfWidth,end-836,R.width,asphalt);
  rect(c,end-R.halfWidth,COELHO_MOUTH.y,R.width,COELHO_MOUTH.h,asphalt);
  for(const y of [Y-R.outerHalfWidth,Y+R.halfWidth])for(let x=945;x<end-R.outerHalfWidth;x+=18)rect(c,x,y,17,R.sidewalkWidth,'#a9a48e');
  for(const y of [Y-R.halfWidth,Y+R.halfWidth])line(c,[945,y,1],[end-R.halfWidth,y,1],'#ccc7ad',2);
  // Open lot, low brick rear wall and the photographed piles of cut wood.
  rect(c,1250,9,265,245,'#859168');
  for(let i=0;i<105;i++)rect(c,1252+i*43%258,12+i*79%227,3+i%6,2+i%5,['#a8a27a','#596f46','#6f7e52'][i%3]);
  for(let i=0;i<68;i++){
    const x=1320+i*17%120,y=28+i*11%34,z=2+i%7;
    line(c,[x,y,z],[x+18+i%24,y-12+i%26,z+3],i%2?'#756647':'#a18d67',2.2);
  }
  line(c,[1250,115,0],[1515,115,0],'#876c4e',6);
  rect(c,1890,9,end-R.outerHalfWidth-1890,155,'#607949');
  // Raised thresholds: each landing remains outside the asphalt.
  for(const [a,b] of [[1515,1635],[1635,1785],[1785,1890]]){
    rect(c,a,-25,b-a,34,'#c1c4ae',3);
    for(let i=0;i<4;i++)rect(c,a+12,-25-i*3,18,3,i%2?'#a9ae9b':'#cbd0b8',i*.6);
  }
  for(const [a,b] of [[1480,1625],[1675,1750],[1750,1880]]){
    rect(c,a,-199,b-a,29,'#c8c4ae',2);
    for(let x=a;x<b;x+=9)rect(c,x,-195,8,8,x%3?'#b8b49a':'#a78770',2.3);
  }
  for(let x=1020;x<end-65;x+=94){
    line(c,[x,-117,0],[x+14,-106,0],'#44534588',.8);
    line(c,[x+14,-106,0],[x+9,-85,0],'#44534588',.8);
  }
  // The dirt entrance opposite the T-junction is scenery, not another mapped block.
  rect(c,end+R.outerHalfWidth,-130,210,145,'#9c9674');
  for(let i=0;i<80;i++)rect(c,end+R.outerHalfWidth+i*31%205,-128+i*19%139,5,3,i%2?'#7c8960':'#aa9d7a');
}

export function drawJulhoEastFacade(c,b,w,h){
  const fill=(x,y,ww,hh,color)=>{c.fillStyle=color;c.fillRect(x*w,y*h,ww*w,hh*h);};
  if(b.detail==='jl-e-stone'){
    for(let i=0;i<110;i++){
      const x=(i*37%101)/101,y=.58+(i*19%41)/100;
      c.beginPath();c.moveTo(x*w,y*h);c.lineTo((x+.03)*w,(y-.015)*h);c.lineTo((x+.05)*w,(y+.026)*h);c.lineTo((x+.014)*w,(y+.047)*h);c.closePath();c.fillStyle=['#77644b','#ac9472','#695c43'][i%3];c.fill();c.strokeStyle='#c6b28c';c.lineWidth=.6;c.stroke();
    }
    fill(0,.55,1,.027,'#c79d8c');
  }
  if(b.detail==='jl-e-yellow'){fill(0,.48,1,.04,'#758268');fill(.055,.13,.09,.06,'#a5aaa1');}
  if(b.detail==='jl-e-gray'){fill(0,.48,1,.035,'#e1e0d2');fill(0,.57,1,.025,'#aab1a6');}
  if(b.detail==='jl-e-worn'||b.detail==='jl-e-brick'){
    for(let row=0;row<7;row++)for(let x=0;x<w;x+=13){
      if(b.detail==='jl-e-worn'&&(x*7+row*11)%29>18)continue;
      c.fillStyle=['#987b5c','#ac8d6c','#bc9b74'][row%3];c.fillRect(x+(row%2)*6,h-4-row*4,11,3);
    }
  }
  if(b.detail==='jl-e-balcony'){
    fill(0,.39,1,.035,'#919988');fill(0,.62,1,.03,'#b8bbae');
    for(const u of [.08,.25,.72,.90]){fill(u,.31,.065,.07,'#9c7754');for(let i=0;i<7;i++)fill(u+(i%3)*.018,.24+(i%4)*.019,.025,.025,i%3?'#aeb47c':'#b36464');}
  }
  if(b.detail==='jl-e-porch'){
    fill(0,.07,1,.035,'#6b6045');
    for(const u of [.01,.35,.65,.97])fill(u,.07,.025,.93,'#938b70');
  }
}
