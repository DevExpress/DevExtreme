/**
 * @jest-environment jsdom
 */
import {
  afterEach, beforeAll, beforeEach, describe, expect, it,
} from '@jest/globals';

import { registerTrialPanelComponents, showTrialPanel } from './trial_panel';

describe('trial panel public API', () => {
  const buyNow = 'https://example.com/buy';
  const licensingDoc = 'https://example.com/docs';
  const version = '26.2.0';

  interface PanelInternals {
    _expired: boolean;
    _observer: MutationObserver | null;
  }

  const getPanel = (): HTMLElement => document.querySelector('dx-license') as HTMLElement;

  const getFirstSpan = (): HTMLElement => getPanel().querySelector('span') as HTMLElement;

  // The panel is put back after it is removed, unless the banner is closed:
  // close it while the page is cleared, so that every test creates its own panel
  const cleanup = (): void => {
    const panelClass = customElements.get('dx-license') as unknown as { closed: boolean } | undefined;

    document.querySelectorAll('dx-license').forEach((panel) => {
      if (!('_expired' in panel) || !('_observer' in panel)) {
        throw new Error('The private fields of the panel were renamed: update PanelInternals');
      }

      const internals = panel as unknown as PanelInternals;
      internals._expired = false;
      internals._observer?.disconnect();
    });

    if (panelClass) panelClass.closed = true;
    document.body.innerHTML = '';
    if (panelClass) panelClass.closed = false;
  };

  beforeAll(() => {
    expect(customElements.get('dx-license')).toBeUndefined();

    registerTrialPanelComponents({ textStyles: { color: 'yellow' } });
  });

  beforeEach(cleanup);

  afterEach(cleanup);

  it('registerTrialPanelComponents should define the panel and the trigger', () => {
    expect(customElements.get('dx-license')).toBeDefined();
    expect(customElements.get('dx-license-trigger')).toBeDefined();
  });

  it('should use the styles of the first registration for the banner', () => {
    showTrialPanel(buyNow, licensingDoc, version, 'Universal');

    expect(getFirstSpan().style.getPropertyValue('color')).toBe('yellow');
  });

  it('should ignore the styles of later registrations and of later calls', () => {
    registerTrialPanelComponents({ textStyles: { color: 'red' } });
    showTrialPanel(buyNow, licensingDoc, version, 'Universal', { textStyles: { color: 'blue' } });

    expect(getFirstSpan().style.getPropertyValue('color')).toBe('yellow');
  });

  it('should not apply the custom styles to the expired trial panel', () => {
    showTrialPanel(buyNow, licensingDoc, version, 'Universal', undefined, { trialExpired: true });

    expect(getPanel().getAttribute('trial-expired')).toBe('true');
    expect(getPanel().querySelector('span')?.style.getPropertyValue('color')).toBe('black');
  });
});
