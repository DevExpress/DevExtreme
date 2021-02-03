import { configure as configureEnzyme, mount, shallow } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';

configureEnzyme({ adapter: new Adapter() });
jest.useFakeTimers();

beforeEach(() => {
  jest.clearAllMocks();
});

export {
  mount,
  shallow,
  React,
};
