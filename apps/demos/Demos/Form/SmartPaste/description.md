The DevExtreme Form ships with AI-powered **Smart Paste** functionality. When a user copies unstructured text from external sources such as documents, spreadsheets, web pages, or emails, **Smart Paste** processes clipboard data and populates related form fields automatically.
<!--split-->

Use the following APIs to activate **Smart Paste** in our Form component:

- [aiIntegration](/Documentation/ApiReference/UI_Components/dxForm/Configuration/#aiIntegration) - accepts an [AIIntegration](/Documentation/ApiReference/Common_Types/AIIntegration/) object that contains AI Service settings.
- *'smartPaste'* – adds a built-in **Smart Paste** button to the Form (see [name](/Documentation/ApiReference/UI_Components/dxForm/Types/#FormPredefinedButtonItem) for additional information). To use this capability in code, call the [smartPaste(text)](/Documentation/ApiReference/UI_Components/dxForm/Methods/#smartPastetext) method. This sample leverages this method and implements a custom shortcut to activate **Smart Paste**.

Configure each Form item using [aiOptions](/Documentation/ApiReference/UI_Components/dxForm/Item_Types/SimpleItem/aiOptions/):
- **disabled** - prevents AI-generated text from being pasted into this item.
- **instruction** - specifies item instruction for the AI service.