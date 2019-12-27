const isDefined = require('../../core/utils/type').isDefined;
const extend = require('../../core/utils/extend').extend;

function getPathStyle(options) {
    return { stroke: options.color, 'stroke-width': options.width, 'stroke-opacity': options.opacity, opacity: 1 };
}

function createTick(axis, renderer, tickOptions, gridOptions, skippedCategory, skipLabels, offset) {
    const tickOffset = offset || axis._tickOffset;
    const lineGroup = axis._axisLineGroup;
    const elementsGroup = axis._axisElementsGroup;
    const tickStyle = getPathStyle(tickOptions);
    const gridStyle = getPathStyle(gridOptions);
    const emptyStrRegExp = /^\s+$/;

    const axisOptions = axis.getOptions();
    const labelOptions = axisOptions.label;
    const labelStyle = axis._textOptions;

    function getLabelFontStyle(tick) {
        let fontStyle = axis._textFontStyles;
        const customizeColor = labelOptions.customizeColor;

        if(customizeColor && customizeColor.call) {
            fontStyle = extend({}, axis._textFontStyles, { fill: customizeColor.call(tick, tick) });
        }

        return fontStyle;
    }

    function createLabelHint(tick, range) {
        const labelHint = axis.formatHint(tick.value, labelOptions, range);
        if(isDefined(labelHint) && labelHint !== '') {
            tick.label.setTitle(labelHint);
        }
    }

    return function(value) {
        var tick = {
            value: value,

            updateValue(newValue) {
                this.value = value = newValue;
            },

            initCoords: function() {
                this.coords = axis._getTranslatedValue(value, tickOffset);
                this.labelCoords = axis._getTranslatedValue(value);
            },
            saveCoords() {
                this._storedCoords = this.coords;
                this._storedLabelsCoords = this.labelCoords;
            },
            drawMark(options) {
                if(!tickOptions.visible || skippedCategory === value) {
                    return;
                }

                if(axis.areCoordsOutsideAxis(this.coords)) {
                    return;
                }

                if(this.mark) {
                    this.mark.append(lineGroup);
                    axis.sharp(this.mark, axis.getSharpDirectionByCoords(this.coords));
                    this.updateTickPosition(options);
                } else {
                    this.mark = axis._createPathElement([], tickStyle, axis.getSharpDirectionByCoords(this.coords)).append(lineGroup);
                    this.updateTickPosition(options);
                }
            },

            setSkippedCategory(category) {
                skippedCategory = category;
            },

            _updateLine(lineElement, settings, storedSettings, animate, isGridLine) {
                if(!lineElement) {
                    return;
                }
                if(settings.points === null || settings.r === null) {
                    lineElement.remove();
                    return;
                }
                if(animate && storedSettings && storedSettings.points !== null) {
                    settings.opacity = 1;
                    lineElement.attr(storedSettings);
                    lineElement.animate(settings);
                } else {
                    settings.opacity = animate ? 0 : 1;

                    lineElement.attr(settings);

                    animate && lineElement.animate({
                        opacity: 1
                    }, {
                        delay: 0.5,
                        partitionDuration: 0.5
                    });
                }

                this.coords.angle && axis._rotateTick(lineElement, this.coords, isGridLine);
            },

            updateTickPosition: function(options, animate) {
                this._updateLine(this.mark,
                    { points: axis._getTickMarkPoints(tick.coords, tickOptions.length, options) },
                    this._storedCoords && { points: axis._getTickMarkPoints(tick._storedCoords, tickOptions.length, options) },
                    animate,
                    false);
            },
            drawLabel: function(range) {
                const labelIsVisible = labelOptions.visible
                    && !skipLabels
                    && !axis.getTranslator().getBusinessRange().isEmpty()
                    && !axis.areCoordsOutsideAxis(this.labelCoords);

                if(!labelIsVisible) {
                    if(this.label) {
                        this.label.remove();
                    }
                    return;
                }

                const text = axis.formatLabel(value, labelOptions, range);

                if(this.label) {
                    this.label.attr({ text, rotate: 0 }).append(elementsGroup);
                    createLabelHint(this, range);
                    this.updateLabelPosition();
                    return;
                }

                if(isDefined(text) && text !== '' && !emptyStrRegExp.test(text)) {
                    this.label = renderer
                        .text(text)
                        .css(getLabelFontStyle(this))
                        .attr(labelStyle)

                        .data('chart-data-argument', this.value)
                        .append(elementsGroup);

                    this.updateLabelPosition();

                    createLabelHint(this, range);
                }
            },

            fadeOutElements() {
                const startSettings = { opacity: 1 };
                const endSettings = { opacity: 0 };
                const animationSettings = {
                    partitionDuration: 0.5
                };

                if(this.label) {
                    this._fadeOutLabel();
                }
                if(this.grid) {
                    this.grid.append(axis._axisGridGroup).attr(startSettings).animate(endSettings, animationSettings);
                }
                if(this.mark) {
                    this.mark.append(axis._axisLineGroup).attr(startSettings).animate(endSettings, animationSettings);
                }
            },

            _fadeInLabel() {
                const group = axis._renderer.g().attr({
                    opacity: 0
                }).append(axis._axisElementsGroup)
                    .animate({ opacity: 1 }, {
                        delay: 0.5,
                        partitionDuration: 0.5
                    });

                this.label.append(group);
            },

            _fadeOutLabel() {
                const group = axis._renderer.g().attr({
                    opacity: 1
                }).animate({ opacity: 0 }, {
                    partitionDuration: 0.5
                }).append(axis._axisElementsGroup);
                this.label.append(group);
            },

            updateLabelPosition: function(animate) {
                if(!this.label) {
                    return;
                }

                if(animate && this._storedLabelsCoords) {
                    this.label.attr({
                        x: this._storedLabelsCoords.x,
                        y: this._storedLabelsCoords.y
                    });

                    this.label.animate({
                        x: this.labelCoords.x,
                        y: this.labelCoords.y
                    });

                } else {
                    this.label.attr({
                        x: this.labelCoords.x,
                        y: this.labelCoords.y
                    });

                    if(animate) {
                        this._fadeInLabel();
                    }
                }
            },

            updateMultilineTextAlignment() {
                if(!this.label) {
                    return;
                }
                this.label.attr({ textsAlignment: this.labelAlignment || axis.getOptions().label.alignment });
            },

            drawGrid: function(drawLine) {
                if(gridOptions.visible && skippedCategory !== this.value) {
                    if(this.grid) {
                        this.grid.append(axis._axisGridGroup);
                        axis.sharp(this.grid, axis.getSharpDirectionByCoords(this.coords));
                        this.updateGridPosition();
                    } else {
                        this.grid = drawLine(this, gridStyle);
                        this.grid && this.grid.append(axis._axisGridGroup);
                    }
                }
            },

            updateGridPosition: function(animate) {
                this._updateLine(this.grid,
                    axis._getGridPoints(tick.coords),
                    this._storedCoords && axis._getGridPoints(this._storedCoords),
                    animate, true);
            },

            removeLabel() {
                this.label.remove();
                this.label = null;
            }
        };

        return tick;
    };
}

exports.tick = createTick;
