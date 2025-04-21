[note]

The Globalize package is outdated and potentially [unsafe](https://supportcenter.devexpress.com/ticket/details/t1260546/devextreme-improper-code-sanitization-vulnerabilities-in-third-party-globalize-message).

Use Globalize at your own risk. We recommend switching to [Intl](https://js.devexpress.com/Demos/WidgetsGallery/Demo/Localization/UsingIntl/) for a more secure solution.

[/note]
<!--split-->

To localize components with Globalize, link modules, CLDR scripts, and DevExtreme dictionaries for the target locales. Load the CLDR data for these locales. If following a modular approach, import the necessary components. Set the current locale with the **Globalize.locale** method.