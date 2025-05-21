import { describe, expect, it } from '@jest/globals';

import { getCurrentView } from './views';

describe('views utils', () => {
  describe('getCurrentView', () => {
    it('should return string', () => {
      expect(getCurrentView('agenda', ['agenda'])).toBe('agenda');
    });

    it('should return view by type', () => {
      expect(getCurrentView('agenda', ['month', { type: 'agenda' }])).toEqual({ type: 'agenda' });
    });

    it('should return view by name', () => {
      expect(getCurrentView('agenda', ['month', { type: 'agenda' }])).toEqual({ type: 'agenda' });
    });

    it('should return default view if it doesn\'t set', () => {
      expect(getCurrentView('agenda', ['month'])).toBe('agenda');
    });

    it('should return first view if nothing found', () => {
      expect(getCurrentView('agendaShort', ['agendaUnknown'] as any)).toBe('agendaUnknown');
    });
  });
});
