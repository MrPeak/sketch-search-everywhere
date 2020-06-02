// Add Web View to window

@import 'app.js';

function getWebView(urlPath) {
  var webView = WebView.alloc().initWithFrame(NSMakeRect(0, 0, 480, 120));
  var windowObject = webView.windowScriptObject();

  // Awesome library
  var delegate = new MochaJSDelegate({
    "webView:didFinishLoadForFrame:": function(webView, webFrame) {
      // Something to be done after loading the webview
      //
      //
    },

    "webView:didChangeLocationWithinPageForFrame:": function(
      webView,
      webFrame
    ) {
      var locationHash = windowObject.evaluateWebScript("window.location.hash");
      // log(locationHash);
      if (locationHash.indexOf("@selectedLayerID=") > -1) {
        // Recieve "selete" signal
        var objectID = locationHash.slice("#@selectedLayerID=".length).trim();
        App.selectLayer(objectID);
      } else if (locationHash.indexOf("@query=") > -1) {
        // Reciew "query" signal
        var queryData = JSON.parse(
          locationHash.slice("#@query=".length).trim()
        );
        var arr = [];
        
        if (queryData.value.trim()) {
          var filters = queryData.filters;
          // log(queryData);

          App.filters = filters;

          // Find qualified layers
          var matchedLayers = App.findLayers_inContainer_filterByType(
            decodeURI(queryData.value),
            nil,
            App.filters.layerClass || nil,
            App.filters.type + " CONTAINS [c] %@"
          );

          // Get layers' info
          arr = App.getLayersAttrs(matchedLayers);
        }

        // Limit results' length to 15.
        arr = arr.slice(0, 15);
        
        // Execute webview's gloabl function, and pass data to it
        windowObject.evaluateWebScript(
          'window.App.renderList("' + arr.join("|||") + '")'
        );

        if (arr.length) {
          // Expand box
          App.setFrameExpand();
        } else {
          // Contract box
          App.setFrameContract();
        }
      }
    }
  });

  webView.setFrameLoadDelegate_(delegate.getClassInstance());
  webView.setMainFrameURL_(urlPath);

  App.webView = webView;
  return webView;
}
