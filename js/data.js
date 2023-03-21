import { eagerResize, lazyResize } from './responsive-design.js';

let TechnologiesData;

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

export { getTechnologies, TechnologiesData };