import type { dxElementWrapper } from '@js/core/renderer';
import { getBoundingRect } from '@js/core/utils/position';
import { setWidth } from '@js/core/utils/size';

import CurrentTimeShader from './current_time_shader';

class HorizontalCurrentTimeShader extends CurrentTimeShader {
  renderShader(): void {
    const groupCount = this._workSpace._isHorizontalGroupedWorkSpace()
      ? this._workSpace._getGroupCount()
      : 1;

    for (let i = 0; i < groupCount; i += 1) {
      const isFirstShader = i === 0;
      const $shader = isFirstShader ? this._$shader : this.createShader();

      if (this._workSpace.isGroupedByDate()) {
        this._customizeGroupedByDateShader($shader, i);
      } else {
        this._customizeShader($shader, i);
      }

      if (!isFirstShader) {
        this._shader.push($shader);
      }
    }
  }

  _customizeShader($shader: dxElementWrapper, groupIndex: number): void {
    // @ts-expect-error
    const shaderWidth = this._workSpace.getIndicationWidth() as number;

    this._applyShaderWidth($shader, shaderWidth);

    if (groupIndex >= 1) {
      const workSpace = this._workSpace;
      const indicationWidth = workSpace._getCellCount() * workSpace.getCellWidth();
      $shader.css('left', indicationWidth);
    } else {
      $shader.css('left', 0);
    }
  }

  _applyShaderWidth($shader: dxElementWrapper, width: number): void {
    const maxWidth = getBoundingRect(this._$container.get(0)).width;
    let localWidth = width;

    if (width > maxWidth) {
      localWidth = maxWidth;
    }

    if (localWidth > 0) {
      setWidth($shader, localWidth);
    }
  }

  _customizeGroupedByDateShader($shader: dxElementWrapper, groupIndex: number): void {
    // @ts-expect-error
    const cellCount = this._workSpace.getIndicationCellCount() as number;
    const integerPart = Math.floor(cellCount);
    const fractionPart = cellCount - integerPart;
    const isFirstShaderPart = groupIndex === 0;
    const workSpace = this._workSpace;
    const shaderWidth = isFirstShaderPart
      // @ts-expect-error
      ? workSpace.getIndicationWidth() as number
      : fractionPart * workSpace.getCellWidth();
    let shaderLeft = 0;

    this._applyShaderWidth($shader, shaderWidth);

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
