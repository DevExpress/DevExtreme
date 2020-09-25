import 'dart:io';
import 'dart:convert';
import './compiler.dart';
import './importer.dart';
import './compiler-result.dart';

class Server {
  ServerSocket server;

  void start() async {
    this.server = await ServerSocket.bind(InternetAddress.loopbackIPv4, 22000);
    this.server.listen((client) async {
      await handleConnection(client);
    });
  }

  void handleConnection(Socket client) async {
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
    try {
      result = Compiler().compile(items, indexFileContent, SassOptions(file, data));
    } catch(e) {
      result = CompilerResult(null, null, true);
    }

    try {
      client.write(json.encode(result)); 
    } finally {
      client.close();
    }
  }
}
