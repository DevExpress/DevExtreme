import net from 'net';
import Logger from './logger';
import {
  SocketEventListener, DartCompilerConfig,
  DartCompilerResult, DartCompilerKeepAliveConfig,
} from '../types/types';

export default class DartClient {
  serverPort = 22000;

  isServerAvailable = false;

  private readonly client = new net.Socket();

  private readonly eventListeners: SocketEventListener[] = [];

  private addClientEventListener(name: string, handler: (e?: Error) => void): void {
    this.eventListeners.push({ name, handler });
    this.client.on(name, handler);
  }

  private setClientErrorHandlers(handler: (e?: Error) => void): void {
    this.addClientEventListener('timeout', handler);
    this.addClientEventListener('error', handler);
  }

  private removeClientEventListeners(): void {
    this.eventListeners.forEach((listener) => {
      this.client.off(listener.name, listener.handler);
    });

    this.eventListeners.length = 0;
  }

  dispose(): Promise<void> {
    if (this.client.destroyed) return Promise.resolve();
    this.isServerAvailable = false;

    return new Promise((resolve) => {
      this.client.once('close', resolve);
      this.removeClientEventListeners();
      this.client.destroy();
    });
  }

  check(): Promise<void> {
    this.client.setTimeout(100);

    return new Promise((resolve) => {
      this.setClientErrorHandlers(async () => {
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

  send(message: DartCompilerConfig | DartCompilerKeepAliveConfig): Promise<DartCompilerResult> {
    this.client.setTimeout(0);
    this.removeClientEventListeners();

    return new Promise((resolve) => {
      let data = '';

      this.addClientEventListener('data', (d) => {
        data += d.toString();
      });

      this.addClientEventListener('end', () => {
        Logger.log('DartClient received', data);
        let parsedData;
        try {
          parsedData = JSON.parse(data);
        } catch (e) {
          parsedData = { error: `Unable to parse dart server response: ${data}` };
        }
        resolve(parsedData);
      });

      const errorHandler = (e?: Error): void => {
        Logger.log('Dart client error on write', e);
        this.client.end();
        this.dispose();
        resolve({
          error: `${e.name}: ${e.message}`,
        });
      };

      if (this.client.destroyed) {
        errorHandler({ name: 'Error', message: 'Client destroyed' });
      }

      this.setClientErrorHandlers(errorHandler);

      Logger.log('DartClient send', message);
      this.client.write(JSON.stringify(message));
      this.client.end();
    });
  }
}
