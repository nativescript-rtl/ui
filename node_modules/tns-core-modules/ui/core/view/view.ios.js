function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var view_common_1 = require("./view-common");
var background_1 = require("../../styling/background");
var utils_1 = require("../../../utils/utils");
var style_properties_1 = require("../../styling/style-properties");
var profiling_1 = require("../../../profiling");
__export(require("./view-common"));
var PFLAG_FORCE_LAYOUT = 1;
var PFLAG_MEASURED_DIMENSION_SET = 1 << 1;
var PFLAG_LAYOUT_REQUIRED = 1 << 2;
var View = (function (_super) {
    __extends(View, _super);
    function View() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._isLaidOut = false;
        _this._hasTransfrom = false;
        _this._privateFlags = PFLAG_LAYOUT_REQUIRED | PFLAG_FORCE_LAYOUT;
        _this._suspendCATransaction = false;
        return _this;
    }
    Object.defineProperty(View.prototype, "isLayoutRequired", {
        get: function () {
            return (this._privateFlags & PFLAG_LAYOUT_REQUIRED) === PFLAG_LAYOUT_REQUIRED;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "isLayoutRequested", {
        get: function () {
            return (this._privateFlags & PFLAG_FORCE_LAYOUT) === PFLAG_FORCE_LAYOUT;
        },
        enumerable: true,
        configurable: true
    });
    View.prototype.requestLayout = function () {
        _super.prototype.requestLayout.call(this);
        this._privateFlags |= PFLAG_FORCE_LAYOUT;
        var nativeView = this.nativeViewProtected;
        if (nativeView) {
            nativeView.setNeedsLayout();
        }
        if (this.viewController && this.viewController.view !== nativeView) {
            this.viewController.view.setNeedsLayout();
        }
    };
    View.prototype.measure = function (widthMeasureSpec, heightMeasureSpec) {
        var measureSpecsChanged = this._setCurrentMeasureSpecs(widthMeasureSpec, heightMeasureSpec);
        var forceLayout = (this._privateFlags & PFLAG_FORCE_LAYOUT) === PFLAG_FORCE_LAYOUT;
        if (forceLayout || measureSpecsChanged) {
            this._privateFlags &= ~PFLAG_MEASURED_DIMENSION_SET;
            this.onMeasure(widthMeasureSpec, heightMeasureSpec);
            this._privateFlags |= PFLAG_LAYOUT_REQUIRED;
            if ((this._privateFlags & PFLAG_MEASURED_DIMENSION_SET) !== PFLAG_MEASURED_DIMENSION_SET) {
                throw new Error("onMeasure() did not set the measured dimension by calling setMeasuredDimension() " + this);
            }
        }
    };
    View.prototype.layout = function (left, top, right, bottom, setFrame) {
        if (setFrame === void 0) { setFrame = true; }
        var _a = this._setCurrentLayoutBounds(left, top, right, bottom), boundsChanged = _a.boundsChanged, sizeChanged = _a.sizeChanged;
        if (setFrame) {
            this.layoutNativeView(left, top, right, bottom);
        }
        if (boundsChanged || (this._privateFlags & PFLAG_LAYOUT_REQUIRED) === PFLAG_LAYOUT_REQUIRED) {
            this.onLayout(left, top, right, bottom);
            this._privateFlags &= ~PFLAG_LAYOUT_REQUIRED;
        }
        this.updateBackground(sizeChanged);
        this._privateFlags &= ~PFLAG_FORCE_LAYOUT;
    };
    View.prototype.updateBackground = function (sizeChanged) {
        if (sizeChanged) {
            this._onSizeChanged();
        }
        else if (this._nativeBackgroundState === "invalid") {
            var background = this.style.backgroundInternal;
            this._redrawNativeBackground(background);
        }
    };
    View.prototype.setMeasuredDimension = function (measuredWidth, measuredHeight) {
        _super.prototype.setMeasuredDimension.call(this, measuredWidth, measuredHeight);
        this._privateFlags |= PFLAG_MEASURED_DIMENSION_SET;
    };
    View.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var view = this.nativeViewProtected;
        var width = view_common_1.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = view_common_1.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = view_common_1.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = view_common_1.layout.getMeasureSpecMode(heightMeasureSpec);
        var nativeWidth = 0;
        var nativeHeight = 0;
        if (view) {
            var nativeSize = view_common_1.layout.measureNativeView(view, width, widthMode, height, heightMode);
            nativeWidth = nativeSize.width;
            nativeHeight = nativeSize.height;
        }
        var measureWidth = Math.max(nativeWidth, this.effectiveMinWidth);
        var measureHeight = Math.max(nativeHeight, this.effectiveMinHeight);
        var widthAndState = View.resolveSizeAndState(measureWidth, width, widthMode, 0);
        var heightAndState = View.resolveSizeAndState(measureHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    View.prototype.onLayout = function (left, top, right, bottom) {
    };
    View.prototype._setNativeViewFrame = function (nativeView, frame) {
        if (!CGRectEqualToRect(nativeView.frame, frame)) {
            if (view_common_1.traceEnabled()) {
                view_common_1.traceWrite(this + ", Native setFrame: = " + NSStringFromCGRect(frame), view_common_1.traceCategories.Layout);
            }
            this._cachedFrame = frame;
            if (this._hasTransfrom) {
                var transform = nativeView.transform;
                nativeView.transform = CGAffineTransformIdentity;
                nativeView.frame = frame;
                nativeView.transform = transform;
            }
            else {
                nativeView.frame = frame;
            }
            var boundsOrigin = nativeView.bounds.origin;
            nativeView.bounds = CGRectMake(boundsOrigin.x, boundsOrigin.y, frame.size.width, frame.size.height);
            this._raiseLayoutChangedEvent();
            this._isLaidOut = true;
        }
        else if (!this._isLaidOut) {
            this._raiseLayoutChangedEvent();
        }
    };
    View.prototype.layoutNativeView = function (left, top, right, bottom) {
        if (!this.nativeViewProtected) {
            return;
        }
        var nativeView = this.nativeViewProtected;
        var frame = CGRectMake(view_common_1.layout.toDeviceIndependentPixels(left), view_common_1.layout.toDeviceIndependentPixels(top), view_common_1.layout.toDeviceIndependentPixels(right - left), view_common_1.layout.toDeviceIndependentPixels(bottom - top));
        this._setNativeViewFrame(nativeView, frame);
    };
    View.prototype._setLayoutFlags = function (left, top, right, bottom) {
        var width = right - left;
        var height = bottom - top;
        var widthSpec = view_common_1.layout.makeMeasureSpec(width, view_common_1.layout.EXACTLY);
        var heightSpec = view_common_1.layout.makeMeasureSpec(height, view_common_1.layout.EXACTLY);
        this._setCurrentMeasureSpecs(widthSpec, heightSpec);
        this._privateFlags &= ~PFLAG_FORCE_LAYOUT;
        this.setMeasuredDimension(width, height);
        var sizeChanged = this._setCurrentLayoutBounds(left, top, right, bottom).sizeChanged;
        this.updateBackground(sizeChanged);
        this._privateFlags &= ~PFLAG_LAYOUT_REQUIRED;
        this._cachedFrame = this.nativeViewProtected.frame;
    };
    View.prototype.focus = function () {
        if (this.ios) {
            return this.ios.becomeFirstResponder();
        }
        return false;
    };
    View.prototype.getLocationInWindow = function () {
        if (!this.nativeViewProtected || !this.nativeViewProtected.window) {
            return undefined;
        }
        var pointInWindow = this.nativeViewProtected.convertPointToView(this.nativeViewProtected.bounds.origin, null);
        return {
            x: pointInWindow.x,
            y: pointInWindow.y
        };
    };
    View.prototype.getLocationOnScreen = function () {
        if (!this.nativeViewProtected || !this.nativeViewProtected.window) {
            return undefined;
        }
        var pointInWindow = this.nativeViewProtected.convertPointToView(this.nativeViewProtected.bounds.origin, null);
        var pointOnScreen = this.nativeViewProtected.window.convertPointToWindow(pointInWindow, null);
        return {
            x: pointOnScreen.x,
            y: pointOnScreen.y
        };
    };
    View.prototype.getLocationRelativeTo = function (otherView) {
        if (!this.nativeViewProtected || !this.nativeViewProtected.window ||
            !otherView.nativeViewProtected || !otherView.nativeViewProtected.window ||
            this.nativeViewProtected.window !== otherView.nativeViewProtected.window) {
            return undefined;
        }
        var myPointInWindow = this.nativeViewProtected.convertPointToView(this.nativeViewProtected.bounds.origin, null);
        var otherPointInWindow = otherView.nativeViewProtected.convertPointToView(otherView.nativeViewProtected.bounds.origin, null);
        return {
            x: myPointInWindow.x - otherPointInWindow.x,
            y: myPointInWindow.y - otherPointInWindow.y
        };
    };
    View.prototype._onSizeChanged = function () {
        var nativeView = this.nativeViewProtected;
        if (!nativeView) {
            return;
        }
        var background = this.style.backgroundInternal;
        var backgroundDependsOnSize = background.image
            || !background.hasUniformBorder()
            || background.hasBorderRadius();
        if (this._nativeBackgroundState === "invalid" || (this._nativeBackgroundState === "drawn" && backgroundDependsOnSize)) {
            this._redrawNativeBackground(background);
        }
        var clipPath = this.style.clipPath;
        if (clipPath !== "" && this[style_properties_1.clipPathProperty.setNative]) {
            this[style_properties_1.clipPathProperty.setNative](clipPath);
        }
    };
    View.prototype.updateNativeTransform = function () {
        var scaleX = this.scaleX || 1e-6;
        var scaleY = this.scaleY || 1e-6;
        var rotate = this.rotate || 0;
        var newTransform = CGAffineTransformIdentity;
        newTransform = CGAffineTransformTranslate(newTransform, this.translateX, this.translateY);
        newTransform = CGAffineTransformRotate(newTransform, rotate * Math.PI / 180);
        newTransform = CGAffineTransformScale(newTransform, scaleX, scaleY);
        if (!CGAffineTransformEqualToTransform(this.nativeViewProtected.transform, newTransform)) {
            var updateSuspended = this._isPresentationLayerUpdateSuspeneded();
            if (!updateSuspended) {
                CATransaction.begin();
            }
            this.nativeViewProtected.transform = newTransform;
            this._hasTransfrom = this.nativeViewProtected && !CGAffineTransformEqualToTransform(this.nativeViewProtected.transform, CGAffineTransformIdentity);
            if (!updateSuspended) {
                CATransaction.commit();
            }
        }
    };
    View.prototype.updateOriginPoint = function (originX, originY) {
        var newPoint = CGPointMake(originX, originY);
        this.nativeViewProtected.layer.anchorPoint = newPoint;
        if (this._cachedFrame) {
            this._setNativeViewFrame(this.nativeViewProtected, this._cachedFrame);
        }
    };
    View.prototype._suspendPresentationLayerUpdates = function () {
        this._suspendCATransaction = true;
    };
    View.prototype._resumePresentationLayerUpdates = function () {
        this._suspendCATransaction = false;
    };
    View.prototype._isPresentationLayerUpdateSuspeneded = function () {
        return this._suspendCATransaction || this._suspendNativeUpdatesCount;
    };
    View.prototype._showNativeModalView = function (parent, context, closeCallback, fullscreen, animated, stretched) {
        var _this = this;
        var parentWithController = ios.getParentWithViewController(parent);
        if (!parentWithController) {
            view_common_1.traceWrite("Could not find parent with viewController for " + parent + " while showing modal view.", view_common_1.traceCategories.ViewHierarchy, view_common_1.traceMessageType.error);
            return;
        }
        var parentController = parentWithController.viewController;
        if (!parentController.view || !parentController.view.window) {
            view_common_1.traceWrite("Parent page is not part of the window hierarchy. Close the current modal page before showing another one!", view_common_1.traceCategories.ViewHierarchy, view_common_1.traceMessageType.error);
            return;
        }
        _super.prototype._showNativeModalView.call(this, parentWithController, context, closeCallback, fullscreen, stretched);
        var controller = this.viewController;
        if (!controller) {
            var nativeView = this.ios || this.nativeViewProtected;
            controller = ios.UILayoutViewController.initWithOwner(new WeakRef(this));
            if (nativeView instanceof UIView) {
                controller.view.addSubview(nativeView);
            }
            this.viewController = controller;
        }
        this._setupAsRootView({});
        if (fullscreen) {
            controller.modalPresentationStyle = 0;
        }
        else {
            controller.modalPresentationStyle = 2;
        }
        this.horizontalAlignment = "stretch";
        this.verticalAlignment = "stretch";
        this._raiseShowingModallyEvent();
        animated = animated === undefined ? true : !!animated;
        controller.animated = animated;
        parentController.presentViewControllerAnimatedCompletion(controller, animated, null);
        var transitionCoordinator = utils_1.ios.getter(parentController, parentController.transitionCoordinator);
        if (transitionCoordinator) {
            UIViewControllerTransitionCoordinator.prototype.animateAlongsideTransitionCompletion
                .call(transitionCoordinator, null, function () { return _this._raiseShownModallyEvent(); });
        }
        else {
            this._raiseShownModallyEvent();
        }
    };
    View.prototype._hideNativeModalView = function (parent) {
        if (!parent || !parent.viewController) {
            view_common_1.traceError("Trying to hide modal view but no parent with viewController specified.");
            return;
        }
        var parentController = parent.viewController;
        var animated = this.viewController.animated;
        _super.prototype._hideNativeModalView.call(this, parent);
        parentController.dismissModalViewControllerAnimated(animated);
    };
    View.prototype[view_common_1.isEnabledProperty.getDefault] = function () {
        var nativeView = this.nativeViewProtected;
        return nativeView instanceof UIControl ? nativeView.enabled : true;
    };
    View.prototype[view_common_1.isEnabledProperty.setNative] = function (value) {
        var nativeView = this.nativeViewProtected;
        if (nativeView instanceof UIControl) {
            nativeView.enabled = value;
        }
    };
    View.prototype[view_common_1.originXProperty.getDefault] = function () {
        return this.nativeViewProtected.layer.anchorPoint.x;
    };
    View.prototype[view_common_1.originXProperty.setNative] = function (value) {
        this.updateOriginPoint(value, this.originY);
    };
    View.prototype[view_common_1.originYProperty.getDefault] = function () {
        return this.nativeViewProtected.layer.anchorPoint.y;
    };
    View.prototype[view_common_1.originYProperty.setNative] = function (value) {
        this.updateOriginPoint(this.originX, value);
    };
    View.prototype[view_common_1.automationTextProperty.getDefault] = function () {
        return this.nativeViewProtected.accessibilityLabel;
    };
    View.prototype[view_common_1.automationTextProperty.setNative] = function (value) {
        this.nativeViewProtected.accessibilityIdentifier = value;
        this.nativeViewProtected.accessibilityLabel = value;
    };
    View.prototype[view_common_1.isUserInteractionEnabledProperty.getDefault] = function () {
        return this.nativeViewProtected.userInteractionEnabled;
    };
    View.prototype[view_common_1.isUserInteractionEnabledProperty.setNative] = function (value) {
        this.nativeViewProtected.userInteractionEnabled = value;
    };
    View.prototype[style_properties_1.visibilityProperty.getDefault] = function () {
        return this.nativeViewProtected.hidden ? style_properties_1.Visibility.COLLAPSE : style_properties_1.Visibility.VISIBLE;
    };
    View.prototype[style_properties_1.visibilityProperty.setNative] = function (value) {
        switch (value) {
            case style_properties_1.Visibility.VISIBLE:
                this.nativeViewProtected.hidden = false;
                break;
            case style_properties_1.Visibility.HIDDEN:
            case style_properties_1.Visibility.COLLAPSE:
                this.nativeViewProtected.hidden = true;
                break;
            default:
                throw new Error("Invalid visibility value: " + value + ". Valid values are: \"" + style_properties_1.Visibility.VISIBLE + "\", \"" + style_properties_1.Visibility.HIDDEN + "\", \"" + style_properties_1.Visibility.COLLAPSE + "\".");
        }
    };
    View.prototype[style_properties_1.opacityProperty.getDefault] = function () {
        return this.nativeViewProtected.alpha;
    };
    View.prototype[style_properties_1.opacityProperty.setNative] = function (value) {
        var nativeView = this.nativeViewProtected;
        var updateSuspended = this._isPresentationLayerUpdateSuspeneded();
        if (!updateSuspended) {
            CATransaction.begin();
        }
        nativeView.alpha = value;
        if (!updateSuspended) {
            CATransaction.commit();
        }
    };
    View.prototype[style_properties_1.rotateProperty.getDefault] = function () {
        return 0;
    };
    View.prototype[style_properties_1.rotateProperty.setNative] = function (value) {
        this.updateNativeTransform();
    };
    View.prototype[style_properties_1.scaleXProperty.getDefault] = function () {
        return 1;
    };
    View.prototype[style_properties_1.scaleXProperty.setNative] = function (value) {
        this.updateNativeTransform();
    };
    View.prototype[style_properties_1.scaleYProperty.getDefault] = function () {
        return 1;
    };
    View.prototype[style_properties_1.scaleYProperty.setNative] = function (value) {
        this.updateNativeTransform();
    };
    View.prototype[style_properties_1.translateXProperty.getDefault] = function () {
        return 0;
    };
    View.prototype[style_properties_1.translateXProperty.setNative] = function (value) {
        this.updateNativeTransform();
    };
    View.prototype[style_properties_1.translateYProperty.getDefault] = function () {
        return 0;
    };
    View.prototype[style_properties_1.translateYProperty.setNative] = function (value) {
        this.updateNativeTransform();
    };
    View.prototype[style_properties_1.zIndexProperty.getDefault] = function () {
        return 0;
    };
    View.prototype[style_properties_1.zIndexProperty.setNative] = function (value) {
        this.nativeViewProtected.layer.zPosition = value;
    };
    View.prototype[style_properties_1.backgroundInternalProperty.getDefault] = function () {
        return this.nativeViewProtected.backgroundColor;
    };
    View.prototype[style_properties_1.backgroundInternalProperty.setNative] = function (value) {
        this._nativeBackgroundState = "invalid";
        if (this.isLayoutValid) {
            this._redrawNativeBackground(value);
        }
    };
    View.prototype._redrawNativeBackground = function (value) {
        var _this = this;
        var updateSuspended = this._isPresentationLayerUpdateSuspeneded();
        if (!updateSuspended) {
            CATransaction.begin();
        }
        if (value instanceof UIColor) {
            this.nativeViewProtected.backgroundColor = value;
        }
        else {
            background_1.ios.createBackgroundUIColor(this, function (color) {
                _this.nativeViewProtected.backgroundColor = color;
            });
            this._setNativeClipToBounds();
        }
        if (!updateSuspended) {
            CATransaction.commit();
        }
        this._nativeBackgroundState = "drawn";
    };
    View.prototype._setNativeClipToBounds = function () {
        var backgroundInternal = this.style.backgroundInternal;
        this.nativeViewProtected.clipsToBounds =
            this.nativeViewProtected instanceof UIScrollView ||
                backgroundInternal.hasBorderWidth() ||
                backgroundInternal.hasBorderRadius();
    };
    __decorate([
        profiling_1.profile
    ], View.prototype, "layout", null);
    __decorate([
        profiling_1.profile
    ], View.prototype, "onMeasure", null);
    return View;
}(view_common_1.ViewCommon));
exports.View = View;
View.prototype._nativeBackgroundState = "unset";
var CustomLayoutView = (function (_super) {
    __extends(CustomLayoutView, _super);
    function CustomLayoutView() {
        var _this = _super.call(this) || this;
        _this.nativeViewProtected = UIView.alloc().initWithFrame(utils_1.ios.getter(UIScreen, UIScreen.mainScreen).bounds);
        return _this;
    }
    Object.defineProperty(CustomLayoutView.prototype, "ios", {
        get: function () {
            return this.nativeViewProtected;
        },
        enumerable: true,
        configurable: true
    });
    CustomLayoutView.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
    };
    CustomLayoutView.prototype._addViewToNativeVisualTree = function (child, atIndex) {
        _super.prototype._addViewToNativeVisualTree.call(this, child, atIndex);
        var parentNativeView = this.nativeViewProtected;
        var childNativeView = child.nativeViewProtected;
        if (parentNativeView && childNativeView) {
            if (typeof atIndex !== "number" || atIndex >= parentNativeView.subviews.count) {
                parentNativeView.addSubview(childNativeView);
            }
            else {
                parentNativeView.insertSubviewAtIndex(childNativeView, atIndex);
            }
            return true;
        }
        return false;
    };
    CustomLayoutView.prototype._removeViewFromNativeVisualTree = function (child) {
        _super.prototype._removeViewFromNativeVisualTree.call(this, child);
        if (child.nativeViewProtected) {
            child.nativeViewProtected.removeFromSuperview();
        }
    };
    CustomLayoutView.prototype._getCurrentLayoutBounds = function () {
        var nativeView = this.nativeViewProtected;
        if (nativeView && !this.isCollapsed) {
            var frame = nativeView.frame;
            var origin = frame.origin;
            var size = frame.size;
            return {
                left: view_common_1.layout.toDevicePixels(origin.x),
                top: view_common_1.layout.toDevicePixels(origin.y),
                right: view_common_1.layout.toDevicePixels(origin.x + size.width),
                bottom: view_common_1.layout.toDevicePixels(origin.y + size.height)
            };
        }
        else {
            return { left: 0, top: 0, right: 0, bottom: 0 };
        }
    };
    return CustomLayoutView;
}(View));
exports.CustomLayoutView = CustomLayoutView;
var ios;
(function (ios) {
    function getParentWithViewController(view) {
        while (view && !view.viewController) {
            view = view.parent;
        }
        return view;
    }
    ios.getParentWithViewController = getParentWithViewController;
    function isContentScrollable(controller, owner) {
        var scrollableContent = owner.scrollableContent;
        if (scrollableContent === undefined) {
            var view = controller.view.subviews.count > 0 ? controller.view.subviews[0] : null;
            if (view instanceof UIScrollView) {
                scrollableContent = true;
            }
        }
        return scrollableContent === true || scrollableContent === "true";
    }
    ios.isContentScrollable = isContentScrollable;
    function updateAutoAdjustScrollInsets(controller, owner) {
        var scrollable = isContentScrollable(controller, owner);
        owner._automaticallyAdjustsScrollViewInsets = scrollable;
        controller.automaticallyAdjustsScrollViewInsets = scrollable;
    }
    ios.updateAutoAdjustScrollInsets = updateAutoAdjustScrollInsets;
    function updateConstraints(controller, owner) {
        var root = controller.view;
        if (!root.safeAreaLayoutGuide) {
            var layoutGuide = initLayoutGuide(controller);
            controller.view.safeAreaLayoutGuide = layoutGuide;
        }
    }
    ios.updateConstraints = updateConstraints;
    function initLayoutGuide(controller) {
        var rootView = controller.view;
        var layoutGuide = UILayoutGuide.alloc().init();
        rootView.addLayoutGuide(layoutGuide);
        NSLayoutConstraint.activateConstraints([
            layoutGuide.topAnchor.constraintEqualToAnchor(controller.topLayoutGuide.bottomAnchor),
            layoutGuide.bottomAnchor.constraintEqualToAnchor(controller.bottomLayoutGuide.topAnchor),
            layoutGuide.leadingAnchor.constraintEqualToAnchor(rootView.leadingAnchor),
            layoutGuide.trailingAnchor.constraintEqualToAnchor(rootView.trailingAnchor)
        ]);
        return layoutGuide;
    }
    function getStatusBarHeight(viewController) {
        var app = utils_1.ios.getter(UIApplication, UIApplication.sharedApplication);
        if (!app || app.statusBarHidden) {
            return 0;
        }
        if (viewController && viewController.prefersStatusBarHidden) {
            return 0;
        }
        var statusFrame = app.statusBarFrame;
        return Math.min(statusFrame.size.width, statusFrame.size.height);
    }
    function layoutView(controller, owner) {
        var left, top, width, height;
        var frame = controller.view.frame;
        var fullscreenOrigin = frame.origin;
        var fullscreenSize = frame.size;
        var layoutGuide = controller.view.safeAreaLayoutGuide;
        if (!layoutGuide) {
            view_common_1.traceWrite("safeAreaLayoutGuide during layout of " + owner + ". Creating fallback constraints, but layout might be wrong.", view_common_1.traceCategories.Layout, view_common_1.traceMessageType.error);
            layoutGuide = initLayoutGuide(controller);
        }
        var safeArea = layoutGuide.layoutFrame;
        var safeOrigin = safeArea.origin;
        var safeAreaSize = safeArea.size;
        var navController = controller.navigationController;
        var navBarHidden = navController ? navController.navigationBarHidden : true;
        var scrollable = isContentScrollable(controller, owner);
        var hasChildControllers = controller.childViewControllers.count > 0;
        if (!(controller.edgesForExtendedLayout & 1)) {
            var statusBarHeight = getStatusBarHeight(controller);
            var navBarHeight = controller.navigationController ? controller.navigationController.navigationBar.frame.size.height : 0;
            fullscreenOrigin.y = safeOrigin.y;
            fullscreenSize.height -= (statusBarHeight + navBarHeight);
        }
        left = safeOrigin.x;
        width = safeAreaSize.width;
        if (hasChildControllers) {
            top = fullscreenOrigin.y;
            height = fullscreenSize.height;
        }
        else if (!scrollable) {
            top = safeOrigin.y;
            height = safeAreaSize.height;
        }
        else if (navBarHidden) {
            top = safeOrigin.y;
            height = navController ? (fullscreenSize.height - top) : safeAreaSize.height;
        }
        else {
            top = fullscreenOrigin.y;
            height = fullscreenSize.height;
        }
        left = view_common_1.layout.toDevicePixels(left);
        top = view_common_1.layout.toDevicePixels(top);
        width = view_common_1.layout.toDevicePixels(width);
        height = view_common_1.layout.toDevicePixels(height);
        var widthSpec = view_common_1.layout.makeMeasureSpec(width, view_common_1.layout.EXACTLY);
        var heightSpec = view_common_1.layout.makeMeasureSpec(height, view_common_1.layout.EXACTLY);
        View.measureChild(null, owner, widthSpec, heightSpec);
        View.layoutChild(null, owner, left, top, width + left, height + top);
        layoutParent(owner.parent);
    }
    ios.layoutView = layoutView;
    function layoutParent(view) {
        if (!view) {
            return;
        }
        if (view instanceof View && view.nativeViewProtected) {
            var frame = view.nativeViewProtected.frame;
            var origin = frame.origin;
            var size = frame.size;
            var left = view_common_1.layout.toDevicePixels(origin.x);
            var top_1 = view_common_1.layout.toDevicePixels(origin.y);
            var width = view_common_1.layout.toDevicePixels(size.width);
            var height = view_common_1.layout.toDevicePixels(size.height);
            view._setLayoutFlags(left, top_1, width + left, height + top_1);
        }
        layoutParent(view.parent);
    }
    var UILayoutViewController = (function (_super) {
        __extends(UILayoutViewController, _super);
        function UILayoutViewController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        UILayoutViewController.initWithOwner = function (owner) {
            var controller = UILayoutViewController.new();
            controller.owner = owner;
            return controller;
        };
        UILayoutViewController.prototype.viewWillLayoutSubviews = function () {
            _super.prototype.viewWillLayoutSubviews.call(this);
            var owner = this.owner.get();
            if (owner) {
                updateConstraints(this, owner);
            }
        };
        UILayoutViewController.prototype.viewDidLayoutSubviews = function () {
            _super.prototype.viewDidLayoutSubviews.call(this);
            var owner = this.owner.get();
            if (owner) {
                layoutView(this, owner);
            }
        };
        UILayoutViewController.prototype.viewWillAppear = function (animated) {
            _super.prototype.viewWillAppear.call(this, animated);
            var owner = this.owner.get();
            if (!owner) {
                return;
            }
            updateAutoAdjustScrollInsets(this, owner);
            if (!owner.parent) {
                owner.callLoaded();
            }
        };
        UILayoutViewController.prototype.viewDidDisappear = function (animated) {
            _super.prototype.viewDidDisappear.call(this, animated);
            var owner = this.owner.get();
            if (owner && !owner.parent) {
                owner.callUnloaded();
            }
        };
        return UILayoutViewController;
    }(UIViewController));
    ios.UILayoutViewController = UILayoutViewController;
})(ios = exports.ios || (exports.ios = {}));
//# sourceMappingURL=view.ios.js.map