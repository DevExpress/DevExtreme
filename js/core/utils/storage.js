import windowUtils from '../../core/utils/window';
const window = windowUtils.getWindow();

const getSessionStorage = function() {
    let sessionStorage;

    try {
        sessionStorage = window.sessionStorage;
    } catch(e) { }

    return sessionStorage;
};

export { getSessionStorage as sessionStorage };
