import {DxSlideToggle} from '@devexpress/react/slideToggle';
import React, {useCallback} from 'react';

function UncontrolledSlideToggleExample() {
  const handleValueChange = useCallback((value: boolean) => console.log(`value change fired with: %c${value}`, 'color: green'), []);

  return (
    <div className="example">
      <div className="example__title">
        Uncontrolled mode
      </div>
      <div className="example__control">
        <DxSlideToggle defaultValue={false}
                       text={'React passed text'}
                       textPosition={'left'}
                       valueChange={handleValueChange}/>
      </div>
      <div className="example__info">
        See console for notifications.
      </div>
    </div>
  )
}

export {UncontrolledSlideToggleExample};
