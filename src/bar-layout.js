// Delimitação e interior fornecidos pelo usuário em Downloads/1.png.
// Os dois vãos abertos da fachada fotografada dão acesso ao mesmo salão.
export const BAR = {
  id:'bar-o-pericles', buildingId:'w15-fc-motos-yamaha', name:'Bar O Péricles',
  bounds:{x:-238,y:1887,w:158,h:331},
  doors:[{y:2018.38,w:31.382},{y:2097.94,w:31.382}],
  entry:{x:-105,y:2034}, exit:{x:-25,y:2034},
  owner:{x:-167,y:2198,name:'Péricles'},
  talkSpot:{x:-165,y:2149},
  greeting:'E aí meu chapa, o que vai querer?',
  tables:[1950,2027,2104].map(y=>({x:-201,y:y-18,w:74,h:36})),
  counter:{x:-233,y:2167,w:148,h:15},
};
export function insideBar(x,y) {return x<-79 && x>BAR.bounds.x && y>BAR.bounds.y && y<BAR.bounds.y+BAR.bounds.h;}
export const barWalkAreas=[
  {x:-233,y:1892,w:153,h:321},
  ...BAR.doors.map(d=>({x:-91,y:d.y,w:25,h:d.w})),
];
const wallSegments=[];
let from=BAR.bounds.y;
for(const door of BAR.doors){wallSegments.push({x:-84,y:from,w:5,h:door.y-from,id:'bar-front-wall'});from=door.y+door.w;}
wallSegments.push({x:-84,y:from,w:5,h:BAR.bounds.y+BAR.bounds.h-from,id:'bar-front-wall'});
export const barObstacles=[
  {x:-238,y:1846,w:158,h:41,id:'bar-south-neighbor'},
  {x:-238,y:2218,w:158,h:70,id:'bar-north-neighbor'},
  {x:-238,y:1887,w:5,h:331,id:'bar-back-wall'},
  {x:-238,y:1887,w:158,h:5,id:'bar-south-wall'},
  {x:-238,y:2213,w:158,h:5,id:'bar-north-wall'},
  ...wallSegments,
  ...BAR.tables.map(t=>({...t,id:'pool-table'})),
  {...BAR.counter,id:'bar-counter'},
  {...BAR.owner,r:7,id:'pericles'},
];
