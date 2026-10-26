/**
 * @jest-environment jsdom
 */
import {
  afterEach, beforeAll, describe, expect, it,
} from '@jest/globals';

import { registerTrialPanelComponents, showTrialPanel } from './trial_panel';

describe('trial panel public API', () => {
  const getPanel = (): HTMLElement => document.querySelector('dx-license') as HTMLElement;

  const getFirstSpan = (): HTMLElement => getPanel().querySelector('span') as HTMLElement;

  beforeAll(() => {
    expect(customElements.get('dx-license')).toBeUndefined();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('registerTrialPanelComponents should define the panel and the trigger', () => {
    registerTrialPanelComponents({ textStyles: { color: 'yellow' } });

    expect(customElements.get('dx-license')).toBeDefined();
    expect(customElements.get('dx-license-trigger')).toBeDefined();
  });

  it('should use the styles of the first registration for the banner', () => {
    showTrialPanel('https://example.com/buy', 'https://example.com/docs', '26.2.0', 'Universal');

    expect(getFirstSpan().style.getPropertyValue('color')).toBe('yellow');
  });

  it('should ignore the styles of later registrations and of later calls', () => {
    registerTrialPanelComponents({ textStyles: { color: 'red' } });
    showTrialPanel('https://example.com/buy', 'https://example.com/docs', '26.2.0', 'Universal', { textStyles: { color: 'blue' } });

    expect(getFirstSpan().style.getPropertyValue('color')).toBe('yellow');
  });

  it('should not apply the custom styles to the expired trial panel', () => {
    showTrialPanel('https://example.com/buy', 'https://example.com/docs', '26.2.0', 'Universal', undefined, { trialExpired: true });

    expect(getPanel().getAttribute('trial-expired')).toBe('true');
    expect(getPanel().querySelector('span')?.style.getPropertyValue('color')).toBe('black');
  });
});
