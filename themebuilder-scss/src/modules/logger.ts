/* eslint no-console: 0 */
export function log(message: string, data: unknown = undefined): void {
  const debugEnvVariableName = 'THEMEBUILDER_DEBUG';
  const needLog = process.env[debugEnvVariableName] !== undefined;
  if (!needLog) return;

  let timedMessage = `${new Date().toISOString()}: ${message}`;

  if (data !== undefined) {
    timedMessage += `: ${JSON.stringify(data, null, 2).substr(0, 50)}`;
  }

  console.log(timedMessage);
}
