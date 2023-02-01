const Dots = document.getElementById('dots');
const InfoBox = document.getElementById('infographic-info-box');
const CloseButton = document.getElementById('close-infographic-info');

// Set x & y offset for the Dots
const xOffset = 50;
const yOffset = 10;

// Define the minimum width for the radar infographic
const RadarMinWidth = 330

// Define a variable for the JSON data to be fetched later.
let TechnologiesData;

// Set colors for each administration
const AdministrationColors = {
  "bu": "bu-color",
  "velfaerd": "velfaerd-color",
  "ks": "ks-color",
  "oea": "oea-color",
  "tm": "tm-color",
  "komstab": "komstab-color"
};

let SVG;
let SVGOverlay;

let ExistingDots = [];

// Add a listener to adjust the page when the window width changes.
$(window).on("resize", resizeWindow);

$(document).ready(function(){

  SVG = document.getElementById('radar-svg');
  SVGOverlay = document.getElementById('svg-overlay');

  adjustOverlayToSVGSize();
  setGId();

  // Do a GET call to technologies.json 
  getTechnologies();
// Sets ID on the G elements in the SVG
  $(SVGOverlay).show();
 
})

function setGId() {
  let gElements = SVG.getElementsByTagName("g");
  for (let i = 0; i < gElements.length; i++) {
    let gElement = gElements[i];
    console.log("doing the " +i+ "th");
    let titleElement = gElement.getElementsByTagName("title")[0];
    if (titleElement) {
      gElement.id = titleElement.textContent;
    }
  }
}

// Function for sending a GET request for technologies.json
function getTechnologies(){
  // Send a GET request to the technologies.json file
  $.ajax({
    url: "technologies.json",
    dataType: 'json',
    success: function(data) {
      // Store the data
      TechnologiesData = data;
      // Make sure the radar is wide enough. Prompt user action if not.
      // Once the radar is wide enough, this function will call drawDots
      resizeWindow(0);
    },
    error: function(xhr, status, error) {
      console.log(xhr.status + ": " + xhr.statusText);
    }
  });
}

function resizeWindow(TimeOut){

  // If TimeOut is not specified, make it 3000 ms.
  if(TimeOut == null) {
    TimeOut = 3000;
  }

  setTimeout(function(){
    checkIfWindowSizeSupported();
    adjustOverlayToSVGSize();
    drawDots();
  }, TimeOut)
}

function adjustOverlayToSVGSize() {
  var SVGAspectRatio = 1360.161 / 773.057;

  var WindowInnerWidth = window.innerWidth;
  var WindowInnerHeight = window.innerHeight;

  var WindowAspectRatio = WindowInnerWidth / WindowInnerHeight;
  if (WindowAspectRatio > SVGAspectRatio) {
    console.log(window.innerHeight);
    SVGOverlay.style.height = WindowInnerHeight + 'px';
    SVGOverlay.style.width = WindowInnerHeight*SVGAspectRatio + 'px';
  }
  else {
    SVGOverlay.style.width = WindowInnerWidth + 'px';
    SVGOverlay.style.height = WindowInnerWidth/SVGAspectRatio + 'px';
  }
}

function checkIfWindowSizeSupported() {
  var RadarWidth = $("#radar-infographic").width();
    
    if (screen.width < screen.height && RadarWidth < 1000 && screen.height/screen.width > 1.25) {
      // If the screen width is less than the height, it's in portrait mode;
      // If the radar has less than 1000 px of space;
      // and flipping the screen would give more than a 25% increase in size:
      // hide the other messages and show the element with the ID "turn-screen"
      $("#expand-window, #unsupported-media, #loader").hide();
      $("#turn-screen").show();
    } 
    else if (RadarWidth > RadarMinWidth) {
      // If the width of the element is already over minimum, hide all messages and do nothing
      $("#turn-screen, #expand-window, #unsupported-media").hide();
    }
    else if (screen.width < RadarMinWidth && screen.height < RadarMinWidth) {
      // If neither the width or height of the screen is more than 660 pixels,
      // hide the other messages and show the element with the ID "unsupported-media"
      $("#turn-screen, #expand-window, #loader").hide();
      $("#unsupported-media").show();
    }
    else if(RadarWidth < RadarMinWidth && !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
      // If the radar is less than 660 wide and the site is not running on mobile,
      // tell the user to expand their browser window
      $("#turn-screen, #unsupported-media, #loader").hide();
      $("#expand-window").show();
    }
    else {
      // If none of the above conditions are met, hide the other messages and show the element with the ID "unsupported-media"
    }
}

function drawDots(){

  const loader = document.getElementById("loader");
  $(loader).show();
  $(Dots).hide();

  // Delete any existing dots
  while (Dots.firstChild) {
    Dots.removeChild(Dots.firstChild);
  }

  // Loop through the data
  for (var i=0; i < TechnologiesData.technologies.length; i++) {
    // Call the createDot function with the technology name, x-position, y-position, and administrations
    createDot(TechnologiesData.technologies[i].techName, TechnologiesData.technologies[i].x, TechnologiesData.technologies[i].y, TechnologiesData.technologies[i].administrations, i);
  }

  document.getElementById("radar-infographic").classList.add('transition');
  $(loader).hide();
  $(Dots).show();
}

// Function to create a dot
function createDot(dotTextInput, x, y, administrations, id) {
  // Create a dot div and set the x and y positions
  var dot = createDiv('dot', Dots);

  dot.style.bottom = y + yOffset + '%';

  if (x<0 && !TechnologiesData.technologies[id]["inverted-text"]){
    dot.style.right = xOffset - x - 1.5 + '%';
    dot.classList.add("reverse-text");
  }
  else {
    dot.style.left = x + xOffset + 0.7 + '%';
  }

  dot.id = "dot-" + id.toString();

  // Create a container for the squares
  squareContainer = createDiv('square-container', dot);
    
  // Loop through the administrations in the data
  for (var i=0; i < Object.keys(administrations).length; i++) {
    // Create a square div
    var square = createDiv('square', squareContainer);
    // If the administration is true, add the color class to the square
    if (administrations[Object.keys(administrations)[i]] == true){
    square.classList.add(AdministrationColors[Object.keys(administrations)[i]]);
    }
  }

  var maturity = TechnologiesData.technologies[id]["maturity"]
  dot.classList.add("maturity-" +maturity);

  var dotText = createDiv('dot-text', dot);
  dotText.innerHTML = dotTextInput;

}

// Add a click event listener to the document
document.addEventListener('click', closeInfo);

// Function to close the info box
function closeInfo(e) {
  // Check if the target is the info box
  if ((!e.target.closest('#infographic-info-box') || e.target.id == 'close-infographic-info') && !e.target.closest('.dot')) {
    // If it isn't, close the info box
    InfoBox.style.display = "none"
  }
}

// Add a click event listener to the Dots div
Dots.addEventListener('click', openInfo);

// Function to open the info box
function openInfo(e) {
  // Check if the element is a dot
  console.log(e);
  if (!e.target.closest('.dot')) {
    return;
  }

  // Get the dot
  var dot = e.target.closest('.dot');

  if (dot.classList.contains('maturity-3') && e.pointerType == "touch"){
    console.log("ZOOOOOMIN IN");
    zoomIn();
    return;
  }

  // Get the ID of the dot
  var techId = dot.id
  // Split it up by the - and get the second part of the ID (the number itself)
  techId = (techId.split('-'))[1];

  // Change infographic-name to the technology name

  techName = TechnologiesData.technologies[techId]["techName"];

  document.getElementById('infographic-name').innerHTML = techName;

  var paragraphs = TechnologiesData.technologies[techId].description.split("\n");
  // Create a string to hold the HTML
  var descriptionHTML = "";
  // Loop through the paragraphs
  for (var i=0; i < paragraphs.length; i++) {
    // Add the paragraph to the HTML string
    descriptionHTML += "<p>" + paragraphs[i] + "</p>";
  }
  // Set the info box content
  document.getElementById('infographic-description').innerHTML = descriptionHTML;

  var pictogram = TechnologiesData.technologies[techId].pictogram;

  if (pictogram) {
    document.getElementById('pictogram').src = pictogram;
  }
  else {
    document.getElementById('pictogram').src = "media/digital-transformation.png";
  }
  document.getElementById('pictogram')

  // Animate the info box in
  InfoBox.style.display = "block";

}

function zoomIn() {
  console.log("Zooming in");
  for (let i = 0; i < Dots.children.length; i++) {
    let Dot = Dots.children[i];
    if (Dot.className.includes("maturity-3")) {
      let left = Dots.children[i].style.left;
      let right = Dots.children[i].style.right;
      let bottom = Dots.children[i].style.bottom;


      /*if (x<0 && !TechnologiesData.technologies[id]["inverted-text"]){
        dot.style.right = xOffset - x - 1.5 + '%';
        dot.classList.add("reverse-text");
      }
      else {
        dot.style.left = x + xOffset + '%';
      }*/

      if (right != "") {
        right = parseFloat(right.replace("%", ""));
        right = (-right/xOffset)+1.5;
        console.log(right);
        var newRight = (right*(47/20));
        console.log(newRight);
        Dots.children[i].style.right = newRight + "%";
      }
      else if (left != "") {
        left = parseFloat(left.replace("%", ""));
        Dots.children[i].style.left = left*(47/20)+ "%";
      }
      else {
        console.error("Uncaught exception: No value entered for either 'right' or 'left' at dot-" +i);
      }

      //console.log("Dot nr " +i+ " left: " +left+ " right: " +right);

      //bottom = parseFloat(bottom.replace("%", ""));
      //Dots.children[i].style.bottom = bottom*(82/28)+ "%";
      
    } else {
      Dots.children[i].classList.add("disappear");
    }
  }
  document.getElementById('klar-field').classList.add('zoom-field');
}


// Function to create a div
function createDiv(className, parent) {
  // Create the div
  var div = document.createElement('div');
  // Set the class name
  div.className = className;
  // Append to the parent element
  parent.appendChild(div);
  // Return the div
  return div;
}