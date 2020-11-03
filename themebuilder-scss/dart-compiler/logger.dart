import 'dart:io' show Platform;

class Logger {
  static void log(String message) {
    bool needLog = Platform.environment['THEMEBUILDER_DEBUG'] != null;
    if(!needLog) return;
    print('${DateTime.now().toString()}: dart: ${message}');
  }
}
