import { ANTONIO_ROAD } from './road-profiles.js';
import { alignAntonioCar } from './antonio-data.js';
// Extension north of Cônego Mendonça, surveyed in all eight views of points 21–34.
// Dimensions and hidden backs are artistic approximations; IDs 1–20 stay intact.
import { front, antonioCenter, antonioEdge, ANTONIO_NORTH } from './antonio-data.js';
const o=(kind,u,w,bottom,h,extra={})=>({kind,u,w,bottom,h,...extra});
const door=(u,w,extra={})=>o('door',u,w,0,.75,extra);
const win=(u,w,extra={})=>o('window',u,w,.27,.43,extra);
const gate=(u,w,extra={})=>o('gate',u,w,0,.78,extra);
const sign=(u,top,w,h,text,extra={})=>({u,top,w,h,text,...extra});
export const MATRIZ_END_ROAD={x:ANTONIO_NORTH.x-270,y:ANTONIO_NORTH.y-ANTONIO_ROAD.outerHalfWidth,w:600,h:ANTONIO_ROAD.totalWidth};
export const matrizCornerFacades={
  'cm-n06-jardim-rosa':{face:'maxY',street:'antonio-alexandre',point:34,photoDirection:7,color:'#cd9284',base:'#c8897b',baseHeight:.47,detail:'am-garden-rail',wear:.4,
    openings:[gate(.36,.32,{color:'#deddd1',solid:1}),door(.86,.10,{color:'#dddccf',solid:.6}),o('porch',.02,.28,.45,.48,{color:'#465540',grille:'scroll',bars:'#b8bca9'}),o('porch',.72,.13,.45,.48,{color:'#44523a',grille:'scroll',bars:'#b8bca9'})],signs:[]},
};
export const matrizBuildings=[
  front('am-sobrado-paroquial','west',2840,2670,{point:22,refs:[[21,8],[22,7],[24,6]],name:'Sobrado amarelo com varanda e jardim florido',residential:false,height:119,roof:'tile',color:'#c5b377',base:'#8d8056',baseHeight:.10,wear:.7,setback:19,
    openings:[o('porch',.07,.80,.66,.28,{color:'#a78e50'}),o('door',.14,.17,0,.42,{color:'#65573f',grille:'vertical'}),o('gate',.55,.20,0,.42,{color:'#655e43',grille:'vertical'}),o('window',.03,.13,.37,.13,{color:'#605b43',grille:'square'})],
    signs:[sign(.05,.37,.90,.11,'SANTA RITA E SANTA FILOMENA',{ink:'#766a48',sub:'DIOCESE DE CODÓ'})],plants:'vines',detail:'am-parish-balcony'}),
  front('am-garagem-paroquial','west',2890,2840,{point:24,refs:[[24,7]],name:'Garagem marrom ao lado do sobrado',residential:false,height:49,color:'#ccb775',wear:.7,openings:[gate(.07,.86,{color:'#967e68',solid:1})]}),
  front('am-salao-missoes','west',3010,2890,{point:23,refs:[[23,6],[23,7],[24,8]],name:'Salão amarelo das Santas Missões Populares',residential:false,height:65,color:'#c9b578',base:'#8a8262',baseHeight:.10,wear:1,detail:'am-cobogo',openings:[],signs:[sign(.02,.36,.96,.13,'SANTAS MISSÕES POPULARES',{ink:'#ae8075'})]}),
  front('am-salao-aa','west',3140,3010,{point:25,refs:[[23,8],[25,6],[25,7]],name:'Salão branco do Grupo Unidade Codoense de Alcoólicos Anônimos',residential:false,height:65,color:'#cecebb',base:'#9a7d59',baseHeight:.20,wear:1,detail:'am-cobogo-aa',openings:[],signs:[sign(.04,.27,.92,.10,'GRUPO UNIDADE CODOENSE',{ink:'#7f9294'}),sign(.40,.43,.20,.16,'AA',{ink:'#789496'}),sign(.06,.72,.88,.09,'ALCOÓLICOS ANÔNIMOS',{ink:'#7b9090'})]}),
  front('am-portao-tijolos','west',3210,3140,{point:25,refs:[[25,7],[26,6]],name:'Portão enferrujado sob tijolos expostos',residential:false,height:62,roof:'none',depth:8,color:'#cac9b6',wear:1,detail:'aa-brick-top',openings:[gate(.13,.74,{color:'#8f6b4c',grille:'vertical',bars:'#6e6d4c',solid:.08})]}),
  front('am-garagem-creme','west',3285,3210,{point:26,refs:[[26,6],[26,7]],name:'Garagem creme com portas brancas e pequeno respiradouro',height:52,roof:'flat',color:'#d0c6a5',wear:.45,openings:[gate(.09,.77,{color:'#c5c7b5',grille:'vertical',solid:1}),o('vent',.02,.09,.48,.16,{color:'#825847',grille:'square'})],meters:[.94]}),
  front('am-casa-branca','west',3430,3285,{point:27,refs:[[26,7],[26,8],[27,6]],name:'Casa branca com grade ondulada e garagem cinza',height:61,roof:'hidden-tile',color:'#deded4',base:'#c4c2b2',baseHeight:.06,wear:.16,detail:'am-white-bars',openings:[gate(.03,.32,{color:'#b2b9af',grille:'vertical',solid:1}),o('porch',.49,.46,.30,.39,{color:'#78816d',grille:'vertical',bars:'#d7dcd0'})],meters:[.42,.48]}),
  front('am-casa-1578','west',3510,3430,{point:27,refs:[[27,7],[27,8]],name:'Casa 1578 creme com janela gradeada e entrada lateral',height:50,color:'#c8c1a3',base:'#8e9280',baseHeight:.14,wear:.9,openings:[win(.11,.47,{color:'#6f735f',grille:'square',bars:'#b0b6a0'}),door(.82,.12,{color:'#817056',grille:'diamond'})],signs:[sign(.66,.27,.20,.09,'1578',{ink:'#716b57'})]}),
  front('am-casa-amarela','west',3580,3510,{point:28,refs:[[27,8],[28,6],[28,7]],name:'Casa amarela viva com porta e janela de grades pretas',height:49,color:'#d4b83c',base:'#b2a16b',baseHeight:.11,wear:.35,openings:[win(.10,.32,{color:'#454938',grille:'scroll',bars:'#333f32'}),door(.69,.19,{color:'#3d4435',grille:'scroll',bars:'#334033'})]}),
  front('am-escola-arco-iris','west',3740,3580,{point:29,refs:[[28,7],[28,8],[29,7]],name:'Antiga Escola Arco-Íris, aberturas fechadas com alvenaria',residential:false,height:52,color:'#c5b27e',base:'#a16860',baseHeight:.15,wear:1,detail:'am-school-sealed',openings:[],signs:[sign(.04,.11,.90,.20,'Escola Arco-Íris',{ink:'#ac7870'})]}),
  front('am-muro-oeste','west',MATRIZ_END_ROAD.y,3740,{point:31,refs:[[30,7],[31,7],[32,7],[33,7]],name:'Muro cinza rústico até a Henrique Figueiredo',residential:false,depth:8,height:46,roof:'none',color:'#a3a18c',base:'#7c806c',baseHeight:.10,wear:.95,detail:'am-rough-wall'}),
  front('am-ruina-tijolos','east',3310,3125,{point:26,refs:[[25,2],[26,2],[26,3]],name:'Ruína de tijolos e pilares atrás da igreja',residential:false,depth:9,height:56,roof:'none',color:'#a88d6d',wear:1,detail:'aa-brick-white',plants:'full-vines',openings:[o('porch',.17,.25,0,.89,{color:'#42593a'}),o('porch',.59,.22,0,.80,{color:'#4e603e'})]}),
  front('am-porta-coracoes','east',3500,3310,{point:28,refs:[[27,2],[28,3],[28,4]],name:'Parede antiga com corações, porta e trepadeiras',residential:false,depth:9,height:49,roof:'none',color:'#c1af84',wear:1,plants:'vines',detail:'am-hearts',openings:[door(.49,.14,{color:'#5b5140',wood:true}),o('vent',.49,.14,.79,.16,{color:'#4f5742'})]}),
  front('am-muro-alto','east',3730,3500,{point:29,refs:[[28,1],[29,3],[30,4]],name:'Muro alto com faixa branca e reboco manchado',residential:false,depth:9,height:88,roof:'none',color:'#8f8c7b',base:'#c7c7ba',baseHeight:.66,wear:1,detail:'am-rough-wall'}),
  front('am-muro-branco','east',MATRIZ_END_ROAD.y,3730,{point:32,refs:[[30,3],[31,3],[32,3],[33,3]],name:'Muro branco com cerca elétrica na esquina',residential:false,depth:9,height:60,roof:'none',color:'#d0d1c4',base:'#a7ad99',baseHeight:.04,wear:.8,detail:'am-electric-wall',meters:[.16]}),
  // Only the photographed corner faces beyond the junction, not another block.
  front('am-esquina-branca','west',4260,MATRIZ_END_ROAD.y+MATRIZ_END_ROAD.h,{point:33,refs:[[33,8]],name:'Muro branco e telhas do outro lado da esquina',residential:false,depth:120,height:48,roof:'courtyard',color:'#d3d5cb',wear:.5,openings:[]}),
];
export const matrizTrees=[
  {x:1115,y:2720,size:34,height:51,kind:'young',seed:521},
  ...[[1430,3210,77],[1490,3320,86],[1470,3430,69],[1515,3850,54]].map(([x,y,size],i)=>({x,y,size,height:size+18,kind:'mature',seed:522+i})),
  {x:1435,y:3160,size:48,height:130,kind:'palm',seed:528},
  {x:ANTONIO_NORTH.x+154,y:4232,size:45,height:59,kind:'young',seed:529},
];
export const matrizPoles=[2700,3180,3640,4000].map((y,i)=>({x:antonioEdge(y,-ANTONIO_ROAD.outerHalfWidth+6),y,height:153,street:'antonio-alexandre',lamp:true,seed:530+i}));
export const matrizCars=[{x:antonioCenter(2905)+48,y:2905,color:'#cfd4c9',seed:536}].map(alignAntonioCar);
export const matrizShrubs=[
  ...Array.from({length:16},(_,i)=>{const y=3145+i*22;return {x:antonioCenter(y)+109,y,r:22+i%3*4,flowers:false};}),
  {x:1166,y:2720,r:20},{x:1166,y:2795,r:22},
];
export const matrizDescriptions={
  21:['Ao lado da Praça da Matriz','Degraus rosados e o jardim da casa de esquina.'],
  34:['A garagem branca','Grades claras, muro salmão e o sobrado amarelo adiante.'],
  22:['O sobrado paroquial','Varanda amarela e canteiros floridos diante da igreja.'],
  24:['Junto à igreja','A calçada elevada encontra a rampa e os degraus rosados.'],
  23:['Santas Missões Populares','Cobogós circulares sob as telhas do salão amarelo.'],
  25:['O salão branco','Inscrições do Grupo Unidade Codoense e portão enferrujado.'],
  26:['Atrás da igreja','Pilares de tijolos e ruínas cobertas por trepadeiras.'],
  27:['Grades brancas','A casa branca e a casa 1578 acompanham a rua.'],
  28:['A casa amarela','Grades pretas diante da parede antiga com corações.'],
  29:['A antiga Escola Arco-Íris','Aberturas fechadas com tijolos, diante do muro alto.'],
  30:['Entre muros','Muro cinza rústico de um lado e muro branco do outro.'],
  31:['Rumo à Henrique Figueiredo','Vegetação e cerca elétrica acompanham o muro branco.'],
  32:['Antes do cruzamento','Os muros terminam junto à próxima esquina.'],
  33:['Rua Henrique Figueiredo','A Antônio Alexandre alcança a transversal depois da Matriz.'],
};
