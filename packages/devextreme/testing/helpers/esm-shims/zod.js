/**
 * Minimal zod stub for QUnit ESM / import-map loader.
 */
const z = {
    object() { return z; },
    string() { return z; },
    boolean() { return z; },
    number() { return z; },
    date() { return z; },
    null() { return z; },
    enum() { return z; },
    union() { return z; },
    array() { return z; },
    tuple() { return z; },
    literal() { return z; },
    record() { return z; },
    lazy() { return z; },
    optional() { return z; },
    nullable() { return z; },
    // eslint-disable-next-line spellcheck/spell-checker
    nullish() { return z; },
    strict() { return z; },
    int() { return z; },
    // eslint-disable-next-line spellcheck/spell-checker
    nonnegative() { return z; },
    positive() { return z; },
    min() { return z; },
    max() { return z; },
    transform() { return z; },
    describe() { return z; },
    safeParse() { return { success: true, data: {} }; },
};

export { z };
export default z;
