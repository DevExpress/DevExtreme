import * as vue2Stategy from './strategy/vue2/index';
import * as vue3Stategy from './strategy/vue3/index';
import { isVue3 } from './version';

const strategy = isVue3() ? vue3Stategy : vue2Stategy;

export const { createComponent } = strategy;

export const { createConfigurationComponent } = strategy;

export const { createExtensionComponent } = strategy;
