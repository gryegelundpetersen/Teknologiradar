import { IsWindowSizeSupported, isMobile } from './responsive-design.js';
import { TechnologiesData } from './data.js';
import { SVGOverlay } from './main.js';

const DotsContainer = document.getElementById('dots');
const AdministrationColors = {
  "bu": "bu-color",
  "velfaerd": "velfaerd-color",
  "ks": "ks-color",
  "oea": "oea-color",
  "tm": "tm-color",
  "komstab": "komstab-color"
};

const xOffset = 50;
const yOffset = 10;
let Zoomed;
const InfoBox = document.getElementById('infographic-info-box');

/**
 * drawDots()
 * 
 * This function is responsible for drawing the dots on the graph. It gets the data from the TechnologiesData object and uses it to create the dots.
 * It also re-applys the zoom if relevant
 *
 * @param {Object} TechnologiesData - The data used to create the dots.
 * @param {HTMLElement} Loader - The loader element used to show the loading animation.
 * @param {HTMLElement} DotsContainer - The element that holds the dots.
 * @param {Boolean} Zoomed - Flag to indicate if the graph is zoomed in or not.
 */
function drawDots(){
  if (IsWindowSizeSupported) {
    const Loader = document.getElementById("loader");
    Loader.style.display = 'block';
    DotsContainer.style.display = 'none';
    while (DotsContainer.firstChild) {
      DotsContainer.removeChild(DotsContainer.firstChild);
    }
    TechnologiesData.technologies.forEach((technology, index) => {
      createDot(technology.techName, technology.x, technology.y, technology.administrations, index);
    });
    if(Zoomed){
      zoomOut();
    }
    Loader.style.display = 'none';
    DotsContainer.style.display = 'block';
  }
}

function setDotPosition(dot, x, y) {
  dot.style.bottom = `${y + yOffset}%`;
  if (x < 0) {
    dot.style.right = `${xOffset - x - 1.55}%`
    dot.style.left = 'auto';
  } else {
    dot.style.left = `${x + xOffset - 1.2}%`;
    dot.style.right = 'auto';
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
function createDot(dotTextInput, x, y, administrations, id) {
  const dot = createDiv('dot', DotsContainer);
  setDotPosition(dot, x, y);
  if (TechnologiesData.technologies[id]["inverted-text"] && x > 0 || !TechnologiesData.technologies[id]["inverted-text"] && x < 0) {
    dot.classList.add("reverse-text");
  }
    dot.id = `dot-${id.toString()}`;
    const squareContainer = createDiv('square-container', dot);
    Object.keys(administrations).forEach(administration => {
      const square = createDiv('square', squareContainer);
      if (administrations[administration] == true){
        square.classList.add(AdministrationColors[administration]);
      }
    });
    const maturity = TechnologiesData.technologies[id]["maturity"]
    dot.classList.add(`maturity-${maturity}`);
    const dotText = createDiv('dot-text', dot);
    dotText.innerHTML = dotTextInput;
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
      let heightFactor = SVGOverlay.offsetHeight / Dot.offsetHeight * 0.35;
      let NewY = -OldY * heightFactor;

      if (Dot.classList.contains('reverse-text') && OldX < -9) {
        Dot.classList.remove('reverse-text');
        NewX += 50;
      }
      else if (!Dot.classList.contains('reverse-text') && OldX > 9) {
        Dot.classList.add('reverse-text');
        NewX -= 50;
      }

      Dot.style.transform = `translate(${NewX}px, ${NewY}px)`
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

  /**
* @function zoomOut
* The zoomOut function changes the position of the dots with a maturity of 3 and removes the zoom-field class from the klar-field element.
* @returns {undefined}
*/
function zoomOut() {
    Zoomed = false;
    for (var i=0; i < TechnologiesData.technologies.length; i++) {

      let Dot = document.getElementById('dot-' +i); 
      let OldX = TechnologiesData.technologies[i].x; 
      if (!Dot.classList.contains('reverse-text') && OldX < -9 && !TechnologiesData.technologies[i]["inverted-text"]) {
        Dot.classList.add('reverse-text');
      }
      else if (Dot.classList.contains('reverse-text') && OldX > 9 && !TechnologiesData.technologies[i]["inverted-text"]) {
        Dot.classList.remove('reverse-text');
      }
      if (Dot.className.includes("maturity-3")) {
        Dot.style.transform = '';
      } else {
        Dot.classList.remove("disappear");
      }
    }
    var LabelBoxes = document.getElementsByClassName("label-text");
    for (var i = 0; i < LabelBoxes.length; i++) {
      if (LabelBoxes[i].id != "klar-text") {
        LabelBoxes[i].style.opacity = 1;
      }
    }
    document.getElementById('klar-label-box').setAttribute('d', 'M 451.25 697.46 L 693.89 697.46 L 693.89 766.06 L 451.25 766.06 L 451.25 756.8 L 471.249 731.8 L 451.25 706.8 Z');
    document.getElementById('klar-field').style.transform = '';
    document.getElementById('klar-label-box').style = '';
    document.getElementById('shrink').style = "display:none;";
    document.getElementById('afproev-field').style="opacity:0.6;"
    document.getElementById('afproev-label-box').style="opacity:0.6;"
    document.getElementById('hold-oeje-field').style="opacity:0.4;"
    document.getElementById('hold-oeje-label-box').style="opacity:0.4;"
    document.getElementById('afvent-field').style="opacity:0.2;"
    document.getElementById('afvent-label-box').style="opacity:0.2;"
  }

  function openInfo(e) {
    if (!e.target.closest('.dot')) {
      return;
    }
    var dot = e.target.closest('.dot');
    if (dot.classList.contains('maturity-3') && (e.pointerType == "touch" || SVGOverlay.offsetWidth < 900) && !Zoomed){
      zoomIn();
      return;
    }
    let techId = dot.id
    techId = (techId.split('-'))[1];
    const techName = TechnologiesData.technologies[techId]["techName"];
    document.getElementById('infographic-name').innerHTML = techName;
    let paragraphs = TechnologiesData.technologies[techId].description.split("\n");
    let descriptionHTML = "";
    for (var i=0; i < paragraphs.length; i++) {
      descriptionHTML += "<p>" + paragraphs[i] + "</p>";
    }
    document.getElementById('infographic-description').innerHTML = descriptionHTML;
    var pictogram = TechnologiesData.technologies[techId].pictogram;
    if (pictogram) {
      document.getElementById('pictogram').src = pictogram;
    }
    else {
      document.getElementById('pictogram').src = "media/digital-transformation.png";
    }
    var link = TechnologiesData.technologies[techId].link;
    const ReadMore = document.getElementById('read-more');
    if(link && link != '') {
      ReadMore.style.display = 'block';
      ReadMore.href = link;
    }
    else {
      ReadMore.style.display = 'none';
    }

      InfoBox.style.display = 'block';
  }

function closeInfo() {

  InfoBox.style.display = 'none';
  
}

  export { drawDots, createDot, zoomIn, zoomOut, openInfo, DotsContainer, closeInfo };