import 'package:sass/sass.dart';

class Collector {
  Callable collector;
  Map<String, String> _changedVariables = {};

  Collector() {
    this.collector = Callable.function('collector', r'$map', (arguments) {
      var map = arguments.first as SassMap;
      this.collect(map);
      return sassNull;
    });
  }

  collect(SassMap map) {
    map.contents.entries.forEach((item) {
      var key = (item.key as SassString).text;
      var value = item.value.toString();

      if(value == 'null') return;

      this._changedVariables[key] = value;
    });
  }

  get changedVariables => this._changedVariables;
}
