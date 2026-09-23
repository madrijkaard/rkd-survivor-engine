import { mendoncaPoints } from './mendonca-points.js';
import { withPlaceName } from './place-names.js';
export { mendoncaPoints };
export const CROSS_Y = 2345;
export const MENDONCA_END = mendoncaPoints.at(-1).x;
export const WORLD_BOUNDS = { x:-380, y:-335, w:2820, h:3930, height:380 };
// One raised square contains the church; the four surrounding streets remain open.
export const CHURCH_PLAZA = withPlaceName({id:'church-plaza',placeType:'square',x:1320,y:2410,w:MENDONCA_END-70-1320,h:830});
export const PLAZA_CHURCH = withPlaceName({id:'cm-igreja-praca',x:1365,y:2860,w:495,h:235,height:180});
export const CHURCH_TOWER = {x:1780,y:2940,w:76,h:78,height:362};
export const plazaSeats=[
  {x:1360,y:2480,w:92,h:18},{x:1600,y:2480,w:92,h:18},{x:1815,y:2480,w:92,h:18},
  {x:1400,y:2690,w:92,h:18},{x:1830,y:2670,w:78,h:18},
];
export const plazaStatue=withPlaceName({id:'plaza-statue',placeType:'monument',x:1690,y:2790,w:24,h:24});
export const plazaRoads=[
  {x:1194,y:2130,w:126,h:1230},
  {x:MENDONCA_END-70,y:2100,w:140,h:1260},
  {x:1194,y:3240,w:MENDONCA_END+70-1194,h:120},
];

const o=(kind,u,w,bottom,h,extra={})=>({kind,u,w,bottom,h,...extra});
const door=(u,w,extra={})=>o('door',u,w,0,.72,extra);
const win=(u,w,extra={})=>o('window',u,w,.31,.40,extra);
const gate=(u,w,extra={})=>o('gate',u,w,0,.73,extra);
const sign=(u,top,w,h,text,extra={})=>({u,top,w,h,text,...extra});
// Local x points across the street; local y progresses from the autoescola.
// The same facade renderer is rotated into this transverse street at bake time.
const frontage=(id,side,start,end,data)=>{
  const local={id,side:side==='north'?'west':'east',x:side==='north'?-220:57,y:start,depth:side==='north'?155:173,length:end-start,height:60,roof:'tile',color:'#d5c7ac',base:'#9d9d8b',baseHeight:.12,wear:.3,openings:[],signs:[],...data};
  return {...local,street:'conego-mendonca',axis:'x',local,x:start,y:CROSS_Y-local.x-local.depth,depth:end-start,length:local.depth};
};

export const mendoncaBuildings=[
  frontage('cm-n02-casa-ocre','north',230,345,{
    name:'Casa ocre com garagem e varanda de grades curvas',point:2,refs:[[2,1],[3,8]],height:58,roof:'courtyard',color:'#c99a63',base:'#b9ad87',wear:.78,
    openings:[gate(.04,.37,{color:'#8a755a',grille:'vertical',bars:'#a3a18b',solid:.9}),o('porch',.48,.48,.05,.65,{color:'#566746',grille:'scroll',bars:'#c4c1a1'})],meters:[.45],
  }),
  frontage('cm-n03-muro-creme','north',345,465,{
    name:'Muro creme, garagem ornamentada e porta estreita',point:3,refs:[[3,1],[4,8]],color:'#d7d0b7',base:'#334a48',baseHeight:.24,roof:'courtyard',height:53,wear:.5,
    openings:[gate(.04,.37,{color:'#b9beb0',grille:'scroll',solid:.65,bars:'#a0a996'}),door(.77,.10,{color:'#6b6250',grille:'vertical'}),o('vent',.80,.06,.72,.12,{color:'#a6b3a1'})],meters:[.66,.90],
  }),
  frontage('cm-n04-casa-amarela','north',465,560,{
    name:'Casa amarela antiga, porta, janela e porta gradeada',point:4,refs:[[4,1],[5,8]],color:'#c7b373',base:'#9f9e88',baseHeight:.24,wear:.9,roof:'hidden-tile',parapet:9,
    openings:[door(.08,.17,{color:'#60523b',wood:true}),win(.43,.20,{color:'#62573e',wood:true}),door(.80,.17,{color:'#bcbca5',grille:'diamond',bars:'#3c443a'})],steps:true,
  }),
  frontage('cm-n05-sobrado-branco','north',560,720,{
    name:'Sobrado branco com portões brancos e painel amarelo',point:5,refs:[[5,1],[6,8]],height:119,roof:'flat',color:'#dddcd0',base:'#d4d8cc',baseHeight:.46,wear:.08,pattern:'horizontal',detail:'cm-white-house',
    openings:[o('gate',.04,.40,0,.41,{color:'#d5d8cd',grille:'vertical',bars:'#dddcca',solid:.8}),o('gate',.48,.46,0,.41,{color:'#d5d8cd',grille:'vertical',bars:'#dddcca',solid:.8}),o('window',.10,.23,.66,.23,{color:'#6f8c87',glass:true}),o('window',.43,.23,.66,.23,{color:'#6f8c87',glass:true}),o('balcony',.77,.18,.62,.20,{color:'#b9b7a0',grille:'horizontal',bars:'#cbd2be'})],meters:[.01],
  }),
  frontage('cm-n06-jardim-rosa','north',720,1190,{
    name:'Muro rosa e jardim com palmeiras, terminando em grades',point:8,refs:[[6,1],[7,1],[8,1],[9,1],[10,8]],height:44,roof:'garden',color:'#c48f80',base:'#bc8978',baseHeight:0,wear:.45,detail:'cm-garden',
    openings:[],
  }),
  frontage('cm-s01-anexo-branco','south',232,420,{
    name:'Trecho branco sob a varanda que continua a autoescola',point:3,refs:[[2,4],[3,5]],height:122,color:'#deded0',base:'#9f9d88',baseHeight:.07,detail:'cm-school-extension',wear:.55,
    openings:[o('window',.04,.10,.16,.13,{color:'#adb7aa',grille:'square'}),o('window',.22,.15,.12,.29,{color:'#90846c',grille:'diamond',bars:'#606d56'}),o('door',.40,.10,0,.42,{color:'#8a7556',grille:'scroll',bars:'#727a61'}),o('door',.59,.10,0,.42,{color:'#6f6b4f',grille:'scroll',bars:'#727a61'}),o('window',.75,.13,.12,.28,{color:'#8a977e',grille:'vertical'}),o('shutter',.92,.08,0,.45,{color:'#c7c9bb'}),... [.02,.34,.66].map(u=>o('porch',u,.30,.69,.26,{color:'#73776b'}))],meters:[.15,.34,.53,.72,.89],
  }),
  frontage('cm-s02-sobrado-verde','south',420,525,{
    name:'Sobrado verde claro, duas garagens rosadas e varanda',point:4,refs:[[3,4],[4,5]],height:119,color:'#c2d1ad',base:'#a49d80',baseHeight:.05,wear:.13,detail:'cm-green-house',
    openings:[o('gate',.04,.43,0,.47,{color:'#c59a8e',grille:'vertical',bars:'#b98f83',solid:1}),o('gate',.53,.43,0,.47,{color:'#c59a8e',grille:'vertical',bars:'#b98f83',solid:1}),o('porch',.04,.92,.57,.39,{color:'#c9cfc0',grille:'horizontal',bars:'#d3d9c6',solid:0})],trim:'storey',
  }),
  frontage('cm-s03-muro-cinza','south',525,785,{
    name:'Muro cinza chapiscado, portão escuro e concertina',point:5,refs:[[4,3],[5,5],[6,5]],height:55,color:'#aeb7ad',base:'#a8b3a3',baseHeight:0,roof:'courtyard',wear:.28,detail:'cm-security-wall',
    openings:[gate(.47,.23,{color:'#59614e',grille:'vertical',bars:'#65705a',frame:'#d5cbb3',solid:1,h:.70})],meters:[.81],steps:true,dish:true,ramp:.47,
  }),
  frontage('cm-s04-sobrado-rosa','south',785,1030,{
    name:'Sobrado rosa, quatro janelas superiores e aparelhos de ar',point:7,refs:[[6,3],[7,4],[7,5],[8,5]],height:115,color:'#c59685',base:'#a98b6c',baseHeight:.06,wear:.46,sideColor:'#a77c5f',detail:'cm-pink-house',
    openings:[o('gate',.02,.23,0,.43,{color:'#b4c4b5',grille:'vertical',bars:'#c3d0c1',solid:.48}),o('window',.30,.13,.09,.31,{color:'#66755d',grille:'vertical',bars:'#c4cebb'}),o('door',.49,.12,0,.43,{color:'#73775d',grille:'vertical',bars:'#ccd1bd',solid:.45}),o('window',.67,.13,.09,.31,{color:'#788166',grille:'vertical',bars:'#c4cebb'}),o('gate',.84,.15,0,.43,{color:'#b6c6b8',grille:'vertical',bars:'#c3d0c1',solid:.48}),...[.08,.33,.59,.83].map(u=>o('window',u,.13,.65,.26,{color:'#65715a',grille:'vertical',bars:'#c0cbb8'}))],meters:[.27,.46,.63,.81],
  }),
  frontage('cm-s05-igreja-familia','south',1030,1190,{
    name:'Igreja Família IDE, fachada cinza e porta de enrolar',point:9,refs:[[8,4],[9,5]],height:65,color:'#78828a',base:'#747f80',baseHeight:0,wear:.2,detail:'cm-ide',
    openings:[o('shutter',.73,.18,0,.75,{color:'#3e433b'})],signs:[sign(.03,.20,.66,.14,'IGREJA FAMÍLIA IDE',{ink:'#e7e5d4'}),sign(.10,.37,.56,.07,'Semeando o Amor e Colhendo Vidas',{ink:'#dfd4a8'})],meters:[.95],
  }),
  frontage('cm-final-clinica','south',1325,1470,{
    name:'Casa amarela de atendimento clínico junto à praça',point:11,refs:[[10,3],[10,4],[11,5]],height:60,color:'#d4bd74',base:'#9a9681',baseHeight:.09,wear:.60,steps:true,
    openings:[door(.08,.13,{color:'#c4bfa2',grille:'vertical'}),win(.35,.12,{color:'#69624d',grille:'horizontal'}),win(.57,.16,{color:'#416c48',grille:'horizontal'}),door(.83,.13,{color:'#997052',grille:'square',bars:'#383f32'})],signs:[sign(.01,.12,.27,.17,'ATENDIMENTO CLÍNICO',{color:'#c9c8b6',ink:'#535d52',sub:'Intensivo e Semi-intensivo'})],
  }),
  frontage('cm-s07-trepadeiras','south',1470,1640,{
    name:'Casa branca antiga quase coberta de trepadeiras',point:12,refs:[[11,4],[12,5]],height:57,color:'#cdcbb7',base:'#7d8872',baseHeight:.14,wear:.95,roof:'hidden-tile',plants:'full-vines',
    openings:[door(.08,.13,{color:'#aba992',wood:true}),win(.27,.12,{color:'#765d43',wood:true}),win(.79,.12,{color:'#60573c',wood:true})],
  }),
  frontage('cm-s08-bazar','south',1640,1730,{
    name:'Bazar de fachada branca e portão com frisos horizontais',point:13,refs:[[13,5]],height:69,color:'#e0dfd2',base:'#d3d2c1',baseHeight:.04,wear:.28,roof:'flat',steps:true,ramp:.08,
    openings:[o('shutter',.09,.73,0,.58,{color:'#e0e0d1',double:true})],meters:[.88,.95],signs:[sign(.23,.10,.50,.21,'bazar',{color:'#e7e5d9',ink:'#595966',sub:'Roupas e acessórios'})],
  }),
  frontage('cm-s09-garagem-67','south',1730,1810,{
    name:'Garagem branca 67 com platibanda em dois níveis e rampa',point:13,refs:[[13,4],[14,6]],height:65,color:'#e0dfd1',base:'#d8d6c3',baseHeight:.02,wear:.12,roof:'hidden-tile',parapet:9,trim:'blank-fascia',steps:true,ramp:.09,
    openings:[gate(.10,.80,{color:'#dddfd0',grille:'vertical',bars:'#d2d6c8',solid:1})],meters:[.94],signs:[sign(.01,.33,.08,.10,'67',{ink:'#626956'})],
  }),
  frontage('cm-s10-garagem-69','south',1810,1855,{
    name:'Garagem 69 revestida de pequenas pedras claras',point:14,refs:[[14,5]],height:50,color:'#c8c5ae',base:'#c1bfa8',baseHeight:.05,pattern:'small-tile',wear:.16,roof:'hidden-tile',ramp:.08,
    openings:[o('shutter',.09,.82,0,.76,{color:'#dcdfd0',double:true})],meters:[.92],signs:[sign(.39,.07,.17,.10,'69',{ink:'#4c5948'})],
  }),
  frontage('cm-s11-muro-diagonal','south',1855,1945,{
    name:'Muro bege de esquina com faixas diagonais brancas e cerca elétrica',point:14,refs:[[14,4],[15,5]],height:62,depth:205,color:'#bcb1a1',base:'#b6a68c',baseHeight:.05,wear:.20,roof:'courtyard',detail:'cm-diagonal-wall',dish:true,
    openings:[door(.17,.19,{color:'#756548',grille:'vertical',bars:'#dedccd',solid:.9})],
    crossFacade:{face:'maxY',point:15,color:'#bcb1a1',base:'#b6a68c',baseHeight:.05,detail:'cm-diagonal-wall',openings:[gate(.23,.54,{color:'#78694c',grille:'vertical',bars:'#e1ded0',solid:.3})],signs:[]},
  }),
  {id:'cm-igreja-praca',name:'Igreja dentro da praça elevada',...PLAZA_CHURCH,depth:PLAZA_CHURCH.w,length:PLAZA_CHURCH.h,detail:'plaza-church',street:'conego-mendonca',point:11,refs:[[11,1],[13,1],[15,8]]},
  // These fronts face the terminal cross street, beyond its open carriageway.
  {id:'cm-academia-figueiredo',name:'Academia Figueiredo, fachada escura com três faixas brancas',street:'conego-mendonca',point:15,photoDirection:2,side:'east',x:MENDONCA_END+75,y:2410,depth:170,length:270,height:74,roof:'hidden-tile',color:'#354250',base:'#394750',baseHeight:.08,wear:.4,detail:'cm-gym',openings:[door(.50,.13,{color:'#4b5c4b',grille:'square'}),door(.86,.11,{color:'#4b5c4b',grille:'square',awning:true})],signs:[sign(.05,.09,.85,.13,'ACADEMIA FIGUEIREDO',{ink:'#d1d2b7'})]},
  {id:'cm-final-casa-creme',name:'Casa creme com garagem preta, porta e janela gradeadas',street:'conego-mendonca',point:15,photoDirection:3,side:'east',x:MENDONCA_END+75,y:2140,depth:170,length:265,height:56,roof:'tile',color:'#d8cebc',base:'#a19f86',baseHeight:.12,wear:.4,openings:[win(.10,.18,{grille:'square',color:'#7c735c'}),door(.39,.18,{grille:'square',color:'#8e866e'}),gate(.70,.26,{color:'#39443d',grille:'diagonal',bars:'#484d42',solid:1})],signs:[]},
  {id:'cm-final-casa-rosa',name:'Casa rosa baixa ao lado da casa creme',street:'conego-mendonca',point:15,photoDirection:3,side:'east',x:MENDONCA_END+75,y:2000,depth:170,length:138,height:51,roof:'tile',color:'#b88278',base:'#969078',baseHeight:.29,wear:.70,openings:[win(.09,.21,{grille:'square'}),door(.40,.16,{color:'#a4a68c',wood:true}),win(.68,.22,{grille:'square'})],signs:[]},
  {id:'cm-azul-junto-academia',name:'Casa azul baixa junto à academia',street:'conego-mendonca',point:15,photoDirection:1,side:'east',x:MENDONCA_END+75,y:2685,depth:155,length:145,height:53,roof:'tile',color:'#8aaec0',base:'#6488a1',baseHeight:.13,wear:.30,openings:[win(.09,.22,{color:'#b8c8b4',grille:'square'}),door(.42,.17,{color:'#bfc8b0',grille:'vertical'}),win(.71,.19,{color:'#bbc5ac',grille:'square'})],signs:[]},
];

export const cornerFacades={
  'e15-autoescola-bom-pastor':{face:'maxY',point:2,color:'#d88143',base:'#ddd8c2',baseHeight:.05,detail:'school',openings:[o('door',.05,.13,0,.44,{glass:true,color:'#9ba89b'}),o('window',.49,.22,.15,.23,{grille:'diamond',color:'#b1a790',bars:'#d4c8b1'}),o('window',.83,.10,.22,.12,{grille:'square',color:'#b8b8a4'}),... [.02,.36,.70].map(u=>o('porch',u,.29,.69,.26,{color:'#74786c'}))],signs:[sign(.07,.39,.86,.09,'AUTO ESCOLA BOM PASTOR',{ink:'#e4e3d4',shadow:true}),sign(.13,.49,.75,.04,'DIRECIONANDO CAMINHOS',{ink:'#526662'})]},
  'corner-shop':{face:'minY',point:1,color:'#40596b',base:'#465e6a',baseHeight:0,pattern:'small-tile',openings:[door(.07,.23,{color:'#753f32',open:true})],signs:[sign(.02,.13,.40,.19,'HMB',{ink:'#d4c4a0'}),sign(.44,.14,.53,.16,'CHAVES E CARIMBOS',{ink:'#dfd8bc'}),sign(.90,.51,.09,.09,'202',{ink:'#e9e6d7'})]},
  'w15-fc-motos-yamaha':{face:'maxY',point:1,color:'#dcd2ac',base:'#417fa4',baseHeight:.31,openings:[o('shutter',.12,.24,0,.73,{color:'#3c7d9c'}),o('shutter',.68,.23,0,.73,{color:'#3c7d9c'})],signs:[sign(.45,.06,.50,.19,'O PÉRICLES',{ink:'#384a48'})]},
};

export const mendoncaTrees=[
  {x:306,y:2428,size:31,height:54,kind:'young',seed:181},
  {x:960,y:2490,size:56,height:104,kind:'palm',seed:182},
  {x:1115,y:2475,size:43,height:68,kind:'young',seed:183},
  {x:1040,y:2550,size:52,height:96,kind:'palm',seed:184},
  ...[[1380,2550,65],[1590,2550,72],[1770,2550,42],[1880,2550,43],[1380,2750,61],[1550,2760,61],[1790,2750,64],[1885,2830,65],[1400,3170,58],[1780,3170,59]].map(([x,y,size],i)=>({x,y,size,height:size+15,kind:size>55?'mature':'young',seed:185+i,plaza:true})),
];
export const mendoncaPoles=[{x:112,y:2408,height:159},{x:470,y:2407,height:153},{x:940,y:2407,height:153},{x:1333,y:2407,height:158},{x:1740,y:2407,height:158},{x:2055,y:2407,height:156},{x:1182,y:2287,height:155},{x:1910,y:2780,height:135,lamp:true}];
