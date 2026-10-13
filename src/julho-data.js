import { julhoEastPoles, julhoEastCars, julhoEastShrubs } from './julho-east.js';
import { JULHO_PROFILE, FERNANDO_PROFILE, SIMEAO_ROAD } from './road-profiles.js';
import { parkingOffset } from './road-dimensions.js';
import { julhoWestPoles, julhoWestBikes, julhoWestCars, julhoWestShrubs } from './julho-west.js';
// Vinte e nove panoramas, oito direções por ponto: levantamento em reference/streets/.
// Lotes são agrupados por construção, não por fotografia. Medidas artísticas.
import { julhoPoints } from './julho-points.js';
export { julhoPoints };
export const JULHO_Y=-95;
export const JULHO_END=julhoPoints.find(p=>p.id===9);
export const JULHO_WEST=julhoPoints.find(p=>p.id===10);
export const julhoPath=[...julhoPoints].sort((a,b)=>b.x-a.x);
export const JULHO_WALK={x:JULHO_WEST.x,y:JULHO_Y-JULHO_PROFILE.outerHalfWidth,w:-JULHO_WEST.x,h:JULHO_PROFILE.totalWidth};
export const FERNANDO_ROAD={x:JULHO_END.x-FERNANDO_PROFILE.outerHalfWidth,y:-335,w:FERNANDO_PROFILE.totalWidth,h:510};
const o=(kind,u,w,bottom,h,extra={})=>({kind,u,w,bottom,h,...extra});
const door=(u,w,extra={})=>o('door',u,w,0,.75,extra);
const win=(u,w,extra={})=>o('window',u,w,.30,.42,extra);
const shutter=(u,w,extra={})=>o('shutter',u,w,0,.75,extra);
const sign=(u,top,w,h,text,extra={})=>({u,top,w,h,text,...extra});
const front=(id,side,start,end,data)=>{
  // Preserve lot divisions while setting both frontages outside the new sidewalk.
  if(end===-238)end=-158-SIMEAO_ROAD.outerHalfWidth;
  if(start===-1147)start=JULHO_END.x+FERNANDO_PROFILE.outerHalfWidth;
  if(end===-1257)end=JULHO_END.x-FERNANDO_PROFILE.outerHalfWidth;
  const local={id,side:side==='north'?'west':'east',x:side==='north'?-(JULHO_PROFILE.outerHalfWidth+155):JULHO_PROFILE.outerHalfWidth,y:start,depth:155,length:end-start,height:60,roof:'hidden-tile',color:'#d8c9a9',base:'#a09c83',baseHeight:.12,wear:.35,openings:[],signs:[],photoDirection:side==='north'?1:5,...data};
  return {...local,street:'vinte-e-oito-de-julho',axis:'x',originY:JULHO_Y,local,x:start,y:JULHO_Y-local.x-local.depth,depth:end-start,length:local.depth};
};
export const julhoCornerFacade={face:'minY',street:'vinte-e-oito-de-julho',point:2,photoDirection:1,refs:[[1,8],[2,1]],color:'#e3dfd2',base:'#914448',baseHeight:.32,
  openings:[shutter(.10,.33,{color:'#adb0a9'}),shutter(.57,.33,{color:'#a6aaa2'})],signs:[sign(.46,.34,.10,.09,'44',{ink:'#424c40'})]};
export const julhoBuildings=[
  front('jl-laranja-grades','north',-355,-238,{point:3,refs:[[2,8],[3,1]],name:'Casa laranja com grades radiais e rodapé de pedras',roof:'tile',color:'#d78243',base:'#af9c7d',baseHeight:.35,detail:'jl-stone-base',
    openings:[door(.10,.20,{grille:'sunburst',bars:'#e6dfcf',color:'#5d6351'}),win(.52,.37,{grille:'sunburst',bars:'#e6dfcf',color:'#56624e'})]}),
  front('jl-foto-real','north',-395,-355,{point:3,refs:[[3,1],[4,2]],name:'Foto Real, fachada verde estreita',residential:false,color:'#b9c8ac',height:58,roof:'tile',wear:.8,
    openings:[door(.20,.34,{wood:true,color:'#86694f'})],signs:[sign(.07,.12,.84,.12,'FOTO REAL',{ink:'#416655'})]}),
  front('jl-bethesda','north',-455,-395,{point:3,refs:[[3,8],[4,2]],name:'Bethesda Artigos Religiosos',residential:false,color:'#b44345',height:65,roof:'tile',
    openings:[door(.10,.80,{glass:true,color:'#779083',h:.67})],signs:[sign(.04,.07,.92,.20,'Bethesda',{color:'#e2ded0',ink:'#9a3b46',sub:'ARTIGOS RELIGIOSOS'})]}),
  front('jl-casa-256','north',-552,-455,{point:4,refs:[[4,1],[5,2]],name:'Casa rosa 256, garagem branca e faixa de pedras',color:'#dab0aa',height:59,roof:'tile',pattern:'pebble-bands',
    openings:[o('gate',.04,.56,0,.74,{color:'#d1d4c6',grille:'horizontal',solid:.8}),door(.81,.14,{color:'#dadbcd',grille:'horizontal',solid:1})],signs:[sign(.65,.34,.12,.09,'256',{ink:'#5a5d50'})]}),
  front('jl-portao-262','north',-600,-552,{point:4,refs:[[4,8],[5,1]],name:'Fachada 262 de azulejos e portão preto',height:64,color:'#d9d4c6',pattern:'white-tile',brickBand:.07,roof:'flat',residential:false,
    openings:[shutter(.06,.84,{color:'#353c38'})],signs:[sign(.36,.13,.26,.10,'262',{ink:'#626454'})]}),
  front('jl-argo','north',-680,-600,{point:5,refs:[[5,1],[6,2]],name:'Argo Corretora de Seguros',residential:false,height:74,roof:'flat',color:'#477aa0',baseHeight:0,
    openings:[door(.09,.83,{glass:true,color:'#718b82',h:.64})],signs:[sign(.08,.07,.84,.20,'ARGO',{ink:'#e2ded4',sub:'CORRETORA DE SEGUROS'})]}),
  front('jl-otica-sao-jose','north',-830,-680,{point:6,refs:[[5,8],[6,1],[7,2]],name:'Ótica São José, cerâmica vermelha e duas vitrines',residential:false,height:65,roof:'flat',color:'#a84444',pattern:'small-tile',baseHeight:0,
    openings:[door(.06,.37,{glass:true,color:'#7c9790',h:.67}),door(.49,.32,{glass:true,color:'#78958b',h:.67}),shutter(.88,.10,{color:'#a34744',h:.67})],signs:[sign(.02,.06,.96,.20,'Ótica São José',{color:'#e2ded1',ink:'#a44045'})]}),
  front('jl-loja-preta','north',-872,-830,{point:7,refs:[[6,8],[7,1]],name:'Loja de moldura preta e porta de enrolar',residential:false,height:67,roof:'flat',color:'#d6d3c2',detail:'jl-dark-frame',
    openings:[shutter(.15,.70,{color:'#8e938a',h:.64})]}),
  front('jl-oticas-martins','north',-950,-872,{point:7,refs:[[7,1],[8,2]],name:'Óticas Martins, letreiro azul e vitrine',residential:false,height:65,roof:'flat',color:'#42629a',base:'#d1d0c1',baseHeight:.68,
    openings:[door(.10,.78,{glass:true,color:'#7b978c',h:.64})],signs:[sign(.07,.07,.88,.20,'ÓTICAS MARTINS',{ink:'#e6e2d3'})]}),
  front('jl-otica-sol','north',-1030,-950,{point:8,refs:[[7,8],[8,1]],name:'Ótica Sol, fachada amarela e portas vinho',residential:false,height:67,roof:'flat',color:'#d6ac44',baseHeight:0,
    openings:[shutter(.07,.86,{color:'#873d3e',double:true,h:.71})],signs:[sign(.02,.03,.96,.22,'Ótica Sol',{color:'#e5dfcf',ink:'#884644'})]}),
  front('jl-casa-304','north',-1095,-1030,{point:8,refs:[[8,1],[9,2]],name:'Casa ocre 304 com duas portas de madeira desgastadas',height:62,color:'#c8b888',wear:1,roof:'hidden-tile',
    openings:[door(.10,.26,{wood:true,color:'#c2beab'}),door(.64,.26,{wood:true,color:'#bdb9a8'})],signs:[sign(.43,.46,.13,.08,'304',{ink:'#4e5144'})]}),
  front('jl-esquina-verde','north',-1147,-1095,{point:9,refs:[[8,8],[9,1],[9,2]],name:'Esquina verde de duas portas abertas',residential:false,height:67,color:'#91c599',base:'#8ab798',baseHeight:.28,
    openings:[door(.10,.24,{open:true,color:'#344b3d'}),door(.64,.24,{open:true,color:'#35483c'})],crossFacade:{face:'minY',street:'vinte-e-oito-de-julho',point:9,photoDirection:1,color:'#91c599',openings:[door(.30,.14,{open:true,color:'#35483c'})],signs:[]}}),
  front('jl-sobrado-creme','south',-215,250,{point:1,refs:[[1,4],[1,5],[2,5],[3,4]],name:'Sobrado creme e rosa, varanda comprida de grades',height:119,color:'#d4c7aa',base:'#b49786',baseHeight:.42,roof:'tile',wear:.5,trim:'storey',detail:'jl-balcony',
    openings:[shutter(.03,.15,{color:'#c3c6bd',h:.42}),door(.24,.075,{grille:'vertical',color:'#65765c',h:.42}),o('porch',.35,.18,0,.42,{color:'#57604d'}),shutter(.62,.15,{color:'#bfc2b8',h:.42}),shutter(.80,.16,{color:'#bfc2b8',h:.42}),...[.29,.47,.65].map((u,i)=>o('porch',u,.18,.58,.31,{color:i===1?'#a6544b':'#ac9d7f',grille:'vertical',bars:'#d4d3c2'})),o('window',.06,.13,.64,.23,{color:'#73775c',grille:'horizontal'})]}),
  front('jl-loja-azul','south',-287,-215,{point:2,refs:[[2,5],[3,4]],name:'Loja azul clara de porta cinza',residential:false,height:61,roof:'flat',color:'#78a7bf',base:'#d4d0bf',baseHeight:.18,
    openings:[shutter(.13,.74,{color:'#939c98',h:.72})]}),
  front('jl-loja-turquesa','south',-350,-287,{point:3,refs:[[2,6],[3,5]],name:'Loja turquesa com viga azul e porta de enrolar',residential:false,height:59,roof:'flat',color:'#5bafaf',base:'#d1cfb9',baseHeight:.18,
    openings:[shutter(.08,.85,{color:'#a3aca3',h:.72})]}),
  front('jl-casa-creme','south',-492,-350,{point:3,refs:[[3,5],[4,5]],name:'Casa creme de porta estreita, janela branca e garagem',height:62,color:'#d5c2ac',base:'#bb9d90',baseHeight:.35,roof:'hidden-tile',wear:.7,
    openings:[shutter(.04,.38,{color:'#b2ab96'}),win(.49,.30,{color:'#d1cfb9',grille:'horizontal'}),door(.88,.08,{color:'#545444',wood:true})]}),
  front('jl-coifeodonto','south',-593,-492,{point:4,refs:[[4,5],[5,4]],name:'Coifeodonto, pórtico e letreiro laranja',residential:false,height:85,roof:'flat',color:'#e58035',baseHeight:0,wear:.08,detail:'jl-coife',
    openings:[door(.17,.66,{glass:true,color:'#7d958b',h:.66})],signs:[sign(.04,.10,.92,.19,'coifeodonto',{ink:'#f0e4d0'})]}),
  front('jl-casa-gradeada','south',-725,-593,{point:5,refs:[[4,6],[5,5]],name:'Casa recuada branca com grades e pilares',height:59,roof:'courtyard',color:'#e0ddcf',base:'#b0b3a1',baseHeight:.13,detail:'jl-fenced',
    openings:[o('porch',.08,.56,.13,.65,{color:'#8c9b7c',grille:'diagonal',bars:'#d9dccd'}),o('gate',.72,.22,0,.78,{color:'#697e62',grille:'diagonal',bars:'#dfe1d3',solid:0}),win(.12,.20,{grille:'vertical',color:'#536b50'})]}),
  front('jl-banco-nordeste','south',-1147,-725,{point:7,refs:[[5,6],[6,5],[7,5],[8,5],[9,3],[9,4]],name:'Banco do Nordeste, lateral bege e entrada na Fernando Carvalho',residential:false,height:101,roof:'flat',color:'#c8c2ae',baseHeight:0,pattern:'small-tile',wear:.13,detail:'jl-bank-side',
    openings:[...[.58,.69,.80,.91].map(u=>o('window',u,.043,.51,.15,{color:'#828d83',grille:'square'})),o('window',.10,.35,.44,.15,{color:'#929f94',grille:'vertical'})],
    crossFacade:{face:'minY',street:'vinte-e-oito-de-julho',point:9,photoDirection:3,color:'#c8c2ae',baseHeight:0,pattern:'small-tile',detail:'jl-bank-entry',openings:[door(.20,.62,{glass:true,color:'#536e61',frame:'#a63839',h:.67})],signs:[sign(.03,.13,.94,.16,'Banco do Nordeste',{color:'#a43c3d',ink:'#e8deca'})]}}),
  // Faces vistas do cruzamento; não constituem outro quarteirão mapeado.
  front('jl-uniodonto','north',-1422,-1257,{point:9,refs:[[9,7],[9,8]],name:'Clínica Uniodonto na esquina oposta',residential:false,height:73,roof:'flat',color:'#c8be9c',baseHeight:0,
    openings:[door(.16,.32,{glass:true,color:'#618377',h:.67}),o('window',.60,.28,.06,.61,{glass:true,color:'#728e82'})],signs:[sign(.02,.06,.96,.24,'CLÍNICA UNIODONTO',{color:'#49606a',ink:'#dcdcc7',sub:'ODONTOLOGIA HUMANIZADA'})],crossFacade:{face:'maxY',street:'vinte-e-oito-de-julho',point:9,photoDirection:8,color:'#c8be9c',openings:[o('window',.62,.10,.62,.20,{grille:'square',color:'#717e6c'})],signs:[]}}),
  front('jl-segundo-oficio','south',-1422,-1257,{point:9,refs:[[9,5],[9,6],[9,7]],name:'2º Ofício, esquina branca de frisos verticais',residential:false,height:96,roof:'flat',color:'#deddd2',baseHeight:0,detail:'jl-cartorio',
    openings:[door(.73,.23,{glass:true,color:'#71877c',h:.65})],signs:[sign(.54,.24,.45,.16,'2º Ofício',{ink:'#663f40'})],crossFacade:{face:'maxY',street:'vinte-e-oito-de-julho',point:9,photoDirection:6,color:'#deddd2',detail:'jl-cartorio-side',openings:[shutter(.06,.22,{color:'#cbd0c6',h:.64}),door(.41,.24,{glass:true,color:'#728176',h:.64}),o('window',.81,.13,.39,.23,{grille:'square',color:'#465747'})],signs:[]}}),
];
export const julhoPoles=[{x:-155,y:-59,height:155},{x:-586,y:-142,height:153},{x:-977,y:-141,height:157},{x:-1155,y:-48,height:157}].map(p=>({...p,y:p.y<-100?JULHO_Y-JULHO_PROFILE.halfWidth-8:JULHO_Y+JULHO_PROFILE.halfWidth+8,street:'vinte-e-oito-de-julho'})).concat(julhoWestPoles,julhoEastPoles).sort((a,b)=>b.x-a.x);
export const julhoBikes=[-490,-685,-742,-805,-877,-930,-981,-1040,-1092,-1122].map((x,i)=>({x,y:JULHO_Y+JULHO_PROFILE.halfWidth+8,color:i%2?'#b44339':'#3d4b46'})).concat(julhoWestBikes);
export const julhoCars=[{x:-352,y:JULHO_Y-parkingOffset(JULHO_PROFILE),color:'#8a9ba2',seed:615},{x:-849,y:JULHO_Y-parkingOffset(JULHO_PROFILE),color:'#c9cdc2',seed:616},...julhoWestCars,...julhoEastCars];
export const julhoShrubs=[{x:-473,y:JULHO_Y+JULHO_PROFILE.halfWidth+25,r:11},...julhoWestShrubs,...julhoEastShrubs];
export const julhoDescriptions=[
 ['Da praça à Vinte e Oito','A casa branca e vinho encontra o sobrado de varanda comprida.'],
 ['As duas portas de enrolar','A lateral da casa da Simeão fica diante das lojas azuis.'],
 ['Laranja e grades radiais','Foto Real e Bethesda acompanham a casa laranja.'],
 ['Entre casas e consultório','A casa rosa 256 fica diante da fachada laranja da Coifeodonto.'],
 ['Vitrines e portões','Argo e Ótica São José, diante da casa de grades brancas.'],
 ['Ótica São José','Cerâmica vermelha e duas vitrines diante da lateral bege do banco.'],
 ['A sequência das óticas','Martins e Ótica Sol, com motocicletas junto à calçada.'],
 ['Antes da Fernando Carvalho','A casa ocre 304 e a esquina verde encerram o quarteirão.'],
 ['Rua Fernando Carvalho','Banco do Nordeste, 2º Ofício e Clínica Uniodonto marcam o cruzamento.'],
 ['Retorno pela Vinte e Oito','Da Praça Alcebíades Silva, siga entre a Crefisa e o Centro Odontológico.'],
 ['A varanda da Crefisa','Sobrado creme, faixa azul e pátio gradeado na esquina.'],
 ['A lateral do Centro Odontológico','Grade branca sobre base vermelha e caixa de água elevada.'],
 ['Portões e muro bege','Portões cinza azulados diante do anexo vermelho e do pátio murado.'],
 ['Farmácia São Luís','Três vãos revestidos de azulejos brancos diante do pátio azul.'],
 ['Super Ótica','Moldura alaranjada e vitrines, com motocicletas junto ao passeio.'],
 ['Líder Contabilidade','Painel azul escuro e portas de vidro, diante da casa branca com jardim.'],
 ['Antes da Fernando','Ótica São Francisco e EN Empréstimos, ao lado da Uniodonto.'],
 ['A outra face da esquina','Uniodonto e a fachada lilás do 2º Ofício; o Banco do Nordeste aparece do outro lado.'],
];
