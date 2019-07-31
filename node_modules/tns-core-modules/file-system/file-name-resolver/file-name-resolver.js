Object.defineProperty(exports, "__esModule", { value: true });
var platform_1 = require("../../platform");
var file_system_1 = require("../file-system");
var trace = require("../../trace");
var appCommonModule = require("../../application/application-common");
var qualifier_matcher_1 = require("../../module-name-resolver/qualifier-matcher/qualifier-matcher");
var FileNameResolver = (function () {
    function FileNameResolver(context) {
        this._cache = {};
        console.log("FileNameResolver is deprecated; use ModuleNameResolver instead");
        this._context = context;
    }
    FileNameResolver.prototype.resolveFileName = function (path, ext) {
        var key = path + ext;
        var result = this._cache[key];
        if (result === undefined) {
            result = this.resolveFileNameImpl(path, ext);
            this._cache[key] = result;
        }
        return result;
    };
    FileNameResolver.prototype.clearCache = function () {
        this._cache = {};
    };
    FileNameResolver.prototype.resolveFileNameImpl = function (path, ext) {
        var result = null;
        path = file_system_1.path.normalize(path);
        ext = "." + ext;
        var candidates = this.getFileCandidatesFromFolder(path, ext);
        result = qualifier_matcher_1.findMatch(path, ext, candidates, this._context);
        return result;
    };
    FileNameResolver.prototype.getFileCandidatesFromFolder = function (path, ext) {
        var candidates = new Array();
        var folderPath = path.substring(0, path.lastIndexOf(file_system_1.path.separator) + 1);
        if (file_system_1.Folder.exists(folderPath)) {
            var folder = file_system_1.Folder.fromPath(folderPath);
            folder.eachEntity(function (e) {
                if (e instanceof file_system_1.File) {
                    var file = e;
                    if (file.path.indexOf(path) === 0 && file.extension === ext) {
                        candidates.push(file.path);
                    }
                }
                return true;
            });
        }
        else {
            if (trace.isEnabled()) {
                trace.write("Could not find folder " + folderPath + " when loading " + path + ext, trace.categories.Navigation);
            }
        }
        return candidates;
    };
    FileNameResolver = __decorate([
        Deprecated
    ], FileNameResolver);
    return FileNameResolver;
}());
exports.FileNameResolver = FileNameResolver;
var resolverInstance;
function resolveFileName(path, ext) {
    if (!resolverInstance) {
        resolverInstance = new FileNameResolver({
            width: platform_1.screen.mainScreen.widthDIPs,
            height: platform_1.screen.mainScreen.heightDIPs,
            os: platform_1.device.os,
            deviceType: platform_1.device.deviceType
        });
    }
    return resolverInstance.resolveFileName(path, ext);
}
exports.resolveFileName = resolveFileName;
function clearCache() {
    if (resolverInstance) {
        resolverInstance.clearCache();
    }
}
exports.clearCache = clearCache;
appCommonModule.on("cssChanged", function (args) { return resolverInstance = undefined; });
appCommonModule.on("livesync", function (args) { return clearCache(); });
//# sourceMappingURL=file-name-resolver.js.map