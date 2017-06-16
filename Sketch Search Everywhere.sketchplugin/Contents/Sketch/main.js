@import 'MochaJSDelegate.js';
@import 'webView.js';
@import 'window.js';
@import 'app.js';

function onRun(context) {
  // initializing...
  App.init(context);

  openWindow(
    getWebView(
      context.plugin.urlForResourceNamed("window.html").path()
    )
  );
}
