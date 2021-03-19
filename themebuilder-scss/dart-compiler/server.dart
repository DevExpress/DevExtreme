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

    CompilerResult result;

    try {
      var request = await utf8.decoder.bind(client).join('');
      var options = json.decode(request);
      var keepAlive = options['keepAlive'] ?? false;
      result = keepAlive ?
        CompilerResult(null, null, 'keepAlive') :
        CompileWithOptions(options);
    } catch(e) {
      Logger.log('the following error occured ${e.toString()}');
      result = GetErroredCompilerResult(e);
    }

    try {
      Logger.log('writing result');
      client.write(json.encode(result)); 
    } finally {
      Logger.log('connection ${client.remoteAddress.address}:${client.remotePort} closed');
      client.close();
    }
  }

  CompilerResult GetErroredCompilerResult(dynamic e) {
    return CompilerResult(null, null, e.toString());
  }

  CompilerResult CompileWithOptions(options) {
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

    Logger.log('compile with items: ${items.toString()}, file: ${file}');
    var result = Compiler().compile(items, indexFileContent, SassOptions(file, data));
    Logger.log('compiled successfully');

    return result;
  }
}
