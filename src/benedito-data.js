import { BENEDITO_PROFILE as R, JULHO_PROFILE } from './road-profiles.js';
import { BENEDITO_X as X } from './mendonca-benedito.js';
import { beneditoPoints } from './benedito-points.js';
export { beneditoPoints };
export const BENEDITO_END=beneditoPoints.at(-1);
export const BENEDITO_WALK={x:X-R.outerHalfWidth,y:BENEDITO_END.y-JULHO_PROFILE.outerHalfWidth,w:R.totalWidth,h:2345-(BENEDITO_END.y-JULHO_PROFILE.outerHalfWidth)};
export const BENEDITO_JULHO={x:X-350,y:BENEDITO_END.y-JULHO_PROFILE.outerHalfWidth,w:510,h:JULHO_PROFILE.totalWidth};
// O último braço encontra o piso já existente da Vinte e Oito na ponta da praça.
// Somente a esquina recebe fotos próprias; não se acrescenta uma rota na transversal.
const o=(kind,u,w,bottom,h,extra={})=>({kind,u,w,bottom,h,...extra});
const s=(u,top,w,h,text,extra={})=>({u,top,w,h,text,...extra});
const front=(id,y,length,data)=>({id,street:'sao-benedito',side:'west',x:X-R.outerHalfWidth-(data.depth??210),y,length,depth:210,height:76,roof:'tile',color:'#d4d5c5',base:'#9da48f',baseHeight:0,wear:.35,residential:false,photoDirection:7,openings:[],signs:[],...data});
const tileWindows=[.05,.27,.49,.71].map(u=>o('window',u,.15,.12,.66,{wood:true,grille:'square',bars:'#aaa688',color:'#665d4c'}));
export const beneditoBuildings=[
  front('sb-casa-ogivas',1870,131,{point:3,refs:[[2,5],[3,6],[3,7],[4,8]],name:'Casa de azulejos brancos com quatro janelas ogivais',height:89,roof:'tile',residential:true,color:'#d9dcd2',base:'#a3aaa1',baseHeight:.08,pattern:'small-tile',detail:'sb-ogives',openings:tileWindows}),
  front('sb-casa-grade-estrelas',1765,105,{point:4,refs:[[3,6],[4,6],[4,7],[5,8]],name:'Fachada de azulejos brancos, grade geométrica e portão',height:69,roof:'flat',color:'#d5d9cc',pattern:'small-tile',detail:'sb-star-grille',openings:[o('gate',.03,.29,0,.76,{solid:.05,color:'#455749',grille:'diamond',bars:'#abb9a6'}),o('window',.38,.57,.25,.51,{color:'#364c41',grille:'diamond',bars:'#a8b4a3'})],residential:true}),
  front('sb-colares-moreira',1190,575,{point:6,refs:[[4,5],[5,5],[5,6],[5,7],[6,6],[6,7],[7,7],[7,8]],name:'C.E. Colares Moreira, fachada creme com frontões, três arcos e grade azul',height:94,depth:285,color:'#d7d6bf',detail:'sb-school',frontSetback:29,fence:{height:39,gate:.43,base:'#d1d2bd',color:'#738d90'},openings:[...[.05,.15,.78,.88].map(u=>o('window',u,.07,.16,.48,{grille:'diamond',bars:'#8daba6',color:'#5b736c'})),...[.36,.47,.58].map(u=>o('porch',u,.085,0,.64,{grille:'vertical',bars:'#8faaa4',color:'#52685d'}))],signs:[s(.31,.06,.39,.13,'C.E. COLARES MOREIRA',{color:'#914e47',ink:'#e8e4d4'}),s(.205,.11,.085,.12,'GOVERNO DO',{ink:'#354c50',sub:'MARANHÃO'}),s(.70,.11,.085,.12,'GOVERNO DO',{ink:'#354c50',sub:'MARANHÃO'})]}),
  front('sb-sobrado-agrogeo',930,260,{point:8,refs:[[7,5],[7,6],[8,5],[8,6],[8,7],[9,7],[9,8]],name:'Sobrado ocre, varanda desgastada sobre SP Closet e FG Agrogeo',height:152,depth:240,roof:'flat',color:'#c8b183',detail:'sb-agrogeo',openings:[o('door',.04,.39,0,.39,{glass:true,color:'#708775'}),o('door',.55,.40,0,.39,{glass:true,color:'#71826f'}),...[.05,.35,.65].map(u=>o('porch',u,.23,.61,.25,{grille:'vertical',bars:'#af8e7f',color:'#675947'}))],signs:[s(.025,.45,.46,.12,'SP CLOSET',{color:'#e4d5d0',ink:'#a8516c'}),s(.54,.44,.44,.12,'FG AGROGEO',{color:'#d5d7bf',ink:'#3d674c',sub:'Topografia, Projetos e CAR'})],crossFacade:{face:'minY',street:'sao-benedito',point:9,photoDirection:7,color:'#caba93',wear:1,detail:'sb-aged-side',openings:[o('vent',.70,.10,.76,.10,{color:'#a27661',grille:'horizontal'})],signs:[]}}),
  // O acesso é um terreno, não abre uma nova rua nem prolonga a navegação.
  front('sb-muro-terreno',800,10,{x:X-R.outerHalfWidth-270,depth:260,point:9,refs:[[9,6],[9,7],[10,8]],name:'Muro branco e vermelho do terreno anunciado à venda',height:47,roof:'none',color:'#d8d5c4',base:'#a9564e',baseHeight:.36,signs:[s(.12,.32,.80,.16,'VENDE-SE ESTE TERRENO',{ink:'#7c8990'})]}),
  front('sb-joana-maia',680,120,{point:10,refs:[[9,6],[10,6],[10,7],[11,8]],name:'Joana Maia Arquitetura, porta de vidro em parede branca de base azul',height:83,roof:'flat',color:'#d9d9c9',base:'#495f76',baseHeight:.32,openings:[o('door',.15,.39,0,.59,{glass:true,color:'#455a50'})],signs:[s(.19,.43,.35,.07,'JOANA MAIA',{ink:'#c1cbb8'})]}),
  front('sb-instituto-iesi',505,175,{point:11,refs:[[10,6],[11,6],[11,7],[11,8]],name:'Instituto Educacional IESI, placa dourada, porta e faixas vermelhas',height:86,roof:'flat',color:'#d4d4c4',base:'#a54d49',baseHeight:.28,detail:'sb-iesi',openings:[o('door',.15,.18,0,.59,{color:'#8c4543',grille:'vertical',bars:'#a36759'})],signs:[s(.08,.12,.85,.19,'INSTITUTO EDUCACIONAL IESI',{color:'#af975a',ink:'#ece5c9',sub:'Educação e Saúde'}),s(.46,.39,.19,.23,'FAEPI',{color:'#e3dfc7',ink:'#667fa0'}),s(.76,.39,.17,.23,'AJES',{color:'#e2dec8',ink:'#b67c4d'})]}),
  front('sb-parede-amarela',365,140,{point:11,refs:[[11,5],[11,6],[12,7],[12,8]],name:'Parede alta amarela com porta metálica baixa',height:156,roof:'flat',color:'#c5bc7e',openings:[o('door',.46,.21,0,.35,{color:'#9daaa0'})]}),
  front('sb-banco-brasil',9,356,{point:13,refs:[[11,5],[12,5],[12,6],[13,5],[13,6],[13,7],[14,7],[14,8]],name:'Banco do Brasil, faixa superior azul e grandes grades brancas',height:157,depth:270,roof:'flat',color:'#d1d7ce',detail:'sb-banco',openings:[...[.06,.20,.34,.48,.62,.76,.90].map(u=>o('window',u,.09,.76,.15,{glass:true,color:'#a0b6b0',grille:'horizontal',bars:'#c9d8c9'})),...[.12,.29,.46,.63,.80].map(u=>o('gate',u,.14,.04,.48,{solid:.06,color:'#80978d',grille:'vertical',bars:'#d9e1d2'}))],crossFacade:{face:'minY',street:'sao-benedito',point:14,photoDirection:7,color:'#d7dccc',detail:'sb-bank-corner',openings:[],signs:[s(.69,.22,.14,.29,'BB',{color:'#c4b66a',ink:'#42618b'})]}}),
  // Contexto fotografado do lado oposto da Vinte e Oito; não avança por ela.
  front('sb-casa-copia',-389,190,{x:X+120,side:'east',depth:200,point:14,photoDirection:5,refs:[[13,5],[14,4],[14,5]],name:'Casa da Cópia, esquina vermelha com cobertura clara e face branca',height:77,color:'#ac5d4e',roof:'shed',roofColor:'#c6c8b3',openings:[o('shutter',.14,.66,0,.69,{color:'#3d5248'})],signs:[s(.04,.12,.92,.18,'CASA DA CÓPIA',{color:'#d8ddcf',ink:'#3b5055'})],crossFacade:{face:'maxY',street:'sao-benedito',point:14,photoDirection:4,color:'#d7d9ce',detail:'sb-copy-side',openings:[o('door',.09,.21,0,.62,{color:'#3d4c44'}),o('window',.41,.16,.22,.39,{grille:'vertical'}),o('window',.71,.16,.22,.39,{grille:'vertical'})],signs:[]}}),
  front('sb-hotel-contexto',-549,160,{x:X+130,side:'east',depth:190,point:14,photoDirection:5,refs:[[13,5],[14,5],[14,6]],name:'Volume branco do hotel ao fundo do cruzamento',height:275,color:'#d2d8ce',roof:'flat',detail:'sb-hotel',openings:[],crossFacade:{face:'maxY',street:'sao-benedito',point:14,photoDirection:5,color:'#d7ddd4',detail:'sb-hotel',openings:[],signs:[]}}),
  front('sb-quiosque-kafe',455,97,{x:X+R.outerHalfWidth+10,side:'east',depth:70,point:12,photoDirection:3,refs:[[11,3],[11,4],[12,2],[12,3],[13,1]],name:'Quiosque fechado de chapa clara com cobertura de metal',height:43,roof:'shed',roofColor:'#b2b7a7',color:'#d2ccb0',base:'#858f87',baseHeight:.23,detail:'sb-kiosk',openings:[o('shutter',.05,.9,.23,.60,{color:'#c9cbb4'})]}),
];
export function withBeneditoFaces(b){
  if(b.id==='sb-casa-copia')return {...b,color:'#d7d9ce',detail:'sb-copy-side',openings:b.crossFacade.openings,signs:[],crossFacade:{...b.crossFacade,color:'#ac5d4e',detail:null,openings:b.openings,signs:b.signs}};
  if(b.id==='cm-b-sobrado-arcos'){
    const crossFacade={...b.local.crossFacade,street:'sao-benedito',point:2,photoDirection:6,refs:[[1,5],[2,6],[3,8]],detail:'sb-arc-gates'};
    return {...b,crossFacade,local:{...b.local,crossFacade}};
  }
  if(b.id==='as-pavilhao-claro')return {...b,name:'Biblioteca Pública Municipal Professor Fernando Carvalho, pavilhão de base vinho e ala azul',backFacade:{street:'sao-benedito',point:4,photoDirection:3,color:'#d8dacc',base:'#a44d4a',baseHeight:.25,detail:'sb-library-front',openings:[o('window',.06,.16,.35,.31,{grille:'horizontal',bars:'#b9c6b4'}),o('door',.44,.13,0,.61,{color:'#536553'}),o('window',.74,.17,.36,.29,{grille:'horizontal',bars:'#b9c6b4'})],signs:[s(.25,.16,.50,.16,'BIBLIOTECA PÚBLICA MUNICIPAL',{ink:'#3f4739',sub:'PROFESSOR FERNANDO CARVALHO'})]}};
  if(b.id==='as-biblioteca')return {...b,backFacade:{...b.backFacade,street:'sao-benedito',point:10,photoDirection:2,refs:[[7,3],[8,3],[9,3],[10,2],[11,2]],detail:'sb-historic-side'}};
  return b;
}
export const beneditoTrees=[
  {x:X+280,y:1980,size:43,height:125,kind:'palm',seed:1800},
  ...[[X+255,1730,62,87],[X+218,1510,88,115],[X+213,1350,81,107],[X+100,1040,108,148],[X+266,1110,44,66],[X+267,940,43,65],[X+216,330,62,91],[X+255,140,46,63]].map(([x,y,size,height],i)=>({x,y,size,height,spreading:true,seed:1801+i})),
];
export const beneditoShrubs=[1930,1870,1810,1740,1390,1230,1170].map(y=>({x:X+225,y,r:18,flowers:true}));
export const beneditoPoles=[2100,1650,1140,570,70].map((y,i)=>({x:X-R.outerHalfWidth+18,y,height:160+i*2,street:'sao-benedito'}));
export const beneditoLamps=[{x:X+255,y:1700,height:142,lamp:true,lampArms:2,street:'sao-benedito'}];
export const beneditoCars=[...[2150,2055,1950,1855,1770].map((y,i)=>({x:X+116,y,axis:'x',color:['#d9ddcb','#404e45','#d5dacc','#d6d7c9','#8d9085'][i],seed:1820+i})),...[1740,1140,675,430].map((y,i)=>({x:X-61,y,color:['#aab8b0','#a0ada5','#a2ada7','#6b796c'][i],seed:1830+i}))];
export const beneditoBikes=[...[1350,1380,1410,1440,1470,1500,1560,1620].map(y=>({x:X-64,y})),...[1380,1410,1440,1470,1500,1530,1560,1590].map(y=>({x:X+186,y})),{x:X+201,y:315},{x:X+225,y:316},{x:X+245,y:315}];
export const beneditoShelter={x:X+170,y:350,w:85,h:105,height:54,id:'sb-kafe-canopy'};
export const beneditoBarriers=[{x:X+95,y:1100,w:7,h:50,height:23},{x:X+96,y:910,w:7,h:45,height:23}];
export const beneditoSignal={x:X-124,y:20,w:100,h:5,height:155,kind:'signal'};
export const beneditoPhone={x:X+170,y:575,w:19,h:15,height:44,kind:'phone'};
export const beneditoDescriptions=[
 ['Cônego e São Benedito','Vire ao sul entre o sobrado de arcos e a praça.'],
 ['O sobrado branco','Varandas em arco, muro de pedra e portões claros.'],
 ['Janelas ogivais','Azulejos brancos e janelas altas diante da biblioteca.'],
 ['Biblioteca Fernando Carvalho','Pavilhão branco, base vinho e jardins junto às vagas.'],
 ['C.E. Colares Moreira','Frontões claros e grades azuis na fachada da escola.'],
 ['Os três arcos da escola','Entrada gradeada e motos junto à calçada.'],
 ['Escola e casarão','O casarão de telhado elevado aparece entre as árvores.'],
 ['SP Closet e FG Agrogeo','Duas lojas compartilham o sobrado de varanda ocre.'],
 ['O acesso ao terreno','A abertura de terra junto à loja não é uma interseção confirmada.'],
 ['O escritório e o jardim','Porta de vidro de Joana Maia diante das obras de pavimentação.'],
 ['Instituto Educacional IESI','Faixas vermelhas, placa dourada e parede amarela.'],
 ['Quiosque e Banco do Brasil','Chapa clara, cobertura aberta e a quadra já existente.'],
 ['A ponta sul da praça','Grandes grades brancas do banco e a faixa de pedestres.'],
 ['Rua Vinte e Oito de Julho','A avenida encontra a transversal junto ao Banco do Brasil.'],
];
