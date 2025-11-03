/* eslint-disable max-classes-per-file */
/* eslint no-restricted-imports: ["error", { "patterns": ["*"] }] */
export const BASE_Z_INDEX = 1500;

export interface StylesMap {
  [key: string]: string;
}

export interface CustomTrialPanelStyles {
  containerStyles?: StylesMap;
  textStyles?: StylesMap;
  linkStyles?: StylesMap;
  contentStyles?: StylesMap;
  buttonStyles?: StylesMap;
}

export const isClient = (): boolean => typeof HTMLElement !== 'undefined' && typeof customElements !== 'undefined';

const SafeHTMLElement = isClient()
  ? HTMLElement
  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-extraneous-class
  : class { } as any as typeof HTMLElement;

const DATA_PERMANENT_ATTRIBUTE = 'data-permanent';
const componentNames = {
  trigger: 'dx-license-trigger',
  panel: 'dx-license',
};
const attributeNames = {
  buyNow: 'buy-now',
  licensingDoc: 'licensing-doc',
  version: 'version',
  subscriptions: 'subscriptions',
};
const commonStyles = {
  opacity: '1',
  visibility: 'visible',
  'clip-path': 'none',
  filter: 'none',
};
const contentStyles = {
  ...commonStyles,
  width: '100%',
  height: 'auto',
  'line-height': 'normal',
  display: 'block',
  'z-index': `${BASE_Z_INDEX}`,
  position: 'static',
  transform: 'translate(0px, 0px)',
  'background-color': '#FF7200',
  border: 'none',
  margin: 'auto',
  'box-sizing': 'border-box',
  'text-align': 'center',
};
const containerStyles = {
  ...contentStyles,
  display: 'flex',
  'align-items': 'center',
  'flex-direction': 'row',
  position: 'relative',
  top: '0px',
  left: '0px',
  padding: '0.5rem',
};
const buttonStyles = {
  width: '1rem',
  cursor: 'pointer',
  height: '1rem',
};

const textStyles = {
  ...commonStyles,
  display: 'inline',
  position: 'static',
  padding: '0px',
  margin: '0px',
  color: 'white',
  'font-family': '\'Segoe UI\',\'Open Sans Condensed\',-apple-system,BlinkMacSystemFont,avenir next,avenir,helvetica neue,helvetica,Cantarell,Ubuntu,roboto,noto,arial,sans-serif',
  'font-size': '0.875rem',
  'font-wight': '600',
};

function createImportantStyles(defaultStyles: StylesMap, customStyles?: StylesMap): string {
  const styles = customStyles ? { ...defaultStyles, ...customStyles } : defaultStyles;

  return Object.keys(styles)
    .reduce(
      (cssString, currentKey) => `${cssString}${[currentKey, `${styles[currentKey]} !important;`].join(': ')}`,
      '',
    );
}

class DxLicense extends SafeHTMLElement {
  public static customStyles: CustomTrialPanelStyles | undefined = undefined;

  static closed = false;

  private _observer: MutationObserver | null = null;

  private _inReassign = false;

  private readonly _spanStyles: string;

  private readonly _linkStyles: string;

  private readonly _containerStyles: string;

  private readonly _contentStyles: string;

  private readonly _buttonStyles: string;

  private _subscriptionsSpan?: HTMLSpanElement;

  constructor() {
    super();

    this._spanStyles = createImportantStyles(textStyles, DxLicense.customStyles?.textStyles);
    this._linkStyles = createImportantStyles(textStyles, DxLicense.customStyles?.linkStyles);

    this._containerStyles = createImportantStyles(
      containerStyles,
      DxLicense.customStyles?.containerStyles,
    );

    this._contentStyles = createImportantStyles(
      contentStyles,
      DxLicense.customStyles?.contentStyles,
    );

    this._buttonStyles = createImportantStyles(
      buttonStyles,
      DxLicense.customStyles?.contentStyles,
    );
  }

  private _getSubscriptionsArray(subscriptions: string | null): string[] {
    return subscriptions?.split(',').map((x) => x.trim()) ?? [];
  }

  public updateSubscriptions(newSubscriptions: string): void {
    if (!this._subscriptionsSpan || !newSubscriptions) return;
    const currentSubscriptionsStr = this.getAttribute(attributeNames.subscriptions);
    const currentSubscriptions = this._getSubscriptionsArray(currentSubscriptionsStr);
    if (!currentSubscriptions.length) {
      this._updateSubscriptionsText(newSubscriptions);
      return;
    }

    const newSubscriptionsArray = this._getSubscriptionsArray(newSubscriptions);
    const mergedSubscriptions: string[] = [];

    newSubscriptionsArray.forEach((subscription) => {
      if (currentSubscriptions.some((x) => x === subscription)) {
        mergedSubscriptions.push(subscription);
      }
    });

    this._updateSubscriptionsText(
      mergedSubscriptions.length !== 0
        ? mergedSubscriptions.join(', ')
        : [...currentSubscriptions, ...newSubscriptionsArray].join(', '),
    );
  }

  private _updateSubscriptionsText(subscriptions: string | null): void {
    if (subscriptions && this._subscriptionsSpan) {
      this.setAttribute(attributeNames.subscriptions, subscriptions);
      this._subscriptionsSpan.innerText = ` Included in Subscriptions: ${subscriptions}`;
    }
  }

  private _createSubscriptionsSpan(): HTMLSpanElement {
    this._subscriptionsSpan = this._createSpan('');
    this._updateSubscriptionsText(this.getAttribute(attributeNames.subscriptions));
    return this._subscriptionsSpan;
  }

  private _createSpan(text: string): HTMLSpanElement {
    const span = document.createElement('span');
    span.innerText = text;
    span.style.cssText = this._spanStyles;
    return span;
  }

  private _createLink(text: string, href: string): HTMLAnchorElement {
    const link = document.createElement('a');
    link.innerText = text;
    link.style.cssText = this._linkStyles;
    link.href = href;
    link.target = '_blank';
    return link;
  }

  private _createButton(): HTMLDivElement {
    const button = document.createElement('div');
    button.style.cssText = this._buttonStyles;

    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    polygon.setAttribute('points', '13.4 12.7 8.7 8 13.4 3.4 12.6 2.6 8 7.3 3.4 2.6 2.6 3.4 7.3 8 2.6 12.6 3.4 13.4 8 8.7 12.7 13.4 13.4 12.7');
    polygon.style.cssText = createImportantStyles({
      fill: '#fff',
      opacity: '.5',
      'stroke-width': '0px',
    });

    svg.setAttribute('id', 'Layer_1');
    svg.setAttribute('data-name', 'Layer 1');
    svg.setAttribute('version', '1.1');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.style.cssText = createImportantStyles({
      'vertical-align': 'baseline',
    });

    svg.appendChild(polygon);
    button.appendChild(svg);

    button.onclick = (): void => {
      DxLicense.closed = true;
      this.style.cssText = createImportantStyles({
        display: 'none',
      });
    };
    return button;
  }

  private _createContentContainer(): HTMLElement {
    const contentContainer = document.createElement('div');
    contentContainer.style.cssText = this._contentStyles;
    contentContainer.append(
      this._createSpan('For evaluation purposes only. Redistribution prohibited. Please '),
      this._createLink('register', this.getAttribute(attributeNames.licensingDoc) as string),
      this._createSpan(' an existing license or '),
      this._createLink('purchase a new license', this.getAttribute(attributeNames.buyNow) as string),
      this._createSpan(` to continue use of DevExpress product libraries (v${this.getAttribute(attributeNames.version)}).`),
      this._createSubscriptionsSpan(),
    );

    return contentContainer;
  }

  private _reassignComponent(): void {
    this.innerHTML = '';
    this.style.cssText = this._containerStyles;
    this.append(
      this._createContentContainer(),
      this._createButton(),
    );
  }

  public connectedCallback(): void {
    this._reassignComponent();
    if (!this._observer) {
      this._observer = new MutationObserver(() => {
        if (DxLicense.closed) {
          this._observer?.disconnect();
          return;
        }
        if (this._inReassign) {
          this._inReassign = false;
        } else {
          this._inReassign = true;
          this._reassignComponent();
        }
      });
      this._observer.observe(this, {
        childList: true,
        attributes: true,
        subtree: true,
      });
    }
  }

  public disconnectedCallback(): void {
    if (DxLicense.closed) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    Promise.resolve().then(() => {
      if (!document) {
        return;
      }

      const licensePanel = document.getElementsByTagName(componentNames.panel);
      if (!licensePanel.length) {
        document.body.prepend(this);
      }
    });
  }
}
class DxLicenseTrigger extends SafeHTMLElement {
  public connectedCallback(): void {
    this.style.cssText = createImportantStyles({
      display: 'none',
    });

    const licensePanel = document.getElementsByTagName(componentNames.panel);
    if (DxLicense.closed) return;
    if (!licensePanel.length) {
      const license = document.createElement(componentNames.panel);

      Object.values(attributeNames).forEach((attrName) => {
        license.setAttribute(
          attrName,
          this.getAttribute(attrName) as string,
        );
      });

      license.setAttribute(DATA_PERMANENT_ATTRIBUTE, '');

      document.body.prepend(license);
    } else {
      const subscriptions = this.getAttribute(attributeNames.subscriptions) as string;
      (licensePanel[0] as DxLicense).updateSubscriptions(subscriptions);
    }
  }
}

export function registerCustomComponents(customStyles?: CustomTrialPanelStyles): void {
  if (!customElements.get(componentNames.trigger)) {
    DxLicense.customStyles = customStyles;
    customElements.define(
      componentNames.panel,
      DxLicense,
    );
    customElements.define(
      componentNames.trigger,
      DxLicenseTrigger,
    );
  }
}

export function renderTrialPanel(
  buyNowUrl: string,
  licensingDocUrl: string,
  version: string,
  subscriptions: string | undefined | null,
  customStyles?: CustomTrialPanelStyles,
): void {
  registerCustomComponents(customStyles);

  const trialPanelTrigger = document.createElement(componentNames.trigger);

  trialPanelTrigger.setAttribute(attributeNames.buyNow, buyNowUrl);
  trialPanelTrigger.setAttribute(attributeNames.licensingDoc, licensingDocUrl);
  trialPanelTrigger.setAttribute(attributeNames.version, version);
  trialPanelTrigger.setAttribute(attributeNames.subscriptions, subscriptions ?? '');

  document.body.appendChild(trialPanelTrigger);
}
