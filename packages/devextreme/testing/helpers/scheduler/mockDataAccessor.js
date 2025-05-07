export const mockDataAccessor = {
    get(prop, obj) {
        return obj[prop];
    },
    set(prop, obj, value) {
        obj[prop] = value;
    }
};
