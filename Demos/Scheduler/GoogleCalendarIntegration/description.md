To display appointments from Google Calendar in the Scheduler, follow the steps below:

1. **Get Google API key**   
    Follow the instructions from step 1 in the <a href="https://developers.google.com/calendar/quickstart/js" target="_blank">Browser Quickstart</a> tutorial.

1. **Restrict the API key**     
    Set <a href="https://developers.google.com/maps/api-key-best-practices#application_restriction" target="_blank">application</a> and <a href="https://developers.google.com/maps/api-key-best-practices#api_restriction" target="_blank">API restrictions</a>.

1. **Make your calendar public**    
    Refer to the following help topic: <a href="https://support.google.com/calendar/answer/37083?hl=en" target="_blank">Create & manage a public Google calendar</a>.

1. **Get the calendar ID**    
    Open Google Calendar settings, choose the calendar to be integrated, and copy its ID from the **Integrate calendar** section.

1. **Set up the Scheduler**    
    Configure the [CustomStore](/Documentation/ApiReference/Data_Layer/CustomStore/) to load data from Google Calendar as shown in this demo. If a [timeZone](/Documentation/ApiReference/UI_Components/dxScheduler/Configuration/#timeZone) is specified in the Scheduler, ensure it is the same as in Google Calendar. 