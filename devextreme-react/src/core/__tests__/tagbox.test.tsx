import { render, cleanup } from '@testing-library/react';
import * as React from 'react';
import { TagBox } from '../../tag-box';

jest.useFakeTimers();

describe('templates', () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('should change value without an error', () => {
    const ref = React.createRef() as React.RefObject<TagBox>;
    const { container } = render(<TagBox
      ref={ref}
      dataSource={['1', '2', '3']}
      showClearButton
      value={['1']}
      tagRender={() => <div>test</div>}
    />);
    const instance = ref?.current?.instance;
    instance?.option('value', ['1', '2', '3']);
    jest.runAllTimers();
    expect(container.children[0].getElementsByClassName('dx-tag').length).toBe(3);
  });
});
