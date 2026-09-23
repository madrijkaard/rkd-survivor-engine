// One footprint drives walls, roofs, baking bounds, shadows and collisions.
// Corner order: low-x/low-y, high-x/low-y, high-x/high-y, low-x/high-y.
export function buildingFootprint(b) {
  return b.footprint || [[b.x,b.y],[b.x+b.depth,b.y],[b.x+b.depth,b.y+b.length],[b.x,b.y+b.length]];
}
export function buildingPlanPoint(b,x,y) {
  if(!b.footprint)return {x,y};
  const [a,d,c,e]=b.footprint,u=(x-b.x)/b.depth,v=(y-b.y)/b.length;
  return {
    x:(1-v)*(a[0]+u*(d[0]-a[0]))+v*(e[0]+u*(c[0]-e[0])),
    y:(1-v)*(a[1]+u*(d[1]-a[1]))+v*(e[1]+u*(c[1]-e[1])),
  };
}
export function footprintBounds(polygon) {
  const xs=polygon.map(p=>p[0]),ys=polygon.map(p=>p[1]),x=Math.min(...xs),y=Math.min(...ys);
  return {x,y,w:Math.max(...xs)-x,h:Math.max(...ys)-y};
}
export function footprintObstacle(b) {
  if(!b.footprint)return {x:b.x,y:b.y,w:b.depth,h:b.length,id:b.id};
  return {...footprintBounds(b.footprint),polygon:b.footprint,id:b.id};
}
export function hitsFootprint(x,y,o,radius=0) {
  if(x<o.x-radius||x>o.x+o.w+radius||y<o.y-radius||y>o.y+o.h+radius)return false;
  let inside=false;
  const polygon=o.polygon;
  for(let i=0,j=polygon.length-1;i<polygon.length;j=i++) {
    const [ax,ay]=polygon[j],[bx,by]=polygon[i],dx=bx-ax,dy=by-ay;
    const t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy)));
    if(Math.hypot(x-ax-t*dx,y-ay-t*dy)<=radius)return true;
    if((ay>y)!==(by>y)&&x<(bx-ax)*(y-ay)/(by-ay)+ax)inside=!inside;
  }
  return inside;
}
