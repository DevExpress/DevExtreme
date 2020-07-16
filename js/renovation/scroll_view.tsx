import {
  Component,
  ComponentBindings,
  JSXComponent,
  Slot,
  OneWay,
} from 'devextreme-generator/component_declaration/common';

export const viewFunction = (viewModel: ScrollView) => (
  <div className={viewModel.cssClasses}>
    <div className="dx-scrollable-wrapper">
      <div className="dx-scrollable-container">
        <div className="dx-scrollable-content">
          {viewModel.props.children}
        </div>
      </div>
    </div>
  </div>
);

@ComponentBindings()
export class ScrollViewProps {
  @Slot() children?: any;

  @OneWay() direction?: 'both' | 'horizontal' | 'vertical' = 'vertical';
}

@Component({
  view: viewFunction,
})

export default class ScrollView extends JSXComponent(ScrollViewProps) {
  get cssClasses(): string {
    const { direction } = this.props;
    return `dx-scrollview dx-scrollable dx-scrollable-${direction} dx-scrollable-native dx-scrollable-native-generic`;
  }
}
