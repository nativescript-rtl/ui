import { Common } from "./grid-layout.common";
import { View } from "tns-core-modules/ui/page/page";

export class GridLayout extends Common {
    createNativeView(): object {
        let view: any = super.createNativeView();
        view.setRotationY(180);
        setTimeout(() => {
            for (let viewIndex = 0; viewIndex < this["getChildrenCount"](); viewIndex++) {
                let NSView: View = this["getChildAt"](viewIndex);
                NSView.nativeView.setRotationY(180);
            }
        }, 1);
        return view;
    }
}
