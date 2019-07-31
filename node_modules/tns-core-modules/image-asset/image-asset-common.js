Object.defineProperty(exports, "__esModule", { value: true });
var observable_1 = require("../data/observable");
var platform_1 = require("../platform");
var ImageAssetBase = (function (_super) {
    __extends(ImageAssetBase, _super);
    function ImageAssetBase() {
        var _this = _super.call(this) || this;
        _this._options = { keepAspectRatio: true, autoScaleFactor: true };
        return _this;
    }
    Object.defineProperty(ImageAssetBase.prototype, "options", {
        get: function () {
            return this._options;
        },
        set: function (value) {
            this._options = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageAssetBase.prototype, "nativeImage", {
        get: function () {
            return this._nativeImage;
        },
        set: function (value) {
            this._nativeImage = value;
        },
        enumerable: true,
        configurable: true
    });
    ImageAssetBase.prototype.getImageAsync = function (callback) {
    };
    return ImageAssetBase;
}(observable_1.Observable));
exports.ImageAssetBase = ImageAssetBase;
function getAspectSafeDimensions(sourceWidth, sourceHeight, reqWidth, reqHeight) {
    var widthCoef = sourceWidth / reqWidth;
    var heightCoef = sourceHeight / reqHeight;
    var aspectCoef = Math.min(widthCoef, heightCoef);
    return {
        width: Math.floor(sourceWidth / aspectCoef),
        height: Math.floor(sourceHeight / aspectCoef)
    };
}
exports.getAspectSafeDimensions = getAspectSafeDimensions;
function getRequestedImageSize(src, options) {
    var screen = platform_1.screen.mainScreen;
    var reqWidth = options.width || Math.min(src.width, screen.widthPixels);
    var reqHeight = options.height || Math.min(src.height, screen.heightPixels);
    if (options && options.keepAspectRatio) {
        var safeAspectSize = getAspectSafeDimensions(src.width, src.height, reqWidth, reqHeight);
        reqWidth = safeAspectSize.width;
        reqHeight = safeAspectSize.height;
    }
    return {
        width: reqWidth,
        height: reqHeight
    };
}
exports.getRequestedImageSize = getRequestedImageSize;
//# sourceMappingURL=image-asset-common.js.map