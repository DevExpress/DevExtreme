import { RadioButton, RadioGroup } from '@devextreme/react';
import { ChangeEvent, useReducer, useRef } from 'react';

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
}

interface PlaygroundState {
  groupValue?: string;
  buttons: PlaygroundBtnData[];
  baseSettings: PlaygroundBaseDomSettings;
  focused: boolean;
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
  | { type: 'setButtonLabel', idx: number, label?: string }
  | { type: 'setButtonValue', idx: number, value?: string }
  | { type: 'removeButton' }
  | { type: 'addButton' };

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
    default:
      throw new Error('Unknown action type');
  }
}

export function RadioGroupControlledPlayground() {
  const radioGroupRef = useRef<HTMLDivElement>(null);

  const [state, dispatch] = useReducer(playgroundReducer, {
    groupValue: '1',
    focused: false,
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
      accessKey: 's',
      disabled: false,
      hint: 'Hello!',
    },
  });

  return (
    <div className="example">
      <div className="example__title">
        Controlled playground
      </div>
      <div className="example__control-container">
        <div className="example__control">
          <RadioGroup
            ref={radioGroupRef}
            value={state.groupValue}
            valueChange={(groupValue) => { dispatch({ type: 'setValue', groupValue }); }}
            focusStateEnabled={state.baseSettings.focusCss}
            tabIndex={state.baseSettings.tabIndex}
            hoverStateEnabled={state.baseSettings.hoverCss}
            activeStateEnabled={state.baseSettings.activeCss}
            shortcutKey={state.baseSettings.accessKey}
            disabled={state.baseSettings.disabled}
            hint={state.baseSettings.hint}
            onFocus={() => dispatch({ type: 'setFocus', focused: true })}
            onBlur={() => dispatch({ type: 'setFocus', focused: false })}
          >
            {state.buttons.map((button) => (
              <RadioButton
                label={button.label}
                key={button.value}
                value={button.value}
              />
            ))}
          </RadioGroup>
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
    </div>
  );
}
