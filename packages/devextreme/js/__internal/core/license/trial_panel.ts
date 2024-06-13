import {
  type CustomTrialPanelStyles,
  registerCustomComponents,
  renderTrialPanel,
} from './trial_panel.client';

export function showTrialPanel(
  buyNowUrl: string,
  version: string,
  customStyles?: CustomTrialPanelStyles,
): void {
  if (typeof customElements !== 'undefined') {
    renderTrialPanel(buyNowUrl, version, customStyles);
  }
}

export function registerTrialPanelComponents(customStyles?: CustomTrialPanelStyles): void {
  if (typeof customElements !== 'undefined') {
    registerCustomComponents(customStyles);
  }
}
