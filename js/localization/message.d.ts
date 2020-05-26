type messageLocalizationType = { getFormatter:(name: string) => () => string };
declare const messageLocalization: messageLocalizationType;
export default messageLocalization;
