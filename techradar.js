const Dots = document.getElementById('dots');
const InfoBox = document.getElementById('infographic-info-box');
const CloseButton = document.getElementById('close-infographic-info');

// Set x & y offset for the Dots
const xOffset = 50;
const yOffset = 10;

// Define the minimum width for the radar infographic
const RadarMinWidth = 667;

// Define a variable for the JSON data to be fetched later.
let TechnologiesData;

// Boolean indicating if the current window size is supported or not.
let WindowSizeSupported;

// Recording of the width of the infographic last time the lazyResize function was called.
// If the user resizes the window quickly, the loading wheel is shown until the lazyResize function is called.
// If the user just resizes the window a little bit, the loader won't be shown.
let LastResizeWidth;

// Set colors for each administration
const AdministrationColors = {
  "bu": "bu-color",
  "velfaerd": "velfaerd-color",
  "ks": "ks-color",
  "oea": "oea-color",
  "tm": "tm-color",
  "komstab": "komstab-color"
};

// This code initializes variables and sets up an event listener for when the document is ready.

let SVG;                // A variable to store a reference to the element with the ID "radar-svg".
let SVGOverlay;         // A variable to store a reference to the element with the ID "svg-overlay".

let ExistingDots = [];  // An array to store references to existing dots on the radar.

let Zoomed = false;     // A boolean flag to store the state of whether the radar is zoomed in or not.

let dynamicStyles = null;  // A variable to store dynamic styles, if any.

let Finger = document.getElementById('finger'); // The pictogram for the user indication suggesting to click on a technology

if (/Mobi/.test(navigator.userAgent)) {
  window.addEventListener("resize", function() {
    window.scrollTo(0, 1);
  });
}

function isTouchDevice() {
  return (('ontouchstart' in window) ||
     (navigator.maxTouchPoints > 0) ||
     (navigator.msMaxTouchPoints > 0));
}

// Changes the icon for the Finger element based on the current input type (touch == true/false)
function changeClickIcon() {
  if (isTouchDevice()) {
    Finger.src = "media/touch-finger.png"
  }
  else {
    Finger.src = "media/cursor-double-click-3.png"
  }
}

$(document).ready(function(){

  changeClickIcon();
  

  // Get references to the elements with the ID "radar-svg" and "svg-overlay".
  SVG = document.getElementById('radar-svg');
  SVGOverlay = document.getElementById('svg-overlay');

  // Call the function to adjust the overlay to match the size of the SVG.
  adjustOverlayToSVGSize();

  // Store the width of the window in the variable "LastResizeWidth".
  LastResizeWidth = window.innerWidth;

  // Call the function to get the technologies. Initiates an ajax request and parses the JSON file technologies.json
  // Given the success of this, the drawDots is drawn
  getTechnologies();

  // Show the SVG overlay. This is the container for the dots and anything else that is aligned to the SVG.
  $(SVGOverlay).show();
 
});

let TouchMessageShown = false; // Keep track if we have suggested to the user to click a technology to see more info yet.

function showTouchMessage() {
  if (!TouchMessageShown) {
    $("#touch").show();
    TouchMessageShown = true;

    setTimeout(function() {
      $("#touch").hide();
    }, 2400);
  }
  
}



/**
 * Function for sending a GET request for technologies.json
 */
function getTechnologies(){
  /**
   * Send a GET request to the technologies.json file
   */
  $.ajax({
    url: "technologies.json",
    dataType: 'json',
    success: function(data) {
      /**
       * Store the data
       */
      TechnologiesData = data;
      /**
       * Make sure the radar is wide enough. Prompt user action if not.
       * Once the radar is wide enough, this function will call drawDots
       */
      eagerResize();
      lazyResize();  
    },
    error: function(xhr, status, error) {
      /**
       * Log the status and status text of the request
       */
      console.log(xhr.status + ": " + xhr.statusText);
    }
  });
}


// Add a listener to adjust the page when the window width changes. Only repeat max every 300 ms.
$(window).on("resize", _.debounce(lazyResize, 300));

// If the window size has changed by more than 20px since last time the lazyResize function was called, the loader will be shown to spare the user having to look at a badly aligned infographic.
// The condition of 20px ensures that the loader doesn't appear when small adjustments are made to the window that don't interfere too much with usability.
$(window).on("resize", eagerResize);

// The function for the listener above. It is not affected by the 300 ms limit, but runs every time the window is resized.
// Loader is shown if the window size has changed by more than 20px since the last time lazyResize was called
function eagerResize() {

  // Check if the new window size is supported and give user feedback accordingly.
  // This function will disable the #loader element if it is visible
  WindowSizeSupported = checkIfWindowSizeSupported();

  // Adjust the size of the overlay to match the SVG element.
  adjustOverlayToSVGSize();

  changeClickIcon();

  if (Math.abs(LastResizeWidth - window.innerWidth) > 20) {
    $('#loader').show();
  }
}

// This performs several actions in response to the change in window size
function lazyResize() {

  // Redraw the dots on the technology radar to match the new size.
  drawDots();

  // Update the last known window width.
  LastResizeWidth = window.innerWidth;
}

/**
 * adjustOverlayToSVGSize - adjusts the size of the overlay to match the size of the svg
 * the SVG is always either taking up the full height or height of its container.
 * We compare the viewport's aspect ratio to the SVG's ratio to find out which one of these applies and adjust the overlay's size accordingly.
 */
function adjustOverlayToSVGSize() {
  // Store the aspect ratio of the svg
  var SVGAspectRatio = 1360.161 / 773.057;

  // Get the window inner width and height
  var ScreenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  var ScreenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);


  // Calculate the aspect ratio of the window
  var ScreenAspectRatio = ScreenWidth / ScreenHeight;

  // If the window aspect ratio is greater than the svg aspect ratio
  if (ScreenAspectRatio > SVGAspectRatio) {
    // Set the max-width of the overlay to what it should be acording to the aspect ratio of the SVG.
    SVGOverlay.style.maxWidth = ScreenHeight * SVGAspectRatio + 'px';
  }
  // If the window aspect ratio is less than the svg aspect ratio
  else {
    SVGOverlay.style.removeProperty('max-width');
  }

  // Position svg-overlay at the same location as radar-svg,
  // taking into account any CSS transforms
  var rect = SVG.getBoundingClientRect();
  var computedStyle = window.getComputedStyle(SVG);
  var transform = computedStyle.transform || computedStyle.webkitTransform;
  var transformMatrix = new DOMMatrix(transform);
  var translateX = transformMatrix.m41;
  var translateY = transformMatrix.m42;
  SVGOverlay.style.top = (rect.top + translateY) + "px";
  SVGOverlay.style.left = (rect.left + translateX) + "px";
}


/**
 * changeFeedback - Function to hide all fullscreen info elements and show the specified one
 *
 * @param {string} [WindowID] - The ID of the fullscreen info element to show
 */
function changeFeedback(WindowID) {

  // Select all fullscreen info elements and hide them all
  let FullscreenInfo = document.querySelectorAll(".feedback");
  $(FullscreenInfo).hide();

  // If a WindowID is present, make it visible
  if (WindowID) {
    $(WindowID).show();
  }
}

/**
* Checks if the window size is supported, giving user feedback
* @return {void}
*/
function checkIfWindowSizeSupported() {
  var RadarWidth = $("#radar-infographic").width();
  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (RadarWidth >= RadarMinWidth) {
    // If the width of the element is already over minimum, hide all messages and do nothing
    changeFeedback();
    showTouchMessage();
    return true;
  }

  else if (isMobile && !(window.orientation === 90 || window.orientation === -90) && RadarWidth < RadarMinWidth && screen.height >= RadarMinWidth) {
    /**
    * If the screen width is less than the height, it's in portrait mode;
    * If the radar has less than 1000 px of space;
    * and flipping the screen would give more than a 25% increase in size:
    * hide the other messages and show the element with the ID "turn-screen"
    */
    changeFeedback("#turn-screen");
    return false;
  }
  
  else if(RadarWidth < RadarMinWidth && !isMobile){
    /**
    * If the radar is less than RadarMinWidth and the site is running on mobile,
    * tell the user to expand their browser window
    */
    changeFeedback('#expand-window');
    return false;
  }

  
  else {
  /**
  * If neither the width or height of the screen is more than 660 pixels,
  * hide the other messages and show the element with the ID "unsupported-media"
  */
  changeFeedback('#unsupported-media');
  console.log("Unsupported 1");
  return false;
  }
  }

/**
 * drawDots()
 * 
 * This function is responsible for drawing the dots on the graph. It gets the data from the TechnologiesData object and uses it to create the dots.
 * It also re-applys the zoom if relevant
 *
 * @param {Object} TechnologiesData - The data used to create the dots.
 * @param {HTMLElement} Loader - The loader element used to show the loading animation.
 * @param {HTMLElement} Dots - The element that holds the dots.
 * @param {Boolean} Zoomed - Flag to indicate if the graph is zoomed in or not.
 */
function drawDots(){
if (WindowSizeSupported) {
  const Loader = document.getElementById("loader");
  $(Loader).show();
  $(Dots).hide();

  // Delete any existing dots
  while (Dots.firstChild) {
    Dots.removeChild(Dots.firstChild);
  }

  // Loop through the data
  TechnologiesData.technologies.forEach((technology, index) => {
    // Call the createDot function with the technology name, x-position, y-position, and administrations
    createDot(technology.techName, technology.x, technology.y, technology.administrations, index);
  });

  if(Zoomed){
    zoomOut();
  }

  $(Loader).hide();
  $(Dots).show();
}
}

/**
 * Function to create a dot
 * @param {string} dotTextInput - The text to display by the dot
 * @param {number} x - The x position of the dot
 * @param {number} y - The y position of the dot
 * @param {object} administrations - An object containing the administrations and their values
 * @param {number} id - The id of the dot
 */
// Function to create a dot
function createDot(dotTextInput, x, y, administrations, id) {
  // Create a dot div and set the x and y positions
  const dot = createDiv('dot', Dots);

  dot.style.bottom = `${y + yOffset}%`;
  if (x<0){
    dot.style.right = `${xOffset - x -1.5}%`
    dot.style.left = 'auto';
  }
  else {
    dot.style.left = `${x + xOffset + 0.7}%`;
  }

  if(TechnologiesData.technologies[id]["inverted-text"] && x > 0 || !TechnologiesData.technologies[id]["inverted-text"] && x < 0) {
    dot.classList.add("reverse-text");
  }

  dot.id = `dot-${id.toString()}`;

  // Create a container for the squares
  const squareContainer = createDiv('square-container', dot);
    
  // Loop through the administrations in the data
  Object.keys(administrations).forEach(administration => {
    // Create a square div
    const square = createDiv('square', squareContainer);
    // If the administration is true, add the color class to the square
    if (administrations[administration] == true){
    square.classList.add(AdministrationColors[administration]);
    }
  });

  const maturity = TechnologiesData.technologies[id]["maturity"]
  dot.classList.add(`maturity-${maturity}`);

  const dotText = createDiv('dot-text', dot);
  dotText.innerHTML = dotTextInput;

}

// Add a click event listener to the document
document.getElementById('close-infographic-info').addEventListener('click', closeInfo);

// Function to close the info box
function closeInfo() {
  InfoBox.style.transform = "translateY(-100%)";
}

document.addEventListener('click', function(event) {
  let target = event.target;
  let clickOutElements = document.getElementsByClassName('click-out');

  for (let i = 0; i < clickOutElements.length; i++) {  
    
    if (clickOutElements[i].contains(target)) {
      if (target === clickOutElements[i]) {
        if (clickOutElements[i].id !== 'infographic-info-box') {
          clickOutElements[i].style.display = 'none';
        } else {
          closeInfo();
        }
      }
      break;
    }
  }
});


// Add a click event listener to the Dots div
Dots.addEventListener('click', openInfo);

// Function to open the info box
function openInfo(e) {

  if (!e.target.closest('.dot')) {
    return;
  }

  // Get the dot
  var dot = e.target.closest('.dot');

  if (dot.classList.contains('maturity-3') && (e.pointerType == "touch" || SVGOverlay.offsetWidth < 750) && !Zoomed){
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
  // If there is a pictogram, show it on the pictogram img element
    document.getElementById('pictogram').src = pictogram;
  }
  else {
  // Otherwise, show the default pictogram
    document.getElementById('pictogram').src = "media/digital-transformation.png";
  }

  var link = TechnologiesData.technologies[techId].link;


  
  if(link && link != '') {
  // If the link exists and isn't blank, show the 'read more' button and insert the link.
    $('#read-more').show();
    document.getElementById('read-more').href = link;
  }
  else {
  // Otherwise, hide the 'read more' button.
    $('#read-more').hide();
  }

  // Animate the info box in
  InfoBox.style.transform = "translateY(0)";

}

/**
* @function zoomIn
* The zoomIn function changes the position of the dots with a maturity of 3 and adds the zoom-field class to the klar-field element.
* @returns {undefined}
*/
function zoomIn() {
  Zoomed = true;
  for (var i=0; i < TechnologiesData.technologies.length; i++) {
    let Dot = document.getElementById('dot-' +i);
    if (Dot.className.includes("maturity-3")) {
      let OldX = TechnologiesData.technologies[i].x;
      let widthFactor = SVGOverlay.offsetWidth / Dot.offsetWidth * 1.25;
      let NewX = OldX * widthFactor;

      let OldY = TechnologiesData.technologies[i].y;
      let heightFactor = SVGOverlay.offsetHeight / Dot.offsetHeight * 2;
      let NewY = -OldY * heightFactor;

      DotText = Dot.getElementsByClassName('dot-text')[0];

      if (Dot.classList.contains('reverse-text') && OldX < -9) {
        Dot.classList.remove('reverse-text');
        NewX += 50;
      }
      else if (!Dot.classList.contains('reverse-text') && OldX > 9) {
        Dot.classList.add('reverse-text');
        NewX -= 50;
      }

    } else {
      Dot.classList.add("disappear");
    }
  }
  var LabelBoxes = document.getElementsByClassName("label-box");
  for (var i = 0; i < LabelBoxes.length; i++) {
    if (LabelBoxes[i].id != "klar-label-box") {
      LabelBoxes[i].style.opacity = 0;
    }
  }

  var LabelBoxes = document.getElementsByClassName("label-text");
  for (var i = 0; i < LabelBoxes.length; i++) {
    if (LabelBoxes[i].id != "klar-text") {
      LabelBoxes[i].style.opacity = 0;
    }
  }
  document.getElementById('klar-label-box').style = 'transform: scaleX(2.76);';
  document.getElementById('klar-label-box').setAttribute('d', 'M 451.25 697.46 L 693.89 697.46 L 693.89 766.06 L 451.25 766.06 L 451.25 756.8 L 451.25 731.8 L 451.25 706.8 L 451.25 697.46 Z');
  document.getElementById('klar-field').style = 'transform: scale(2.73);';
  document.getElementById('shrink').style = "display:block;";

  var Fields = document.getElementsByClassName("field");
  for (var i = 0; i < Fields.length; i++) {
    if(Fields[i].id != 'klar-field'){
      Fields[i].style.opacity = 0;
    }
  }

}

// Add a click event listener to the document
document.getElementById('shrink').addEventListener('click', zoomOut);

/**
* @function zoomOut
* The zoomOut function changes the position of the dots with a maturity of 3 and removes the zoom-field class from the klar-field element.
* @returns {undefined}
*/
function zoomOut() {

  Zoomed = false;

  for (var i=0; i < TechnologiesData.technologies.length; i++) {
  // Cycle through all of the technologies, undoing what was done to them in the zoom process.
  // We do it like this instead of just calling drawDots() so the dots animate back in place instead of teleporting

    let Dot = document.getElementById('dot-' +i); // Find each technology's dot by ID
    let OldX = TechnologiesData.technologies[i].x; // Take note of the normal X value

    // As part of zooming in, dot-text was reversed for dots in the outer extremities of klar so it wouldn't run off the edges of the viewport
    // Now, we reverse this:
    if (!Dot.classList.contains('reverse-text') && OldX < -9) {
      Dot.classList.add('reverse-text');
    }

    else if (Dot.classList.contains('reverse-text') && OldX > 9) {
      Dot.classList.remove('reverse-text');
    }

    if (Dot.className.includes("maturity-3")) {
    // Reset the transform of maturity-3 (klar) dots.
      Dot.style.transform = '';
    } else {
    // Make the other dots visible again.
      Dot.classList.remove("disappear");
    }
  }
  

  // Find all of the label-text elements
  var LabelBoxes = document.getElementsByClassName("label-text");

  for (var i = 0; i < LabelBoxes.length; i++) {
  // Cycle through all of them

    if (LabelBoxes[i].id != "klar-text") {
    // Giving all of them, except for the klar-text an opacity of 1, making them visible again.
      LabelBoxes[i].style.opacity = 1;
    }
  }

  // Make the klar label box pointy again instead of a rectangle
  document.getElementById('klar-label-box').setAttribute('d', 'M 451.25 697.46 L 693.89 697.46 L 693.89 766.06 L 451.25 766.06 L 451.25 756.8 L 471.249 731.8 L 451.25 706.8 Z');
  
  // Remove the transform (scaling) from the klar field and its respective label box.
  document.getElementById('klar-field').style.transform = '';
  document.getElementById('klar-label-box').style = '';

  // Hide the button for shrinking the 'klar' field down again
  document.getElementById('shrink').style = "display:none;";

  // Set the opacity of the various fields and label boxes back to normal
  document.getElementById('afproev-field').style="opacity:0.6;"
  document.getElementById('afproev-label-box').style="opacity:0.6;"
  document.getElementById('hold-oeje-field').style="opacity:0.4;"
  document.getElementById('hold-oeje-label-box').style="opacity:0.4;"
  document.getElementById('afvent-field').style="opacity:0.2;"
  document.getElementById('afvent-label-box').style="opacity:0.2;"
}


/**
* @function createDiv
* The createDiv function creates a new div element and sets its class name. The created div is then appended to the specified parent element.
* @param {string} className - The class name to be set for the div element.
* @param {Element} parent - The parent element where the div will be appended to.
* @returns {Element} - The created div element.
*/
function createDiv(className, parent) {
  var div = document.createElement('div');
  div.className = className;
  parent.appendChild(div);
  return div;
}