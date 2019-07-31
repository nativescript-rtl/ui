Object.defineProperty(exports, "__esModule", { value: true });
var utils = require("../utils/utils");
var ios;
(function (ios) {
    function getActualHeight(view) {
        if (view.window && !view.hidden) {
            return utils.layout.toDevicePixels(view.frame.size.height);
        }
        return 0;
    }
    ios.getActualHeight = getActualHeight;
    function getStatusBarHeight(viewController) {
        var app = UIApplication.sharedApplication;
        if (!app || app.statusBarHidden) {
            return 0;
        }
        if (viewController && viewController.prefersStatusBarHidden) {
            return 0;
        }
        var statusFrame = app.statusBarFrame;
        var min = Math.min(statusFrame.size.width, statusFrame.size.height);
        return utils.layout.toDevicePixels(min);
    }
    ios.getStatusBarHeight = getStatusBarHeight;
})(ios = exports.ios || (exports.ios = {}));
//# sourceMappingURL=utils.ios.js.map