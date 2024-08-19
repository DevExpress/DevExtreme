import { NestedComponentMeta } from './types';

const customConfigurationComponent = <C extends {}>(component: C): C => {
  const wrappedComponent = Object.assign<C, NestedComponentMeta>(component, { componentType: 'option' });

  return wrappedComponent;
};

export default customConfigurationComponent;