import { Common } from "./wrap-layout.common";
import { View } from "tns-core-modules/ui/core/view/view";
export declare class WrapLayout extends Common {
    initNativeView(): void;
    addChild(view: View): void;
    removeChild(view: View): void;
    private _updateDirection;
}
