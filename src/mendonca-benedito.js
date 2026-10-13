import { CROSS_Y as Y, mendoncaPoints } from './mendonca-data.js';
import { MENDONCA_ROAD as R, BENEDITO_PROFILE as A } from './road-profiles.js';
import { ALCEBIADES_GARDEN } from './alcebiades-data.js';
import { parkingOffset } from './road-dimensions.js';

export const MENDONCA_BENEDITO_END=mendoncaPoints.find(p=>p.id===37);
// A borda leste da avenida encontra o limite artístico já existente da praça.
export const BENEDITO_X=ALCEBIADES_GARDEN.x-A.outerHalfWidth;
export const BENEDITO_CROSS={x:BENEDITO_X-A.outerHalfWidth,y:Y-280,w:A.totalWidth,h:560};
export const MENDONCA_BENEDITO_WALK={x:BENEDITO_X-280,y:Y-R.outerHalfWidth,w:-2223-(BENEDITO_X-280),h:R.totalWidth};
export const BENEDITO_PARKING={x:ALCEBIADES_GARDEN.x,y:Y-190,w:-2335-ALCEBIADES_GARDEN.x,h:190-R.outerHalfWidth};
const o=(kind,u,w,bottom,h,extra={})=>({kind,u,w,bottom,h,...extra});
const sign=(u,top,w,h,text,extra={})=>({u,top,w,h,text,...extra});
function frontage(id,side,start,end,data){
  const depth=data.depth??170;
  const local={id,side:side==='north'?'west':'east',x:side==='north'?-R.outerHalfWidth-depth:R.outerHalfWidth,y:start,depth,length:end-start,height:65,roof:'flat',color:'#d4d4c6',base:'#969e89',baseHeight:0,wear:.3,openings:[],signs:[],photoDirection:side==='north'?1:5,residential:false,...data};
  return {...local,street:'conego-mendonca',axis:'x',originY:Y,local,x:start,y:Y-local.x-depth,depth:end-start,length:depth};
}
const east=BENEDITO_X+A.outerHalfWidth,west=BENEDITO_X-A.outerHalfWidth;
export const mendoncaBeneditoBuildings=[
  frontage('cm-b-santander','north',-2550,-2458,{point:33,refs:[[31,8],[32,1],[32,8],[33,1],[33,2]],name:'Santander 352, fachada cinza com faixa vermelha e entrada de vidro',height:72,color:'#929b9e',detail:'cb-bank',openings:[o('door',.07,.43,.02,.53,{glass:true,color:'#617367'}),o('window',.59,.34,.18,.31,{glass:true,color:'#688474'})],signs:[sign(.02,.05,.96,.24,'Santander',{color:'#b43f44',ink:'#eee9d9'}),sign(.61,.33,.17,.08,'352',{ink:'#343f39'})]}),
  frontage('cm-b-cartorio-eleitoral','north',-2730,-2550,{point:34,refs:[[33,1],[33,8],[34,1],[34,2],[35,1],[35,2]],name:'Cartório Eleitoral da 7ª Zona, muro branco, portão de madeira e flores',height:54,roof:'none',depth:195,color:'#d2d5ca',wear:1,detail:'cb-court-wall',openings:[o('gate',.035,.35,0,.78,{solid:1,wood:true,color:'#96856a'}),o('door',.43,.11,0,.78,{wood:true,color:'#8c7c5e'})],signs:[sign(.59,.20,.39,.25,'TRE',{color:'#e3e1d0',ink:'#685d83',sub:'CARTÓRIO ELEITORAL DA 7ª ZONA'})]}),
  frontage('cm-b-impacto','north',east,-2730,{point:36,refs:[[34,8],[35,1],[35,8],[36,1],[36,2],[37,1],[37,2]],name:'Impacto Calçados, sobrado marrom, faixa vermelha e vitrines',height:155,depth:260,roof:'flat',color:'#a1816c',wear:.16,detail:'cb-impacto',openings:[o('porch',.04,.43,0,.46,{glass:true,color:'#6d7b6a'}),o('porch',.52,.43,0,.46,{glass:true,color:'#798572'}),o('window',.08,.84,.75,.18,{glass:true,bars:'#d1d4c7',grille:'square',color:'#90a6a4'})],signs:[sign(.035,.32,.93,.14,'IMPACTO CALÇADOS',{color:'#365a8f',ink:'#e0dfd3'})],crossFacade:{face:'minY',street:'conego-mendonca',point:37,photoDirection:2,color:'#a48470',detail:'cb-impacto-side',openings:[...[.20,.52,.80].flatMap(u=>[o('vent',u,.12,.73,.055,{glass:true,bars:'#d7dccf',grille:'horizontal'}),o('vent',u,.12,.25,.055,{glass:true,bars:'#d7dccf',grille:'horizontal'})])],signs:[sign(.77,.29,.18,.14,'Impacto',{color:'#d7d7b9',ink:'#54709b',sub:'Calçados'})]}}),
  frontage('cm-b-tatico','north',west-185,west,{point:37,refs:[[36,7],[36,8],[37,1],[37,8]],name:'Comércio de esquina com camuflagem azul e portões escuros',height:72,roof:'tile',color:'#c2bea4',wear:.9,detail:'cb-camouflage',openings:[o('door',.10,.24,0,.72,{color:'#33433a',grille:'horizontal'}),o('shutter',.68,.23,0,.74,{color:'#364940'})],signs:[sign(.025,.02,.95,.22,'TÁTICO',{color:'#6e7972',ink:'#d1d1bc'})],crossFacade:{face:'maxY',street:'conego-mendonca',point:37,photoDirection:1,color:'#c2bea4',detail:'cb-camouflage',openings:[o('door',.12,.28,0,.72,{color:'#2d4436'}),o('door',.65,.28,0,.72,{color:'#2d4436'})],signs:[]}}),
  frontage('cm-b-sobrado-arcos','south',west-260,west,{point:37,refs:[[35,6],[36,5],[36,6],[37,4],[37,5],[37,6],[37,7]],name:'Sobrado branco de varandas em arco e muro de pedra na esquina',height:145,depth:240,roof:'tile',color:'#dddac8',wear:.2,detail:'cb-arc-stone',openings:[.025,.35,.675].map(u=>o('porch',u,.28,.43,.40,{color:'#777865',grille:'horizontal',bars:'#aaa18a'})),crossFacade:{face:'maxY',street:'conego-mendonca',point:37,photoDirection:5,color:'#dddac8',detail:'cb-arc-stone',openings:[.025,.35,.675].map(u=>o('porch',u,.28,.43,.40,{color:'#777865',grille:'horizontal',bars:'#aaa18a'})),signs:[]}}),
];
export function withMendoncaBeneditoCorner(b){
  if(b.id==='cm-p-girassol-center')return {...b,point:32,refs:[...b.refs,[32,1],[32,2]],local:{...b.local,point:32}};
  if(b.id==='as-pavilhao-claro')return {...b,crossFacade:{...b.crossFacade,street:'conego-mendonca',point:34,photoDirection:4,refs:[[32,5],[33,5],[34,4],[35,4],[36,3]],detail:'cb-public-pavilion',color:'#d1d8d0',base:'#527ca8',baseHeight:.3,openings:[o('door',.10,.16,0,.64,{grille:'vertical',bars:'#829487',color:'#60736b'})],signs:[sign(.35,.29,.60,.22,'CODÓ',{color:'#d7ded6',ink:'#466c9b',sub:'DEPARTAMENTO MUNICIPAL DE CULTURA E TURISMO'})]}};
  return b;
}
export const mendoncaBeneditoTrees=[{x:-2780,y:Y-180,size:75,height:98,spreading:true,seed:1711}];
export const mendoncaBeneditoShrubs=[{x:-2610,y:Y+170,r:45,flowers:true},{x:-3325,y:Y-138,r:22,flowers:true}];
export const mendoncaBeneditoPoles=[{x:-2640,y:Y+88,height:160,street:'conego-mendonca'},{x:west+40,y:Y+88,height:162,street:'conego-mendonca'}];
export const mendoncaBeneditoCars=[
  ...[-2470,-2530,-2590,-2650,-2720,-2855].map((x,i)=>({x,y:Y-148,angle:-.22,color:['#929d9b','#a7ada8','#a65659','#424e4b','#707f78','#bdc4ba'][i],seed:1720+i})),
  {x:-2530,y:Y+parkingOffset(R),axis:'x',color:'#697c8c',seed:1730},
  {x:-2700,y:Y+parkingOffset(R),axis:'x',color:'#36433c',seed:1731},
  {x: -2890,y:Y+parkingOffset(R),axis:'x',color:'#3a4440',seed:1732},
];
export const mendoncaBeneditoBikes=[{x:-2475,y:Y+83},{x:-2435,y:Y+83},{x:-2710,y:Y+83},{x:-2845,y:Y+83}];
export const mendoncaBeneditoDescriptions={
  32:['Girassol e Santander','O portal amarelo e o banco de faixa vermelha ficam diante do quiosque da praça.'],
  33:['Estacionamento da praça','Carros em vagas diagonais, árvores e o muro branco do Cartório Eleitoral.'],
  34:['Cartório Eleitoral','Portões de madeira e flores acima do muro; o pavilhão azul e branco fica do outro lado.'],
  35:['Impacto Calçados','Vitrines abertas, faixa azul e vermelha e andar superior envidraçado.'],
  36:['Avenida São Benedito','A esquina da loja abre para a avenida e para o sobrado de arcos e muro de pedra.'],
  37:['O cruzamento da São Benedito','A captura termina na interseção. Comércio de camuflagem e sobrado branco completam as faces da esquina.'],
};
