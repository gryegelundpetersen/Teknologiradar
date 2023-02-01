import xml.etree.ElementTree as ET

# parse the xml file
tree = ET.parse("C:\\Users\\DARJU\\OneDrive - Vejle Kommune\\Visual Studio Code Projects\\Teknologiradar\\media\\radar.svg")
root = tree.getroot()

# register the namespace
ET.register_namespace("", "http://www.w3.org/2000/svg")

# loop through elements with <title> tag
for element in root.iter():
    title_element = element.find("title")
    if title_element is not None:
        title_text = title_element.text
        # set the ID attribute of the element to be the same as the contents of the title element
        element.set("id", title_text)

# write the modified xml back to the file
tree.write("C:\\Users\\DARJU\\OneDrive - Vejle Kommune\\Visual Studio Code Projects\\Teknologiradar\\media\\radar_with_ids.svg", xml_declaration=True)
