import { COELHO_PROFILE as R } from './road-profiles.js';
import { coelhoPoints, coelhoCenter, coelhoEdge, coelhoFootprint, COELHO_SLOPE } from './coelho-geometry.js';
export { coelhoPoints };
const street='coelho-neto';
const o=(kind,u,w,bottom,h,extra={})=>({kind,u,w,bottom,h,...extra});
const door=(u,w,extra={})=>o('door',u,w,0,.73,extra);
const win=(u,w,extra={})=>o('window',u,w,.28,.44,{grille:'square',color:'#665b43',...extra});
const gate=(u,w,extra={})=>o('gate',u,w,0,.77,{solid:1,...extra});
const sign=(u,top,w,h,text,extra={})=>({u,top,w,h,text,...extra});
// Aberturas em ordem sul → norte; mesma planta para desenho e colisão.
function front(id,side,start,end,data){
  const depth=data.depth??155,footprint=coelhoFootprint(side,start,end,depth,data.setback??0);
  return {id,street,side,x:footprint[0][0],y:start,depth,length:end-start,footprint,height:60,roof:'tile',color:'#d2c8b3',base:'#9b9e8a',baseHeight:.12,wear:.5,openings:[],signs:[],photoDirection:side==='west'?7:3,...data};
}
const coelhoCatalog=[
  front('cn-muro-ginasio','west',9,280,{point:3,refs:[[1,8],[2,7],[3,7],[4,6]],name:'Muro antigo antes do ginásio',residential:false,depth:12,height:52,roof:'none',color:'#cccebf',wear:1,detail:'cn-cracked',plants:'vines',openings:[gate(.18,.20,{color:'#b4b8aa',h:.68})]}),
  front('cn-garagem-pedra','east',370,465,{point:5,refs:[[4,2],[5,2],[6,4]],name:'Garagem branca, pedra bege e telhas',height:57,color:'#b2b093',detail:'cn-stone',openings:[gate(.32,.42,{color:'#d5d9cd',grille:'horizontal'})],dish:true}),
  front('cn-sobrado-cinza','east',465,610,{point:6,refs:[[5,1],[6,2],[6,3],[7,3]],name:'Sobrado cinza com sacada de grade branca curva',height:116,color:'#92969b',baseHeight:0,detail:'cn-balcony',openings:[gate(.08,.80,{h:.44,color:'#d6dbd5',grille:'horizontal'}),o('porch',.02,.94,.62,.27,{grille:'scroll',bars:'#dde1d4',color:'#555e55'})],signs:[sign(.85,.54,.13,.055,'1789',{ink:'#d2d5c4'})]}),
  front('cn-casa-cinza-baixa','east',610,710,{point:7,refs:[[6,1],[7,3],[8,4]],name:'Parte térrea cinza com janela e porta escuras',height:60,roof:'flat',color:'#989fa0',base:'#d1d3c3',baseHeight:.16,detail:'cn-gray-bands',openings:[door(.11,.15,{glass:true,color:'#334d3b'}),win(.48,.38,{glass:true,color:'#344938'})],crossFacade:{face:'maxY',street,point:8,photoDirection:3,color:'#d4d7cb',detail:'cn-air',openings:[],signs:[]}}),
  front('cn-casa-reboco','east',805,905,{point:9,refs:[[8,2],[9,3],[9,4]],name:'Casa de reboco cru, janela gradeada e portão branco',color:'#aaa694',baseHeight:0,wear:.85,openings:[win(.06,.21,{grille:'wide-diagonal',bars:'#a4b8a7'}),gate(.43,.42,{color:'#c8ccc0',grille:'horizontal'})]}),
  front('cn-garagem-aberta','east',905,985,{point:9,refs:[[9,2],[10,3]],name:'Garagem aberta e janela de madeira no reboco antigo',color:'#a39780',base:'#b99669',baseHeight:.25,wear:.9,openings:[o('porch',.04,.49,0,.72,{color:'#304232'}),win(.70,.25,{wood:true,grille:null,color:'#5f4a39'})]}),
  front('cn-casa-rosa','east',985,1080,{point:10,refs:[[9,1],[10,3],[11,4]],name:'Casa rosa de duas janelas e porta gradeadas',height:56,color:'#c9a7b3',baseHeight:.05,openings:[win(.07,.22,{grille:'diamond'}),door(.42,.16,{grille:'vertical',color:'#4a4e3d'}),win(.69,.24,{grille:'diamond'})]}),
  front('cn-casa-amarela','east',1080,1190,{point:11,refs:[[10,2],[11,2],[11,3],[12,4]],name:'Casa amarela gasta com portas de madeira',height:56,color:'#c5a147',wear:1,detail:'cn-yellow-worn',baseHeight:.10,dish:true,openings:[door(.04,.16,{wood:true,color:'#6a4b33'}),win(.25,.19,{wood:true,grille:null,color:'#77543a'}),door(.49,.17,{wood:true,color:'#604b34'}),win(.76,.22,{grille:'scroll',bars:'#535344'})]}),
  front('cn-casa-arcos','west',1110,1250,{point:11,refs:[[10,8],[11,7],[12,6]],name:'Varanda de três arcos e grade ornamental',height:61,color:'#d1d1b7',base:'#a5a791',baseHeight:.1,frontSetback:25,detail:'cn-arches',openings:[.035,.36,.685].map(u=>o('porch',u,.29,.16,.60,{color:'#3d4d32'})),fence:{height:35,gate:.43,base:'#aeb59f',color:'#bcb79c'}}),
  front('cn-garagem-1686','west',1690,1770,{point:17,refs:[[16,8],[17,6],[17,7]],name:'Garagem 1686 com portão verde e moldura branca',height:54,roof:'courtyard',color:'#a69e8b',baseHeight:0,detail:'cn-garage-trim',openings:[gate(.05,.65,{color:'#53604b',grille:'vertical'})],signs:[sign(.76,.27,.20,.14,'1686',{ink:'#6e705e'})]}),
  front('cn-casa-azulejos','west',1770,1850,{point:17,refs:[[17,7],[18,6]],name:'Casa de azulejos cinza e grades radiais',color:'#b6b7b3',pattern:'small-tile',height:59,steps:true,baseHeight:0,openings:[door(.10,.18,{color:'#867b68',grille:'sunburst',bars:'#464c40'}),win(.48,.41,{color:'#898774',grille:'sunburst',bars:'#444b40'})]}),
  front('cn-casa-1675','west',1850,1960,{point:18,refs:[[17,8],[18,7],[19,5]],name:'Casa amarela 1675 com cerâmica clara na base',height:59,color:'#d4c498',base:'#b6b6a2',baseHeight:.37,detail:'cn-tile-base',steps:true,openings:[door(.09,.16,{wood:true,color:'#5c4e39'}),win(.49,.36,{glass:true,color:'#728994',grille:'scroll',bars:'#5d5a41'})],signs:[sign(.34,.41,.14,.10,'1675',{ink:'#4f5844'})]}),
  front('cn-fachada-antiga','east',1640,1870,{point:16,refs:[[15,2],[16,2],[16,3],[17,3]],name:'Fachada amarela e lilás gasta, platibanda cinza e grades',height:78,roof:'hidden-tile',color:'#bbb295',baseHeight:0,wear:1,detail:'cn-old-plaster',openings:[gate(.04,.34,{h:.59,solid:.1,grille:'scroll',bars:'#4e5745',color:'#4b513a'}),door(.56,.11,{h:.56,grille:'scroll',color:'#6a6550'})]}),
  front('cn-casa-branca-baixa','east',1870,1930,{point:18,refs:[[17,1],[18,3],[18,4]],name:'Casa branca baixa com janela escura',height:52,color:'#d0d0c0',base:'#485a4c',baseHeight:.14,dish:true,openings:[win(.20,.48,{grille:'square',bars:'#535a48',color:'#564b38'})]}),
  front('cn-ruina-vedada','east',1930,2030,{point:18,refs:[[18,2],[19,3],[19,4]],name:'Ruína branca, janelas vedadas com tijolos e porta de madeira',height:59,roof:'none',residential:false,color:'#ccc7b4',wear:1,detail:'cn-cracked',baseHeight:0,openings:[door(.05,.19,{wood:true,color:'#5b4c39'}),o('bricked',.37,.22,.34,.33,{color:'#ad6f4b'}),o('bricked',.73,.22,.34,.33,{color:'#ad6f4b'})]}),
  front('cm-final-casa-rosa','east',2110,2215,{point:20,refs:[[19,2],[20,2],[20,3],[21,4]],name:'Casa rosa de base cinza e duas janelas gradeadas',height:57,color:'#bc8086',base:'#929c93',baseHeight:.43,detail:'cn-speckle',openings:[win(.06,.24,{color:'#b3ad91',grille:'scroll'}),door(.41,.16,{color:'#bfc3b0',grille:'scroll'}),win(.71,.24,{grille:'square',bars:'#9b9c84',wood:true,color:'#b4b198'})],crossFacade:{face:'minY',street,point:19,photoDirection:2,color:'#ae7955',detail:'cn-brick',openings:[o('vent',.12,.15,.25,.15,{grille:'horizontal'})],signs:[]}}),
];

export const coelhoBuildings=coelhoCatalog.filter(b=>b.id!=='cm-final-casa-rosa');
export function withCoelhoCorner(b){
  if(b.id==='cm-final-casa-rosa')return coelhoCatalog.find(p=>p.id===b.id);
  if(b.id==='jl-e-ginasio-contexto')return front(b.id,'west',280,1110,{point:8,refs:[[3,8],[4,8],[5,7],[6,7],[7,7],[8,7],[9,7],[10,7],[11,6],[12,5]],name:'Ginásio: cobertura curva, cobogós, pilares e entrada elevada',residential:false,depth:230,height:108,roof:'barrel',color:'#d1d5c9',base:'#7f8a77',baseHeight:.07,wear:1,detail:'cn-gym',openings:[gate(.76,.08,{h:.47,grille:'vertical',color:'#344b51'}),o('window',.70,.04,.16,.20,{grille:'square',color:'#2e4135'})]});
  if(b.id==='cm-s11-muro-diagonal'){
    const y=1960,end=b.y+b.length,depth=end-y,local={...b.local,depth};
    const edge0=coelhoEdge(y,-R.outerHalfWidth),edge1=coelhoEdge(end,-R.outerHalfWidth);
    const footprint=[[b.x,y],[edge0,y],[edge1,end],[b.x,end]];
    const [sw,se,ne,nw]=footprint;
    local.footprint=[nw,sw,se,ne].map(([x,yy])=>[2345-yy,x]);
    local.crossFacade={...local.crossFacade,street,point:20,photoDirection:7,detail:'cn-security-wall',openings:[],signs:[]};
    return {...b,y,length:depth,footprint,local,crossFacade:local.crossFacade};
  }
  if(b.id==='cm-final-casa-creme')return front(b.id,'east',2215,2405,{point:21,refs:[[20,2],[21,2],[21,3],[22,3],[22,4]],name:'Casa clara com grade geométrica e garagem na Matriz',height:56,color:'#dad6c6',baseHeight:0,detail:'cn-cream',openings:[win(.12,.23,{grille:'square',bars:'#d3d7c7',color:'#5b6655'}),door(.44,.18,{grille:'square',bars:'#d3d7c7',color:'#596451'}),gate(.76,.23,{color:'#303e32',grille:'horizontal'})]});
  return b;
}
const tree=(y,side,seed,size=46,height=68,offset=145)=>({x:coelhoEdge(y,side*offset),y,size,height,seed});
export const coelhoTrees=[
  ...[195,255,315].map((y,i)=>tree(y,1,1510+i,58,76,180)),
  tree(645,1,1520,27,46,84),
  ...[1280,1350,1430,1500,1570].flatMap((y,i)=>[tree(y,1,1530+i,42,54,151),tree(y,-1,1540+i,48,67,154)]),
];
export const coelhoShrubs=[
  ...[[1,180,360], [1,710,805], [1,1190,1640],[-1,1250,1690],[1,2030,2110]].flatMap(([side,a,b],j)=>Array.from({length:Math.ceil((b-a)/28)},(_,i)=>({x:coelhoEdge(a+i*28,side*(112+i%3*24)),y:a+i*28,r:19+i%4*3,flowers:false}))),
  {x:coelhoEdge(1182,92),y:1182,r:15,flowers:true},
];
export const coelhoPoles=[380,800,1195,1510,1830,2110].map(y=>({x:coelhoEdge(y,R.halfWidth+19),y,height:155,street}));
export const coelhoCars=[{x:coelhoEdge(1220,-46),y:1220,angle:Math.atan(COELHO_SLOPE),color:'#d9ddd3',seed:1560},{x:coelhoEdge(2250,46),y:2250,angle:Math.atan(COELHO_SLOPE),color:'#4d605c',seed:1561}];
export const coelhoBikes=[{x:coelhoEdge(1910,-80),y:1910},{x:coelhoEdge(2360,80),y:2360}];
export const coelhoTruck={id:'cn-caminhao',x:coelhoCenter(1030)+38,y:955,w:37,h:133,height:42};
export const coelhoDescriptions=[
 ['Vinte e Oito de Julho','Entre na Coelho Neto no sentido da Matriz, junto ao ginásio.'],
 ['Os muros da esquina','Facebar atrás; vegetação e muro antigo ao lado.'],
 ['O muro branco','Reboco gasto e cerca elétrica antes do ginásio.'],
 ['A cobertura curva','O telhado metálico aparece sobre o muro.'],
 ['Pedra e portão branco','Garagem de telhas diante dos pilares do ginásio.'],
 ['Sobrado cinza','Sacada de grade branca curva e árvore podada na calçada.'],
 ['O terreno entre as casas','Casa cinza baixa e lote coberto de capim.'],
 ['Cobogós e entrada','A longa parede do ginásio acompanha o percurso.'],
 ['A escadaria do ginásio','Portão azul escuro diante das casas de reboco cru.'],
 ['O caminhão amarelo','Carroceria aberta diante das casas rosa e amarela.'],
 ['A varanda de arcos','Grades ornamentais, degraus e telhas do outro lado.'],
 ['Começo da vegetação','Terrenos arborizados depois das últimas casas.'],
 ['Entre árvores e capim','A torre da Matriz aparece na direção do caminho.'],
 ['O terreno aberto','A vegetação baixa antes das próximas fachadas.'],
 ['Reboco antigo','Fachada extensa de pintura gasta na margem leste.'],
 ['Grades e platibanda','Amarelo, lilás e remendos de reboco cinza.'],
 ['Garagem 1686','Azulejos, grades radiais e calçada elevada.'],
 ['Casa 1675','Casa amarela diante da ruína com janelas vedadas.'],
 ['O muro da esquina','O muro liso acompanha o último trecho até a Cônego.'],
 ['Casa rosa e grades claras','Fachadas baixas antes da Academia Figueiredo.'],
 ['A praça se abre','Casa clara, garagem e a torre da Matriz.'],
 ['Rua Cônego Mendonça','A Coelho Neto encontra a Cônego ao lado da Praça da Matriz.'],
];
