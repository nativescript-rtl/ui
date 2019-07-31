function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var image_asset_common_1 = require("./image-asset-common");
var file_system_1 = require("../file-system");
__export(require("./image-asset-common"));
var ImageAsset = (function (_super) {
    __extends(ImageAsset, _super);
    function ImageAsset(asset) {
        var _this = _super.call(this) || this;
        if (typeof asset === "string") {
            if (asset.indexOf("~/") === 0) {
                asset = file_system_1.path.join(file_system_1.knownFolders.currentApp().path, asset.replace("~/", ""));
            }
            _this.nativeImage = UIImage.imageWithContentsOfFile(asset);
        }
        else if (asset instanceof UIImage) {
            _this.nativeImage = asset;
        }
        else {
            _this.ios = asset;
        }
        return _this;
    }
    Object.defineProperty(ImageAsset.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        set: function (value) {
            this._ios = value;
        },
        enumerable: true,
        configurable: true
    });
    ImageAsset.prototype.getImageAsync = function (callback) {
        var _this = this;
        if (!this.ios && !this.nativeImage) {
            callback(null, "Asset cannot be found.");
        }
        var srcWidth = this.nativeImage ? this.nativeImage.size.width : this.ios.pixelWidth;
        var srcHeight = this.nativeImage ? this.nativeImage.size.height : this.ios.pixelHeight;
        var requestedSize = image_asset_common_1.getRequestedImageSize({ width: srcWidth, height: srcHeight }, this.options);
        if (this.nativeImage) {
            var newSize = CGSizeMake(requestedSize.width, requestedSize.height);
            var resizedImage = this.scaleImage(this.nativeImage, newSize);
            callback(resizedImage, null);
            return;
        }
        var imageRequestOptions = PHImageRequestOptions.alloc().init();
        imageRequestOptions.deliveryMode = 1;
        imageRequestOptions.networkAccessAllowed = true;
        PHImageManager.defaultManager().requestImageForAssetTargetSizeContentModeOptionsResultHandler(this.ios, requestedSize, 0, imageRequestOptions, function (image, imageResultInfo) {
            if (image) {
                var resultImage = _this.scaleImage(image, requestedSize);
                callback(resultImage, null);
            }
            else {
                callback(null, imageResultInfo.valueForKey(PHImageErrorKey));
            }
        });
    };
    ImageAsset.prototype.scaleImage = function (image, requestedSize) {
        var scaleFactor = this.options && this.options.autoScaleFactor === false ? 1.0 : 0.0;
        UIGraphicsBeginImageContextWithOptions(requestedSize, false, scaleFactor);
        image.drawInRect(CGRectMake(0, 0, requestedSize.width, requestedSize.height));
        var resultImage = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
        return resultImage;
    };
    return ImageAsset;
}(image_asset_common_1.ImageAssetBase));
exports.ImageAsset = ImageAsset;
//# sourceMappingURL=image-asset.ios.js.map