import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';

import type SchedulerWorkSpace from '../workspaces/m_work_space';

const DATE_TIME_SHADER_CLASS = 'dx-scheduler-date-time-shader';

class CurrentTimeShader {
  _$container = this._workSpace._dateTableScrollable.$content();

  _shader!: dxElementWrapper[];

  _$shader!: dxElementWrapper;

  constructor(public _workSpace: SchedulerWorkSpace) {
  }

  render(): void {
    this.initShaderElements();

    this.renderShader();

    this._shader.forEach((shader) => {
      this._$container.append(shader);
    });
  }

  initShaderElements(): void {
    this._$shader = this.createShader();
    this._shader = [];
    this._shader.push(this._$shader);
  }

  renderShader(): void {}

  createShader(): dxElementWrapper {
    return $('<div>').addClass(DATE_TIME_SHADER_CLASS);
  }

  clean(): void {
    if (this._$container) {
      this._$container.find(`.${DATE_TIME_SHADER_CLASS}`).remove();
    }
  }
}

export default CurrentTimeShader;
