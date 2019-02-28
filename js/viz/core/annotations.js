import { isDefined } from "../../core/utils/type";

function coreAnnotation(type, options, draw) {
    return {
        _type: type,
        name: options.name,
        x: options.x,
        y: options.y,
        value: options.value,
        argument: options.argument,
        axis: options.axis,
        draw: function(widget, group) {
            const { x, y } = widget._getAnnotationCoords(this);

            isDefined(x) && isDefined(y) && draw({ x, y }, widget, group);
        }
    };
}

function simpleAnnotation(options) {
    return coreAnnotation("simple", options, function({ x, y }, widget, group) {
        widget._renderer.circle(x, y, 5).attr({ fill: "red" }).append(group);
    });
}

function imageAnnotation(options) {
    const { width, height, url } = options.image;
    return coreAnnotation("image", options, function({ x, y }, widget, group) {
        widget._renderer.image(x - width * 0.5, y - height * 0.5, width, height, url, "center").append(group);
    });
}

function createAnnotation(itemOptions, commonOptions) {
    // Choose annotation type and merge common and individual options
    if(isDefined(itemOptions.image)) {
        return imageAnnotation(itemOptions);
    } else {
        return simpleAnnotation(itemOptions);
    }
}

export let createAnnotations = function(options) {
    return options.items.map(itemOptions => createAnnotation(itemOptions, options));
};

///#DEBUG
export const __test_utils = {
    stub_createAnnotations(stub) {
        this.old_createAnnotations = createAnnotations;
        createAnnotations = stub;
    },
    restore_createAnnotations() {
        createAnnotations = this.old_createAnnotations;
    }
};
///#ENDDEBUG

const chartPlugin = {
    name: "annotations_chart",
    init() {},
    dispose() {},
    members: {
        _getAnnotationCoords(annotation) {
            let x = annotation.x;
            let y = annotation.y;
            const argument = annotation.argument;
            const value = annotation.value;

            if(!isDefined(x) && isDefined(argument)) {
                x = this.getArgumentAxis().getTranslator().translate(argument);
            }

            if(!isDefined(y) && isDefined(value)) {
                const axis = this.getValueAxis(annotation.axis);
                y = axis && axis.getTranslator().translate(value);
            }
            return { x, y };
        }
    }
};
const corePlugin = {
    name: "annotations_core",
    init() {
        this._annotations = { items: [] };
    },
    dispose() {
        this._annotationsGroup.linkRemove().linkOff();
    },
    extenders: {
        _createHtmlStructure() {
            this._annotationsGroup = this._renderer.g().attr({ "class": this._rootClassPrefix + "-annotations" }).linkOn(this._renderer.root, "annotations").linkAppend();
        },
        _renderExtraElements() {
            this._annotationsGroup.clear();
            this._annotations.items.forEach(item => item.draw(this, this._annotationsGroup));
        }
    },
    members: {
        _buildAnnotations() {
            this._annotations.items = [];

            // TODO test theme
            const options = this._themeManager.getOptions("annotations");

            if(!options || !options.items) {
                return;
            }

            this._annotations.items = createAnnotations(options);
        },
        _getAnnotationCoords() { return {}; }
    },
    customize(constructor) {
        constructor.addChange({
            code: "ANNOTATIONS",
            handler() {
                this._buildAnnotations();
                this._change(["FORCE_RENDER"]);
            },
            isThemeDependent: true,
            isOptionChange: true,
            option: "annotations"
        });
    }
};

export const plugins = {
    core: corePlugin,
    chart: chartPlugin
};
