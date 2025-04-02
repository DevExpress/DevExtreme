import { equalByValue } from '@js/core/utils/common';
import { getTemplate } from '@ts/core/r1/utils';
import type { ComponentType } from 'inferno';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BasePropsType = Record<PropertyKey, any>;

export interface TemplateRenderOptions<TTemplateProps extends BasePropsType> {
  propsComparer?: (prevProps: TTemplateProps, nextProps: TTemplateProps) => boolean;
}

export interface PublicTemplateProps<TTemplateProps extends BasePropsType> {
  template: ComponentType<TTemplateProps> | undefined;
  templateProps: TTemplateProps;
  renderOptions?: TemplateRenderOptions<TTemplateProps>;
}

// eslint-disable-next-line @stylistic/comma-dangle
export const PublicTemplate = <TTemplateProps extends BasePropsType,>({
  template,
  templateProps,
  renderOptions,
}: PublicTemplateProps<TTemplateProps>): JSX.Element => {
  if (template === undefined) {
    return <></>;
  }

  const templateFn = getTemplate<TTemplateProps>(template);
  const templatePropsWithComparer = {
    ...templateProps,
    data: {
      ...templateProps.data ?? {},
      // NOTE Fix for the T1251590
      // template_wrapper extract isEqual from props.data.isEqual
      // and use it on the shouldComponentUpdateHook
      isEqual: renderOptions?.propsComparer ?? equalByValue,
    },
  };

  return (
    templateFn?.(templatePropsWithComparer)
  );
};
