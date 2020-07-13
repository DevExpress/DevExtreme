import './modules/parts/widgets-all';
import './modules/parts/viz';
import DevExpress from './modules/core';
import { EventsStrategy } from '../core/events_strategy';
import { Options } from '../core/options';

DevExpress.integration = {
    EventsStrategy,
    Options
};

export default DevExpress;
