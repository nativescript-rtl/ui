Object.defineProperty(exports, "__esModule", { value: true });
function checkKey(key) {
    if (typeof key !== "string") {
        throw new Error("key: '" + key + "' must be a string");
    }
}
exports.checkKey = checkKey;
function ensureValidValue(value, valueType) {
    if (typeof value !== valueType) {
        throw new Error("value: '" + value + "' must be a " + valueType);
    }
}
exports.ensureValidValue = ensureValidValue;
//# sourceMappingURL=application-settings-common.js.map