import 'dart:io';
import 'package:sass/sass.dart';
import 'package:path/path.dart' as path;
import 'dart:convert';

class MetaItem {
  String key, value;
  MetaItem(this.key, this.value);
}

class ThemeBuilderImporter extends Importer {
  String indexFileContent;
  String scssWidgetsDir = './widgets/';
  FilesystemImporter fsImporter = FilesystemImporter('.');
  dynamic metadata;
  List<MetaItem> userItems;

  ThemeBuilderImporter(this.indexFileContent, this.userItems) {
    var metaPath = path.absolute('../../dart-compiler/metadata/dx-theme-builder-metadata.json');
    var contents = File(metaPath).readAsStringSync();
    this.metadata = jsonDecode(contents);
  }

  bool isIndexImport(Uri url) => url.path.contains('tb_index');
  bool needModification(Uri url) => url.path.contains('tb_');
  String getTheme(Uri url) => url.path.contains('material') ? 'material' : 'generic';

  String getMatchingUserItemsAsString(String theme) {
    var parsedItems = metadata[theme] as List;
    var items = parsedItems.map((item) => MetaItem(item['Key'], item['Value']));
    var themeKeys = items.map((item) => item.key);

    return userItems
      .where((item) => themeKeys.contains(item.key))
      .map((item) => '${item.key}: ${item.value};')
      .toList()
      .join('');
  }

  Uri canonicalize(Uri url) {
    if(!needModification(url)) return fsImporter.canonicalize(url);

    var theme = getTheme(url);
    var absolutePath = path.absolute(
      this.scssWidgetsDir,
      theme,
      isIndexImport(url) ? '_tb_index.scss' : '_tb_$theme.scss');

    var resultUri = path.toUri(path.canonicalize(absolutePath));

    return resultUri;
  }

  ImporterResult load(Uri url) {
    if(!needModification(url)) return fsImporter.load(url);

    var result = isIndexImport(url)
      ? indexFileContent
      : getMatchingUserItemsAsString(getTheme(url));
    return ImporterResult(result, syntax: Syntax.scss, sourceMapUrl: url);
  }

  bool couldCanonicalize(Uri url, Uri canonicalUrl) {
    return needModification(url);
  }

  String toString() => "(unknown)";
}
