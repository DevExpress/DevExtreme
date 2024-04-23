/* eslint-disable max-classes-per-file */
const DATA_PERMANENT_ATTRIBUTE = 'data-permanent';
const componentNames = {
  trigger: 'dx-license-trigger',
  panel: 'dx-license',
};
const attributeNames = {
  buyNow: 'buy-now',
  version: 'version',
};
const commonStyles = {
  opacity: '1',
  visibility: 'visible',
};
const containerStyles = {
  ...commonStyles,
  width: '100%',
  height: 'auto',
  lineHeight: 'auto',
  display: 'flex',
  'justify-content': 'center',
  'z-index': '2147483647',
  position: 'relative',
  top: '0px',
  left: '0px',
  transform: 'translate(0px, 0px)',
  padding: '8px',
  'background-color': '#FF7200',
  border: 'none',
  margin: 'auto',
  'box-sizing': 'border-box',
  'white-space': 'pre',
};
const textStyles = {
  ...commonStyles,
  display: 'inline',
  position: 'static',
  padding: '0px',
  margin: '0px',
  color: 'white',
  'font-family': '"Segoe UI","Open Sans Condensed",-apple-system,BlinkMacSystemFont,avenir next,avenir,helvetica neue,helvetica,Cantarell,Ubuntu,roboto,noto,arial,sans-serif',
  'font-size': '14px',
  'font-wight': '600',
};
class DxLicense extends HTMLElement {
  private _observer: MutationObserver | null = null;

  private _inReassign = false;

  private readonly _spanStyles: string;

  private readonly _linkStyles: string;

  private readonly _containerStyles: string;

  constructor() {
    super();
    this._spanStyles = this._createImportantStyles(textStyles);
    this._linkStyles = this._createImportantStyles(textStyles);
    this._containerStyles = this._createImportantStyles(containerStyles);
  }

  private _createImportantStyles(stylesMap: { [key: string]: string }): string {
    return Object.keys(stylesMap)
      .reduce(
        (cssString, currentKey) => `${cssString}${[currentKey, `${stylesMap[currentKey]} !important;`].join(': ')}`,
        '',
      );
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

  private _reassignComponent(): void {
    this.innerHTML = '';
    this.style.cssText = this._containerStyles;
    this.append(
      this._createSpan('For evaluation purposes only. Redistribution not authorized. Please '),
      this._createLink('purchase a license', this.getAttribute(attributeNames.buyNow) as string),
      this._createSpan(` to continue use of DevExpress product libraries (v${this.getAttribute(attributeNames.version)}).`),
    );
  }

  public connectedCallback(): void {
    this._reassignComponent();
    if (!this._observer) {
      this._observer = new MutationObserver(() => {
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
        // eslint-disable-next-line spellcheck/spell-checker
        subtree: true,
      });
    }
  }

  public disconnectedCallback(): void {
    setTimeout(() => {
      const licensePanel = document.getElementsByTagName(componentNames.panel);
      if (!licensePanel.length) {
        document.body.prepend(this);
      }
    }, 100);
  }
}
class DxLicenseTrigger extends HTMLElement {
  public connectedCallback(): void {
    const licensePanel = document.getElementsByTagName(componentNames.panel);
    if (!licensePanel.length) {
      const license = document.createElement(componentNames.panel);

      license.setAttribute(
        attributeNames.version,
        this.getAttribute(attributeNames.version) as string,
      );

      license.setAttribute(
        attributeNames.buyNow,
        this.getAttribute(attributeNames.buyNow) as string,
      );

      license.setAttribute(DATA_PERMANENT_ATTRIBUTE, 'true');

      document.body.prepend(license);
    }
  }
}

export function registerTrialPanelComponents(): void {
  if (typeof customElements !== 'undefined' && !customElements.get(componentNames.trigger)) {
    customElements.define(componentNames.trigger, DxLicenseTrigger);
    customElements.define(componentNames.panel, DxLicense);
  }
}

export function showTrialPanel(buyNowUrl: string, version: string): void {
  if (typeof customElements === 'undefined') {
    return;
  }

  registerTrialPanelComponents();

  const trialPanelTrigger = document.createElement(componentNames.trigger);

  trialPanelTrigger.setAttribute(attributeNames.buyNow, buyNowUrl);
  trialPanelTrigger.setAttribute(attributeNames.version, version);

  document.body.appendChild(trialPanelTrigger);
}
