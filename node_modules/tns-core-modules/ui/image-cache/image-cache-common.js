Object.defineProperty(exports, "__esModule", { value: true });
var observable = require("../../data/observable");
var Cache = (function (_super) {
    __extends(Cache, _super);
    function Cache() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.maxRequests = 5;
        _this._enabled = true;
        _this._pendingDownloads = {};
        _this._queue = [];
        _this._currentDownloads = 0;
        return _this;
    }
    Cache.prototype.enableDownload = function () {
        if (this._enabled) {
            return;
        }
        this._enabled = true;
        var request;
        while (this._queue.length > 0 && this._currentDownloads < this.maxRequests) {
            request = this._queue.pop();
            if (!(request.key in this._pendingDownloads)) {
                this._download(request);
            }
        }
    };
    Cache.prototype.disableDownload = function () {
        if (!this._enabled) {
            return;
        }
        this._enabled = false;
    };
    Cache.prototype.push = function (request) {
        this._addRequest(request, true);
    };
    Cache.prototype.enqueue = function (request) {
        this._addRequest(request, false);
    };
    Cache.prototype._addRequest = function (request, onTop) {
        if (request.key in this._pendingDownloads) {
            var existingRequest = this._pendingDownloads[request.key];
            this._mergeRequests(existingRequest, request);
        }
        else {
            var queueRequest = void 0;
            for (var i = 0; i < this._queue.length; i++) {
                if (this._queue[i].key === request.key) {
                    queueRequest = this._queue[i];
                    break;
                }
            }
            if (queueRequest) {
                this._mergeRequests(queueRequest, request);
            }
            else {
                if (this._shouldDownload(request, onTop)) {
                    this._download(request);
                }
            }
        }
    };
    Cache.prototype._mergeRequests = function (existingRequest, newRequest) {
        if (existingRequest.completed) {
            if (newRequest.completed) {
                var existingCompleted_1 = existingRequest.completed;
                var stackCompleted = function (result, key) {
                    existingCompleted_1(result, key);
                    newRequest.completed(result, key);
                };
                existingRequest.completed = stackCompleted;
            }
        }
        else {
            existingRequest.completed = newRequest.completed;
        }
        if (existingRequest.error) {
            if (newRequest.error) {
                var existingError_1 = existingRequest.error;
                var stackError = function (key) {
                    existingError_1(key);
                    newRequest.error(key);
                };
                existingRequest.error = stackError;
            }
        }
        else {
            existingRequest.error = newRequest.error;
        }
    };
    Cache.prototype.get = function (key) {
        throw new Error("Abstract");
    };
    Cache.prototype.set = function (key, image) {
        throw new Error("Abstract");
    };
    Cache.prototype.remove = function (key) {
        throw new Error("Abstract");
    };
    Cache.prototype.clear = function () {
        throw new Error("Abstract");
    };
    Cache.prototype._downloadCore = function (request) {
        throw new Error("Abstract");
    };
    Cache.prototype._onDownloadCompleted = function (key, image) {
        var request = this._pendingDownloads[key];
        this.set(request.key, image);
        this._currentDownloads--;
        if (request.completed) {
            request.completed(image, request.key);
        }
        if (this.hasListeners(Cache.downloadedEvent)) {
            this.notify({
                eventName: Cache.downloadedEvent,
                object: this,
                key: key,
                image: image
            });
        }
        delete this._pendingDownloads[request.key];
        this._updateQueue();
    };
    Cache.prototype._onDownloadError = function (key, err) {
        var request = this._pendingDownloads[key];
        this._currentDownloads--;
        if (request.error) {
            request.error(request.key);
        }
        if (this.hasListeners(Cache.downloadErrorEvent)) {
            this.notify({
                eventName: Cache.downloadErrorEvent,
                object: this,
                key: key,
                error: err
            });
        }
        delete this._pendingDownloads[request.key];
        this._updateQueue();
    };
    Cache.prototype._shouldDownload = function (request, onTop) {
        if (this.get(request.key) || request.key in this._pendingDownloads) {
            return false;
        }
        if (this._currentDownloads >= this.maxRequests || !this._enabled) {
            if (onTop) {
                this._queue.push(request);
            }
            else {
                this._queue.unshift(request);
            }
            return false;
        }
        return true;
    };
    Cache.prototype._download = function (request) {
        this._currentDownloads++;
        this._pendingDownloads[request.key] = request;
        this._downloadCore(request);
    };
    Cache.prototype._updateQueue = function () {
        if (!this._enabled || this._queue.length === 0 || this._currentDownloads === this.maxRequests) {
            return;
        }
        var request = this._queue.pop();
        this._download(request);
    };
    Cache.downloadedEvent = "downloaded";
    Cache.downloadErrorEvent = "downloadError";
    return Cache;
}(observable.Observable));
exports.Cache = Cache;
//# sourceMappingURL=image-cache-common.js.map