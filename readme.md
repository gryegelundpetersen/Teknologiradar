# Vejle Municipality Technology Radar
A HTML/CSS/JS tool with jQuery for communicating the maturity of emerging technologies within the municipality's six administrations.

## Technologies.json
Listed in this file, update the list using the included `GenerateJSON.xslm` Excel spreadsheet. Manually adjust the coordinates for the technologies.

### Generating technologies.json using GenerateJSON.xslm
1. Prepare the data: Align technology rows in the sheets for each administration.
2. Trust macros when opening GenerateJSON.xlsm.
3. Paste the data into the "Generer JSON" sheet as per the table below.
4. Click "Konverter til JSON" to generate "technologies.json".
5. Open and review the file with a code editor.

Use "Beutify JSON" extension for Visual Studio Code for better formatting.

| Data Type                                     | Column |
|-----------------------------------------------|--------|
| Technology Names                              | B      |
| Ø&A Values                                    | E      |
| T&M Values                                    | F      |
| B&U Values                                    | G      |
| Velfærd Values                                | H      |
| K&S Values                                    | I      |
| Komstab Values                                | J      |
| Descriptions                                  | K      |
| Links to read more                            | L      |

### Fine-tuning the generated technologies.json
Manually edit the file to position technologies on the radar. Follow the recommended procedure below.

1. Set up the development environment (see [Development Environment](##-development-environment)).
2. Download and extract the project.
3. Open the project folder in Visual Studio Code.
4. Replace existing technologies.json and open it.
5. Start the live server (browser should open, if not, go to [localhost:5500](localhost:5500)).
6. Adjust the X and Y values of each technology, save and reload the page to see changes.

### Technology names running off edges
#### For "klar" (ready) field issues on zooming in
Adjust `DangerZoneInvert` in `settings.js`. Technologies with an X value higher than this value (or lower than `-DangerZoneInvert`) will put their text on the opposite side of the dot when the user zooms in.

#### For outer edge edge issues
Add `"inverted-text": true` to the technology in `technologies.json`.

## Development Environment
### Visual Studio Code
Install Live Server extension and optionally Beautify JSON.
### Python
Ensure Python is installed.
### Oletools
Install using `pip install -U oletools`. Used for extracting VBA scripts from Excel workbooks.

## Deployment
Deploy to a static web server, e.g., Azure. Minify HTML, CSS, Javascript, and JSON before deployment.

## Icon Media
Low-resolution icons from [Streamline](https://www.streamlinehq.com/icons). For full resolution versions, search 'piktogrammer' on the Intranet.

## License
Licensed under the MIT License.
