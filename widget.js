(function () {
  console.log("function launch");
  /* var assignation */
  var fullStar = 'https://images.ctfassets.net/w0han2rpch8u/NUQdasVwNAlJ6wmFA4fTw/ae2b64587508d965323170bc96a17ddf/cuu_star_full.svg?h=10';
  var emptyStar = 'https://images.ctfassets.net/w0han2rpch8u/6Zr2zuKqiPDaxLALF1IqH5/48e73f0acc183430b17c2a55bb9ad5bb/cuu_star_empty.svg?h=10';
  var halfStar = 'https://images.ctfassets.net/w0han2rpch8u/1YXEEnbpGgiJ44xJDYRsKJ/a698bb0c5d7da0db3c701594ec1a9c8e/cuu_star_half.svg?h=10';
  var logoClear = 'https://images.ctfassets.net/w0han2rpch8u/1aLZA17kOoWZxNi9CxIr19/85d125d8b487e2cd5ae727391488af80/cuu_logotype_horizontal_simple.png?h=250';
  var logoDark = 'https://images.ctfassets.net/w0han2rpch8u/7r4H7mlDgD2B3TGSXPr6dr/fad609557deb58de5ed27cabf66db2a6/cuu_logotype_horizontal_hybrid.png?h=50';
  var userLang = navigator.language || navigator.userLanguage || 'en-US';
  var message = 'on';
  var StarArray = [];
  var jQuery;

  /* load jquery if not present */
  if (window.jQuery === undefined || window.jQuery.fn.jquery !== '1.4.2') {
    var script_tag = document.createElement('script');
    script_tag.setAttribute("type", "text/javascript");
    script_tag.setAttribute("src",
      "http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js");
    if (script_tag.readyState) {
      script_tag.onreadystatechange = function () { // For old versions of IE
        if (this.readyState == 'complete' || this.readyState == 'loaded') {
          scriptLoadHandler();
        }
      };
    } else { // Other browsers
      script_tag.onload = scriptLoadHandler;
    }
    // Try to find the head, otherwise default to the documentElement
    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
  } else {
    // The jQuery version on the window is the one we want to use
    jQuery = window.jQuery;
    main();
  }

  /* called when jquery loaded */
  function scriptLoadHandler() {
    // Restore $ and window.jQuery to their previous values and store the
    // new jQuery in our local jQuery variable
    jQuery = window.jQuery.noConflict(true);
    // Call our main function
    main();
  }

  function languageChecker(userLang) {
    if (userLang.indexOf('fr') > -1) {
      message = 'sur'
    } else if (userLang.indexOf('nl') > -1) {
      message = 'op'
    }
  }

  function starAtMe(rating_avg) {
    var count = 5
    let ratingAvgTemp = rating_avg
    for (let i = 0; i < count; i++) {
      if (ratingAvgTemp >= 1) {
        StarArray.push(fullStar)
        ratingAvgTemp -= 1
      } else if (ratingAvgTemp >= 0.5) {
        StarArray.push(halfStar)
        ratingAvgTemp -= 1
      } else {
        StarArray.push(emptyStar)
      }
    }
  }

  /* main function */
  function main() {
    console.log("main function launch");
    jQuery(document).ready(function($) {
      const dataId = $("#cuustomer-widget-script").attr("data-id")
      const dataHeight = $("#cuustomer-widget-script").attr("data-height")
      const dataWidth = $("#cuustomer-widget-script").attr("data-width")
      languageChecker(userLang)
      jQuery.ajax({
        url: `https://cuustomer-api.herokuapp.com/api?query=query%7Bprovider(name%3A%22${encodeURI(dataId)}%22)%7Bname%20rating_avg%20reviews%7Bid%7D%7D%7D`,
        success: function(result) {
          starAtMe(result.data.provider.rating_avg)
          console.log("userlang:", userLang)
          console.log("result: ", result.data.provider.rating_avg)
          $("#cuustomer-widget-div").css({
            'position': 'relative',
            'border': '2px solid #00baff',
            'margin': '0',
            'padding': '0',
            'max-height': '100px',
            'min-height': '70px',
            'height': dataHeight,
            'max-width': '250px',
            'min-width': '200px',
            'width': dataWidth,
            'border-radius': '3px',
            'text-align': 'center',
            'font-family': 'sans-serif',
            'background': '#2B2D42',
            'color': 'white'
          }).hover(function() {
            $(this).css({
              'cursor': 'pointer'
            })
          }).click(function() {
            window.open(`https://www.cuustomer.com/provider/${encodeURI(dataId)}`, '_blank')
          })
          // $("#cuustomer-widget-div").append(`<span style="">${result.data.provider.rating_avg}/5</span>`);
          $("#cuustomer-widget-div").append(
            `<div style="display: flex; justify-content: center; margin-top: 5px;">
              <img style="height: 2em;" src=${StarArray[0]} />
              <img style="height: 2em;" src=${StarArray[1]} />
              <img style="height: 2em;" src=${StarArray[2]} />
              <img style="height: 2em;" src=${StarArray[3]} />
              <img style="height: 2em;" src=${StarArray[4]} />
            </div>`
          )
        $("#cuustomer-widget-div").append(
          `<div style="display: flex; align-items: center; justify-content: center; font-size: 80%;">
          ${result.data.provider.rating_avg}/5 ${message} <img style="height: 60px;" src=${logoClear} />
          </div>`
        );
        }
      });
    });
  }
})();
