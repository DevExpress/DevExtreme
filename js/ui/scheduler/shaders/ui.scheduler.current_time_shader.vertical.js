import { getBoundingRect } from '../../../core/utils/position';
import $ from '../../../core/renderer';
import CurrentTimeShader from '../shaders/ui.scheduler.current_time_shader';

const DATE_TIME_SHADER_ALL_DAY_CLASS = 'dx-scheduler-date-time-shader-all-day';
const DATE_TIME_SHADER_TOP_CLASS = 'dx-scheduler-date-time-shader-top';
const DATE_TIME_SHADER_BOTTOM_CLASS = 'dx-scheduler-date-time-shader-bottom';

class VerticalCurrentTimeShader extends CurrentTimeShader {
    renderShader() {
        let shaderHeight = this._getShaderHeight();
        const maxHeight = this._getShaderMaxHeight();
        let renderSolidShader = false;

        if(shaderHeight > maxHeight) {
            shaderHeight = maxHeight;
            renderSolidShader = true;
        }

        if(shaderHeight >= 0) {
            this._$shader.height(shaderHeight);

            const groupCount = this._workSpace._getGroupCount() || 1;

            if(renderSolidShader) {
                this._renderTopShader(this._$shader, shaderHeight, getBoundingRect(this._$container.get(0)).width, 0);
                this._renderAllDayShader(getBoundingRect(this._$container.get(0)).width, 0);
            } else {
                this._workSpace.isGroupedByDate() ? this._renderGroupedByDateShaderParts(groupCount, shaderHeight, maxHeight) : this._renderShaderParts(groupCount, shaderHeight, maxHeight);
            }
        }
    }

    _renderShaderParts(groupCount, shaderHeight, maxHeight) {
        for(let i = 0; i < groupCount; i++) {
            const shaderWidth = this._getShaderWidth(i);
            this._renderTopShader(this._$shader, shaderHeight, shaderWidth, i);

            this._renderBottomShader(this._$shader, maxHeight - shaderHeight, shaderWidth, i);

            this._renderAllDayShader(shaderWidth, i);
        }
    }

    _renderGroupedByDateShaderParts(groupCount, shaderHeight, maxHeight) {
        const shaderWidth = this._getShaderWidth(0);
        const bottomShaderWidth = (shaderWidth - this._workSpace.getCellWidth()) * groupCount + this._workSpace.getCellWidth();

        this._renderTopShader(this._$shader, shaderHeight, shaderWidth * groupCount, 0);

        this._renderBottomShader(this._$shader, maxHeight - shaderHeight, bottomShaderWidth, 0);

        this._renderAllDayShader(shaderWidth * groupCount, 0);
    }

    _renderTopShader($shader, height, width, i) {
        this._$topShader = $('<div>').addClass(DATE_TIME_SHADER_TOP_CLASS);
        width && this._$topShader.width(width) && this._$topShader.height(height);

        this._$topShader.css('marginTop', this._getShaderTopOffset(i));
        this._$topShader.css('left', this._getShaderOffset(i, width));

        $shader.append(this._$topShader);
    }

    _renderBottomShader($shader, height, width, i) {
        this._$bottomShader = $('<div>').addClass(DATE_TIME_SHADER_BOTTOM_CLASS);
        this._$bottomShader.width(width - this._workSpace.getCellWidth()) && this._$bottomShader.height(height);

        this._$bottomShader.css('left', this._getShaderOffset(i, width - this._workSpace.getCellWidth()));

        $shader.append(this._$bottomShader);
    }

    _renderAllDayShader(shaderWidth, i) {
        if(this._workSpace.option('showAllDayPanel')) {
            this._$allDayIndicator = $('<div>').addClass(DATE_TIME_SHADER_ALL_DAY_CLASS);
            this._$allDayIndicator.height(this._workSpace.getAllDayHeight());
            this._$allDayIndicator.width(shaderWidth);
            this._$allDayIndicator.css('left', this._getShaderOffset(i, shaderWidth));

            this._workSpace._$allDayPanel.prepend(this._$allDayIndicator);
        }
    }

    _getShaderOffset(i, width) {
        return this._workSpace.getGroupedStrategy().getShaderOffset(i, width);
    }

    _getShaderTopOffset(i) {
        return this._workSpace.getGroupedStrategy().getShaderTopOffset(i);
    }

    _getShaderHeight(i, width) {
        return this._workSpace.getGroupedStrategy().getShaderHeight();
    }

    _getShaderMaxHeight(i, width) {
        return this._workSpace.getGroupedStrategy().getShaderMaxHeight();
    }

    _getShaderWidth(i) {
        return this._workSpace.getGroupedStrategy().getShaderWidth(i);
    }

    clean() {
        super.clean();

        this._workSpace && this._workSpace._$allDayPanel && this._workSpace._$allDayPanel.find('.' + DATE_TIME_SHADER_ALL_DAY_CLASS).remove();
    }
}


module.exports = VerticalCurrentTimeShader;
