"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var page_1 = require("tns-core-modules/ui/page/page");
if (page_1.isAndroid) {
    exports.GridLayout = require("./grid-layout/grid-layout.android").GridLayout;
    exports.WrapLayout = require("./wrap-layout/wrap-layout.android").WrapLayout;
    exports.AbsoluteLayout = require("./absolute-layout/absolute-layout.android").AbsoluteLayout;
    exports.DockLayout = require("./dock-layout/dock-layout.android").DockLayout;
    exports.StackLayout = require("./stack-layout/stack-layout.android").StackLayout;
}
else if (page_1.isIOS) {
    exports.GridLayout = require("./grid-layout/grid-layout.ios").GridLayout;
    exports.WrapLayout = require("./wrap-layout/wrap-layout.ios").WrapLayout;
    exports.AbsoluteLayout = require("./absolute-layout/absolute-layout.ios").AbsoluteLayout;
    exports.DockLayout = require("./dock-layout/dock-layout.ios").DockLayout;
    exports.StackLayout = require("./stack-layout/stack-layout.ios").StackLayout;
}
//# sourceMappingURL=main.js.map