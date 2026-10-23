/**
 * @jest-environment jsdom
 */
import {
  beforeEach, describe, expect, it,
} from '@jest/globals';

import { showTrialPanel } from './trial_panel';
import { registerCustomComponents, renderTrialPanel } from './trial_panel.client';

describe('trial panel client', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should not display subscription text when subscriptions parameter is empty string', () => {
    renderTrialPanel(
      'https://example.com/buy',
      'https://example.com/docs',
      '25.2.0',
      '',
    );

    const triggerElement = document.querySelector('dx-license-trigger');
    expect(triggerElement).not.toBeNull();

    const panelElement = document.querySelector('dx-license');
    if (panelElement) {
      const text = panelElement.textContent ?? '';
      expect(text).not.toContain('Included in Subscriptions:');
    }
  });

  it('should set subscriptions attribute when parameter is a valid string', () => {
    renderTrialPanel(
      'https://example.com/buy',
      'https://example.com/docs',
      '25.2.0',
      'Universal, DXperience',
    );

    const triggerElement = document.querySelector('dx-license-trigger');
    expect(triggerElement).not.toBeNull();

    const subscriptionsAttr = triggerElement?.getAttribute('subscriptions');
    expect(subscriptionsAttr).toBe('Universal, DXperience');
  });

  it('should not display subscription text when subscriptions parameter is actual null', () => {
    renderTrialPanel(
      'https://example.com/buy',
      'https://example.com/docs',
      '25.2.0',
      null as any, // Actual null value
    );

    const triggerElement = document.querySelector('dx-license-trigger');
    expect(triggerElement).not.toBeNull();

    // When null is passed, it gets converted to string "null" as HTML attribute
    const subscriptionsAttr = triggerElement?.getAttribute('subscriptions');
    expect(subscriptionsAttr).toBe('');

    // Ensure the panel element doesn't show "Included in Subscriptions: null"
    // This is the key test - our fix should prevent displaying "null"
    const panelElement = document.querySelector('dx-license');
    if (panelElement) {
      const text = panelElement.textContent ?? '';
      expect(text).not.toContain('Included in Subscriptions: null');
    }
  });
});

describe('trial panel client: options (trialExpired, libraries)', () => {
  const buyNow = 'https://example.com/buy';
  const licensingDoc = 'https://example.com/docs';
  const version = '26.2.0';
  const closeButtonSelector = 'svg#Layer_1';

  const getPanel = (): HTMLElement => document.querySelector('dx-license') as HTMLElement;

  const hasCloseButton = (panel: HTMLElement): boolean => (
    panel.querySelector(closeButtonSelector) != null
  );

  // jsdom does not implement innerText: it is a plain property, so textContent is empty
  const getText = (panel: HTMLElement): string => Array.from(panel.querySelectorAll('span, a'))
    .map((element) => (element as HTMLElement).innerText)
    .join('');

  const flushObserver = async (): Promise<void> => {
    await Promise.resolve();
    await Promise.resolve();
  };

  const setClosed = (value: boolean): void => {
    (customElements.get('dx-license') as unknown as { closed: boolean }).closed = value;
  };

  const addTrigger = (attributes: Record<string, string> = {}): HTMLElement => {
    const trigger = document.createElement('dx-license-trigger');
    trigger.setAttribute('buy-now', buyNow);
    trigger.setAttribute('licensing-doc', licensingDoc);
    trigger.setAttribute('version', version);
    Object.entries(attributes).forEach(([name, value]) => trigger.setAttribute(name, value));
    document.body.appendChild(trigger);
    return trigger;
  };

  const closeBanner = async (): Promise<void> => {
    const closeButtonIcon = getPanel().querySelector(closeButtonSelector);
    (closeButtonIcon?.parentElement as HTMLElement).click();
    // the observer reacts to the closing before anything else happens
    await flushObserver();
  };

  beforeEach(() => {
    registerCustomComponents();
    // A removed panel is returned to the page (an expired one always, a trial one unless it was
    // closed), so the panel of the previous test is downgraded and closed before the cleanup.
    document.querySelectorAll('dx-license').forEach((panel) => panel.removeAttribute('trial-expired'));
    setClosed(true);
    document.body.innerHTML = '';
    setClosed(false);
  });

  describe('contract', () => {
    it.each([
      ['no options', undefined],
      ['trialExpired: false', { trialExpired: false }],
    ])('should not change the banner (%s)', (_, options) => {
      renderTrialPanel(buyNow, licensingDoc, version, 'Universal', undefined, options);

      expect(document.querySelector('dx-license-trigger')?.hasAttribute('trial-expired')).toBe(false);
      expect(getPanel().hasAttribute('trial-expired')).toBe(false);
      expect(hasCloseButton(getPanel())).toBe(true);
    });

    it.each(['false', '', '1'])('should treat the markup value "%s" as a trial that is not expired', (value) => {
      addTrigger({ 'trial-expired': value });

      expect(hasCloseButton(getPanel())).toBe(true);
    });

    it('should not restore a closed banner', async () => {
      addTrigger();
      await closeBanner();

      getPanel().innerHTML = '';
      await flushObserver();

      expect(getPanel().innerHTML).toBe('');
      expect(getPanel().style.getPropertyValue('display')).toBe('none');
    });

    it('should pass the options to the trigger and the panel', () => {
      showTrialPanel(buyNow, licensingDoc, version, 'Universal', undefined, {
        trialExpired: true,
        libraries: 'DevExtreme',
      });

      const trigger = document.querySelector('dx-license-trigger') as HTMLElement;
      expect(trigger.getAttribute('trial-expired')).toBe('true');
      expect(trigger.getAttribute('libraries')).toBe('DevExtreme');
      expect(getPanel().getAttribute('trial-expired')).toBe('true');
      expect(getPanel().getAttribute('libraries')).toBe('DevExtreme');
    });
  });

  describe('expired trial panel', () => {
    it('should cover the page and have no close button', () => {
      addTrigger({ 'trial-expired': 'true' });

      expect(getPanel().style.getPropertyValue('position')).toBe('fixed');
      expect(hasCloseButton(getPanel())).toBe(false);
    });

    it('should scroll and center the content so that tall content is not cut off at the top', () => {
      addTrigger({ 'trial-expired': 'true' });

      expect(getPanel().style.getPropertyValue('overflow')).toBe('auto');
      expect((getPanel().firstElementChild as HTMLElement).style.getPropertyValue('margin')).toBe('auto');
    });

    it('should show the title and the links', () => {
      addTrigger({ 'trial-expired': 'true' });

      const text = getText(getPanel());
      expect(text).toContain('Your 30-day trial has expired (v26.2.0).');
      expect(text).toContain('Use and Redistribution prohibited.');
      expect(text).toContain('Please register a valid license or purchase a new license to continue');
      expect(Array.from(getPanel().querySelectorAll('a')).map((link) => link.innerText))
        .toEqual(['register', 'purchase a new license']);
      expect(getPanel().querySelector(`a[href="${licensingDoc}"]`)).not.toBeNull();
      expect(getPanel().querySelector(`a[href="${buyNow}"]`)).not.toBeNull();
    });

    it.each([
      ['DevExtreme', 'Universal, DXperience', 'libraries: DevExtreme - Included in Subscriptions: Universal, DXperience.'],
      ['DevExtreme', undefined, 'libraries: DevExtreme.'],
      [undefined, 'Universal', 'use of DevExpress product libraries. Included in Subscriptions: Universal.'],
      [undefined, undefined, 'use of DevExpress product libraries.'],
    ])('should end the text with the libraries %s and the subscriptions %s', (libraries, subscriptions, expected) => {
      const attributes: Record<string, string> = { 'trial-expired': 'true' };
      if (libraries) attributes.libraries = libraries;
      if (subscriptions) attributes.subscriptions = subscriptions;

      addTrigger(attributes);

      expect(getText(getPanel())).toContain(expected);
    });

    it('should return to the page if it was removed, even if a banner was closed before', async () => {
      addTrigger({ 'trial-expired': 'true' });
      setClosed(true);

      getPanel().remove();
      await flushObserver();

      expect(getPanel().getAttribute('trial-expired')).toBe('true');
    });
  });

  describe('trial expired overrides trial', () => {
    it('should switch the existing banner and keep a single panel', () => {
      addTrigger();
      const panel = getPanel();

      addTrigger({ 'trial-expired': 'true' });

      expect(document.querySelectorAll('dx-license')).toHaveLength(1);
      expect(getPanel()).toBe(panel);
      expect(panel.getAttribute('trial-expired')).toBe('true');
      expect(hasCloseButton(panel)).toBe(false);
    });

    it('should not switch the panel back when a trigger without trial-expired arrives later', () => {
      addTrigger({ 'trial-expired': 'true' });

      addTrigger();

      expect(getPanel().getAttribute('trial-expired')).toBe('true');
      expect(hasCloseButton(getPanel())).toBe(false);
    });

    it('should show the expired panel even if the banner was closed before', async () => {
      addTrigger();
      await closeBanner();
      expect(getPanel().style.getPropertyValue('display')).toBe('none');

      addTrigger({ 'trial-expired': 'true' });

      expect(getPanel().getAttribute('trial-expired')).toBe('true');
      expect(getPanel().style.getPropertyValue('display')).not.toBe('none');
    });

    it('should keep protecting the expired panel that replaced a closed banner', async () => {
      addTrigger();
      await closeBanner();
      addTrigger({ 'trial-expired': 'true' });

      getPanel().innerHTML = '';
      getPanel().style.cssText = 'display: none';
      await flushObserver();

      expect(getText(getPanel())).toContain('Your 30-day trial has expired');
      expect(getPanel().style.getPropertyValue('display')).not.toBe('none');
    });

    it('should take the libraries from the trigger that switches the banner', () => {
      addTrigger();

      addTrigger({ 'trial-expired': 'true', libraries: 'DevExtreme', subscriptions: 'Universal' });

      expect(getText(getPanel())).toContain('libraries: DevExtreme - Included in Subscriptions: Universal.');
    });

    it('should keep the libraries of the first expired trigger', () => {
      addTrigger({ 'trial-expired': 'true', libraries: 'First' });

      addTrigger({ 'trial-expired': 'true', libraries: 'Second' });

      expect(getText(getPanel())).toContain('libraries: First');
      expect(getText(getPanel())).not.toContain('Second');
    });

    it('should add the subscriptions of a later trigger to the text', () => {
      addTrigger({ 'trial-expired': 'true', libraries: 'DevExtreme' });

      addTrigger({ subscriptions: 'Universal' });

      expect(getText(getPanel())).toContain('libraries: DevExtreme - Included in Subscriptions: Universal.');
    });
  });
});
