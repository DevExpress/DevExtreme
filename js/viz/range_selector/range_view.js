"use strict";

var translator2DModule = require("../translators/translator2d");
// This method exists only to wrap "top-height" ugliness
function createTranslator(valueRange, screenRange) {
    return new translator2DModule.Translator2D(valueRange, { top: screenRange[0], height: screenRange[1] });
}

// TODO: Move it inside the "SeriesDataSource"
function drawSeriesView(root, seriesDataSource, translator, screenRange, isAnimationEnabled) {
    var seriesList = seriesDataSource.getSeries(),
        series,
        i,
        ii = seriesList.length,
        translators = {
            x: translator,
            // TODO: There should be something like "seriesDataSource.getValueRange()"
            y: createTranslator(seriesDataSource.getBoundRange().val, screenRange)
        };
    seriesDataSource.adjustSeriesDimensions(translators);
    for(i = 0; i < ii; ++i) {
        series = seriesList[i];
        series._extGroups.seriesGroup = series._extGroups.labelsGroup = root;
        series.draw(translators, isAnimationEnabled);
    }
}

function merge(a, b) {
    return a !== undefined ? a : b;
}

function RangeView(params) {
    this._params = params;
    this._clipRect = params.renderer.clipRect();
    params.root.attr({ "clip-path": this._clipRect.id });
}

RangeView.prototype = {
    constructor: RangeView,

    update: function(backgroundOption, backgroundTheme, canvas, isCompactMode, isAnimationEnabled, seriesDataSource) {
        var renderer = this._params.renderer,
            root = this._params.root,
            seriesGroup;
        backgroundOption = backgroundOption || {};
        root.clear();
        this._clipRect.attr({ x: canvas.left, y: canvas.top, width: canvas.width, height: canvas.height });
        if(!isCompactMode) {
            if(merge(backgroundOption.visible, backgroundTheme.visible)) {
                if(backgroundOption.color) {
                    renderer.rect(canvas.left, canvas.top, canvas.width + 1, canvas.height).attr({
                        // Seems that "backgroundTheme.color" is never used and so can be removed both from here and from themes
                        // TODO: Check it (special attention to WidgetsGallery) and remove the option
                        fill: merge(backgroundOption.color, backgroundTheme.color),
                        "class": "dx-range-selector-background"
                    }).append(root);
                }
                if(backgroundOption.image && backgroundOption.image.url) {
                    renderer.image(canvas.left, canvas.top, canvas.width + 1, canvas.height,
                        backgroundOption.image.url,
                        merge(backgroundOption.image.location, backgroundTheme.image.location)).append(root);
                }
            }
            if(seriesDataSource && seriesDataSource.isShowChart()) {
                seriesGroup = renderer.g().attr({ "class": "dxrs-series-group" }).append(root);
                drawSeriesView(seriesGroup, seriesDataSource, this._params.translator, [canvas.top, canvas.top + canvas.height], isAnimationEnabled);
            }
        }
    }
};

exports.RangeView = RangeView;
