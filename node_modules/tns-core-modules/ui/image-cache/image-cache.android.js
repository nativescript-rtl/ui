Object.defineProperty(exports, "__esModule", { value: true });
var common = require("./image-cache-common");
var trace = require("../../trace");
var LruBitmapCacheClass;
function ensureLruBitmapCacheClass() {
    if (LruBitmapCacheClass) {
        return;
    }
    var LruBitmapCache = (function (_super) {
        __extends(LruBitmapCache, _super);
        function LruBitmapCache(cacheSize) {
            var _this = _super.call(this, cacheSize) || this;
            return global.__native(_this);
        }
        LruBitmapCache.prototype.sizeOf = function (key, bitmap) {
            var result = Math.round(bitmap.getByteCount() / 1024);
            return result;
        };
        return LruBitmapCache;
    }(android.util.LruCache));
    LruBitmapCacheClass = LruBitmapCache;
}
var Cache = (function (_super) {
    __extends(Cache, _super);
    function Cache() {
        var _this = _super.call(this) || this;
        ensureLruBitmapCacheClass();
        var maxMemory = java.lang.Runtime.getRuntime().maxMemory() / 1024;
        var cacheSize = maxMemory / 8;
        _this._cache = new LruBitmapCacheClass(cacheSize);
        var that = new WeakRef(_this);
        _this._callback = new org.nativescript.widgets.Async.CompleteCallback({
            onComplete: function (result, context) {
                var instance = that.get();
                if (instance) {
                    if (result) {
                        instance._onDownloadCompleted(context, result);
                    }
                    else {
                        instance._onDownloadError(context, new Error("No result in CompletionCallback"));
                    }
                }
            },
            onError: function (err, context) {
                var instance = that.get();
                if (instance) {
                    instance._onDownloadError(context, new Error(err));
                }
            }
        });
        return _this;
    }
    Cache.prototype._downloadCore = function (request) {
        org.nativescript.widgets.Async.Image.download(request.url, this._callback, request.key);
    };
    Cache.prototype.get = function (key) {
        var result = this._cache.get(key);
        return result;
    };
    Cache.prototype.set = function (key, image) {
        try {
            if (key && image) {
                this._cache.put(key, image);
            }
        }
        catch (err) {
            trace.write("Cache set error: " + err, trace.categories.Error, trace.messageType.error);
        }
    };
    Cache.prototype.remove = function (key) {
        this._cache.remove(key);
    };
    Cache.prototype.clear = function () {
        this._cache.evictAll();
    };
    return Cache;
}(common.Cache));
exports.Cache = Cache;
//# sourceMappingURL=image-cache.android.js.map