/**
 * @jest-environment jsdom
 */
import {
  beforeEach, describe, expect, it,
} from '@jest/globals';

import { renderTrialPanel } from './trial_panel.client';

describe('trial panel client', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should not display subscription text when subscriptions parameter is string "null"', () => {
    renderTrialPanel(
      'https://example.com/buy',
      'https://example.com/docs',
      '25.2.0',
      'null', // String "null" instead of actual null
    );

    const triggerElement = document.querySelector('dx-license-trigger');
    expect(triggerElement).not.toBeNull();

    // Check that the subscriptions attribute is set to "null"
    const subscriptionsAttr = triggerElement?.getAttribute('subscriptions');
    expect(subscriptionsAttr).toBe('null');

    // The key test: ensure the panel element doesn't show this text
    // This would fail if we remove the check for subscriptions !== 'null'
    const panelElement = document.querySelector('dx-license');
    if (panelElement) {
      const text = panelElement.textContent ?? '';
      expect(text).not.toContain('Included in Subscriptions: null');
    }
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
    expect(subscriptionsAttr).toBe('null');

    // Ensure the panel element doesn't show "Included in Subscriptions: null"
    // This is the key test - our fix should prevent displaying "null"
    const panelElement = document.querySelector('dx-license');
    if (panelElement) {
      const text = panelElement.textContent ?? '';
      expect(text).not.toContain('Included in Subscriptions: null');
    }
  });
});
