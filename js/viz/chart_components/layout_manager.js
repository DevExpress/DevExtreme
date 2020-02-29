const extend = require('../../core/utils/extend').extend;
const layoutElementModule = require('../core/layout_element');
const _isNumber = require('../../core/utils/type').isNumeric;
const _min = Math.min;
const _max = Math.max;
const _floor = Math.floor;
const _sqrt = Math.sqrt;
const consts = require('../components/consts');
const RADIAL_LABEL_INDENT = consts.radialLabelIndent;

function getNearestCoord(firstCoord, secondCoord, pointCenterCoord) {
    let nearestCoord;
    if(pointCenterCoord < firstCoord) {
        nearestCoord = firstCoord;
    } else if(secondCoord < pointCenterCoord) {
        nearestCoord = secondCoord;
    } else {
        nearestCoord = pointCenterCoord;
    }
    return nearestCoord;
}

function getLabelLayout(point) {
    if(point._label.isVisible() && point._label.getLayoutOptions().position !== 'inside') {
        return point._label.getBoundingRect();
    }
}

function getPieRadius(series, paneCenterX, paneCenterY, accessibleRadius, minR) {
    series.some(function(singleSeries) {
        return singleSeries.getVisiblePoints().reduce(function(radiusIsFound, point) {
            const labelBBox = getLabelLayout(point);
            if(labelBBox) {
                const xCoords = getNearestCoord(labelBBox.x, labelBBox.x + labelBBox.width, paneCenterX);
                const yCoords = getNearestCoord(labelBBox.y, labelBBox.y + labelBBox.height, paneCenterY);

                accessibleRadius = _min(_max(getLengthFromCenter(xCoords, yCoords, paneCenterX, paneCenterY) - RADIAL_LABEL_INDENT, minR), accessibleRadius);
                radiusIsFound = true;
            }
            return radiusIsFound;
        }, false);
    });

    return accessibleRadius;
}

function getSizeLabels(series) {
    return series.reduce(function(res, singleSeries) {
        let maxWidth = singleSeries.getVisiblePoints().reduce(function(width, point) {
            const labelBBox = getLabelLayout(point);
            if(labelBBox && labelBBox.width > width) {
                width = labelBBox.width;
            }
            return width;
        }, 0);

        let rWidth = maxWidth;
        if(maxWidth) {
            res.outerLabelsCount++;
            if(res.outerLabelsCount > 1) {
                maxWidth += consts.pieLabelSpacing;
            }
            rWidth += consts.pieLabelSpacing;
        }
        res.sizes.push(maxWidth);
        res.rSizes.push(rWidth);
        res.common += maxWidth;
        return res;
    }, { sizes: [], rSizes: [], common: 0, outerLabelsCount: 0 });
}

function correctLabelRadius(labelSizes, radius, series, canvas, averageWidthLabels, centerX) {
    let curRadius;
    let i;
    let runningWidth = 0;
    const sizes = labelSizes.sizes;
    const rSizes = labelSizes.rSizes;

    for(i = 0; i < series.length; i++) {
        if(sizes[i] === 0) {
            curRadius && (curRadius += rSizes[i - 1]);
            continue;
        }
        curRadius = _floor(curRadius ? curRadius + rSizes[i - 1] : radius);
        series[i].correctLabelRadius(curRadius);
        runningWidth += averageWidthLabels || sizes[i];
        rSizes[i] = averageWidthLabels || rSizes[i];
        series[i].setVisibleArea({
            left: _floor(centerX - radius - runningWidth),
            right: _floor(canvas.width - (centerX + radius + runningWidth)),
            top: canvas.top,
            bottom: canvas.bottom,
            width: canvas.width,
            height: canvas.height
        });
    }
}

function getLengthFromCenter(x, y, paneCenterX, paneCenterY) {
    return _sqrt((x - paneCenterX) * (x - paneCenterX) + (y - paneCenterY) * (y - paneCenterY));
}

function getInnerRadius(series) {
    let innerRadius;
    if(series.type === 'pie') {
        innerRadius = 0;
    } else {
        innerRadius = _isNumber(series.innerRadius) ? Number(series.innerRadius) : 0.5;
        innerRadius = innerRadius < 0.2 ? 0.2 : innerRadius;
        innerRadius = innerRadius > 0.8 ? 0.8 : innerRadius;
    }
    return innerRadius;
}

const inverseAlign = {
    left: 'right',
    right: 'left',
    top: 'bottom',
    bottom: 'top',
    center: 'center'
};

function downSize(canvas, layoutOptions) {
    canvas[layoutOptions.cutLayoutSide] += layoutOptions.cutSide === 'horizontal' ? layoutOptions.width : layoutOptions.height;
}

function getOffset(layoutOptions, offsets) {
    const side = layoutOptions.cutLayoutSide;
    const offset = {
        horizontal: 0,
        vertical: 0
    };

    switch(side) {
        case 'top':
        case 'left':
            offset[layoutOptions.cutSide] = -offsets[side];
            break;
        case 'bottom':
        case 'right':
            offset[layoutOptions.cutSide] = offsets[side];
            break;
    }

    return offset;
}

function LayoutManager() {
}

function toLayoutElementCoords(canvas) {
    return new layoutElementModule.WrapperLayoutElement(null, {
        x: canvas.left,
        y: canvas.top,
        width: canvas.width - canvas.left - canvas.right,
        height: canvas.height - canvas.top - canvas.bottom
    });
}

function getAverageLabelWidth(centerX, radius, canvas, sizeLabels) {
    return (centerX - radius - RADIAL_LABEL_INDENT - canvas.left) / sizeLabels.outerLabelsCount;
}

function getFullRadiusWithLabels(centerX, canvas, sizeLabels) {
    return centerX - canvas.left - (sizeLabels.outerLabelsCount > 0 ? sizeLabels.common + RADIAL_LABEL_INDENT : 0);
}

function correctAvailableRadius(availableRadius, canvas, series, minR, paneCenterX, paneCenterY) {
    const sizeLabels = getSizeLabels(series);
    let averageWidthLabels;
    const fullRadiusWithLabels = getFullRadiusWithLabels(paneCenterX, canvas, sizeLabels);

    if(fullRadiusWithLabels < minR) {
        availableRadius = minR;
        averageWidthLabels = getAverageLabelWidth(paneCenterX, availableRadius, canvas, sizeLabels);
    } else {
        availableRadius = _min(getPieRadius(series, paneCenterX, paneCenterY, availableRadius, minR), fullRadiusWithLabels);
    }
    correctLabelRadius(sizeLabels, availableRadius + RADIAL_LABEL_INDENT, series, canvas, averageWidthLabels, paneCenterX);

    return availableRadius;
}

LayoutManager.prototype = {
    constructor: LayoutManager,

    setOptions: function(options) {
        this._options = options;
    },

    applyPieChartSeriesLayout: function(canvas, series, hideLayoutLabels) {
        const paneSpaceHeight = canvas.height - canvas.top - canvas.bottom;
        const paneSpaceWidth = canvas.width - canvas.left - canvas.right;
        const paneCenterX = paneSpaceWidth / 2 + canvas.left;
        const paneCenterY = paneSpaceHeight / 2 + canvas.top;
        const piePercentage = this._options.piePercentage;
        let availableRadius;
        let minR;

        if(_isNumber(piePercentage)) {
            availableRadius = minR = piePercentage * _min(canvas.height, canvas.width) / 2;
        } else {
            availableRadius = _min(paneSpaceWidth, paneSpaceHeight) / 2;
            minR = this._options.minPiePercentage * availableRadius;
        }
        if(!hideLayoutLabels) {
            availableRadius = correctAvailableRadius(availableRadius, canvas, series, minR, paneCenterX, paneCenterY);
        }

        return {
            centerX: _floor(paneCenterX),
            centerY: _floor(paneCenterY),
            radiusInner: _floor(availableRadius * getInnerRadius(series[0])),
            radiusOuter: _floor(availableRadius)
        };
    },

    applyEqualPieChartLayout: function(series, layout) {
        const radius = layout.radius;

        return {
            centerX: _floor(layout.x),
            centerY: _floor(layout.y),
            radiusInner: _floor(radius * getInnerRadius(series[0])),
            radiusOuter: _floor(radius)
        };
    },

    correctPieLabelRadius: function(series, layout, canvas) {
        const sizeLabels = getSizeLabels(series);
        let averageWidthLabels;
        const radius = layout.radiusOuter + RADIAL_LABEL_INDENT;
        const availableLabelWidth = layout.centerX - canvas.left - radius;

        if(sizeLabels.common + RADIAL_LABEL_INDENT > availableLabelWidth) {
            averageWidthLabels = getAverageLabelWidth(layout.centerX, layout.radiusOuter, canvas, sizeLabels);
        }
        correctLabelRadius(sizeLabels, radius, series, canvas, averageWidthLabels, layout.centerX);
    },

    needMoreSpaceForPanesCanvas(panes, rotated, fixedSizeCallback) {
        const options = this._options;
        const width = options.width;
        const height = options.height;
        const piePercentage = options.piePercentage;
        const percentageIsValid = _isNumber(piePercentage);
        let needHorizontalSpace = 0;
        let needVerticalSpace = 0;

        panes.forEach(pane => {
            const paneCanvas = pane.canvas;
            const minSize = percentageIsValid ? _min(paneCanvas.width, paneCanvas.height) * piePercentage : undefined;
            const paneSized = fixedSizeCallback ? fixedSizeCallback(pane) : { width: false, height: false };
            const needPaneHorizontalSpace = !paneSized.width ? (percentageIsValid ? minSize : width) - (paneCanvas.width - paneCanvas.left - paneCanvas.right) : 0;
            const needPaneVerticalSpace = !paneSized.height ? (percentageIsValid ? minSize : height) - (paneCanvas.height - paneCanvas.top - paneCanvas.bottom) : 0;

            if(rotated) {
                needHorizontalSpace += needPaneHorizontalSpace > 0 ? needPaneHorizontalSpace : 0;
                needVerticalSpace = _max(needPaneVerticalSpace > 0 ? needPaneVerticalSpace : 0, needVerticalSpace);
            } else {
                needHorizontalSpace = _max(needPaneHorizontalSpace > 0 ? needPaneHorizontalSpace : 0, needHorizontalSpace);
                needVerticalSpace += needPaneVerticalSpace > 0 ? needPaneVerticalSpace : 0;
            }
        });

        return needHorizontalSpace > 0 || needVerticalSpace > 0 ? { width: needHorizontalSpace, height: needVerticalSpace } : false;
    },

    layoutElements: function(elements, canvas, funcAxisDrawer, panes, rotated) {
        this._elements = elements;

        this._probeDrawing(canvas);
        this._drawElements(canvas);

        funcAxisDrawer();
        this._processAdaptiveLayout(panes, rotated, canvas, funcAxisDrawer);
        this._positionElements(canvas);
    },

    _processAdaptiveLayout: function(panes, rotated, canvas, funcAxisDrawer) {
        const that = this;
        const size = that.needMoreSpaceForPanesCanvas(panes, rotated);
        const items = this._elements;

        if(!size) return;

        function processCanvases(item, layoutOptions, side) {
            if(!item.getLayoutOptions()[side]) {
                canvas[layoutOptions.cutLayoutSide] -= layoutOptions[side];
                size[side] = size[side] - layoutOptions[side];
            }
        }

        items.slice().reverse().forEach(function(item) {
            const layoutOptions = item.getLayoutOptions();
            let needRedraw = false;
            let sizeObject;
            let cutSide;

            if(!layoutOptions) {
                return;
            }

            sizeObject = extend({}, layoutOptions);

            needRedraw =
                layoutOptions.cutSide === 'vertical' && size.width < 0 ||
                layoutOptions.cutSide === 'horizontal' && size.height < 0 ||
                layoutOptions.cutSide === 'vertical' && size.height > 0 ||
                layoutOptions.cutSide === 'horizontal' && size.width > 0;

            cutSide = layoutOptions.cutSide === 'horizontal' ? 'width' : 'height';

            if(needRedraw) {
                let width = sizeObject.width - size.width;
                let height = sizeObject.height - size.height;

                if(cutSide === 'height' && size.width < 0) {
                    width = canvas.width - canvas.left - canvas.right;
                }
                if(cutSide === 'width' && size.height < 0) {
                    height = canvas.height - canvas.top - canvas.bottom;
                }
                item.draw(width, height);

            }
            processCanvases(item, layoutOptions, cutSide);

        });

        funcAxisDrawer(size);
    },

    _probeDrawing: function(canvas) {
        const that = this;
        this._elements.forEach(function(item) {
            const layoutOptions = item.getLayoutOptions();
            let sizeObject;

            if(!layoutOptions) {
                return;
            }

            sizeObject = { width: canvas.width - canvas.left - canvas.right, height: canvas.height - canvas.top - canvas.bottom };
            if(layoutOptions.cutSide === 'vertical') {
                sizeObject.height -= that._options.height;
            } else {
                sizeObject.width -= that._options.width;
            }
            item.probeDraw(sizeObject.width, sizeObject.height);

            downSize(canvas, item.getLayoutOptions());
        });
    },

    _drawElements: function(canvas) {
        this._elements.slice().reverse().forEach(function(item) {
            const layoutOptions = item.getLayoutOptions();
            let sizeObject;
            let cutSide;
            let length;

            if(!layoutOptions) {
                return;
            }

            sizeObject = {
                width: canvas.width - canvas.left - canvas.right,
                height: canvas.height - canvas.top - canvas.bottom
            };
            cutSide = layoutOptions.cutSide;
            length = cutSide === 'horizontal' ? 'width' : 'height';

            sizeObject[length] = layoutOptions[length];
            item.draw(sizeObject.width, sizeObject.height);
        });
    },

    _positionElements: function(canvas) {
        const offsets = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        };

        this._elements.slice().reverse().forEach(function(item) {
            const layoutOptions = item.getLayoutOptions();
            let position;
            let cutSide;
            let my;

            if(!layoutOptions) {
                return;
            }

            position = layoutOptions.position;
            cutSide = layoutOptions.cutSide;
            my = {
                horizontal: position.horizontal,
                vertical: position.vertical
            };

            my[cutSide] = inverseAlign[my[cutSide]];

            item.position({
                of: toLayoutElementCoords(canvas), my: my,
                at: position, offset: getOffset(layoutOptions, offsets)
            });

            offsets[layoutOptions.cutLayoutSide] += layoutOptions[layoutOptions.cutSide === 'horizontal' ? 'width' : 'height'];
        });
    }
};

exports.LayoutManager = LayoutManager;
