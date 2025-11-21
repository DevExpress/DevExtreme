/* eslint-disable prefer-destructuring */
import eventsEngine from './m_events_engine';

export const on = eventsEngine.on;
export const one = eventsEngine.one;
export const off = eventsEngine.off;
export const trigger = eventsEngine.trigger;

export const Event = eventsEngine.Event;
