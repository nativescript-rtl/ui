Object.defineProperty(exports, "__esModule", { value: true });
var debug_1 = require("../../utils/debug");
var xml = require("../../xml");
var types_1 = require("../../utils/types");
var component_builder_1 = require("./component-builder");
var platform_1 = require("../../platform");
var profiling_1 = require("../../profiling");
var module_name_sanitizer_1 = require("./module-name-sanitizer");
var module_name_resolver_1 = require("../../module-name-resolver");
var ios = platform_1.platformNames.ios.toLowerCase();
var android = platform_1.platformNames.android.toLowerCase();
var defaultNameSpaceMatcher = /tns\.xsd$/i;
function parse(value, context) {
    if (typeof value === "function") {
        return value();
    }
    else {
        var exports_1 = context ? getExports(context) : undefined;
        var componentModule = parseInternal(value, exports_1);
        return componentModule && componentModule.component;
    }
}
exports.parse = parse;
function parseMultipleTemplates(value, context) {
    var dummyComponent = "<ListView><ListView.itemTemplates>" + value + "</ListView.itemTemplates></ListView>";
    return parseInternal(dummyComponent, context).component["itemTemplates"];
}
exports.parseMultipleTemplates = parseMultipleTemplates;
function load(pathOrOptions, context) {
    var componentModule;
    if (typeof pathOrOptions === "string") {
        var moduleName = module_name_sanitizer_1.sanitizeModuleName(pathOrOptions);
        componentModule = loadInternal(moduleName, context);
    }
    else {
        componentModule = loadCustomComponent(pathOrOptions.path, pathOrOptions.name, pathOrOptions.attributes, pathOrOptions.exports, pathOrOptions.page, true);
    }
    return componentModule && componentModule.component;
}
exports.load = load;
exports.createViewFromEntry = profiling_1.profile("createViewFromEntry", function (entry) {
    if (entry.create) {
        var view = entry.create();
        if (!view) {
            throw new Error("Failed to create View with entry.create() function.");
        }
        return view;
    }
    else if (entry.moduleName) {
        var moduleName = module_name_sanitizer_1.sanitizeModuleName(entry.moduleName);
        var resolvedCodeModuleName = module_name_resolver_1.resolveModuleName(moduleName, "");
        var moduleExports = resolvedCodeModuleName ? global.loadModule(resolvedCodeModuleName, true) : null;
        if (moduleExports && moduleExports.createPage) {
            var view = moduleExports.createPage();
            var resolvedCssModuleName = module_name_resolver_1.resolveModuleName(moduleName, "css");
            if (resolvedCssModuleName) {
                view.addCssFile(resolvedCssModuleName);
            }
            return view;
        }
        else {
            var componentModule = loadInternal(moduleName, moduleExports);
            var componentView = componentModule && componentModule.component;
            return componentView;
        }
    }
    throw new Error("Failed to load page XML file for module: " + entry.moduleName);
});
function loadInternal(moduleName, moduleExports) {
    var componentModule;
    var resolvedXmlModule = module_name_resolver_1.resolveModuleName(moduleName, "xml");
    if (resolvedXmlModule) {
        var text = global.loadModule(resolvedXmlModule, true);
        componentModule = parseInternal(text, moduleExports, resolvedXmlModule, moduleName);
    }
    var componentView = componentModule && componentModule.component;
    if (componentView) {
        componentView.exports = moduleExports;
        componentView._moduleName = moduleName;
    }
    if (!componentModule) {
        throw new Error("Failed to load component from module: " + moduleName);
    }
    return componentModule;
}
function loadCustomComponent(componentNamespace, componentName, attributes, context, parentPage, isRootComponent, moduleNamePath) {
    if (isRootComponent === void 0) { isRootComponent = true; }
    if (!parentPage && context) {
        parentPage = context["_parentPage"];
        delete context["_parentPage"];
    }
    var result;
    componentNamespace = module_name_sanitizer_1.sanitizeModuleName(componentNamespace);
    var moduleName = componentNamespace + "/" + componentName;
    var resolvedCodeModuleName = module_name_resolver_1.resolveModuleName(moduleName, "");
    var resolvedXmlModuleName = module_name_resolver_1.resolveModuleName(moduleName, "xml");
    var resolvedCssModuleName = module_name_resolver_1.resolveModuleName(moduleName, "css");
    if (resolvedXmlModuleName) {
        var subExports = context;
        if (resolvedCodeModuleName) {
            subExports = global.loadModule(resolvedCodeModuleName, true);
        }
        if (!subExports) {
            subExports = {};
        }
        subExports["_parentPage"] = parentPage;
        result = loadInternal(moduleName, subExports);
        if (types_1.isDefined(result) && types_1.isDefined(result.component) && types_1.isDefined(attributes)) {
            for (var attr in attributes) {
                component_builder_1.setPropertyValue(result.component, subExports, context, attr, attributes[attr]);
            }
        }
    }
    else {
        result = component_builder_1.getComponentModule(componentName, componentNamespace, attributes, context, moduleNamePath, isRootComponent);
        if (!resolvedCssModuleName) {
            resolvedCssModuleName = module_name_resolver_1.resolveModuleName(componentNamespace, "css");
        }
    }
    if (parentPage && resolvedCssModuleName) {
        parentPage.addCssFile(resolvedCssModuleName);
    }
    return result;
}
function getExports(instance) {
    var isView = !!instance._domId;
    if (!isView) {
        return instance.exports || instance;
    }
    var exportObject = instance.exports;
    var parent = instance.parent;
    while (exportObject === undefined && parent) {
        exportObject = parent.exports;
        parent = parent.parent;
    }
    return exportObject;
}
function parseInternal(value, context, xmlModule, moduleName) {
    var start;
    var ui;
    var errorFormat = (debug_1.debug && xmlModule) ? xml2ui.SourceErrorFormat(xmlModule) : xml2ui.PositionErrorFormat;
    var componentSourceTracker = (debug_1.debug && xmlModule) ? xml2ui.ComponentSourceTracker(xmlModule) : function () {
    };
    (start = new xml2ui.XmlStringParser(errorFormat))
        .pipe(new xml2ui.PlatformFilter())
        .pipe(new xml2ui.XmlStateParser(ui = new xml2ui.ComponentParser(context, errorFormat, componentSourceTracker, moduleName)));
    start.parse(value);
    return ui.rootComponentModule;
}
var xml2ui;
(function (xml2ui) {
    var XmlProducerBase = (function () {
        function XmlProducerBase() {
        }
        XmlProducerBase.prototype.pipe = function (next) {
            this._next = next;
            return next;
        };
        XmlProducerBase.prototype.next = function (args) {
            this._next.parse(args);
        };
        return XmlProducerBase;
    }());
    xml2ui.XmlProducerBase = XmlProducerBase;
    var XmlStringParser = (function (_super) {
        __extends(XmlStringParser, _super);
        function XmlStringParser(error) {
            var _this = _super.call(this) || this;
            _this.error = error || PositionErrorFormat;
            return _this;
        }
        XmlStringParser.prototype.parse = function (value) {
            var _this = this;
            var xmlParser = new xml.XmlParser(function (args) {
                try {
                    _this.next(args);
                }
                catch (e) {
                    throw _this.error(e, args.position);
                }
            }, function (e, p) {
                throw _this.error(e, p);
            }, true);
            if (types_1.isString(value)) {
                xmlParser.parse(value);
            }
        };
        return XmlStringParser;
    }(XmlProducerBase));
    xml2ui.XmlStringParser = XmlStringParser;
    function PositionErrorFormat(e, p) {
        return new debug_1.ScopeError(e, "Parsing XML at " + p.line + ":" + p.column);
    }
    xml2ui.PositionErrorFormat = PositionErrorFormat;
    function SourceErrorFormat(uri) {
        return function (e, p) {
            var source = p ? new debug_1.Source(uri, p.line, p.column) : new debug_1.Source(uri, -1, -1);
            e = new debug_1.SourceError(e, source, "Building UI from XML.");
            return e;
        };
    }
    xml2ui.SourceErrorFormat = SourceErrorFormat;
    function ComponentSourceTracker(uri) {
        return function (component, p) {
            if (!debug_1.Source.get(component)) {
                var source = p ? new debug_1.Source(uri, p.line, p.column) : new debug_1.Source(uri, -1, -1);
                debug_1.Source.set(component, source);
            }
        };
    }
    xml2ui.ComponentSourceTracker = ComponentSourceTracker;
    var PlatformFilter = (function (_super) {
        __extends(PlatformFilter, _super);
        function PlatformFilter() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PlatformFilter.prototype.parse = function (args) {
            if (args.eventType === xml.ParserEventType.StartElement) {
                if (PlatformFilter.isPlatform(args.elementName)) {
                    if (this.currentPlatformContext) {
                        throw new Error("Already in '" + this.currentPlatformContext + "' platform context and cannot switch to '" + args.elementName + "' platform! Platform tags cannot be nested.");
                    }
                    this.currentPlatformContext = args.elementName;
                    return;
                }
            }
            if (args.eventType === xml.ParserEventType.EndElement) {
                if (PlatformFilter.isPlatform(args.elementName)) {
                    this.currentPlatformContext = undefined;
                    return;
                }
            }
            if (this.currentPlatformContext && !PlatformFilter.isCurentPlatform(this.currentPlatformContext)) {
                return;
            }
            this.next(args);
        };
        PlatformFilter.isPlatform = function (value) {
            if (value) {
                var toLower = value.toLowerCase();
                return toLower === android || toLower === ios;
            }
            return false;
        };
        PlatformFilter.isCurentPlatform = function (value) {
            return value && value.toLowerCase() === platform_1.device.os.toLowerCase();
        };
        return PlatformFilter;
    }(XmlProducerBase));
    xml2ui.PlatformFilter = PlatformFilter;
    var XmlArgsReplay = (function (_super) {
        __extends(XmlArgsReplay, _super);
        function XmlArgsReplay(args, errorFormat) {
            var _this = _super.call(this) || this;
            _this.args = args;
            _this.error = errorFormat;
            return _this;
        }
        XmlArgsReplay.prototype.replay = function () {
            var _this = this;
            this.args.forEach(function (args) {
                try {
                    _this.next(args);
                }
                catch (e) {
                    throw _this.error(e, args.position);
                }
            });
        };
        return XmlArgsReplay;
    }(XmlProducerBase));
    xml2ui.XmlArgsReplay = XmlArgsReplay;
    var XmlStateParser = (function () {
        function XmlStateParser(state) {
            this.state = state;
        }
        XmlStateParser.prototype.parse = function (args) {
            this.state = this.state.parse(args);
        };
        return XmlStateParser;
    }());
    xml2ui.XmlStateParser = XmlStateParser;
    var TemplateParser = (function () {
        function TemplateParser(parent, templateProperty, setTemplateProperty) {
            if (setTemplateProperty === void 0) { setTemplateProperty = true; }
            this.parent = parent;
            this._context = templateProperty.context;
            this._recordedXmlStream = new Array();
            this._templateProperty = templateProperty;
            this._nestingLevel = 0;
            this._state = 0;
            this._setTemplateProperty = setTemplateProperty;
        }
        TemplateParser.prototype.parse = function (args) {
            if (args.eventType === xml.ParserEventType.StartElement) {
                this.parseStartElement(args.prefix, args.namespace, args.elementName, args.attributes);
            }
            else if (args.eventType === xml.ParserEventType.EndElement) {
                this.parseEndElement(args.prefix, args.elementName);
            }
            this._recordedXmlStream.push(args);
            return this._state === 2 ? this.parent : this;
        };
        Object.defineProperty(TemplateParser.prototype, "elementName", {
            get: function () {
                return this._templateProperty.elementName;
            },
            enumerable: true,
            configurable: true
        });
        TemplateParser.prototype.parseStartElement = function (prefix, namespace, elementName, attributes) {
            if (this._state === 0) {
                this._state = 1;
            }
            else if (this._state === 2) {
                throw new Error("Template must have exactly one root element but multiple elements were found.");
            }
            this._nestingLevel++;
        };
        TemplateParser.prototype.parseEndElement = function (prefix, elementName) {
            if (this._state === 0) {
                throw new Error("Template must have exactly one root element but none was found.");
            }
            else if (this._state === 2) {
                throw new Error("No more closing elements expected for this template.");
            }
            this._nestingLevel--;
            if (this._nestingLevel === 0) {
                this._state = 2;
                if (this._setTemplateProperty && this._templateProperty.name in this._templateProperty.parent.component) {
                    var template = this.buildTemplate();
                    this._templateProperty.parent.component[this._templateProperty.name] = template;
                }
            }
        };
        TemplateParser.prototype.buildTemplate = function () {
            var _this = this;
            var context = this._context;
            var errorFormat = this._templateProperty.errorFormat;
            var sourceTracker = this._templateProperty.sourceTracker;
            var template = profiling_1.profile("Template()", function () {
                var start;
                var ui;
                (start = new xml2ui.XmlArgsReplay(_this._recordedXmlStream, errorFormat))
                    .pipe(new XmlStateParser(ui = new ComponentParser(context, errorFormat, sourceTracker)));
                start.replay();
                return ui.rootComponentModule.component;
            });
            return template;
        };
        return TemplateParser;
    }());
    xml2ui.TemplateParser = TemplateParser;
    var MultiTemplateParser = (function () {
        function MultiTemplateParser(parent, templateProperty) {
            this.parent = parent;
            this.templateProperty = templateProperty;
            this._childParsers = new Array();
        }
        Object.defineProperty(MultiTemplateParser.prototype, "value", {
            get: function () { return this._value; },
            enumerable: true,
            configurable: true
        });
        MultiTemplateParser.prototype.parse = function (args) {
            if (args.eventType === xml.ParserEventType.StartElement && args.elementName === "template") {
                var childParser = new TemplateParser(this, this.templateProperty, false);
                childParser["key"] = args.attributes["key"];
                this._childParsers.push(childParser);
                return childParser;
            }
            if (args.eventType === xml.ParserEventType.EndElement) {
                var name_1 = ComponentParser.getComplexPropertyName(args.elementName);
                if (name_1 === this.templateProperty.name) {
                    var templates = new Array();
                    for (var i = 0; i < this._childParsers.length; i++) {
                        templates.push({
                            key: this._childParsers[i]["key"],
                            createView: this._childParsers[i].buildTemplate()
                        });
                    }
                    this._value = templates;
                    return this.parent.parse(args);
                }
            }
            return this;
        };
        return MultiTemplateParser;
    }());
    xml2ui.MultiTemplateParser = MultiTemplateParser;
    var ComponentParser = (function () {
        function ComponentParser(context, errorFormat, sourceTracker, moduleName) {
            this.moduleName = moduleName;
            this.parents = new Array();
            this.complexProperties = new Array();
            this.context = context;
            this.error = errorFormat;
            this.sourceTracker = sourceTracker;
        }
        ComponentParser.prototype.buildComponent = function (args) {
            if (args.prefix && args.namespace) {
                return loadCustomComponent(args.namespace, args.elementName, args.attributes, this.context, this.currentRootView, !this.currentRootView, this.moduleName);
            }
            else {
                var namespace = args.namespace;
                if (defaultNameSpaceMatcher.test(namespace || "")) {
                    namespace = undefined;
                }
                return component_builder_1.getComponentModule(args.elementName, namespace, args.attributes, this.context, this.moduleName, !this.currentRootView);
            }
        };
        ComponentParser.prototype.parse = function (args) {
            var parent = this.parents[this.parents.length - 1];
            var complexProperty = this.complexProperties[this.complexProperties.length - 1];
            if (args.eventType === xml.ParserEventType.StartElement) {
                if (ComponentParser.isComplexProperty(args.elementName)) {
                    var name_2 = ComponentParser.getComplexPropertyName(args.elementName);
                    var complexProperty_1 = {
                        parent: parent,
                        name: name_2,
                        items: []
                    };
                    this.complexProperties.push(complexProperty_1);
                    if (ComponentParser.isKnownTemplate(name_2, parent.exports)) {
                        return new TemplateParser(this, {
                            context: (parent ? getExports(parent.component) : null) || this.context,
                            parent: parent,
                            name: name_2,
                            elementName: args.elementName,
                            templateItems: [],
                            errorFormat: this.error,
                            sourceTracker: this.sourceTracker
                        });
                    }
                    if (ComponentParser.isKnownMultiTemplate(name_2, parent.exports)) {
                        var parser = new MultiTemplateParser(this, {
                            context: (parent ? getExports(parent.component) : null) || this.context,
                            parent: parent,
                            name: name_2,
                            elementName: args.elementName,
                            templateItems: [],
                            errorFormat: this.error,
                            sourceTracker: this.sourceTracker
                        });
                        complexProperty_1.parser = parser;
                        return parser;
                    }
                }
                else {
                    var componentModule = this.buildComponent(args);
                    if (componentModule) {
                        this.sourceTracker(componentModule.component, args.position);
                        if (parent) {
                            if (complexProperty) {
                                ComponentParser.addToComplexProperty(parent, complexProperty, componentModule);
                            }
                            else if (parent.component._addChildFromBuilder) {
                                parent.component._addChildFromBuilder(args.elementName, componentModule.component);
                            }
                        }
                        else if (this.parents.length === 0) {
                            this.rootComponentModule = componentModule;
                            if (this.rootComponentModule) {
                                this.currentRootView = this.rootComponentModule.component;
                                if (this.currentRootView.exports) {
                                    this.context = this.currentRootView.exports;
                                }
                            }
                        }
                        this.parents.push(componentModule);
                    }
                }
            }
            else if (args.eventType === xml.ParserEventType.EndElement) {
                if (ComponentParser.isComplexProperty(args.elementName)) {
                    if (complexProperty) {
                        if (complexProperty.parser) {
                            parent.component[complexProperty.name] = complexProperty.parser.value;
                        }
                        else if (parent && parent.component._addArrayFromBuilder) {
                            parent.component._addArrayFromBuilder(complexProperty.name, complexProperty.items);
                            complexProperty.items = [];
                        }
                    }
                    this.complexProperties.pop();
                }
                else {
                    this.parents.pop();
                }
            }
            return this;
        };
        ComponentParser.isComplexProperty = function (name) {
            return types_1.isString(name) && name.indexOf(".") !== -1;
        };
        ComponentParser.getComplexPropertyName = function (fullName) {
            var name;
            if (types_1.isString(fullName)) {
                var names = fullName.split(".");
                name = names[names.length - 1];
            }
            return name;
        };
        ComponentParser.isKnownTemplate = function (name, exports) {
            return ComponentParser.KNOWNTEMPLATES in exports && exports[ComponentParser.KNOWNTEMPLATES] && name in exports[ComponentParser.KNOWNTEMPLATES];
        };
        ComponentParser.isKnownMultiTemplate = function (name, exports) {
            return ComponentParser.KNOWNMULTITEMPLATES in exports && exports[ComponentParser.KNOWNMULTITEMPLATES] && name in exports[ComponentParser.KNOWNMULTITEMPLATES];
        };
        ComponentParser.addToComplexProperty = function (parent, complexProperty, elementModule) {
            var parentComponent = parent.component;
            if (ComponentParser.isKnownCollection(complexProperty.name, parent.exports)) {
                complexProperty.items.push(elementModule.component);
            }
            else if (parentComponent._addChildFromBuilder) {
                parentComponent._addChildFromBuilder(complexProperty.name, elementModule.component);
            }
            else {
                parentComponent[complexProperty.name] = elementModule.component;
            }
        };
        ComponentParser.isKnownCollection = function (name, context) {
            return ComponentParser.KNOWNCOLLECTIONS in context && context[ComponentParser.KNOWNCOLLECTIONS] && name in context[ComponentParser.KNOWNCOLLECTIONS];
        };
        ComponentParser.KNOWNCOLLECTIONS = "knownCollections";
        ComponentParser.KNOWNTEMPLATES = "knownTemplates";
        ComponentParser.KNOWNMULTITEMPLATES = "knownMultiTemplates";
        __decorate([
            profiling_1.profile
        ], ComponentParser.prototype, "buildComponent", null);
        return ComponentParser;
    }());
    xml2ui.ComponentParser = ComponentParser;
})(xml2ui || (xml2ui = {}));
//# sourceMappingURL=builder.js.map