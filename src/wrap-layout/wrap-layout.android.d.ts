import { Common } from "./wrap-layout.common";
import { View } from "@nativescript/core/ui";
export * from "./wrap-layout.common";
export declare class WrapLayout extends Common {
    initNativeView(): void;
    addChild(view: View): void;
    removeChild(view: View): void;
    protected _updateDirection;
}
