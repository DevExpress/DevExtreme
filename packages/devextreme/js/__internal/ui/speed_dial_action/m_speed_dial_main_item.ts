import eventsEngine from '@js/common/core/events/core/events_engine';
import config from '@js/core/config';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { getHeight } from '@js/core/utils/size';
import { isCompact, isFluent, isMaterial } from '@js/ui/themes';
import swatchContainer from '@js/ui/widget/swatch_container';
import errors from '@js/ui/widget/ui.errors';

import type { Properties as SpeedDialItemProperties } from './m_speed_dial_item';
import SpeedDialItem from './m_speed_dial_item';

const { getSwatchContainer } = swatchContainer;

const FAB_MAIN_CLASS = 'dx-fa-button-main';
const FAB_MAIN_CLASS_WITH_LABEL = 'dx-fa-button-with-label';
const FAB_MAIN_CLASS_WITHOUT_ICON = 'dx-fa-button-without-icon';
const FAB_CLOSE_ICON_CLASS = 'dx-fa-button-icon-close';
const INVISIBLE_STATE_CLASS = 'dx-state-invisible';

let speedDialMainItem: SpeedDialMainItem | null = null;

const modifyActionOptions = (action) => {
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

  return extend({}, {
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
};

export interface Properties extends SpeedDialItemProperties {
  maxSpeedDialActionCount: number;
}

class SpeedDialMainItem extends SpeedDialItem {
  _isShadingShown?: boolean;

  _$closeIcon!: dxElementWrapper;

  _$icon!: dxElementWrapper;

  _actionItems?: any;

  _getDefaultOptions() {
    const defaultOptions = {
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
      // @ts-expect-error
      indent: isCompact() ? 49 : 55,
      childIndent: 40,
      // @ts-expect-error
      childOffset: isCompact() ? 2 : 9,
      callOverlayRenderShading: true,
      hideOnOutsideClick: true,
    };

    return extend(
      super._getDefaultOptions(),
      extend(defaultOptions, config().floatingActionButtonConfig, { shading: false }),
    );
  }

  _defaultOptionsRules() {
    return super._defaultOptionsRules().concat([
      {
        device() {
          // @ts-expect-error
          return isFluent() && !isCompact();
        },
        options: {
          indent: 60,
          childIndent: 60,
          childOffset: 0,
        },
      },
      {
        device() {
          // @ts-expect-error
          return isFluent() && isCompact();
        },
        options: {
          indent: 48,
          childIndent: 48,
          childOffset: 0,
        },
      },
      {
        device() {
          // @ts-expect-error
          return isMaterial() && !isCompact();
        },
        options: {
          indent: 72,
          childIndent: 56,
          childOffset: 8,
        },
      },
      {
        device() {
          // @ts-expect-error
          return isMaterial() && isCompact();
        },
        options: {
          indent: 58,
          childIndent: 48,
          childOffset: 1,
        },
      },
    ]);
  }

  _render() {
    this.$element().addClass(FAB_MAIN_CLASS);
    super._render();
    this._moveToContainer();
    this._renderCloseIcon();
    this._renderClick();
  }

  _renderLabel() {
    super._renderLabel();
    this.$element().toggleClass(FAB_MAIN_CLASS_WITH_LABEL, !!this._$label);
  }

  _renderIcon() {
    super._renderIcon();
    this.$element().toggleClass(FAB_MAIN_CLASS_WITHOUT_ICON, !this.option('icon'));
  }

  _renderCloseIcon() {
    this._$closeIcon = this._renderButtonIcon(
      this._$closeIcon,
      this._options.silent('closeIcon'),
      FAB_CLOSE_ICON_CLASS,
    );

    this._$closeIcon.addClass(INVISIBLE_STATE_CLASS);
  }

  _renderClick() {
    this._clickAction = this._getVisibleActions().length === 1
      ? this._getActionComponent()._createActionByOption('onClick')
      // @ts-expect-error
      : this._createAction(this._clickHandler.bind(this));

    this._setClickAction();
  }

  _getVisibleActions(actions?: any) {
    const currentActions = actions || this.option('actions');

    return currentActions.filter((action) => action.option('visible'));
  }

  _getCurrentOptions(actions) {
    const visibleActions = speedDialMainItem?._getVisibleActions(actions);

    const defaultOptions = this._getDefaultOptions();

    delete defaultOptions.closeOnOutsideClick;

    return visibleActions.length === 1
      ? extend(modifyActionOptions(visibleActions[0]), { position: this._getPosition() })
      : extend(defaultOptions, { visible: visibleActions.length !== 0 });
  }

  _clickHandler(): void {
    const actions = this._actionItems
      .filter((action) => action.option('actionVisible'))
      .sort((action, nextAction) => action.option('index') - nextAction.option('index'));

    if (actions.length === 1) return;

    const lastActionIndex = actions.length - 1;

    for (let i = 0; i < actions.length; i++) {
      actions[i].option('animation', this._getActionAnimation(actions[i], i, lastActionIndex));
      actions[i].option('position', this._getActionPosition(actions, i));
      // @ts-expect-error
      actions[i]._$wrapper.css('position', this._$wrapper.css('position'));
      actions[i].toggle();
    }

    if (config().floatingActionButtonConfig?.shading) {
      this._isShadingShown = !this.option('shading');
      this.option('shading', this._isShadingShown);
    }

    this._$icon.toggleClass(INVISIBLE_STATE_CLASS);
    this._$closeIcon.toggleClass(INVISIBLE_STATE_CLASS);
  }

  _updateZIndexStackPosition() {
    super._updateZIndexStackPosition();
    // @ts-expect-error
    const overlayStack = this._overlayStack();

    overlayStack.push(this);
  }

  _renderActions() {
    const actions = this.option('actions');
    const minActionButtonCount = 1;

    if (this._actionItems && this._actionItems.length) {
      this._actionItems.forEach((actionItem) => {
        actionItem.dispose();
        actionItem.$element().remove();
      });
      this._actionItems = [];
    }

    this._actionItems = [];

    if (actions.length === minActionButtonCount) return;

    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      const $actionElement = $('<div>')
        .appendTo(getSwatchContainer(action.$element()));

      eventsEngine.off($actionElement, 'click');
      eventsEngine.on($actionElement, 'click', () => {
        this._clickHandler();
      });

      action._options.silent('actionComponent', action);
      action._options.silent('parentPosition', this._getPosition());
      action._options.silent('actionVisible', action._options.silent('visible'));
      // @ts-expect-error
      this._actionItems.push(this._createComponent($actionElement, SpeedDialItem, extend({}, modifyActionOptions(action), { visible: false })));
    }
  }

  _getActionAnimation(action, index, lastActionIndex) {
    const actionAnimationDelay = 30;

    action._options.silent('animation.show.delay', actionAnimationDelay * index);
    action._options.silent('animation.hide.delay', actionAnimationDelay * (lastActionIndex - index));

    return action._options.silent('animation');
  }

  _getDirectionIndex(actions, direction) {
    const directionIndex = 1;

    if (direction === 'auto') {
      // @ts-expect-error
      const contentHeight = getHeight(this.$content());
      // @ts-expect-error
      const actionsHeight = this.initialOption('indent') + this.initialOption('childIndent') * actions.length - contentHeight;
      // @ts-expect-error
      const offsetTop = this.$content().offset().top;

      if (actionsHeight < offsetTop) {
        return -directionIndex;
      }
      // @ts-expect-error
      const offsetBottom = getHeight(this._positionController._$wrapperCoveredElement) - contentHeight - offsetTop;

      return offsetTop >= offsetBottom ? -directionIndex : directionIndex;
    }

    return direction !== 'down' ? -directionIndex : directionIndex;
  }

  _getActionPosition(actions, index) {
    const action = actions[index];
    // @ts-expect-error
    const actionOffsetXValue = this.initialOption('childOffset');
    const actionOffsetX = action._options.silent('label') && !this._$label
      ? this._isPositionLeft(this._getPosition()) ? actionOffsetXValue : -actionOffsetXValue
      : 0;
    // @ts-expect-error
    const actionOffsetYValue = this.initialOption('indent') + this.initialOption('childIndent') * index;
    const actionOffsetY = this._getDirectionIndex(actions, this.option('direction')) * actionOffsetYValue;

    const actionPositionAtMy = action._options.silent('label')
      ? this._isPositionLeft(this._getPosition()) ? 'left' : 'right'
      : 'center';

    return {
      // @ts-expect-error
      of: this.$content(),
      at: actionPositionAtMy,
      my: actionPositionAtMy,
      offset: {
        x: actionOffsetX,
        y: actionOffsetY,
      },
    };
  }

  _outsideClickHandler(e) {
    if (this._isShadingShown) {
      const isShadingClick = $(e.target)[0] === this._$wrapper[0];

      if (isShadingClick) {
        e.preventDefault();
        this._clickHandler();
      }
    }
  }

  _setPosition() {
    if (this.option('visible')) {
      // @ts-expect-error
      this._hide();
      // @ts-expect-error
      this._show();
    }
  }

  _getPosition() {
    return this._getDefaultOptions().position;
  }

  _getInkRippleContainer() {
    // @ts-expect-error
    return this.$content();
  }

  _optionChanged(args) {
    switch (args.name) {
      case 'actions':
        // @ts-expect-error
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
        // @ts-expect-error
        if (this._isVisible()) this._renderLabel();
        this._setPosition();
        break;
      case 'icon':
        // @ts-expect-error
        if (this._isVisible()) this._renderIcon();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export function initAction(newAction) {
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
    const savedActions = speedDialMainItem.option('actions');

    savedActions.forEach((action) => {
      if (action._options.silent('id') === newAction._options.silent('id')) {
        isActionExist = true;
        return newAction;
      }
    });

    delete speedDialMainItem._options.position;

    if (!isActionExist) {
      // @ts-expect-error
      if (speedDialMainItem._getVisibleActions(savedActions).length >= speedDialMainItem.option('maxSpeedDialActionCount')) {
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

export function disposeAction(actionId) {
  if (!speedDialMainItem) return;

  let savedActions = speedDialMainItem.option('actions');
  const savedActionsCount = savedActions.length;

  savedActions = savedActions.filter((action) => action._options.silent('id') !== actionId);

  if (savedActionsCount === savedActions.length) return;

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

export function repaint() {
  if (!speedDialMainItem) return;

  const visibleActions = speedDialMainItem._getVisibleActions();

  const icon = visibleActions.length === 1
    ? visibleActions[0].option('icon')
    : speedDialMainItem._getDefaultOptions().icon;

  const label = visibleActions.length === 1
    ? visibleActions[0].option('label')
    : speedDialMainItem._getDefaultOptions().label;
  // @ts-expect-error
  speedDialMainItem.option({
    actions: speedDialMainItem.option('actions'),
    icon,
    closeIcon: speedDialMainItem._getDefaultOptions().closeIcon,
    position: speedDialMainItem._getPosition(),
    label,
    maxSpeedDialActionCount: speedDialMainItem._getDefaultOptions().maxSpeedDialActionCount,
    direction: speedDialMainItem._getDefaultOptions().direction,
  });
}
