# Vejle Municipality Technology Radar
This technology radar is a tool created in HTML/CSS/JS with a bit of jQuery for Vejle Municipality. It is used to communicate the maturity of emerging technologies within the context of the six administrations of the municipality.

## License
This Github repository is licensed under the MIT License.

## Technologies
The technologies featured in this radar are listed in the technologies.json file. To update the list of technologies, an Excel spreadsheet (GenerateTechnologies.xslm) is included in the project that can automatically generate a new JSON file with different technologies. Note that the coordinates for the technologies cannot currently be assigned automatically, so this process involves 

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

## Generating technologies.json
In this package, there is included an Excel file to help generate a JSON file for future technology radars. Here, I will explain how to use it.
1. Prepare the data. Here, we will be using the "Overordnet" sheet from the technology radar sheet. Make sure the rows of each technology line up with the same rows in the sheets for each of the administrations. If there, for example, are extra blank rows in the other sheets, the data could be incorrect!
2. IMPORTANT: When opening GenerateJSON.xlsm, make sure to trust macros, otherwise it will be unable to generate the file for you!
3. Paste the data from "Overordnet" sheet (named above) into the "Generer JSON" sheet included in GenerateJSON.xslm. Below, you can find a table over what data should go in which columns.
4. Click on the button near the top left, "Konverter til JSON". A JSON file called "technologies.json" will be generated on your desktop. Open it with your favorite code editor.
5. As you will see, the JSON file generated is all on one line.

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