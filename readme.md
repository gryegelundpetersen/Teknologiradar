# Vejle Municipality Technology Radar
This technology radar is a tool created in HTML/CSS/JS with a bit of jQuery for Vejle Municipality. It is used to communicate the maturity of emerging technologies within the context of the six administrations of the municipality.

## Technologies.json
The technologies featured in this radar are listed in the technologies.json file. To update the list of technologies, an Excel spreadsheet (`GenerateJSON.xslm`) is included in the project that can automatically generate a new JSON file with different technologies. Note that the coordinates for the technologies cannot currently be assigned automatically, so this process involves some manual trial and error.

### Generating technologies.json using GenerateJSON.xslm
This package includes an Excel file that can help you generate a JSON file for future technology radars. Here's a step-by-step guide on how to use it:
1. Prepare the data: We'll be using the "Overordnet" sheet from the technology radar sheet. Make sure that the rows of each technology line up with the same rows in the sheets for each of the administrations. If there are extra blank rows in the other sheets, the data could be incorrect.
2. Important note: When opening GenerateJSON.xlsm, make sure to trust macros; otherwise, the file won't be able to generate the JSON file for you.
3. Paste the data from the "Overordnet" sheet into the "Generer JSON" sheet included in GenerateJSON.xslm. Refer to the table below for guidance on which data should go in which columns.
4. Click on the button labeled "Konverter til JSON" (located near the top left). This will generate a JSON file called "technologies.json".
5. Open it with your favorite code editor. Now, is probably a good time to look at the file and make sure the data looks right.

The generated JSON file will not be formatted terribly prettily. If you wish, you can use the extension "Beutify JSON" for Visual Studio Code to make it more human-friendly.

| Data Type                                     | Column |
|-----------------------------------------------|--------|
| Technology Names (and ONLY technology names!) | B      |
| Values for Ø&A                                | E      |
| Values of T&M                                 | F      |
| Values for B&U                                | G      |
| Values for Velfærd                            | H      |
| Values for K&S                                | I      |
| Values for Komstab                            | J      |
| Descriptions of the technologies              | K      |
| Links to read more (FULL LINKS! https://...)  | L      |

### Fine-tuning the generated technologies.json
At the moment, `GenerateJSON.xslm` is not capable of helping you position the technologies on the radar. This must be done by manually editing the file. The recommended procedure for doing this is detailed below.

1. Set up the development environment (see later section [Development Environment](##-development-environment)).
2. Download a copy of this project if you haven't already and extract it.
3. In Visual Studio Code, click `File > Open Folder`. Navigate to the folder containing this project and select it.
4. Replace the existing technologies.json with the one you generated and open it.
5. Start the live server by pressing the `Live Server` button in the bottom right. Your browser should open. If not, you can navigate to [localhost:5500](localhost:5500).
Now you should see the technology radar with all of your data points at the bottom middle. Now, we need to tell them where to be.
7. Optional, but highly recommended: Install the `Beautify JSON` extension on VS Code. Press Ctrl/Cmd+Shift+P and search for `Beautify JSON`. Press enter twice (selecting `2` and `keep`)
8. Now, you can start editing the X and Y values of each of the technologies. Every time you save the technologies.json (or any other file in the project) the page in your browser should reload so you can see how the change affected the document.
9. Now rinse and repeat for all of the technologies. It may seem like a big task, but it goes quickly once you get the hang of the coordinate system!

## Development Environment
This section describes the setup for the development environment of the project.
### Visual Studio Code
The recommended code editor for this project is Visual Studio Code.
#### Live Server Extension
Install the Live Server extension for Visual Studio Code. This is used to run a local web server while making changes to the project.
### Python
Make sure Python is installed on your machine.
### Oletools
Install `oletools` package via pip, Python's package manager, using the following command:
```
pip install -U oletools
```
This package is used for a hook that extracts VBA scripts from Excel workbooks pre-commit to ensure proper version control on these files.

## Deployment
This project can be deployed to a static web server, for example Azure. However, it is recommended to minify the HTML, CSS, and Javascript before doing so to minimise loading times. There are numerous web-based tools (and probably also a VS Code extension) for doing this.

## Icon Media
The following icons in this project use low-resolution versions from [Streamline](https://www.streamlinehq.com/icons). Employees at Vejle can find information about how to license the full resolution versions by searching 'piktogrammer' on the Intranet.
* Expand Horizontal 4
* Meeting Monitor Webcam
* On Error Sad
* Phone Rotate 1
* Vr User Play
* Resize Shrink
* Touch Finger
* Cursor Double Click 3

## License
This Github repository is licensed under the MIT License.
