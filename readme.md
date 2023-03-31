# Vejle Municipality Technology Radar
This technology radar is a tool created in HTML/CSS/JS with a bit of jQuery for Vejle Municipality. It is used to communicate the maturity of emerging technologies within the context of the six administrations of the municipality.

## Technologies
The technologies featured in this radar are listed in the technologies.json file. To update the list of technologies, an Excel spreadsheet (`GenerateJSON.xslm`) is included in the project that can automatically generate a new JSON file with different technologies. Note that the coordinates for the technologies cannot currently be assigned automatically, so this process involves some manual trial and error.

### Generating technologies.json using GenerateJSON.xslm
This package includes an Excel file that can help you generate a JSON file for future technology radars. Here's a step-by-step guide on how to use it:
1. Prepare the data: We'll be using the "Overordnet" sheet from the technology radar sheet. Make sure that the rows of each technology line up with the same rows in the sheets for each of the administrations. If there are extra blank rows in the other sheets, the data could be incorrect.
2. Important note: When opening GenerateJSON.xlsm, make sure to trust macros; otherwise, the file won't be able to generate the JSON file for you.
3. Paste the data from the "Overordnet" sheet into the "Generer JSON" sheet included in GenerateJSON.xslm. Refer to the table below for guidance on which data should go in which columns.
4. Click on the button labeled "Konverter til JSON" (located near the top left). This will generate a JSON file called "technologies.json". Open it with your favorite code editor.

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
At the moment, `GenerateJSON.xslm` is not capable of helping you position the technologies on the radar. Doing this requires you to set your copy of the site up in a development environment (see late section [Development Environment](##-development-environment)). 

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
