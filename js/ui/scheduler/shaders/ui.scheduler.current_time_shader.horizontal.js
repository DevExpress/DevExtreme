const Shader = require('./ui.scheduler.current_time_shader');

const HorizontalCurrentTimeShader = Shader.inherit({
    _renderShader: function() {
        const groupCount = this._workspace.option('groupOrientation') === 'horizontal' ? this._workspace._getGroupCount() : 1;

        this._customizeShader(this._$shader, 0);

        if(groupCount > 1) {
            for(let i = 1; i < groupCount; i++) {
                const $shader = this._createShader();
                this._customizeShader($shader, 1);
                this._shader.push($shader);
            }
        }
    },

    _customizeShader: function($shader, groupIndex) {
        let shaderWidth = this._workspace.getIndicationWidth();
        const maxWidth = this._$container.get(0).getBoundingClientRect().width;

        if(shaderWidth > maxWidth) {
            shaderWidth = maxWidth;
        }

        if(shaderWidth > 0) {
            $shader.width(shaderWidth);
        }

        $shader.css('left', this._workspace._getCellCount() * this._workspace.getCellWidth() * groupIndex);
    },
});

module.exports = HorizontalCurrentTimeShader;
