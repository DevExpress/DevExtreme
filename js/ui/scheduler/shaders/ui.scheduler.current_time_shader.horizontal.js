import { getBoundingRect } from '../../../core/utils/position';
import CurrentTimeShader from '../shaders/ui.scheduler.current_time_shader';

class HorizontalCurrentTimeShader extends CurrentTimeShader {
    renderShader() {
        const groupCount = this._workSpace.option('groupOrientation') === 'horizontal' ? this._workSpace._getGroupCount() : 1;

        for(let i = 0; i < groupCount; i++) {
            const isFirstShader = i === 0;
            const $shader = isFirstShader ? this._$shader : this.createShader();

            if(this._workSpace.isGroupedByDate()) {
                this._customizeGroupedByDateShader($shader, i);
            } else {
                this._customizeShader($shader, i);
            }

            !isFirstShader && this._shaderCollection.push($shader);
        }
    }

    _customizeShader($shader, groupIndex) {
        const shaderWidth = this._workSpace.getIndicationWidth();

        this._applyShaderWidth($shader, shaderWidth);

        $shader.css('left', this._workSpace._getCellCount() * this._workSpace.getCellWidth() * (groupIndex >= 1 ? 1 : 0));
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
        const integerPart = Math.floor(cellCount);
        const fractionPart = cellCount - integerPart;
        const isFirstShaderPart = groupIndex === 0;
        const workSpace = this._workSpace;
        const shaderWidth = isFirstShaderPart ? workSpace.getIndicationWidth() : fractionPart * workSpace.getCellWidth();
        let shaderLeft;

        this._applyShaderWidth($shader, shaderWidth);
        this.applyShaderMargin($shader);

        if(isFirstShaderPart) {
            shaderLeft = workSpace._getCellCount() * workSpace.getCellWidth() * groupIndex;
        } else {
            shaderLeft = workSpace.getCellWidth() * integerPart * workSpace._getGroupCount() + groupIndex * workSpace.getCellWidth();
        }

        $shader.css('left', shaderLeft);
    }
}

module.exports = HorizontalCurrentTimeShader;
