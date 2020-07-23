import 'dart:io';
import 'package:sass/sass.dart' as sass;

void main(List<String> arguments) {
  var time = DateTime.now().microsecondsSinceEpoch;
  var result = sass.compile('../../../scss/bundles/dx.light.scss', charset: false);
  print('end - ${(DateTime.now().microsecondsSinceEpoch - time) / 1000}ms');
  new File('./out.css').writeAsStringSync(result);
}
