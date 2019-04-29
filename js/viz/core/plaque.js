import { extend } from "../../core/utils/extend";
import { isDefined } from "../../core/utils/type";

const round = Math.round;
const max = Math.max;
const min = Math.min;

const buildFlatArray = (...points) => [].concat(...points);

const getCloudPoints = function({ width, height }, x, y, anchorX, anchorY, { arrowWidth }) {
    const halfArrowWidth = arrowWidth / 2;
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const xr = round(x + halfWidth);
    const xl = round(x - halfWidth);
    const yt = round(y - halfHeight);
    const yb = round(y + halfHeight);
    const leftTopCorner = [xl, yt];
    const rightTopCorner = [xr, yt];
    const rightBottomCorner = [xr, yb];
    const leftBottomCorner = [xl, yb];

    const arrowX = anchorX <= xl ? xl : xr <= anchorX ? xr : anchorX;
    const arrowY = anchorY <= yt ? yt : yb <= anchorY ? yb : anchorY;

    const arrowBaseBottom = min(arrowY + halfArrowWidth, yb);
    const arrowBaseTop = max(arrowY - halfArrowWidth, yt);
    const arrowBaseLeft = max(arrowX - halfArrowWidth, xl);
    const arrowBaseRight = min(arrowX + halfArrowWidth, xr);
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

    draw({ x: anchorX, y: anchorY, canvas = {} }) {
        const renderer = this.widget._renderer;
        const options = this.options;
        let { x, y } = options;

        const bounds = {
            xl: canvas.left,
            xr: canvas.width - canvas.right,
            width: canvas.width - canvas.right - canvas.left,
            yt: canvas.top,
            yb: canvas.height - canvas.bottom,
            height: canvas.height - canvas.bottom - canvas.top
        };

        if(!isDefined(anchorX) && (!isDefined(x) || !isDefined(y))) {
            return;
        }

        if(isDefined(anchorX) && (anchorX < bounds.xl || bounds.xr < anchorX || anchorY < bounds.yt || bounds.yb < anchorY)) {
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

        this._contentGroup = renderer.g().append(group);

        const contentWidth = options.width > 0 ? options.width : null;
        const contentHeight = options.height > 0 ? options.height : null;

        this.renderContent(this.widget, this._contentGroup, {
            width: contentWidth,
            height: contentHeight
        });

        const bBox = this._contentBBox = this._contentGroup.getBBox();

        const size = this._size = {
            width: max(contentWidth, bBox.width) + options.paddingLeftRight * 2,
            height: max(contentHeight, bBox.height) + options.paddingTopBottom * 2
        };

        if(!isDefined(x)) {
            if(bounds.width < size.width) {
                x = round(bounds.xl + bounds.width / 2);
            } else {
                x = min(max(anchorX, Math.ceil(bounds.xl + size.width / 2)), Math.floor(bounds.xr - size.width / 2));
            }
        } else if(!isDefined(anchorX)) {
            anchorX = x;
        }

        if(!isDefined(y)) {
            const y_top = anchorY - options.arrowLength - size.height / 2;
            const y_bottom = anchorY + options.arrowLength + size.height / 2;

            if(bounds.height < size.height + options.arrowLength) {
                y = round(bounds.yt + size.height / 2);
            } else if(y_top - size.height / 2 < bounds.yt) {
                if(y_bottom + size.height / 2 < bounds.yb) {
                    y = y_bottom;
                } else {
                    y = round(bounds.yt + size.height / 2);
                }
            } else {
                y = y_top;
            }

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

    hitTest(x, y) {
        const { width, height } = this._size;
        return Math.abs(x - this.x) <= width / 2 && Math.abs(y - this.y) <= height / 2;
    }
}
