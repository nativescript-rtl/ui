# @nativescript-rtl/ui
Add right-to-left UI support to NativeScript framework
## Installation
to install plugin write:
```bash
tns plugin add @nativescript-rtl/ui
```

## Preview
| LTR | Layout | RTL |
| :---         |     :---:      |          ---: |
| <img alt="screenshot 1" src="https://raw.githubusercontent.com/nativescript-rtl/ui/master/screenshots/screenshot-ltr-1.png" width="170"> | `AbsoluteLayout` | <img alt="screenshot 1" src="https://raw.githubusercontent.com/nativescript-rtl/ui/master/screenshots/screenshot-rtl-1.png" width="170"> |
| <img alt="screenshot 2" src="https://raw.githubusercontent.com/nativescript-rtl/ui/master/screenshots/screenshot-ltr-2.png" width="170"> | `DockLayout` | <img alt="screenshot 2" src="https://raw.githubusercontent.com/nativescript-rtl/ui/master/screenshots/screenshot-rtl-2.png" width="170"> |
| <img alt="screenshot 3" src="https://raw.githubusercontent.com/nativescript-rtl/ui/master/screenshots/screenshot-ltr-3.png" width="170"> | `GridLayout` | <img alt="screenshot 3" src="https://raw.githubusercontent.com/nativescript-rtl/ui/master/screenshots/screenshot-rtl-3.png" width="170"> |
| <img alt="screenshot 4" src="https://raw.githubusercontent.com/nativescript-rtl/ui/master/screenshots/screenshot-ltr-4.png" width="170"> | `StackLayout` | <img alt="screenshot 4" src="https://raw.githubusercontent.com/nativescript-rtl/ui/master/screenshots/screenshot-rtl-4.png" width="170"> |
| <img alt="screenshot 5" src="https://raw.githubusercontent.com/nativescript-rtl/ui/master/screenshots/screenshot-ltr-5.png" width="170"> | `WrapLayout` | <img alt="screenshot 5" src="https://raw.githubusercontent.com/nativescript-rtl/ui/master/screenshots/screenshot-rtl-5.png" width="170"> |

## Properties
| Name | Default | Description |
| :-- | :----- | :--------- |
| isRtl | `true` | `isRtl` use to change layout direction by default is `true` that mean layout from right to left but you can change it to `false` that change layout direction from left to right |

## CSS Properties
| Name | Default | Description |
| :-- | :----- | :--------- |
| direction | `rtl` | use to change layout direction by default is `rtl` that mean layout from right to left but you can change it to `ltr` that change layout to direction from left to right |

## How to use
declare plugin in XML then use it.
```xml
<Page xmlns="http://schemas.nativescript.org/tns.xsd" xmlns:rtl="@nativescript-rtl/ui">
  <rtl:WrapLayout orientation="horizontal" width="210" height="210" backgroundColor="lightgray">
    <Label text="Label 1" width="70" height="70" backgroundColor="red"/>
    <Label text="Label 2" width="70" height="70" backgroundColor="green"/>
    <Label text="Label 3" width="70" height="70" backgroundColor="blue"/>
    <Label text="Label 4" width="70" height="70" backgroundColor="yellow"/>
  </rtl:WrapLayout>
</Page>
```

For Angular/Vue 'registerElement` must be used to register each RTL element

example:
register elements in `app.module.ts`
```ts
import { registerElement } from "nativescript-angular/element-registry";
registerElement(
  "RGridLayout",
  () => require("@nativescript-rtl/ui").GridLayout
);
registerElement(
  "RWrapLayout",
  () => require("@nativescript-rtl/ui").WrapLayout
);
registerElement(
  "RAbsoluteLayout",
  () => require("@nativescript-rtl/ui").AbsoluteLayout
);
registerElement(
  "RDockLayout",
  () => require("@nativescript-rtl/ui").DockLayout
);
registerElement(
  "RStackLayout",
  () => require("@nativescript-rtl/ui").StackLayout
);
```
now you can use `RGridLayout`, `RWrapLayout`, `RAbsoluteLayout`, `RDockLayout` and `RStackLayout` in your angular project

example:
```xml
  <RWrapLayout orientation="horizontal" width="210" height="210" backgroundColor="lightgray">
    <Label text="Label 1" width="70" height="70" backgroundColor="red"></Label>
    <Label text="Label 2" width="70" height="70" backgroundColor="green"></Label>
    <Label text="Label 3" width="70" height="70" backgroundColor="blue"></Label>
    <Label text="Label 4" width="70" height="70" backgroundColor="yellow"></Label>
  </RWrapLayout>
```