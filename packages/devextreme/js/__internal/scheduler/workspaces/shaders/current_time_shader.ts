import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';

import type SchedulerWorkSpace from '../m_work_space';

const DATE_TIME_SHADER_CLASS = 'dx-scheduler-date-time-shader';

class CurrentTimeShader {
  protected $container = this._workSpace.getShaderContainer();

  _shader!: dxElementWrapper[];

  protected $shader!: dxElementWrapper;

  constructor(public _workSpace: SchedulerWorkSpace) {
  }

  render(): void {
    this.initShaderElements();

    this.renderShader();

    this._shader.forEach((shader) => {
      this.$container.append(shader);
    });
  }

  initShaderElements(): void {
    this.$shader = this.createShader();
    this._shader = [];
    this._shader.push(this.$shader);
  }

  renderShader(): void {}

  createShader(): dxElementWrapper {
    return $('<div>').addClass(DATE_TIME_SHADER_CLASS);
  }

  clean(): void {
    if (this.$container) {
      this.$container.find(`.${DATE_TIME_SHADER_CLASS}`).remove();
    }
  }
}

export default CurrentTimeShader;
