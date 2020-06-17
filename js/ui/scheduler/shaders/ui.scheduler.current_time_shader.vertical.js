const $ = require('../../../core/renderer');
const getBoundingRect = require('../../../core/utils/position').getBoundingRect;
const Shader = require('./ui.scheduler.current_time_shader');

const DATE_TIME_SHADER_ALL_DAY_CLASS = 'dx-scheduler-date-time-shader-all-day';
const DATE_TIME_SHADER_TOP_CLASS = 'dx-scheduler-date-time-shader-top';
const DATE_TIME_SHADER_BOTTOM_CLASS = 'dx-scheduler-date-time-shader-bottom';

const VerticalCurrentTimeShader = Shader.inherit({
    renderShader: function() {
        let shaderHeight = this._getShaderHeight();
        const maxHeight = this._getShaderMaxHeight();
        let renderSolidShader = false;

        if(shaderHeight > maxHeight) {
            shaderHeight = maxHeight;
            renderSolidShader = true;
        }

        if(shaderHeight >= 0) {
            this._$shader.height(shaderHeight);

            const groupCount = this._workspace._getGroupCount() || 1;

            if(renderSolidShader) {
                this._renderTopShader(this._$shader, shaderHeight, getBoundingRect(this._$container.get(0)).width, 0);
                this._renderAllDayShader(getBoundingRect(this._$container.get(0)).width, 0);
            } else {
                const groupByDay = this._workspace.isGroupedByDate();

                if(!groupByDay) {
                    for(let i = 0; i < groupCount; i++) {
                        const shaderWidth = this._getShaderWidth(i);
                        this._renderTopShader(this._$shader, shaderHeight, shaderWidth, i);

                        this._renderBottomShader(this._$shader, maxHeight - shaderHeight, shaderWidth, i);

                        this._renderAllDayShader(shaderWidth, i);
                    }
                } else {
                    const shaderWidth = this._getShaderWidth(0);
                    this._renderTopShader(this._$shader, shaderHeight, shaderWidth * groupCount, 0);

                    this._renderBottomShader(this._$shader, maxHeight - shaderHeight, shaderWidth * groupCount - this._workspace.getCellWidth(), 0);

                    this._renderAllDayShader(shaderWidth * groupCount, 0);
                }
            }
        }
    },

    _renderTopShader: function($shader, height, width, i) {
        this._$topShader = $('<div>').addClass(DATE_TIME_SHADER_TOP_CLASS);
        width && this._$topShader.width(width) && this._$topShader.height(height);

        this._$topShader.css('marginTop', this._getShaderTopOffset(i));
        this._$topShader.css('left', this._getShaderOffset(i, width));

        $shader.append(this._$topShader);
    },

    _renderBottomShader: function($shader, height, width, i) {
        this._$bottomShader = $('<div>').addClass(DATE_TIME_SHADER_BOTTOM_CLASS);
        this._$bottomShader.width(width - this._workspace.getCellWidth()) && this._$bottomShader.height(height);

        this._$bottomShader.css('left', this._getShaderOffset(i, width - this._workspace.getCellWidth()));

        $shader.append(this._$bottomShader);
    },

    _renderAllDayShader: function(shaderWidth, i) {
        if(this._workspace.option('showAllDayPanel')) {
            this._$allDayIndicator = $('<div>').addClass(DATE_TIME_SHADER_ALL_DAY_CLASS);
            this._$allDayIndicator.height(this._workspace.getAllDayHeight());
            this._$allDayIndicator.width(shaderWidth);
            this._$allDayIndicator.css('left', this._getShaderOffset(i, shaderWidth));

            this._workspace._$allDayPanel.prepend(this._$allDayIndicator);
        }
    },

    _getShaderOffset: function(i, width) {
        return this._workspace.getGroupedStrategy().getShaderOffset(i, width);
    },

    _getShaderTopOffset: function(i) {
        return this._workspace.getGroupedStrategy().getShaderTopOffset(i);
    },

    _getShaderHeight: function(i, width) {
        return this._workspace.getGroupedStrategy().getShaderHeight();
    },

    _getShaderMaxHeight: function(i, width) {
        return this._workspace.getGroupedStrategy().getShaderMaxHeight();
    },

    _getShaderWidth: function(i) {
        return this._workspace.getGroupedStrategy().getShaderWidth(i);
    },

    clean: function() {
        this.callBase();

        this._workspace && this._workspace._$allDayPanel && this._workspace._$allDayPanel.find('.' + DATE_TIME_SHADER_ALL_DAY_CLASS).remove();
    }
});

module.exports = VerticalCurrentTimeShader;
