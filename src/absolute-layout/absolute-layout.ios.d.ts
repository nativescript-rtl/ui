import { Common } from "./absolute-layout.common";
import { View } from "@nativescript/core/ui";
export declare class AbsoluteLayout extends Common {
    initNativeView(): void;
    addChild(view: View): void;
    removeChild(view: View): void;
    private _updateDirection;
}
