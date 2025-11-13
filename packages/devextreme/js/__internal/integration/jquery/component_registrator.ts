import { componentRegistratorCallbacks } from '@ts/core/m_component_registrator_callbacks';
import errors from '@ts/core/m_errors';
// eslint-disable-next-line import/no-extraneous-dependencies
import jQuery from 'jquery';

if (jQuery) {
  // eslint-disable-next-line func-names
  const registerJQueryComponent = function (name, componentClass): void {
    // @ts-expect-error
    // eslint-disable-next-line func-names
    jQuery.fn[name] = function (options): unknown {
      const isMemberInvoke = typeof options === 'string';
      // eslint-disable-next-line @typescript-eslint/init-declarations
      let result: unknown | undefined;

      if (isMemberInvoke) {
        const memberName = options;
        // eslint-disable-next-line prefer-rest-params
        const memberArgs = [].slice.call(arguments).slice(1);

        this.each(function () {
          const instance = componentClass.getInstance(this);

          if (!instance) {
            throw errors.Error('E0009', name);
          }

          const member = instance[memberName];
          const memberValue = member.apply(instance, memberArgs);

          if (result === undefined) {
            result = memberValue;
          }
        });
      } else {
        this.each(function () {
          const instance = componentClass.getInstance(this);
          if (instance) {
            instance.option(options);
          } else {
            // eslint-disable-next-line no-new,new-cap
            new componentClass(this, options);
          }
        });

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        result = this;
      }

      return result;
    };
  };

  componentRegistratorCallbacks.add(registerJQueryComponent);
}
