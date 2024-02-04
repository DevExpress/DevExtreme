import { name, dblClick } from './dblclick_impl';
import registerEvent from './core/event_registrator';

registerEvent(name, dblClick);

export { name };
