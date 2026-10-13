import { JULHO_PROFILE as R } from './road-profiles.js';
import { parkingOffset } from './road-dimensions.js';
// Retorno Alcebíades → Fernando. Dimensões artísticas; levantamento nas 72 fotos.
const street='vinte-e-oito-de-julho';
const o=(kind,u,w,bottom,h,extra={})=>({kind,u,w,bottom,h,...extra});
const door=(u,w,extra={})=>o('door',u,w,0,.72,extra);
const sign=(u,top,w,h,text,extra={})=>({u,top,w,h,text,...extra});
function front(id,side,start,end,data){
  const depth=data.depth??150;
  const local={id,side:side==='north'?'west':'east',x:side==='north'?-(R.outerHalfWidth+depth):R.outerHalfWidth,y:start,length:end-start,depth,height:65,roof:'hidden-tile',color:'#d6cdb4',base:'#a4a493',baseHeight:0,wear:.3,residential:false,openings:[],signs:[],photoDirection:side==='north'?1:5,...data};
  return {...local,street,axis:'x',originY:-95,local,x:start,y:-95-local.x-depth,depth:end-start,length:depth};
}
export const julhoWestBuildings=[
  front('jl-w-garagens-bege','north',-1909,-1839,{point:13,refs:[[12,2],[13,1],[13,8],[14,8]],name:'Muro bege, portões cruzados e garagem branca',height:76,roof:'none',depth:12,color:'#cbbf9c',base:'#999e94',baseHeight:.15,wear:.85,detail:'jl-wire-garage',openings:[o('gate',.03,.45,0,.62,{color:'#85979b',grille:'diagonal',bars:'#b9c3bc',solid:1}),door(.52,.13,{color:'#88999b',grille:'diagonal'}),o('shutter',.70,.28,0,.65,{color:'#d2d7cd'})]}),
  front('jl-w-farmacia-sao-luis','north',-1839,-1739,{point:14,refs:[[13,2],[14,1],[14,2],[15,8]],name:'Farmácia São Luís, três vãos de azulejos brancos',height:68,roof:'flat',color:'#ddded3',pattern:'white-tile',detail:'jl-pharmacy',openings:[door(.06,.29,{open:true,color:'#465248'}),door(.41,.16,{open:true,color:'#435144'}),door(.64,.30,{open:true,color:'#435144'})],signs:[sign(.015,.01,.97,.22,'FARMÁCIA SÃO LUÍS',{color:'#d8dbcd',ink:'#91978a'})]}),
  front('jl-w-garagem-cinza','north',-1739,-1714,{point:15,refs:[[14,2],[15,8]],name:'Garagem cinza de platibanda manchada',height:60,color:'#c3c6ba',wear:1,openings:[o('shutter',.06,.88,0,.77,{color:'#9daaa5'})]}),
  front('jl-w-super-otica','north',-1714,-1614,{point:15,refs:[[14,2],[15,1],[15,2],[16,8]],name:'Super Ótica, moldura laranja e duas vitrines',height:91,roof:'flat',color:'#a75943',detail:'jl-super-optics',openings:[door(.08,.38,{glass:true,color:'#6f8c80',frame:'#c95e37',h:.55}),door(.56,.38,{glass:true,color:'#7c9286',frame:'#c95e37',h:.55})],signs:[sign(.045,.06,.91,.25,'SUPER ÓTICA',{color:'#865248',ink:'#e0daca'})]}),
  front('jl-w-lider','north',-1614,-1544,{point:16,refs:[[15,2],[16,1],[16,8]],name:'Líder Contabilidade, painel azul escuro e porta de vidro',height:86,roof:'flat',color:'#98969c',openings:[door(.31,.51,{glass:true,color:'#627b71',h:.55})],signs:[sign(.01,.02,.98,.35,'LÍDER CONTABILIDADE',{color:'#2c4a63',ink:'#e0e1d3',sub:'ASSESSORIA E CONSULTORIA'})]}),
  front('jl-w-otica-sao-francisco','north',-1544,-1479,{point:16,refs:[[16,2],[17,7],[17,8]],name:'Ótica São Francisco, letreiro vermelho e moldura creme',height:80,roof:'flat',color:'#dbd0ae',openings:[door(.10,.83,{glass:true,color:'#80938c',frame:'#ac5348',h:.61})],signs:[sign(.04,.05,.91,.27,'ÓTICA SÃO FRANCISCO',{color:'#b75d50',ink:'#e3d4a5',sub:'Sua visão cada vez melhor'})]}),
  front('jl-w-en-emprestimos','north',-1479,-1422,{point:17,refs:[[17,1],[17,8],[18,8]],name:'EN Empréstimos, reboco pêssego e faixa laranja',height:68,roof:'flat',color:'#d6ad98',wear:.55,openings:[door(.33,.44,{glass:true,color:'#738a80',h:.66})],signs:[sign(.02,.06,.96,.20,'EN EMPRÉSTIMOS',{color:'#c9854d',ink:'#e0d892'})]}),
  front('jl-w-anexo-vermelho','south',-1834,-1780,{point:13,refs:[[12,4],[13,5],[14,6]],name:'Anexo vermelho, frisos e dois vãos gradeados',height:61,roof:'flat',color:'#b35e54',detail:'jl-red-annex',openings:[door(.15,.18,{grille:'vertical',bars:'#43483e',color:'#464d40'}),door(.65,.18,{grille:'vertical',bars:'#43483e',color:'#464d40'})]}),
  front('jl-w-patio-azul','south',-1780,-1675,{point:15,refs:[[14,5],[15,5],[15,6],[16,7]],name:'Pátio de muro gasto, portão azul e volume azul recuado',height:76,depth:170,roof:'none',color:'#c9ccc0',wear:.9,detail:'jl-blue-yard',openings:[]}),
  front('jl-w-casa-jardim','south',-1675,-1422,{point:16,refs:[[15,4],[16,4],[16,5],[17,5],[17,6]],name:'Casa branca recuada, venezianas creme e jardim florido',residential:true,height:68,depth:165,roof:'hidden-tile',color:'#ddddd0',wear:.85,detail:'jl-garden-house',frontSetback:25,fence:{height:19,gate:.51,base:'#c8c9b7',color:'#d7d9c6'},openings:[o('gate',.025,.17,0,.70,{solid:1,color:'#c9c6a9',grille:'vertical'}),o('window',.25,.16,.22,.44,{wood:true,color:'#d0c9ab'}),door(.46,.065,{wood:true,color:'#c7bfa0'}),o('window',.62,.20,.22,.44,{wood:true,color:'#cec7aa'}),door(.89,.06,{wood:true,color:'#c9c1a5'})],signs:[sign(.24,.09,.23,.10,'VENDO',{ink:'#8e9c99'})]}),
];

// Enriquecer as faces observadas, preservando a planta e a face da outra rua.
export function withJulhoWestCorner(b){
  if(b.id==='as-sobrado-crefisa')return {...b,crossFacade:{...b.crossFacade,street,point:12,photoDirection:1,refs:[[10,2],[11,1],[12,1]],detail:'jl-crefisa-yard',signs:[sign(.02,.43,.45,.13,'crefisa',{color:'#315988',ink:'#e3e4d4'})],openings:[o('shutter',.04,.20,0,.35,{color:'#57769b'}),o('door',.28,.16,0,.35,{glass:true,color:'#607b6f'}),o('gate',.54,.43,0,.39,{grille:'vertical',bars:'#aebbb4',solid:.12,color:'#5d6b5c'}),o('porch',.03,.40,.61,.31,{grille:'horizontal',bars:'#e0e3cf',color:'#8d8066'}),o('window',.60,.13,.62,.24,{grille:'horizontal',color:'#cbd1c2'}),o('window',.81,.13,.62,.24,{grille:'horizontal',color:'#cbd1c2'})]}};
  if(b.id==='as-centro-odontologico'){
    const local={...b.local,street,point:12,photoDirection:5,refs:[[10,4],[11,5],[12,5],[13,6]],roof:'tile',detail:'jl-ceo-side',openings:[door(.04,.15,{grille:'vertical',color:'#718170',h:.52}),...[.33,.48,.62,.76,.89].map(u=>o('window',u,.045,.52,.12,{color:'#425747',grille:'square'}))],signs:[sign(.04,.05,.58,.17,'Centro de Especialidades',{color:'#719859',ink:'#e6e7d5',sub:'Odontológicas'})],crossFacade:{face:'minY',street:'praca-alcebiades-silva',point:15,photoDirection:4,color:'#dadbd0',detail:'as-ceo',openings:b.local.openings,signs:b.local.signs}};
    return {...b,street,point:local.point,refs:local.refs,roof:local.roof,detail:local.detail,local};
  }
  if(b.id==='jl-uniodonto'){
    const local={...b.local,point:18,refs:[[9,8],[17,2],[18,1]],detail:'jl-uniodonto-return',openings:[door(.25,.57,{glass:true,color:'#748e85',h:.63})],signs:[sign(.01,.015,.98,.30,'CLÍNICA UNIODONTO',{color:'#4e6066',ink:'#dddcd0'})]};
    return {...b,local,point:18,refs:local.refs,detail:local.detail,openings:local.openings,signs:local.signs};
  }
  if(b.id==='jl-segundo-oficio'){
    const local={...b.local,point:18,refs:[[9,7],[18,5],[18,6]],detail:'jl-cartorio-return',openings:[door(.11,.30,{glass:true,color:'#60796d',h:.63}),o('shutter',.59,.30,0,.63,{color:'#c8cdc0'})],signs:[]};
    return {...b,local,point:18,refs:local.refs,detail:local.detail,openings:local.openings,signs:local.signs};
  }
  return b;
}
export const julhoWestPoles=[{x:-1770,y:-95-R.halfWidth-15,height:158},{x:-1435,y:-95-R.halfWidth-15,height:157}].map(p=>({...p,street}));
export const julhoWestBikes=[-1720,-1655,-1590,-1535,-1480,-1410,-1345].map((x,i)=>({x,y:-95+R.halfWidth+10,color:i%2?'#a8493d':'#394b42'}));
export const julhoWestCars=[{x:-1800,y:-95-parkingOffset(R),color:'#485a65',seed:1201},{x:-1525,y:-95-parkingOffset(R),color:'#d6dace',seed:1202}];
export const julhoWestShrubs=[-1630,-1597,-1535,-1470].map((x,i)=>({x,y:-214,r:8+i%2*3}));
