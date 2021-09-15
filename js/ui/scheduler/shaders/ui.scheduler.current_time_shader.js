
import $ from '../../../core/renderer';

const DATE_TIME_SHADER_CLASS = 'dx-scheduler-date-time-shader';

class CurrentTimeShader {
    constructor(workSpace) {
        this._workSpace = workSpace;
        this._$container = this._workSpace._dateTableScrollable.$content();
    }

    render() {
        this.initShaderElements();

        this.renderShader();

        this._shader.forEach((shader, index) => {
            this._$container.append(shader);
        });
    }

    initShaderElements() {
        this._$shader = this.createShader();
        this._shader = [];
        this._shader.push(this._$shader);
    }

    renderShader() {}

    createShader() {
        return $('<div>').addClass(DATE_TIME_SHADER_CLASS);
    }

    clean() {
        this._$container && this._$container.find('.' + DATE_TIME_SHADER_CLASS).remove();
    }
}

export default CurrentTimeShader;
