import registerComponent from "../../core/component_registrator";
import { extend } from "../../core/utils/extend";
import Guid from "../../core/guid";
import Widget from "../widget/ui.widget";
import themes from "../themes";
import { init, dispose } from "./action_button_base";

var FloatingActionButton = Widget.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxFloatingActionButtonOptions.icon
            * @type string
            * @default ""
            */
            icon: "",

            /**
            * @name dxFloatingActionButtonOptions.label
            * @type string
            * @default ""
            */
            label: "",

            /**
            * @name dxFloatingActionButtonOptions.onClick
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field1 event:event
            * @type_function_param1_field2 component:this
            * @type_function_param1_field3 element:dxElement
            * @action
            */

            onClick: null,

            useInkRipple: false,

            /**
            * @name dxFloatingActionButtonOptions.visible
            * @hidden
            * @inheritdoc
            */
            visible: false,

            /**
            * @name dxFloatingActionButtonOptions.width
            * @hidden
            * @inheritdoc
            */
            width: "auto",

            /**
            * @name dxFloatingActionButtonOptions.height
            * @hidden
            * @inheritdoc
            */
            height: "auto",

            /**
            * @name dxFloatingActionButtonOptions.disabled
            * @hidden
            * @inheritdoc
            */
            disabled: false,

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

    _defaultOptionsRules() {
        return this.callBase().concat([
            {
                device: function() {
                    return themes.isMaterial();
                },
                options: {
                    useInkRipple: true
                }
            }
        ]);
    },

    _optionChanged(args) {
        switch(args.name) {
            case "onClick":
                init(this);
                break;
            case "icon":
                init(this);
                break;
            case "label":
            default:
                this.callBase(args);
        }
    },

    _render() {
        init(this);
    },

    _dispose() {
        dispose(this._options.id);
    }
});

registerComponent("dxFloatingActionButton", FloatingActionButton);

module.exports = FloatingActionButton;

