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

export interface TrialPanelOptions {
  trialExpired?: boolean;
  libraries?: string | null;
  licenseId?: string | null;
  licenseSource?: string | null;
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
  trialExpired: 'trial-expired',
  libraries: 'libraries',
  licenseId: 'license-id',
  licenseSource: 'license-source',
};

const BRAND_COLOR = '#FF7200';
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

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
  'background-color': BRAND_COLOR,
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
  'font-family': '-apple-system, BlinkMacSystemFont, \'avenir next\', avenir, \'helvetica neue\', \'adwaita sans\', cantarell, ubuntu, roboto, noto, helvetica, arial, sans-serif',
  'font-size': '0.875rem',
  'font-weight': '600',
  'overflow-wrap': 'anywhere',
};

function createImportantStyles(defaultStyles: StylesMap, customStyles?: StylesMap): string {
  const styles = customStyles ? { ...defaultStyles, ...customStyles } : defaultStyles;

  return Object.keys(styles)
    .reduce(
      (cssString, currentKey) => `${cssString}${[currentKey, `${styles[currentKey]} !important;`].join(': ')}`,
      '',
    );
}

const OVERLAY_Z_INDEX = '99999';
const overlayStyles = createImportantStyles({
  ...commonStyles,
  position: 'fixed',
  top: '0px',
  left: '0px',
  right: '0px',
  bottom: '0px',
  display: 'flex',
  overflow: 'auto',
  'z-index': OVERLAY_Z_INDEX,
  'background-color': 'rgba(255, 255, 255, 0.9)',
  padding: '1rem',
  'padding-bottom': 'min(400px, 40vh)',
});
const overlayContentStyles = createImportantStyles({
  ...commonStyles,
  display: 'block',
  margin: 'auto',
  'max-width': '60rem',
  'text-align': 'center',
});
const overlayTextStyles = {
  ...textStyles,
  color: 'black',
  'font-size': '1rem',
  'font-weight': '400',
  'line-height': '2',
};
const overlaySpanStyles = createImportantStyles(overlayTextStyles);
const overlayTitleStyles = createImportantStyles(overlayTextStyles, { display: 'block', 'font-weight': '700' });
const overlayLinkStyles = createImportantStyles(overlayTextStyles, { 'text-decoration': 'underline' });

function createWarningIcon(): SVGSVGElement {
  const icon = document.createElementNS(SVG_NAMESPACE, 'svg');
  const path = document.createElementNS(SVG_NAMESPACE, 'path');

  icon.setAttribute('viewBox', '0 0 24 24');
  icon.setAttribute('aria-hidden', 'true');
  icon.style.cssText = createImportantStyles({
    display: 'block',
    width: '96px',
    height: '96px',
    margin: '0px auto 2rem auto',
  });
  path.setAttribute('d', 'M12,0C5.4,0,0,5.4,0,12s5.4,12,12,12,12-5.4,12-12S18.6,0,12,0ZM12,22c-5.5,0-10-4.5-10-10S6.5,2,12,2s10,4.5,10,10-4.5,10-10,10ZM13,6v8c0,.6-.4,1-1,1s-1-.4-1-1V6c0-.6.4-1,1-1s1,.4,1,1ZM13,18c0,.5-.4,1-1,1s-1-.5-1-1,.4-1,1-1,1,.5,1,1Z');
  path.style.cssText = createImportantStyles({ fill: BRAND_COLOR });
  icon.appendChild(path);

  return icon;
}

function setStyles<T extends HTMLElement>(element: T, styles: string): T {
  element.style.cssText = styles;
  return element;
}

function isTrialExpired(element: Element): boolean {
  return element.getAttribute(attributeNames.trialExpired)?.trim().toLowerCase() === 'true';
}

class DxLicense extends SafeHTMLElement {
  public static customStyles: CustomTrialPanelStyles | undefined = undefined;

  static closed = false;

  private _observer: MutationObserver | null = null;

  private _inReassign = false;

  private _expired = false;

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

  public get isExpired(): boolean {
    return this._expired;
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
    if (!this._subscriptionsSpan) return;

    if (subscriptions) {
      this.setAttribute(attributeNames.subscriptions, subscriptions);
    }

    if (this._expired) {
      this._subscriptionsSpan.innerText = this._getTrialExpiredEnding(subscriptions)
        + this._getLicenseText();
      return;
    }

    const subscriptionsText = subscriptions ? ` Included in Subscriptions: ${subscriptions}` : '';
    const licenseText = this._getLicenseText();
    if (subscriptionsText || licenseText) {
      this._subscriptionsSpan.innerText = licenseText && subscriptionsText
        ? `${subscriptionsText}.${licenseText}`
        : `${subscriptionsText}${licenseText}`;
    }
  }

  private _getLicenseText(): string {
    const licenseId = this.getAttribute(attributeNames.licenseId);
    const licenseSource = this.getAttribute(attributeNames.licenseSource);

    return `${licenseId ? ` License ID: ${licenseId}.` : ''}${licenseSource ? ` License Source: ${licenseSource}` : ''}`;
  }

  private _getTrialExpiredEnding(subscriptions: string | null): string {
    const libraries = this.getAttribute(attributeNames.libraries);
    const subscriptionsText = `Included in Subscriptions: ${subscriptions}.`;

    if (libraries) {
      return ` to continue use of the following DevExpress product libraries: ${libraries}${subscriptions ? ` - ${subscriptionsText}` : '.'}`;
    }

    return ` to continue use of DevExpress product libraries.${subscriptions ? ` ${subscriptionsText}` : ''}`;
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

    const polygon = document.createElementNS(SVG_NAMESPACE, 'polygon');
    const svg = document.createElementNS(SVG_NAMESPACE, 'svg');

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

  public setTrialExpired(trigger: Element): void {
    if (this._expired) return;

    this._expired = true;
    Object.values(attributeNames).forEach((attrName) => {
      const attrValue = trigger.getAttribute(attrName);

      if (attrValue) {
        this.setAttribute(attrName, attrValue);
      } else {
        this.removeAttribute(attrName);
      }
    });
    this._reassignComponent();
  }

  private _createTrialExpiredContent(): HTMLElement {
    const licensingDoc = this.getAttribute(attributeNames.licensingDoc) as string;
    const buyNow = this.getAttribute(attributeNames.buyNow) as string;
    const version = this.getAttribute(attributeNames.version);
    const content = setStyles(document.createElement('div'), overlayContentStyles);

    content.append(
      createWarningIcon(),
      setStyles(
        this._createSpan(`Your 30-day trial has expired (v${version}).`),
        overlayTitleStyles,
      ),
      setStyles(this._createSpan('Use and Redistribution prohibited. Please '), overlaySpanStyles),
      setStyles(this._createLink('register', licensingDoc), overlayLinkStyles),
      setStyles(this._createSpan(' a valid license or '), overlaySpanStyles),
      setStyles(this._createLink('purchase a new license', buyNow), overlayLinkStyles),
      setStyles(this._createSubscriptionsSpan(), overlaySpanStyles),
    );

    return content;
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

    if (this._expired) {
      this.style.cssText = overlayStyles;
      this.append(this._createTrialExpiredContent());
      return;
    }

    this.style.cssText = this._containerStyles;
    this.append(
      this._createContentContainer(),
      this._createButton(),
    );
  }

  public connectedCallback(): void {
    this._expired = this._expired || isTrialExpired(this);
    this._reassignComponent();
    if (!this._observer) {
      this._observer = new MutationObserver(() => {
        if (DxLicense.closed && !this._expired) {
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
    if (DxLicense.closed && !this._expired) {
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
    const trialExpired = isTrialExpired(this);
    if (DxLicense.closed && !trialExpired) return;
    if (!licensePanel.length) {
      const license = document.createElement(componentNames.panel);

      Object.values(attributeNames).forEach((attrName) => {
        const attrValue = this.getAttribute(attrName);

        if (attrValue) {
          license.setAttribute(attrName, attrValue);
        }
      });

      license.setAttribute(DATA_PERMANENT_ATTRIBUTE, '');

      document.body.prepend(license);
    } else {
      const panel = licensePanel[0] as DxLicense;

      if (trialExpired) {
        panel.setTrialExpired(this);
      } else if (!panel.isExpired) {
        panel.updateSubscriptions(this.getAttribute(attributeNames.subscriptions) as string);
      }
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
  subscriptions: string | null | undefined,
  customStyles?: CustomTrialPanelStyles,
  options?: TrialPanelOptions,
): void {
  registerCustomComponents(customStyles);

  const trialPanelTrigger = document.createElement(componentNames.trigger);

  trialPanelTrigger.setAttribute(attributeNames.buyNow, buyNowUrl);
  trialPanelTrigger.setAttribute(attributeNames.licensingDoc, licensingDocUrl);
  trialPanelTrigger.setAttribute(attributeNames.version, version);
  trialPanelTrigger.setAttribute(attributeNames.subscriptions, subscriptions ?? '');

  if (options?.trialExpired) {
    trialPanelTrigger.setAttribute(attributeNames.trialExpired, 'true');
  }

  if (options?.licenseId) {
    trialPanelTrigger.setAttribute(attributeNames.licenseId, options.licenseId);
  }

  if (options?.licenseSource) {
    trialPanelTrigger.setAttribute(attributeNames.licenseSource, options.licenseSource);
  }

  if (options?.libraries) {
    trialPanelTrigger.setAttribute(attributeNames.libraries, options.libraries);
  }

  document.body.appendChild(trialPanelTrigger);
}
