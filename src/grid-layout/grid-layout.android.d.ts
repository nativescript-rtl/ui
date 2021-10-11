import { Common } from "./grid-layout.common";
import { View } from "@nativescript/core/ui";
export declare class GridLayout extends Common {
    initNativeView(): void;
    addChild(view: View): void;
    removeChild(view: View): void;
    protected _updateDirection;
}
