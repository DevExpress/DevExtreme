import { isDefined } from "../../core/utils/type";
import { patchFontOptions } from "../core/utils";
import { extend } from "../../core/utils/extend";

export default function createStrip(axis, options) {

    let storedCoord;

    const labelOptions = options.label || {};

    return {
        options,

        label: null,

        rect: null,

        _getCoord() {
            const canvas = axis._getCanvasStartEnd();
            const range = axis._translator.getBusinessRange();
            return axis._getStripPos(options.startValue, options.endValue, canvas.start, canvas.end, range);
        },

        _drawLabel(coords) {
            return axis._renderer
                .text(labelOptions.text, coords.x, coords.y)
                .css(patchFontOptions(extend({}, axis.getOptions().label.font, labelOptions.font)))
                .attr({ align: "center", "class": labelOptions.cssClass })
                .append(axis._axisStripLabelGroup);
        },

        draw() {
            if(axis._translator.getBusinessRange().isEmpty()) {
                return;
            }

            if((isDefined(options.startValue) || isDefined(options.endValue)) && isDefined(options.color)) {
                const stripPos = this._getCoord();

                this.labelCoords = labelOptions.text ? axis._getStripLabelCoords(stripPos.from, stripPos.to, labelOptions) : null;

                if((stripPos.to - stripPos.from === 0) || (!isDefined(stripPos.to)) || (!isDefined(stripPos.from))) {
                    return;
                }

                this.rect = axis._createStrip(axis._getStripGraphicAttributes(stripPos.from, stripPos.to))
                    .attr({ fill: options.color })
                    .append(axis._axisStripGroup);

                this.label = labelOptions.text ? this._drawLabel(this.labelCoords) : null;
            }
        },

        removeLabel() {
        },

        updatePosition(animate) {
            const stripPos = this._getCoord();

            if(animate && storedCoord) {
                this.label && this.label.attr(axis._getStripLabelCoords(storedCoord.from, storedCoord.to, options.label));
                this.rect && this.rect.attr(axis._getStripGraphicAttributes(storedCoord.from, storedCoord.to));

                this.label && this.label.animate(axis._getStripLabelCoords(stripPos.from, stripPos.to, options.label));
                this.rect && this.rect.animate(axis._getStripGraphicAttributes(stripPos.from, stripPos.to));

            } else {
                this.label && this.label.attr(axis._getStripLabelCoords(stripPos.from, stripPos.to, options.label));
                this.rect && this.rect.attr(axis._getStripGraphicAttributes(stripPos.from, stripPos.to));
            }
        },

        saveCoords() {
            storedCoord = this._getCoord();
        }
    };
}
