import { isAndroid, isIOS } from "tns-core-modules/ui/page/page";

if(isAndroid) {
    exports.GridLayout = require("./grid-layout/grid-layout.android").GridLayout;
    exports.WrapLayout = require("./wrap-layout/wrap-layout.android").WrapLayout;
    exports.AbsoluteLayout = require("./absolute-layout/absolute-layout.android").AbsoluteLayout;
    exports.DockLayout = require("./dock-layout/dock-layout.android").DockLayout;
    exports.StackLayout = require("./stack-layout/stack-layout.android").StackLayout;
} else if (isIOS) {
    exports.GridLayout = require("./grid-layout/grid-layout.ios").GridLayout;
    exports.WrapLayout = require("./wrap-layout/wrap-layout.ios").WrapLayout;
    exports.AbsoluteLayout = require("./absolute-layout/absolute-layout.ios").AbsoluteLayout;
    exports.DockLayout = require("./dock-layout/dock-layout.ios").DockLayout;
    exports.StackLayout = require("./stack-layout/stack-layout.ios").StackLayout;
}