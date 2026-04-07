import type { dxElementWrapper } from '@js/core/renderer';
import { getBoundingRect } from '@js/core/utils/position';
import { setWidth } from '@js/core/utils/size';

import CurrentTimeShader from './current_time_shader';

class HorizontalCurrentTimeShader extends CurrentTimeShader {
  renderShader(): void {
    const groupCount = this.workSpace._isHorizontalGroupedWorkSpace()
      ? this.workSpace._getGroupCount()
      : 1;

    for (let i = 0; i < groupCount; i += 1) {
      const isFirstShader = i === 0;
      const $shader = isFirstShader ? this.$shader : this.createShader();

      if (this.workSpace.isGroupedByDate()) {
        this.customizeGroupedByDateShader($shader, i);
      } else {
        this.customizeShader($shader, i);
      }

      if (!isFirstShader) {
        this.shader.push($shader);
      }
    }
  }

  private customizeShader($shader: dxElementWrapper, groupIndex: number): void {
    // @ts-expect-error
    const shaderWidth = this.workSpace.getIndicationWidth() as number;

    this.applyShaderWidth($shader, shaderWidth);

    if (groupIndex >= 1) {
      const { workSpace } = this;
      const indicationWidth = workSpace._getCellCount() * workSpace.getCellWidth();
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

  private customizeGroupedByDateShader($shader: dxElementWrapper, groupIndex: number): void {
    // @ts-expect-error
    const cellCount = this.workSpace.getIndicationCellCount() as number;
    const integerPart = Math.floor(cellCount);
    const fractionPart = cellCount - integerPart;
    const isFirstShaderPart = groupIndex === 0;
    const { workSpace } = this;
    const shaderWidth = isFirstShaderPart
      // @ts-expect-error
      ? workSpace.getIndicationWidth() as number
      : fractionPart * workSpace.getCellWidth();
    let shaderLeft = 0;

    this.applyShaderWidth($shader, shaderWidth);

    if (isFirstShaderPart) {
      shaderLeft = workSpace._getCellCount() * workSpace.getCellWidth() * groupIndex;
    } else {
      shaderLeft = workSpace.getCellWidth() * integerPart * workSpace._getGroupCount()
        + groupIndex * workSpace.getCellWidth();
    }

    $shader.css('left', shaderLeft);
  }
}

export default HorizontalCurrentTimeShader;
