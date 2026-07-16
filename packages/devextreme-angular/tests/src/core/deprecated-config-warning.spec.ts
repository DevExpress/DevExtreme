import { NestedOptionHost } from 'devextreme-angular';

// The warning is reached through NestedOptionHost.setNestedOption(), so these
// tests drive the real integration point rather than the internal helper.
//
// esbuild renames a class that self-references in its decorator metadata to
// `_ClassName`, so at runtime `constructor.name` is `_DxiItemComponent` /
// `_DxAccordionComponent`. We fake that here to lock in the underscore-tolerant
// lookup in getLegacySelector (regex) and getHostMapping (map key normalization).

function fakeHost(ctorName: string): any {
  return { constructor: { name: ctorName } };
}

function fakeNestedOption(ctorName: string): any {
  return {
    constructor: { name: ctorName },
    // setNestedOption calls this before warning; a no-op is enough.
    setHost() {},
  };
}

describe('deprecated nested config warning', () => {
  let warnSpy: jasmine.Spy;

  beforeEach(() => {
    warnSpy = spyOn(console, 'warn');
  });

  it('resolves the legacy mapping and warns exactly once when esbuild prefixes class names with "_"', () => {
    const host = new NestedOptionHost();
    host.setHost(fakeHost('_DxAccordionComponent'));

    // Register the same legacy usage twice: the cache must collapse it to one warning.
    host.setNestedOption(fakeNestedOption('_DxiItemComponent'));
    host.setNestedOption(fakeNestedOption('_DxiItemComponent'));

    expect(warnSpy).toHaveBeenCalledTimes(1);

    const message = warnSpy.calls.mostRecent().args[0] as string;
    expect(message).toContain('W3001');
    expect(message).toContain('legacy dxi-item');
    expect(message).toContain('dxi-accordion-item');
  });

  it('does not warn when the new named configuration component is used', () => {
    const host = new NestedOptionHost();
    host.setHost(fakeHost('_DxAccordionComponent'));

    host.setNestedOption(fakeNestedOption('_DxiAccordionItemComponent'));

    expect(warnSpy).not.toHaveBeenCalled();
  });
});
