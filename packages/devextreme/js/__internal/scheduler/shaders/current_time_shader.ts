import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';

export interface CurrentTimeShaderConfig {
  $container: dxElementWrapper;
}

const DATE_TIME_SHADER_CLASS = 'dx-scheduler-date-time-shader';

class CurrentTimeShader {
  protected readonly $container: dxElementWrapper;

  protected shader!: dxElementWrapper[];

  protected $shader!: dxElementWrapper;

  constructor(config: CurrentTimeShaderConfig) {
    this.$container = config.$container;
  }

  render(isHorizontalGroupedWorkSpace: boolean, groupCount: number, cellCount: number): void {
    this.initShaderElements();

    this.renderShader(isHorizontalGroupedWorkSpace, groupCount, cellCount);

    this.shader.forEach((shader) => {
      this.$container.append(shader);
    });
  }

  initShaderElements(): void {
    this.$shader = this.createShader();
    this.shader = [];
    this.shader.push(this.$shader);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  renderShader(isHorizontalGroupedWorkSpace: boolean, groupCount: number, cellCount: number):void {}

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
