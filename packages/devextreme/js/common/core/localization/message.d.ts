type messageLocalizationType = {
    getFormatter(name: string): () => string;
    format(name: string): string;
};
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
declare const messageLocalization: messageLocalizationType;
export default messageLocalization;
