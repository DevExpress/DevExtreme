import 'package:sass/sass.dart';

class Collector {
  Callable collector;

  Collector() {
    this.collector = new Callable.function("collector", r'$map', (arguments) {
      var map = arguments.first as SassMap;
      
      return sassNull;
    });
  }
}
