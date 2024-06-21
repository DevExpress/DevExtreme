import {
  type CustomTrialPanelStyles,
  isClient,
  registerCustomComponents,
  renderTrialPanel,
} from './trial_panel.client';

export function showTrialPanel(
  buyNowUrl: string,
  version: string,
  customStyles?: CustomTrialPanelStyles,
): void {
  if (isClient()) {
    renderTrialPanel(buyNowUrl, version, customStyles);
  }
}

export function registerTrialPanelComponents(customStyles?: CustomTrialPanelStyles): void {
  if (isClient()) {
    registerCustomComponents(customStyles);
  }
}
