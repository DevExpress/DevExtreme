import { RadioGroupCompatible, RadioGroupRef } from '@devextreme/react';
import {
  ChangeEvent, useMemo, useReducer, useRef,
} from 'react';

interface PlaygroundBtnData {
  value: string;
  label: string;
}

interface PlaygroundBaseDomSettings {
  focusCss: boolean;
  tabIndex: number;
  hoverCss: boolean;
  activeCss: boolean;
  accessKey: string;
  disabled: boolean;
  hint?: string;
  cssClass?: string;
  cssStyles: Record<string, string>;
  width?: string;
  height?: string;
  logOnLifecycle: boolean;
  visible: boolean;
}

interface PlaygroundState {
  groupValue?: string;
  buttons: PlaygroundBtnData[];
  baseSettings: PlaygroundBaseDomSettings;
  focused: boolean;
  componentMounted: boolean;
}

type Actions =
  | { type: 'setValue', groupValue?: string }
  | { type: 'setFocus', focused: boolean }
  | { type: 'setFocusCss', enabled: boolean }
  | { type: 'setTabIndex', tabIndex: number }
  | { type: 'setHoverCss', enabled: boolean }
  | { type: 'setActiveCss', enabled: boolean }
  | { type: 'setAccessKey', accessKey: string }
  | { type: 'setDisabled', disabled: boolean }
  | { type: 'setHint', hint?: string }
  | { type: 'setCssClass', cssClass?: string }
  | { type: 'setCssStylesJson', cssStylesJson: string }
  | { type: 'setWidth', width?: string }
  | { type: 'setHeight', height?: string }
  | { type: 'setVisible', visible: boolean }
  | { type: 'setButtonLabel', idx: number, label?: string }
  | { type: 'setButtonValue', idx: number, value?: string }
  | { type: 'removeButton' }
  | { type: 'addButton' }
  | { type: 'setComponentMounted', mounted: boolean; };

function setCssStylesJson(
  state: PlaygroundState,
  json: string,
): PlaygroundState {
  let styles: string | Record<string, string> = {};

  try {
    styles = JSON.parse(json);
    styles = typeof styles === 'string' ? {} : styles;
  } catch {
    // eslint-disable-next-line no-console
    console.warn(`Invalid css styles: ${json}`);
  }

  return {
    ...state,
    baseSettings: {
      ...state.baseSettings,
      cssStyles: styles as Record<string, string>,
    },
  };
}

function playgroundReducer(
  state: PlaygroundState,
  action: Actions,
): PlaygroundState {
  switch (action.type) {
    case 'setValue':
      return { ...state, groupValue: action.groupValue };
    case 'setFocus':
      return { ...state, focused: action.focused };
    case 'setFocusCss':
      return { ...state, baseSettings: { ...state.baseSettings, focusCss: action.enabled } };
    case 'setTabIndex':
      return { ...state, baseSettings: { ...state.baseSettings, tabIndex: action.tabIndex } };
    case 'setHoverCss':
      return { ...state, baseSettings: { ...state.baseSettings, hoverCss: action.enabled } };
    case 'setActiveCss':
      return { ...state, baseSettings: { ...state.baseSettings, activeCss: action.enabled } };
    case 'setAccessKey':
      return { ...state, baseSettings: { ...state.baseSettings, accessKey: action.accessKey } };
    case 'setDisabled':
      return { ...state, baseSettings: { ...state.baseSettings, disabled: action.disabled } };
    case 'setHint':
      return { ...state, baseSettings: { ...state.baseSettings, hint: action.hint } };
    case 'setCssClass':
      return { ...state, baseSettings: { ...state.baseSettings, cssClass: action.cssClass } };
    case 'setCssStylesJson':
      return setCssStylesJson(state, action.cssStylesJson);
    case 'setWidth':
      return { ...state, baseSettings: { ...state.baseSettings, width: action.width } };
    case 'setHeight':
      return { ...state, baseSettings: { ...state.baseSettings, height: action.height } };
    case 'setVisible':
      return { ...state, baseSettings: { ...state.baseSettings, visible: action.visible } };
    case 'setButtonLabel':
      return {
        ...state,
        buttons: Object.assign(
          state.buttons,
          { [action.idx]: { label: action.label, value: state.buttons[action.idx].value } },
        ),
      };
    case 'setButtonValue':
      return {
        ...state,
        buttons: Object.assign(
          state.buttons,
          { [action.idx]: { label: state.buttons[action.idx].label, value: action.value } },
        ),
      };
    case 'addButton':
      return {
        ...state,
        buttons: [
          ...state.buttons,
          { label: `Option ${state.buttons.length}`, value: `${state.buttons.length}` },
        ],
      };
    case 'removeButton':
      return {
        ...state,
        buttons: state.buttons.filter((_, idx) => idx !== state.buttons.length - 1),
      };
    case 'setComponentMounted':
      return { ...state, componentMounted: action.mounted };
    default:
      throw new Error('Unknown action type');
  }
}

export function RadioGroupCompatibleControlledPlayground() {
  const radioGroupRef = useRef<RadioGroupRef>(null);

  const [state, dispatch] = useReducer(playgroundReducer, {
    groupValue: '1',
    focused: false,
    componentMounted: true,
    buttons: [
      { value: '0', label: 'Option 0' },
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ],
    baseSettings: {
      focusCss: true,
      tabIndex: 0,
      hoverCss: true,
      activeCss: true,
      accessKey: 'a',
      disabled: false,
      hint: 'Hello!',
      cssClass: 'example-css-class',
      cssStyles: { display: 'block' },
      width: '',
      height: '',
      logOnLifecycle: false,
      visible: true,
    },
  });

  const cssStylesString = useMemo(
    () => JSON.stringify(state.baseSettings.cssStyles),
    [],
  );

  return (
    <div className="example">
      <div className="example__title">
        Compatible controlled playground
      </div>
      <div className="example__control-container">
        <div className="example__control">
          {
            state.componentMounted
              ? (
                // eslint-disable-next-line jsx-a11y/no-access-key
                <RadioGroupCompatible
                  ref={radioGroupRef}
                  items={state.buttons}
                  displayExpr="label"
                  valueExpr="value"
                  value={state.groupValue}
                  valueChange={(groupValue) => { dispatch({ type: 'setValue', groupValue }); }}
                  focusStateEnabled={state.baseSettings.focusCss}
                  tabIndex={state.baseSettings.tabIndex}
                  hoverStateEnabled={state.baseSettings.hoverCss}
                  activeStateEnabled={state.baseSettings.activeCss}
                  disabled={state.baseSettings.disabled}
                  hint={state.baseSettings.hint}
                  className={state.baseSettings.cssClass}
                  style={state.baseSettings.cssStyles}
                  // compatible options
                  accessKey={state.baseSettings.accessKey}
                  width={state.baseSettings.width}
                  height={state.baseSettings.height}
                  visible={state.baseSettings.visible}
                  onFocusIn={() => dispatch({ type: 'setFocus', focused: true })}
                  onFocusOut={() => dispatch({ type: 'setFocus', focused: false })}
                />
              )
              : null
          }
        </div>
      </div>
      <div className="example__play-part">
        <span className="example__block">
          RadioGroup value:
        </span>
        <input
          type="text"
          className="example-input"
          value={state.groupValue}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            dispatch({ type: 'setValue', groupValue: event?.target?.value });
          }}
        />
      </div>
      <div className="example__play-part">
        {state.buttons.map((button, idx) => (
          <div
            className="example__block"
            key={button.value}
          >
            <span className="example__block">
              Label:
            </span>
            <input
              type="text"
              className="example-input"
              value={button.label}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                dispatch({ type: 'setButtonLabel', idx, label: event?.target?.value });
              }}
            />
            <span className="example__block">
              Value:
            </span>
            <input
              type="text"
              className="example-input"
              value={button.value}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                dispatch({ type: 'setButtonValue', idx, value: event?.target?.value });
              }}
            />
          </div>
        ))}
        <div>
          <button
            type="button"
            className="example-button"
            onClick={() => dispatch({ type: 'addButton' })}
          >
            Add
          </button>
          <button
            type="button"
            className="example-button"
            onClick={() => dispatch({ type: 'removeButton' })}
          >
            Remove
          </button>
        </div>
      </div>
      <div className="example__play-part">
        <span className="example__block">
          <span>Component mounted:</span>
          <input
            type="checkbox"
            checked={state.componentMounted}
            onChange={
              () => { dispatch({ type: 'setComponentMounted', mounted: !state.componentMounted }); }
            }
          />
        </span>
      </div>
      <h4>Base options:</h4>
      <div className="example__play-part">
        <span className="example__block">
          Focused:
          { state.focused.toString() }
        </span>
        <button
          className="example-button"
          type="button"
          onClick={() => { radioGroupRef.current?.focus(); }}
        >
          Focus Radio Group
        </button>
      </div>
      <div className="example__play-part">
        <span className="example__block">
          <span>focus CSS:</span>
          <input
            type="checkbox"
            checked={state.baseSettings.focusCss}
            onChange={() => dispatch({ type: 'setFocusCss', enabled: !state.baseSettings.focusCss })}
          />
        </span>
        <span className="example__block">
          <span>hover CSS:</span>
          <input
            type="checkbox"
            checked={state.baseSettings.hoverCss}
            onChange={() => dispatch({ type: 'setHoverCss', enabled: !state.baseSettings.hoverCss })}
          />
        </span>
        <span className="example__block">
          <span>active CSS:</span>
          <input
            type="checkbox"
            checked={state.baseSettings.activeCss}
            onChange={() => dispatch({ type: 'setActiveCss', enabled: !state.baseSettings.activeCss })}
          />
        </span>
      </div>
      <div className="example__play-part">
        <span className="example__block">
          Tab index:
        </span>
        <input
          type="number"
          className="example-input"
          value={state.baseSettings.tabIndex}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const tabIndex = +event?.target?.value;
            if (!isNaN(tabIndex)) {
              dispatch({ type: 'setTabIndex', tabIndex });
            }
          }}
        />
      </div>
      <div className="example__play-part">
        <span className="example__block">
          <span>Access key:</span>
          <input
            type="text"
            className="example-input"
            value={state.baseSettings.accessKey}
            onChange={(
              event: ChangeEvent<HTMLInputElement>,
            ) => { dispatch({ type: 'setAccessKey', accessKey: event?.target?.value }); }}
          />
        </span>
      </div>
      <div className="example__play-part">
        <span className="example__block">
          <span>Disabled:</span>
          <input
            type="checkbox"
            checked={state.baseSettings.disabled}
            onChange={
              () => { dispatch({ type: 'setDisabled', disabled: !state.baseSettings.disabled }); }
            }
          />
        </span>
      </div>
      <div className="example__play-part">
        <span className="example__block">
          <span>Hint:</span>
          <input
            type="text"
            className="example-input"
            value={state.baseSettings.hint}
            onChange={(
              event: ChangeEvent<HTMLInputElement>,
            ) => { dispatch({ type: 'setHint', hint: event?.target?.value }); }}
          />
        </span>
      </div>
      <div className="example__play-part">
        <span className="example__block">
          <span>CSS classes:</span>
          <input
            type="text"
            className="example-input"
            value={state.baseSettings.cssClass}
            onChange={(
              event: ChangeEvent<HTMLInputElement>,
            ) => { dispatch({ type: 'setCssClass', cssClass: event?.target?.value }); }}
          />
          <span>CSS styles JSON:</span>
          <input
            type="text"
            className="example-input"
            defaultValue={cssStylesString}
            onBlur={(
              event: ChangeEvent<HTMLInputElement>,
            ) => { dispatch({ type: 'setCssStylesJson', cssStylesJson: event?.target?.value }); }}
          />
        </span>
      </div>

      <h4> Compatible options </h4>

      <div className="example__play-part">
        <div className="example__play-part">
          <span className="example__block">
            Width:
          </span>
          <input
            type="text"
            className="example-input"
            value={state.baseSettings.width}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              dispatch({ type: 'setWidth', width: event?.target?.value });
            }}
          />
          <span className="example__block">
            Height:
          </span>
          <input
            type="text"
            className="example-input"
            value={state.baseSettings.height}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              dispatch({ type: 'setHeight', height: event?.target?.value });
            }}
          />
        </div>
      </div>
      <div className="example__play-part">
        <span className="example__block">
          <span>Visible:</span>
          <input
            type="checkbox"
            checked={state.baseSettings.visible}
            onChange={
              () => { dispatch({ type: 'setVisible', visible: !state.baseSettings.visible }); }
            }
          />
        </span>
      </div>
    </div>
  );
}
