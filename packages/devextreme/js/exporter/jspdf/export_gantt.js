function exportGantt(options) {
    const component = options.component;
    return component?.exportToPdf(options);
}

export { exportGantt };
