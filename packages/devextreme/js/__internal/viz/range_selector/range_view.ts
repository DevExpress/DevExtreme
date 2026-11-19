/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable @typescript-eslint/prefer-optional-chain */

import type { ThemeValue } from '@ts/viz/core/base_theme_manager';

interface RangeViewParams {
  renderer: ThemeValue;
  root: ThemeValue;
}

interface RangeViewCanvas {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface RangeViewSeriesDataSource {
  getSeries: () => ThemeValue[];
  adjustSeriesDimensions: () => void;
  getBoundRange: () => { arg: ThemeValue; val: ThemeValue };
  isShowChart: () => boolean;
}

function drawSeriesView(
  root: ThemeValue,
  seriesDataSource: RangeViewSeriesDataSource,
  canvas: RangeViewCanvas,
  isAnimationEnabled: boolean,
): void {
  const seriesList = seriesDataSource.getSeries();
  if (!seriesList.length) {
    return;
  }

  const valueAxis = seriesList[0].getValueAxis();

  valueAxis.updateCanvas({
    top: canvas.top,
    bottom: 0,
    height: canvas.height + canvas.top,
  });
  seriesDataSource.adjustSeriesDimensions();
  const valueRange = seriesDataSource.getBoundRange().val;
  valueRange.sortCategories(valueAxis.getCategoriesSorter());
  valueAxis.setBusinessRange(valueRange);

  seriesList.forEach((series) => {
    series._extGroups.labelsGroup = root;
    series._extGroups.seriesGroup = root;
    series.draw(isAnimationEnabled);
  });
}

function merge(a: ThemeValue, b: ThemeValue): ThemeValue {
  return a !== undefined ? a : b;
}

// eslint-disable-next-line import/no-mutable-exports -- description seam for tests
export let RangeView = class RangeView {
  declare _params: RangeViewParams;

  declare _clipRect: ThemeValue;

  constructor(params: RangeViewParams) {
    this._params = params;
    this._clipRect = params.renderer.clipRect();
    params.root.attr({ 'clip-path': this._clipRect.id });
  }

  update(
    backgroundOption: ThemeValue,
    backgroundTheme: ThemeValue,
    canvas: RangeViewCanvas,
    isCompactMode: boolean,
    isAnimationEnabled: boolean,
    seriesDataSource?: RangeViewSeriesDataSource,
  ): void {
    const { renderer, root } = this._params;
    const canvasWidth = canvas.width - canvas.left;
    let seriesGroup;

    const background = backgroundOption || {};
    root.clear();
    this._clipRect.attr({
      x: canvas.left, y: canvas.top, width: canvasWidth, height: canvas.height,
    });
    if (!isCompactMode) {
      if (merge(background.visible, backgroundTheme.visible)) {
        if (background.color) {
          renderer
            .rect(canvas.left, canvas.top, canvasWidth + 1, canvas.height)
            .attr({
              // Seems that "backgroundTheme.color" is never used and so can be removed both from
              // here and from themes
              // TODO: Check it (special attention to WidgetsGallery) and remove the option
              fill: merge(background.color, backgroundTheme.color),
              class: 'dx-range-selector-background',
            })
            .append(root);
        }
        if (background.image && background.image.url) {
          renderer.image(
            canvas.left,
            canvas.top,
            canvasWidth + 1,
            canvas.height,
            background.image.url,
            merge(background.image.location, backgroundTheme.image.location),
          ).append(root);
        }
      }
      if (seriesDataSource && seriesDataSource.isShowChart()) {
        seriesGroup = renderer.g().attr({ class: 'dxrs-series-group' }).append(root);
        drawSeriesView(seriesGroup, seriesDataSource, canvas, isAnimationEnabled);
      }
    }
  }
};

/// #DEBUG
/* eslint-disable-next-line @typescript-eslint/naming-convention
  -- description seam setter for tests stubs */
export function DEBUG_set_RangeView(value: typeof RangeView): void {
  RangeView = value;
}
/// #ENDDEBUG
