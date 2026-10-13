import { MENDONCA_ROAD, FERNANDO_PROFILE } from './road-profiles.js';
import { CROSS_Y, mendoncaPoints } from './mendonca-data.js';
import { JULHO_END } from './julho-data.js';
import { parkingOffset } from './road-dimensions.js';
// Points 23–31, all eight directions, June 2025. Dimensions/depths are artistic.
export const MENDONCA_WEST_END=mendoncaPoints.find(p=>p.id===31);
const end=MENDONCA_WEST_END.x,front=MENDONCA_ROAD.outerHalfWidth;
export const MENDONCA_PRACA_WALK={x:end-235,y:CROSS_Y-front,w:JULHO_END.x-end+235,h:MENDONCA_ROAD.totalWidth};
export const ALCEBIADES_MOUTH={x:end-front,y:CROSS_Y-300,w:MENDONCA_ROAD.totalWidth,h:300+MENDONCA_ROAD.halfWidth};
export const ALCEBIADES_CORNER={x:end-235,y:CROSS_Y-285,w:235-front,h:285-MENDONCA_ROAD.halfWidth};
export const MENDONCA_FIELD=[{x:-1750,y:1980,w:264,h:CROSS_Y-front-1980},{x:-1486,y:2180,w:180,h:CROSS_Y-front-2180}];
const o=(kind,u,w,bottom,h,extra={})=>({kind,u,w,bottom,h,...extra});
const door=(u,w,extra={})=>o('door',u,w,0,.75,extra);
const win=(u,w,extra={})=>o('window',u,w,.27,.46,extra);
const gate=(u,w,extra={})=>o('gate',u,w,0,.74,extra);
const sign=(u,top,w,h,text,extra={})=>({u,top,w,h,text,...extra});
function frontage(id,side,start,finish,data){
  const depth=data.depth??160;
  const local={id,side:side==='north'?'west':'east',x:side==='north'?-front-depth:front,y:start,depth,length:finish-start,height:64,roof:'flat',color:'#d6ccba',base:'#a8a48d',baseHeight:0,wear:.4,openings:[],signs:[],photoDirection:side==='north'?1:5,...data};
  return {...local,street:'conego-mendonca',axis:'x',originY:CROSS_Y,local,x:start,y:CROSS_Y-local.x-local.depth,depth:finish-start,length:depth};
}
export const mendoncaPracaBuildings=[
  frontage('cm-p-casa-314','north',-1785,-1645,{point:27,refs:[[25,8],[26,1],[27,1],[28,2]],name:'Casa 314, muro branco e portão vertical com palmeira no pátio',height:59,roof:'none',depth:170,detail:'cm-p-white-yard',color:'#d9d8cf',wear:.5,openings:[gate(.34,.28,{solid:.4,grille:'vertical',bars:'#aaa995',color:'#776e50',h:.88})],signs:[sign(.81,.35,.12,.08,'314',{ink:'#717b62'})]}),
  frontage('cm-p-casa-pedras','north',-1910,-1785,{point:29,refs:[[28,8],[29,1],[30,2]],name:'Casa de pedra rosada com janela gradeada branca e garagem cinza',height:65,color:'#c3ad9f',detail:'cm-p-pink-stone',openings:[win(.10,.48,{grille:'square',bars:'#dce0d1',color:'#a0a491'}),gate(.70,.27,{solid:.75,color:'#9ca89e',bars:'#839083',h:.68}),o('vent',.70,.27,.69,.17,{grille:'square',bars:'#c6c9b6',color:'#354d3e'})]}),
  frontage('cm-p-dr-claudio-paz','north',-2050,-1910,{point:30,refs:[[29,8],[30,1],[31,2]],name:'Dr. Cláudio Paz, fisioterapia, grades claras e rampa de acesso',residential:false,height:88,roof:'flat',color:'#d6dacf',wear:.13,detail:'cm-p-clinic-ramp',openings:[o('porch',.05,.90,0,.66,{grille:'vertical',bars:'#c4d0c2',color:'#6e8273',glass:true})],signs:[sign(.10,.08,.65,.22,'DR. CLÁUDIO PAZ',{color:'#cbd5c8',ink:'#456857',sub:'FISIOTERAPIA'})]}),
  frontage('cm-p-crea','north',-2300,-2050,{point:31,refs:[[30,8],[31,1],[31,2]],name:'CREA-MA, portal azul, entrada envidraçada e garagem lateral',residential:false,height:69,roof:'flat',color:'#d5d7cc',wear:.19,detail:'cm-p-crea',openings:[door(.10,.34,{glass:true,color:'#3b514a',h:.64}),o('shutter',.73,.23,0,.55,{color:'#e0e3d5'})],signs:[sign(.075,.10,.40,.19,'CREA-MA',{color:'#344c85',ink:'#e2e5d6',sub:'Conselho Regional de Engenharia'}),sign(.78,.47,.13,.07,'GARAGEM',{color:'#a6524b',ink:'#f0e9d8'}),sign(.04,.44,.055,.07,'334A',{ink:'#e0e3cc'})]}),
  // Opposite the captured intersection; the next block is not opened as a route.
  frontage('cm-p-girassol-center','north',end-235,-2300,{point:31,refs:[[31,1],[31,8]],name:'Girassol Center, portal amarelo e painel de estabelecimentos',residential:false,height:102,roof:'flat',color:'#d5d2b9',detail:'cm-p-girassol',wear:.15,openings:[o('door',.06,.40,0,.43,{glass:true,color:'#57715c'}),o('window',.53,.40,.09,.35,{glass:true,color:'#708675'})],signs:[sign(.02,.47,.96,.10,'Girassol Center',{color:'#40534b',ink:'#e0c052'})]}),
  frontage('cm-p-metalmar','south',end+front,-1750,{point:30,refs:[[27,6],[28,5],[29,5],[30,5],[31,3],[31,4]],name:'Metalmar, casa amarela antiga de esquina e ala de reboco gasto',residential:false,height:73,roof:'tile',depth:180,color:'#cdb681',base:'#987b62',baseHeight:.12,wear:1,detail:'cm-p-metalmar',openings:[...[.06,.20,.36,.69,.87].map(u=>win(u,.075,{wood:true,color:'#695b44',grille:'scroll',bars:'#514b3b',bottom:.13,h:.61})),o('bricked',.49,.14,0,.66,{color:'#aa7651'})],signs:[sign(.015,.015,.46,.09,'METALMAR',{ink:'#879281'}),sign(.475,.18,.17,.09,'METALMAR',{color:'#c9c9af',ink:'#879184'})],crossFacade:{face:'minY',street:'conego-mendonca',point:31,photoDirection:4,color:'#cdb681',wear:.85,detail:'cm-p-metalmar',openings:[o('shutter',.10,.27,0,.72,{color:'#b6c1b1'}),door(.64,.22,{grille:'scroll',bars:'#4a5140',color:'#686b52'})],signs:[sign(.05,.025,.90,.13,'METALMAR',{ink:'#788b7d'}),sign(.02,.29,.23,.08,'PRAÇA A. SILVA',{color:'#364f53',ink:'#d8dbbb'})]}}),
];
export function withMendoncaPracaCorner(b){
  if(b.id==='fc-clinica-sublime')return {...b,x:-1645,depth:JULHO_END.x-FERNANDO_PROFILE.outerHalfWidth+1645,crossFacade:{face:'minY',street:'conego-mendonca',point:25,photoDirection:1,refs:[[23,7],[24,1],[25,1],[26,2]],color:'#3f6592',baseHeight:0,wear:.16,detail:'cm-p-sublime',openings:[o('window',.02,.24,.13,.13,{glass:true,color:'#7f9688'}),door(.28,.07,{glass:true,h:.44}),o('window',.09,.17,.73,.07,{glass:true,color:'#3c5149'}),o('window',.38,.15,.73,.06,{glass:true,color:'#41534e'}),o('window',.47,.035,.16,.035,{glass:true}),o('window',.56,.20,.13,.14,{glass:true,color:'#8fa595'}),door(.82,.06,{glass:true,h:.39}),o('window',.91,.08,.16,.17,{glass:true,color:'#95a48c'}),o('window',.88,.10,.72,.16,{glass:true,color:'#a1b4aa'})],signs:[sign(.56,.27,.20,.21,'CLÍNICA',{ink:'#e2e4d2',sub:'SUBLIME'}),sign(.80,.43,.20,.11,'SUBLIME',{color:'#355e92',ink:'#e2e4d2'})]}};
  if(b.id==='fc-terreno-esquina')return {...b,x:-1750,depth:JULHO_END.x-FERNANDO_PROFILE.outerHalfWidth+1750,crossFacade:{face:'maxY',street:'conego-mendonca',point:26,photoDirection:5,refs:[[23,6],[24,5],[25,5],[26,5],[27,4],[28,4]],color:'#d2d1b6',baseHeight:0,wear:1,detail:'cm-p-field-wall',openings:[],signs:[sign(.79,.23,.18,.30,'DROGAS',{ink:'#93a8aa'})]}};
  return b;
}
export const mendoncaPracaTrees=[
  {x:-1718,y:CROSS_Y+170,size:42,height:123,kind:'palm',seed:961},
  {x:-1434,y:CROSS_Y+100,size:25,height:47,kind:'palm',seed:962},
  {x:end-172,y:CROSS_Y-175,size:82,height:99,spreading:true,seed:963},
];
export const mendoncaPracaShrubs=[{x:-1700,y:CROSS_Y+130,r:25},{x:-1380,y:CROSS_Y+99,r:13},{x:-1480,y:CROSS_Y+100,r:10}];
export const mendoncaPracaPoles=[-1350,-1790,-2220].map((x,i)=>({x,y:CROSS_Y+front-8,height:154+i*3,street:'conego-mendonca'}));
export const mendoncaPracaCars=[{x:-1580,y:CROSS_Y+parkingOffset(MENDONCA_ROAD),color:'#454d4b',seed:967,axis:'x'},{x:-1800,y:CROSS_Y+parkingOffset(MENDONCA_ROAD),color:'#d3d8cf',seed:968,axis:'x'}];
export const mendoncaPracaBikes=[{x:-1368,y:CROSS_Y+83},{x:-1950,y:CROSS_Y+83},{x:-2240,y:CROSS_Y+83},{x:end-154,y:CROSS_Y-115}];
export const mendoncaPracaDescriptions={
  23:['Além da Fernando Carvalho','A Clínica Sublime e o terreno murado marcam a continuação para oeste.'],
  24:['A frente da Clínica Sublime','Azul, vidro e revestimento cinza diante do terreno de muro branco.'],
  25:['O painel azul da clínica','A fachada comprida acompanha a rua; o terreno permanece aberto atrás do muro.'],
  26:['O muro e a palmeira','Casa de muro branco e portão vertical; do outro lado, tijolos expostos e vegetação.'],
  27:['A casa 314','Uma palmeira se ergue atrás do muro, perto da ala antiga da Metalmar.'],
  28:['Pedras rosadas e reboco antigo','Janela gradeada e garagem cinza diante da parede desgastada.'],
  29:['Aberturas antigas','Grades, venezianas e porta vedada com tijolos na Metalmar; a clínica de fisioterapia aparece adiante.'],
  30:['Dr. Cláudio Paz','Grades claras e rampa de acesso, junto à garagem e ao CREA-MA.'],
  31:['Praça Alcebíades Silva','A esquina da Metalmar abre para a praça arborizada, em frente ao CREA-MA e Girassol Center.'],
};
