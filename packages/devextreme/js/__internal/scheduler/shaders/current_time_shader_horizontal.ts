import type { dxElementWrapper } from '@js/core/renderer';
import { getBoundingRect } from '@js/core/utils/position';
import { setWidth } from '@js/core/utils/size';

import CurrentTimeShader from './current_time_shader';

class HorizontalCurrentTimeShader extends CurrentTimeShader {
  renderShader(isHorizontalGroupedWorkSpace: boolean, groupCount: number, cellCount: number): void {
    const effectiveGroupCount = isHorizontalGroupedWorkSpace ? groupCount : 1;

    for (let i = 0; i < effectiveGroupCount; i += 1) {
      const isFirstShader = i === 0;
      const $shader = isFirstShader ? this.$shader : this.createShader();

      if (this.workSpace.isGroupedByDate()) {
        this.customizeGroupedByDateShader($shader, i, groupCount, cellCount);
      } else {
        this.customizeShader($shader, i, cellCount);
      }

      if (!isFirstShader) {
        this.shader.push($shader);
      }
    }
  }

  private customizeShader(
    $shader: dxElementWrapper,
    groupIndex: number,
    dateTableCellCount: number,
  ): void {
    // @ts-expect-error
    const shaderWidth = this.workSpace.getIndicationWidth() as number;

    this.applyShaderWidth($shader, shaderWidth);

    if (groupIndex >= 1) {
      const { workSpace } = this;
      const indicationWidth = dateTableCellCount * workSpace.getCellWidth();
      $shader.css('left', indicationWidth);
    } else {
      $shader.css('left', 0);
    }
  }

  private applyShaderWidth($shader: dxElementWrapper, width: number): void {
    const maxWidth = getBoundingRect(this.$container.get(0)).width;
    if (width > 0) {
      setWidth($shader, Math.min(width, maxWidth));
    }
  }

  private customizeGroupedByDateShader(
    $shader: dxElementWrapper,
    groupIndex: number,
    shaderGroupCount: number,
    dateTableCellCount: number,
  ): void {
    // @ts-expect-error
    const indicationCellCount = this.workSpace.getIndicationCellCount() as number;
    const integerPart = Math.floor(indicationCellCount);
    const fractionPart = indicationCellCount - integerPart;
    const isFirstShaderPart = groupIndex === 0;
    const { workSpace } = this;
    const shaderWidth = isFirstShaderPart
      // @ts-expect-error
      ? workSpace.getIndicationWidth() as number
      : fractionPart * workSpace.getCellWidth();
    let shaderLeft = 0;

    this.applyShaderWidth($shader, shaderWidth);

    if (isFirstShaderPart) {
      shaderLeft = dateTableCellCount * workSpace.getCellWidth() * groupIndex;
    } else {
      shaderLeft = workSpace.getCellWidth() * integerPart * shaderGroupCount
        + groupIndex * workSpace.getCellWidth();
    }

    $shader.css('left', shaderLeft);
  }
}

export default HorizontalCurrentTimeShader;
