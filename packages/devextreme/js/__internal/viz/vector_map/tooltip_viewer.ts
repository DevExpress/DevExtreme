/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable func-names */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/prefer-optional-chain */

import type { ThemeValue } from '@ts/viz/core/base_theme_manager';

const TOOLTIP_OFFSET = 12;

interface FocusArg {
  data: { name: string; index: number };
  x: number;
  y: number;
  done: (result: boolean) => void;
}

interface TooltipTracker {
  on: (handlers: {
    'focus-on': (arg: FocusArg) => void;
    'focus-move': (arg: FocusArg) => void;
    'focus-off': () => void;
  }) => () => void;
}

interface ViewerTooltip {
  isEnabled: () => boolean;
  show: (
    target: ThemeValue,
    coords: { x: number; y: number; offset: number },
    eventData: { target: ThemeValue },
    customizeTooltip: ThemeValue,
    callback: (result: boolean) => void,
  ) => boolean;
  move: (x: number, y: number, offset: number) => void;
  hide: () => void;
}

interface ViewerLayerCollection {
  byName: (name: string) => { getProxy: (index: number) => ThemeValue } | undefined;
}

interface TooltipViewerParams {
  tracker: TooltipTracker;
  tooltip: ViewerTooltip;
  layerCollection: ViewerLayerCollection;
}

// TODO: Somehow it should be merged with the core.Tooltip
// eslint-disable-next-line import/no-mutable-exports -- description seam for tests
export let TooltipViewer = class TooltipViewer {
  declare _offTracker: () => void;

  constructor(params: TooltipViewerParams) {
    this._subscribeToTracker(params.tracker, params.tooltip, params.layerCollection);
  }

  dispose(): void {
    this._offTracker();
    // @ts-expect-error dispose releases the tracker subscription
    this._offTracker = null;
  }

  _subscribeToTracker(
    tracker: TooltipTracker,
    tooltip: ViewerTooltip,
    layerCollection: ViewerLayerCollection,
  ): void {
    this._offTracker = tracker.on({
      'focus-on': function (arg) {
        let layer;
        let proxy;
        if (tooltip.isEnabled()) {
          layer = layerCollection.byName(arg.data.name);
          proxy = layer && layer.getProxy(arg.data.index);
          const callback = (result: boolean): void => {
            result && arg.done(result);
          };
          proxy && callback(tooltip.show(proxy, { x: arg.x, y: arg.y, offset: TOOLTIP_OFFSET }, { target: proxy }, undefined, callback));
        }
      },
      // There are no checks for `tooltip.isEnabled()` in the following two handlers because they are called only if the previous one has finished with `true`
      'focus-move': function (arg) {
        tooltip.move(arg.x, arg.y, TOOLTIP_OFFSET);
      },
      'focus-off': function () {
        tooltip.hide();
      },
    });
  }
};

/// #DEBUG
/* eslint-disable-next-line @typescript-eslint/naming-convention
  -- description seam setter for tests stubs */
export function DEBUG_set_TooltipViewer(value: typeof TooltipViewer): void {
  TooltipViewer = value;
}
/// #ENDDEBUG
