import fs from 'fs';
import path from 'path';

const demoProjectsDir = path.join(__dirname, '../../../publish-demos/Demos/');

// In the demo, we need to wait, while themes are loaded
// Angular build add scripts to the end of index.html, here we are wrapping them in onload callback
function wrapBundleScripts(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file ${filePath}:`, err);
      return;
    }

    const polyfillRegex = /<script\s+src="([^"]*polyfill[^"]*)"\s+type="module"><\/script>/g;
    const runtimeRegex = /<script\s+src="([^"]*runtime[^"]*)"\s+type="module"><\/script>/g;
    const mainRegex = /<script\s+src="([^"]*main[^"]*)"\s+type="module"><\/script>/g;

    const scripts = [];

    [polyfillRegex, runtimeRegex, mainRegex].forEach(regex => {
      const match = regex.exec(data);
      if (match) {
        scripts.push(match[1]);
      }
    }); 
    
    if (scripts.length === 0) {
        console.log("There are no bundle scripts to edit");
        return;
    }

    const cleanedHtml = data.replace(polyfillRegex, '').replace(runtimeRegex, '').replace(mainRegex, '');

    const wrappedBundleScripts = `
      <script>
        window.onload = function() {
          var scripts = ${JSON.stringify(scripts)};

          scripts.forEach(function(src) {
            var script = document.createElement('script');
            script.src = src;
            script.type = 'module';
            document.body.appendChild(script);
          });
        };
      </script>
    </body>`;

    const newHtml = cleanedHtml.replace('</body>', wrappedBundleScripts);

    fs.writeFile(filePath, newHtml, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing file ${filePath}:`, err);
        return;
      }
      console.log(`Modified ${filePath} successfully.`);
    });
  });
}

function processDemoProjects(demosDirectory) {
  fs.readdir(demosDirectory, (err, widgets) => {
    if (err) {
      console.error(`Error reading directory ${demosDirectory}:`, err);
      return;
    }

    widgets.forEach((widget) => {
        const widgetPath = path.join(demosDirectory, widget);
        fs.readdir(widgetPath, (err, demoName) => {
            if (err) {
                console.error(`Error reading directory ${widgetPath}:`, err);
                return;
            }
            demoName.forEach((demo) => {
                const filePath = path.join(widgetPath, demo, 'Angular', 'index.html');
                if (fs.existsSync(filePath)) {
                  wrapBundleScripts(filePath);
                } else {
                  console.warn(`File not found: ${filePath}`);
                }
              });
        })
    });

    
  });
}

processDemoProjects(demoProjectsDir)