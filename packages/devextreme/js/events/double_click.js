import { name, dblClick } from '../__internal/events/dblclick';
import registerEvent from './core/event_registrator';

registerEvent(name, dblClick);

export { name };
