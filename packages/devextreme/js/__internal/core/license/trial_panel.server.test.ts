/**
 * @jest-environment node
 */
import {
  afterEach, describe, expect, it,
} from '@jest/globals';

import { registerTrialPanelComponents, showTrialPanel } from './trial_panel';

describe('trial panel on the server', () => {
  const show = (): void => showTrialPanel(
    'https://example.com/buy',
    'https://example.com/docs',
    '26.2.0',
    'Universal',
    undefined,
    {
      trialExpired: true, libraries: 'DevExtreme', licenseId: 'ABC123', licenseSource: 'File (x)',
    },
  );

  afterEach(() => {
    // @ts-expect-error removing the mock
    delete global.HTMLElement;
    // @ts-expect-error removing the mock
    delete global.customElements;
  });

  it('should not throw and should not use the document', () => {
    expect(typeof document).toBe('undefined');
    expect(show).not.toThrow();
    expect(() => registerTrialPanelComponents()).not.toThrow();
    expect(() => registerTrialPanelComponents({ textStyles: { color: 'red' } })).not.toThrow();
  });

  it('should not do anything in Angular, where HTMLElement is mocked and custom elements are not available', () => {
    // @ts-expect-error mocking HTMLElement with a symbol
    global.HTMLElement = Symbol('HTMLElement mock');

    expect(show).not.toThrow();
    expect(() => registerTrialPanelComponents()).not.toThrow();
  });

  it('should not do anything when only custom elements are mocked', () => {
    // @ts-expect-error mocking custom elements
    global.customElements = {};

    expect(show).not.toThrow();
    expect(() => registerTrialPanelComponents()).not.toThrow();
  });
});
