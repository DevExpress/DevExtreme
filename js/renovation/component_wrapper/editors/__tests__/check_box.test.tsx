import CheckBox from '../check_box';

import { addAttributes, getAriaName } from '../../utils/utils';
import Mock = jest.Mock;

jest.mock('../../utils/utils');
jest.mock('../../../../ui/editor/editor', () => ({ }));
jest.mock('../../common/component');

describe('Method', () => {
  it('setAria', () => {
    (getAriaName as Mock).mockImplementation(() => 'ariaName');

    const container = {} as HTMLElement;
    const instance = new CheckBox(container, {});
    instance.$element = () => container;

    instance.setAria('someAttr', 'someValue');

    expect(getAriaName).toHaveBeenNthCalledWith(1, 'someAttr');
    expect(addAttributes).toHaveBeenNthCalledWith(1, container, [{ name: 'ariaName', value: 'someValue' }]);
  });
});
