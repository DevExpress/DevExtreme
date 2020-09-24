import 'dart:io';
import './compiler.dart';
import './importer.dart';

class Server {
  ServerSocket server;

  void start() {
    ServerSocket.bind(InternetAddress.loopbackIPv4, 22000)
        .then((ServerSocket socket) {
      this.server = socket;
      this.server.listen((client) {
        handleConnection(client);
      });
    });
  }

  void handleConnection(Socket client) {
    print('Connection from '
        '${client.remoteAddress.address}:${client.remotePort}');

    client.write("Welcome to server!");
  }

  void start1() {
    print('Hi! I\'m server!');

    var time = DateTime.now().microsecondsSinceEpoch;

    var indexFileContent = '''
\$color: null !default;
\$size: null !default;

@use "./_colors.scss" with (\$color: \$color);
@use "./_sizes.scss" with (\$size: \$size);
@use "./typography";
@use "./icons";
@use "./widget";
@use "./card";
@use "./fieldset";
@use "./common";

// public widgets
@use "./box";
''';

    var userItems = List<MetaItem>();
    userItems.add(MetaItem('\$base-bg', '#abcdef'));
    userItems.add(MetaItem('\$base-accent', '#abcdef'));

    var result = Compiler().compile(userItems, indexFileContent,
        SassOptions('bundles/dx.light.scss', null));
    //var result = Compiler().compile(userItems, indexFileContent, SassOptions(null, '\$r:20px;div{height: \$r;}'));

    print('end - ${(DateTime.now().microsecondsSinceEpoch - time) / 1000}ms');
    print(result.changedVariables);
    File('./out.css').writeAsStringSync(result.css);
  }
}
