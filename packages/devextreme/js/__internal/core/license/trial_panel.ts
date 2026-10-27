import {
  type CustomTrialPanelStyles,
  isClient,
  registerCustomComponents,
  renderTrialPanel,
  type TrialPanelOptions,
} from './trial_panel.client';

export function showTrialPanel(
  buyNowUrl: string,
  licensingDocUrl: string,
  version: string,
  subscriptions?: string | null,
  customStyles?: CustomTrialPanelStyles,
  options?: TrialPanelOptions,
): void {
  if (isClient()) {
    renderTrialPanel(
      buyNowUrl,
      licensingDocUrl,
      version,
      subscriptions,
      customStyles,
      options,
    );
  }
}

export function registerTrialPanelComponents(customStyles?: CustomTrialPanelStyles): void {
  if (isClient()) {
    registerCustomComponents(customStyles);
  }
}
