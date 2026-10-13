import { ALCEBIADES_PROFILE as R, JULHO_PROFILE } from './road-profiles.js';
import { alcebiadesPoints } from './alcebiades-points.js';
const X=alcebiadesPoints[0].x;
export const ALCEBIADES_JULHO={x:X-760,y:-95-JULHO_PROFILE.outerHalfWidth,w:1200,h:JULHO_PROFILE.totalWidth};
const o=(kind,u,w,bottom,h,extra={})=>({kind,u,w,bottom,h,...extra});
const sign=(u,top,w,h,text,extra={})=>({u,top,w,h,text,...extra});
const front=(id,y,length,data)=>({id,side:'east',x:X+R.outerHalfWidth,y,length,depth:180,street:'praca-alcebiades-silva',height:80,roof:'flat',color:'#d8d7c8',base:'#9ca38f',baseHeight:0,wear:.25,residential:false,photoDirection:3,openings:[],signs:[],...data});
const ceoLocal={id:'as-centro-odontologico',side:'east',x:JULHO_PROFILE.outerHalfWidth,y:X+R.outerHalfWidth,depth:210,length:285,height:82,roof:'flat',color:'#dadbd0',base:'#b66759',baseHeight:.22,wear:.3,residential:false,detail:'as-ceo',point:15,photoDirection:4,refs:[[15,3],[15,4],[15,5]],name:'Centro de Especialidades Odontológicas, varanda branca e grade sobre base vermelha',openings:[o('door',.15,.13,0,.55,{color:'#4c5c4e'}),o('window',.38,.06,.26,.26,{grille:'vertical'}),o('door',.68,.17,.1,.62,{color:'#4b5849',grille:'vertical'}),o('window',.91,.055,.27,.28,{grille:'vertical'})],signs:[sign(.03,.08,.63,.19,'Centro de Especialidades',{color:'#719859',ink:'#e6e7d5',sub:'Odontológicas'})]};
export const alcebiadesJulhoBuildings=[
  front('as-corpus',330,170,{point:13,refs:[[12,4],[13,2],[13,3],[14,2]],name:'Corpus, faixa preta, madeira alaranjada e toldo laranja',detail:'as-corpus',color:'#b88452',height:80,openings:[o('door',.38,.59,0,.62,{glass:true,color:'#425346',awning:'#c48f65'})],signs:[sign(.03,.08,.94,.18,'CORPUS',{color:'#283c36',ink:'#d88b51',sub:'SUPLEMENTOS E PRODUTOS NATURAIS'})]}),
  front('as-sobrado-crefisa',9,321,{point:14,refs:[[13,4],[14,2],[14,3],[14,4],[15,1],[15,2]],name:'Sobrado creme da Crefisa, varanda de esquina e loja cinza ao lado',detail:'as-crefisa',height:144,depth:210,roof:'tile',color:'#d6c9a7',openings:[o('door',.04,.45,0,.31,{glass:true,color:'#638075',awning:'#68809d'}),o('shutter',.65,.29,0,.38,{color:'#b5b3a0'}),o('porch',.035,.36,.61,.32,{grille:'horizontal',bars:'#d7d9c5',color:'#8c7e5e'}),...[.53,.78].map(u=>o('window',u,.11,.65,.25,{grille:'horizontal',bars:'#d9dfcf',color:'#839186'}))],signs:[sign(.01,.43,.55,.15,'crefisa',{color:'#315988',ink:'#e3e4d4'})],crossFacade:{face:'minY',street:'praca-alcebiades-silva',point:15,photoDirection:2,color:'#d6c9a7',detail:'as-crefisa-side',openings:[o('shutter',.07,.22,0,.36,{color:'#4d6e98'}),o('door',.51,.29,0,.38,{glass:true,color:'#5c7164'}),o('porch',.07,.75,.61,.32,{grille:'horizontal',bars:'#dae0cc',color:'#8d8066'})],signs:[sign(.02,.43,.96,.15,'crefisa',{color:'#315988',ink:'#e4e4d3'})]}}),
  {...ceoLocal,street:'praca-alcebiades-silva',axis:'x',originY:-95,local:ceoLocal,x:ceoLocal.y,y:-95-ceoLocal.x-ceoLocal.depth,depth:ceoLocal.length,length:ceoLocal.depth},
];
export function completeSicoob(b){
  if(b.id!=='as-sicoob-esquina')return b;
  // Keep the northern corner and its ID. The former short context volume now
  // extends south to the lot division documented by points 12 and 13.
  return {...b,y:500,length:b.y+b.length-500,point:12,refs:[[10,4],[11,3],[11,4],[12,2],[12,3],[13,1]],openings:[o('door',.38,.40,0,.55,{glass:true,color:'#647e74'})],signs:[sign(.14,.10,.80,.20,'SICOOB',{color:'#355e5b',ink:'#e1e5cf'}),sign(.02,.45,.10,.07,'1815',{ink:'#596755'})],detail:'as-sicoob-complete'};
}
export const ALCEBIADES_COURT={x:X-700,y:565,w:365,h:335,height:92};
export const alcebiadesSports=[
  {id:'as-rampa-norte',x:X-690,y:490,w:310,h:48,height:32,kind:'ramp'},
  {id:'as-rampa-sul',x:X-690,y:260,w:310,h:48,height:32,kind:'ramp'},
  {id:'as-rail-skate',x:X-585,y:365,w:110,h:5,height:20,kind:'rail'},
  {id:'as-abrigo-motos',x:X-198,y:290,w:60,h:175,height:59,kind:'shelter'},
  {id:'as-placa-digital',x:X-158,y:65,w:6,h:120,height:120,kind:'billboard'},
  {id:'as-mesa-praca-1',x:X-310,y:195,w:27,h:27,height:24,kind:'table'},
  {id:'as-mesa-praca-2',x:X-420,y:195,w:27,h:27,height:24,kind:'table'},
];
const ct=ALCEBIADES_COURT;
export const alcebiadesFence=[
  {x:ct.x,y:ct.y,w:ct.w,h:3,height:ct.height},
  {x:ct.x,y:ct.y+ct.h,w:ct.w,h:3,height:ct.height},
  {x:ct.x,y:ct.y,w:3,h:ct.h,height:ct.height},
  {x:ct.x+ct.w,y:ct.y,w:3,h:ct.h*.40,height:ct.height},
  {x:ct.x+ct.w,y:ct.y+ct.h*.60,w:3,h:ct.h*.40,height:ct.height},
];
export const alcebiadesJulhoObstacles=[
  ...alcebiadesFence.map(p=>({...p,id:'as-court-fence'})),
  ...alcebiadesSports.filter(p=>p.kind!=='shelter').map(p=>({...p})),
  ...alcebiadesSports.filter(p=>p.kind==='shelter').flatMap(p=>[p.x,p.x+p.w].flatMap(x=>[p.y,p.y+p.h].map(y=>({x,y,r:2.5,id:'as-shelter-post'})))),
];
export const alcebiadesJulhoTrees=[
  {x:X-215,y:910,size:72,height:104,spreading:true,seed:1110},
  ...[710,520,180].map((y,i)=>({x:X-265,y,size:i===2?68:52,height:i===2?96:64,spreading:true,seed:1111+i})),
  {x:X-480,y:190,size:49,height:59,spreading:true,seed:1115},
  {x:X-560,y:-255,size:117,height:165,spreading:true,seed:1116},
  {x:X+330,y:-320,size:72,height:98,spreading:true,seed:1117},
];
export const alcebiadesJulhoPoles=[600,30].map(y=>({x:X+R.halfWidth+23,y,height:158,street:'praca-alcebiades-silva'}));
export const alcebiadesJulhoLamps=[{x:X-235,y:100,height:147,lamp:true,lampArms:2,street:'praca-alcebiades-silva'},{x:X-690,y:940,height:186,lamp:true,lampArms:2,street:'praca-alcebiades-silva'},{x:X-710,y:530,height:186,lamp:true,lampArms:2,street:'praca-alcebiades-silva'}];
export const alcebiadesJulhoCars=[{x:X-140,y:790,axis:'x',color:'#d9ded0',seed:1120},{x:X+43,y:410,color:'#d0d7cd',seed:1121}];
export const alcebiadesJulhoBikes=[{x:X+79,y:210},{x:X+79,y:243},{x:X-177,y:320},{x:X-175,y:355},{x:X-174,y:390}];
export const alcebiadesJulhoSeats=[{x:X-315,y:250,w:38,h:10},{x:X-440,y:240,w:38,h:10}];
export const alcebiadesJulhoDescriptions=[
 ['Depois da Travessa Z. Cardoso','Siga reto pela praça, junto à lateral branca do Sicoob.'],
 ['Sicoob e quadra','Entrada de vidro com rampa azul diante da quadra cercada.'],
 ['Corpus e o abrigo','Toldo laranja e frente de madeira; abrigo de motos e rampas na praça.'],
 ['O sobrado da Crefisa','Janelas claras, varanda na esquina e faixa azul sobre a entrada.'],
 ['Rua Vinte e Oito de Julho','Esquina da Crefisa, em frente ao Centro de Especialidades Odontológicas.'],
];
