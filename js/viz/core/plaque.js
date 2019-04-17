import { extend } from "../../core/utils/extend";
import { isDefined } from "../../core/utils/type";

const getCloudPoints = function({ width, height }, x, y, anchorX, anchorY, { arrowWidth }) {
    var halfArrowWidth = arrowWidth / 2,
        halfWidth = width / 2,
        halfHeight = height / 2,
        cloudPoints,
        arrowPoints = [6, 0],
        x1 = x + halfArrowWidth,
        x2 = anchorX,
        x3 = x - halfArrowWidth,
        y1 = y + halfHeight,
        y3 = y + halfHeight,
        y2 = anchorY;

    cloudPoints = [
        x - halfWidth, y - halfHeight, // lt
        x + halfWidth, y - halfHeight, // rt
        x + halfWidth, y + halfHeight, // rb
        x - halfWidth, y + halfHeight // lb
    ];

    arrowPoints.splice(2, 0, x1, y1, x2, y2, x3, y3);
    cloudPoints.splice.apply(cloudPoints, arrowPoints);

    return cloudPoints;
};

export class Plaque {
    constructor(options, widget, root, renderContent) {
        this.widget = widget;
        this.options = options;
        this.root = root;
        this.renderContent = renderContent;
    }

    draw({ x: anchorX, y: anchorY }) {
        const renderer = this.widget._renderer;
        const options = this.options;
        let { x, y } = options;

        if(!isDefined(anchorX) && (!isDefined(x) || !isDefined(y))) {
            return;
        }

        const shadow = renderer.shadowFilter().attr(extend({ x: "-50%", y: "-50%", width: "200%", height: "200%" }, options.shadow));

        let cloudSettings = { opacity: options.opacity, filter: shadow.id, "stroke-width": 0, fill: options.color };
        let borderOptions = options.border || {};

        if(borderOptions.visible) {
            extend(cloudSettings, {
                "stroke-width": borderOptions.width,
                stroke: borderOptions.color,
                "stroke-opacity": borderOptions.opacity,
                dashStyle: borderOptions.dashStyle
            });
        }

        const group = renderer.g().attr({ class: `dxc-${ options.type }-annotation` }).append(this.root);
        const cloud = renderer.path([], "area").attr(cloudSettings).sharp().append(group);

        const paddingLeftRight = options.paddingLeftRight;
        const paddingTopBottom = options.paddingTopBottom;

        const contentGroup = renderer.g().append(group);
        this.renderContent(this.widget, contentGroup);
        const bBox = contentGroup.getBBox();
        const size = {
            width: bBox.width + 2 * paddingLeftRight,
            height: bBox.height + 2 * paddingTopBottom
        };

        if(!isDefined(x)) {
            x = anchorX;
        } else if(!isDefined(anchorX)) {
            anchorX = x;
        }

        if(!isDefined(y)) {
            y = anchorY - options.arrowLength - size.height / 2;
        } else if(!isDefined(anchorY)) {
            anchorY = y + size.height / 2;
        }
        // TODO check if anchor is inside plaque

        cloud.attr({ points: getCloudPoints(size, x, y, anchorX, anchorY, options) });
        contentGroup.move(x - bBox.x - bBox.width / 2, y - bBox.y - bBox.height / 2);
    }
}
