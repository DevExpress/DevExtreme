const Shader = require('./ui.scheduler.current_time_shader');
import { getBoundingRect } from '../../../core/utils/position';

const HorizontalCurrentTimeShader = Shader.inherit({
    renderShader: function() {
        const groupCount = this._workspace.option('groupOrientation') === 'horizontal' ? this._workspace._getGroupCount() : 1;

        for(let i = 0; i < groupCount; i++) {
            const $shader = i === 0 ? this._$shader : this.createShader();
            this._workspace.isGroupedByDate() ? this._customizeGroupedByDateShader($shader, i) : this._customizeShader($shader, i);
            i !== 0 && this._shader.push($shader);
        }
    },

    _customizeShader: function($shader, groupIndex) {
        if(groupIndex > 1) { groupIndex = 1; }
        const shaderWidth = this._workspace.getIndicationWidth();

        this._applyShaderWidth($shader, shaderWidth);

        $shader.css('left', this._workspace._getCellCount() * this._workspace.getCellWidth() * groupIndex);
    },

    _applyShaderWidth: function($shader, width) {
        const maxWidth = getBoundingRect(this._$container.get(0)).width;

        if(width > maxWidth) {
            width = maxWidth;
        }

        if(width > 0) {
            $shader.width(width);
        }
    },

    _customizeGroupedByDateShader: function($shader, groupIndex) {
        const cellCount = this._workspace.getIndicationCellCount();
        const integerPart = Math.trunc(cellCount);
        const fractionPart = cellCount - integerPart;
        const isFirstShaderPart = groupIndex === 0;

        const shaderWidth = isFirstShaderPart ? this._workspace.getIndicationWidth() : fractionPart * this._workspace.getCellWidth();

        this._applyShaderWidth($shader, shaderWidth);
        this.applyShaderMargin($shader);

        const shaderLeft = isFirstShaderPart ? this._workspace._getCellCount() * this._workspace.getCellWidth() * groupIndex :
            this._workspace.getCellWidth() * integerPart * this._workspace._getGroupCount() + groupIndex * this._workspace.getCellWidth();

        $shader.css('left', shaderLeft);
    }
});

module.exports = HorizontalCurrentTimeShader;
