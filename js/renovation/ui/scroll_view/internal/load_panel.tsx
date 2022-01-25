import {
  JSXComponent,
  Component,
} from '@devextreme-generator/declarations';

import { isDefined } from '../../../../core/utils/type';
import messageLocalization from '../../../../localization/message';
import { LoadPanel } from '../../overlays/load_panel';
import { ScrollViewLoadPanelProps } from '../common/scrollview_loadpanel_props';

const SCROLLVIEW_LOADPANEL = 'dx-scrollview-loadpanel';

export const viewFunction = (viewModel: ScrollViewLoadPanel): JSX.Element => {
  const {
    refreshingText, position,
    props: { visible },
  } = viewModel;

  return (
    <LoadPanel
      className={SCROLLVIEW_LOADPANEL}
      shading={false}
      delay={400}
      message={refreshingText}
      position={position}
      visible={visible}
    />
  );
};

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export class ScrollViewLoadPanel extends JSXComponent<ScrollViewLoadPanelProps>() {
  get refreshingText(): string | undefined {
    const { refreshingText } = this.props;

    if (isDefined(refreshingText)) {
      return refreshingText;
    }

    return messageLocalization.format('dxScrollView-refreshingText');
  }

  get position(): { of: HTMLDivElement } | undefined {
    if (this.props.targetElement) {
      return { of: this.props.targetElement.current! };
    }

    return undefined;
  }
}
