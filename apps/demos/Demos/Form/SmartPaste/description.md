DevExtreme Form includes AI-powered **Smart Paste** functionality. When a user copies unstructured text from sources such as spreadsheets, documents, emails, or web pages, **Smart Paste** processes the clipboard data and populates related form fields.
<!--split-->

Use the following members to activate **Smart Paste** for the Form component:

- [aiIntegration](/Documentation/ApiReference/UI_Components/dxForm/Configuration/#aiIntegration) - accepts an [AIIntegration](/Documentation/ApiReference/Common_Types/AIIntegration/) object that holds AI Service settings.
- *'smartPaste'* - specifies a button [name](/Documentation/ApiReference/UI_Components/dxForm/Types/#FormPredefinedButtonItem). To trigger this functionality programmatically, call the [smartPaste(text)](/Documentation/ApiReference/UI_Components/dxForm/Methods/#smartPastetext) method.

Configure each Form item using [aiOptions](/Documentation/ApiReference/UI_Components/dxForm/Item_Types/SimpleItem/aiOptions/):
- **disabled** - blocks AI-generated text from being pasted into this item.
- **instruction** - specifies an individual item instruction for the AI service.

See the demo code for implementation details.