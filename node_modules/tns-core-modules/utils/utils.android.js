function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var trace_1 = require("../trace");
var utils_common_1 = require("./utils-common");
__export(require("./utils-common"));
var application_1 = require("../application");
var platform_1 = require("../platform");
var file_system_access_1 = require("../file-system/file-system-access");
var MIN_URI_SHARE_RESTRICTED_APK_VERSION = 24;
var layout;
(function (layout) {
    var density;
    var MODE_SHIFT = 30;
    var MODE_MASK = 0x3 << MODE_SHIFT;
    var sdkVersion;
    var useOldMeasureSpec = false;
    function makeMeasureSpec(size, mode) {
        if (sdkVersion === undefined) {
            sdkVersion = ad.getApplicationContext().getApplicationInfo().targetSdkVersion;
            useOldMeasureSpec = sdkVersion <= android.os.Build.VERSION_CODES.JELLY_BEAN_MR1;
        }
        if (useOldMeasureSpec) {
            return size + mode;
        }
        return (size & ~MODE_MASK) | (mode & MODE_MASK);
    }
    layout.makeMeasureSpec = makeMeasureSpec;
    function getDisplayDensity() {
        if (density === undefined) {
            density = ad.getResources().getDisplayMetrics().density;
        }
        return density;
    }
    layout.getDisplayDensity = getDisplayDensity;
    function toDevicePixels(value) {
        return value * getDisplayDensity();
    }
    layout.toDevicePixels = toDevicePixels;
    function toDeviceIndependentPixels(value) {
        return value / getDisplayDensity();
    }
    layout.toDeviceIndependentPixels = toDeviceIndependentPixels;
    function measureNativeView(nativeView, width, widthMode, height, heightMode) {
        var view = nativeView;
        view.measure(makeMeasureSpec(width, widthMode), makeMeasureSpec(height, heightMode));
        return {
            width: view.getMeasuredWidth(),
            height: view.getMeasuredHeight()
        };
    }
    layout.measureNativeView = measureNativeView;
})(layout = exports.layout || (exports.layout = {}));
Object.assign(layout, utils_common_1.layoutCommon);
var ad;
(function (ad) {
    var application;
    var applicationContext;
    var contextResources;
    var packageName;
    function getApplicationContext() {
        if (!applicationContext) {
            applicationContext = getApplication().getApplicationContext();
        }
        return applicationContext;
    }
    ad.getApplicationContext = getApplicationContext;
    function getApplication() {
        if (!application) {
            application = application_1.getNativeApplication();
        }
        return application;
    }
    ad.getApplication = getApplication;
    function getResources() {
        if (!contextResources) {
            contextResources = getApplication().getResources();
        }
        return contextResources;
    }
    ad.getResources = getResources;
    function getPackageName() {
        if (!packageName) {
            packageName = getApplicationContext().getPackageName();
        }
        return packageName;
    }
    var inputMethodManager;
    function getInputMethodManager() {
        if (!inputMethodManager) {
            inputMethodManager = getApplicationContext().getSystemService(android.content.Context.INPUT_METHOD_SERVICE);
        }
        return inputMethodManager;
    }
    ad.getInputMethodManager = getInputMethodManager;
    function showSoftInput(nativeView) {
        var inputManager = getInputMethodManager();
        if (inputManager && nativeView instanceof android.view.View) {
            inputManager.showSoftInput(nativeView, android.view.inputmethod.InputMethodManager.SHOW_IMPLICIT);
        }
    }
    ad.showSoftInput = showSoftInput;
    function dismissSoftInput(nativeView) {
        var inputManager = getInputMethodManager();
        var windowToken;
        if (nativeView instanceof android.view.View) {
            windowToken = nativeView.getWindowToken();
        }
        else if (application_1.android.foregroundActivity instanceof androidx.appcompat.app.AppCompatActivity) {
            var decorView = application_1.android.foregroundActivity.getWindow().getDecorView();
            windowToken = decorView ? decorView.getWindowToken() : null;
        }
        if (inputManager && windowToken) {
            inputManager.hideSoftInputFromWindow(windowToken, 0);
        }
    }
    ad.dismissSoftInput = dismissSoftInput;
    var collections;
    (function (collections) {
        function stringArrayToStringSet(str) {
            var hashSet = new java.util.HashSet();
            if (str !== undefined) {
                for (var element in str) {
                    hashSet.add("" + str[element]);
                }
            }
            return hashSet;
        }
        collections.stringArrayToStringSet = stringArrayToStringSet;
        function stringSetToStringArray(stringSet) {
            var arr = [];
            if (stringSet !== undefined) {
                var it_1 = stringSet.iterator();
                while (it_1.hasNext()) {
                    var element = "" + it_1.next();
                    arr.push(element);
                }
            }
            return arr;
        }
        collections.stringSetToStringArray = stringSetToStringArray;
    })(collections = ad.collections || (ad.collections = {}));
    var resources;
    (function (resources_1) {
        var attr;
        var attrCache = new Map();
        function getDrawableId(name) {
            return getId(":drawable/" + name);
        }
        resources_1.getDrawableId = getDrawableId;
        function getStringId(name) {
            return getId(":string/" + name);
        }
        resources_1.getStringId = getStringId;
        function getId(name) {
            var resources = getResources();
            var packageName = getPackageName();
            var uri = packageName + name;
            return resources.getIdentifier(uri, null, null);
        }
        resources_1.getId = getId;
        function getPalleteColor(name, context) {
            return getPaletteColor(name, context);
        }
        resources_1.getPalleteColor = getPalleteColor;
        function getPaletteColor(name, context) {
            if (attrCache.has(name)) {
                return attrCache.get(name);
            }
            var result = 0;
            try {
                if (!attr) {
                    attr = java.lang.Class.forName("androidx.appcompat.R$attr");
                }
                var colorID = 0;
                var field = attr.getField(name);
                if (field) {
                    colorID = field.getInt(null);
                }
                if (colorID) {
                    var typedValue = new android.util.TypedValue();
                    context.getTheme().resolveAttribute(colorID, typedValue, true);
                    result = typedValue.data;
                }
            }
            catch (ex) {
                trace_1.write("Cannot get pallete color: " + name, trace_1.categories.Error, trace_1.messageType.error);
            }
            attrCache.set(name, result);
            return result;
        }
        resources_1.getPaletteColor = getPaletteColor;
    })(resources = ad.resources || (ad.resources = {}));
})(ad = exports.ad || (exports.ad = {}));
function GC() {
    gc();
}
exports.GC = GC;
function releaseNativeObject(object) {
    __releaseNativeCounterpart(object);
}
exports.releaseNativeObject = releaseNativeObject;
function openUrl(location) {
    var context = ad.getApplicationContext();
    try {
        var intent = new android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse(location.trim()));
        intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent);
    }
    catch (e) {
        trace_1.write("Error in OpenURL", trace_1.categories.Error, trace_1.messageType.error);
        return false;
    }
    return true;
}
exports.openUrl = openUrl;
function isExternalStorageReadOnly() {
    var extStorageState = android.os.Environment.getExternalStorageState();
    if (android.os.Environment.MEDIA_MOUNTED_READ_ONLY === extStorageState) {
        return true;
    }
    return false;
}
function isExternalStorageAvailable() {
    var extStorageState = android.os.Environment.getExternalStorageState();
    if (android.os.Environment.MEDIA_MOUNTED === extStorageState) {
        return true;
    }
    return false;
}
function getMimeTypeNameFromExtension(filePath) {
    var mimeTypeMap = android.webkit.MimeTypeMap.getSingleton();
    var extension = new file_system_access_1.FileSystemAccess()
        .getFileExtension(filePath)
        .replace(".", "")
        .toLowerCase();
    return mimeTypeMap.getMimeTypeFromExtension(extension);
}
function openFile(filePath) {
    var context = ad.getApplicationContext();
    try {
        if (!isExternalStorageAvailable()) {
            trace_1.write("\nExternal storage is unavailable (please check app permissions).\nApplications cannot access internal storage of other application on Android (see: https://developer.android.com/guide/topics/data/data-storage).\n", trace_1.categories.Error, trace_1.messageType.error);
            return false;
        }
        if (isExternalStorageReadOnly()) {
            trace_1.write("External storage is read only", trace_1.categories.Error, trace_1.messageType.error);
            return false;
        }
        var mimeType = getMimeTypeNameFromExtension(filePath);
        var intent = new android.content.Intent(android.content.Intent.ACTION_VIEW);
        var chooserIntent = android.content.Intent.createChooser(intent, "Open File...");
        intent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
        chooserIntent.addFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
        var sdkVersion = parseInt(platform_1.device.sdkVersion, 10);
        if (sdkVersion && sdkVersion < MIN_URI_SHARE_RESTRICTED_APK_VERSION) {
            trace_1.write("detected sdk version " + sdkVersion + " (< " + MIN_URI_SHARE_RESTRICTED_APK_VERSION + "), using simple openFile", trace_1.categories.Debug);
            intent.setDataAndType(android.net.Uri.fromFile(new java.io.File(filePath)), mimeType);
            context.startActivity(chooserIntent);
            return true;
        }
        trace_1.write("detected sdk version " + sdkVersion + " (>= " + MIN_URI_SHARE_RESTRICTED_APK_VERSION + "), using URI openFile", trace_1.categories.Debug);
        var providerName = context.getPackageName() + ".provider";
        trace_1.write("fully-qualified provider name [" + providerName + "]", trace_1.categories.Debug);
        var apkURI = androidx.core.content.FileProvider.getUriForFile(context, providerName, new java.io.File(filePath));
        intent.addFlags(android.content.Intent.FLAG_GRANT_READ_URI_PERMISSION);
        chooserIntent.addFlags(android.content.Intent.FLAG_GRANT_READ_URI_PERMISSION);
        intent.setDataAndType(apkURI, mimeType);
        context.startActivity(chooserIntent);
        return true;
    }
    catch (err) {
        var msg_1 = err.message ? ": " + err.message : "";
        trace_1.write("Error in openFile" + msg_1, trace_1.categories.Error, trace_1.messageType.error);
        if (msg_1 &&
            msg_1.includes("Attempt to invoke virtual method") &&
            msg_1.includes("android.content.pm.ProviderInfo.loadXmlMetaData") &&
            msg_1.includes("on a null object reference")) {
            trace_1.write("\nPlease ensure you have your manifest correctly configured with the FileProvider.\n(see: https://developer.android.com/reference/android/support/v4/content/FileProvider#ProviderDefinition)\n", trace_1.categories.Error);
        }
        return false;
    }
}
exports.openFile = openFile;
//# sourceMappingURL=utils.android.js.map