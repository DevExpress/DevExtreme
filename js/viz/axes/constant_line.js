"use strict";

import { isDefined } from "../../core/utils/type";

export default function createConstantLine(axis, options) {
    const labelOptions = options.label || {};
    const labelPosition = labelOptions.position || "inside";

    axis._checkAlignmentConstantLineLabels(labelOptions);

    let storedCoord;

    return {
        options,

        labelOptions,

        labelPosition,

        label: null,

        line: null,

        draw() {
            if(!isDefined(options.value) || axis._translator.getBusinessRange().stubData) {
                return this;
            }
            const canvas = axis._getCanvasStartEnd();
            const pos = axis._getConstantLinePos(options.value, canvas.start, canvas.end);

            this.coord = pos.value;

            let group = axis._axisConstantLineGroups[labelPosition];

            if(!group) {
                const side = axis._isHorizontal ? labelOptions.verticalAlignment : labelOptions.horizontalAlignment;
                group = axis._axisConstantLineGroups[side];
            }

            if(!isDefined(this.coord)) {
                return this;
            }

            this.line = axis._createConstantLine(this.coord, {
                stroke: options.color,
                "stroke-width": options.width,
                dashStyle: options.dashStyle
            }).append(axis._axisConstantLineGroups.inside);

            this.label = labelOptions.visible ? axis._drawConstantLineLabels(pos.parsedValue, labelOptions, this.coord, group) : null;

            this.updatePosition();

            return this;
        },

        removeLabel() {
            this.label && this.label.remove();
        },

        updatePosition(animate) {
            const canvas = axis._getCanvasStartEnd();

            const coord = axis._getConstantLinePos(this.options.value, canvas.start, canvas.end).value;

            if(!isDefined(coord)) {
                return;
            }

            this.coord = coord;
            if(animate && storedCoord) {
                this.label && this.label.attr(axis._getConstantLineLabelsCoords(storedCoord, this.labelOptions));
                this.line && this.line.attr(axis._getConstantLineGraphicAttributes(storedCoord));

                this.label && this.label.animate(axis._getConstantLineLabelsCoords(this.coord, this.labelOptions));
                this.line && this.line.animate(axis._getConstantLineGraphicAttributes(this.coord));

            } else {
                this.label && this.label.attr(axis._getConstantLineLabelsCoords(this.coord, this.labelOptions));
                this.line && this.line.attr(axis._getConstantLineGraphicAttributes(this.coord));
            }
        },

        saveCoords() {
            storedCoord = this.coord;
        }
    };
}
