import { simeaoPoints } from './simeao-points.js';

// Point 31 is on the approach to the photographed Henrique Figueiredo crossing.
export const SIMEAO_END = simeaoPoints.at(-1).y + 90;
export const HENRIQUE_ROAD = {x:-320,y:SIMEAO_END-60,w:750,h:120};
const opening=(kind,u,w,bottom,h,extra={})=>({kind,u,w,bottom,h,...extra});
const door=(u,w,extra={})=>opening('door',u,w,0,.73,extra);
const win=(u,w,extra={})=>opening('window',u,w,.30,.42,extra);
const gate=(u,w,extra={})=>opening('gate',u,w,0,.74,extra);
const sign=(u,top,w,h,text,extra={})=>({u,top,w,h,text,...extra});
const front=(id,side,start,end,point,data)=>({
  id:`sm-${id}`,street:'simeao',side,x:side==='west'?-238:80,y:start,
  depth:side==='west'?158:152,length:end-start,point,refs:[[point,side==='west'?7:3]],
  height:59,roof:'tile',color:'#d4cec0',base:'#999788',baseHeight:.12,wear:.3,
  openings:[],signs:[],...data,
});

// Shared corner volumes keep their IDs; only their newly photographed lengths
// and Simeão-facing facades change. Cônego-facing textures remain shared.
export const simeaoCornerUpdates = {
  'corner-wall':{length:330,point:18,refs:[[18,7],[19,7]],name:'Muro branco comprido além da Cônego',height:46,wear:.9},
  'corner-shop':{length:185,point:18,refs:[[18,3]],name:'HMB Chaves e Carimbos',
    openings:[door(.08,.23,{color:'#443b2c',open:true})],
    signs:[sign(.15,.10,.78,.11,'CHAVES',{ink:'#e0ded0'}),sign(.15,.23,.78,.10,'CARIMBOS',{ink:'#e0ded0'}),sign(.15,.35,.78,.09,'CODIFICAÇÃO',{ink:'#e0ded0'}),sign(.15,.46,.78,.09,'FERRAGENS',{ink:'#e0ded0'})]},
};

export const simeaoExtensionBuildings = [
  front('w16-ceramica','west',2740,2860,20,{name:'Casa de cerâmica bege, garagem branca e janela gradeada',pattern:'brown-tile',color:'#c6b48f',base:'#b3a780',wear:.7,
    openings:[gate(.06,.45,{color:'#c5c9c3',grille:'horizontal',solid:1}),win(.66,.27,{grille:'star',color:'#979379',bars:'#c3c2ad'})]}),
  front('w17-garagem','west',2860,2920,21,{name:'Garagem branca 1644A',color:'#d2d1c2',roof:'flat',height:66,openings:[opening('shutter',.1,.8,0,.73,{color:'#c7c8c0'})]}),
  front('w18-portoes-diagonais','west',2920,3050,21,{name:'Casa 1644, portões diagonais e coluna amadeirada',color:'#d6d5c8',roof:'flat',height:69,detail:'sm-wood-column',wear:.08,
    openings:[door(.06,.17,{grille:'wide-diagonal',bars:'#686354'}),gate(.31,.62,{grille:'wide-diagonal',bars:'#686354'})]}),
  front('w19-pedra','west',3050,3150,22,{name:'Casa clara revestida de pedra e portão branco',roof:'flat',color:'#c7c7b9',height:62,pattern:'small-tile',wear:.1,
    openings:[gate(.08,.40,{color:'#c7c9bd',grille:'vertical',solid:1})]}),
  front('w20-garagem-branca','west',3150,3215,23,{name:'Fachada branca 1634 com garagem',roof:'flat',color:'#d4d2c6',height:66,wear:.1,openings:[gate(.08,.84,{color:'#dadacf',grille:'horizontal',solid:1})]}),
  front('w21-advogados','west',3215,3310,23,{name:'Tadeu Santos Advogados',residential:false,roof:'flat',height:88,color:'#977553',base:'#927251',detail:'sm-office',wear:.06,
    openings:[door(.57,.34,{glass:true,color:'#42564c',h:.55}),gate(.06,.40,{color:'#d2d4c9',grille:'horizontal',solid:1,h:.55})],
    signs:[sign(.08,.09,.82,.22,'TADEU SANTOS',{sub:'ADVOGADOS',color:'#36413e',ink:'#d3d5c7'})]}),
  // Split one continuous wall into adjoining sprites so foreground fading and
  // tree occlusion remain local; these are not separate photographed houses.
  ...Array.from({length:5},(_,i)=>front(`w22-muro-${i+1}`,'west',3310+i*(SIMEAO_END-60-3310)/5,3310+(i+1)*(SIMEAO_END-60-3310)/5,Math.min(31,24+i*2),{
    name:'Muro chapiscado com árvores e tela alta',residential:false,x:-98,depth:18,height:49,roof:'none',color:'#888c7c',base:'#6e7b65',wear:1,detail:'sm-net-wall',
    ...(i===4?{signs:[sign(.70,.2,.22,.60,'PROIBIDO',{sub:'JOGAR LIXO',color:'#ad5349',ink:'#e0dbbd'})]}:{}),
  })),
  front('e16-muro-amarelo','east',2595,2745,19,{name:'Muro amarelo com friso claro e árvore',residential:false,roof:'courtyard',height:58,color:'#d2a451',base:'#bb995b',trim:'white-line',wear:.6}),
  front('e17-garagem-vinho','east',2745,2870,20,{name:'Fachada vinho de garagem marrom e frisos brancos',color:'#a86666',base:'#a86666',roof:'hidden-tile',height:57,trim:'white-line',detail:'sm-wine-lines',
    openings:[gate(.05,.55,{color:'#695c48',grille:'vertical',solid:1})]}),
  front('e18-casa-verde','east',2870,2985,21,{name:'Casa verde clara com janela e porta de madeira verde',color:'#b7c6ac',base:'#a0a68b',pattern:'small-tile',height:58,detail:'sm-green-house',
    openings:[door(.08,.2,{wood:true,color:'#3d6554'}),win(.44,.42,{wood:true,color:'#3d6554'})]}),
  front('e19-garagem-terracota','east',2985,3090,22,{name:'Casa branca com garagem terracota e entrada recuada',color:'#d2cfbe',roof:'courtyard',height:50,
    openings:[opening('porch',.08,.3,0,.72,{color:'#5d5846',recess:true}),gate(.49,.45,{color:'#a46d59',solid:1,grille:'square'})]}),
  front('e20-sobrado','east',3090,3200,22,{name:'Sobrado branco, varanda de cobogó e garagem vermelha',height:116,color:'#d8d4c0',wear:.5,
    openings:[opening('balcony',.05,.90,.57,.24,{grille:'diamond',color:'#485747',bars:'#d5d2bd'}),opening('gate',.08,.55,0,.4,{color:'#a36d60',solid:1,grille:'vertical'}),opening('door',.76,.15,0,.4,{grille:'square',color:'#847a63'})]}),
  front('e21-cristo-rei','east',3200,3475,24,{name:'Colégio Cristo Rei',residential:false,height:96,roof:'flat',color:'#b8cddd',base:'#b8cddd',wear:.05,detail:'sm-cristo-rei',
    openings:[door(.21,.08,{color:'#779697',glass:true,h:.53}),gate(.72,.24,{color:'#a6aaa0',solid:1,grille:'vertical',h:.53})],
    signs:[sign(.68,.27,.29,.15,'CRISTO REI',{sub:'A CAMINHO COM CRISTO',color:'#d6a179',ink:'#4b84a4'})]}),
  front('e22-portao-antigo','east',3475,3560,25,{name:'Muro branco gasto com portão preto e branco',residential:false,height:43,roof:'courtyard',color:'#babaa4',wear:1,
    openings:[gate(.16,.56,{grille:'wide-diagonal',bars:'#34483b',color:'#b3b8a3'})]}),
  front('e23-garagem-cinza','east',3560,3640,26,{name:'Garagem de reboco cinza com portão marrom',height:45,roof:'flat',color:'#969b88',wear:.8,
    openings:[gate(.08,.40,{color:'#5b5640',grille:'vertical',solid:1})]}),
  front('e24-casa-cinza','east',3640,3750,26,{name:'Casa cinza clara com frisos e grades radiais',height:62,roof:'hidden-tile',color:'#b8bdb9',base:'#a4b0a8',trim:'white-line',
    openings:[door(.08,.25,{grille:'sunburst',bars:'#c5b98a',color:'#7e7657'}),win(.65,.23,{grille:'sunburst',bars:'#c5b98a'})]}),
  front('e25-garagem-antiga','east',3750,3840,27,{name:'Fachada antiga de garagem branca e platibanda',roof:'hidden-tile',height:60,color:'#b5af95',wear:.9,pattern:'horizontal',
    openings:[gate(.05,.44,{color:'#b7b9a1',grille:'diagonal',bars:'#d5d5bf',solid:.7})]}),
  front('e26-parede-alta','east',3840,3930,28,{name:'Parede alta de reboco sem pintura',residential:false,height:93,roof:'none',color:'#a9a693',wear:.9}),
  ...Array.from({length:3},(_,i)=>front(`e27-muro-${i+1}`,'east',3930+i*(SIMEAO_END-60-3930)/3,3930+(i+1)*(SIMEAO_END-60-3930)/3,29+i,{
    name:'Muro de reboco com tijolos expostos',residential:false,x:80,depth:18,height:45,roof:'none',color:'#a29a82',base:'#938e76',wear:1,detail:'sm-brick-wall',
    openings:i===0?[gate(.3,.36,{color:'#b5b8aa',solid:1,grille:'vertical'})]:[],
  })),
  front('final-bar','west',SIMEAO_END+65,SIMEAO_END+190,31,{name:'Bar da esquina com Henrique Figueiredo',photoDirection:1,refs:[[31,1],[31,8]],residential:false,color:'#c38e72',base:'#394442',baseHeight:.31,roof:'tile',height:51,
    openings:[door(.1,.20,{open:true}),door(.64,.23,{open:true})],crossFacade:{face:'minY',street:'simeao',point:31,photoDirection:1,openings:[door(.1,.20,{open:true}),door(.62,.2,{open:true})],signs:[]}}),
  front('final-casa-verde','east',SIMEAO_END+65,SIMEAO_END+190,31,{name:'Casa verde da esquina com base cinza',photoDirection:1,refs:[[31,1],[31,2]],color:'#aecb93',base:'#99a9ae',baseHeight:.28,roof:'hidden-tile',height:58,
    openings:[door(.12,.18,{grille:'vertical'}),win(.55,.22,{grille:'square'})],crossFacade:{face:'minY',street:'simeao',point:31,photoDirection:1,openings:[win(.1,.3,{grille:'square'}),door(.6,.13,{grille:'square'}),win(.82,.12,{grille:'square'})],signs:[]}}),
];

export const simeaoExtensionTrees = [
  {x:123,y:2685,size:47,height:83,seed:401},
  ...[3390,3570,3760,3970,4200].map((y,i)=>({x:-166,y,size:65+i%2*12,height:105+i%3*9,seed:410+i})),
  {x:213,y:SIMEAO_END+128,size:54,height:83,seed:419},
];
export const simeaoExtensionPoles = [2570,2990,3450,3905,4310].map((y,i)=>({x:-72,y,height:146+i%2*8}));
export const simeaoExtensionCars = [{x:48,y:2695,color:'#b7beba',seed:410},{x:46,y:3110,color:'#9da89f',seed:411},{x:46,y:3760,color:'#899288',seed:412}];
