import './modules/parts/widgets-web';
import './modules/parts/viz';
import { Clicker } from '../__internal/clicker';
import DevExpress from './modules/core';
import { EventsStrategy } from '../core/events_strategy';
import { Options } from '../core/options/index';

DevExpress.integration = {};

DevExpress.integration.EventsStrategy = EventsStrategy;
DevExpress.integration.Options = Options;
DevExpress.Clicker = Clicker;

export default DevExpress;
