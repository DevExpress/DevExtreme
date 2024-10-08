import { describe, it } from '@jest/globals';

import <%= name_pascal %> from './index';

describe('markup', () => {
  it('should be good on initial render', () => {
    const container = document.createElement('div');
    const <%= name_camel %> = new <%= name_pascal %>(container, {});

    expect(container).toMatchSnapshot();
  });
});

describe('options', () => {

});

describe('methods', () => {

});
