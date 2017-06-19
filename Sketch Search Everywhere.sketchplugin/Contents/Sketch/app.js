var App = {
  ADDITIONS_HEIGHT: 200,
  IS_EXPAND: false,
  filters: {
    type: "stringValue",
    layerClass: "TextLayer"
  },
  init: function(ctx) {
    this.ctx = ctx;
    this.doc = ctx.document;
    this.sketch = ctx.api();
  },
  closeWindow: function() {
    log("Window closed!");
    App.COScript.setShouldKeepAround(false);
    App.threadDictionary.removeObjectForKey(App.identifier);
    App.SearchEverywhere.close();
  },
  setFrameExpand: function() {
    if (this.IS_EXPAND) return false;

    var _frame = App.SearchEverywhere.frame();
    _frame.size.height += this.ADDITIONS_HEIGHT;
    _frame.origin.y -= this.ADDITIONS_HEIGHT;
    App.SearchEverywhere.setFrame_display(_frame, true);

    var _frame_ = App.webView.frame();
    _frame_.size.height += this.ADDITIONS_HEIGHT;
    App.webView.setFrame(_frame_);

    log("expanded");
    this.IS_EXPAND = true;
  },
  setFrameContract: function(_coscript) {
    if (!App.IS_EXPAND) return false;

    var _frame = App.SearchEverywhere.frame();
    _frame.size.height -= App.ADDITIONS_HEIGHT;
    _frame.origin.y += App.ADDITIONS_HEIGHT;
    App.SearchEverywhere.setFrame_display(_frame, true);

    var _frame_ = App.webView.frame();
    _frame_.size.height -= App.ADDITIONS_HEIGHT;
    App.webView.setFrame(_frame_);

    App.IS_EXPAND = false;
  },
  findLayersMatchingPredicate_inContainer_filterByType: function(
    predicate,
    container,
    layerType
  ) {
    var scope;
    switch (layerType) {
      case MSPage:
        scope = this.doc.pages();
        return scope.filteredArrayUsingPredicate(predicate);

      case MSArtboardGroup:
        if (typeof container !== "undefined" && container != nil) {
          if (container.className == "MSPage") {
            scope = container.artboards();
            return scope.filteredArrayUsingPredicate(predicate);
          }
        } else {
          // search all pages
          var filteredArray = NSArray.array();
          var loopPages = this.doc.pages().objectEnumerator(), page;
          while ((page = loopPages.nextObject())) {
            scope = page.artboards();
            filteredArray = filteredArray.arrayByAddingObjectsFromArray(
              scope.filteredArrayUsingPredicate(predicate)
            );
          }
          return filteredArray;
        }
        break;

      default:
        if (typeof container !== "undefined" && container != nil) {
          scope = container.children();
          return scope.filteredArrayUsingPredicate(predicate);
        } else {
          // search all pages
          var filteredArray = NSArray.array();
          var loopPages = this.doc.pages().objectEnumerator(), page;
          var pages = this.doc.pages();

          while ((page = loopPages.nextObject())) {
            scope = page.children();
            filteredArray = filteredArray.arrayByAddingObjectsFromArray(
              scope.filteredArrayUsingPredicate(predicate)
            );
          }
          return filteredArray;
        }
    }
    return NSArray.array(); // Return an empty array if no matches were found
  },
  findLayers_inContainer_filterByType: function(
    textContent,
    container,
    layerType,
    predicateString
  ) {
    var predicate = typeof layerType == nil || !layerType
      ? NSPredicate.predicateWithFormat(predicateString, textContent)
      : NSPredicate.predicateWithFormat(
          predicateString + " && className == %@",
          textContent,
          "MS" + layerType
        );

    log(predicate);
    return this.findLayersMatchingPredicate_inContainer_filterByType(
      predicate,
      container,
      undefined
    );
  },
  getLayersAttrs: function(layers) {
    var arr = [];
    layers.forEach(function(layer) {
      var str =
        "name: " +
        encodeURIComponent(layer.name()) +
        ";" +
        "id: " +
        layer.objectID() +
        ";" +
        "class: " +
        layer.class() +
        ";" +
        // "isFlippedVertical: " +
        // layer.isFlippedVertical() +
        // ";" +
        // "isVisible: " +
        // layer.isVisible() +
        // ";" +
        // "nameIsFixed: " +
        // layer.nameIsFixed() +
        // ";" +
        // "heightIsClipped: " +
        // layer.heightIsClipped() +
        // ";" +
        layer.CSSAttributes().join("");

      if (layer.class() == "MSTextLayer") {
        str += "value: " + encodeURIComponent(layer.stringValue()) + ";";
      }

      if (layer.parentGroup()) {
        str +=
          "parentClass: " +
          layer.parentGroup().class() +
          ";" +
          "parentName: " +
          encodeURIComponent(layer.parentGroup().name()) +
          ";";
      }

      arr.push(str);
    });

    return arr;
  },
  // debounce: function(fn, delay) {
  //   var timer = null;
  //   return function() {
  //     var context = this, args = arguments;
  //     clearTimeout(timer);

  //     coscript.setShouldKeepAround_(true);
  //     coscript.scheduleWithInterval_jsFunction(delay / 1000, function() {
  //       fn.apply(context, args);
  //     });
  //   };
  // },
  selectLayer: function(objectID) {
    var selectedLayer = App.findLayers_inContainer_filterByType(
      objectID,
      nil,
      App.filters.layerClass,
      "objectID == %@"
    );

    selectedLayer = selectedLayer.firstObject();

    var pageOfLayer = this.findPageOfLayer(selectedLayer);

    // log(pageOfLayer);

    // Set current page
    this.doc.setCurrentPage(pageOfLayer);

    // Clear other selections, and select this layer
    selectedLayer.select_byExpandingSelection(true, false);

    // Center the selection
    this.doc.currentView().centerRect_(selectedLayer.absoluteRect().rect());

    // Tell user that choose layer sucess!
    this.doc.showMessage("Select success!!!");

    this.IS_EXPAND = false;
    App.closeWindow();
  },
  findPageOfLayer(layer) {
    var _layer = layer;
    // log(_layer);
    while (_layer.class().toString().toLowerCase() != "mspage") {
      // log(_layer);
      _layer = _layer.parentGroup();
    }

    return _layer;
  }
};
