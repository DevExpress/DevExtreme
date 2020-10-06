import net from 'net';
import DartClient from '../../src/modules/dart-client';

const createServer = (echo = true): net.Server => net.createServer((socket) => {
  if (echo) {
    socket.pipe(socket);
  } else {
    socket.on('data', () => {
      socket.write('test');
    });
  }
});

let server: net.Server;

const startServer = (echo = true): Promise<void> => new Promise((resolve) => {
  server = createServer(echo);
  server.listen(new DartClient().serverPort, '127.0.0.1', () => resolve());
});

const stopServer = (): Promise<void> => new Promise((resolve) => {
  server.close(() => resolve());
});

describe('DartClient tests', () => {
  test('"check" method (server started)', async () => {
    await startServer();
    const client = new DartClient();
    await client.check();
    const available = client.isServerAvailable;
    await client.dispose();
    await stopServer();
    expect(available).toBe(true);
  });

  test('"check" method (server stopped)', async () => {
    const client = new DartClient();
    await client.check();
    const available = client.isServerAvailable;
    await client.dispose();
    expect(available).toBe(false);
  });

  test('"send" method', async () => {
    const longData = [...Array(1000000).keys()].join('');
    const testData = { a: ['a', 'b'], b: 2, c: longData };
    await startServer();
    const client = new DartClient();
    await client.check();
    const available = client.isServerAvailable;
    expect(available).toBe(true);
    const reply = await client.send(testData);
    await client.dispose();
    await stopServer();
    expect(reply).toEqual(testData);
  });

  test('"send" method - wrong reply', async () => {
    const longData = [...Array(100000).keys()].join('');
    const testData = { a: ['a', 'b'], b: 2, c: longData };
    await startServer(false);
    const client = new DartClient();
    await client.check();
    const available = client.isServerAvailable;
    expect(available).toBe(true);
    const reply = await client.send(testData);
    await client.dispose();
    await stopServer();
    expect(reply).toEqual({ error: true });
  });
});
