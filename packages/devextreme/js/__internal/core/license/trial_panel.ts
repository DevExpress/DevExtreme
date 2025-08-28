import {
  type CustomTrialPanelStyles,
  isClient,
  registerCustomComponents,
  renderTrialPanel,
} from './trial_panel.client';

export function showTrialPanel(
  buyNowUrl: string,
  licensingDocUrl: string,
  version: string,
  subscriptions?: string,
  customStyles?: CustomTrialPanelStyles,
): void {
  if (isClient()) {
    renderTrialPanel(buyNowUrl, licensingDocUrl, version, subscriptions, customStyles);
  }
}

export function registerTrialPanelComponents(customStyles?: CustomTrialPanelStyles): void {
  if (isClient()) {
    registerCustomComponents(customStyles);
  }
}
