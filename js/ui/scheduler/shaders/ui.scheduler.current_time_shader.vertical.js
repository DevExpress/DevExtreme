import { setHeight, setWidth } from '../../../core/utils/size';
import $ from '../../../core/renderer';
import CurrentTimeShader from '../shaders/ui.scheduler.current_time_shader';
import { ALL_DAY_BEHAVIOR_JS_NAMES } from '../../../renovation/ui/scheduler/appointment/allDayStrategy/index';

const DATE_TIME_SHADER_ALL_DAY_CLASS = 'dx-scheduler-date-time-shader-all-day';
const DATE_TIME_SHADER_TOP_CLASS = 'dx-scheduler-date-time-shader-top';
const DATE_TIME_SHADER_BOTTOM_CLASS = 'dx-scheduler-date-time-shader-bottom';

class VerticalCurrentTimeShader extends CurrentTimeShader {
    renderShader() {
        let shaderHeight = this._getShaderHeight();
        const maxHeight = this._getShaderMaxHeight();
        const isSolidShader = shaderHeight > maxHeight;

        if(shaderHeight > maxHeight) {
            shaderHeight = maxHeight;
        }

        setHeight(this._$shader, shaderHeight);
        const groupCount = this._workSpace._getGroupCount() || 1;

        if(this._workSpace.isGroupedByDate()) {
            this._renderGroupedByDateShaderParts(groupCount, shaderHeight, maxHeight, isSolidShader);
        } else {
            this._renderShaderParts(groupCount, shaderHeight, maxHeight, isSolidShader);
        }
    }

    _renderShaderParts(groupCount, shaderHeight, maxHeight, isSolidShader) {
        for(let i = 0; i < groupCount; i++) {
            const shaderWidth = this._getShaderWidth(i);
            this._renderTopShader(this._$shader, shaderHeight, shaderWidth, i);

            !isSolidShader && this._renderBottomShader(this._$shader, maxHeight, shaderHeight, shaderWidth, i);

            this._renderAllDayShader(shaderWidth, i);
        }
    }

    _renderGroupedByDateShaderParts(groupCount, shaderHeight, maxHeight, isSolidShader) {
        const shaderWidth = this._getShaderWidth(0);
        let bottomShaderWidth = shaderWidth - this._workSpace.getCellWidth();

        if(shaderHeight < 0) {
            shaderHeight = 0;
            bottomShaderWidth = shaderWidth;
        }

        this._renderTopShader(this._$shader, shaderHeight, shaderWidth * groupCount, 0);

        !isSolidShader && this._renderBottomShader(this._$shader, maxHeight, shaderHeight, bottomShaderWidth * groupCount + this._workSpace.getCellWidth(), 0);

        this._renderAllDayShader(shaderWidth * groupCount, 0);
    }

    _renderTopShader($shader, height, width, i) {
        this._$topShader = $('<div>').addClass(DATE_TIME_SHADER_TOP_CLASS);
        if(width) {
            setWidth(this._$topShader, width);
        }
        if(height) {
            setHeight(this._$topShader, height);
        }

        this._$topShader.css('marginTop', this._getShaderTopOffset(i));
        this._$topShader.css('left', this._getShaderOffset(i, width));

        $shader.append(this._$topShader);
    }

    _renderBottomShader($shader, maxHeight, height, width, i) {
        this._$bottomShader = $('<div>').addClass(DATE_TIME_SHADER_BOTTOM_CLASS);

        const shaderWidth = height < 0 ? width : width - this._workSpace.getCellWidth();
        const shaderHeight = height < 0 ? maxHeight : maxHeight - height;

        setWidth(this._$bottomShader, shaderWidth);
        setHeight(this._$bottomShader, shaderHeight);

        this._$bottomShader.css('left', this._getShaderOffset(i, width - this._workSpace.getCellWidth()));

        $shader.append(this._$bottomShader);
    }

    _renderAllDayShader(shaderWidth, i) {
        const allDayPanelVisible = this._workSpace.option(ALL_DAY_BEHAVIOR_JS_NAMES.optionName).allDayPanelVisible;

        if(allDayPanelVisible) {
            this._$allDayIndicator = $('<div>').addClass(DATE_TIME_SHADER_ALL_DAY_CLASS);
            setHeight(this._$allDayIndicator, this._workSpace.getAllDayHeight());
            setWidth(this._$allDayIndicator, shaderWidth);
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


export default VerticalCurrentTimeShader;
