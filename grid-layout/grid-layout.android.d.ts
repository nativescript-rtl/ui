import { Common } from "./grid-layout.common";
import { View } from "tns-core-modules/ui/page/page";
export declare class GridLayout extends Common {
    initNativeView(): void;
    addChild(view: View): void;
    removeChild(view: View): void;
    private _updateDirection;
}
