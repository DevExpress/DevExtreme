type ReadyCallbacksType = {
    add: (callback: () => {}) => void;
    fire: () => void;
    inject: (injection: object) => void;
};

declare const readyCallbacks: ReadyCallbacksType;

export default readyCallbacks;
