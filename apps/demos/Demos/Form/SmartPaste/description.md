The DevExtreme Form ships with AI-powered **Smart Paste** functionality. When a user copies unstructured text from external sources such as documents, spreadsheets, web pages, or emails, **Smart Paste** processes the clipboard data and populates related form fields.
<!--split-->

Use the following APIs to enable **Smart Paste** in the Form component:

- [aiIntegration](/Documentation/ApiReference/UI_Components/dxForm/Configuration/#aiIntegration) - accepts an [AIIntegration](/Documentation/ApiReference/Common_Types/AIIntegration/) object that contains AI Service settings.
- *'smartPaste'* – adds a built-in **Smart Paste** button to the Form (see [name](/Documentation/ApiReference/UI_Components/dxForm/Types/#FormPredefinedButtonItem) for more details). To initiate this functionality from code, call the [smartPaste(text)](/Documentation/ApiReference/UI_Components/dxForm/Methods/#smartPastetext) method. This demo shows how to use this methos to implement a custom shortcut that activates **Smart Paste**.

Configure each Form item using [aiOptions](/Documentation/ApiReference/UI_Components/dxForm/Item_Types/SimpleItem/aiOptions/):
- **disabled** - prevents AI-generated text from being pasted into this item.
- **instruction** - specifies the item instruction for the AI service.