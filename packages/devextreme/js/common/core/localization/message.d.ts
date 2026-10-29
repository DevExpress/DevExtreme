type messageLocalizationType = {
    getFormatter(name: string): (...values: unknown[]) => string;
    format(name: string, ...values: unknown[]): string;
};
declare const messageLocalization: messageLocalizationType;
export default messageLocalization;
