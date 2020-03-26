import { isDefined } from '../../core/utils/type';

export default function createConstantLine(axis, options) {
    const labelOptions = options.label || {};
    const labelPosition = labelOptions.position || 'inside';

    let parsedValue;
    let valueIsParsed = false;

    axis._checkAlignmentConstantLineLabels(labelOptions);

    let storedCoord;

    return {
        options,

        labelOptions,

        labelPosition,

        label: null,

        line: null,

        getParsedValue() {
            if(!valueIsParsed) {
                parsedValue = axis.validateUnit(options.value, 'E2105', 'constantLine');
                valueIsParsed = true;
                return parsedValue;
            }
            return parsedValue;
        },

        draw() {
            if(!isDefined(options.value) || axis._translator.getBusinessRange().isEmpty()) {
                return this;
            }
            const canvas = axis._getCanvasStartEnd();
            const parsedValue = this.getParsedValue();

            this.coord = axis._getConstantLinePos(parsedValue, canvas.start, canvas.end);

            const rootGroup = options.displayBehindSeries ? axis._axisConstantLineGroups.under : axis._axisConstantLineGroups.above;
            let group = rootGroup[labelPosition];

            if(!group) {
                const side = axis._isHorizontal ? labelOptions.verticalAlignment : labelOptions.horizontalAlignment;
                group = rootGroup[side];
            }

            if(!isDefined(this.coord)) {
                return this;
            }

            const path = axis._createConstantLine(this.coord, {
                stroke: options.color,
                'stroke-width': options.width,
                dashStyle: options.dashStyle
            });

            this.line = path.append(rootGroup.inside);
            this.label = labelOptions.visible ? axis._drawConstantLineLabels(parsedValue, labelOptions, this.coord, group) : null;

            this.updatePosition();

            return this;
        },

        removeLabel() {
            this.label && this.label.remove();
        },

        updatePosition(animate) {
            const canvas = axis._getCanvasStartEnd();

            const coord = axis._getConstantLinePos(this.getParsedValue(), canvas.start, canvas.end);

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
                axis._rotateConstantLine(this.line, this.coord);
            }
        },

        saveCoords() {
            storedCoord = this.coord;
        }
    };
}
