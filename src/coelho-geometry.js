import { coelhoPoints } from './coelho-points.js';
import { JULHO_EAST } from './julho-east.js';
import { MENDONCA_END, CROSS_Y } from './mendonca-data.js';
import { COELHO_PROFILE as R } from './road-profiles.js';
export { coelhoPoints };
export const COELHO_START=coelhoPoints[0];
export const COELHO_END=coelhoPoints.at(-1);
export const COELHO_SLOPE=(MENDONCA_END-JULHO_EAST.x)/(CROSS_Y-JULHO_EAST.y);
const perpendicular=Math.hypot(1,COELHO_SLOPE);
export const coelhoCenter=y=>JULHO_EAST.x+(y-JULHO_EAST.y)*COELHO_SLOPE;
export const coelhoEdge=(y,offset)=>coelhoCenter(y)+offset*perpendicular;
export const onCoelhoRoad=(x,y)=>y>=COELHO_START.y&&y<=Math.max(CROSS_Y,COELHO_END.y)+20&&Math.abs(x-coelhoCenter(y))<=R.outerHalfWidth*perpendicular;
// A longitudinal face follows the same straight alignment as road and collision.
export function coelhoFootprint(side,start,end,depth,setback=0){
  const d=(side==='west'?-1:1)*(R.outerHalfWidth+setback),a=coelhoEdge(start,d),b=coelhoEdge(end,d);
  return side==='west'?[[a-depth,start],[a,start],[b,end],[b-depth,end]]:[[a,start],[a+depth,start],[b+depth,end],[b,end]];
}
