## {{testName}}<br/>

{{#results}}
Id: {{id}}<br/> 
Impact: **{{impact}}**<br/>
Tags: **{{tags}}**<br/>
{{description}}<br/>
<{{helpUrl}}><br/>

{{#nodes}}
Target: `{{{target}}}`<br/>
Element: `{{{html}}}`<br/>

<pre>{{failureSummary}}</pre>
---
{{/nodes}}
{{/results}}
