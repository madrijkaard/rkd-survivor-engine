import { JULHO_PROFILE as R } from './road-profiles.js';
import { parkingOffset } from './road-dimensions.js';
import { julhoPoints } from './julho-points.js';

const street='vinte-e-oito-de-julho', Y=-95;
export const JULHO_EAST=julhoPoints.find(p=>p.id===29);
export const JULHO_EAST_WALK={x:836,y:Y-R.outerHalfWidth,w:JULHO_EAST.x-836,h:R.totalWidth};
// Initial corner apron; coelho-geometry.js continues north to Cônego Mendonça.
export const COELHO_MOUTH={x:JULHO_EAST.x-R.outerHalfWidth,y:-405,w:R.totalWidth,h:650};
const o=(kind,u,w,bottom,h,extra={})=>({kind,u,w,bottom,h,...extra});
const door=(u,w,extra={})=>o('door',u,w,0,.73,extra);
const win=(u,w,extra={})=>o('window',u,w,.30,.39,{grille:'square',color:'#657263',...extra});
const sign=(u,top,w,h,text,extra={})=>({u,top,w,h,text,...extra});
function front(id,side,start,end,data){
  const depth=data.depth??150,setback=data.setback??0;
  const local={id,street,side:side==='north'?'west':'east',x:side==='north'?-(R.outerHalfWidth+depth+setback):R.outerHalfWidth+setback,y:start,depth,length:end-start,height:62,roof:'tile',color:'#d4cbb7',base:'#a1a08e',baseHeight:.12,wear:.35,openings:[],signs:[],photoDirection:side==='north'?1:5,...data};
  return {...local,axis:'x',originY:Y,local,x:start,y:Y-local.x-depth,depth:end-start,length:depth};
}
export const julhoEastBuildings=[
  front('jl-e-venda-antiga','north',1110,1250,{point:21,refs:[[20,2],[21,1],[21,2],[22,8]],name:'Venda antiga de reboco cru e alpendre de telhas',residential:false,height:48,frontSetback:19,color:'#a69b83',wear:1,detail:'jl-e-porch',openings:[door(.09,.22,{grille:'vertical',color:'#655a43'}),door(.40,.16,{color:'#c8b896',wood:true}),o('shutter',.70,.22,0,.72,{open:true,color:'#405244'})]}),
  front('jl-e-casa-recuada','north',1320,1515,{point:23,refs:[[22,1],[22,2],[23,1],[23,8]],name:'Casa rosada recuada atrás do terreno e muro de tijolos',setback:95,height:79,roof:'hidden-tile',color:'#cdbca3',wear:1,openings:[win(.09,.12),win(.39,.20),win(.73,.15)]}),
  front('jl-e-sobrado-amarelo','north',1515,1635,{point:24,refs:[[23,2],[24,1],[24,8],[25,8]],name:'Sobrado amarelo 110, bolos e decorações',height:120,color:'#d7d09e',base:'#818875',baseHeight:.05,detail:'jl-e-yellow',dish:true,openings:[door(.10,.24,{grille:'vertical',h:.34}),door(.46,.18,{grille:'vertical',h:.34}),o('window',.76,.16,.14,.19,{grille:'square',color:'#66594d'}),o('window',.12,.21,.66,.22,{wood:true,color:'#80684a'}),o('window',.56,.35,.61,.28,{grille:'diagonal',bars:'#384c48',color:'#294b5d'})],signs:[sign(.025,.54,.51,.10,'THAYSA & THATY',{ink:'#605941',sub:'BOLOS E DECORAÇÕES'}),sign(.64,.70,.10,.08,'110',{ink:'#554f3b'})]}),
  front('jl-e-casa-rosa','north',1635,1785,{point:25,refs:[[24,2],[25,1],[25,8],[26,7]],name:'Casa rosa com garagem branca e grades em losangos',height:61,color:'#c293ad',base:'#c9cfc2',baseHeight:.13,detail:'jl-e-raised',openings:[o('gate',.03,.29,0,.77,{color:'#c4cfc6',grille:'vertical',solid:1}),door(.40,.12,{color:'#d6d3c7',grille:'diagonal'}),win(.57,.16,{grille:'diagonal',bars:'#5b5650'}),win(.80,.15,{grille:'diagonal',bars:'#5b5650'})]}),
  front('jl-e-casa-branca-vinho','north',1785,1890,{point:26,refs:[[25,1],[25,2],[26,1],[26,8]],name:'Casa branca, base vinho e duas portas amarelas',height:58,color:'#dedccf',base:'#a65757',baseHeight:.26,detail:'jl-e-raised',openings:[door(.08,.13,{wood:true,color:'#ba943e',grille:'vertical'}),door(.49,.13,{wood:true,color:'#ba943e',grille:'vertical'}),win(.77,.17,{color:'#b09a5c'})]}),
  front('jl-e-garagem-branca','south',1240,1315,{point:22,refs:[[21,4],[22,5],[22,6]],name:'Garagem branca de telhado inclinado e portão cinza',height:62,roof:'shed',color:'#dddccf',wear:.5,openings:[o('gate',.09,.81,0,.76,{color:'#b6bfb5',grille:'vertical',solid:1})]}),
  front('jl-e-ceramica-laranja','south',1315,1405,{point:22,refs:[[22,4],[22,5],[23,6]],name:'Casa de cerâmica laranja, janela escura e porta gradeada',height:60,roof:'hidden-tile',color:'#b76640',pattern:'orange-tile',baseHeight:0,openings:[win(.07,.27,{grille:'diagonal',color:'#344c42'}),door(.45,.34,{grille:'diagonal',color:'#c1bca3'}),door(.83,.12,{grille:'diagonal',color:'#596c5a'})]}),
  front('jl-e-casa-salmao','south',1405,1480,{point:23,refs:[[22,4],[23,5],[23,6]],name:'Casa salmão com janela gradeada e base cinza',height:61,roof:'hidden-tile',color:'#d5ab92',base:'#aeb3a2',baseHeight:.32,openings:[win(.12,.33,{grille:'diagonal'}),door(.68,.20,{color:'#586250',grille:'diagonal'})]}),
  front('jl-e-casa-cinza','south',1480,1625,{point:24,refs:[[23,4],[24,5],[24,6]],name:'Casa cinza, rodapé grafite e duas portas distintas',height:65,roof:'hidden-tile',color:'#bfc8c1',base:'#535e59',baseHeight:.28,openings:[door(.06,.16,{wood:true,color:'#785b43'}),door(.42,.12,{grille:'square',color:'#495b4a'}),win(.70,.20,{grille:'square'})],signs:[sign(.72,.36,.14,.08,'VENDO',{color:'#e2e1d6',ink:'#7a9391'})]}),
  front('jl-e-portao-creme','south',1625,1675,{point:24,refs:[[24,4],[24,5],[25,6]],name:'Garagem estreita de portão creme',height:55,roof:'shed',color:'#d1c8a5',openings:[o('gate',.035,.93,0,.94,{color:'#c9c5a8',grille:'vertical',solid:1})]}),
  front('jl-e-varanda-pedra','south',1675,1750,{point:25,refs:[[24,4],[25,5],[25,6]],name:'Varanda gradeada da casa de pedra, portão e pilares rosados',height:55,color:'#e0dfd2',base:'#827051',baseHeight:.46,detail:'jl-e-stone',openings:[o('porch',.05,.29,.38,.40,{color:'#46533f',grille:'vertical',bars:'#565946'}),o('gate',.39,.29,0,.78,{color:'#4a5140',grille:'vertical',bars:'#535846',solid:.1}),o('porch',.73,.24,.38,.40,{color:'#4b5440',grille:'vertical',bars:'#535846'})]}),
  front('jl-e-casa-pedra','south',1750,1880,{point:25,refs:[[25,4],[25,5],[26,5],[26,6]],name:'Casa branca com rodapé de pedra e quatro janelas altas',height:72,roof:'hidden-tile',color:'#dedfd3',base:'#827051',baseHeight:.44,detail:'jl-e-stone',openings:[door(.035,.10,{grille:'vertical'}),...[.23,.42,.62,.81].map(u=>win(u,.12,{bottom:.28,h:.43,grille:'vertical',color:'#624e3c'}))]}),
  front('jl-e-sobrado-cinza','south',1880,1960,{point:26,refs:[[26,4],[26,5],[28,6]],name:'Sobrado cinza e branco, garagem sob sacada estreita',height:112,roof:'tile',color:'#cbd1c8',baseHeight:0,detail:'jl-e-gray',openings:[o('gate',.05,.9,0,.43,{color:'#d9ddd3',solid:1,grille:'horizontal'}),o('window',.10,.28,.69,.19,{grille:'horizontal',color:'#687e72'}),o('window',.60,.29,.69,.19,{grille:'horizontal',color:'#687e72'})]}),
  front('jl-e-casa-gasta','south',1960,2025,{point:28,refs:[[26,4],[28,5],[28,6]],name:'Casa baixa desgastada, tijolos expostos e madeira antiga',height:54,roof:'hidden-tile',color:'#c4cab0',wear:1,detail:'jl-e-worn',openings:[door(.12,.24,{wood:true,color:'#776c4f'}),win(.62,.26,{wood:true,color:'#948567',grille:null})]}),
  front('jl-e-sobrado-flores','south',2025,2110,{point:28,refs:[[28,4],[28,5],[27,5],[27,6]],name:'Sobrado branco, portão diagonal e sacada florida',height:127,roof:'tile',color:'#dcdfd3',wear:.7,baseHeight:0,detail:'jl-e-balcony',openings:[o('gate',.05,.90,0,.41,{color:'#506052',bars:'#d6ded2',grille:'diagonal',solid:.2}),o('porch',.035,.93,.65,.26,{glass:true,color:'#80968a',grille:'horizontal',bars:'#b9c5bb'})]}),
  front('jl-e-muro-esquina','south',2110,JULHO_EAST.x-R.outerHalfWidth,{point:27,refs:[[28,4],[27,4],[27,5],[29,5],[29,6]],name:'Muro de esquina com tijolos e trepadeiras',height:46,depth:180,roof:'none',color:'#d1d2bd',base:'#987d5c',baseHeight:.26,wear:1,plants:'full-vines',detail:'jl-e-worn',crossFacade:{face:'maxY',street,point:29,photoDirection:5,color:'#c7c9b5',base:'#947554',baseHeight:.25,wear:1,detail:'jl-e-worn',openings:[],signs:[]}}),
  {id:'jl-e-ginasio-contexto',street,point:29,photoDirection:1,refs:[[26,1],[29,1],[29,8]],name:'Parte visível do ginásio atrás da vegetação',residential:false,side:'west',x:JULHO_EAST.x-R.outerHalfWidth-185,y:145,depth:185,length:185,height:100,roof:'barrel',color:'#c8ccc1',base:'#8f9782',baseHeight:.18,wear:.95,openings:[],signs:[]},
  {id:'jl-e-facebar',street,point:29,photoDirection:4,refs:[[27,3],[27,4],[29,3],[29,4]],name:'Facebar na esquina oposta da Coelho Neto',residential:false,side:'east',x:JULHO_EAST.x+R.outerHalfWidth,y:-365,depth:170,length:180,height:61,roof:'tile',color:'#dddccc',base:'#8b927e',baseHeight:.27,wear:.35,openings:[o('porch',.03,.27,.27,.67,{grille:'horizontal',color:'#273e2b',bars:'#aab6a4'}),o('porch',.34,.27,.27,.67,{grille:'horizontal',color:'#263c2b',bars:'#aab6a4'})],signs:[sign(.64,.21,.34,.43,'Facebar',{color:'#294258',ink:'#dddcd0'})]},
  {id:'jl-e-casa-tijolo-contexto',street,point:29,photoDirection:2,refs:[[27,2],[29,2],[29,3]],name:'Casa de tijolos e varanda junto ao acesso de terra',residential:true,side:'east',x:JULHO_EAST.x+R.outerHalfWidth+25,y:32,depth:135,length:140,height:59,roof:'tile',color:'#a98b6c',base:'#8d8d77',baseHeight:.44,wear:.7,detail:'jl-e-brick',openings:[o('porch',.39,.54,.12,.70,{grille:'vertical',bars:'#98a68c',color:'#43543f'})],signs:[]},
];

export function withJulhoEastCorner(b){
  if(b.id==='aa-reabilitar'){
    const local={...b.local,x:R.outerHalfWidth,residential:false,refs:[[19,4],[20,5],[21,5]],street,point:20,photoDirection:5};
    return {...b,originY:Y,local,y:Y-local.x-local.depth,refs:local.refs};
  }
  if(b.id==='aa-school-last-wall'){
    const depth=1110-b.x, footprint=b.footprint.map(([x,y],i)=>[i===1||i===2?1110:x,y]);
    return {...b,depth,footprint,crossFacade:{face:'minY',street,point:20,photoDirection:1,refs:[[19,2],[20,1],[21,8]],color:b.color,base:b.base,baseHeight:.03,detail:'aa-brick-top',wear:.55,openings:[],signs:[]}};
  }
  return b;
}
export const julhoEastTrees=[
  ...Array.from({length:12},(_,i)=>({x:1900+i%6*49,y:28+Math.floor(i/6)*63,size:35+i%3*4,height:34+i%3*7,seed:1450+i})),
  {x:1260,y:20,size:26,height:58,seed:1410},
  ...[1910,1975,2045,2120,2165].map((x,i)=>({x,y:38+i%2*38,size:43+i%2*9,height:75+i%3*9,seed:1420+i})),
  {x:1875,y:-190,size:29,height:44,kind:'sapling',seed:1430},
  {x:JULHO_EAST.x+100,y:-220,size:46,height:85,seed:1431},
  {x:JULHO_EAST.x+138,y:-115,size:30,height:48,seed:1432},
  {x:JULHO_EAST.x+180,y:185,size:47,height:78,seed:1433},
];
export const julhoEastPoles=[{x:950,y:Y+R.halfWidth+15,height:154},{x:1300,y:Y-R.halfWidth-16,height:157},{x:1738,y:Y-R.halfWidth-18,height:158},{x:2150,y:Y-R.halfWidth-18,height:158},{x:JULHO_EAST.x+R.halfWidth+17,y:42,height:158}].map(p=>({...p,street}));
export const julhoEastCars=[{x:1545,y:Y+parkingOffset(R),color:'#5e716a',seed:1440}];
export const julhoEastShrubs=[...[1300,1340,1410,1475].map((x,i)=>({x,y:30+i%2*24,r:17,flowers:false})),...[1905,1940,1975,2010,2045,2080,2120,2160].map((x,i)=>({x,y:12+i%2*10,r:24,flowers:false}))];
export const julhoEastDescriptions={
  19:['Além da Antônio Alexandre','Cinema, muro da escola e Clínica Reabilitar marcam a esquina inicial.'],
  20:['Clínica Reabilitar','Fachada bege revestida e faixa preta diante do muro de tijolos.'],
  21:['O alpendre antigo','Telhas baixas, pilares e portas da venda diante da clínica.'],
  22:['Cerâmica laranja','Garagem branca e casa laranja diante do começo do terreno aberto.'],
  23:['O terreno e a lenha','Vegetação e pilhas de madeira, com uma casa recuada atrás.'],
  24:['Sobrado amarelo','Bolos e decorações na fachada amarela; casas cinza e rosa do outro lado.'],
  25:['Pedra e grades','Casa branca de rodapé de pedra diante das casas rosa e branca/vinho.'],
  26:['Depois das casas baixas','Portas amarelas, garagem branca e vegetação junto à rua.'],
  27:['Antes da Coelho Neto','Muro coberto de trepadeiras e Facebar do outro lado da esquina.'],
  28:['A sacada florida','Sobrado branco de portão diagonal, casa antiga e terreno coberto de verde.'],
  29:['Rua Coelho Neto','Fim deste quarteirão; Facebar, casa de tijolos e acesso de terra em frente.'],
};
