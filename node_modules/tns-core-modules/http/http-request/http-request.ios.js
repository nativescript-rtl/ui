Object.defineProperty(exports, "__esModule", { value: true });
var types = require("../../utils/types");
var domainDebugger = require("../../debugger/debugger");
var http_request_common_1 = require("./http-request-common");
var HttpResponseEncoding;
(function (HttpResponseEncoding) {
    HttpResponseEncoding[HttpResponseEncoding["UTF8"] = 0] = "UTF8";
    HttpResponseEncoding[HttpResponseEncoding["GBK"] = 1] = "GBK";
})(HttpResponseEncoding = exports.HttpResponseEncoding || (exports.HttpResponseEncoding = {}));
var currentDevice = UIDevice.currentDevice;
var device = currentDevice.userInterfaceIdiom === 0 ? "Phone" : "Pad";
var osVersion = currentDevice.systemVersion;
var GET = "GET";
var USER_AGENT_HEADER = "User-Agent";
var USER_AGENT = "Mozilla/5.0 (i" + device + "; CPU OS " + osVersion.replace(".", "_") + " like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/" + osVersion + " Mobile/10A5355d Safari/8536.25";
var sessionConfig = NSURLSessionConfiguration.defaultSessionConfiguration;
var queue = NSOperationQueue.mainQueue;
function parseJSON(source) {
    var src = source.trim();
    if (src.lastIndexOf(")") === src.length - 1) {
        return JSON.parse(src.substring(src.indexOf("(") + 1, src.lastIndexOf(")")));
    }
    return JSON.parse(src);
}
var NSURLSessionTaskDelegateImpl = (function (_super) {
    __extends(NSURLSessionTaskDelegateImpl, _super);
    function NSURLSessionTaskDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NSURLSessionTaskDelegateImpl.prototype.URLSessionTaskWillPerformHTTPRedirectionNewRequestCompletionHandler = function (session, task, response, request, completionHandler) {
        completionHandler(null);
    };
    NSURLSessionTaskDelegateImpl.ObjCProtocols = [NSURLSessionTaskDelegate];
    return NSURLSessionTaskDelegateImpl;
}(NSObject));
var sessionTaskDelegateInstance = NSURLSessionTaskDelegateImpl.new();
var defaultSession;
function ensureDefaultSession() {
    if (!defaultSession) {
        defaultSession = NSURLSession.sessionWithConfigurationDelegateDelegateQueue(sessionConfig, null, queue);
    }
}
var sessionNotFollowingRedirects;
function ensureSessionNotFollowingRedirects() {
    if (!sessionNotFollowingRedirects) {
        sessionNotFollowingRedirects = NSURLSession.sessionWithConfigurationDelegateDelegateQueue(sessionConfig, sessionTaskDelegateInstance, queue);
    }
}
var imageSource;
function ensureImageSource() {
    if (!imageSource) {
        imageSource = require("image-source");
    }
}
var fs;
function ensureFileSystem() {
    if (!fs) {
        fs = require("file-system");
    }
}
function request(options) {
    return new Promise(function (resolve, reject) {
        if (!options.url) {
            reject(new Error("Request url was empty."));
            return;
        }
        try {
            var network = domainDebugger.getNetwork();
            var debugRequest_1 = network && network.create();
            var urlRequest = NSMutableURLRequest.requestWithURL(NSURL.URLWithString(options.url));
            urlRequest.HTTPMethod = types.isDefined(options.method) ? options.method : GET;
            urlRequest.setValueForHTTPHeaderField(USER_AGENT, USER_AGENT_HEADER);
            if (options.headers) {
                for (var header in options.headers) {
                    urlRequest.setValueForHTTPHeaderField(options.headers[header] + "", header);
                }
            }
            if (types.isString(options.content) || options.content instanceof FormData) {
                urlRequest.HTTPBody = NSString.stringWithString(options.content.toString()).dataUsingEncoding(4);
            }
            if (types.isNumber(options.timeout)) {
                urlRequest.timeoutInterval = options.timeout / 1000;
            }
            var session = void 0;
            if (types.isBoolean(options.dontFollowRedirects) && options.dontFollowRedirects) {
                ensureSessionNotFollowingRedirects();
                session = sessionNotFollowingRedirects;
            }
            else {
                ensureDefaultSession();
                session = defaultSession;
            }
            var dataTask = session.dataTaskWithRequestCompletionHandler(urlRequest, function (data, response, error) {
                if (error) {
                    reject(new Error(error.localizedDescription));
                }
                else {
                    var headers_1 = {};
                    if (response && response.allHeaderFields) {
                        var headerFields = response.allHeaderFields;
                        headerFields.enumerateKeysAndObjectsUsingBlock(function (key, value, stop) {
                            addHeader(headers_1, key, value);
                        });
                    }
                    if (debugRequest_1) {
                        debugRequest_1.mimeType = response.MIMEType;
                        debugRequest_1.data = data;
                        var debugResponse = {
                            url: options.url,
                            status: response.statusCode,
                            statusText: NSHTTPURLResponse.localizedStringForStatusCode(response.statusCode),
                            headers: headers_1,
                            mimeType: response.MIMEType,
                            fromDiskCache: false
                        };
                        debugRequest_1.responseReceived(debugResponse);
                        debugRequest_1.loadingFinished();
                    }
                    resolve({
                        content: {
                            raw: data,
                            toString: function (encoding) { return NSDataToString(data, encoding); },
                            toJSON: function (encoding) { return parseJSON(NSDataToString(data, encoding)); },
                            toImage: function () {
                                ensureImageSource();
                                return new Promise(function (resolve, reject) {
                                    UIImage.tns_decodeImageWithDataCompletion(data, function (image) {
                                        if (image) {
                                            resolve(imageSource.fromNativeSource(image));
                                        }
                                        else {
                                            reject(new Error("Response content may not be converted to an Image"));
                                        }
                                    });
                                });
                            },
                            toFile: function (destinationFilePath) {
                                ensureFileSystem();
                                if (!destinationFilePath) {
                                    destinationFilePath = http_request_common_1.getFilenameFromUrl(options.url);
                                }
                                if (data instanceof NSData) {
                                    var file = fs.File.fromPath(destinationFilePath);
                                    data.writeToFileAtomically(destinationFilePath, true);
                                    return file;
                                }
                                else {
                                    reject(new Error("Cannot save file with path: " + destinationFilePath + "."));
                                }
                            }
                        },
                        statusCode: response.statusCode,
                        headers: headers_1
                    });
                }
            });
            if (options.url && debugRequest_1) {
                var request_1 = {
                    url: options.url,
                    method: "GET",
                    headers: options.headers
                };
                debugRequest_1.requestWillBeSent(request_1);
            }
            dataTask.resume();
        }
        catch (ex) {
            reject(ex);
        }
    });
}
exports.request = request;
function NSDataToString(data, encoding) {
    var code = NSUTF8StringEncoding;
    if (encoding === HttpResponseEncoding.GBK) {
        code = 1586;
    }
    var encodedString = NSString.alloc().initWithDataEncoding(data, code);
    if (!encodedString) {
        code = NSISOLatin1StringEncoding;
        encodedString = NSString.alloc().initWithDataEncoding(data, code);
    }
    return encodedString.toString();
}
function addHeader(headers, key, value) {
    if (!headers[key]) {
        headers[key] = value;
    }
    else if (Array.isArray(headers[key])) {
        headers[key].push(value);
    }
    else {
        var values = [headers[key]];
        values.push(value);
        headers[key] = values;
    }
}
exports.addHeader = addHeader;
//# sourceMappingURL=http-request.ios.js.map