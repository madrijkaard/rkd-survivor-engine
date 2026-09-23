import { antonioPoints } from './antonio-points.js';
export { antonioPoints };
export const ANTONIO_END=antonioPoints.at(-1);
// Shared frontage endpoints keep neighbouring lots joined at every division.
// The clearance also accommodates a straight facade across a measured bend.
export const ANTONIO_FRONTAGE_OFFSET=90;
export function antonioCenter(y) {
  if(y>=antonioPoints[0].y)return antonioPoints[0].x;
  for(let i=1;i<antonioPoints.length;i++){
    const a=antonioPoints[i-1],b=antonioPoints[i];
    if(y>=b.y)return b.x+(a.x-b.x)*(y-b.y)/(a.y-b.y);
  }
  return ANTONIO_END.x;
}
// Follow the measured bend, including the sidewalk.
export function onAntonioRoad(x,y){return y>-120&&y<2345&&Math.abs(x-antonioCenter(y))<86;}
export const CINEMA_GARDEN={x:420,y:325,w:425,h:985};
export const JULHO_ROAD={x:-320,y:-120,w:1580,h:85};
const o=(kind,u,w,bottom,h,extra={})=>({kind,u,w,bottom,h,...extra});
const door=(u,w,extra={})=>o('door',u,w,0,.74,extra);
const win=(u,w,extra={})=>o('window',u,w,.30,.43,extra);
const gate=(u,w,extra={})=>o('gate',u,w,0,.76,extra);
const sign=(u,top,w,h,text,extra={})=>({u,top,w,h,text,...extra});
// Record each frontage ONCE, in north-to-south order. Openings below use that
// order; reverse u when placing them in the existing south-to-north world frame.
const front=(id,side,north,south,data)=>{
  const depth=data.depth??160,offset=ANTONIO_FRONTAGE_OFFSET+(data.setback??0);
  const edge=antonioCenter(south)+(side==='east'?offset:-offset),shift=antonioCenter(north)-antonioCenter(south);
  const b={id,street:'antonio-alexandre',side,x:side==='east'?edge:edge-depth,y:south,depth,length:north-south,height:59,roof:'tile',color:'#d3ccb5',base:'#949582',baseHeight:.12,wear:.3,openings:[],signs:[],...data};
  b.antonioSide=side;
  b.footprint=[[b.x,south],[b.x+depth,south],[b.x+depth+shift,north],[b.x+shift,north]];
  for(const key of ['openings','signs','panels'])if(b[key])b[key]=b[key].map(v=>({...v,u:1-v.u-v.w}));
  if(b.meters)b.meters=b.meters.map(u=>1-u);
  if(b.ramp!==undefined)b.ramp=1-b.ramp-.3;
  return b;
};
// Taper the side of a shared corner building, preserving its opposite wall.
// Its frontage on Cônego and its side on Antônio remain one building.
export function alignAntonioCorner(b,side,originY){
  const y0=b.y,y1=b.y+b.length,x0=b.x,x1=b.x+b.depth;
  const roadEdge=y=>antonioCenter(y)+(side==='east'?ANTONIO_FRONTAGE_OFFSET:-ANTONIO_FRONTAGE_OFFSET);
  const footprint=side==='west'
    ?[[x0,y0],[roadEdge(y0),y0],[roadEdge(y1),y1],[x0,y1]]
    :[[roadEdge(y0),y0],[x1,y0],[x1,y1],[roadEdge(y1),y1]];
  const result={...b,footprint,antonioSide:side};
  if(b.axis==='x'){
    const [sw,se,ne,nw]=footprint;
    result.local={...b.local,footprint:[nw,sw,se,ne].map(([x,y])=>[originY-y,x])};
  }
  return result;
}
export const antonioBuildings=[
  front('aa-w01-amarela','west',2115,2040,{name:'Casa amarela, garagem branca e colunas de pedra escura',point:3,refs:[[2,6],[3,7]],color:'#c9ad65',base:'#b2a482',wear:.70,detail:'aa-stone-columns',openings:[gate(.57,.38,{color:'#dde0d3',grille:'horizontal',bars:'#e0dfcc',solid:1})],signs:[sign(.08,.48,.30,.13,'IMPÉRIO GRANITOS',{ink:'#b7c4c2'})],meters:[.05,.52],steps:true}),
  front('aa-w02-pedras','west',2040,1920,{name:'Casa creme, garagem e porta brancas entre faixas de pedra',point:4,refs:[[3,6],[4,7]],color:'#e1d4a9',base:'#b9b49b',detail:'aa-stone-columns',openings:[gate(.04,.48,{color:'#e7e5d9',solid:1}),door(.79,.17,{color:'#d5d6c9',grille:'vertical',solid:1})],steps:true}),
  front('aa-w03-diagonais','west',1920,1815,{name:'Casa 1690, portão e porta com faixas diagonais',point:5,refs:[[4,6],[5,7]],roof:'courtyard',color:'#d8d4be',pattern:'horizontal-base',openings:[gate(.54,.42,{color:'#34463d',grille:'wide-diagonal',bars:'#d9d6c1'}),door(.05,.15,{color:'#34463d',grille:'wide-diagonal',bars:'#d9d6c1'})],signs:[sign(.37,.13,.16,.11,'1690',{ink:'#566355'})],meters:[.29]}),
  front('aa-w04-stetmed','west',1815,1730,{name:'Stetmed, fachada verde com letreiro dourado',point:5,refs:[[5,6],[5,7]],roof:'hidden-tile',height:71,color:'#467e60',base:'#447659',baseHeight:0,wear:.18,detail:'aa-stetmed',signs:[sign(.13,.39,.74,.18,'Stetmed',{ink:'#c9ac69',sub:'SAÚDE'})],meters:[.91]}),
  front('aa-w05-consultorio','west',1730,1670,{name:'Consultório 1708, frisos verdes, painel bege e porta branca',point:6,refs:[[6,7]],height:75,roof:'flat',color:'#e1dfcf',base:'#c9b895',baseHeight:.45,detail:'aa-clinic',openings:[door(.55,.38,{color:'#d8d9cb',h:.54})],signs:[sign(.10,.32,.71,.10,'1708',{ink:'#665d3e'}),sign(.02,.48,.50,.13,'CONSULTÓRIO',{color:'#e7e4d7',ink:'#8a9d8a'})]}),
  front('aa-w06-grafica','west',1670,1580,{name:'Gráfica Imprima, fachada branca e entrada colorida',point:6,refs:[[6,6],[6,7],[7,8]],height:71,roof:'flat',color:'#e0dfd4',base:'#c8cabb',baseHeight:.04,detail:'aa-print',openings:[door(.61,.26,{color:'#2c5751',glass:true,h:.60})],signs:[sign(.03,.07,.92,.22,'GRÁFICA imprima',{ink:'#738794',sub:'A impressão que fica!'})],meters:[.07],dish:true}),
  front('aa-w07-casa-verde','west',1580,1440,{name:'Casa 1714 verde, janela ornamental e garagem branca',point:7,refs:[[7,7],[7,6]],height:67,roof:'hidden-tile',color:'#448269',base:'#aa8956',baseHeight:.26,trim:'white-line',openings:[gate(.06,.37,{color:'#cbd5c8',grille:'vertical',bars:'#d9ddd0',solid:.6}),win(.60,.27,{color:'#51674f',grille:'scroll',bars:'#e6e6d5',h:.47,bottom:.18}),o('vent',.47,.08,.40,.16,{grille:'diamond'})],signs:[sign(.11,.24,.16,.07,'1714',{ink:'#dddecb'})],dish:true}),
  front('aa-w08-historica','west',1440,1330,{name:'Casa antiga rosa e branca, janela de madeira e grades em losangos',point:8,refs:[[8,7],[8,6]],roof:'hidden-tile',parapet:8,color:'#d7c5b6',base:'#987b52',baseHeight:.20,wear:1,trim:'historic',openings:[win(.10,.24,{color:'#99845c',wood:true,grille:'star',bars:'#5b6650'}),door(.54,.12,{color:'#645e4a',grille:'diamond'}),gate(.69,.28,{color:'#625e4b',grille:'diamond',bars:'#d2c6a1'})]}),
  front('aa-w09-portao-cinza','west',1330,1240,{name:'Muro branco, portão cinza e trepadeiras',point:9,refs:[[9,7]],roof:'none',depth:8,height:48,color:'#d2cfb6',base:'#94977c',wear:.85,plants:'vines',openings:[gate(.10,.51,{color:'#99a59c',grille:'vertical',solid:1})]}),
  front('aa-w10-muro-antigo','west',1240,1100,{name:'Muro de tijolos com vestígios de pintura branca e árvores',point:10,refs:[[10,7],[9,6]],roof:'none',depth:8,height:39,color:'#ab8768',base:'#81765b',baseHeight:.10,wear:1,detail:'aa-brick-white',setback:60}),
  front('aa-w11-rosa','west',1100,1010,{name:'Casa rosa recuada, garagem branca e dois losangos de azulejo',point:11,refs:[[11,7],[12,7]],setback:225,color:'#bb8185',base:'#71584d',baseHeight:.25,detail:'aa-pink-diamonds',openings:[gate(.63,.32,{color:'#dcded3',solid:1})]}),
  front('aa-w12-sobrado','west',1010,900,{name:'Sobrado claro, varanda gradeada, janela pequena e garagem',point:12,refs:[[12,7],[13,8]],setback:225,height:110,color:'#d3ccb5',base:'#995d56',baseHeight:.10,roof:'shed',openings:[o('porch',.10,.76,.69,.23,{color:'#616854',grille:'vertical'}),o('vent',.68,.07,.47,.09,{grille:'square'}),o('gate',.17,.54,0,.40,{color:'#626751',grille:'diamond',bars:'#c5c8ab'})]}),
  front('aa-w13-reboco','west',900,770,{name:'Sobrado sem pintura, portas escuras e faixa de elementos vazados',point:12,refs:[[12,7],[13,7]],setback:225,height:116,roof:'flat',color:'#aaa18a',base:'#9d9780',wear:.76,openings:[o('gate',.04,.40,0,.37,{color:'#252f29',grille:'vertical',bars:'#434c3c'}),o('door',.85,.10,0,.35,{color:'#364135'}),o('vent',.48,.12,.64,.22,{color:'#526150',grille:'chevron'}),o('vent',.77,.22,.63,.22,{color:'#6b7257',grille:'square'})]}),
  front('aa-w14-muro-branco','west',770,640,{name:'Muro branco antigo entre o sobrado e a casa amarela',point:14,refs:[[14,7]],setback:225,depth:7,height:47,roof:'none',color:'#c6c7b5',base:'#858c75',wear:.92}),
  front('aa-w15-amarela','west',640,525,{name:'Casa amarela de telhas com rodapé escuro, janela e garagem',point:15,refs:[[15,7],[15,8]],setback:225,color:'#cdb775',base:'#6f7662',baseHeight:.35,openings:[gate(.06,.44,{color:'#a8afa1',grille:'square',bars:'#484f3f',solid:.6}),win(.69,.20,{color:'#71705a',grille:'square',bars:'#454e40'})]}),
  front('aa-w16-pavilhao-fundos','west',525,360,{name:'Anexo baixo branco, telhas de barro e ventilação alta',point:16,refs:[[16,7],[17,7]],setback:225,color:'#d4d0b9',base:'#a3a28b',wear:.85,height:53,openings:[o('vent',.13,.38,.59,.22,{color:'#797c66',grille:'square'}),o('vent',.73,.13,.76,.09,{color:'#626e56'})]}),
  front('aa-e02-muro-tijolos','east',2000,1840,{name:'Muro baixo de tijolos, pintura branca e bananeiras',point:4,refs:[[3,3],[4,3],[5,2]],roof:'none',depth:8,height:44,color:'#b57f55',base:'#616d50',baseHeight:.14,detail:'aa-brick-white',wear:.85,plants:'vines'}),
  front('aa-e03-jardim','east',1840,1770,{name:'Garagem marrom, cactos altos e canteiro florido',point:5,refs:[[5,3],[6,2]],roof:'courtyard',height:53,color:'#b8b19b',base:'#9b9b82',wear:.85,openings:[gate(.08,.43,{color:'#795a47',grille:'vertical',bars:'#795a47',solid:1})],ramp:.08}),
  front('aa-e04-casa-1709','east',1770,1640,{name:'Casa 1709, muro creme e portão de faixas verticais',point:6,refs:[[6,3],[6,4]],roof:'courtyard',color:'#dad0b6',base:'#b7b5a2',baseHeight:.16,wear:.58,detail:'aa-cream-gate',openings:[gate(.04,.27,{color:'#686654',grille:'vertical',bars:'#dddccc',solid:.1})],signs:[sign(.34,.29,.17,.11,'1709',{ink:'#71674b'})],ramp:.04}),
  front('aa-e05-trepadeira','east',1640,1575,{name:'Fachada ocre coberta por trepadeira com flores',point:7,refs:[[7,3],[7,2]],color:'#ae935d',base:'#827554',wear:.9,plants:'full-vines',detail:'aa-flowering',openings:[win(.47,.13,{color:'#515b44'})]}),
  front('aa-e06-casa-verde','east',1575,1320,{name:'Casa de azulejos verdes, grades curvas, porta e garagem branca',point:8,refs:[[7,4],[8,3],[9,2]],roof:'tile',height:57,color:'#94ae73',base:'#c5c5ad',baseHeight:.12,pattern:'white-tile',detail:'aa-green-arches',openings:[o('porch',.02,.25,.43,.32,{color:'#5f7350',grille:'vertical',bars:'#d8d5bd'}),door(.30,.07,{color:'#e1ddcc',solid:1}),o('porch',.41,.27,.43,.32,{color:'#5f7350',grille:'vertical',bars:'#d8d5bd'}),gate(.74,.24,{color:'#e0dfd3',solid:1})]}),
  // The green lot between this house and the school is deliberately empty.
  front('aa-school-north-wall','east',940,870,{name:'Muro de alvenaria no início da escola',point:12,refs:[[12,3]],height:45,depth:8,roof:'none',color:'#968d75',base:'#7a7e62',detail:'aa-brick-white',wear:.9,openings:[door(.51,.13,{color:'#bbc8b1',h:.40})]}),
  front('aa-school-blue-wall','east',870,405,{name:'Escola Santa Filomena, muro azul até o portão coberto',point:14,refs:[[13,3],[14,3],[15,3],[16,3]],depth:7,roof:'none',height:52,color:'#9faecc',base:'#8f9cbb',baseHeight:.12,pattern:'small-tile',detail:'aa-school-wall',wear:.43}),
  front('aa-school-blue-wall-south','east',315,260,{name:'Trecho azul entre o portão coberto e a entrada de azulejos claros',point:17,refs:[[17,3],[18,2]],depth:7,roof:'none',height:52,color:'#9faecc',base:'#8f9cbb',baseHeight:.12,pattern:'small-tile',detail:'aa-school-wall',wear:.43}),
  front('aa-school-tile-wing','east',915,700,{name:'Escola, ala térrea recuada de telhas',point:13,refs:[[13,3],[14,2]],setback:33,depth:280,height:83,color:'#d4ceb5',base:'#99a2a3',openings:[win(.55,.16,{color:'#4d5650',grille:'square'})]}),
  front('aa-school-classrooms','east',700,455,{name:'Escola, bloco alto com âncora, ondas e lápis no mural',point:15,refs:[[14,3],[15,3],[16,2]],setback:37,depth:240,height:140,roof:'flat',color:'#e0d9b8',base:'#c9cbbb',baseHeight:.08,detail:'aa-school-mural',openings:[o('window',.12,.23,.68,.22,{color:'#343e36',grille:'square',bars:'#465247'}),o('window',.59,.23,.68,.22,{color:'#343e36',grille:'square',bars:'#465247'})]}),
  front('aa-school-entrance','east',405,315,{name:'Portão azul escuro da escola, cobertura de telhas e grades altas',point:17,refs:[[16,3],[17,2]],depth:65,height:81,color:'#ded8bd',base:'#8d9ab2',openings:[o('gate',.12,.76,0,.84,{color:'#344b4e',grille:'scroll',bars:'#3c5556',solid:.60})]}),
  front('aa-school-secondary','east',260,150,{name:'Entrada da Escola Santa Filomena em azulejo branco e rosa',point:18,refs:[[18,3]],height:67,depth:80,roof:'flat',color:'#d8d9d1',base:'#c49e8e',baseHeight:.10,pattern:'small-tile',detail:'aa-school-secondary',openings:[gate(.22,.56,{color:'#26382c',grille:'vertical',bars:'#40523e',solid:.7}),o('window',.03,.09,.35,.13,{color:'#23332c'})],signs:[sign(.05,.01,.9,.15,'ESCOLA SANTA FILOMENA',{color:'#b5b29c',ink:'#626a59'})]}),
  front('aa-school-last-wall','east',150,-30,{name:'Muro da esquina, reboco cinza e tijolo aparente no topo',point:19,refs:[[19,3],[20,2]],depth:8,height:60,roof:'none',color:'#a49d86',base:'#9a9c83',baseHeight:.03,detail:'aa-brick-top',wear:.45}),
];
const reabilitar={id:'aa-reabilitar',name:'Clínica Reabilitar na esquina da Vinte e Oito de Julho',point:20,photoDirection:4,side:'east',x:56,y:890,depth:150,length:350,height:69,roof:'flat',color:'#d6caab',base:'#9d6252',baseHeight:.10,wear:.43,detail:'aa-reabilitar',openings:[win(.08,.10,{color:'#b6c5b8',grille:'square'}),win(.25,.10,{color:'#b6c5b8',grille:'square'}),win(.43,.10,{color:'#b6c5b8',grille:'square'}),o('shutter',.63,.17,0,.58,{color:'#acb8b0'}),door(.88,.09,{color:'#4b5144',grille:'square',h:.64})],signs:[sign(.02,.06,.79,.17,'REABILITAR',{ink:'#4b5140',sub:'CLÍNICA DE FISIOTERAPIA'})]};
antonioBuildings.push({...reabilitar,street:'antonio-alexandre',axis:'x',originY:-80,local:reabilitar,x:890,y:-80-reabilitar.x-reabilitar.depth,depth:reabilitar.length,length:reabilitar.depth});
// Same two corner buildings already present on Cônego, with their true side faces.
export const antonioCornerFacades={
  'cm-s05-igreja-familia':{face:'maxY',street:'antonio-alexandre',point:2,photoDirection:7,color:'#78828a',base:'#737f7c',baseHeight:.06,detail:'',openings:[],signs:[]},
  'cm-final-clinica':{face:'minY',street:'antonio-alexandre',point:2,photoDirection:3,color:'#d8c287',base:'#a39e84',baseHeight:.17,detail:'',wear:.9,openings:[door(.08,.075,{color:'#856b45',wood:true}),win(.22,.12,{color:'#545e43',grille:'vertical',bars:'#535d46'}),door(.44,.08,{color:'#356d52',grille:'vertical'}),win(.56,.11,{color:'#656449',grille:'vertical'}),door(.78,.08,{color:'#356b51',grille:'vertical'}),win(.88,.10,{color:'#617047',grille:'vertical'})],signs:[]},
};
export const CINEMA_BACK={street:'antonio-alexandre',point:19,photoDirection:7,color:'#aa8d68',base:'#77745f',baseHeight:.25,wear:1,detail:'aa-cinema-rear',trim:'',openings:[],signs:[]};
export const antonioTrees=[
  ...[1535,1450,1365].map((y,i)=>({x:antonioCenter(y)+67,y,size:68,height:71,kind:'mature',spreading:true,seed:301+i})),
  ...[[1230,81],[1080,89],[920,88],[760,65],[585,79],[410,74]].map(([y,size],i)=>({x:antonioCenter(y)-115,y,size:size*1.55,height:size+30,kind:'mature',spreading:true,seed:310+i})),
  ...[[590,1180,83],[540,970,75],[560,650,79],[515,460,72]].map(([x,y,size],i)=>({x,y,size:size*1.55,height:size+22,kind:'mature',spreading:true,seed:320+i})),
  {x:1370,y:1920,size:50,height:76,kind:'young',seed:329},
];
export const antonioPoles=[2100,1895,1510,1190,900,650,240,0].map((y,i)=>({x:antonioCenter(y)+(i%3===1?66:-66),y,height:151+i%3*7,street:'antonio-alexandre'}));
export const antonioCars=[{x:antonioCenter(1545)-49,y:1545,color:'#354b50',seed:331},...[450,610,785].map((y,i)=>({x:antonioCenter(y)-49,y,color:['#c9cec1','#40545a','#aeb4af'][i],seed:332+i})),{x:antonioCenter(565)+50,y:565,color:'#53605e',seed:335}];
export const antonioShrubs=[{x:antonioCenter(1790)+96,y:1790,r:25},{x:antonioCenter(1610)+90,y:1610,r:22},...Array.from({length:18},(_,i)=>({x:595+(i%2)*130,y:410+Math.floor(i/2)*89,r:17+i%3*3})),...Array.from({length:54},(_,i)=>({x:1040+(i*137)%465,y:969+(i*97)%320,r:25+i%5*5,flowers:false}))];
export const antonioCacti=Array.from({length:7},(_,i)=>({x:antonioCenter(1800)+87+i%2*5,y:1779+i*4,height:38+i*17%28}));
export const antonioBikes=[{x:antonioCenter(1670)+53,y:1670},{x:antonioCenter(1640)+55,y:1640},{x:antonioCenter(1605)+53,y:1605},{x:antonioCenter(1735)-55,y:1735}];
