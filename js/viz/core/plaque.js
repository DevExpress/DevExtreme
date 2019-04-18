import { extend } from "../../core/utils/extend";
import { isDefined } from "../../core/utils/type";

const buildFlatArray = (...points) => [].concat(...points);

const getCloudPoints = function({ width, height }, x, y, anchorX, anchorY, { arrowWidth }) {
    const halfArrowWidth = arrowWidth / 2;
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const xr = Math.round(x + halfWidth);
    const xl = Math.round(x - halfWidth);
    const yt = Math.round(y - halfHeight);
    const yb = Math.round(y + halfHeight);
    const leftTopCorner = [xl, yt];
    const rightTopCorner = [xr, yt];
    const rightBottomCorner = [xr, yb];
    const leftBottomCorner = [xl, yb];

    const arrowX = anchorX <= xl ? xl : xr <= anchorX ? xr : anchorX;
    const arrowY = anchorY <= yt ? yt : yb <= anchorY ? yb : anchorY;

    const arrowBaseBottom = Math.min(arrowY + halfArrowWidth, yb);
    const arrowBaseTop = Math.max(arrowY - halfArrowWidth, yt);
    const arrowBaseLeft = Math.max(arrowX - halfArrowWidth, xl);
    const arrowBaseRight = Math.min(arrowX + halfArrowWidth, xr);
    let points;

    // 1 | 2 | 3
    // 8 | 0 | 4
    // 7 | 6 | 5
    if(xl <= anchorX && anchorX <= xr && yt <= anchorY && anchorY <= yb) { // 0
        points = buildFlatArray(leftTopCorner, rightTopCorner, rightBottomCorner, leftBottomCorner);
    } else if(anchorX < xl && anchorY < yt) { // 1
        points = buildFlatArray([xl, arrowBaseBottom, anchorX, anchorY, arrowBaseRight, yt], rightTopCorner, rightBottomCorner, leftBottomCorner);
    } else if(anchorX >= xl && anchorX <= xr && anchorY < yt) { // 2
        points = buildFlatArray(leftTopCorner, [arrowBaseLeft, yt, anchorX, anchorY, arrowBaseRight, yt], rightTopCorner, rightBottomCorner, leftBottomCorner);
    } else if(anchorX > xr && anchorY < yt) { // 3
        points = buildFlatArray(leftTopCorner, [arrowBaseLeft, yt, anchorX, anchorY, xr, arrowBaseBottom], rightBottomCorner, leftBottomCorner);
    } else if(anchorX > xr && anchorY >= yt && anchorY <= yb) { // 4
        points = buildFlatArray(leftTopCorner, rightTopCorner, [xr, arrowBaseTop, anchorX, anchorY, xr, arrowBaseBottom], rightBottomCorner, leftBottomCorner);
    } else if(anchorX > xr && anchorY > yb) { // 5
        points = buildFlatArray(leftTopCorner, rightTopCorner, [xr, arrowBaseTop, anchorX, anchorY, arrowBaseLeft, yb], leftBottomCorner);
    } else if(anchorX >= xl && anchorX <= xr && anchorY > yb) { // 6
        points = buildFlatArray(leftTopCorner, rightTopCorner, rightBottomCorner, [arrowBaseRight, yb, anchorX, anchorY, arrowBaseLeft, yb], leftBottomCorner);
    } else if(anchorX < xl && anchorY > yb) { // 7
        points = buildFlatArray(leftTopCorner, rightTopCorner, rightBottomCorner, [arrowBaseRight, yb, anchorX, anchorY, xl, arrowBaseTop]);
    } else if(anchorX < xl && anchorY >= yt && anchorY <= yb) { // 8
        points = buildFlatArray(leftTopCorner, rightTopCorner, rightBottomCorner, leftBottomCorner, [xl, arrowBaseBottom, anchorX, anchorY, xl, arrowBaseTop]);
    }

    return points;
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
        this._cloud = renderer.path([], "area").attr(cloudSettings).sharp().append(group);

        const paddingLeftRight = options.paddingLeftRight;
        const paddingTopBottom = options.paddingTopBottom;

        this._contentGroup = renderer.g().append(group);
        this.renderContent(this.widget, this._contentGroup);
        const bBox = this._contentBBox = this._contentGroup.getBBox();
        const size = this._size = {
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

        this.anchorX = anchorX;
        this.anchorY = anchorY;
        this.move(x, y);
    }

    move(x, y) {
        this.x = x;
        this.y = y;
        this._cloud.attr({ points: getCloudPoints(this._size, x, y, this.anchorX, this.anchorY, this.options) });
        this._contentGroup.move(x - this._contentBBox.x - this._contentBBox.width / 2, y - this._contentBBox.y - this._contentBBox.height / 2);
    }
}
