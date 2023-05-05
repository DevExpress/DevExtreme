import generate from './component-generator';

it('generates', () => {
  // #region EXPECTED
  const EXPECTED = `
import dxCLASS_NAME, {
    Properties
} from "DX/WIDGET/PATH";

import { Component as BaseComponent, IHtmlOptions } from "BASE_COMPONENT_PATH";

type ICLASS_NAMEOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
}>

class CLASS_NAME extends BaseComponent<React.PropsWithChildren<ICLASS_NAMEOptions>> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;
}
export default CLASS_NAME;
export {
  CLASS_NAME,
  ICLASS_NAMEOptions
};
`.trimLeft();
    // #endregion

  expect(
    generate({
      name: 'CLASS_NAME',
      baseComponentPath: 'BASE_COMPONENT_PATH',
      extensionComponentPath: 'EXTENSION_COMPONENT_PATH',
      dxExportPath: 'DX/WIDGET/PATH',
    }),
  ).toBe(EXPECTED);
});

it('generates extension component', () => {
  // #region EXPECTED
  const EXPECTED = `
import dxCLASS_NAME, {
    Properties as ICLASS_NAMEOptions
} from "DX/WIDGET/PATH";

import { ExtensionComponent as BaseComponent } from "EXTENSION_COMPONENT_PATH";

class CLASS_NAME extends BaseComponent<React.PropsWithChildren<ICLASS_NAMEOptions>> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;
}
export default CLASS_NAME;
export {
  CLASS_NAME,
  ICLASS_NAMEOptions
};
`.trimLeft();
    // #endregion

  expect(
    generate({
      name: 'CLASS_NAME',
      baseComponentPath: 'BASE_COMPONENT_PATH',
      extensionComponentPath: 'EXTENSION_COMPONENT_PATH',
      dxExportPath: 'DX/WIDGET/PATH',
      isExtension: true,
    }),
  ).toBe(EXPECTED);
});

describe('generic types clause', () => {
  it('is generated', () => {
    // #region EXPECTED
    const EXPECTED = `
export { ExplicitTypes } from "DX/WIDGET/PATH";
import dxCLASS_NAME, {
    Properties
} from "DX/WIDGET/PATH";

import { Component as BaseComponent, IHtmlOptions } from "BASE_COMPONENT_PATH";

type ICLASS_NAMEOptions<T1 = any, T2 = any> = React.PropsWithChildren<Properties<T1, T2> & IHtmlOptions & {
  dataSource?: Properties<T1, T2>["dataSource"];
}>

class CLASS_NAME<T1 = any, T2 = any> extends BaseComponent<React.PropsWithChildren<ICLASS_NAMEOptions<T1, T2>>> {

  public get instance(): dxCLASS_NAME<T1, T2> {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;
}
export default CLASS_NAME;
export {
  CLASS_NAME,
  ICLASS_NAMEOptions
};
`.trimLeft();
      // #endregion

    expect(
      generate({
        name: 'CLASS_NAME',
        baseComponentPath: 'BASE_COMPONENT_PATH',
        extensionComponentPath: 'EXTENSION_COMPONENT_PATH',
        dxExportPath: 'DX/WIDGET/PATH',
        optionsTypeParams: ['T1', 'T2'],
      }),
    ).toBe(EXPECTED);
  });

  it('is not generated if params array is empty', () => {
    const component = {
      name: 'CLASS_NAME',
      baseComponentPath: 'BASE_COMPONENT_PATH',
      extensionComponentPath: 'EXTENSION_COMPONENT_PATH',
      dxExportPath: 'DX/WIDGET/PATH',
    };
    const EXPECTED = generate(component);

    expect(
      generate({
        ...component,
        optionsTypeParams: [],
      }),
    ).toBe(EXPECTED);
  });
});

describe('template-props generation', () => {
  it('processes option', () => {
    // #region EXPECTED
    const EXPECTED = `
import dxCLASS_NAME, {
    Properties
} from "DX/WIDGET/PATH";

import { Component as BaseComponent, IHtmlOptions } from "BASE_COMPONENT_PATH";

type ICLASS_NAMEOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
  optionRender?: (...params: any) => React.ReactNode;
  optionComponent?: React.ComponentType<any>;
  optionKeyFn?: (data: any) => string;
}>

class CLASS_NAME extends BaseComponent<React.PropsWithChildren<ICLASS_NAMEOptions>> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;

  protected _templateProps = [{
    tmplOption: "optionTemplate",
    render: "optionRender",
    component: "optionComponent",
    keyFn: "optionKeyFn"
  }];
}
export default CLASS_NAME;
export {
  CLASS_NAME,
  ICLASS_NAMEOptions
};
`.trimLeft();
    // #endregion

    expect(
      generate({
        name: 'CLASS_NAME',
        baseComponentPath: 'BASE_COMPONENT_PATH',
        extensionComponentPath: 'EXTENSION_COMPONENT_PATH',
        dxExportPath: 'DX/WIDGET/PATH',
        templates: ['optionTemplate'],
      }),
    ).toBe(EXPECTED);
  });

  it('processes several options', () => {
    // #region EXPECTED
    const EXPECTED = `
import dxCLASS_NAME, {
    Properties
} from "DX/WIDGET/PATH";

import { Component as BaseComponent, IHtmlOptions } from "BASE_COMPONENT_PATH";

type ICLASS_NAMEOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
  optionRender?: (...params: any) => React.ReactNode;
  optionComponent?: React.ComponentType<any>;
  optionKeyFn?: (data: any) => string;
  anotherOptionRender?: (...params: any) => React.ReactNode;
  anotherOptionComponent?: React.ComponentType<any>;
  anotherOptionKeyFn?: (data: any) => string;
}>

class CLASS_NAME extends BaseComponent<React.PropsWithChildren<ICLASS_NAMEOptions>> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;

  protected _templateProps = [{
    tmplOption: "optionTemplate",
    render: "optionRender",
    component: "optionComponent",
    keyFn: "optionKeyFn"
  }, {
    tmplOption: "anotherOptionTemplate",
    render: "anotherOptionRender",
    component: "anotherOptionComponent",
    keyFn: "anotherOptionKeyFn"
  }];
}
export default CLASS_NAME;
export {
  CLASS_NAME,
  ICLASS_NAMEOptions
};
`.trimLeft();
    // #endregion

    expect(
      generate({
        name: 'CLASS_NAME',
        baseComponentPath: 'BASE_COMPONENT_PATH',
        extensionComponentPath: 'EXTENSION_COMPONENT_PATH',
        dxExportPath: 'DX/WIDGET/PATH',
        templates: ['optionTemplate', 'anotherOptionTemplate'],
      }),
    ).toBe(EXPECTED);
  });

  it('processes single widget-template option', () => {
    // #region EXPECTED
    const EXPECTED = `
import dxCLASS_NAME, {
    Properties
} from "DX/WIDGET/PATH";

import { Component as BaseComponent, IHtmlOptions } from "BASE_COMPONENT_PATH";

type ICLASS_NAMEOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>

class CLASS_NAME extends BaseComponent<React.PropsWithChildren<ICLASS_NAMEOptions>> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;

  protected _templateProps = [{
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}
export default CLASS_NAME;
export {
  CLASS_NAME,
  ICLASS_NAMEOptions
};
`.trimLeft();
    // #endregion

    expect(
      generate({
        name: 'CLASS_NAME',
        baseComponentPath: 'BASE_COMPONENT_PATH',
        extensionComponentPath: 'EXTENSION_COMPONENT_PATH',
        dxExportPath: 'DX/WIDGET/PATH',
        templates: ['template'],
      }),
    ).toBe(EXPECTED);
  });
});

describe('props generation', () => {
  it('processes subscribable option', () => {
    // #region EXPECTED
    const EXPECTED = `
import dxCLASS_NAME, {
    Properties
} from "DX/WIDGET/PATH";

import { Component as BaseComponent, IHtmlOptions } from "BASE_COMPONENT_PATH";

type ICLASS_NAMEOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
  defaultOption1?: someType;
  onOption1Change?: (value: someType) => void;
}>

class CLASS_NAME extends BaseComponent<React.PropsWithChildren<ICLASS_NAMEOptions>> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;

  protected subscribableOptions = ["option1"];

  protected _defaults = {
    defaultOption1: "option1"
  };
}
export default CLASS_NAME;
export {
  CLASS_NAME,
  ICLASS_NAMEOptions
};
`.trimLeft();
    // #endregion

    expect(
      generate({
        name: 'CLASS_NAME',
        baseComponentPath: 'BASE_COMPONENT_PATH',
        extensionComponentPath: 'EXTENSION_COMPONENT_PATH',
        dxExportPath: 'DX/WIDGET/PATH',
        subscribableOptions: [
          { name: 'option1', type: 'someType' },
        ],
      }),
    ).toBe(EXPECTED);
  });

  it('processes several subscribable options', () => {
    // #region EXPECTED
    const EXPECTED = `
import dxCLASS_NAME, {
    Properties
} from "DX/WIDGET/PATH";

import { Component as BaseComponent, IHtmlOptions } from "BASE_COMPONENT_PATH";

type ICLASS_NAMEOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
  defaultOption1?: someType;
  defaultOption2?: anotherType;
  onOption1Change?: (value: someType) => void;
  onOption2Change?: (value: anotherType) => void;
}>

class CLASS_NAME extends BaseComponent<React.PropsWithChildren<ICLASS_NAMEOptions>> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;

  protected subscribableOptions = ["option1","option2"];

  protected _defaults = {
    defaultOption1: "option1",
    defaultOption2: "option2"
  };
}
export default CLASS_NAME;
export {
  CLASS_NAME,
  ICLASS_NAMEOptions
};
`.trimLeft();
    // #endregion

    expect(
      generate({
        name: 'CLASS_NAME',
        baseComponentPath: 'BASE_COMPONENT_PATH',
        extensionComponentPath: 'EXTENSION_COMPONENT_PATH',
        dxExportPath: 'DX/WIDGET/PATH',
        subscribableOptions: [
          { name: 'option1', type: 'someType' },
          { name: 'option2', type: 'anotherType' },
        ],
      }),
    ).toBe(EXPECTED);
  });

  it('processes nested subscribable option', () => {
    // #region EXPECTED
    const EXPECTED = `
import dxCLASS_NAME, {
    Properties
} from "DX/WIDGET/PATH";

import { Component as BaseComponent, IHtmlOptions } from "BASE_COMPONENT_PATH";

type ICLASS_NAMEOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
  defaultOption1?: someType;
  onOption1Change?: (value: someType) => void;
}>

class CLASS_NAME extends BaseComponent<React.PropsWithChildren<ICLASS_NAMEOptions>> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;

  protected subscribableOptions = ["option1","option1.subOption1","option2.subOption1"];

  protected _defaults = {
    defaultOption1: "option1"
  };
}
export default CLASS_NAME;
export {
  CLASS_NAME,
  ICLASS_NAMEOptions
};
`.trimLeft();
    // #endregion

    expect(
      generate({
        name: 'CLASS_NAME',
        baseComponentPath: 'BASE_COMPONENT_PATH',
        extensionComponentPath: 'EXTENSION_COMPONENT_PATH',
        dxExportPath: 'DX/WIDGET/PATH',
        subscribableOptions: [
          { name: 'option1', type: 'someType' },
          { name: 'option1.subOption1', type: 'someType' },
          { name: 'option2.subOption1', type: 'someType' },
        ],
      }),
    ).toBe(EXPECTED);
  });
});

describe('nested options', () => {
  it('processes nested options', () => {
    // #region EXPECTED
    const EXPECTED = `
import dxCLASS_NAME, {
    Properties
} from "DX/WIDGET/PATH";

import { Component as BaseComponent, IHtmlOptions } from "BASE_COMPONENT_PATH";
import NestedOption from "CONFIG_COMPONENT_PATH";

type ICLASS_NAMEOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
}>

class CLASS_NAME extends BaseComponent<React.PropsWithChildren<ICLASS_NAMEOptions>> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;
}


// owners:
// CLASS_NAME
type IOpt_1_ComponentProps = React.PropsWithChildren<{
  sub_opt_2?: TYPE_1;
  sub_opt_3?: TYPE_SUB_3 | {
    sub_sub_opt_4?: TYPE_2;
    sub_sub_opt_5?: TYPE_SUB_OPT_5 | TYPE_SUB_OPT_6 | {
      sub_sub_sub_opt_6?: TYPE_3;
    };
  };
}>
class Opt_1_Component extends NestedOption<IOpt_1_ComponentProps> {
  public static OptionName = "opt_1";
}

// owners:
// Opt_1_Component
type IOpt_6_SubComponentProps = React.PropsWithChildren<{
  sub_sub_sub_opt_8?: TYPE_4;
}>
class Opt_6_SubComponent extends NestedOption<IOpt_6_SubComponentProps> {
  public static OptionName = "sub_sub_opt_7";
}

export default CLASS_NAME;
export {
  CLASS_NAME,
  ICLASS_NAMEOptions,
  Opt_1_Component,
  IOpt_1_ComponentProps,
  Opt_6_SubComponent,
  IOpt_6_SubComponentProps
};
`.trimLeft();
    // #endregion

    expect(
      generate({
        name: 'CLASS_NAME',
        baseComponentPath: 'BASE_COMPONENT_PATH',
        extensionComponentPath: 'EXTENSION_COMPONENT_PATH',
        configComponentPath: 'CONFIG_COMPONENT_PATH',
        dxExportPath: 'DX/WIDGET/PATH',
        nestedComponents: [
          {
            className: 'Opt_1_Component',
            owners: ['CLASS_NAME'],
            optionName: 'opt_1',
            options: [
              {
                name: 'sub_opt_2',
                type: 'TYPE_1',
              },
              {
                name: 'sub_opt_3',
                type: 'TYPE_SUB_3',
                nested: [
                  {
                    name: 'sub_sub_opt_4',
                    type: 'TYPE_2',
                  },
                  {
                    name: 'sub_sub_opt_5',
                    type: 'TYPE_SUB_OPT_5 | TYPE_SUB_OPT_6',
                    nested: [
                      {
                        name: 'sub_sub_sub_opt_6',
                        type: 'TYPE_3',
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            className: 'Opt_6_SubComponent',
            owners: ['Opt_1_Component'],
            optionName: 'sub_sub_opt_7',
            options: [
              {
                name: 'sub_sub_sub_opt_8',
                type: 'TYPE_4',
              },
            ],
          },
        ],
      }),
    ).toBe(EXPECTED);
  });

  it('processes nested array option', () => {
    // #region EXPECTED
    const EXPECTED = `
import dxCLASS_NAME, {
    Properties
} from "DX/WIDGET/PATH";

import { Component as BaseComponent, IHtmlOptions } from "BASE_COMPONENT_PATH";
import NestedOption from "CONFIG_COMPONENT_PATH";

type ICLASS_NAMEOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
}>

class CLASS_NAME extends BaseComponent<React.PropsWithChildren<ICLASS_NAMEOptions>> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;
}


// owners:
// CLASS_NAME
type IOpt_1_ComponentProps = React.PropsWithChildren<{
  sub_opt_2?: TYPE_1;
}>
class Opt_1_Component extends NestedOption<IOpt_1_ComponentProps> {
  public static OptionName = "opt_1";
  public static IsCollectionItem = true;
}

export default CLASS_NAME;
export {
  CLASS_NAME,
  ICLASS_NAMEOptions,
  Opt_1_Component,
  IOpt_1_ComponentProps
};
`.trimLeft();
    // #endregion

    expect(
      generate({
        name: 'CLASS_NAME',
        baseComponentPath: 'BASE_COMPONENT_PATH',
        extensionComponentPath: 'EXTENSION_COMPONENT_PATH',
        configComponentPath: 'CONFIG_COMPONENT_PATH',
        dxExportPath: 'DX/WIDGET/PATH',
        nestedComponents: [
          {
            className: 'Opt_1_Component',
            owners: ['CLASS_NAME'],
            optionName: 'opt_1',
            isCollectionItem: true,
            options: [
              {
                name: 'sub_opt_2',
                type: 'TYPE_1',
              },
            ],
          },
        ],
      }),
    ).toBe(EXPECTED);
  });

  it('generates default props for nested options', () => {
    // #region EXPECTED
    const EXPECTED = `
import dxCLASS_NAME, {
    Properties
} from "DX/WIDGET/PATH";

import { Component as BaseComponent, IHtmlOptions } from "BASE_COMPONENT_PATH";
import NestedOption from "CONFIG_COMPONENT_PATH";

type ICLASS_NAMEOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
}>

class CLASS_NAME extends BaseComponent<React.PropsWithChildren<ICLASS_NAMEOptions>> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;
}


// owners:
// CLASS_NAME
type IOpt_1_ComponentProps = React.PropsWithChildren<{
  sub_opt_2?: TYPE_1;
  sub_opt_3?: {
    sub_sub_opt_4?: TYPE_2;
  };
  defaultSub_opt_2?: TYPE_1;
  onSub_opt_2Change?: (value: TYPE_1) => void;
}>
class Opt_1_Component extends NestedOption<IOpt_1_ComponentProps> {
  public static OptionName = "opt_1";
  public static DefaultsProps = {
    defaultSub_opt_2: "sub_opt_2"
  };
}

export default CLASS_NAME;
export {
  CLASS_NAME,
  ICLASS_NAMEOptions,
  Opt_1_Component,
  IOpt_1_ComponentProps
};
`.trimLeft();
    // #endregion

    expect(
      generate({
        name: 'CLASS_NAME',
        baseComponentPath: 'BASE_COMPONENT_PATH',
        extensionComponentPath: 'EXTENSION_COMPONENT_PATH',
        configComponentPath: 'CONFIG_COMPONENT_PATH',
        dxExportPath: 'DX/WIDGET/PATH',
        nestedComponents: [
          {
            className: 'Opt_1_Component',
            owners: ['CLASS_NAME'],
            optionName: 'opt_1',
            options: [
              {
                name: 'sub_opt_2',
                type: 'TYPE_1',
                isSubscribable: true,
              },
              {
                name: 'sub_opt_3',
                nested: [
                  {
                    name: 'sub_sub_opt_4',
                    type: 'TYPE_2',
                    isSubscribable: true, // should not be rendered
                  },
                ],
              },
            ],
          },
        ],
      }),
    ).toBe(EXPECTED);
  });

  it('generates component/render props for nested options', () => {
    // #region EXPECTED
    const EXPECTED = `
import dxCLASS_NAME, {
    Properties
} from "DX/WIDGET/PATH";

import { Component as BaseComponent, IHtmlOptions } from "BASE_COMPONENT_PATH";
import NestedOption from "CONFIG_COMPONENT_PATH";

type ICLASS_NAMEOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
}>

class CLASS_NAME extends BaseComponent<React.PropsWithChildren<ICLASS_NAMEOptions>> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;
}


// owners:
// CLASS_NAME
type IOpt_1_ComponentProps = React.PropsWithChildren<{
  optionTemplate?: TYPE_1;
  optionRender?: (...params: any) => React.ReactNode;
  optionComponent?: React.ComponentType<any>;
  optionKeyFn?: (data: any) => string;
}>
class Opt_1_Component extends NestedOption<IOpt_1_ComponentProps> {
  public static OptionName = "opt_1";
  public static TemplateProps = [{
    tmplOption: "optionTemplate",
    render: "optionRender",
    component: "optionComponent",
    keyFn: "optionKeyFn"
  }];
}

export default CLASS_NAME;
export {
  CLASS_NAME,
  ICLASS_NAMEOptions,
  Opt_1_Component,
  IOpt_1_ComponentProps
};
`.trimLeft();
    // #endregion

    expect(
      generate({
        name: 'CLASS_NAME',
        baseComponentPath: 'BASE_COMPONENT_PATH',
        extensionComponentPath: 'EXTENSION_COMPONENT_PATH',
        configComponentPath: 'CONFIG_COMPONENT_PATH',
        dxExportPath: 'DX/WIDGET/PATH',
        nestedComponents: [
          {
            className: 'Opt_1_Component',
            owners: ['CLASS_NAME'],
            optionName: 'opt_1',
            templates: ['optionTemplate'],
            options: [
              {
                name: 'optionTemplate',
                type: 'TYPE_1',
              },
            ],
          },
        ],
      }),
    ).toBe(EXPECTED);
  });

  it('processes nested option predefined props', () => {
    // #region EXPECTED
    const EXPECTED = `
import dxCLASS_NAME, {
    Properties
} from "DX/WIDGET/PATH";

import { Component as BaseComponent, IHtmlOptions } from "BASE_COMPONENT_PATH";
import NestedOption from "CONFIG_COMPONENT_PATH";

type ICLASS_NAMEOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
}>

class CLASS_NAME extends BaseComponent<React.PropsWithChildren<ICLASS_NAMEOptions>> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;
}


// owners:
// CLASS_NAME
type IOpt_1_ComponentProps = React.PropsWithChildren<{
  sub_opt_2?: TYPE_1;
}>
class Opt_1_Component extends NestedOption<IOpt_1_ComponentProps> {
  public static OptionName = "opt_1";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    predefinedProp_1: "predefined-value"
  };
}

export default CLASS_NAME;
export {
  CLASS_NAME,
  ICLASS_NAMEOptions,
  Opt_1_Component,
  IOpt_1_ComponentProps
};
`.trimLeft();
    // #endregion

    expect(
      generate({
        name: 'CLASS_NAME',
        baseComponentPath: 'BASE_COMPONENT_PATH',
        extensionComponentPath: 'EXTENSION_COMPONENT_PATH',
        configComponentPath: 'CONFIG_COMPONENT_PATH',
        dxExportPath: 'DX/WIDGET/PATH',
        nestedComponents: [
          {
            className: 'Opt_1_Component',
            owners: ['CLASS_NAME'],
            optionName: 'opt_1',
            isCollectionItem: true,
            predefinedProps: {
              predefinedProp_1: 'predefined-value',
            },
            options: [
              {
                name: 'sub_opt_2',
                type: 'TYPE_1',
              },
            ],
          },
        ],
      }),
    ).toBe(EXPECTED);
  });
  it('renders [] if nested suboption has array type', () => {
    // #region EXPECTED
    const EXPECTED = `
import dxCLASS_NAME, {
    Properties
} from "DX/WIDGET/PATH";

import { Component as BaseComponent, IHtmlOptions } from "BASE_COMPONENT_PATH";
import NestedOption from "CONFIG_COMPONENT_PATH";

type ICLASS_NAMEOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
}>

class CLASS_NAME extends BaseComponent<React.PropsWithChildren<ICLASS_NAMEOptions>> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;
}


// owners:
// CLASS_NAME
type IOpt_1_ComponentProps = React.PropsWithChildren<{
  sub_opt_2?: TYPE_1;
  sub_opt_3?: {
    subsub_1?: TYPE_3;
    subsub_2?: TYPE_4;
  }[];
}>
class Opt_1_Component extends NestedOption<IOpt_1_ComponentProps> {
  public static OptionName = "opt_1";
  public static IsCollectionItem = true;
  public static PredefinedProps = {
    predefinedProp_1: "predefined-value"
  };
}

export default CLASS_NAME;
export {
  CLASS_NAME,
  ICLASS_NAMEOptions,
  Opt_1_Component,
  IOpt_1_ComponentProps
};
`.trimLeft();
    // #endregion

    expect(
      generate({
        name: 'CLASS_NAME',
        baseComponentPath: 'BASE_COMPONENT_PATH',
        extensionComponentPath: 'EXTENSION_COMPONENT_PATH',
        configComponentPath: 'CONFIG_COMPONENT_PATH',
        dxExportPath: 'DX/WIDGET/PATH',
        nestedComponents: [
          {
            className: 'Opt_1_Component',
            owners: ['CLASS_NAME'],
            optionName: 'opt_1',
            isCollectionItem: true,
            predefinedProps: {
              predefinedProp_1: 'predefined-value',
            },
            options: [
              {
                name: 'sub_opt_2',
                type: 'TYPE_1',
              },
              {
                name: 'sub_opt_3',
                nested: [{
                  name: 'subsub_1',
                  type: 'TYPE_3',
                },
                {
                  name: 'subsub_2',
                  type: 'TYPE_4',
                },
                ],
                isArray: true,
              },
            ],
          },
        ],
      }),
    ).toBe(EXPECTED);
  });
});

describe('prop typings', () => {
  it('adds check for single type', () => {
    // #region EXPECTED
    const EXPECTED = `
import dxCLASS_NAME, {
    Properties
} from "DX/WIDGET/PATH";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "BASE_COMPONENT_PATH";

type ICLASS_NAMEOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
}>

class CLASS_NAME extends BaseComponent<React.PropsWithChildren<ICLASS_NAMEOptions>> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;
}
(CLASS_NAME as any).propTypes = {
  PROP1: PropTypes.SOME_TYPE
};
export default CLASS_NAME;
export {
  CLASS_NAME,
  ICLASS_NAMEOptions
};
`.trimLeft();
    // #endregion

    expect(
      generate({
        name: 'CLASS_NAME',
        baseComponentPath: 'BASE_COMPONENT_PATH',
        extensionComponentPath: 'EXTENSION_COMPONENT_PATH',
        dxExportPath: 'DX/WIDGET/PATH',
        propTypings: [
          {
            propName: 'PROP1',
            types: ['SOME_TYPE'],
          },
        ],
      }),
    ).toBe(EXPECTED);
  });

  it('adds check for acceptable values with common type', () => {
    // #region EXPECTED
    const EXPECTED = `
import dxCLASS_NAME, {
    Properties
} from "DX/WIDGET/PATH";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "BASE_COMPONENT_PATH";

type ICLASS_NAMEOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
}>

class CLASS_NAME extends BaseComponent<React.PropsWithChildren<ICLASS_NAMEOptions>> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;
}
(CLASS_NAME as any).propTypes = {
  PROP1: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "VALUE_1",
      "VALUE_2"])
  ])
};
export default CLASS_NAME;
export {
  CLASS_NAME,
  ICLASS_NAMEOptions
};
`.trimLeft();
    // #endregion

    expect(
      generate({
        name: 'CLASS_NAME',
        baseComponentPath: 'BASE_COMPONENT_PATH',
        extensionComponentPath: 'EXTENSION_COMPONENT_PATH',
        dxExportPath: 'DX/WIDGET/PATH',
        propTypings: [
          {
            propName: 'PROP1',
            types: [],
            acceptableType: 'string',
            acceptableValues: ['"VALUE_1"', '"VALUE_2"'],
          },
        ],
      }),
    ).toBe(EXPECTED);
  });

  it('adds check for acceptable values', () => {
    // #region EXPECTED
    const EXPECTED = `
import dxCLASS_NAME, {
    Properties
} from "DX/WIDGET/PATH";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "BASE_COMPONENT_PATH";

type ICLASS_NAMEOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
}>

class CLASS_NAME extends BaseComponent<React.PropsWithChildren<ICLASS_NAMEOptions>> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;
}
(CLASS_NAME as any).propTypes = {
  PROP1: PropTypes.oneOf([
    "VALUE_1",
    "VALUE_2"])
};
export default CLASS_NAME;
export {
  CLASS_NAME,
  ICLASS_NAMEOptions
};
`.trimLeft();
    // #endregion

    expect(
      generate({
        name: 'CLASS_NAME',
        baseComponentPath: 'BASE_COMPONENT_PATH',
        extensionComponentPath: 'EXTENSION_COMPONENT_PATH',
        dxExportPath: 'DX/WIDGET/PATH',
        propTypings: [
          {
            propName: 'PROP1',
            types: [],
            acceptableValues: ['"VALUE_1"', '"VALUE_2"'],
          },
        ],
      }),
    ).toBe(EXPECTED);
  });

  it('adds check for several types', () => {
    // #region EXPECTED
    const EXPECTED = `
import dxCLASS_NAME, {
    Properties
} from "DX/WIDGET/PATH";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "BASE_COMPONENT_PATH";

type ICLASS_NAMEOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
}>

class CLASS_NAME extends BaseComponent<React.PropsWithChildren<ICLASS_NAMEOptions>> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;
}
(CLASS_NAME as any).propTypes = {
  PROP1: PropTypes.oneOfType([
    PropTypes.SOME_TYPE,
    PropTypes.ANOTHER_TYPE
  ])
};
export default CLASS_NAME;
export {
  CLASS_NAME,
  ICLASS_NAMEOptions
};
`.trimLeft();
    // #endregion

    expect(
      generate({
        name: 'CLASS_NAME',
        baseComponentPath: 'BASE_COMPONENT_PATH',
        extensionComponentPath: 'EXTENSION_COMPONENT_PATH',
        dxExportPath: 'DX/WIDGET/PATH',
        propTypings: [
          {
            propName: 'PROP1',
            types: ['SOME_TYPE', 'ANOTHER_TYPE'],
          },
        ],
      }),
    ).toBe(EXPECTED);
  });

  it('adds typings in alphabetic order', () => {
    // #region EXPECTED
    const EXPECTED = `
import dxCLASS_NAME, {
    Properties
} from "DX/WIDGET/PATH";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "BASE_COMPONENT_PATH";

type ICLASS_NAMEOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
}>

class CLASS_NAME extends BaseComponent<React.PropsWithChildren<ICLASS_NAMEOptions>> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;
}
(CLASS_NAME as any).propTypes = {
  A-PROP: PropTypes.oneOfType([
    PropTypes.TYPE_1,
    PropTypes.TYPE_2
  ]),
  a-PROP: PropTypes.TYPE_3,
  B-PROP: PropTypes.TYPE_4,
  c-PROP: PropTypes.TYPE_2
};
export default CLASS_NAME;
export {
  CLASS_NAME,
  ICLASS_NAMEOptions
};
`.trimLeft();
    // #endregion

    expect(
      generate({
        name: 'CLASS_NAME',
        baseComponentPath: 'BASE_COMPONENT_PATH',
        extensionComponentPath: 'EXTENSION_COMPONENT_PATH',
        dxExportPath: 'DX/WIDGET/PATH',
        propTypings: [
          {
            propName: 'A-PROP',
            types: ['TYPE_1', 'TYPE_2'],
          },
          {
            propName: 'c-PROP',
            types: ['TYPE_2'],
          },
          {
            propName: 'a-PROP',
            types: ['TYPE_3'],
          },
          {
            propName: 'B-PROP',
            types: ['TYPE_4'],
          },
        ],
      }),
    ).toBe(EXPECTED);
  });
});

describe('child expectation', () => {
  it('is rendered for widget', () => {
    // #region EXPECTED
    const EXPECTED = `
import dxCLASS_NAME, {
    Properties
} from "DX/WIDGET/PATH";

import { Component as BaseComponent, IHtmlOptions } from "BASE_COMPONENT_PATH";

type ICLASS_NAMEOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
}>

class CLASS_NAME extends BaseComponent<React.PropsWithChildren<ICLASS_NAMEOptions>> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;

  protected _expectedChildren = {
    expectedOption1: { optionName: "expectedName1", isCollectionItem: true },
    expectedOption2: { optionName: "expectedName2", isCollectionItem: false }
  };
}
export default CLASS_NAME;
export {
  CLASS_NAME,
  ICLASS_NAMEOptions
};
`.trimLeft();
    // #endregion

    expect(
      generate({
        name: 'CLASS_NAME',
        baseComponentPath: 'BASE_COMPONENT_PATH',
        extensionComponentPath: 'EXTENSION_COMPONENT_PATH',
        dxExportPath: 'DX/WIDGET/PATH',
        expectedChildren: [
          { componentName: 'expectedOption1', optionName: 'expectedName1', isCollectionItem: true },
          { componentName: 'expectedOption2', optionName: 'expectedName2' },
        ],
      }),
    ).toBe(EXPECTED);
  });

  it('is rendered for nested option', () => {
    // #region EXPECTED
    const EXPECTED = `
import dxCLASS_NAME, {
    Properties
} from "DX/WIDGET/PATH";

import { Component as BaseComponent, IHtmlOptions } from "BASE_COMPONENT_PATH";
import NestedOption from "CONFIG_COMPONENT_PATH";

type ICLASS_NAMEOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
}>

class CLASS_NAME extends BaseComponent<React.PropsWithChildren<ICLASS_NAMEOptions>> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;
}


// owners:
// CLASS_NAME
type IOpt_1_ComponentProps = React.PropsWithChildren<{
}>
class Opt_1_Component extends NestedOption<IOpt_1_ComponentProps> {
  public static OptionName = "opt_1";
  public static ExpectedChildren = {
    expectedOption1: { optionName: "expectedName1", isCollectionItem: true },
    expectedOption2: { optionName: "expectedName2", isCollectionItem: false }
  };
}

export default CLASS_NAME;
export {
  CLASS_NAME,
  ICLASS_NAMEOptions,
  Opt_1_Component,
  IOpt_1_ComponentProps
};
`.trimLeft();
    // #endregion

    expect(
      generate({
        name: 'CLASS_NAME',
        baseComponentPath: 'BASE_COMPONENT_PATH',
        extensionComponentPath: 'EXTENSION_COMPONENT_PATH',
        configComponentPath: 'CONFIG_COMPONENT_PATH',
        dxExportPath: 'DX/WIDGET/PATH',
        nestedComponents: [
          {
            className: 'Opt_1_Component',
            owners: ['CLASS_NAME'],
            optionName: 'opt_1',
            options: [],
            expectedChildren: [
              {
                componentName: 'expectedOption1',
                optionName: 'expectedName1',
                isCollectionItem: true,
              },
              {
                componentName: 'expectedOption2',
                optionName: 'expectedName2',
              },
            ],
          },
        ],
      }),
    ).toBe(EXPECTED);
  });
});

describe('Event types narrowing', () => {
  it('generated correctly', () => {
    // #region EXPECTED
    const EXPECTED = `
import dxCLASS_NAME, {
    Properties
} from "DX/WIDGET/PATH";

import { Component as BaseComponent, IHtmlOptions } from "BASE_COMPONENT_PATH";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type ICLASS_NAMEOptionsNarrowedEvents = {
  onSomethingHappened?: ((e: SomethingHappenedEvent) => void);
}

type ICLASS_NAMEOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, ICLASS_NAMEOptionsNarrowedEvents> & IHtmlOptions & {
}>

class CLASS_NAME extends BaseComponent<React.PropsWithChildren<ICLASS_NAMEOptions>> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;
}
export default CLASS_NAME;
export {
  CLASS_NAME,
  ICLASS_NAMEOptions
};
`.trimLeft();
      // #endregion

    expect(
      generate({
        name: 'CLASS_NAME',
        baseComponentPath: 'BASE_COMPONENT_PATH',
        extensionComponentPath: 'EXTENSION_COMPONENT_PATH',
        dxExportPath: 'DX/WIDGET/PATH',
        narrowedEvents: [{ name: 'onSomethingHappened', type: '((e: SomethingHappenedEvent) => void)' }],
      }),
    ).toBe(EXPECTED);
  });
  it('not generated if narrowedEvents is empty', () => {
    // #region EXPECTED
    const EXPECTED = `
import dxCLASS_NAME, {
    Properties
} from "DX/WIDGET/PATH";

import { Component as BaseComponent, IHtmlOptions } from "BASE_COMPONENT_PATH";

type ICLASS_NAMEOptions = React.PropsWithChildren<Properties & IHtmlOptions & {
}>

class CLASS_NAME extends BaseComponent<React.PropsWithChildren<ICLASS_NAMEOptions>> {

  public get instance(): dxCLASS_NAME {
    return this._instance;
  }

  protected _WidgetClass = dxCLASS_NAME;
}
export default CLASS_NAME;
export {
  CLASS_NAME,
  ICLASS_NAMEOptions
};
`.trimLeft();
      // #endregion

    expect(
      generate({
        name: 'CLASS_NAME',
        baseComponentPath: 'BASE_COMPONENT_PATH',
        extensionComponentPath: 'EXTENSION_COMPONENT_PATH',
        dxExportPath: 'DX/WIDGET/PATH',
        narrowedEvents: [],
      }),
    ).toBe(EXPECTED);
  });
});
