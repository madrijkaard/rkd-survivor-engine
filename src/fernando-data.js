import { FERNANDO_PROFILE, MENDONCA_ROAD } from './road-profiles.js';
import { parkingOffset } from './road-dimensions.js';
import { JULHO_WALK } from './julho-data.js';
export const FERNANDO_FRONT=FERNANDO_PROFILE.outerHalfWidth;
// Levantamento: reference/streets/fernando-carvalho/levantamento.md.
// Dimensões e fundos não fotografados são aproximações artísticas.
import { fernandoPoints } from './fernando-points.js';
import { JULHO_END } from './julho-data.js';
import { CROSS_Y } from './mendonca-data.js';
export { fernandoPoints };
export const FERNANDO_X=JULHO_END.x;
export const FERNANDO_END=fernandoPoints.at(-1);
export const FERNANDO_WALK={x:FERNANDO_X-FERNANDO_FRONT,y:JULHO_WALK.y+JULHO_WALK.h,w:FERNANDO_FRONT*2,h:CROSS_Y+270-(JULHO_WALK.y+JULHO_WALK.h)};
export const FERNANDO_CROSS={x:FERNANDO_X-250,y:CROSS_Y-MENDONCA_ROAD.outerHalfWidth,w:505,h:MENDONCA_ROAD.totalWidth};
export const FERNANDO_TRAVESSA={x:FERNANDO_X-220,y:1002.5-FERNANDO_PROFILE.outerHalfWidth,w:220,h:FERNANDO_PROFILE.totalWidth};
const o=(kind,u,w,bottom,h,extra={})=>({kind,u,w,bottom,h,...extra});
const door=(u,w,extra={})=>o('door',u,w,0,.76,extra);
const win=(u,w,extra={})=>o('window',u,w,.30,.40,extra);
const gate=(u,w,extra={})=>o('gate',u,w,0,.78,extra);
const shutter=(u,w,extra={})=>o('shutter',u,w,0,.76,extra);
const sign=(u,top,w,h,text,extra={})=>({u,top,w,h,text,...extra});
function front(id,side,start,end,data){
  if(end===955)end=FERNANDO_TRAVESSA.y;
  if(start===1050)start=FERNANDO_TRAVESSA.y+FERNANDO_TRAVESSA.h;
  if(end===2290)end=CROSS_Y-MENDONCA_ROAD.outerHalfWidth;
  if(start===2400)start=CROSS_Y+MENDONCA_ROAD.outerHalfWidth;
  const depth=data.depth??160;
  return {id,side,street:'fernando-carvalho',x:FERNANDO_X+(side==='west'?-FERNANDO_FRONT-depth:FERNANDO_FRONT),y:start,depth,length:end-start,height:58,roof:'tile',color:'#d2c8ad',base:'#a4a28e',baseHeight:.12,wear:.4,openings:[],signs:[],photoDirection:side==='west'?7:3,...data};
}
// Um só volume: a frente acompanha o novo passeio da Vinte e Oito;
// o fundo mantém a junção fotografada com o próximo lote da Fernando.
export function fernandoSharedCorner(b){
  if(!['jl-esquina-verde','jl-uniodonto'].includes(b.id))return b;
  const green=b.id==='jl-esquina-verde',end=green?270:250,start=JULHO_WALK.y+JULHO_WALK.h,depth=end-start;
  const crossFacade={face:green?'minY':'maxY',street:'fernando-carvalho',point:3,photoDirection:green?3:7,color:green?'#8bcb93':'#c8be9c',baseHeight:0,wear:green?.55:.23,detail:green?'fc-green-side':'fc-clinic-side',openings:green?[door(.80,.13,{open:true,color:'#3b5141'}),o('window',.17,.15,.58,.20,{grille:'square',bars:'#71776b',color:'#455548'})]:[],signs:[]};
  const local={...b.local,x:b.originY-end,depth,crossFacade};
  return {...b,local,crossFacade,y:start,length:depth};
}
export const fernandoBuildings=[
  front('fc-clinica-parede-branca','west',250,595,{point:4,refs:[[3,8],[4,6],[4,7],[5,7]],name:'Parede branca, condensadoras gradeadas e porta de enrolar',residential:false,height:73,roof:'flat',color:'#deded4',baseHeight:0,wear:.8,detail:'fc-white-clinic',openings:[shutter(.66,.15,{color:'#859082'})]}),
  front('fc-muro-chapisco','west',595,770,{point:6,refs:[[5,8],[6,7],[7,6]],name:'Muro alto de chapisco cinza',residential:false,height:77,roof:'none',depth:9,color:'#898777',wear:.85,detail:'fc-rough'}),
  front('fc-sobrado-travessa','west',770,955,{point:7,refs:[[7,7],[8,5],[8,6]],name:'Sobrado branco na boca da travessa',residential:false,height:113,roof:'flat',color:'#dedfd5',baseHeight:0,wear:.65,openings:[o('shutter',.08,.84,0,.49,{color:'#bdc6be'}),o('window',.31,.48,.72,.17,{glass:true,color:'#6e8584'})],crossFacade:{face:'maxY',street:'fernando-carvalho',point:8,photoDirection:6,color:'#dedfd5',openings:[o('shutter',.06,.33,0,.44,{color:'#acb7b0'}),o('door',.46,.23,0,.44,{glass:true}),o('porch',.15,.69,.66,.22,{grille:'horizontal'})],signs:[sign(.45,.51,.5,.07,'Comunicação Visual',{ink:'#ac6560'})]}}),
  front('fc-galpao-travessa','west',1050,1200,{point:8,refs:[[8,7],[8,8],[9,6]],name:'Galpão aberto de estrutura metálica na esquina',residential:false,height:82,roof:'shed',roofColor:'#8f9489',color:'#c5c2ab',base:'#7a8991',baseHeight:.24,detail:'fc-open-shed',openings:[o('porch',.03,.94,.48,.46,{grille:'horizontal',bars:'#b2b6aa'})],crossFacade:{face:'minY',street:'fernando-carvalho',point:8,photoDirection:7,color:'#aaa99a',base:'#7a8991',baseHeight:.25,detail:'fc-open-shed',openings:[o('porch',.03,.94,.48,.46,{grille:'horizontal'})],signs:[]}}),
  front('fc-katia','west',1200,1445,{point:10,refs:[[9,7],[10,6],[10,7]],name:'Kátia Instituto de Beleza, painel alto e vidros',residential:false,height:115,roof:'hidden-tile',color:'#d9d4c7',baseHeight:0,detail:'fc-katia',wear:.15,openings:[o('gate',.02,.24,0,.44,{solid:1,color:'#d5dbce'}),o('door',.28,.27,0,.44,{glass:true,color:'#61776e'}),o('door',.62,.20,0,.44,{glass:true,color:'#546a5c'}),o('gate',.85,.13,0,.44,{solid:1,color:'#cbd6cb'})],signs:[sign(.32,.08,.66,.25,'Kátia',{color:'#263f4c',ink:'#d3be76',sub:'INSTITUTO DE BELEZA'})]}),
  front('fc-cross','west',1445,1690,{point:11,refs:[[10,8],[11,7],[12,6]],name:'CF Cross, cinza e verde-limão',residential:false,height:75,roof:'shed',roofColor:'#8f9489',color:'#879295',baseHeight:0,detail:'fc-cross',wear:.12,openings:[gate(.05,.26,{color:'#4b5b50',bars:'#d3d9ce',solid:.15}),o('vent',.04,.93,.77,.18,{color:'#30443a',grille:'horizontal'})],signs:[sign(.46,.36,.44,.29,'CF CROSS',{color:'#172d26',ink:'#b0d74b'})]}),
  front('fc-justica','west',1690,1840,{point:12,refs:[[12,7],[13,6]],name:'Casa creme e azul com venezianas de madeira',residential:false,color:'#ddd6be',base:'#949b92',baseHeight:.30,detail:'fc-justica',openings:[win(.09,.29,{wood:true,color:'#735b3d'}),door(.49,.13,{wood:true,color:'#615037'}),win(.72,.23,{wood:true,color:'#735b3d'})],signs:[sign(.44,.20,.25,.22,'Justiça',{color:'#b9c8be',ink:'#3f4d43'})]}),
  front('fc-casa-amarela','west',1840,1900,{point:13,refs:[[13,6]],name:'Casa amarela baixa com base verde e grade escura',color:'#c7aa54',base:'#76a38c',wear:.8,height:49,openings:[gate(.22,.58,{color:'#4a5441',grille:'square',bars:'#5f6348'})]}),
  front('fc-muro-porta','west',1900,1960,{point:13,refs:[[13,7]],name:'Muro cinza com portinha gradeada',residential:false,depth:9,height:53,roof:'none',color:'#b9baa9',base:'#d1d0bc',baseHeight:.58,wear:.8,openings:[door(.43,.21,{color:'#516346',grille:'square',bars:'#7e7b56'})]}),
  front('fc-patio-branco','west',1960,2070,{point:14,refs:[[14,6],[14,7]],name:'Muro branco baixo e portão oxidado do pátio',residential:false,depth:120,height:39,roof:'courtyard',color:'#d8dcd1',baseHeight:0,wear:.5,openings:[gate(.21,.51,{color:'#a29b87',bars:'#866e56',solid:1})]}),
  front('fc-casa-branca','west',2070,2180,{point:15,refs:[[14,8],[15,6],[15,7]],name:'Casa branca, telhado aparente e janela com grade',height:57,color:'#d5d7ca',baseHeight:0,wear:.4,openings:[door(.10,.18,{color:'#96957b',wood:true}),win(.48,.34,{wood:true,grille:'square',bars:'#6c6c57',color:'#978771'})]}),
  front('fc-terreno-esquina','west',2180,2290,{point:16,refs:[[15,8],[16,7],[17,5],[17,6]],name:'Terreno de esquina com muro baixo de tijolos caiados',residential:false,height:32,depth:180,roof:'none',color:'#c6ccbe',baseHeight:0,wear:.9,detail:'fc-brick-white',crossFacade:{face:'maxY',street:'fernando-carvalho',point:17,photoDirection:6,color:'#c6ccbe',detail:'fc-brick-white',openings:[],signs:[sign(.30,.23,.58,.27,'DROGAS',{ink:'#98adb0'})]}}),
  front('fc-ruina-vedada','east',270,460,{point:4,refs:[[4,2],[4,3],[5,4]],name:'Portas antigas vedadas com tijolos e trepadeiras',residential:false,depth:9,height:64,roof:'none',color:'#c7ac74',baseHeight:0,wear:1,detail:'fc-sealed',plants:'vines',openings:[o('bricked',.02,.22,0,.87,{color:'#b38361'}),o('bricked',.36,.24,0,.95,{color:'#b38361'}),o('bricked',.73,.23,0,.95,{color:'#b38361'})]}),
  front('fc-muro-vegetacao','east',460,840,{point:6,refs:[[5,3],[6,3],[7,3]],name:'Muro de reboco gasto com vegetação e anúncio apagado',residential:false,depth:9,height:47,roof:'none',color:'#c5baa0',baseHeight:0,wear:1,plants:'vines',detail:'fc-brick-white',signs:[sign(.44,.37,.50,.19,'VENDE-SE',{ink:'#ac7970'})]}),
  front('fc-casa-arcos','east',840,980,{point:8,refs:[[7,1],[8,4]],name:'Casa de pedra com dois portões em arco e óculo',height:58,color:'#d6cab0',pattern:'small-tile',baseHeight:0,detail:'fc-arches',openings:[gate(.33,.29,{color:'#344638',grille:'scroll',bars:'#3b4a38'}),gate(.68,.29,{color:'#344638',grille:'scroll',bars:'#3b4a38'})]}),
  front('fc-sao-lucas','east',980,1160,{point:8,refs:[[8,2],[8,3],[9,4]],name:'Laboratório São Lucas, pátio e muro azul',residential:false,height:64,frontSetback:27,color:'#ebebdc',baseHeight:0,detail:'fc-lab',openings:[door(.30,.31,{glass:true,color:'#688f9b'})],signs:[sign(.02,.06,.95,.20,'SÃO LUCAS',{color:'#81bbca',ink:'#326784',sub:'LABORATÓRIO'})],fence:{height:20,gate:.50,base:'#4775b1',color:'#778dad'}}),
  front('fc-portao-marrom','east',1160,1290,{point:9,refs:[[8,2],[9,3]],name:'Muro amarelo claro com portão marrom e marquise branca',height:58,roof:'hidden-tile',color:'#cec093',baseHeight:0,detail:'fc-white-awning',openings:[gate(.24,.57,{color:'#766849',bars:'#938263',solid:1})]}),
  front('fc-bringelo','east',1290,1360,{point:9,refs:[[9,2],[10,4]],name:'Bringelo Tattoo, fachada grafite e vitrine',residential:false,height:70,roof:'flat',color:'#3d4140',baseHeight:0,openings:[door(.12,.76,{glass:true,color:'#647369',h:.59})],signs:[sign(.03,.06,.94,.19,'Bringelo Tattoo',{ink:'#deddd1',sub:'TATUAGENS E BODY PIERCING'})]}),
  front('fc-garagem-1775','east',1360,1430,{point:10,refs:[[10,3]],name:'Garagem amarela com cerâmica e plantas',height:61,roof:'hidden-tile',color:'#c7a746',baseHeight:0,detail:'fc-stone-pier',openings:[shutter(.06,.69,{color:'#9da69c'})]}),
  front('fc-garagem-1773','east',1430,1490,{point:10,refs:[[10,1],[10,2]],name:'Garagem rosada 1773 de portão branco',height:64,roof:'flat',color:'#d2beb0',baseHeight:0,openings:[gate(.07,.85,{color:'#cbd3c7',solid:1,bars:'#c9d0c5'})],signs:[sign(.70,.20,.24,.10,'1773',{ink:'#767c6d'})]}),
  front('fc-mavito','east',1490,1535,{point:11,refs:[[11,3],[11,4]],name:'Mavito com toldo verde',residential:false,height:64,roof:'flat',color:'#d4c6ac',pattern:'small-tile',baseHeight:0,detail:'fc-green-awning',openings:[shutter(.08,.84,{color:'#bbc2b0',h:.65})],signs:[sign(.02,.07,.96,.18,'Mavito',{color:'#d6daca',ink:'#ae443b'})]}),
  front('fc-casa-1767','east',1535,1625,{point:11,refs:[[11,2],[11,3]],name:'Casa amarela 1767, portão radial e porta de enrolar',height:62,color:'#c6a14a',baseHeight:0,wear:.6,openings:[gate(.08,.58,{color:'#9da99b',grille:'sunburst',bars:'#d0d4c7',solid:.48}),shutter(.73,.21,{color:'#a9b09e'})],signs:[sign(.31,.19,.3,.09,'1767',{ink:'#5b685b'})]}),
  front('fc-portao-azul','east',1625,1730,{point:12,refs:[[12,3],[12,4]],name:'Muro de tijolos caiados e portão azul gasto',residential:false,height:46,depth:9,roof:'none',color:'#d0cdc0',baseHeight:0,wear:1,detail:'fc-brick-white',openings:[gate(.10,.74,{color:'#748d9b',bars:'#5f7986',solid:1})]}),
  front('fc-casa-madeira','east',1730,1780,{point:12,refs:[[12,1],[12,2]],name:'Casa pequena de tijolos pintados, janela e porta de madeira',height:51,color:'#cbc8af',baseHeight:0,wear:1,detail:'fc-brick-white',openings:[door(.08,.25,{wood:true,color:'#9e784f'}),win(.50,.39,{wood:true,color:'#9e784f'})]}),
  front('fc-reforco','east',1780,1865,{point:13,refs:[[13,2],[13,3],[13,4]],name:'Reforço escolar, letreiro pintado e grades escuras',residential:false,height:55,color:'#d4d0bd',baseHeight:0,wear:.9,openings:[door(.06,.20,{wood:true,color:'#675741',grille:'scroll',bars:'#464939'}),win(.62,.32,{wood:true,color:'#70634b',grille:'square',bars:'#494f3d'})],signs:[sign(.32,.35,.27,.15,'REFORÇO ESCOLAR',{ink:'#a08d76'}),sign(.09,.82,.83,.09,'A maior herança é o conhecimento',{ink:'#a87869'})]}),
  front('fc-garagem-antiga','east',1865,1930,{point:13,refs:[[13,1],[14,4]],name:'Garagem cinza esverdeada e porta ornamentada',height:55,color:'#bfb598',baseHeight:0,wear:1,openings:[door(.05,.18,{grille:'scroll',bars:'#635b46'}),gate(.32,.64,{color:'#a3ad9d',bars:'#7d8c7c',solid:1})]}),
  front('fc-casa-grade-preta','east',1930,2030,{point:14,refs:[[14,2],[14,3]],name:'Casa branca com janela escura e garagem gradeada',height:66,roof:'hidden-tile',color:'#d6d4be',baseHeight:0,wear:.55,openings:[gate(.05,.47,{grille:'scroll',bars:'#424b3c',color:'#735d40'}),win(.66,.27,{wood:true,grille:'vertical',color:'#725b40',bars:'#494c3d'})]}),
  front('fc-centro-operario','east',2030,2290,{point:15,refs:[[15,2],[15,3],[16,3],[17,3],[17,4]],name:'Centro Operário Codoense, varanda de grades ornamentais',residential:false,height:76,roof:'courtyard',color:'#d0ceba',baseHeight:0,wear:1,detail:'fc-centro',openings:[o('porch',.02,.25,.22,.59,{grille:'scroll',bars:'#856e5c',color:'#83755d'}),o('gate',.29,.22,0,.81,{grille:'scroll',bars:'#856e5c',color:'#76684e'}),o('porch',.54,.20,.22,.59,{grille:'scroll',bars:'#856e5c'}),o('porch',.78,.19,.22,.59,{grille:'scroll',bars:'#856e5c'})],signs:[sign(.02,.015,.96,.09,'CENTRO OPERÁRIO CODOENSE',{ink:'#9d9c87',sub:'FUNDADO EM 22 DE AGOSTO DE 1953'})],crossFacade:{face:'maxY',street:'fernando-carvalho',point:17,photoDirection:3,color:'#d0ceba',detail:'fc-centro-side',openings:[o('porch',.01,.22,.23,.56,{grille:'scroll',bars:'#856e5c'}),gate(.28,.22,{grille:'scroll',bars:'#856e5c'}),o('vent',.6,.35,.64,.16,{color:'#62694f'})],signs:[]}}),
  // Apenas faces de esquina além da Cônego, sem mapear o próximo quarteirão.
  front('fc-clinica-sublime','west',2400,2590,{point:17,refs:[[16,8],[17,7],[17,8]],name:'Clínica Sublime, sobrado branco e azul na Cônego',residential:false,height:122,roof:'flat',color:'#d5d2c2',baseHeight:0,wear:.13,openings:[o('window',.03,.40,.13,.16,{glass:true,color:'#6b8377'}),o('window',.53,.17,.15,.08,{glass:true,color:'#637c70'}),o('window',.20,.10,.69,.09,{glass:true}),o('window',.45,.10,.69,.09,{glass:true}),o('window',.72,.10,.69,.09,{glass:true})],crossFacade:{face:'minY',street:'fernando-carvalho',point:17,photoDirection:7,color:'#d5d2c2',detail:'fc-sublime',openings:[o('window',.57,.24,.67,.15,{glass:true,color:'#99b1ad'}),o('door',.45,.17,0,.40,{glass:true}),o('window',.72,.23,.16,.17,{glass:true})],signs:[sign(.45,.41,.55,.15,'CLÍNICA SUBLIME',{color:'#315f9e',ink:'#e7e5d4'})]}}),
  front('fc-agencia-trabalho','east',2400,2590,{point:17,refs:[[16,1],[17,1],[17,2]],name:'Agência Regional do Trabalho de Codó, esquina azul',residential:false,height:70,roof:'flat',color:'#6898c0',baseHeight:0,wear:.5,detail:'fc-agencia-side',openings:[o('vent',.48,.12,.47,.18,{grille:'scroll',bars:'#d1d6c9'})],crossFacade:{face:'minY',street:'fernando-carvalho',point:17,photoDirection:2,color:'#6898c0',detail:'fc-agencia',openings:[door(.04,.25,{glass:true,color:'#6b8781',h:.60}),shutter(.37,.24,{color:'#a6b8b6',h:.60}),shutter(.70,.23,{color:'#bfc9c0',h:.60})],signs:[sign(.03,.09,.52,.20,'AGÊNCIA REGIONAL',{color:'#656586',ink:'#d5d5cf',sub:'DO TRABALHO DE CODÓ'})]}}),
];
export const fernandoPoles=[490,825,1335,1710,2180].map(y=>({x:FERNANDO_X+FERNANDO_PROFILE.halfWidth+8,y,height:154,street:'fernando-carvalho'}));
export const fernandoTrees=[{x:FERNANDO_X+125,y:620,size:69,height:101,kind:'mature',seed:811},{x:FERNANDO_X+113,y:765,size:51,height:78,kind:'mature',seed:812},{x:FERNANDO_X+100,y:477,size:43,height:110,kind:'young',seed:813},{x:FERNANDO_X-168,y:2200,size:28,height:116,kind:'palm',seed:814}];
export const fernandoShrubs=[...Array.from({length:18},(_,i)=>({x:FERNANDO_X+70,y:280+i*30,r:16+i%3*3,flowers:false})),{x:FERNANDO_X+50,y:1450,r:9,flowers:false},{x:FERNANDO_X+50,y:1505,r:13,flowers:false}];
export const fernandoCars=[...[330,495,680].map((y,i)=>({x:FERNANDO_X-parkingOffset(FERNANDO_PROFILE),y,color:['#a3aea7','#cfd2c4','#bfc8bf'][i],seed:820+i})),{x:FERNANDO_X+parkingOffset(FERNANDO_PROFILE),y:1110,color:'#465b59',seed:824},{x:FERNANDO_X-parkingOffset(FERNANDO_PROFILE),y:1740,color:'#b7c1b7',seed:825},{x:FERNANDO_X-parkingOffset(FERNANDO_PROFILE),y:2010,color:'#5c6662',seed:826},{x:FERNANDO_X-parkingOffset(FERNANDO_PROFILE),y:2200,color:'#d8dfd2',seed:827}];
export const fernandoBikes=[{x:FERNANDO_X-41,y:1165},{x:FERNANDO_X-41,y:1250},{x:FERNANDO_X-41,y:1310},{x:FERNANDO_X+39,y:2490}];
export const fernandoDescriptions=[
 ['A curva à direita','A Vinte e Oito de Julho encontra a Fernando Carvalho entre o banco e a clínica.'],
 ['A lateral verde','Uma porta aberta e a marquise acompanham a esquina já conhecida.'],
 ['Clínica e casa verde','Condensadoras gradeadas diante da janela alta da casa verde.'],
 ['As portas vedadas','Tijolos preenchem portas antigas sob as trepadeiras.'],
 ['O muro coberto de verde','Reboco descascado e vegetação diante da parede branca.'],
 ['Árvores e chapisco','Um terreno arborizado fica diante do muro alto cinza.'],
 ['Antes da travessa','O sobrado branco marca a abertura lateral da Travessa Z. Cardoso.'],
 ['Laboratório São Lucas','Muro azul e pátio recuado diante do galpão de estrutura metálica.'],
 ['Portão marrom e vitrine','Bringelo Tattoo aparece adiante, perto do Instituto Kátia.'],
 ['Kátia Instituto de Beleza','Painéis altos, vidros e portas claras diante das garagens amarelas.'],
 ['CF Cross e casa 1767','Verde-limão e cinza de um lado, telhas e grades radiais do outro.'],
 ['Portão azul e madeira','Casas baixas e antigas mantêm portas e janelas de madeira.'],
 ['Reforço escolar','A inscrição pintada acompanha a casa branca de grades escuras.'],
 ['Pátios e grades','Muros baixos e garagens antecedem o Centro Operário.'],
 ['Centro Operário Codoense','Varanda comprida de grades ornamentais diante de um terreno murado.'],
 ['A esquina da Cônego','O Centro Operário e o muro baixo terminam na transversal.'],
 ['Fernando Carvalho × Cônego Mendonça','A Clínica Sublime e a Agência Regional do Trabalho documentam a esquina final.'],
];

// Vegetação segue o muro e seus recuos, não a antiga posição da calçada.
for (const item of [...fernandoTrees,...fernandoShrubs]) item.x += Math.sign(item.x-FERNANDO_X)*(FERNANDO_FRONT-63);
