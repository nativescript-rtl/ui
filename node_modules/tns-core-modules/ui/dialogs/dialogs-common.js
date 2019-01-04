Object.defineProperty(exports, "__esModule", { value: true });
exports.STRING = "string";
exports.PROMPT = "Prompt";
exports.CONFIRM = "Confirm";
exports.ALERT = "Alert";
exports.LOGIN = "Login";
exports.OK = "OK";
exports.CANCEL = "Cancel";
var inputType;
(function (inputType) {
    inputType.text = "text";
    inputType.password = "password";
    inputType.email = "email";
})(inputType = exports.inputType || (exports.inputType = {}));
var frame;
function getCurrentPage() {
    if (!frame) {
        frame = require("ui/frame");
    }
    var topmostFrame = frame.topmost();
    if (topmostFrame) {
        return topmostFrame.currentPage;
    }
    return undefined;
}
exports.getCurrentPage = getCurrentPage;
function applySelectors(view, callback) {
    var currentPage = getCurrentPage();
    if (currentPage) {
        var styleScope = currentPage._styleScope;
        if (styleScope) {
            view._inheritStyleScope(styleScope);
            view.onLoaded();
            callback(view);
            view.onUnloaded();
        }
    }
}
var button;
var label;
var textField;
function getButtonColors() {
    if (!button) {
        var Button = require("ui/button").Button;
        button = new Button;
    }
    var buttonColor;
    var buttonBackgroundColor;
    applySelectors(button, function (btn) {
        buttonColor = btn.color;
        buttonBackgroundColor = btn.backgroundColor;
    });
    return { color: buttonColor, backgroundColor: buttonBackgroundColor };
}
exports.getButtonColors = getButtonColors;
function getLabelColor() {
    if (!label) {
        var Label = require("ui/label").Label;
        label = new Label;
    }
    var labelColor;
    applySelectors(label, function (lbl) {
        labelColor = lbl.color;
    });
    return labelColor;
}
exports.getLabelColor = getLabelColor;
function getTextFieldColor() {
    if (!textField) {
        var TextField = require("ui/text-field").TextField;
        textField = new TextField();
    }
    var textFieldColor;
    applySelectors(textField, function (tf) {
        textFieldColor = tf.color;
    });
    return textFieldColor;
}
exports.getTextFieldColor = getTextFieldColor;
function isDialogOptions(arg) {
    return arg && (arg.message || arg.title);
}
exports.isDialogOptions = isDialogOptions;
//# sourceMappingURL=dialogs-common.js.map