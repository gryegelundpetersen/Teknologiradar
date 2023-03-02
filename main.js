import { zoomOut, DotsContainer, openInfo, closeInfo } from './infographic.js';
import { getTechnologies } from './data.js';
import { lazyResize, eagerResize, changeClickIcon, adjustOverlayToSVGSize, SetLastResizeWidth } from './responsive-design.js';

let SVG;                
let SVGOverlay;

$(document).ready(function(){
  changeClickIcon();
  SVG = document.getElementById('radar-svg');
  SVGOverlay = document.getElementById('svg-overlay');
  adjustOverlayToSVGSize();
  SetLastResizeWidth(window.innerWidth);
  getTechnologies();
  $(SVGOverlay).show();

  if (/Mobi/.test(navigator.userAgent)) {
    window.addEventListener("resize", function() {
      window.scrollTo(0, 1);
    });
  }
});

$(window).on("resize", _.debounce(lazyResize, 300));
$(window).on("resize", eagerResize);

document.getElementById('close-infographic-info').addEventListener('click', closeInfo);

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
DotsContainer.addEventListener('click', openInfo);


document.getElementById('shrink').addEventListener('click', zoomOut);

export { SVG, SVGOverlay }