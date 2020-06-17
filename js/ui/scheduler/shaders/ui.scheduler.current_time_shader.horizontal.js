import { getBoundingRect } from '../../../core/utils/position';
import CurrentTimeShader from '../shaders/ui.scheduler.current_time_shader';

class HorizontalCurrentTimeShader extends CurrentTimeShader {
    renderShader() {
        const groupCount = this._workSpace.option('groupOrientation') === 'horizontal' ? this._workSpace._getGroupCount() : 1;

        for(let i = 0; i < groupCount; i++) {
            const $shader = i === 0 ? this._$shader : this.createShader();
            this._workSpace.isGroupedByDate() ? this._customizeGroupedByDateShader($shader, i) : this._customizeShader($shader, i);
            i !== 0 && this._shader.push($shader);
        }
    }

    _customizeShader($shader, groupIndex) {
        if(groupIndex > 1) { groupIndex = 1; }
        const shaderWidth = this._workSpace.getIndicationWidth();

        this._applyShaderWidth($shader, shaderWidth);

        $shader.css('left', this._workSpace._getCellCount() * this._workSpace.getCellWidth() * groupIndex);
    }

    _applyShaderWidth($shader, width) {
        const maxWidth = getBoundingRect(this._$container.get(0)).width;

        if(width > maxWidth) {
            width = maxWidth;
        }

        if(width > 0) {
            $shader.width(width);
        }
    }

    _customizeGroupedByDateShader($shader, groupIndex) {
        const cellCount = this._workSpace.getIndicationCellCount();
        const integerPart = Math.trunc(cellCount);
        const fractionPart = cellCount - integerPart;
        const isFirstShaderPart = groupIndex === 0;

        const shaderWidth = isFirstShaderPart ? this._workSpace.getIndicationWidth() : fractionPart * this._workSpace.getCellWidth();

        this._applyShaderWidth($shader, shaderWidth);
        this.applyShaderMargin($shader);

        const shaderLeft = isFirstShaderPart ? this._workSpace._getCellCount() * this._workSpace.getCellWidth() * groupIndex :
            this._workSpace.getCellWidth() * integerPart * this._workSpace._getGroupCount() + groupIndex * this._workSpace.getCellWidth();

        $shader.css('left', shaderLeft);
    }
}

module.exports = HorizontalCurrentTimeShader;
