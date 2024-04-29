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
}

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
  display: 'block',
  'z-index': `${BASE_Z_INDEX}`,
  position: 'relative',
  top: '0px',
  left: '0px',
  transform: 'translate(0px, 0px)',
  padding: '8px',
  'background-color': '#FF7200',
  border: 'none',
  margin: 'auto',
  'box-sizing': 'border-box',
  'text-align': 'center',
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
  public static customStyles: CustomTrialPanelStyles | undefined = undefined;

  private _observer: MutationObserver | null = null;

  private _inReassign = false;

  private readonly _spanStyles: string;

  private readonly _linkStyles: string;

  private readonly _containerStyles: string;

  constructor() {
    super();

    this._spanStyles = this._createImportantStyles(textStyles, DxLicense.customStyles?.textStyles);
    this._linkStyles = this._createImportantStyles(textStyles, DxLicense.customStyles?.linkStyles);
    this._containerStyles = this._createImportantStyles(
      containerStyles,
      DxLicense.customStyles?.containerStyles,
    );
  }

  private _createImportantStyles(defaultStyles: StylesMap, customStyles?: StylesMap): string {
    const styles = customStyles ? { ...defaultStyles, ...customStyles } : defaultStyles;

    return Object.keys(styles)
      .reduce(
        (cssString, currentKey) => `${cssString}${[currentKey, `${styles[currentKey]} !important;`].join(': ')}`,
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

export function registerTrialPanelComponents(customStyles?: CustomTrialPanelStyles): void {
  if (typeof customElements !== 'undefined' && !customElements.get(componentNames.trigger)) {
    DxLicense.customStyles = customStyles;
    customElements.define(componentNames.trigger, DxLicenseTrigger);
    customElements.define(componentNames.panel, DxLicense);
  }
}

export function showTrialPanel(
  buyNowUrl: string,
  version: string,
  customStyles?: CustomTrialPanelStyles,
): void {
  if (typeof customElements === 'undefined') {
    return;
  }

  registerTrialPanelComponents(customStyles);

  const trialPanelTrigger = document.createElement(componentNames.trigger);

  trialPanelTrigger.setAttribute(attributeNames.buyNow, buyNowUrl);
  trialPanelTrigger.setAttribute(attributeNames.version, version);

  document.body.appendChild(trialPanelTrigger);
}
