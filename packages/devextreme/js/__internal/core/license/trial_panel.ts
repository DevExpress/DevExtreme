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

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
const SafeHTMLElement = typeof HTMLElement !== 'undefined' ? HTMLElement : class {};

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

class DxLicense extends SafeHTMLElement {
  public static customStyles: CustomTrialPanelStyles | undefined = undefined;

  private readonly that = this as unknown as HTMLElement;

  private _observer: MutationObserver | null = null;

  private _inReassign = false;

  private _hidden = false;

  private readonly _spanStyles: string;

  private readonly _linkStyles: string;

  private readonly _containerStyles: string;

  private readonly _contentStyles: string;

  private readonly _buttonStyles: string;

  constructor() {
    super();

    this._spanStyles = this._createImportantStyles(textStyles, DxLicense.customStyles?.textStyles);
    this._linkStyles = this._createImportantStyles(textStyles, DxLicense.customStyles?.linkStyles);

    this._containerStyles = this._createImportantStyles(
      containerStyles,
      DxLicense.customStyles?.containerStyles,
    );

    this._contentStyles = this._createImportantStyles(
      contentStyles,
      DxLicense.customStyles?.contentStyles,
    );

    this._buttonStyles = this._createImportantStyles(
      buttonStyles,
      DxLicense.customStyles?.contentStyles,
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

  private _createButton(): HTMLDivElement {
    const button = document.createElement('div');
    button.style.cssText = this._buttonStyles;

    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    polygon.setAttribute('points', '13.4 12.7 8.7 8 13.4 3.4 12.6 2.6 8 7.3 3.4 2.6 2.6 3.4 7.3 8 2.6 12.6 3.4 13.4 8 8.7 12.7 13.4 13.4 12.7');
    polygon.style.cssText = this._createImportantStyles({
      fill: '#fff',
      opacity: '.5',
      'stroke-width': '0px',
    });

    svg.setAttribute('id', 'Layer_1');
    svg.setAttribute('data-name', 'Layer 1');
    svg.setAttribute('version', '1.1');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.style.cssText = this._createImportantStyles({
      'vertical-align': 'baseline',
    });

    svg.appendChild(polygon);
    button.appendChild(svg);

    button.onclick = (): void => {
      this._hidden = true;
      this.that.style.cssText = this._createImportantStyles({
        display: 'none',
      });
    };
    return button;
  }

  private _createContentContainer(): HTMLElement {
    const contentContainer = document.createElement('div');
    contentContainer.style.cssText = this._contentStyles;
    contentContainer.append(
      this._createSpan('For evaluation purposes only. Redistribution not authorized. Please '),
      this._createLink('purchase a license', this.that.getAttribute(attributeNames.buyNow) as string),
      this._createSpan(` to continue use of DevExpress product libraries (v${this.that.getAttribute(attributeNames.version)}).`),
    );
    return contentContainer;
  }

  private _reassignComponent(): void {
    this.that.innerHTML = '';
    this.that.style.cssText = this._containerStyles;
    this.that.append(
      this._createContentContainer(),
      this._createButton(),
    );
  }

  public connectedCallback(): void {
    this._reassignComponent();
    if (!this._observer) {
      this._observer = new MutationObserver(() => {
        if (this._hidden) {
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
      this._observer.observe(this.that, {
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
        document.body.prepend(this.that);
      }
    }, 100);
  }
}
class DxLicenseTrigger extends SafeHTMLElement {
  private readonly that = this as unknown as HTMLElement;

  public connectedCallback(): void {
    this.that.style.display = 'none';

    const licensePanel = document.getElementsByTagName(componentNames.panel);
    if (!licensePanel.length) {
      const license = document.createElement(componentNames.panel);

      license.setAttribute(
        attributeNames.version,
        this.that.getAttribute(attributeNames.version) as string,
      );

      license.setAttribute(
        attributeNames.buyNow,
        this.that.getAttribute(attributeNames.buyNow) as string,
      );

      license.setAttribute(DATA_PERMANENT_ATTRIBUTE, 'true');

      document.body.prepend(license);
    }
  }
}

export function registerCustomComponents(customStyles?: CustomTrialPanelStyles): void {
  if (!customElements.get(componentNames.trigger)) {
    DxLicense.customStyles = customStyles;
    customElements.define(
      componentNames.trigger,
      DxLicenseTrigger as unknown as CustomElementConstructor,
    );
    customElements.define(
      componentNames.panel,
      DxLicense as unknown as CustomElementConstructor,
    );
  }
}

export function renderTrialPanel(
  buyNowUrl: string,
  version: string,
  customStyles?: CustomTrialPanelStyles,
): void {
  registerCustomComponents(customStyles);

  const trialPanelTrigger = document.createElement(componentNames.trigger);

  trialPanelTrigger.setAttribute(attributeNames.buyNow, buyNowUrl);
  trialPanelTrigger.setAttribute(attributeNames.version, version);

  document.body.appendChild(trialPanelTrigger);
}
