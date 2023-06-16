// eslint-disable-next-line spellcheck/spell-checker
export function debounce(func, timeout) {
    let lastTimestampId = null;

    return (...args) => {
        clearTimeout(lastTimestampId);

        lastTimestampId = setTimeout(() => func(...args), timeout);
    };
}
