import config from '../../core/config';

export const injectRenovation = (originCtor, RenovatedClass, ctorArgs) => {
    const { useRenovatedComponents } = config();
    return useRenovatedComponents ? new RenovatedClass(...ctorArgs) : originCtor(ctorArgs);
};
