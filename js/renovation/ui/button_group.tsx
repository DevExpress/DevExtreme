import {
  Component,
  ComponentBindings,
  Effect,
  Event,
  JSXComponent,
  Method,
  TwoWay,
  OneWay,
  Ref,
  Template,
  Slot,
  RefObject,
} from '@devextreme-generator/declarations';
// import { createDefaultOptionRules } from '../../core/options/utils';
// import devices from '../../core/devices';
// import { isMaterial, current } from '../../ui/themes';
// import { click } from '../../events/short';
import { isDefined } from '../../core/utils/type';
import { combineClasses } from '../utils/combine_classes';
// import { Icon } from './common/icon';
import { Widget } from './common/widget';
import { BaseWidgetProps } from './common/base_props';
import { ButtonCollection } from './button_group/button_collection';
import dxButtonGroupItem from '../../ui/button_group';
// import BaseComponent from '../component_wrapper/button';
// import { EffectReturn } from '../utils/effect_return.d';

// const stylingModes = ['outlined', 'text', 'contained'];

export const viewFunction = (viewModel: ButtonGroup): JSX.Element => {
  const {
    widgetRef, cssClasses, onItemClick, onSelectionChanged, selectedItemKeysChange,
    selectedItemsChange, selectedItems,
    props: {
      accessKey, activeStateEnabled, focusStateEnabled, hoverStateEnabled,
      disabled, height, width, rtlEnabled, hint, visible, tabIndex,
      stylingMode, selectionMode, keyExpr, buttonTemplate, items, selectedItemKeys,
    },
    restAttributes,
  } = viewModel;

  //   const {
  //     children, icon, iconPosition, template: ButtonTemplate, text,
  //   } = viewModel.props;
  //   const renderText = !ButtonTemplate && !children && text;
  //   const isIconLeft = iconPosition === 'left';
  //   const iconComponent = !ButtonTemplate && !children && viewModel.iconSource
  //           && <Icon source={viewModel.iconSource} position={iconPosition} />;

  return (
    <Widget // eslint-disable-line jsx-a11y/no-access-key
      ref={widgetRef}
      classes={cssClasses}
      aria={{ role: 'group' }}
      accessKey={accessKey}
      activeStateEnabled={activeStateEnabled}
      focusStateEnabled={focusStateEnabled}
      hoverStateEnabled={hoverStateEnabled}
      disabled={disabled}
      height={height}
      width={width}
      rtlEnabled={rtlEnabled}
      hint={hint}
      visible={visible}
      tabIndex={tabIndex}

    //   onActive={viewModel.onActive}
    //   onContentReady={viewModel.props.onContentReady}
    //   onClick={viewModel.onWidgetClick}
    //   onInactive={viewModel.onInactive}
    //   onKeyDown={viewModel.onWidgetKeyDown}
      {...restAttributes} // eslint-disable-line react/jsx-props-no-spreading
    >
      <ButtonCollection
        className="dx-buttongroup-wrapper"
        stylingMode={stylingMode}
        selectionMode={selectionMode}
        keyExpr={keyExpr}
        buttonTemplate={buttonTemplate}
        items={items}
        tabIndex={tabIndex}
        focusStateEnabled={focusStateEnabled}
        hoverStateEnabled={hoverStateEnabled}
        activeStateEnabled={activeStateEnabled}
        scrollingEnabled={false}
        selectionRequired={false}
        // accessKey={accessKey} // TODO
        noDataText=""
        selectedItems={selectedItems}
        selectedItemsChange={selectedItemsChange}
        selectedItemKeys={selectedItemKeys}
        selectedItemKeysChange={selectedItemKeysChange}
        onItemClick={onItemClick}
        onSelectionChanged={onSelectionChanged}
        // onItemRendered={(): void => { debugger; }}
      />
      {/* <div className="dx-button-content" ref={viewModel.contentRef}> */}
      {/* {ButtonTemplate && (<ButtonTemplate data={{ icon, text }} />)}
        {!ButtonTemplate && children} */}
      {/* {isIconLeft && iconComponent} */}
      {/* {renderText && (<span className="dx-button-text">{text}</span>)} */}
      {/* {!isIconLeft && iconComponent}
        {viewModel.props.useSubmitBehavior
                  && <input ref={viewModel.submitInputRef} type="submit" tabIndex={-1} className="dx-button-submit-input" />} */}
      {/* </div> */}
    </Widget>
  );
};

@ComponentBindings()
export class ButtonGroupProps extends BaseWidgetProps {
  @OneWay() focusStateEnabled?: boolean = true;

  @OneWay() activeStateEnabled?: boolean = true;

  @OneWay() hoverStateEnabled?: boolean = true;

  @OneWay() stylingMode: 'outlined' | 'text' | 'contained' = 'contained';

  @OneWay() selectionMode: 'single' | 'multiple' = 'single';

  @OneWay() keyExpr = 'text';

  @OneWay() buttonTemplate = 'content';

  @OneWay() items?: dxButtonGroupItem[] = [];

  @TwoWay() selectedItems: any[] = [];

  @TwoWay() selectedItemKeys: any[] = [];

  // @Event() selectedItemKeysChange?: (selectedItemKey: unknown) => void;

  //   @Event({
  //     actionConfig: { excludeValidators: ['readOnly'] },
  //   })

  @Event() onSelectionChanged?: (addedItems: any, removedItems: any) => void = null;

  @Event() onItemClick?: (e: { event: Event }) => void;

  @Template() template?: (props: { data: { icon?: string; text?: string } }) => JSX.Element;

  @Slot() children?: JSX.Element;
}

// export const defaultOptionRules = createDefaultOptionRules<ButtonProps>([{
//   device: (): boolean => devices.real().deviceType === 'desktop' && !devices.isSimulator(),
//   options: { focusStateEnabled: true },
// }, {
//   // eslint-disable-next-line import/no-named-as-default-member
//   device: (): boolean => isMaterial(current()),
//   options: { useInkRipple: true },
// }]);
@Component({
  defaultOptionRules: null,
  jQuery: {
    register: true,
  },
  view: viewFunction,
})

export class ButtonGroup extends JSXComponent(ButtonGroupProps) {
//   @Ref() contentRef!: RefObject<HTMLDivElement>;

  //   @Ref() inkRippleRef!: RefObject<InkRipple>;

  @Ref() widgetRef!: RefObject<Widget>;

  //   @Effect()
  //   contentReadyEffect(): EffectReturn {
  //     // NOTE: we should trigger this effect on change each
  //     //       property upon which onContentReady depends
  //     //       (for example, text, icon, etc)
  //     const { onContentReady } = this.props;

  //     onContentReady?.({ element: this.contentRef.current!.parentNode });
  //   }

  //   @Method()
  //   focus(): void {
  //     this.widgetRef.current!.focus();
  //   }

  //   onActive(event: Event): void {
  //     const { useInkRipple } = this.props;

  //     useInkRipple && this.inkRippleRef.current!.showWave({
  //       element: this.contentRef.current, event,
  //     });
  //   }

  //   onInactive(event: Event): void {
  //     const { useInkRipple } = this.props;

  //     useInkRipple && this.inkRippleRef.current!.hideWave({
  //       element: this.contentRef.current, event,
  //     });
  //   }

  //   onWidgetClick(event: Event): void {
  //     const { onClick, useSubmitBehavior, validationGroup } = this.props;

  //     onClick?.({ event, validationGroup });
  //     useSubmitBehavior && this.submitInputRef.current!.click();
  //   }

  //   onWidgetKeyDown(options): Event | undefined {
  //     const { onKeyDown } = this.props;
  //     const { originalEvent, keyName, which } = options;

  //     const result = onKeyDown?.(options);
  //     if (result?.cancel) {
  //       return result;
  //     }

  //     if (keyName === 'space' || which === 'space' || keyName === 'enter' || which === 'enter') {
  //       originalEvent.preventDefault();
  //       this.onWidgetClick(originalEvent);
  //     }

  //     return undefined;
  //   }

  onItemClick(e): void {
    this.props.onItemClick?.(e);
  }

  onSelectionChanged(e): void {
    // this.props.selectedItems = e.addedItems;
    // this.props.selectedItemKeys = e.addedItems[this.props.keyExpr];
    this.props.onSelectionChanged?.(e.addedItems, e.removedItems);
  }

  selectedItemKeysChange(selectedItemKeys: unknown[]): void {
    // if (JSON.stringify(selectedItemKeys) !== JSON.stringify(this.props.selectedItemKeys)) {
    //   debugger;
    this.props.selectedItemKeys = selectedItemKeys;
    // }
  }

  selectedItemsChange(selectedItems: unknown[]): void {
    // if (JSON.stringify(selectedItemKeys) !== JSON.stringify(this.props.selectedItemKeys)) {
    //   debugger;
    this.props.selectedItems = selectedItems;
    // }
  }

  // eslint-disable-next-line class-methods-use-this
  get cssClasses(): string {
    return combineClasses({
      'dx-buttongroup': true,
    });
  }

  @Effect({ run: 'once' }) updateSelectedItemOnRender(): void {
    if (!isDefined(this.props.selectedItems)) {
      this.props.selectedItems = [];
    }
  }

  get selectedItems(): unknown[] | undefined {
    // if (isDefined(this.props.selectedItems) && this.props.selectedItems.length) {
    //   return this.props.selectedItems;
    // }

    // return undefined;
    return this.props.selectedItems;
  }

  //   get focusStateEnabled(): boolean {
  //     if (isDefined(this.props.focusStateEnabled)) {
  //       return !!this.props.focusStateEnabled;
  //     }

  //     return true;
  //   }

  //   get hoverStateEnabled(): boolean | undefined {
  //     if (isDefined(this.props.hoverStateEnabled)) {
  //       return !!this.props.hoverStateEnabled;
  //     }

//     return true;
//   }
}
