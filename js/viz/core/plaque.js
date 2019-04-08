import { extend } from "../../core/utils/extend";

const getCloudPoints = function({ width, height }, { arrowLength, arrowWidth }) {
    var halfArrowWidth = arrowWidth / 2,
        halfContentWidth = width / 2,
        cloudPoints,
        arrowPoints = [6, 0],
        x1 = halfContentWidth + halfArrowWidth,
        x2 = halfContentWidth,
        x3 = halfContentWidth - halfArrowWidth,
        y1 = height,
        y3 = height,
        y2 = height + arrowLength;

    cloudPoints = [
        0, 0, // lt
        width, 0, // rt
        width, height, // rb
        0, height // lb
    ];

    arrowPoints.splice(2, 0, x1, y1, x2, y2, x3, y3);
    cloudPoints.splice.apply(cloudPoints, arrowPoints);

    return cloudPoints;
};

export class Plaque {
    constructor(options, widget, root, renderContent) {
        const renderer = widget._renderer;
        const shadow = renderer.shadowFilter().attr(extend({ x: "-50%", y: "-50%", width: "200%", height: "200%" }, options.shadow));

        let cloudSettings = { opacity: options.opacity, filter: shadow.id, "stroke-width": 0, fill: options.color };
        let borderOptions = options.border || {};

        this.options = options;

        if(borderOptions.visible) {
            extend(cloudSettings, {
                "stroke-width": borderOptions.width,
                stroke: borderOptions.color,
                "stroke-opacity": borderOptions.opacity,
                dashStyle: borderOptions.dashStyle
            });
        }

        this._group = renderer.g().attr({ class: `dxc-${ options.type }-annotation` }).append(root);

        const cloud = renderer.path([], "area").attr(cloudSettings).sharp().append(this._group);

        const contentGroup = renderer.g().append(this._group);

        const paddingLeftRight = options.paddingLeftRight;
        const paddingTopBottom = options.paddingTopBottom;

        renderContent(widget, contentGroup);
        const bBox = contentGroup.getBBox();
        contentGroup.move(paddingLeftRight - bBox.x, paddingTopBottom - bBox.y);

        this.size = {
            width: bBox.width + 2 * paddingLeftRight,
            height: bBox.height + 2 * paddingTopBottom
        };

        cloud.attr({
            points: getCloudPoints(this.size, options)
        });
    }

    move(x, y) {
        this._group.move(Math.round(x - this.size.width / 2), y - this.size.height - this.options.arrowLength);
    }
}
