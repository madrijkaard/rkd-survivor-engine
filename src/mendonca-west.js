import { MENDONCA_ROAD, SIMEAO_ROAD, FERNANDO_PROFILE } from './road-profiles.js';
import { CROSS_Y } from './mendonca-data.js';
import { JULHO_END } from './julho-data.js';
import { parkingOffset } from './road-dimensions.js';
// All eight views of points 16–22: reference/streets/conego-mendonca/levantamento.md.
// Lot depths and heights are artistic estimates; corner buildings are reused.
export const MENDONCA_WEST_WALK={x:JULHO_END.x,y:CROSS_Y-MENDONCA_ROAD.outerHalfWidth,w:-JULHO_END.x,h:MENDONCA_ROAD.totalWidth};
export const MENDONCA_WEST_PAVING={...MENDONCA_WEST_WALK,x:JULHO_END.x+FERNANDO_PROFILE.outerHalfWidth,w:-JULHO_END.x-FERNANDO_PROFILE.outerHalfWidth-SIMEAO_ROAD.outerHalfWidth};
const o=(kind,u,w,bottom,h,extra={})=>({kind,u,w,bottom,h,...extra});
const door=(u,w,extra={})=>o('door',u,w,0,.74,extra);
const win=(u,w,extra={})=>o('window',u,w,.31,.40,extra);
const gate=(u,w,extra={})=>o('gate',u,w,0,.76,extra);
const sign=(u,top,w,h,text,extra={})=>({u,top,w,h,text,...extra});
function front(id,side,start,end,data){
  const depth=data.depth??155;
  const local={id,side:side==='north'?'west':'east',x:side==='north'?-MENDONCA_ROAD.outerHalfWidth-depth:MENDONCA_ROAD.outerHalfWidth,y:start,depth,length:end-start,height:60,roof:'hidden-tile',color:'#d7cdb5',base:'#a9a58e',baseHeight:0,wear:.45,openings:[],signs:[],photoDirection:side==='north'?1:5,...data};
  return {...local,street:'conego-mendonca',axis:'x',originY:CROSS_Y,local,x:start,y:CROSS_Y-local.x-local.depth,depth:end-start,length:local.depth};
}
export const mendoncaWestBuildings=[
  front('cm-o-garagem-203','south',-330,-262,{point:17,refs:[[16,6],[17,5],[18,4]],name:'Garagem 203 de metal marrom',residential:false,height:48,roof:'flat',color:'#d1cbb6',openings:[gate(.10,.75,{solid:1,color:'#786947',grille:'vertical'})],signs:[sign(.85,.25,.14,.10,'203',{ink:'#626653'})]}),
  front('cm-o-casa-grades','south',-445,-330,{point:18,refs:[[17,5],[18,4]],name:'Casa branca com grades escuras ornamentadas',roof:'flat',color:'#dddcd0',openings:[door(.06,.16,{grille:'scroll',bars:'#414d40',wood:true}),win(.43,.19,{grille:'diamond',bars:'#485144',wood:true}),win(.74,.18,{grille:'diamond',bars:'#485144',wood:true})]}),
  front('cm-o-casa-223','south',-520,-445,{point:18,refs:[[18,5],[19,4]],name:'Casa branca 223, janela de madeira e grade vertical',height:57,roof:'flat',color:'#dbdbcf',openings:[door(.08,.18,{grille:'scroll',bars:'#464c40',wood:true}),win(.46,.43,{wood:true,color:'#75613e',grille:'vertical',bars:'#4c5545'})],signs:[sign(.30,.28,.13,.08,'223',{ink:'#59604e'})]}),
  front('cm-o-muro-amarelo','north',-550,-390,{point:18,refs:[[17,8],[18,1],[19,2]],name:'Muro amarelo e garagem branca',residential:false,height:70,roof:'courtyard',color:'#cbb259',detail:'cm-o-yellow-wall',openings:[gate(.72,.26,{solid:1,color:'#d3d7c8',h:.59})]}),
  front('cm-o-portao-coberto','north',-620,-550,{point:19,refs:[[18,8],[19,1],[20,2]],name:'Portão branco sob cobertura metálica',residential:false,height:49,roof:'shed',roofColor:'#929a93',color:'#c8c4b0',detail:'cm-o-canopy',openings:[gate(.03,.94,{solid:.47,grille:'diagonal',bars:'#e1e3d5',color:'#d9dbcc',h:.89})]}),
  front('cm-o-fachada-verde','north',-685,-620,{point:20,refs:[[19,1],[20,2]],name:'Fachada verde de porta de enrolar branca',residential:false,height:67,roof:'flat',color:'#81a57c',pattern:'small-tile',openings:[o('shutter',.23,.67,0,.72,{color:'#dce1d0'})]}),
  front('cm-o-xicos-pratos','north',-790,-685,{point:20,refs:[[19,8],[20,1],[21,2]],name:'Xico’s Pratos — Restaurante Self Service',residential:false,height:96,roof:'flat',color:'#c6a448',pattern:'small-tile',openings:[gate(.04,.44,{grille:'diamond',bars:'#ecead9',color:'#424b3a',h:.61}),o('shutter',.57,.39,0,.60,{color:'#dedfca'}),o('window',.13,.28,.82,.15,{grille:'vertical',bars:'#434d39',color:'#535a41'})],signs:[sign(.02,.21,.96,.17,'XICO’S PRATOS',{color:'#e9e7d5',ink:'#464a38',sub:'Restaurante Self Service'})]}),
  front('cm-o-sobrado-254','north',-938,-790,{point:21,refs:[[20,8],[21,1],[22,2]],name:'Sobrado 254 com varandas de vidro e revestimento amadeirado',height:120,roof:'tile',color:'#b4aa94',detail:'cm-o-balcony',openings:[gate(.04,.34,{solid:.7,grille:'horizontal',bars:'#dce1d4',color:'#d5dacd',h:.47}),door(.40,.15,{color:'#d5d9cd',grille:'horizontal',h:.47}),o('porch',.03,.44,.66,.28,{glass:true,grille:'horizontal',color:'#72887b',bars:'#bdc8b4'}),o('porch',.51,.46,.66,.28,{glass:true,grille:'horizontal',color:'#72887b',bars:'#bdc8b4'})],signs:[sign(.57,.58,.12,.06,'254',{ink:'#434c3c'})]}),
];
export function withMendoncaWestCorner(b){
  if(b.id==='corner-wall')return {...b,x:-390,depth:390-SIMEAO_ROAD.outerHalfWidth,crossFacade:{face:'minY',street:'conego-mendonca',point:17,photoDirection:1,refs:[[16,1],[17,1]],color:'#cdc8b2',detail:'cm-o-stone-wall',wear:.8,openings:[gate(.05,.30,{solid:.65,grille:'diagonal',bars:'#e1e2d2',color:'#c6c9bb',h:.85}),door(.73,.12,{solid:.6,grille:'diagonal',bars:'#dcdfd0',color:'#c5c9ba',h:.85})],signs:[sign(.60,.31,.09,.12,'220',{ink:'#4a5745'})]}};
  if(b.id==='w15-fc-motos-yamaha')return {...b,crossFacade:{face:'maxY',street:'conego-mendonca',point:16,photoDirection:5,refs:[[1,6],[16,5]],color:'#d3bd70',base:'#587483',baseHeight:.10,openings:[o('window',.13,.10,.67,.12,{grille:'horizontal',color:'#657263'}),o('shutter',.51,.19,0,.76,{color:'#57768a'}),o('shutter',.76,.19,0,.76,{color:'#57768a'})],signs:[sign(.47,.09,.50,.12,'BAR O PÉRICLES',{ink:'#64706a'})]}};
  if(b.id==='fc-centro-operario')return {...b,depth:-520-b.x,crossFacade:{face:'maxY',street:'conego-mendonca',point:20,photoDirection:5,refs:[[18,6],[19,5],[20,5],[21,5],[22,4]],color:'#e0ddc8',base:'#8c6550',baseHeight:.13,wear:.95,detail:'cm-o-centro-wing',openings:[o('porch',.005,.11,.19,.65,{grille:'scroll',bars:'#956446',color:'#807a58'}),...[.16,.25,.34,.43].map(u=>o('vent',u,.06,.69,.09,{grille:'horizontal',color:'#505741'})),...[.58,.72,.86].map(u=>win(u,.085,{wood:true,color:'#83553c',grille:'vertical',bars:'#865e43'}))],signs:[]}};
  if(b.id==='fc-agencia-trabalho')return {...b,crossFacade:{face:'minY',street:'conego-mendonca',point:22,photoDirection:1,refs:[[21,8],[22,1]],color:'#4d81a3',detail:'cm-o-agency',baseHeight:0,openings:[door(.05,.23,{glass:true,color:'#58766e'}),door(.36,.23,{glass:true,color:'#58766e'}),o('shutter',.68,.28,0,.70,{color:'#b9ccce'})],signs:[sign(.10,.11,.30,.18,'AGÊNCIA REGIONAL',{color:'#5c567d',ink:'#e1dfc8',sub:'DO TRABALHO'})]}};
  return b;
}
export const mendoncaWestPoles=[-400,-800].map((x,i)=>({x,y:CROSS_Y+MENDONCA_ROAD.outerHalfWidth-8,height:159-i*4,street:'conego-mendonca'}));
export const mendoncaWestCars=[-663,-855,-1020].map((x,i)=>({x,y:CROSS_Y+parkingOffset(MENDONCA_ROAD),axis:'x',color:['#a8afa6','#4c5351','#c1c4b7'][i],seed:901+i}));
export const mendoncaWestDescriptions={
  16:['A outra face do Péricles','A lateral creme e azul do bar fica diante do muro de pedra e das grades claras.'],
  17:['Garagem 203 e muro de pedra','Portão marrom e casas brancas do outro lado do muro de esquina.'],
  18:['As grades das casas brancas','Janelas de madeira, grades escuras e o portão branco do muro amarelo.'],
  19:['Portão coberto e fachada verde','A cobertura metálica encontra a loja verde, diante da ala antiga do Centro Operário.'],
  20:['Xico’s Pratos','O restaurante amarelo fica diante das janelas e do muro gasto do Centro Operário.'],
  21:['O sobrado de varandas','Vidro, revestimento amadeirado e a garagem branca junto à agência.'],
  22:['Cônego Mendonça × Fernando Carvalho','Centro Operário, Agência Regional do Trabalho e Clínica Sublime marcam a próxima esquina.'],
};
