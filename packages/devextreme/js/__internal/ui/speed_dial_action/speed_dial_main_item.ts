import type { HorizontalAlignment } from '@js/common';
import type { PositionConfig } from '@js/common/core/animation';
import eventsEngine from '@js/common/core/events/core/events_engine';
import config from '@js/core/config';
import type Guid from '@js/core/guid';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { getHeight } from '@js/core/utils/size';
import type {
  DxEvent,
  PointerInteractionEvent,
} from '@js/events';
import {
  current, isCompact, isFluent, isMaterial,
} from '@js/ui/themes';
import errors from '@js/ui/widget/ui.errors';
import swatchContainer from '@ts/core/utils/swatch_container';
import type { OptionChanged } from '@ts/core/widget/types';

import type SpeedDialAction from './speed_dial_action';
import type { FloatingActionButtonPosition, SpeedDialItemProperties } from './speed_dial_item';
import SpeedDialItem from './speed_dial_item';

const { getSwatchContainer } = swatchContainer;

const FAB_MAIN_CLASS = 'dx-fa-button-main';
const FAB_MAIN_CLASS_WITH_LABEL = 'dx-fa-button-with-label';
const FAB_MAIN_CLASS_WITHOUT_ICON = 'dx-fa-button-without-icon';
const FAB_CLOSE_ICON_CLASS = 'dx-fa-button-icon-close';
const INVISIBLE_STATE_CLASS = 'dx-state-invisible';

type SpeedDialActionPosition = Omit<PositionConfig, 'of'> & {
  of?: PositionConfig['of'] | dxElementWrapper | null;
};

let speedDialMainItem: SpeedDialMainItem | null = null;

const modifyActionOptions = (action: SpeedDialAction): SpeedDialItemProperties => {
  const {
    animation,
    actionComponent,
    actionVisible,
    actions,
    activeStateEnabled,
    direction,
    elementAttr,
    hint,
    hoverStateEnabled,
    icon,
    id,
    index,
    label,
    onClick,
    onContentReady,
    parentPosition,
    position,
    visible,
    zIndex,
  } = action.option();

  const actionOptions: SpeedDialItemProperties = extend({}, {
    animation,
    actionComponent,
    actionVisible,
    actions,
    activeStateEnabled,
    direction,
    elementAttr,
    hint,
    hoverStateEnabled,
    icon,
    id,
    index,
    label,
    onClick,
    onContentReady,
    parentPosition,
    position,
    visible,
    zIndex,
  }, {
    onInitialized: null,
    onDisposing: null,
  });

  return actionOptions;
};

export interface SpeedDialMainItemProperties extends SpeedDialItemProperties {
  maxSpeedDialActionCount: number;

  closeIcon?: string;

  indent?: number;

  childIndent?: number;

  childOffset?: number;
}

class SpeedDialMainItem extends SpeedDialItem<SpeedDialMainItemProperties> {
  _isShadingShown?: boolean;

  _$closeIcon!: dxElementWrapper;

  _$icon!: dxElementWrapper;

  _actionItems?: SpeedDialItem[];

  _getDefaultOptions(): SpeedDialMainItemProperties {
    const defaultOptions: Partial<SpeedDialMainItemProperties> = {
      icon: 'add',
      closeIcon: 'close',
      position: {
        at: 'right bottom',
        my: 'right bottom',
        offset: {
          x: -16,
          y: -16,
        },
      },
      maxSpeedDialActionCount: 5,
      hint: '',
      label: '',
      direction: 'auto',
      actions: [],
      activeStateEnabled: true,
      hoverStateEnabled: true,
      indent: isCompact(current()) ? 49 : 55,
      childIndent: 40,
      childOffset: isCompact(current()) ? 2 : 9,
      callOverlayRenderShading: true,
      hideOnOutsideClick: true,
    };

    return {
      ...super._getDefaultOptions(),
      ...defaultOptions,
      ...config().floatingActionButtonConfig,
      shading: false,
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<SpeedDialMainItemProperties>[] {
    const rules: DefaultOptionsRule<SpeedDialMainItemProperties>[] = [
      {
        device(): boolean {
          return isFluent(current()) && !isCompact(current());
        },
        options: {
          indent: 60,
          childIndent: 60,
          childOffset: 0,
        },
      },
      {
        device(): boolean {
          return isFluent(current()) && isCompact(current());
        },
        options: {
          indent: 48,
          childIndent: 48,
          childOffset: 0,
        },
      },
      {
        device(): boolean {
          return isMaterial(current()) && !isCompact(current());
        },
        options: {
          indent: 72,
          childIndent: 56,
          childOffset: 8,
        },
      },
      {
        device(): boolean {
          return isMaterial(current()) && isCompact(current());
        },
        options: {
          indent: 58,
          childIndent: 48,
          childOffset: 1,
        },
      },
    ];

    return super._defaultOptionsRules().concat(rules);
  }

  _render(): void {
    this.$element().addClass(FAB_MAIN_CLASS);
    super._render();
    this._moveToContainer();
    this._renderCloseIcon();
    this._renderClick();
  }

  _renderLabel(): void {
    super._renderLabel();
    this.$element().toggleClass(FAB_MAIN_CLASS_WITH_LABEL, !!this._$label);
  }

  _renderIcon(): void {
    super._renderIcon();

    const { icon } = this.option();

    this.$element().toggleClass(FAB_MAIN_CLASS_WITHOUT_ICON, !icon);
  }

  _renderCloseIcon(): void {
    this._$closeIcon = this._renderButtonIcon(
      this._$closeIcon,
      this._options.silent('closeIcon'),
      FAB_CLOSE_ICON_CLASS,
    );

    this._$closeIcon.addClass(INVISIBLE_STATE_CLASS);
  }

  _renderClick(): void {
    this._clickAction = this._getVisibleActions().length === 1
      ? this._getActionComponent()._createActionByOption('onClick')
      : this._createAction(this._clickHandler.bind(this));

    this._setClickAction();
  }

  _getVisibleActions(actions?: SpeedDialAction[]): SpeedDialAction[] {
    const { actions: ownActions } = this.option();
    const currentActions = actions ?? ownActions ?? [];

    return currentActions.filter((action) => {
      const { visible = false } = action.option();

      return visible;
    });
  }

  _getCurrentOptions(actions: SpeedDialAction[]): SpeedDialItemProperties {
    const visibleActions = this._getVisibleActions(actions);

    const currentOptions: SpeedDialItemProperties = visibleActions.length === 1
      ? extend(modifyActionOptions(visibleActions[0]), { position: this._getPosition() })
      : extend(this._getDefaultOptions(), { visible: visibleActions.length !== 0 });

    return currentOptions;
  }

  _clickHandler(): void {
    const actions = (this._actionItems ?? [])
      .filter((action) => {
        const { actionVisible = false } = action.option();

        return actionVisible;
      })
      .sort((action, nextAction) => {
        const { index: actionIndex = 0 } = action.option();
        const { index: nextActionIndex = 0 } = nextAction.option();

        return actionIndex - nextActionIndex;
      });

    if (actions.length === 1) return;

    const lastActionIndex = actions.length - 1;

    for (let i = 0; i < actions.length; i += 1) {
      actions[i].option('animation', this._getActionAnimation(actions[i], i, lastActionIndex));
      actions[i].option('position', this._getActionPosition(actions, i));
      actions[i]._$wrapper.css('position', this._$wrapper.css('position') ?? '');
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      actions[i].toggle();
    }

    if (config().floatingActionButtonConfig?.shading) {
      const { shading = false } = this.option();

      this._isShadingShown = !shading;
      this.option('shading', this._isShadingShown);
    }

    this._$icon.toggleClass(INVISIBLE_STATE_CLASS);
    this._$closeIcon.toggleClass(INVISIBLE_STATE_CLASS);
  }

  _updateZIndexStackPosition(): void {
    super._updateZIndexStackPosition();

    const overlayStack = this._overlayStack();

    overlayStack.push(this);
  }

  _renderActions(): void {
    const { actions = [] } = this.option();
    const minActionButtonCount = 1;

    if (this._actionItems?.length) {
      this._actionItems.forEach((actionItem) => {
        actionItem.dispose();
        actionItem.$element().remove();
      });
    }

    const actionItems: SpeedDialItem[] = [];

    this._actionItems = actionItems;

    if (actions.length === minActionButtonCount) return;

    for (const action of actions) {
      const $actionElement = $('<div>')
        .appendTo(getSwatchContainer(action.$element()));

      eventsEngine.off($actionElement, 'click');
      eventsEngine.on($actionElement, 'click', () => {
        this._clickHandler();
      });

      action._options.silent('actionComponent', action);
      action._options.silent('parentPosition', this._getPosition());
      action._options.silent('actionVisible', action._options.silent('visible'));

      actionItems.push(this._createComponent(
        $actionElement,
        SpeedDialItem,
        extend({}, modifyActionOptions(action), { visible: false }),
      ));
    }
  }

  _getActionAnimation(
    action: SpeedDialItem,
    index: number,
    lastActionIndex: number,
  ): SpeedDialItemProperties['animation'] {
    const actionAnimationDelay = 30;

    action._options.silent('animation.show.delay', actionAnimationDelay * index);
    action._options.silent('animation.hide.delay', actionAnimationDelay * (lastActionIndex - index));

    const animation: SpeedDialItemProperties['animation'] = action._options.silent('animation');

    return animation;
  }

  _getDirectionIndex(
    actions: SpeedDialItem[],
    direction: SpeedDialItemProperties['direction'],
  ): number {
    const directionIndex = 1;

    if (direction === 'auto') {
      const contentHeight = getHeight(this.$content());
      const indent = this.initialOption('indent') as unknown as number;
      const childIndent = this.initialOption('childIndent') as unknown as number;
      const actionsHeight = indent + childIndent * actions.length - contentHeight;
      const offsetTop = this.$content()?.offset()?.top ?? 0;

      if (actionsHeight < offsetTop) {
        return -directionIndex;
      }

      // @ts-expect-error _$wrapperCoveredElement does not exist on OverlayPositionController
      const offsetBottom = getHeight(this._positionController._$wrapperCoveredElement)
        - contentHeight - offsetTop;

      return offsetTop >= offsetBottom ? -directionIndex : directionIndex;
    }

    return direction !== 'down' ? -directionIndex : directionIndex;
  }

  _getActionPosition(actions: SpeedDialItem[], index: number): SpeedDialActionPosition {
    const action = actions[index];
    const hasActionLabel = Boolean(action._options.silent('label'));

    const actionOffsetXValue = this.initialOption('childOffset') as unknown as number;
    let actionOffsetX = 0;

    if (hasActionLabel && !this._$label) {
      actionOffsetX = this._isPositionLeft(this._getPosition())
        ? actionOffsetXValue
        : -actionOffsetXValue;
    }

    const indent = this.initialOption('indent') as unknown as number;
    const childIndent = this.initialOption('childIndent') as unknown as number;
    const actionOffsetYValue = indent + childIndent * index;
    const { direction } = this.option();
    const actionOffsetY = this._getDirectionIndex(actions, direction) * actionOffsetYValue;

    let actionPositionAtMy: HorizontalAlignment = 'center';

    if (hasActionLabel) {
      actionPositionAtMy = this._isPositionLeft(this._getPosition()) ? 'left' : 'right';
    }

    return {
      of: this.$content(),
      at: actionPositionAtMy,
      my: actionPositionAtMy,
      offset: {
        x: actionOffsetX,
        y: actionOffsetY,
      },
    };
  }

  _outsideClickHandler(e: DxEvent<PointerInteractionEvent>): void {
    if (this._isShadingShown) {
      const isShadingClick = $(e.target)[0] === this._$wrapper[0];

      if (isShadingClick) {
        e.preventDefault();
        this._clickHandler();
      }
    }
  }

  _setPosition(): void {
    const { visible } = this.option();

    if (visible) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._hide();
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this._show();
    }
  }

  _getPosition(): FloatingActionButtonPosition {
    return this._getDefaultOptions().position;
  }

  _getInkRippleContainer(): dxElementWrapper | null | undefined {
    return this.$content();
  }

  _optionChanged(args: OptionChanged<SpeedDialMainItemProperties>): void {
    switch (args.name) {
      case 'actions':
        if (this._isVisible()) {
          this._renderIcon();
          this._renderLabel();
        }
        this._renderCloseIcon();
        this._renderClick();
        this._renderActions();
        break;
      case 'maxSpeedDialActionCount':
        this._renderActions();
        break;
      case 'closeIcon':
        this._renderCloseIcon();
        break;
      case 'position':
        super._optionChanged(args);
        this._setPosition();
        break;
      case 'label':
        if (this._isVisible()) this._renderLabel();
        this._setPosition();
        break;
      case 'icon':
        if (this._isVisible()) this._renderIcon();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export function initAction(newAction: SpeedDialAction): void {
  // TODO: workaround for Angular/React/Vue
  newAction._options.silent('onInitializing', null);

  let isActionExist = false;

  if (!speedDialMainItem) {
    const $fabMainElement = $('<div>')
      .appendTo(getSwatchContainer(newAction.$element()));

    speedDialMainItem = newAction._createComponent(
      $fabMainElement,
      SpeedDialMainItem,
      extend({}, modifyActionOptions(newAction), {
        actions: [newAction],
      }),
    );
  } else {
    const { actions: savedActions = [] } = speedDialMainItem.option();

    savedActions.forEach((action) => {
      if (action._options.silent('id') === newAction._options.silent('id')) {
        isActionExist = true;
      }
    });

    // @ts-expect-error position does not exist on Options
    delete speedDialMainItem._options.position;

    if (!isActionExist) {
      const { maxSpeedDialActionCount } = speedDialMainItem.option();

      if (speedDialMainItem._getVisibleActions(savedActions).length >= maxSpeedDialActionCount) {
        newAction.dispose();
        errors.log('W1014');
        return;
      }

      savedActions.push(newAction);

      speedDialMainItem.option(extend(speedDialMainItem._getCurrentOptions(savedActions), {
        actions: savedActions,
      }));
    } else if (savedActions.length === 1) {
      speedDialMainItem.option(extend({}, modifyActionOptions(savedActions[0]), {
        actions: savedActions,
        position: speedDialMainItem._getPosition(),
      }));
    } else {
      speedDialMainItem.option(extend(speedDialMainItem._getCurrentOptions(savedActions), {
        actions: savedActions,
      }));
    }
  }
}

export function disposeAction(actionId: Guid | undefined): void {
  if (!speedDialMainItem) return;

  const { actions = [] } = speedDialMainItem.option();

  const savedActions = actions.filter((action) => action._options.silent('id') !== actionId);

  if (actions.length === savedActions.length) return;

  if (!savedActions.length) {
    speedDialMainItem.dispose();
    speedDialMainItem.$element().remove();
    speedDialMainItem = null;
  } else if (savedActions.length === 1) {
    speedDialMainItem.option(extend({}, modifyActionOptions(savedActions[0]), {
      actions: savedActions,
    }));
  } else {
    speedDialMainItem.option({
      actions: savedActions,
    });
  }
}

export function repaint(): void {
  if (!speedDialMainItem) return;

  const defaultOptions = speedDialMainItem._getDefaultOptions();
  const visibleActions = speedDialMainItem._getVisibleActions();
  const isSingleActionVisible = visibleActions.length === 1;

  const icon = isSingleActionVisible
    ? visibleActions[0].option().icon
    : defaultOptions.icon;

  const label = isSingleActionVisible
    ? visibleActions[0].option().label
    : defaultOptions.label;

  const { actions } = speedDialMainItem.option();

  speedDialMainItem.option({
    actions,
    icon,
    closeIcon: defaultOptions.closeIcon,
    position: speedDialMainItem._getPosition(),
    label,
    maxSpeedDialActionCount: defaultOptions.maxSpeedDialActionCount,
    direction: defaultOptions.direction,
  });
}
