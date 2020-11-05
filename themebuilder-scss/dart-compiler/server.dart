import 'dart:io';
import 'dart:convert';

import './compiler.dart';
import './importer.dart';
import './compiler-result.dart';
import './logger.dart';

class Server {
  ServerSocket server;

  void start() async {
    this.server = await ServerSocket.bind(InternetAddress.loopbackIPv4, 22000);
    this.server.listen((client) async {
      await handleConnection(client);
    });
  }

  void handleConnection(Socket client) async {
    Logger.log('connection from ${client.remoteAddress.address}:${client.remotePort}');

    var request = await utf8.decoder.bind(client).join('');
    var options = json.decode(request);

    var indexFileContent = options['index'].toString();

    var items = (options['items'] as List<dynamic>)
        .map((item) => MetaItem(item['key'], item['value']))
        .toList();

    String file = options['file'] ?? '';
    String data = options['data'] ?? '';

    if (file.isNotEmpty) {
      var bundles = 'bundles';
      var fileParts = file.split(bundles);

      if (fileParts.length == 2) {
        var cwd = fileParts[0];
        file = bundles + fileParts[1];
        Directory.current = cwd;
      }
    }

    CompilerResult result;
    Logger.log('compile with items: ${items.toString()}, file: ${file}');
    try {
      result = Compiler().compile(items, indexFileContent, SassOptions(file, data));
      Logger.log('compiled successfully');
    } catch(e) {
      result = CompilerResult(null, null, e.toString());
      Logger.log('compiled with error ${e.toString()}');
    }

    try {
      Logger.log('writing result');
      client.write(json.encode(result)); 
    } finally {
      Logger.log('connection ${client.remoteAddress.address}:${client.remotePort} closed');
      client.close();
    }
  }
}
