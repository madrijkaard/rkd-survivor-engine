import { SIMEAO_ROAD, JULHO_PROFILE } from './road-profiles.js';
import { withPlaceName } from './place-names.js';

export const CINEMA_PLAZA=withPlaceName({id:'praca-do-cinema',placeType:'square',x:SIMEAO_ROAD.outerHalfWidth,y:-95+JULHO_PROFILE.outerHalfWidth,w:405-SIMEAO_ROAD.outerHalfWidth,h:492-JULHO_PROFILE.outerHalfWidth});
export const CINEMA_MONUMENT=withPlaceName({
  id:'cruzeiro-do-sul',placeType:'monument',x:210,y:Math.max(18,-95+JULHO_PROFILE.outerHalfWidth+41),r:29,height:128,tree:false,monument:true,
});
