const $ = require('../../core/renderer');
const window = require('../../core/utils/window').getWindow();
const DateView = require('./ui.date_view');
const DateBoxStrategy = require('./ui.date_box.strategy');
const support = require('../../core/utils/support');
const extend = require('../../core/utils/extend').extend;
const dateUtils = require('./ui.date_utils');
const messageLocalization = require('../../localization/message');

const DateViewStrategy = DateBoxStrategy.inherit({

    NAME: 'DateView',

    getDefaultOptions: function() {
        return extend(this.callBase(), {
            openOnFieldClick: true,
            applyButtonText: messageLocalization.format('OK')
        });
    },

    getDisplayFormat: function(displayFormat) {
        return displayFormat || dateUtils.FORMATS_MAP[this.dateBox.option('type')];
    },

    popupConfig: function(config) {

        return {
            showTitle: true,
            toolbarItems: this.dateBox._popupToolbarItemsConfig(),
            onInitialized: config.onInitialized,

            defaultOptionsRules: [
                {
                    device: { platform: 'android' },
                    options: {
                        width: 333,
                        height: 331
                    }
                },
                {
                    device: function(device) {
                        const platform = device.platform;
                        return platform === 'generic' || platform === 'ios';
                    },
                    options: {
                        width: 'auto',
                        height: 'auto'
                    }
                },
                {
                    device: function(device) {
                        const platform = device.platform;
                        const phone = device.phone;

                        return platform === 'generic' && phone;
                    },
                    options: {
                        width: 333,
                        maxWidth: '100%',
                        maxHeight: '100%',
                        height: 'auto',
                        position: {
                            collision: 'flipfit flip'
                        }
                    }
                },
                {
                    device: { platform: 'ios', phone: true },
                    options: {
                        width: '100%',
                        position: {
                            my: 'bottom',
                            at: 'bottom',
                            of: window
                        }
                    }
                }
            ]
        };
    },

    _renderWidget: function() {
        if(support.inputType(this.dateBox.option('mode')) && this.dateBox._isNativeType() || this.dateBox.option('readOnly')) {
            if(this._widget) {
                this._widget.$element().remove();
                this._widget = null;
            }

            return;
        }

        const popup = this._getPopup();

        if(this._widget) {
            this._widget.option(this._getWidgetOptions());
        } else {
            const element = $('<div>').appendTo(popup.$content());
            this._widget = this._createWidget(element);
        }

        this._widget.$element().appendTo(this._getWidgetContainer());
    },

    _getWidgetName: function() {
        return DateView;
    },

    _getWidgetOptions: function() {
        return {
            value: this.dateBoxValue() || new Date(),
            type: this.dateBox.option('type'),
            minDate: this.dateBox.dateOption('min') || new Date(1900, 0, 1),
            maxDate: this.dateBox.dateOption('max') || new Date(Date.now() + 50 * dateUtils.ONE_YEAR),
            onDisposing: (function() {
                this._widget = null;
            }).bind(this)
        };
    }
});

module.exports = DateViewStrategy;
