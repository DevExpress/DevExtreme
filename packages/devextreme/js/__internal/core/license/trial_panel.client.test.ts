/**
 * @jest-environment jsdom
 */
import {
  afterEach, beforeEach, describe, expect, it,
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
    await flushObserver();
  };

  interface PanelInternals {
    _expired: boolean;
    _observer: MutationObserver | null;
  }

  const cleanup = (): void => {
    document.querySelectorAll('dx-license').forEach((panel) => {
      if (!('_expired' in panel) || !('_observer' in panel)) {
        throw new Error('The private fields of the panel were renamed: update PanelInternals');
      }

      const internals = panel as unknown as PanelInternals;

      internals._expired = false;
      internals._observer?.disconnect();
    });
    setClosed(true);
    document.body.innerHTML = '';
    setClosed(false);
  };

  beforeEach(() => {
    registerCustomComponents();
    cleanup();
  });

  afterEach(cleanup);

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

    it.each(['false', '0', 'true', 'yes', 1, 0])('should not make the overlay by the JS option trialExpired: %p (only true does)', (value) => {
      renderTrialPanel(buyNow, licensingDoc, version, 'Universal', undefined, {
        trialExpired: value as unknown as boolean,
      });

      expect(document.querySelector('dx-license-trigger')?.hasAttribute('trial-expired')).toBe(false);
      expect(hasCloseButton(getPanel())).toBe(true);
    });

    it.each(['false', '', '1'])('should treat the markup value "%s" as a trial that is not expired', (value) => {
      addTrigger({ 'trial-expired': value });

      expect(hasCloseButton(getPanel())).toBe(true);
    });

    it.each(['true', 'True', 'TRUE', ' true ', 'tRuE'])('should treat the markup value "%s" as an expired trial', (value) => {
      addTrigger({ 'trial-expired': value });

      expect(hasCloseButton(getPanel())).toBe(false);
      expect(getText(getPanel())).toContain('Your 30-day trial has expired');
    });

    it('should switch an existing banner by a trigger with the value "True"', () => {
      addTrigger();

      addTrigger({ 'trial-expired': 'True' });

      expect(hasCloseButton(getPanel())).toBe(false);
      expect(getText(getPanel())).toContain('Your 30-day trial has expired');
    });

    it.each(['yes', '0', 'truee', 'true false'])('should not treat the markup value "%s" as an expired trial', (value) => {
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

    it('should stay an overlay when the trial-expired attribute of the panel is removed', async () => {
      addTrigger({ 'trial-expired': 'true' });

      getPanel().removeAttribute('trial-expired');
      await flushObserver();

      expect(hasCloseButton(getPanel())).toBe(false);
      expect(getPanel().style.getPropertyValue('position')).toBe('fixed');
    });

    it('should keep the layout of the overlay against the styles of the page', () => {
      addTrigger({ 'trial-expired': 'true' });

      const { style } = getPanel();
      const pinned: Record<string, string> = {
        position: 'fixed',
        width: 'auto',
        height: 'auto',
        'max-width': 'none',
        'max-height': 'none',
        'z-index': '99999',
        transform: 'none',
        margin: '0px',
        'box-sizing': 'border-box',
      };
      Object.entries(pinned).forEach(([property, value]) => {
        expect(style.getPropertyValue(property)).toBe(value);
        expect(style.getPropertyPriority(property)).toBe('important');
      });
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

    it('should take all the data of the overlay from the trigger that shows it', () => {
      addTrigger({
        'buy-now': 'https://buy/A',
        'licensing-doc': 'https://doc/A',
        version: '26.2.0',
        subscriptions: 'Universal, BannerOnly',
        libraries: 'InTrial',
      });

      addTrigger({
        'trial-expired': 'true',
        'buy-now': 'https://buy/B',
        'licensing-doc': 'https://doc/B',
        version: '26.2.1',
        subscriptions: 'Universal, Reporting',
        libraries: 'Expired',
      });

      const text = getText(getPanel());
      expect(text).toContain('(v26.2.1)');
      expect(text).toContain('libraries: Expired - Included in Subscriptions: Universal, Reporting.');
      expect(text).not.toContain('InTrial');
      expect(text).not.toContain('BannerOnly');
      expect(getPanel().querySelector('a[href="https://doc/B"]')).not.toBeNull();
      expect(getPanel().querySelector('a[href="https://buy/B"]')).not.toBeNull();
      expect(getPanel().querySelector('a[href="https://doc/A"]')).toBeNull();
    });

    it('should not keep the libraries of the banner when the expired trigger has none', () => {
      addTrigger({ libraries: 'InTrial' });

      addTrigger({ 'trial-expired': 'true' });

      expect(getText(getPanel())).toContain('use of DevExpress product libraries.');
      expect(getText(getPanel())).not.toContain('InTrial');
    });

    it('should keep the libraries of the first expired trigger', () => {
      addTrigger({ 'trial-expired': 'true', libraries: 'First' });

      addTrigger({ 'trial-expired': 'true', libraries: 'Second' });

      expect(getText(getPanel())).toContain('libraries: First');
      expect(getText(getPanel())).not.toContain('Second');
    });

    it('should not change the overlay by later triggers', () => {
      addTrigger({ 'trial-expired': 'true', libraries: 'First', subscriptions: 'Universal, DXperience' });

      addTrigger({ subscriptions: 'Universal' });
      addTrigger({ 'trial-expired': 'true', libraries: 'Second', subscriptions: 'Other' });

      expect(getText(getPanel())).toContain('libraries: First - Included in Subscriptions: Universal, DXperience.');
    });
  });
  describe('license id and license source', () => {
    it('should pass them to the trigger and the panel and not set them when they are not passed', () => {
      showTrialPanel(buyNow, licensingDoc, version, 'Universal', undefined, {
        licenseId: 'ABC123',
        licenseSource: 'File (c:\\devexpress_license.txt)',
      });

      const trigger = document.querySelector('dx-license-trigger') as HTMLElement;
      expect(trigger.getAttribute('license-id')).toBe('ABC123');
      expect(trigger.getAttribute('license-source')).toBe('File (c:\\devexpress_license.txt)');
      expect(getPanel().getAttribute('license-id')).toBe('ABC123');

      cleanup();
      showTrialPanel(buyNow, licensingDoc, version, 'Universal', undefined, {
        licenseId: undefined,
        licenseSource: null,
      });

      const plainTrigger = document.querySelector('dx-license-trigger') as HTMLElement;
      expect(plainTrigger.hasAttribute('license-id')).toBe(false);
      expect(plainTrigger.hasAttribute('license-source')).toBe(false);
      expect(getText(getPanel())).not.toContain('License ID');
    });

    describe.each([
      ['banner', undefined],
      ['expired trial panel', { trialExpired: true }],
    ])('empty values (%s)', (_, extraOptions) => {
      it.each([[''], [null], [undefined]])('should not set or render the value %p', (value) => {
        showTrialPanel(buyNow, licensingDoc, version, 'Universal', undefined, {
          ...extraOptions,
          licenseId: value,
          licenseSource: value,
        });

        const trigger = document.querySelector('dx-license-trigger') as HTMLElement;
        expect(trigger.hasAttribute('license-id')).toBe(false);
        expect(trigger.hasAttribute('license-source')).toBe(false);
        expect(getPanel().hasAttribute('license-id')).toBe(false);
        expect(getPanel().hasAttribute('license-source')).toBe(false);
        expect(getText(getPanel())).not.toContain('License');
      });

      it('should not render empty attributes of the markup', () => {
        addTrigger({
          ...(extraOptions ? { 'trial-expired': 'true' } : {}),
          subscriptions: 'Universal',
          'license-id': '',
          'license-source': '',
        });

        expect(getText(getPanel())).toContain('Included in Subscriptions: Universal');
        expect(getText(getPanel())).not.toContain('License');
      });
    });

    describe('banner', () => {
      it('should show them after the subscriptions', () => {
        addTrigger({ subscriptions: 'Universal', 'license-id': 'ABC123', 'license-source': 'File (x)' });

        expect(getText(getPanel())).toContain('Included in Subscriptions: Universal. License ID: ABC123. License Source: File (x)');
      });

      it('should show the license id when there are no subscriptions', () => {
        addTrigger({ 'license-id': 'ABC123' });

        expect(getText(getPanel())).toContain('(v26.2.0). License ID: ABC123.');
        expect(getText(getPanel())).not.toContain('Included in Subscriptions');
      });

      it('should show the license source without the license id', () => {
        addTrigger({ subscriptions: 'Universal', 'license-source': 'File (x)' });

        expect(getText(getPanel())).toContain('Included in Subscriptions: Universal. License Source: File (x)');
        expect(getText(getPanel())).not.toContain('License ID');
      });

      it('should show both when there are no subscriptions', () => {
        addTrigger({ 'license-id': 'ABC123', 'license-source': 'File (x)' });

        expect(getText(getPanel())).toContain('(v26.2.0). License ID: ABC123. License Source: File (x)');
        expect(getText(getPanel())).not.toContain('Included in Subscriptions');
      });

      it('should follow a change of the attributes of the panel', async () => {
        addTrigger({ subscriptions: 'Universal', 'license-id': 'First' });

        getPanel().setAttribute('license-id', 'Second');
        getPanel().setAttribute('license-source', 'File (x)');
        await flushObserver();

        expect(getText(getPanel())).toContain('Included in Subscriptions: Universal. License ID: Second. License Source: File (x)');
        expect(getText(getPanel())).not.toContain('First');

        getPanel().removeAttribute('license-id');
        getPanel().removeAttribute('license-source');
        await flushObserver();

        expect(getText(getPanel())).not.toContain('License');
      });

      it('should show only the license source when there are no subscriptions', () => {
        addTrigger({ 'license-source': 'File (x)' });

        expect(getText(getPanel())).toContain('(v26.2.0). License Source: File (x)');
        expect(getText(getPanel())).not.toContain('License ID');
      });

      it('should not change the text when they are not set', () => {
        addTrigger({ subscriptions: 'Universal' });

        expect(getText(getPanel())).toContain('Included in Subscriptions: Universal');
        expect(getText(getPanel())).not.toContain('License ID');
        expect(getText(getPanel()).endsWith('Included in Subscriptions: Universal')).toBe(true);
      });

      it('should keep the ones of the first trigger when subscriptions of later triggers are merged', () => {
        addTrigger({ subscriptions: 'Universal, DXperience', 'license-id': 'First' });

        addTrigger({ subscriptions: 'Universal', 'license-id': 'Second' });

        expect(getText(getPanel())).toContain('Included in Subscriptions: Universal. License ID: First.');
        expect(getText(getPanel())).not.toContain('Second');
      });

      it('should render the values as text', () => {
        addTrigger({ 'license-id': '<b>bold</b>' });

        expect(getPanel().querySelector('b')).toBeNull();
        expect(getText(getPanel())).toContain('License ID: <b>bold</b>.');
      });
    });

    describe('expired trial panel', () => {
      it('should show them after the libraries and the subscriptions', () => {
        addTrigger({
          'trial-expired': 'true',
          libraries: 'DevExtreme',
          subscriptions: 'Universal',
          'license-id': 'ABC123',
          'license-source': 'Public Key (LCPv1abc)',
        });

        expect(getText(getPanel())).toContain('libraries: DevExtreme - Included in Subscriptions: Universal. License ID: ABC123. License Source: Public Key (LCPv1abc)');
      });

      it('should show them when there are no libraries and no subscriptions', () => {
        addTrigger({ 'trial-expired': 'true', 'license-id': 'ABC123' });

        expect(getText(getPanel())).toContain('use of DevExpress product libraries. License ID: ABC123.');
      });

      it('should show the license source without the license id', () => {
        addTrigger({ 'trial-expired': 'true', 'license-source': 'File (x)' });

        expect(getText(getPanel())).toContain('use of DevExpress product libraries. License Source: File (x)');
        expect(getText(getPanel())).not.toContain('License ID');
      });

      it('should not show them when they are not set', () => {
        addTrigger({ 'trial-expired': 'true', libraries: 'DevExtreme', subscriptions: 'Universal' });

        expect(getText(getPanel())).not.toContain('License ID');
        expect(getText(getPanel()).endsWith('Included in Subscriptions: Universal.')).toBe(true);
      });

      it('should take them from the trigger that switches the banner', () => {
        addTrigger({ 'license-id': 'InTrial', 'license-source': 'SourceOfTrial' });

        addTrigger({ 'trial-expired': 'true', 'license-id': 'Expired' });

        expect(getText(getPanel())).toContain('License ID: Expired.');
        expect(getText(getPanel())).not.toContain('InTrial');
        expect(getText(getPanel())).not.toContain('SourceOfTrial');
        expect(getPanel().hasAttribute('license-source')).toBe(false);
      });

      it('should not keep them of the banner when the expired trigger has none', () => {
        addTrigger({ 'license-id': 'InTrial' });

        addTrigger({ 'trial-expired': 'true' });

        expect(getText(getPanel())).not.toContain('License ID');
        expect(getPanel().hasAttribute('license-id')).toBe(false);
      });

      it('should keep the ones of the first expired trigger', () => {
        addTrigger({ 'trial-expired': 'true', 'license-id': 'First' });

        addTrigger({ 'trial-expired': 'true', 'license-id': 'Second' });
        addTrigger({ 'license-id': 'Third' });

        expect(getText(getPanel())).toContain('License ID: First.');
        expect(getText(getPanel())).not.toContain('Second');
        expect(getText(getPanel())).not.toContain('Third');
      });

      it('should follow a change of the attributes of the panel', async () => {
        addTrigger({ 'trial-expired': 'true', subscriptions: 'Universal', 'license-id': 'First' });

        getPanel().setAttribute('license-id', 'Second');
        await flushObserver();

        expect(getText(getPanel())).toContain('Included in Subscriptions: Universal. License ID: Second.');
        expect(getText(getPanel())).not.toContain('First');
        expect(hasCloseButton(getPanel())).toBe(false);
      });

      it('should wrap a long license source', () => {
        addTrigger({ 'trial-expired': 'true', 'license-id': 'ABC123', 'license-source': `Public Key (LCPv1${'a'.repeat(500)})` });

        const spans = Array.from(getPanel().querySelectorAll('span')) as HTMLElement[];
        const span = spans.find((element) => element.innerText.includes('License Source')) as HTMLElement;
        expect(span.style.getPropertyValue('overflow-wrap')).toBe('anywhere');
      });
    });
  });
});
