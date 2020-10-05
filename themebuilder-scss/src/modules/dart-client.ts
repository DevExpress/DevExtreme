import net from 'net';

export default class DartClient {
  serverPort = 22000;

  isServerAvailable = false;

  private readonly client = new net.Socket();

  private readonly errorHandlers: (() => void)[] = [];

  private setErrorHandlers(handler: () => void): void {
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

  send(message: any): Promise<any> {
    this.client.setTimeout(0);
    return new Promise((resolve) => {
      let data = '';

      this.client.on('data', (d) => {
        data += d.toString();
      });

      this.client.on('end', () => {
        let parsedData;
        try {
          parsedData = JSON.parse(data);
        } catch (e) {
          parsedData = { error: true };
        }
        resolve(parsedData);
      });

      this.client.write(JSON.stringify(message));
      this.client.end();
    });
  }
}
