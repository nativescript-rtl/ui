Object.defineProperty(exports, "__esModule", { value: true });
var Common = require("./application-settings-common");
var utils = require("../utils/utils");
var userDefaults = NSUserDefaults.standardUserDefaults;
function hasKey(key) {
    Common.checkKey(key);
    return userDefaults.objectForKey(key) !== null;
}
exports.hasKey = hasKey;
function getBoolean(key, defaultValue) {
    Common.checkKey(key);
    if (hasKey(key)) {
        return userDefaults.boolForKey(key);
    }
    return defaultValue;
}
exports.getBoolean = getBoolean;
function getString(key, defaultValue) {
    Common.checkKey(key);
    if (hasKey(key)) {
        return userDefaults.stringForKey(key);
    }
    return defaultValue;
}
exports.getString = getString;
function getNumber(key, defaultValue) {
    Common.checkKey(key);
    if (hasKey(key)) {
        return userDefaults.doubleForKey(key);
    }
    return defaultValue;
}
exports.getNumber = getNumber;
function setBoolean(key, value) {
    Common.checkKey(key);
    Common.ensureValidValue(value, "boolean");
    userDefaults.setBoolForKey(value, key);
}
exports.setBoolean = setBoolean;
function setString(key, value) {
    Common.checkKey(key);
    Common.ensureValidValue(value, "string");
    userDefaults.setObjectForKey(value, key);
}
exports.setString = setString;
function setNumber(key, value) {
    Common.checkKey(key);
    Common.ensureValidValue(value, "number");
    userDefaults.setDoubleForKey(value, key);
}
exports.setNumber = setNumber;
function remove(key) {
    Common.checkKey(key);
    userDefaults.removeObjectForKey(key);
}
exports.remove = remove;
function clear() {
    userDefaults.removePersistentDomainForName(NSBundle.mainBundle.bundleIdentifier);
}
exports.clear = clear;
function flush() {
    return userDefaults.synchronize();
}
exports.flush = flush;
function getAllKeys() {
    return utils.ios.collections.nsArrayToJSArray(userDefaults.dictionaryRepresentation().allKeys);
}
exports.getAllKeys = getAllKeys;
//# sourceMappingURL=application-settings.ios.js.map