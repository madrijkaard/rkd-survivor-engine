import { ALCEBIADES_PROFILE as R, MENDONCA_ROAD } from './road-profiles.js';
import { alcebiadesPoints } from './alcebiades-points.js';
import { completeSicoob, alcebiadesJulhoBuildings, alcebiadesJulhoTrees, alcebiadesJulhoPoles, alcebiadesJulhoLamps, alcebiadesJulhoCars, alcebiadesJulhoBikes, alcebiadesJulhoSeats, alcebiadesJulhoDescriptions } from './alcebiades-julho.js';
export { alcebiadesPoints };
export const ALCEBIADES_X=alcebiadesPoints[0].x;
export const ALCEBIADES_END=alcebiadesPoints.at(-1);
export const ALCEBIADES_CARDOSO_POINT=alcebiadesPoints.find(p=>p.id===10);
const X=ALCEBIADES_X,Y=ALCEBIADES_CARDOSO_POINT.y,top=alcebiadesPoints[0].y,bottom=ALCEBIADES_END.y;
export const ALCEBIADES_WALK={x:X-R.outerHalfWidth,y:bottom-170,w:R.totalWidth,h:top-MENDONCA_ROAD.halfWidth-(bottom-170)};
export const ALCEBIADES_CARDOSO={x:X-R.halfWidth,y:Y-R.outerHalfWidth,w:400,h:R.totalWidth};
export const ALCEBIADES_GARDEN={x:X-760,y:bottom+R.outerHalfWidth,w:760-R.halfWidth,h:top-MENDONCA_ROAD.outerHalfWidth-(bottom+R.outerHalfWidth)};
const o=(kind,u,w,bottom,h,extra={})=>({kind,u,w,bottom,h,...extra});
const sign=(u,top,w,h,text,extra={})=>({u,top,w,h,text,...extra});
function front(id,side,y,length,data){
  const depth=data.depth??170;
  return {id,side,x:side==='east'?X+R.outerHalfWidth:X-340-depth,y,length,depth,street:'praca-alcebiades-silva',height:65,roof:'flat',color:'#d5d4c8',base:'#a1a391',baseHeight:0,wear:.4,residential:false,openings:[],signs:[],photoDirection:side==='east'?3:7,...data};
}
// Every frontage is tied to overlapping photographs, not one house per point.
export const alcebiadesBuildings=[
  front('as-tres-portas','east',1961,100,{point:2,refs:[[2,3],[3,2]],name:'Reboco cinza recente com três portas de enrolar',height:81,color:'#c8c6b8',wear:.2,openings:[.04,.36,.69].map(u=>o('shutter',u,.27,0,.56,{color:'#a6afa2'}))}),
  front('as-policlinica-cortez','east',1710,251,{point:4,refs:[[3,3],[4,2],[4,3],[5,2]],name:'Policlínica Cortez, mármore claro, faixa cinza e lâminas verticais',height:91,detail:'as-cortez',color:'#c6cdca',wear:.12,openings:[o('door',.76,.14,0,.54,{glass:true,color:'#344b49'})],signs:[sign(.22,.07,.72,.15,'POLICLÍNICA CORTEZ',{ink:'#4b5b57',sub:'Fundação Dr. Valci Soares Cortez'}),sign(.025,.34,.16,.16,'DR. PABLLO CORTEZ',{ink:'#3b4e49',sub:'CARDIOLOGIA'}),sign(.025,.58,.16,.16,'DR. THAYRON CORTEZ',{ink:'#3b4e49',sub:'OFTALMOLOGIA'}),sign(.92,.47,.07,.06,'1757',{ink:'#566455'})]}),
  front('as-muro-1777','east',1600,110,{point:6,refs:[[5,3],[6,3],[7,1]],name:'Muro branco manchado e portão preto, árvores no quintal',height:34,depth:170,roof:'none',color:'#d1d1bd',wear:1,detail:'as-old-wall',openings:[o('gate',.70,.25,0,.87,{solid:1,color:'#46534c'})],signs:[sign(.48,.15,.14,.27,'1777',{ink:'#586856'})]}),
  front('as-lc','east',1515,85,{point:7,refs:[[6,4],[7,2]],name:'LC, fachada creme, grade ornamental branca e entrada acessível',height:66,color:'#c5bda0',detail:'as-lc',openings:[o('door',.09,.25,0,.65,{glass:true,color:'#7e8065'}),o('gate',.47,.48,0,.65,{grille:'diamond',bars:'#d3ddce',color:'#344c49',solid:.15})],signs:[sign(.10,.07,.24,.24,'LC',{color:'#738d9a',ink:'#dddccc'})]}),
  front('as-casa-conselhos','east',1405,110,{point:7,refs:[[7,3],[8,1]],name:'Casa dos Conselhos, frente branca com portão gradeado e base cinza',height:64,color:'#dbe0d5',base:'#929f9e',baseHeight:.16,detail:'as-councils',openings:[o('gate',.57,.39,0,.67,{grille:'vertical',bars:'#c9d5c9',color:'#526557',solid:.14})],signs:[sign(.04,.20,.48,.22,'CASA DOS CONSELHOS',{color:'#e0e1d1',ink:'#3d557c'})]}),
  front('as-cartorio-papelaria','east',1245,160,{point:8,refs:[[8,3],[9,2],[10,1]],name:'Sobrado do Cartório do 1º Ofício e Papelaria Progresso',height:130,roof:'tile',color:'#aa8a74',wear:.3,detail:'as-cartorio',openings:[...[.05,.38,.73].map(u=>o('window',u,.22,.68,.21,{grille:'vertical',bars:'#ccd4bb',color:'#6a7d72'})),o('door',.06,.22,0,.31,{color:'#344a40',awning:'#c17b78'}),o('shutter',.37,.36,0,.37,{color:'#46739a',awning:'#517fac'}),o('gate',.86,.10,0,.46,{color:'#a8b5a4',bars:'#cbd4bc',solid:.05})],signs:[sign(.04,.48,.25,.08,'PAPELARIA PROGRESSO',{ink:'#473e3b'}),sign(.34,.47,.47,.09,'CARTÓRIO DO 1º OFÍCIO',{color:'#344138',ink:'#cfc07e'})]}),
  front('as-casa-creme','east',1175,70,{point:9,refs:[[9,3],[10,2]],name:'Casa creme de cornija ocre, janela alta e porta de madeira',residential:true,height:75,color:'#d9caa6',base:'#bc9050',baseHeight:.18,detail:'as-cream-house',openings:[o('door',.10,.22,0,.70,{wood:true,grille:'diamond',bars:'#6b684f',color:'#74604a'}),o('window',.60,.28,.15,.55,{wood:true,grille:'square',bars:'#5f6551',color:'#725d45'})]}),
  front('as-rayssa-monteiro','east',Y+R.outerHalfWidth,1175-(Y+R.outerHalfWidth),{point:10,refs:[[9,4],[10,2],[10,3]],name:'Rayssa Monteiro, portal azul e face cinza na Travessa Z. Cardoso',height:85,depth:165,color:'#bec7c4',detail:'as-rayssa',openings:[o('shutter',.24,.60,0,.58,{color:'#9aa89e'})],signs:[sign(.04,.14,.92,.16,'RAYSSA MONTEIRO',{ink:'#334b4a',sub:'Odontologia e Harmonização Facial'})],crossFacade:{face:'minY',street:'praca-alcebiades-silva',point:10,photoDirection:3,color:'#85939a',detail:'as-rayssa-side',openings:[o('gate',.04,.26,0,.61,{grille:'diamond',bars:'#d2ded1',color:'#71867b'})],signs:[sign(.03,.08,.37,.16,'RM',{ink:'#344a44'})]}}),
  // Small context at the opposite corner, without opening the next block.
  front('as-sicoob-esquina','east',Y-240,240-R.outerHalfWidth,{point:10,refs:[[10,3],[10,4]],name:'Sicoob, esquina branca com base cinza e portal azul',depth:245,height:84,color:'#daddd2',base:'#929c9c',baseHeight:.27,detail:'as-sicoob',openings:[o('shutter',.20,.42,0,.54,{color:'#9caea6'})],signs:[sign(.05,.10,.88,.20,'SICOOB',{color:'#355e5b',ink:'#d8e1c8'})],crossFacade:{face:'maxY',street:'praca-alcebiades-silva',point:10,photoDirection:3,color:'#dddcd1',base:'#98a3a1',baseHeight:.26,openings:[],signs:[sign(.05,.28,.15,.17,'▼',{ink:'#679c54'})]}}),
  front('as-pavilhao-claro','west',1780,280,{point:5,refs:[[3,6],[4,6],[5,7],[6,8]],name:'Pavilhão baixo branco com base vinho e ala azul',depth:260,height:55,roof:'tile',color:'#d7d9c9',base:'#a55653',baseHeight:.26,detail:'as-pavilion',openings:[.12,.46,.77].map(u=>o('window',u,.13,.38,.26,{grille:'horizontal',bars:'#718477',color:'#829487'})),crossFacade:{face:'maxY',street:'praca-alcebiades-silva',point:3,photoDirection:6,color:'#c9d0c4',base:'#4b739a',baseHeight:.30,openings:[o('window',.10,.80,.36,.39,{grille:'vertical',bars:'#b6c8b9'})],signs:[]}}),
  front('as-biblioteca','west',1080,535,{point:8,refs:[[6,6],[7,6],[8,7],[9,7],[10,7]],name:'Biblioteca Pública, casarão branco com arcos e cobertura em dois níveis',depth:310,height:124,roof:'tile',color:'#d5d4bc',base:'#7e8372',baseHeight:.09,wear:.65,detail:'as-library',openings:[],crossFacade:{face:'minY',street:'praca-alcebiades-silva',point:10,photoDirection:7,color:'#d5d4bc',detail:'as-library-end',openings:[],signs:[]},backFacade:{street:'praca-alcebiades-silva',point:8,photoDirection:7,color:'#d0cfb8',detail:'as-library',openings:[],signs:[]}}),
  front('as-quiosque-inicial','west',2160,60,{point:2,refs:[[2,6],[3,8]],name:'Quiosque leve com chapa clara e base verde',x:X-305,depth:80,height:41,roof:'shed',roofColor:'#a2aca1',color:'#d0d4cb',base:'#3f6358',baseHeight:.47,openings:[o('porch',.07,.86,.05,.42,{color:'#2b453c'})]}),
  front('as-quiosque-vermelho','west',970,56,{point:10,refs:[[9,6],[10,6]],name:'Quiosque vermelho fechado com faixa ocre',x:X-280,depth:55,height:49,roof:'shed',roofColor:'#ae5a47',color:'#b35d48',baseHeight:0,detail:'as-red-kiosk',openings:[]}),
  ...alcebiadesJulhoBuildings,
].map(completeSicoob);
export function withAlcebiadesCorner(b){
  if(b.id!=='cm-p-metalmar')return b;
  // The same volume keeps its Cônego frontage and collision; only its visible
  // side receives the sharper reference from the newly photographed street.
  const crossFacade={...b.local.crossFacade,street:'praca-alcebiades-silva',point:2,photoDirection:2,refs:[[1,4],[2,2],[3,1]]};
  return {...b,crossFacade,local:{...b.local,crossFacade}};
}
export const alcebiadesTrees=[
  ...alcebiadesJulhoTrees,
  {x:X-165,y:2030,size:46,height:108,kind:'pollarded',seed:1001},
  ...[1860,1700,1510,1330,1160].map((y,i)=>({x:X-230,y,size:60+(i%2)*8,height:67,spreading:true,seed:1002+i})),
  {x:X-500,y:1710,size:58,height:73,spreading:true,seed:1010},
  {x:X+200,y:1590,size:82,height:114,spreading:true,seed:1011},
  {x:X+245,y:1540,size:43,height:113,kind:'palm',seed:1012},
];
export const alcebiadesShrubs=[1240,1400,1560].flatMap(y=>[{x:X-270,y,r:22},{x:X-270,y:y+38,r:19}]);
export const alcebiadesPoles=[...[2110,1650,1270,920].map((y,i)=>({x:X+R.halfWidth+23,y,height:149+i*3,street:'praca-alcebiades-silva'})),...alcebiadesJulhoPoles];
export const alcebiadesLamps=[...[1860,1450,1080].map(y=>({x:X-290,y,height:155,lamp:true,lampArms:2,street:'praca-alcebiades-silva'})),...alcebiadesJulhoLamps];
export const alcebiadesCars=[...alcebiadesJulhoCars,{x:X+42,y:2015,color:'#a9b4ac',seed:1030},...[2080,1760,1390,930].map((y,i)=>({x:X-133,y,color:['#d3d9cf','#d1d8c9','#434e4b','#8f9b92'][i],seed:1031+i,axis:'x'}))];
export const alcebiadesBikes=[...alcebiadesJulhoBikes,{x:X+83,y:1890},{x:X+83,y:1800},{x:X-150,y:2080}];
export const alcebiadesSeats=[...alcebiadesJulhoSeats,{x:X-335,y:1700,w:38,h:10},{x:X-310,y:1220,w:38,h:10}];
export const alcebiadesDescriptions=[
  ['A esquina da Metalmar','Da Cônego, entre na via junto à praça.'],
  ['Três portas e a praça','Reboco cinza diante do quiosque e da árvore da esquina.'],
  ['Policlínica Cortez','Entrada de vidro, rampa e fachada de mármore claro.'],
  ['A frente da policlínica','Faixa cinza, lâminas verticais e canteiro comprido.'],
  ['O quintal arborizado','Muro branco manchado e portão preto diante dos jardins.'],
  ['Muro e laboratório','A fachada LC aparece ao lado do muro 1777.'],
  ['Casa dos Conselhos','Grades claras e pintura branca perto do sobrado do cartório.'],
  ['Cartório e biblioteca','Toldos azul e rosa diante do casarão de cobertura dupla.'],
  ['A casa creme','Janela de madeira e cornija ocre antes do escritório da esquina.'],
  ['Travessa Z. Cardoso','Rayssa Monteiro e Sicoob marcam a esquina; siga reto até a Vinte e Oito.'],
  ...alcebiadesJulhoDescriptions,
];
