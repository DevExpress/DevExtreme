const ARC_COORD_PREC = 5;

import { normalizeAngle, normalizeArcParams } from '../../core/utils';

export function dividePoints(bars) {
    return bars.reduce(function(stackBars, bar) {
        const angle = normalizeAngle(bar._angle);
        const isRightSide = angle <= 90 || angle >= 270;
        bar._text._lastCoords = { x: 0, y: 0 };

        (isRightSide ? stackBars.right : stackBars.left)
            .push({
                series: {
                    isStackedSeries: () => false,
                    isFullStackedSeries: () => false
                },
                getLabels: () => [{
                    isVisible: () => true,
                    getBoundingRect: () => {
                        const { height, width, x, y } = bar._text.getBBox();
                        const lastCoords = bar._text._lastCoords;

                        return {
                            x: x + lastCoords.x,
                            y: y + lastCoords.y,
                            width,
                            height,
                        };
                    },
                    shift: (x, y) => {
                        const box = bar._text.getBBox();

                        bar._text._lastCoords = { x: x - box.x, y: y - box.y };
                        bar._text.attr({ translateX: x - box.x, translateY: y - box.y });
                    },
                    draw: ()=> bar.hideLabel(),
                    getData: ()=> { return { value: bar.getValue() }; },
                    hideInsideLabel: ()=> false,
                }]
            }
            );
        return stackBars;
    }, { left: [], right: [] });
}

export const clearLabelsCrossTitle = (bars, minY)=> {
    bars.forEach(bar => {
        const box = bar._text.getBBox();
        const lastCoords = bar._text._lastCoords;

        if(minY > box.y + lastCoords.y) {
            bar.hideLabel();
        }
    });
};

const getStartCoordsArc = function(x, y, innerR, outerR, startAngleCos, startAngleSin) {
    return {
        x: (x + outerR * startAngleCos).toFixed(ARC_COORD_PREC),
        y: (y - outerR * startAngleSin).toFixed(ARC_COORD_PREC)
    };
};

export const drawConnector = (bars, connectorWidth) => {
    bars.forEach((bar) => {
        const x = bar._bar.attr('x');
        const y = bar._bar.attr('y');
        const innerRadius = bar._bar.attr('innerRadius');
        const outerRadius = bar._bar.attr('outerRadius');
        const startAngle = bar._bar.attr('startAngle');
        const endAngle = bar._bar.attr('endAngle');
        const coordStart = getStartCoordsArc.apply(null, normalizeArcParams(x, y, innerRadius, outerRadius, startAngle, endAngle));
        const xStart = Number(coordStart.x);
        const yStart = Number(coordStart.y);
        const box = bar._text.getBBox();
        const shiftConnector = connectorWidth / 2;
        const lastCoords = bar._text._lastCoords;

        if(bar._angle > 90) {
            bar._line.attr({ points: [
                xStart + shiftConnector,
                yStart + shiftConnector,
                box.x + box.width + lastCoords.x,
                box.y + box.height / 2 + lastCoords.y
            ] });
        } else if(bar._angle <= 90) {
            bar._line.attr({ points: [
                xStart - shiftConnector,
                yStart + shiftConnector,
                box.x + lastCoords.x,
                box.y + box.height / 2 + lastCoords.y
            ] });
        }
        bar._line.rotate(0);
    });
};

export const clearOverlappingLabels = (bars) =>{
    let currentIndex = 0;
    let nextIndex = 1;
    const sortedBars = bars.concat().sort((a, b) => a.getValue() - b.getValue());

    while(currentIndex < sortedBars.length && nextIndex < sortedBars.length) {
        const current = sortedBars[currentIndex];
        const next = sortedBars[nextIndex];

        if(current.checkIntersect(next)) {
            next.hideLabel();
            nextIndex++;
        } else {
            currentIndex = nextIndex;
            nextIndex = currentIndex + 1;
        }
    }
};
