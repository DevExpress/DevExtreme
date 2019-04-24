import registerComponent from "../../core/component_registrator";
import { extend } from "../../core/utils/extend";
import Guid from "../../core/guid";
import Widget from "../widget/ui.widget";
import { initAction, disposeAction } from "./speed_dial_main_item";

const SpeedDialAction = Widget.inherit({
    _getDefaultOptions() {
        return extend(this.callBase(), {
            /**
            * @name dxSpeedDialActionOptions.icon
            * @type string
            * @default ""
            */
            icon: "",

            /**
            * @name dxSpeedDialActionOptions.onClick
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field1 event:event
            * @type_function_param1_field2 component:this
            * @type_function_param1_field3 element:dxElement
            * @action
            */

            onClick: null,

            /**
            * @name dxSpeedDialActionOptions.visible
            * @hidden
            * @inheritdoc
            */
            visible: false,

            /**
            * @name dxSpeedDialActionOptions.width
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxSpeedDialActionOptions.height
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxSpeedDialActionOptions.disabled
            * @hidden
            * @inheritdoc
            */

            activeStateEnabled: true,
            hoverStateEnabled: true,
            animation: {
                show: {
                    type: "pop",
                    duration: 150,
                    easing: "linear",
                    from: {
                        scale: 0.3,
                        opacity: 0
                    },
                    to: {
                        scale: 1,
                        opacity: 1
                    }
                },
                hide: {
                    type: "pop",
                    duration: 100,
                    easing: "linear",
                    from: {
                        scale: 1
                    },
                    to: {
                        scale: 0
                    }
                }
            },
            id: new Guid()
        });
    },

    _optionChanged(args) {
        switch(args.name) {
            case "onClick":
            case "icon":
                initAction(this);
                break;
            case "animation":
            case "id":
                break;
            default:
                this.callBase(args);
        }
    },

    _render() {
        initAction(this);
    },

    _dispose() {
        disposeAction(this._options.id);
        this.callBase();
    }
});

registerComponent("dxSpeedDialAction", SpeedDialAction);

module.exports = SpeedDialAction;

