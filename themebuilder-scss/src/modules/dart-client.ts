import net from 'net';
import Logger from './logger';

export default class DartClient {
  serverPort = 22000;

  isServerAvailable = false;

  private readonly client = new net.Socket();

  private readonly errorHandlers: (() => void)[] = [];

  private setErrorHandlers(handler: (e?: Error) => void): void {
    this.errorHandlers.push(handler);
    this.client
      .on('timeout', handler)
      .on('error', handler);
  }

  private removeErrorHandlers(): void {
    this.errorHandlers.forEach((handler) => {
      this.client
        .off('timeout', handler)
        .off('error', handler);
    });

    this.errorHandlers.length = 0;
  }

  dispose(): Promise<void> {
    if (this.client.destroyed) return Promise.resolve();
    this.isServerAvailable = false;

    return new Promise((resolve) => {
      this.client.on('close', resolve);
      this.removeErrorHandlers();
      this.client.destroy();
    });
  }

  check(): Promise<void> {
    this.client.setTimeout(100);

    return new Promise((resolve) => {
      this.setErrorHandlers(async () => {
        this.isServerAvailable = false;
        await this.dispose();
        resolve();
      });

      this.client.connect(this.serverPort, '127.0.0.1', () => {
        this.isServerAvailable = true;
        resolve();
      });
    });
  }

  send(message: DartCompilerConfig): Promise<DartCompilerResult> {
    this.client.setTimeout(0);
    return new Promise((resolve) => {
      let data = '';

      this.client.on('data', (d) => {
        data += d.toString();
      });

      this.client.on('end', () => {
        Logger.log('DartClient received', data);
        let parsedData;
        try {
          parsedData = JSON.parse(data);
        } catch (e) {
          parsedData = { error: `Unable to parse dart server response: ${data}` };
        }
        resolve(parsedData);
      });

      this.removeErrorHandlers();
      this.setErrorHandlers((e) => {
        Logger.log('Dart client error on write', e);
        this.client.end();
        this.dispose();
        resolve({
          error: `${e.name}: ${e.message}`,
        });
      });

      Logger.log('DartClient send', message);
      this.client.write(JSON.stringify(message));
      this.client.end();
    });
  }
}
