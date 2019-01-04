function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var web_view_common_1 = require("./web-view-common");
var profiling_1 = require("../../profiling");
__export(require("./web-view-common"));
var WKNavigationDelegateImpl = (function (_super) {
    __extends(WKNavigationDelegateImpl, _super);
    function WKNavigationDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WKNavigationDelegateImpl.initWithOwner = function (owner) {
        var handler = WKNavigationDelegateImpl.new();
        handler._owner = owner;
        return handler;
    };
    WKNavigationDelegateImpl.prototype.webViewDecidePolicyForNavigationActionDecisionHandler = function (webView, navigationAction, decisionHandler) {
        var owner = this._owner.get();
        if (owner && navigationAction.request.URL) {
            var navType = "other";
            switch (navigationAction.navigationType) {
                case 0:
                    navType = "linkClicked";
                    break;
                case 1:
                    navType = "formSubmitted";
                    break;
                case 2:
                    navType = "backForward";
                    break;
                case 3:
                    navType = "reload";
                    break;
                case 4:
                    navType = "formResubmitted";
                    break;
            }
            decisionHandler(1);
            if (web_view_common_1.traceEnabled()) {
                web_view_common_1.traceWrite("WKNavigationDelegateClass.webViewDecidePolicyForNavigationActionDecisionHandler(" + navigationAction.request.URL.absoluteString + ", " + navigationAction.navigationType + ")", web_view_common_1.traceCategories.Debug);
            }
            owner._onLoadStarted(navigationAction.request.URL.absoluteString, navType);
        }
    };
    WKNavigationDelegateImpl.prototype.webViewDidStartProvisionalNavigation = function (webView, navigation) {
        if (web_view_common_1.traceEnabled()) {
            web_view_common_1.traceWrite("WKNavigationDelegateClass.webViewDidStartProvisionalNavigation(" + webView.URL + ")", web_view_common_1.traceCategories.Debug);
        }
    };
    ;
    WKNavigationDelegateImpl.prototype.webViewDidFinishNavigation = function (webView, navigation) {
        if (web_view_common_1.traceEnabled()) {
            web_view_common_1.traceWrite("WKNavigationDelegateClass.webViewDidFinishNavigation(" + webView.URL + ")", web_view_common_1.traceCategories.Debug);
        }
        var owner = this._owner.get();
        if (owner) {
            var src = owner.src;
            if (webView.URL) {
                src = webView.URL.absoluteString;
            }
            owner._onLoadFinished(src);
        }
    };
    WKNavigationDelegateImpl.prototype.webViewDidFailNavigationWithError = function (webView, navigation, error) {
        var owner = this._owner.get();
        if (owner) {
            var src = owner.src;
            if (webView.URL) {
                src = webView.URL.absoluteString;
            }
            if (web_view_common_1.traceEnabled()) {
                web_view_common_1.traceWrite("WKNavigationDelegateClass.webViewDidFailNavigationWithError(" + error.localizedDescription + ")", web_view_common_1.traceCategories.Debug);
            }
            owner._onLoadFinished(src, error.localizedDescription);
        }
    };
    WKNavigationDelegateImpl.ObjCProtocols = [WKNavigationDelegate];
    return WKNavigationDelegateImpl;
}(NSObject));
var WebView = (function (_super) {
    __extends(WebView, _super);
    function WebView() {
        var _this = _super.call(this) || this;
        var configuration = WKWebViewConfiguration.new();
        _this._delegate = WKNavigationDelegateImpl.initWithOwner(new WeakRef(_this));
        var jScript = "var meta = document.createElement('meta'); meta.setAttribute('name', 'viewport'); meta.setAttribute('content', 'initial-scale=1.0'); document.getElementsByTagName('head')[0].appendChild(meta);";
        var wkUScript = WKUserScript.alloc().initWithSourceInjectionTimeForMainFrameOnly(jScript, 1, true);
        var wkUController = WKUserContentController.new();
        wkUController.addUserScript(wkUScript);
        configuration.userContentController = wkUController;
        configuration.preferences.setValueForKey(true, "allowFileAccessFromFileURLs");
        _this.nativeViewProtected = _this._ios = new WKWebView({
            frame: CGRectZero,
            configuration: configuration
        });
        return _this;
    }
    WebView.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this._ios.navigationDelegate = this._delegate;
    };
    WebView.prototype.onUnloaded = function () {
        this._ios.navigationDelegate = null;
        _super.prototype.onUnloaded.call(this);
    };
    Object.defineProperty(WebView.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    WebView.prototype.stopLoading = function () {
        this._ios.stopLoading();
    };
    WebView.prototype._loadUrl = function (src) {
        if (src.startsWith("file:///")) {
            this._ios.loadFileURLAllowingReadAccessToURL(NSURL.URLWithString(src), NSURL.URLWithString(src));
        }
        else {
            this._ios.loadRequest(NSURLRequest.requestWithURL(NSURL.URLWithString(src)));
        }
    };
    WebView.prototype._loadData = function (content) {
        this._ios.loadHTMLStringBaseURL(content, NSURL.alloc().initWithString("file:///" + web_view_common_1.knownFolders.currentApp().path + "/"));
    };
    Object.defineProperty(WebView.prototype, "canGoBack", {
        get: function () {
            return this._ios.canGoBack;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebView.prototype, "canGoForward", {
        get: function () {
            return this._ios.canGoForward;
        },
        enumerable: true,
        configurable: true
    });
    WebView.prototype.goBack = function () {
        this._ios.goBack();
    };
    WebView.prototype.goForward = function () {
        this._ios.goForward();
    };
    WebView.prototype.reload = function () {
        this._ios.reload();
    };
    __decorate([
        profiling_1.profile
    ], WebView.prototype, "onLoaded", null);
    return WebView;
}(web_view_common_1.WebViewBase));
exports.WebView = WebView;
//# sourceMappingURL=web-view.ios.js.map