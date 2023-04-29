import { drawDots, AreZeroDotsPresent, DoneDrawingDots } from './infographic.js';
import { SVG, SVGOverlay } from './main.js';

const MIN_RADAR_WIDTH = 667;
let IsWindowSizeSupported;
let LastResizeWidth;
let isMobile;

function SetLastResizeWidth(NewValue) {
  LastResizeWidth = NewValue;
} 

function eagerResize() {
    IsWindowSizeSupported = checkIfWindowSizeSupported();
    adjustOverlayToSVGSize();
    changeClickIcon();
    if (Math.abs(LastResizeWidth - window.innerWidth) > 20) {
      $('#loader').show();
    }
  }
  
function lazyResize() {
  drawDots();
  LastResizeWidth = window.innerWidth;
}

let Finger = document.getElementById('finger');
let TouchMessageShown = false; 

function isTouchDevice() {
    return (('ontouchstart' in window) ||
       (navigator.maxTouchPoints > 0) ||
       (navigator.msMaxTouchPoints > 0));
}

function changeClickIcon() {
  if (isTouchDevice()) {
    Finger.src = "media/touch-finger.png"
  }
  else {
    Finger.src = "media/cursor-double-click-3.png"
  }
}

function showTouchMessage() {
  if (!DoneDrawingDots) {
    window.setTimeout(showTouchMessage, 100); /* Check every 100 ms */
  }
  else if (!TouchMessageShown && !AreZeroDotsPresent) { 
  // If the touch message hasn't already been shown and there are no dots with an x/y value of zero, show the message encouraging the user to touch/click on dots
    $("#touch").show();
    TouchMessageShown = true;
    setTimeout(function() {
      $("#touch").hide();
    }, 2400);
  }
  else {
    $("#touch").hide();
  }
}

/**
* Checks if the window size is supported, giving user feedback
* @return {void}
*/
function checkIfWindowSizeSupported() {
  changeFeedback('#unsupported-media');
    var RadarWidth = $("#radar-infographic").width();
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    console.log(isMobile);
    console.log(`${RadarWidth} & ${MIN_RADAR_WIDTH}`);
    if (RadarWidth >= MIN_RADAR_WIDTH) {
      changeFeedback();
      showTouchMessage();
      return true;
    }
    else if (isMobile && !(window.orientation === 90 || window.orientation === -90) && RadarWidth < MIN_RADAR_WIDTH && screen.height >= MIN_RADAR_WIDTH) {
      /**
      * If the screen width is less than the height, it's in portrait mode;
      * If the radar has less than 1000 px of space;
      * and flipping the screen would give more than a 25% increase in size:
      * hide the other messages and show the element with the ID "turn-screen"
      */
      changeFeedback("#turn-screen");
      return false;
    }
    else if(RadarWidth < MIN_RADAR_WIDTH && !isMobile){
      /**
      * If the radar is less than MIN_RADAR_WIDTH and the site is running on mobile,
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
 * changeFeedback - Function to hide all fullscreen info elements and show the specified one
 *
 * @param {string} [WindowID] - The ID of the fullscreen info element to show
 */
function changeFeedback(WindowID) {
    let FullscreenInfo = document.querySelectorAll(".feedback");
    $(FullscreenInfo).hide();
    if (WindowID) {
      console.log(`Showing ${WindowID}`)
      console.log($(WindowID).show());
    }
}

const SVG_ASPECT_RATIO = 1360.161 / 773.057;
function adjustOverlayToSVGSize() {
  const rect = SVG.getBoundingClientRect();
  /*const computedStyle = window.getComputedStyle(SVG);
  const transform = computedStyle.transform || computedStyle.webkitTransform;
  const transformMatrix = new DOMMatrix(transform);
  const translateX = transformMatrix.m41;
  const translateY = transformMatrix.m42;
  SVGOverlay.style.top = `${rect.top + translateY}px`;
  SVGOverlay.style.left = `${rect.left + translateX}px`;*/
  const { screenWidth, screenHeight } = getScreenSize();
  const screenAspectRatio = screenWidth / screenHeight;
  if (screenAspectRatio > SVG_ASPECT_RATIO) {
    setSVGSize(SVG, SVGOverlay, screenHeight * SVG_ASPECT_RATIO, screenHeight);
  } else {
    setSVGSize(SVG, SVGOverlay, screenWidth, screenWidth / SVG_ASPECT_RATIO);
  }
}

function getScreenSize() {
  const screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  const screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  return { screenWidth, screenHeight };
}

function setSVGSize(SVG, SVGOverlay, width, height) {
  SVGOverlay.style.maxWidth = `${width}px`;
  setSVGSizeForSafari(SVG, width, height);
}

function setSVGSizeForSafari(SVG, width, height) {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  if (true) {
    SVG.setAttribute("width", `${width}px`);
    SVG.setAttribute("height", `${height}px`);
  }
}

export { lazyResize, eagerResize, isTouchDevice, changeClickIcon, showTouchMessage, checkIfWindowSizeSupported, changeFeedback, adjustOverlayToSVGSize, IsWindowSizeSupported, SetLastResizeWidth, isMobile };