import $, { type dxElementWrapper } from '@js/core/renderer';
import { setHeight, setWidth } from '@js/core/utils/size';

import CurrentTimeShader from './current_time_shader';

const DATE_TIME_SHADER_ALL_DAY_CLASS = 'dx-scheduler-date-time-shader-all-day';
const DATE_TIME_SHADER_TOP_CLASS = 'dx-scheduler-date-time-shader-top';
const DATE_TIME_SHADER_BOTTOM_CLASS = 'dx-scheduler-date-time-shader-bottom';

class VerticalCurrentTimeShader extends CurrentTimeShader {
  _$topShader!: dxElementWrapper;

  _$bottomShader!: dxElementWrapper;

  _$allDayIndicator!: dxElementWrapper;

  renderShader(): void {
    let shaderHeight = this.getShaderHeight();
    const maxHeight = this.getShaderMaxHeight();
    const isSolidShader = shaderHeight > maxHeight;

    if (shaderHeight > maxHeight) {
      shaderHeight = maxHeight;
    }

    setHeight(this._$shader, shaderHeight);
    const groupCount = this._workSpace._getGroupCount() || 1;

    if (this._workSpace.isGroupedByDate()) {
      this.renderGroupedByDateShaderParts(groupCount, shaderHeight, maxHeight, isSolidShader);
    } else {
      this.renderShaderParts(groupCount, shaderHeight, maxHeight, isSolidShader);
    }
  }

  private renderShaderParts(
    groupCount: number,
    shaderHeight: number,
    maxHeight: number,
    isSolidShader: boolean,
  ): void {
    for (let i = 0; i < groupCount; i += 1) {
      const shaderWidth = this.getShaderWidth();
      this.renderTopShader(this._$shader, shaderHeight, shaderWidth, i);

      if (!isSolidShader) {
        this.renderBottomShader(this._$shader, maxHeight, shaderHeight, shaderWidth, i);
      }

      this.renderAllDayShader(shaderWidth, i);
    }
  }

  private renderGroupedByDateShaderParts(
    groupCount: number,
    shaderHeight: number,
    maxHeight: number,
    isSolidShader: boolean,
  ): void {
    const shaderWidth = this.getShaderWidth();
    const bottomShaderWidth = shaderHeight < 0
      ? shaderWidth
      : shaderWidth - this._workSpace.getCellWidth();
    const normalizedShaderHeight = Math.max(shaderHeight, 0);

    this.renderTopShader(this._$shader, normalizedShaderHeight, shaderWidth * groupCount, 0);

    if (!isSolidShader) {
      this.renderBottomShader(
        this._$shader,
        maxHeight,
        normalizedShaderHeight,
        bottomShaderWidth * groupCount + this._workSpace.getCellWidth(),
        0,
      );
    }

    this.renderAllDayShader(shaderWidth * groupCount, 0);
  }

  private renderTopShader(
    $shader: dxElementWrapper,
    height: number,
    width: number,
    i: number,
  ): void {
    this._$topShader = $('<div>').addClass(DATE_TIME_SHADER_TOP_CLASS);
    if (width) {
      setWidth(this._$topShader, width);
    }
    if (height) {
      setHeight(this._$topShader, height);
    }

    this._$topShader.css('marginTop', this.getShaderTopOffset(i));
    this._$topShader.css('left', this.getShaderOffset(i, width));

    $shader.append(this._$topShader);
  }

  private renderBottomShader(
    $shader: dxElementWrapper,
    maxHeight: number,
    height: number,
    width: number,
    i: number,
  ): void {
    this._$bottomShader = $('<div>').addClass(DATE_TIME_SHADER_BOTTOM_CLASS);

    const shaderWidth = height < 0 ? width : width - this._workSpace.getCellWidth();
    const shaderHeight = height < 0 ? maxHeight : maxHeight - height;

    setWidth(this._$bottomShader, shaderWidth);
    setHeight(this._$bottomShader, shaderHeight);

    this._$bottomShader.css('left', this.getShaderOffset(i, width - this._workSpace.getCellWidth()));

    $shader.append(this._$bottomShader);
  }

  private renderAllDayShader(shaderWidth: number, i: number): void {
    if (this._workSpace.option('showAllDayPanel')) {
      this._$allDayIndicator = $('<div>').addClass(DATE_TIME_SHADER_ALL_DAY_CLASS);
      setHeight(this._$allDayIndicator, this._workSpace.getAllDayHeight());
      setWidth(this._$allDayIndicator, shaderWidth);
      this._$allDayIndicator.css('left', this.getShaderOffset(i, shaderWidth));

      this._workSpace._$allDayPanel.prepend(this._$allDayIndicator);
    }
  }

  private getShaderOffset(i: number, width: number): number {
    return this._workSpace.getGroupedStrategy().getShaderOffset(i, width) as number;
  }

  private getShaderTopOffset(i: number): number {
    return this._workSpace.getGroupedStrategy().getShaderTopOffset(i) as number;
  }

  private getShaderHeight(): number {
    return this._workSpace.getGroupedStrategy().getShaderHeight() as number;
  }

  private getShaderMaxHeight(): number {
    return this._workSpace.getGroupedStrategy().getShaderMaxHeight() as number;
  }

  private getShaderWidth(): number {
    return this._workSpace.getGroupedStrategy().getShaderWidth() as number;
  }

  clean(): void {
    super.clean();

    if (this._workSpace?._$allDayPanel) {
      this._workSpace._$allDayPanel.find(`.${DATE_TIME_SHADER_ALL_DAY_CLASS}`).remove();
    }
  }
}

export default VerticalCurrentTimeShader;
