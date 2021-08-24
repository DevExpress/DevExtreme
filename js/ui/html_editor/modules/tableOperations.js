export const showTableProperties = (editorInstance) => {
    // todo
};


export const showCellProperties = () => {
    // todo
};

export const getTableOperationHandler = (quill, operationName, ...rest) => {
    return () => {
        const table = quill.getModule('table');

        if(!table) {
            return;
        }
        quill.focus();
        return table[operationName](...rest);
    };
};

