@import 'webView.js';
@import 'app.js';

function openWindow(webView) {
  // SearchEverywhere main window
  var threadDictionary = NSThread.mainThread().threadDictionary();
  var identifier = "com.github.mrpeak.search_text";

  // Set to global
  App.threadDictionary = threadDictionary;
  App.identifier = identifier;

  if (threadDictionary[identifier]) {
    return;
  }

  var windowWidth = 480, windowHeight = 120;
  var SearchEverywhere = NSPanel.alloc().init();
  SearchEverywhere.setFrame_display(
    NSMakeRect(0, 0, windowWidth, windowHeight),
    true
  );

  SearchEverywhere.setStyleMask(
    NSTexturedBackgroundWindowMask | NSTitledWindowMask | NSClosableWindowMask
  );
  
  SearchEverywhere.setBackgroundColor(NSColor.colorWithRed_green_blue_alpha(255 / 255, 250 / 255, 240 / 255, 1));

  // Titlebar
  SearchEverywhere.setTitle("Search Everywhere");
  SearchEverywhere.setTitlebarAppearsTransparent(true);
  SearchEverywhere.becomeKeyWindow();
  SearchEverywhere.setLevel(NSFloatingWindowLevel);

  threadDictionary[identifier] = SearchEverywhere;

  // Long-running script
  COScript.currentCOScript().setShouldKeepAround_(true);

  App.COScript = COScript.currentCOScript();
  
  SearchEverywhere.contentView().addSubview(webView);
  SearchEverywhere.center();
  SearchEverywhere.makeKeyAndOrderFront(nil);

  SearchEverywhere.standardWindowButton(NSWindowZoomButton).setHidden(true);
  SearchEverywhere.standardWindowButton(NSWindowMiniaturizeButton).setHidden(true);
  // Close Window
  var closeButton = SearchEverywhere.standardWindowButton(NSWindowCloseButton);
  
  App.SearchEverywhere = SearchEverywhere; // set to global

  closeButton.setCOSJSTargetFunction(function() {
    App.closeWindow();
  });

  closeButton.setAction("callAction:");
  
  return SearchEverywhere;
}
