import { Common } from "./dock-layout.common";
import { View } from "@nativescript/core/ui";
export declare class DockLayout extends Common {
    initNativeView(): void;
    addChild(view: View): void;
    removeChild(view: View): void;
    private _updateDirection;
}
