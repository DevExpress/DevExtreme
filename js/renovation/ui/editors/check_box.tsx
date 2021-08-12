import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  TwoWay,
  Ref,
  Effect,
  RefObject,
  Fragment,
  Method,
} from '@devextreme-generator/declarations';
import { createDefaultOptionRules } from '../../../core/options/utils';
import getElementComputedStyle from '../../utils/get_computed_style';
import { isMaterial, current } from '../../../ui/themes';
import devices from '../../../core/devices';
import { Editor, EditorProps } from './internal/editor';
import BaseComponent from '../../component_wrapper/editors/check_box';
import { normalizeStyleProp } from '../../../core/utils/style';
import { combineClasses } from '../../utils/combine_classes';
import { EffectReturn } from '../../utils/effect_return.d';
import { hasWindow } from '../../../core/utils/window';

const getCssClasses = (model: CheckBoxProps): string => {
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
      validationError, validationErrors, validationMessageMode, isValid, validationStatus,
      accessKey, className, hint, tabIndex, rtlEnabled,
      activeStateEnabled, hoverStateEnabled, focusStateEnabled,
      disabled, readOnly, visible,
      width, height,
    },
    iconRef, iconStyles,
    restAttributes,
    cssClasses: classes, aria,
    onWidgetClick: onClick, onWidgetKeyDown: onKeyDown,
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
      validationStatus={validationStatus}
      isValid={isValid}
      {...restAttributes} // eslint-disable-line react/jsx-props-no-spreading
    >
      <Fragment>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <input type="hidden" value={`${value}`} {...name && { name }} />
        <div className="dx-checkbox-container">
          <span className="dx-checkbox-icon" ref={iconRef} style={iconStyles} />
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

  @TwoWay() value: boolean | null = false;

  // overrides default value
  @OneWay() activeStateEnabled = true;

  @OneWay() hoverStateEnabled = true;

  // private
  @OneWay() saveValueChangeEvent?: (event: Event) => void;
}

export const defaultOptionRules = createDefaultOptionRules<CheckBoxProps>([{
  device: (): boolean => devices.real().deviceType === 'desktop' && !devices.isSimulator(),
  options: { focusStateEnabled: true },
}]);

@Component({
  defaultOptionRules,
  jQuery: {
    component: BaseComponent,
    register: true,
  },
  view: viewFunction,
})

export class CheckBox extends JSXComponent(CheckBoxProps) {
  @Ref() editorRef!: RefObject<Editor>;

  @Ref() iconRef!: RefObject<HTMLDivElement>;

  @Method()
  focus(): void {
    this.editorRef.current!.focus();
  }

  @Effect()
  updateIconFontSize(): EffectReturn {
    const iconElement = this.iconRef?.current;
    const { iconSize } = this.props;

    if (iconElement && hasWindow()) {
      const isCompactTheme = current()?.includes('compact');
      const defaultFontSize = isCompactTheme ? 12 : 16;
      const isMaterialTheme = isMaterial(current());
      let defaultIconSize = isMaterialTheme ? 18 : 22;
      if (isCompactTheme) {
        defaultIconSize = 16;
      }
      const iconFontSizeRatio = defaultFontSize / defaultIconSize;

      const getIconComputedStyle = (): CSSStyleDeclaration => {
        const computedStyle = getElementComputedStyle(iconElement) ?? { width: `${defaultIconSize}px`, height: `${defaultIconSize}px` } as CSSStyleDeclaration;
        return computedStyle;
      };

      const computedIconSize = typeof iconSize === 'number' ? iconSize : parseInt(getIconComputedStyle().width, 10);
      const computedFontSize = `${Math.ceil(computedIconSize * iconFontSizeRatio)}px`;

      iconElement.style.fontSize = computedFontSize;
    }

    return undefined;
  }

  onWidgetClick(event: Event): void {
    const { readOnly, saveValueChangeEvent } = this.props;
    const value = this.props.value ?? false;

    if (!readOnly) {
      saveValueChangeEvent?.(event);
      this.props.value = !value;
    }
  }

  onWidgetKeyDown(e: {
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

  get iconStyles(): { [key: string]: string | number } {
    const { iconSize } = this.props;
    const width = normalizeStyleProp('width', iconSize);
    const height = normalizeStyleProp('height', iconSize);

    return { height, width };
  }

  get cssClasses(): string {
    return getCssClasses(this.props);
  }

  get aria(): Record<string, string> {
    const { value } = this.props;
    const checked = value === true;
    const indeterminate = value === null;

    return {
      role: 'checkbox',
      checked: indeterminate ? 'mixed' : `${checked}`,
    };
  }
}
