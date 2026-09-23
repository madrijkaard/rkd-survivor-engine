// Four genuine oblique projections of one connected world. Cameras expose
// both sides of either street without mirroring the finished background.
export const CAMERA_VIEWS = Object.freeze([
  Object.freeze({ id:'west-fronts', label:'Fachadas da esquerda', a:.94, b:.36, c:.34, d:-.70 }),
  Object.freeze({ id:'east-fronts', label:'Fachadas da direita', a:.94, b:-.56, c:-.42, d:-.70 }),
  Object.freeze({ id:'north-west-view', label:'Vista inversa · fachadas da direita', a:-.94, b:-.36, c:-.34, d:.70 }),
  Object.freeze({ id:'north-east-view', label:'Vista inversa · fachadas da esquerda', a:-.94, b:.56, c:.42, d:.70 }),
]);
let viewIndex = 0;
export let PROJECTION = CAMERA_VIEWS[0];
export function getCameraView() { return viewIndex; }
export function setCameraView(index) {
  if (!Number.isInteger(index) || !CAMERA_VIEWS[index]) throw new RangeError('Orientação de câmera inválida');
  viewIndex = index; PROJECTION = CAMERA_VIEWS[index];
}
// Baking is synchronous. Always restore the live camera, even on failure.
export function withCameraView(index, draw) {
  const previous = viewIndex;
  try { setCameraView(index); return draw(); }
  finally { setCameraView(previous); }
}
export function project(x, y, z = 0) {
  const {a,b,c,d} = PROJECTION;
  return {x:a*x+b*y+(PROJECTION.tx||0), y:c*x+d*y-z+(PROJECTION.ty||0)};
}
export function unproject(x, y) {
  const {a,b,c,d} = PROJECTION, det=a*d-b*c;
  x-=PROJECTION.tx||0;y-=PROJECTION.ty||0;
  return {x:(d*x-b*y)/det, y:(-c*x+a*y)/det};
}
// Rotate a transverse building's local plan without rotating the live world.
export function withCrossStreetFrame(originY,draw) {
  const previous=PROJECTION;
  const {a,b,c,d}=previous;
  PROJECTION={...previous,a:-b,b:a,c:-d,d:c,tx:b*originY,ty:d*originY};
  try{return draw();}finally{PROJECTION=previous;}
}
