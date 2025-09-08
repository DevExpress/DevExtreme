/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { computed } from '@ts/core/state_manager/index';
import { ColumnChooserView } from '@ts/grids/new/grid_core/column_chooser/index';
import { View } from '@ts/grids/new/grid_core/core/view';
import { FilterPanelView } from '@ts/grids/new/grid_core/filtering/filter_panel/view';
import { HeaderFilterPopupView } from '@ts/grids/new/grid_core/filtering/header_filter/index';
import { KeyboardNavigationController } from '@ts/grids/new/grid_core/keyboard_navigation/index';
import { PagerView } from '@ts/grids/new/grid_core/pager/view';
import { ToolbarView } from '@ts/grids/new/grid_core/toolbar/view';
import type { ComponentType, RefObject } from 'inferno';

import { A11yStatusContainer, AccessibilityController } from '../grid_core/accessibility/index';
import { CommonPropsContext } from '../grid_core/core/common_props_context';
import type { Config } from '../grid_core/core/config_context';
import { ConfigContext } from '../grid_core/core/config_context';
import { EditPopupView } from '../grid_core/editing/popup/view';
import { RootElementUpdater } from '../grid_core/inferno_wrappers/root_element_updater';
import { ContentView } from './content_view/view';
import { ContextMenuView } from './context_menu/view';
import { HeaderPanelView } from './header_panel/view';
import { OptionsController } from './options_controller';

const CLASSES = {
  cardView: 'dx-cardview',
};

interface MainViewProps {
  Toolbar: ComponentType;
  Content: ComponentType;
  Pager: ComponentType;
  HeaderPanel: ComponentType;
  HeaderFilterPopup: ComponentType;
  FilterPanel: ComponentType;
  ColumnChooser: ComponentType;
  EditPopup: ComponentType;
  ContextMenu: ComponentType;
  config: Config;
  commonProps: {
    rootElementRef: RefObject<HTMLDivElement>;
  };
  accessibilityDescription: string;
  accessibilityStatus: string;
  onKeyDown: (event: KeyboardEvent) => void;
}

function MainViewComponent({
  Toolbar,
  Content,
  Pager,
  HeaderPanel,
  HeaderFilterPopup,
  FilterPanel,
  ColumnChooser,
  ContextMenu,
  EditPopup,
  config,
  commonProps,
  accessibilityDescription,
  accessibilityStatus,
  onKeyDown,
}: MainViewProps): JSX.Element {
  return (<>
    <ConfigContext.Provider value={config}>
      <CommonPropsContext.Provider value={commonProps}>
        <RootElementUpdater
          rootElementRef={commonProps.rootElementRef}
          className={CLASSES.cardView}
        >
          <div
            class="dx-cardview-root-container"
            role='group'
            aria-label={accessibilityDescription}
            onKeyDown={onKeyDown}
          >
            <A11yStatusContainer statusText={accessibilityStatus} />
            <div class="dx-cardview-header-container">
              <Toolbar/>
              <HeaderPanel/>
            </div>
            <Content/>
            <FilterPanel/>
            <div>
              {/*
                Pager, as renovated component, has strange disposing.
                See `inferno_renderer.remove` method.
                It somehow mutates $V prop of parent element.
                Without this div, CardView would be parent of Pager.
                In this case all `componentWillUnmount`s aren't called
              */}
              <Pager/>
            </div>
            <HeaderFilterPopup />
            <EditPopup/>
            <ColumnChooser/>
            <ContextMenu/>
          </div>
        </RootElementUpdater>
      </CommonPropsContext.Provider>
    </ConfigContext.Provider>
  </>);
}

export class MainView extends View<MainViewProps> {
  protected override component = MainViewComponent;

  private readonly config = computed(() => ({
    rtlEnabled: this.options.oneWay('rtlEnabled').value,
    disabled: this.options.oneWay('disabled').value,
    templatesRenderAsynchronously: this.options.oneWay('templatesRenderAsynchronously').value,
  }));

  private readonly commonProps = {
    rootElementRef: { current: this.root! },
  };

  public static dependencies = [
    ContentView,
    PagerView,
    ToolbarView,
    HeaderPanelView,
    HeaderFilterPopupView,
    FilterPanelView,
    ColumnChooserView,
    EditPopupView,
    ContextMenuView,
    OptionsController,
    KeyboardNavigationController,
    AccessibilityController,
  ] as const;

  constructor(
    private readonly content: ContentView,
    private readonly pager: PagerView,
    private readonly toolbar: ToolbarView,
    private readonly headerPanel: HeaderPanelView,
    private readonly headerFilterPopup: HeaderFilterPopupView,
    private readonly filterPanel: FilterPanelView,
    private readonly columnsChooser: ColumnChooserView,
    private readonly editPopup: EditPopupView,
    private readonly contextMenu: ContextMenuView,
    private readonly options: OptionsController,
    private readonly keyboardNavigation: KeyboardNavigationController,
    private readonly accessibility: AccessibilityController,
  ) {
    super();
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
  protected override getProps() {
    this.commonProps.rootElementRef.current = this.root!;

    return computed(() => ({
      Toolbar: this.toolbar.asInferno(),
      Content: this.content.asInferno(),
      Pager: this.pager.asInferno(),
      HeaderPanel: this.headerPanel.asInferno(),
      HeaderFilterPopup: this.headerFilterPopup.asInferno(),
      FilterPanel: this.filterPanel.asInferno(),
      ColumnChooser: this.columnsChooser.asInferno(),
      EditPopup: this.editPopup.asInferno(),
      ContextMenu: this.contextMenu.asInferno(),
      config: this.config.value,
      commonProps: this.commonProps,
      onKeyDown: (event: KeyboardEvent): void => {
        this.keyboardNavigation.onKeyDown(event);
      },
      accessibilityDescription: this.accessibility.componentDescription.value,
      accessibilityStatus: this.accessibility.componentStatus.value,
    }));
  }
}
