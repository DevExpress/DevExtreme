import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  TwoWay,
  Ref,
  RefObject,
  Fragment,
  Method,
} from '@devextreme-generator/declarations';
import devices from '../../../../core/devices';
import { Editor, EditorProps } from '../common/editor';
import BaseComponent from '../../../component_wrapper/editors/check_box';
import { combineClasses } from '../../../utils/combine_classes';
import { CheckBoxIcon } from './check_box_icon';
import { WidgetProps } from '../../common/widget';

const getCssClasses = (model: CheckBoxPropsType): string => {
  const {
    text, value,
  } = model;

  const checked = value;
  const indeterminate = checked === null;

  const classesMap = {
    'dx-checkbox': true,
    'dx-checkbox-checked': checked === true,
    'dx-checkbox-has-text': !!text,
    'dx-checkbox-indeterminate': indeterminate,
  };

  return combineClasses(classesMap);
};

export const viewFunction = (viewModel: CheckBox): JSX.Element => {
  const {
    props: {
      text, name, value,
      validationError, validationErrors, validationMessageMode,
      validationMessagePosition, isValid, validationStatus,
      accessKey, className, hint, tabIndex, rtlEnabled,
      activeStateEnabled, hoverStateEnabled, focusStateEnabled,
      disabled, readOnly, visible,
      width, height,
      onFocusIn,
      iconSize,
    },
    restAttributes,
    cssClasses: classes, aria,
    onWidgetClick: onClick, keyDown: onKeyDown,
    editorRef,
  } = viewModel;

  return (
    <Editor // eslint-disable-line jsx-a11y/no-access-key
      ref={editorRef}
      aria={aria}
      classes={classes}
      onClick={onClick}
      onKeyDown={onKeyDown}
      accessKey={accessKey}
      activeStateEnabled={activeStateEnabled}
      focusStateEnabled={focusStateEnabled}
      hoverStateEnabled={hoverStateEnabled}
      className={className}
      disabled={disabled}
      readOnly={readOnly}
      hint={hint}
      height={height}
      width={width}
      rtlEnabled={rtlEnabled}
      tabIndex={tabIndex}
      visible={visible}
      validationError={validationError}
      validationErrors={validationErrors}
      validationMessageMode={validationMessageMode}
      validationMessagePosition={validationMessagePosition}
      validationStatus={validationStatus}
      isValid={isValid}
      onFocusIn={onFocusIn}
      {...restAttributes} // eslint-disable-line react/jsx-props-no-spreading
    >
      <Fragment>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <input type="hidden" value={`${value}`} {...name && { name }} />
        <div className="dx-checkbox-container">
          <CheckBoxIcon size={iconSize} isChecked={value === true} />
          {text && (<span className="dx-checkbox-text">{text}</span>)}
        </div>
      </Fragment>
    </Editor>
  );
};

@ComponentBindings()
export class CheckBoxProps extends EditorProps {
  @OneWay() text = '';

  @OneWay() iconSize?: number | string;

  @OneWay() enableThreeStateBehavior = false;

  // overrides default value
  @OneWay() activeStateEnabled = true;

  @OneWay() hoverStateEnabled = true;

  @OneWay() focusStateEnabled = devices.real().deviceType === 'desktop' && !devices.isSimulator();

  @TwoWay() value: boolean | null = false;

  // private
  @OneWay() saveValueChangeEvent?: (event: Event) => void;
}

export type CheckBoxPropsType = CheckBoxProps
// eslint-disable-next-line @typescript-eslint/no-type-alias
& Pick<WidgetProps, 'aria'>;

@Component({
  jQuery: {
    component: BaseComponent,
    register: true,
  },
  view: viewFunction,
})

export class CheckBox extends JSXComponent<CheckBoxPropsType>() {
  @Ref() editorRef!: RefObject<Editor>;

  @Method()
  focus(): void {
    this.editorRef.current!.focus();
  }

  @Method()
  blur(): void {
    this.editorRef.current!.blur();
  }

  onWidgetClick(event: Event): void {
    const {
      value, readOnly, enableThreeStateBehavior, saveValueChangeEvent,
    } = this.props;

    if (!readOnly) {
      saveValueChangeEvent?.(event);

      if (enableThreeStateBehavior) {
        this.props.value = value === null || (!value ? null : false);
      } else {
        this.props.value = !(value ?? false);
      }
    }
  }

  keyDown(e: {
    originalEvent: Event & { cancel: boolean };
    keyName: string;
    which: string;
  }): Event | undefined {
    const { onKeyDown } = this.props;
    const { originalEvent, keyName, which } = e;

    const result: Event & { cancel: boolean } = onKeyDown?.(e);
    if (result?.cancel) {
      return result;
    }

    if (keyName === 'space' || which === 'space') {
      (originalEvent as Event).preventDefault();
      this.onWidgetClick(originalEvent as Event);
    }

    return undefined;
  }

  get cssClasses(): string {
    return getCssClasses(this.props);
  }

  get aria(): Record<string, string> {
    const { value } = this.props;
    const checked = value === true;
    const indeterminate = value === null;

    const result = {
      role: 'checkbox',
      checked: indeterminate ? 'mixed' : `${checked}`,
    };

    return { ...result, ...this.props.aria };
  }
}
