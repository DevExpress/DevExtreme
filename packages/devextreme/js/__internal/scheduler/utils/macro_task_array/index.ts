import dispatcher from './dispatcher';
import { macroTaskArrayForEach, macroTaskArrayMap } from './methods';

export default {
  forEach: macroTaskArrayForEach,
  map: macroTaskArrayMap,
  dispose: dispatcher.dispose,
};
