import 'dart:io';
import 'package:path/path.dart' as path;

import './server.dart';

void main(List<String> arguments) {
  Directory.current = path.absolute('../src/data/scss/');
  Server().start();
}
