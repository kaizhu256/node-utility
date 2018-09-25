/* istanbul instrument in package utility2 */
/* jslint utility2:true */
/*jslint
    bitwise: true,
    browser: true,
    multivar: true,
    node: true,
    this: true,
*/
/*global global*/
(function () {
"use strict";
var local;



// run shared js-env code - init-before
(function () {



// init local
local = {};
// init isBrowser
local.isBrowser = (
    typeof window === "object"
    && typeof window.XMLHttpRequest === "function"
    && window.document
    && typeof window.document.querySelectorAll === "function"
);
// init global
local.global = local.isBrowser
? window
: global;
// re-init local
local = (local.global.utility2 || require("./lib.utility2.js")).requireReadme();
local.global.local = local;
// init test
local.testRunDefault(local);
}());



// run shared js-env code - function
(function () {



local._testCase_testRunDefault_failure = function (options, onError) {
/*
 * this function will test testRunDefault's failure handling-behavior
 */
    // test failure from callback handling-behavior
    onError(local.errorDefault);
    // test failure from multiple-callback handling-behavior
    onError(null, options);
    // test failure from ajax handling-behavior
    local.ajax({url: "/undefined"}, onError);
    // test failure from uncaught-uncaughtexception handling-behavior
    setTimeout(local.throwError);
    // test console.error handling-behavior
    local.testMock([
        [local.global, {__coverage__: null}]
    ], function (onError) {
        console.error();
        onError(null, options);
    }, local.onErrorThrow);
    // test failure from thrown error handling-behavior
    throw local.errorDefault;
};

local.testCase_FormData_default = function (options, onError) {
/*
 * this function will test FormData's default handling-behavior
 */
    options = {};
    options.blob1 = new local.Blob(["aa", "bb", local.stringHelloEmoji, 0]);
    options.blob2 = new local.Blob(["aa", "bb", local.stringHelloEmoji, 0], {
        type: "text/plain; charset=utf-8"
    });
    options.data = new local.FormData();
    options.data.append("text1", "aabb" + local.stringHelloEmoji + "0");
    // test file-upload handling-behavior
    options.data.append("file1", options.blob1);
    // test file-upload and filename handling-behavior
    options.data.append("file2", options.blob2, "filename2.txt");
    options.method = "POST";
    options.url = "/test.echo";
    local.ajax(options, function (error, xhr) {
        // validate no error occurred
        local.assert(!error, error);
        // validate responseText
        local.assert(xhr.responseText.indexOf(
            "\r\nContent-Disposition: form-data; " +
            "name=\"text1\"\r\n\r\naabbhello \ud83d\ude01\n0\r\n"
        ) >= 0, xhr.responseText);
        local.assert(xhr.responseText.indexOf(
            "\r\nContent-Disposition: form-data; " +
            "name=\"file1\"\r\n\r\naabbhello \ud83d\ude01\n0\r\n"
        ) >= 0, xhr.responseText);
        local.assert(xhr.responseText.indexOf(
            "\r\nContent-Disposition: form-data; name=\"file2\"; " +
            "filename=\"filename2.txt\"\r\nContent-Type: text/plain; " +
            "charset=utf-8\r\n\r\naabbhello \ud83d\ude01\n0\r\n"
        ) >= 0, xhr.responseText);
        onError(null, options);
    });
};

local.testCase_FormData_error = function (options, onError) {
/*
 * this function will test FormData's error handling-behavior
 */
    local.testMock([
        [local.FormData.prototype, {read: function (onError) {
            onError(local.errorDefault);
        }}]
    ], function (onError) {
        local.ajax({
            data: new local.FormData(),
            method: "POST",
            url: "/test.echo"
        }, function (error) {
            // validate error occurred
            local.assert(error, error);
            onError(null, options);
        });
    }, onError);
};

local.testCase_FormData_nullCase = function (options, onError) {
/*
 * this function will test FormData's null-case handling-behavior
 */
    local.ajax({
        data: new local.FormData(),
        method: "POST",
        url: "/test.echo"
    }, function (error, xhr) {
        // validate no error occurred
        local.assert(!error, error);
        // validate responseText
        local.assert((/\r\n\r\n$/).test(xhr.responseText), xhr.responseText);
        onError(null, options);
    });
};

local.testCase_ajaxProgressUpdate_default = function (options, onError) {
/*
 * this function will test ajaxProgressUpdate's default handling-behavior
 */
    options = 0;
    local.testMock([
        [local, {ajaxProgressCounter: 0, ajaxProgressState: 0}],
        [local.global, {clearTimeout: local.nop, setTimeout: function (fnc) {
            options += 1;
            local.ajaxProgressState = options % 3;
            fnc();
        }}]
    ], function (onError) {
        // update ajax-progress
        local.ajaxProgressUpdate();
        // validate data
        local.assertJsonEqual(local.ajaxProgressCounter, 0);
        local.assertJsonEqual(local.ajaxProgressState, 2);
        // update ajax-progress
        local.ajaxProgressUpdate();
        // validate data
        local.assertJsonEqual(local.ajaxProgressCounter, 0);
        local.assertJsonEqual(local.ajaxProgressState, 1);
        // update ajax-progress
        local.ajaxProgressUpdate();
        // validate data
        local.assertJsonEqual(local.ajaxProgressCounter, 0);
        local.assertJsonEqual(local.ajaxProgressState, 0);
        onError(null, options);
    }, onError);
};

local.testCase_ajax_abort = function (options, onError) {
/*
 * this function will test ajax's abort handling-behavior
 */
    options = local.ajax({url: "/test.timeout"}, function (error) {
        // validate error occurred
        local.assert(error, error);
        onError(null, options);
    });
    // test multiple-callback handling-behavior
    options.onEvent({type: "abort"});
    options.abort();
    options.abort();
};

local.testCase_ajax_cache = function (options, onError) {
/*
 * this function will test ajax's cache handling-behavior
 */
    if (local.isBrowser) {
        onError(null, options);
        return;
    }
    options = {};
    local.onNext(options, function (error, data) {
        switch (options.modeNext) {
        case 1:
            // test http GET handling-behavior
            local.ajax({url: "assets.hello.txt"}, options.onNext);
            break;
        case 2:
            // validate responseText
            local.assertJsonEqual(data.responseText, local.stringHelloEmoji);
            // test http GET 304 cache handling-behavior
            local.ajax({
                headers: {
                    "If-Modified-Since": new Date(Date.now() + 0xffff).toUTCString()
                },
                url: "assets.hello.txt"
            }, options.onNext);
            break;
        case 3:
            // validate statusCode
            local.assertJsonEqual(data.statusCode, 304);
            options.onNext();
            break;
        default:
            onError(error, options);
        }
    });
    options.modeNext = 0;
    options.onNext();
};

local.testCase_ajax_echo = function (options, onError) {
    // test /test.echo handling-behavior
    local.ajax({
        _aa: "aa",
        aa: "aa",
        data: "aa",
        // test request-header handling-behavior
        headers: {"X-Request-Header-Test": "aa"},
        method: "POST",
        // test modeDebug handling-behavior
        modeDebug: true,
        url: "/test.echo"
    }, function (error, xhr) {
        // validate no error occurred
        local.assert(!error, error);
        // validate statusCode
        local.assertJsonEqual(xhr.statusCode, 200);
        // validate response
        local.assert((/\r\naa$/).test(xhr.responseText), xhr.responseText);
        local.assert(
            (/\r\nx-request-header-test: aa\r\n/).test(xhr.responseText),
            xhr.responseText
        );
        // validate responseHeaders
        local.assertJsonEqual(xhr.responseHeaders["x-response-header-test"], "bb");
        // validate properties
        local.assertJsonEqual(xhr._aa, undefined);
        local.assertJsonEqual(xhr.aa, "aa");
        onError(null, options);
    });
};

local.testCase_ajax_error = function (options, onError) {
/*
 * this function will test ajax's error handling-behavior
 */
    local.onParallelList({list: [{
        // test 404-not-found-error handling-behavior
        url: "/test.error-404"
    }, {
        // test 500-internal-server-error handling-behavior
        url: "/test.error-500"
    }, {
        // test undefined-error handling-behavior
        url: "/test.error-undefined"
    }, {
        // test corsForwardProxyHost handling-behavior
        corsForwardProxyHost: "https://undefined:0",
        location: {host: "undefined.github.io"},
        timeout: 1,
        // test undefined-https-url handling-behavior
        url: "https://undefined:0"
    }]}, function (options2, onParallel) {
        onParallel.counter += 1;
        local.ajax(options2.element, function (error) {
            // validate error occurred
            local.assert(error, error);
            onParallel(null, options);
        });
    }, onError);
};

local.testCase_ajax_file = function (options, onError) {
/*
 * this function will test ajax's file handling-behavior
 */
    local.ajax({url: "LICENSE"}, function (error, xhr) {
        // validate no error occurred
        local.assert(!error, error);
        // validate statusCode
        local.assertJsonEqual(xhr.statusCode, 200);
        onError(null, options);
    });
};

local.testCase_ajax_post = function (options, onError) {
/*
 * this function will test ajax's POST handling-behavior
 */
    // test /test.body handling-behavior
    local.onParallelList({list: [
        "",
        "arraybuffer",
        "text"
    ]}, function (responseType, onParallel) {
        responseType = responseType.element;
        onParallel.counter += 1;
        local.ajax({
            data: responseType === "arraybuffer"
                // test POST buffer-data handling-behavior
            ? local.bufferCreate("aa")
                // test POST string-data handling-behavior
            : "aa",
            method: "POST",
            // test nodejs response handling-behavior
            responseType: responseType,
            url: "/test.body"
        }, function (error, xhr) {
            // validate no error occurred
            local.assert(!error, error);
            // validate statusCode
            local.assertJsonEqual(xhr.statusCode, 200);
            // validate responseText
            switch (responseType) {
            case "arraybuffer":
                local.assertJsonEqual(xhr.responseBuffer.byteLength, 2);
                local.assertJsonEqual(xhr.responseBuffer[0], 97);
                local.assertJsonEqual(xhr.responseBuffer[1], 97);
                break;
            default:
                local.assertJsonEqual(xhr.responseText, "aa");
            }
            onParallel(null, options);
        });
    }, onError);
};

local.testCase_ajax_responseType = function (options, onError) {
/*
 * this function will test ajax's responseType handling-behavior
 */
    // test /test.body handling-behavior
    local.onParallelList({list: [
        "",
        "arraybuffer",
        "text"
    ]}, function (responseType, onParallel) {
        responseType = responseType.element;
        onParallel.counter += 1;
        local.ajax({
            // test nodejs response handling-behavior
            responseType: responseType,
            url: "assets.hello.txt"
        }, function (error, xhr) {
            // validate no error occurred
            local.assert(!error, error);
            // validate statusCode
            local.assertJsonEqual(xhr.statusCode, 200);
            // validate responseText
            switch (responseType) {
            case "arraybuffer":
                local.assertJsonEqual(xhr.responseBuffer.byteLength, 11);
                local.assertJsonEqual(
                    Array.from(xhr.responseBuffer),
                    [0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0xf0, 0x9f, 0x98, 0x81, 0x0a]
                );
                break;
            default:
                local.assertJsonEqual(xhr.responseText, local.stringHelloEmoji);
            }
            onParallel(null, options);
        });
    }, onError);
};

local.testCase_ajax_standalone = function (options, onError) {
/*
 * this function will test ajax's standalone handling-behavior
 */
    var onParallel;
    onParallel = local.onParallel(onError);
    onParallel.counter += 1;
    local.testMock([
        [local, {utility2: null}]
    ], function (onError) {
        ["", "arraybuffer"].forEach(function (responseType) {
            // test default handling-behavior
            onParallel.counter += 1;
            local.ajax({
                responseType: responseType,
                url: local.isBrowser
                ? location.href
                : local.serverLocalHost
            }, function (error, xhr) {
                // validate statusCode
                local.assertJsonEqual(xhr.statusCode, 200);
                // validate no error occurred
                local.assert(!error, error);
                onParallel();
            });
            // test error handling-behavior
            onParallel.counter += 1;
            local.ajax({
                responseType: responseType,
                undefined: undefined,
                url: (
                    local.isBrowser
                    ? location.href.replace((/\?.*$/), "")
                    : local.serverLocalHost
                ) + "/undefined"
            }, function (error, xhr) {
                // validate statusCode
                local.assertJsonEqual(xhr.statusCode, 404);
                // validate error occurred
                local.assert(error, error);
                onParallel();
            });
        });
        onError(null, options);
    }, onParallel);
};

local.testCase_ajax_timeout = function (options, onError) {
/*
 * this function will test ajax's timeout handling-behavior
 */
    setTimeout(function () {
        local.ajax({timeout: 1, url: "/test.timeout"}, function (error) {
            // validate error occurred
            local.assert(error, error);
            onError(null, options);
        });
    }, 1000);
};

local.testCase_assertXxx_default = function (options, onError) {
/*
 * this function will test assertXxx's default handling-behavior
 */
    // test assertion passed
    local.assert(true, true);
    // test assertion failed with undefined message
    local.tryCatchOnError(function () {
        local.assert(null);
    }, function (error) {
        // validate error occurred
        local.assert(error, error);
        // validate error-message
        local.assertJsonEqual(error.message, "");
    });
    // test assertion failed with string message
    local.tryCatchOnError(function () {
        local.assert(null, "aa");
    }, function (error) {
        // validate error occurred
        local.assert(error, error);
        // validate error-message
        local.assertJsonEqual(error.message, "aa");
    });
    // test assertion failed with error object
    local.tryCatchOnError(function () {
        local.assert(null, local.errorDefault);
    }, function (error) {
        // validate error occurred
        local.assert(error, error);
    });
    // test assertion failed with json object
    local.tryCatchOnError(function () {
        local.assert(null, {aa: 1});
    }, function (error) {
        // validate error occurred
        local.assert(error, error);
        // validate error-message
        local.assertJsonEqual(error.message, "{\"aa\":1}");
    });
    ["", 0, false, null, undefined].forEach(function (aa, ii) {
        ["", 0, false, null, undefined].forEach(function (bb, jj) {
            if (ii === jj) {
                // test assertJsonEqual's handling-behavior
                local.assertJsonEqual(aa, bb);
            } else {
                // test assertJsonNotEqual's handling-behavior
                local.assertJsonNotEqual(aa, bb);
            }
        });
    });
    onError(null, options);
};

local.testCase_base64Xxx_default = function (options, onError) {
/*
 * this function will test base64Xxx's default handling-behavior
 */
    options = {};
    options.base64 = local.base64FromBuffer(
        local.stringCharsetAscii + local.stringHelloEmoji
    );
    // test null-case handling-behavior
    local.assertJsonEqual(local.base64FromBuffer(), "");
    local.assertJsonEqual(local.bufferToString(local.base64ToBuffer()), "");
    local.assertJsonEqual(local.base64ToString(), "");
    local.assertJsonEqual(local.base64FromBuffer(local.base64ToBuffer()), "");
    local.assertJsonEqual(local.base64FromBuffer(local.base64ToString()), "");
    // test identity handling-behavior
    local.assertJsonEqual(
        local.base64FromBuffer(local.base64ToBuffer(options.base64)),
        options.base64
    );
    local.assertJsonEqual(
        local.base64FromBuffer(local.base64ToString(options.base64)),
        options.base64
    );
    onError(null, options);
};

local.testCase_blobRead_default = function (options, onError) {
/*
 * this function will test blobRead's default handling-behavior
 */
    local.onParallelList({list: [
        new local.Blob(["aa", "bb", local.stringHelloEmoji, 0]),
        new local.Blob(["aa", "bb", local.stringHelloEmoji, 0], {
            type: "text/plain; charset=utf-8"
        })
    ]}, function (options2, onParallel) {
        onParallel.counter += 1;
        [null, "dataURL", "text"].forEach(function (encoding) {
            onParallel.counter += 1;
            local.blobRead(options2.element, encoding, function (error, data) {
                // validate no error occurred
                local.assert(!error, error);
                // validate data
                switch (encoding) {
                case "dataURL":
                    if (options2.ii === 0) {
                        local.assertJsonEqual(
                            data,
                            "data:;base64,YWFiYmhlbGxvIPCfmIEKMA=="
                        );
                        break;
                    }
                    local.assertJsonEqual(
                        data,
                        "data:text/plain; charset=utf-8;base64,YWFiYmhlbGxvIPCfmIEKMA=="
                    );
                    break;
                case "text":
                    local.assertJsonEqual(data, "aabbhello \ud83d\ude01\n0");
                    break;
                default:
                    local.assertJsonEqual(
                        local.bufferToString(data),
                        "aabbhello \ud83d\ude01\n0"
                    );
                }
                onParallel(null, options);
            });
        });
        onParallel(null, options);
    }, onError);
};

local.testCase_blobRead_error = function (options, onError) {
/*
 * this function will test blobRead's error handling-behavior
 */
    if (!local.isBrowser) {
        onError(null, options);
        return;
    }
    local.testMock([
        [local.global.FileReader.prototype, {readAsArrayBuffer: function () {
            this.onabort({type: "abort"});
            this.onerror({type: "error"});
        }}]
    ], function (onError) {
        local.blobRead(null, null, function (error) {
            // validate error occurred
            local.assert(error, error);
        });
        onError(null, options);
    }, onError);
};

local.testCase_browserTest_electron = function (options, onError) {
/*
 * this function will test browserTest's electron handling-behavior
 */
    options = function (aa, bb, cc) {
        [aa, bb, cc].forEach(function (fnc, ii) {
            if (typeof fnc === "function") {
                fnc(ii && options);
                options.onNext(null, options);
                options.utility2_testReportSave();
            }
        });
        return options;
    };
    [
        "BrowserWindow",
        "addEventListener",
        "app",
        "browserWindow",
        "capturePage",
        "document",
        "documentElement",
        "electron",
        "fileCoverage",
        "fileElectronHtml",
        "fileScreenshot",
        "fileTestReport",
        "fs",
        "ipcRenderer",
        "loadURL",
        "modeCoverageMerge",
        "on",
        "once",
        "process",
        "prototype",
        "rename",
        "send",
        "toPNG",
        "unref",
        "window",
        "writeFile"
    ].forEach(function (key) {
        options[key] = key.indexOf("file") === 0
        ? "undefined"
        : options;
    });
    options.ipcMain = {on: function (_, fnc) {
        ["html", "testReport", "undefined"].forEach(function (type) {
            [
                "<div></div>",
                null,
                {},
                {testPlatformList: [{}]},
                {coverage: {}, testPlatformList: [{}]}
            ].forEach(function (data) {
                options.isDoneTestReport = null;
                fnc(_, type, data);
            });
        });
    }};
    options.utility2_testReportSave = local.nop;
    local.testMock([
        [local.global, {
            setTimeout: options,
            utility2_testReport: null
        }],
        [local, {
            fs: options,
            fsReadFileOrEmptyStringSync: function () {
                return "";
            },
            fsWriteFileWithMkdirpSync: options,
            onParallel: options
        }]
    ], function (onError) {
        ["test", "undefined"].forEach(function (modeBrowserTest) {
            [1, 10, 11, 20, 100].forEach(function (modeNext) {
                options.modeBrowserTest = modeBrowserTest;
                options.modeNext = modeNext;
                switch (modeNext) {
                case 100:
                    local.tryCatchOnError(function () {
                        local.browserTest({modeNext: modeNext}, options);
                    }, local.nop);
                    break;
                default:
                    local.browserTest(options, options);
                }
            });
        });
        onError(null, options);
    }, onError);
};

local.testCase_browserTest_error = function (options, onError) {
/*
 * this function will test browserTest's error handling-behavior
 */
    var onParallel;
    if (local.isBrowser) {
        onError(null, options);
        return;
    }
    onParallel = local.onParallel(onError);
    onParallel.counter += 1;
    onParallel.counter += 1;
    local.browserTest({
        // test timeput-error handling-behavior
        timeoutDefault: 1,
        // test local-url handling-behavior
        url: "tmp/build/test-report.html"
    }, function (error) {
        // validate error occurred
        local.assert(error, error);
        onParallel();
    });
    onParallel(null, options);
};

local.testCase_bufferCreate_default = function (options, onError) {
/*
 * this function will test bufferCreate's default handling-behavior
 */
    options = {};
    options.text1 = "";
    options.ii = 0;
    while (options.ii < 0x10000) {
        options.text1 += String.fromCodePoint(options.ii);
        options.ii += 1;
    }
    options.ii = 0x100000;
    while (options.ii < 0x110000) {
        options.text1 += String.fromCodePoint(options.ii);
        options.ii += 0x100;
    }
    // test utf8 handling-behavior
    options.bff1 = local.bufferCreate(options.text1);
    options.text2 = local.bufferToString(options.bff1);
    local.assertJsonEqual(options.text2, local.bufferToString(options.text2));
    onError(null, options);
};

local.testCase_bufferIndexOfSubBuffer_default = function (options, onError) {
/*
 * this function will test bufferIndexOfSubBuffer's default handling-behavior
 */
    [
        {buffer: "", subBuffer: "", validate: 0},
        {buffer: "", subBuffer: "aa", validate: -1},
        {buffer: "aa", subBuffer: "", validate: 0},
        {buffer: "aa", subBuffer: "aa", validate: 0},
        {buffer: "aa", subBuffer: "bb", validate: -1},
        {buffer: "aaaa", subBuffer: "aa", validate: 0},
        {buffer: "aabb", subBuffer: "aa", validate: 0},
        {buffer: "aabb", subBuffer: "bb", validate: 2},
        {buffer: "aabbaa", subBuffer: "aa", validate: 0},
        {buffer: "aabbaa", subBuffer: "bb", validate: 2},
        {buffer: "aabbaa", subBuffer: "ba", validate: 3}
    ].forEach(function (options) {
        local.assertJsonEqual(local.bufferIndexOfSubBuffer(
            local.bufferCreate(options.buffer),
            local.bufferCreate(options.subBuffer),
            options.fromIndex
        ), options.validate);
    });
    onError(null, options);
};

local.testCase_bufferValidateAndCoerce_error = function (options, onError) {
/*
 * this function will test bufferValidateAndCoerce's error handling-behavior
 */
    local.tryCatchOnError(function () {
        local.bufferValidateAndCoerce(0);
    }, local.nop);
    // validate error occurred
    local.assert(local._debugTryCatchError, local._debugTryCatchError);
    local.tryCatchOnError(function () {
        local.bufferValidateAndCoerce({});
    }, local.nop);
    // validate error occurred
    local.assert(local._debugTryCatchError, local._debugTryCatchError);
    onError(null, options);
};

local.testCase_buildApidoc_default = function (options, onError) {
/*
 * this function will test buildApidoc's default handling-behavior
 */
    if (local.env.npm_config_mode_test_fast || local.isBrowser) {
        onError(null, options);
        return;
    }
    // test $npm_config_mode_coverage=all handling-behavior
    local.testMock([
        [local.env, {npm_config_mode_coverage: "all"}]
    ], function (onError) {
        local.buildApidoc(null, onError);
    }, local.onErrorThrow);
    // test $npm_package_buildCustomOrg handling-behavior
    local.testMock([
        [local.env, {npm_package_buildCustomOrg: "electron-lite"}]
    ], function (onError) {
        local.buildApidoc({}, onError);
    }, local.onErrorThrow);
    local.buildApidoc({blacklistDict: {}}, onError);
};

local.testCase_buildApp_default = function (options, onError) {
/*
 * this function will test buildApp's default handling-behavior
 */
    if (local.env.npm_config_mode_test_fast || local.isBrowser) {
        onError(null, options);
        return;
    }
    local.testCase_buildReadme_default(options, local.onErrorThrow);
    local.testCase_buildLib_default(options, local.onErrorThrow);
    local.testCase_buildTest_default(options, local.onErrorThrow);
    local.buildApp({assetsList: [{
        file: "/assets.hello.txt",
        url: "/assets.hello.txt"
    }, {
        file: "/assets.script_only.html",
        url: "/assets.script_only.html"
    }, {
        file: "/assets.utility2.lib.db.js",
        url: "/assets.utility2.lib.db.js"
    }, {
        file: "/assets.utility2.lib.istanbul.js",
        url: "/assets.utility2.lib.istanbul.js"
    }, {
        file: "/assets.utility2.lib.jslint.js",
        url: "/assets.utility2.lib.jslint.js"
    }, {
        file: "/assets.utility2.lib.marked.js",
        url: "/assets.utility2.lib.marked.js"
    }, {
        file: "/assets.utility2.lib.sjcl.js",
        url: "/assets.utility2.lib.sjcl.js"
    }, {
        file: "/assets.utility2.lib.uglifyjs.js",
        url: "/assets.utility2.lib.uglifyjs.js"
    }, {
        file: "/assets.utility2.rollup.js",
        url: "/assets.utility2.rollup.js"
    }]}, onError);
};

local.testCase_buildCustomOrg_default = function (options, onError) {
/*
 * this function will test buildCustomOrg's default handling-behavior
 */
    if (local.isBrowser) {
        onError(null, options);
        return;
    }
    local.testMock([
        [local.env, {GITHUB_ORG: "", npm_package_buildCustomOrg: "electron-lite"}],
        [local.fs, {writeFileSync: local.nop}],
        [local.global, {setTimeout: function (onError) {
            onError(null, options);
        }}],
        [process, {on: function (options, onError) {
            // test error handling-behavior
            onError(local.errorDefault, options);
        }}]
    ], function (onError) {
        // test npmdoc handling-behavior
        local.env.GITHUB_ORG = "npmdoc";
        local.buildCustomOrg({}, local.onErrorThrow);
        // test npmtest handling-behavior
        local.env.GITHUB_ORG = "npmtest";
        local.buildCustomOrg({}, local.onErrorThrow);
        // test scrapeitall handling-behavior
        local.env.GITHUB_ORG = "scrapeitall";
        local.buildCustomOrg({}, local.onErrorThrow);
        onError(null, options);
    }, local.onErrorThrow);
    local.buildCustomOrg({}, onError);
};

local.testCase_buildLib_default = function (options, onError) {
/*
 * this function will test buildLib's default handling-behavior
 */
    if (local.isBrowser) {
        onError(null, options);
        return;
    }
    local.testMock([
        [local, {
            // test duplicate local function handling-behavior
            fsReadFileOrEmptyStringSync: function () {
                return "local.nop = function () {\n" +
                        "/*\n" +
                        " * this function will do nothing\n" +
                        " */\n" +
                        "    return;\n" +
                        "};\n" +
                        "local.nop = function () {\n" +
                        "/*\n" +
                        " * this function will do nothing\n" +
                        " */\n" +
                        "    return;\n" +
                        "};\n";
            },
            templateRenderMyApp: function () {
                return local.assetsDict["/assets.my_app.template.js"];
            }
        }],
        [local.fs, {
            // test customize-local handling-behavior
            existsSync: function () {
                return true;
            },
            writeFileSync: local.nop
        }]
    ], function (onError) {
        local.buildLib({}, onError);
    }, local.onErrorThrow);
    local.buildLib({}, onError);
};

local.testCase_buildReadme_default = function (options, onError) {
/*
 * this function will test buildReadme's default handling-behavior
 */
    if (local.isBrowser) {
        onError(null, options);
        return;
    }
    options = {};
    options.customize = function () {
        options.dataFrom = options.dataFrom
            // test shDeployCustom handling-behavior
        .replace("# shDeployCustom", "  shDeployCustom")
            // test no-assets.index.template.html handling-behavior
        .replace("assets.utility2.template.html", "");
        local.env.npm_package_private = "";
    };
    // test shNpmTestPublished handling-behavior
    options.dataFrom = local.fs.readFileSync("README.md", "utf8")
    .replace("#\u0021! shNpmTestPublished", "shNpmTestPublished");
    local.testMock([
        [local, {
            fsWriteFileWithMkdirpSync: local.nop
        }],
        [local.env, {
            npm_package_buildCustomOrg: "",
            npm_package_private: "1",
            npm_package_name: "undefined"
        }],
        [local.assetsDict, {
            // test no-assets.utility2.template.html handling-behavior
            "/assets.index.template.html": "",
            // test customize example.js handling-behavior
            "/index.html": ""
        }]
    ], function (onError) {
        local.buildReadme(options, onError);
        // test $npm_package_buildCustomOrg handling-behavior
        local.env.npm_package_buildCustomOrg = "aa";
        options.dataFrom = options.dataFrom
            // test no-shNpmTestPublished handling-behavior
        .replace("  shNpmTestPublished", "# shNpmTestPublished");
        local.buildReadme(options, onError);
        onError(null, options);
    }, local.onErrorThrow);
    options = {};
    options.customize = function () {
        // search-and-replace - customize dataTo
        [
            // customize quickstart example.js
            (/# quickstart example.js[\S\s]*?istanbul instrument in package/),
            // customize quickstart-footer
            (/>download standalone app<[^`]*?"utility2FooterDiv"/),
            (/```[^`]*?\n# extra screenshots/),
            // customize build-script
            (/# run shBuildCi[^`]*?```/)
        ].forEach(function (rgx) {
            options.dataFrom.replace(rgx, function (match0) {
                options.dataTo = options.dataTo.replace(rgx, match0);
            });
        });
    };
    local.buildReadme(options, onError);
};

local.testCase_buildXxx_default = function (options, onError) {
/*
 * this function will test buildXxx's default handling-behavior
 */
    local.testMock([
        [local, {
            assetsDict: {"/": ""},
            browserTest: local.nop,
            buildApidoc: local.nop,
            buildCustomOrg: local.nop,
            buildLib: local.nop,
            buildReadme: local.nop,
            buildTest: local.nop,
            testCase_buildReadme_default: local.nop,
            testCase_buildLib_default: local.nop,
            testCase_buildTest_default: local.nop,
            testCase_buildCustomOrg_default: local.nop
        }]
    ], function (onError) {
        local._testCase_buildApidoc_default(null, local.nop);
        local._testCase_buildApp_default(null, local.nop);
        local._testCase_buildCustomOrg_default(null, local.nop);
        local._testCase_buildLib_default(null, local.nop);
        local._testCase_buildReadme_default(null, local.nop);
        local._testCase_buildTest_default(null, local.nop);
        local._testCase_webpage_default(null, local.nop);
        local.assetsDict["/"] = "<script src=\"assets.test.js\"></script>";
        local._testCase_webpage_default(null, local.nop);
        onError(null, options);
    }, onError);
};

local.testCase_childProcessSpawnWithTimeout_default = function (options, onError) {
/*
 * this function will test childProcessSpawnWithTimeout's default handling-behavior
 */
    var onParallel;
    if (local.env.npm_config_mode_test_fast || local.isBrowser) {
        onError(null, options);
        return;
    }
    options = {};
    onParallel = local.onParallel(onError);
    onParallel.counter += 1;
    // test default handling-behavior
    onParallel.counter += 1;
    local.childProcessSpawnWithTimeout("ls")
    .on("error", onParallel)
    .on("exit", function (exitCode, signal) {
            // validate exitCode
        local.assertJsonEqual(exitCode, 0);
            // validate signal
        local.assertJsonEqual(signal, null);
        onParallel(null, options);
    });
    // test timeout handling-behavior
    onParallel.counter += 1;
    local.testMock([
        [local, {timeoutDefault: 1000}]
    ], function (onError) {
        options.childProcess = local.childProcessSpawnWithTimeout("sleep", [5000]);
        onError(null, options);
    }, local.onErrorThrow);
    options.childProcess
    .on("error", onParallel)
    .on("exit", function (exitCode, signal) {
            // validate exitCode
        local.assertJsonEqual(exitCode, null);
            // validate signal
        local.assertJsonEqual(signal, "SIGKILL");
        onParallel(null, options);
    });
    onParallel(null, options);
};

local.testCase_childProcessSpawnWithUtility2_error = function (options, onError) {
/*
 * this function will test childProcessSpawnWithTimeout's error handling-behavior
 */
    if (local.env.npm_config_mode_test_fast || local.isBrowser) {
        onError(null, options);
        return;
    }
    local.testMock([
        // test __dirname handling-behavior
        [process.env, {npm_config_dir_utility2: ""}]
    ], function (onError) {
        local.local.childProcessSpawnWithUtility2("undefined", function (error) {
            // validate error occurred
            local.assert(error, error);
        });
        onError(null, options);
    }, onError);
};

local.testCase_cliRun_default = function (options, onError) {
/*
 * this function will test cliRun's default handling-behavior
 */
    if (local.isBrowser) {
        onError(null, options);
        return;
    }
    local.testMock([
        [local, {replStart: null}],
        [local.cliDict, {_default: local.nop, _help: null}],
        [local.repl, {start: local.nop}],
        [local.vm, {runInThisContext: local.nop}],
        [process, {argv: []}]
    ], function (onError) {
        // test default handling-behavior
        local.cliRun({rgxComment: (/^/)});
        // test builtin handling-behavior
        [
            "--eval",
            "--help",
            "--interactive",
            "--version",
            "undefined"
        ].forEach(function (key) {
            process.argv[2] = key;
            local.cliRun();
        });
        // test error handling-behavior
        local.cliDict._default = null;
        local.cliDict._help = null;
        local.tryCatchOnError(local.cliRun, local.nop);
        onError(null, options);
    }, onError);
};

local.testCase_corsBackendHostInject_default = function (options, onError) {
/*
 * this function will corsBackendHostInject's default handling-behavior
 */
    // test null-case handling-behavior
    local.assertJsonEqual(local.corsBackendHostInject(), undefined);
    // test override-all handling-behavior
    local.assertJsonEqual(local.corsBackendHostInject(
        "cc.com",
        "aa-alpha.bb.com",
        null,
        {host: "github.io", pathname: "/build..beta..travis-ci.org/"}
    ), "aa-beta.bb.com");
    // test override-rgx handling-behavior
    local.assertJsonEqual(local.corsBackendHostInject(
        "cc/dd",
        "aa-alpha.bb.com/",
        (/(^cc\/)/m),
        {host: "github.io", pathname: "/build..beta..travis-ci.org/"}
    ), "aa-beta.bb.com/cc/dd");
    onError(null, options);
};

local.testCase_corsForwardProxyHostIfNeeded_default = function (options, onError) {
/*
 * this function will corsForwardProxyHostIfNeeded's default handling-behavior
 */
    if (!local.isBrowser) {
        onError(null, options);
        return;
    }
    local.assert(local.corsForwardProxyHostIfNeeded({
        location: {host: "undefined.github.io"},
        url: "https://example.com"
    }).indexOf(".herokuapp.com") >= 0);
    onError(null, options);
};

/* istanbul ignore next */
local.testCase_cryptoAesXxxCbcRawXxx_default = function (options, onError) {
/*
 * this function will cryptoAesXxxCbcRawXxx's default handling-behavior
 */
    if (!local.nop()) {
        onError(null, options);
        return;
    }
    options = {};
    local.onNext(options, function (error, data) {
        switch (options.modeNext) {
        case 1:
            // encrypt data
            options.data = local.bufferCreate("aa");
            options.key = "0123456789abcdef0123456789abcdef";
            options.mode = null;
            local.cryptoAesXxxCbcRawEncrypt(options, options.onNext);
            break;
        case 2:
            // decrypt data
            options.data = data.buffer;
            local.cryptoAesXxxCbcRawDecrypt(options, options.onNext);
            break;
        case 3:
            // validate data
            local.assertJsonEqual(local.bufferToString(data), "aa");
            options.onNext();
            break;
        case 4:
            // encrypt data - base64
            options.data = local.bufferCreate("aa");
            options.key =
                    "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
            options.mode = "base64";
            local.cryptoAesXxxCbcRawEncrypt(options, options.onNext);
            break;
        case 5:
            // decrypt data - base64
            options.data = data;
            local.cryptoAesXxxCbcRawDecrypt(options, options.onNext);
            break;
        case 6:
            // validate data
            local.assertJsonEqual(local.bufferToString(data), "aa");
            options.onNext();
            break;
        default:
            onError(error, options);
        }
    });
    options.modeNext = 0;
    options.onNext();
};

local.testCase_domElementRender_default = function (options, onError) {
/*
 * this function will test domElementRender's default handling-behavior
 */
    if (!local.isBrowser) {
        onError(null, options);
        return;
    }
    local.assertJsonEqual(local.domElementRender("<div>{{value}}</div>", {
        value: "aa"
    }).children[0].outerHTML, "<div>aa</div>");
    onError(null, options);
};

local.testCase_domQuerySelectorAllTagNameAndPrint_default = function (options, onError) {
/*
 * this function will test domQuerySelectorAllTagNameAndPrint's default handling-behavior
 */
    if (!local.isBrowser) {
        onError(null, options);
        return;
    }
    local.domQuerySelectorAllTagNameAndPrint("body");
    onError(null, options);
};

local.testCase_echo_default = function (options, onError) {
/*
 * this function will test echo's default handling-behavior
 */
    local.assertJsonEqual(local.echo("aa"), "aa");
    onError(null, options);
};

local.testCase_exit_error = function (options, onError) {
/*
 * this function will exit's error handling-behavior
 */
    local.exit("invalid-exitCode");
    onError(null, options);
};

local.testCase_fsWriteFileWithMkdirpSync_default = function (options, onError) {
/*
 * this function will test fsWriteFileWithMkdirpSync's default handling-behavior
 */
    if (local.isBrowser) {
        onError(null, options);
        return;
    }
    local.fsRmrSync("tmp/build/testCase_fsWriteFileWithMkdirpSync_default");
    // validate data
    local.assertJsonEqual(local.fsReadFileOrEmptyStringSync(
        "tmp/build/testCase_fsWriteFileWithMkdirpSync_default/aa.txt",
        "utf8"
    ), "");
    local.fsWriteFileWithMkdirpSync(
        "tmp/build/testCase_fsWriteFileWithMkdirpSync_default/aa.txt",
        "aa"
    );
    // validate data
    local.assertJsonEqual(local.fsReadFileOrEmptyStringSync(
        "tmp/build/testCase_fsWriteFileWithMkdirpSync_default/aa.txt",
        "utf8"
    ), "aa");
    onError(null, options);
};

local.testCase_isNullOrUndefined_default = function (options, onError) {
/*
 * this function will test isNullOrUndefined's default handling-behavior
 */
    // validate data
    local.assertJsonEqual(local.isNullOrUndefined(null), true);
    // validate data
    local.assertJsonEqual(local.isNullOrUndefined(undefined), true);
    // validate data
    local.assertJsonEqual(local.isNullOrUndefined(false), false);
    onError(null, options);
};

local.testCase_jslintAndPrintConditional_default = function (options, onError) {
/*
 * this function will test jslintAndPrintConditional's default handling-behavior
 */
    local.testMock([
        [local.jslint, {errorText: ""}]
    ], function (onError) {
        // test no csslint handling-behavior
        local.jslintAndPrintConditional("no csslint", "empty.css");
        // validate no error occurred
        local.assert(!local.jslint.errorText, local.jslint.errorText);
        // test csslint passed handling-behavior
        local.jslintAndPrintConditional(
            "/*csslint*/\nbody { display: block; }",
            "passed.css",
            "force"
        );
        // validate no error occurred
        local.assert(!local.jslint.errorText, local.jslint.errorText);
        // test no jslint handling-behavior
        local.jslintAndPrintConditional("no jslint", "empty.js");
        // validate no error occurred
        local.assert(!local.jslint.errorText, local.jslint.errorText);
        // test jslint passed handling-behavior
        local.jslintAndPrintConditional(
            "/*jslint node: true*/\nconsole.log(\"aa\");",
            "passed.js",
            "force"
        );
        // validate no error occurred
        local.assert(!local.jslint.errorText, local.jslint.errorText);
        onError(null, options);
        // test no shlint handling-behavior
        local.jslintAndPrintConditional("no shlint", "empty.sh");
        // validate no error occurred
        local.assert(!local.jslint.errorText, local.jslint.errorText);
        // test shlint passed handling-behavior
        local.jslintAndPrintConditional(
            "# jslint utility2:true\n" +
                    "shAa () {\n" +
                    "    node -e \"\n" +
                    "local = {};\n" +
                    "local.aa = function () {\n" +
                    "    return;\n" +
                    "};\n" +
                    "    \"\n" +
                    "}\n",
            "passed.sh",
            "force"
        );
        // validate no error occurred
        local.assert(!local.jslint.errorText, local.jslint.errorText);
    }, onError);
};

local.testCase_jsonCopy_default = function (options, onError) {
/*
 * this function will test jsonCopy's default handling-behavior
 */
    // test various data-type handling-behavior
    [undefined, null, false, true, 0, 1, 1.5, "a"].forEach(function (element) {
        local.assertJsonEqual(local.jsonCopy(element), element);
    });
    onError(null, options);
};

local.testCase_jsonStringifyOrdered_default = function (options, onError) {
/*
 * this function will test jsonStringifyOrdered's default handling-behavior
 */
    // test data-type handling-behavior
    [undefined, null, false, true, 0, 1, 1.5, "a", {}, []].forEach(function (data) {
        local.assertJsonEqual(local.jsonStringifyOrdered(data), JSON.stringify(data));
    });
    // test data-ordering handling-behavior
    options = {
        // test nested dict handling-behavior
        ff: {hh: 2, gg: 1},
        // test nested array handling-behavior
        ee: [1, null, undefined],
        dd: local.nop,
        cc: undefined,
        bb: null,
        aa: 1
    };
    // test circular-reference handling-behavior
    options.zz = options;
    local.assertJsonEqual(
        options,
        {aa: 1, bb: null, ee: [1, null, null], ff: {gg: 1, hh: 2}}
    );
    onError(null, options);
};

local.testCase_jwtAes256GcmXxx_default = function (options, onError) {
/*
 * this function will test jwtAes256GcmXxx's default handling-behavior
 */
    options = {};
    options.key = local.jwtAes256KeyCreate();
    // use canonical example at https://jwt.io/
    options.data = JSON.parse(local.jsonStringifyOrdered(local.normalizeJwt({
        sub: "1234567890",
        name: "John Doe",
        admin: true
    })));
    // encrypt token
    options.token = local.jwtAes256GcmEncrypt(options.data, options.key);
    // validate encrypted-token
    local.assertJsonEqual(
        local.jwtAes256GcmDecrypt(options.token, options.key),
        options.data
    );
    // test decryption-failed handling-behavior
    local.assertJsonEqual(local.jwtAes256GcmDecrypt(options.token, null), {});
    onError(null, options);
};

local.testCase_jwtHs256Xxx_default = function (options, onError) {
/*
 * this function will test jwtHs256Xxx's default handling-behavior
 */
    options = {};
    options.key = local.normalizeJwtBase64Url(local.base64FromBuffer("secret"));
    // use canonical example at https://jwt.io/
    options.data = {sub: "1234567890", name: "John Doe", admin: true};
    options.token = local.jwtHs256Encode(options.data, options.key);
    // validate encoded-token
    local.assertJsonEqual(
        options.token,
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" +
                ".eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9" +
                ".TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ"
    );
    // validate decoded-data
    local.assertJsonEqual(
        local.jwtHs256Decode(options.token, options.key),
        {admin: true, name: "John Doe", sub: "1234567890"}
    );
    // test decoding-failed handling-behavior
    local.assertJsonEqual(local.jwtHs256Decode(options.token, "undefined"), {});
    onError(null, options);
};

local.testCase_libUtility2Js_standalone = function (options, onError) {
/*
 * this function will test lib.utility2.js's standalone handling-behavior
 */
    if (local.isBrowser) {
        onError(null, options);
        return;
    }
    local.fs.writeFileSync("tmp/lib.utility2.js", local.fs.readFileSync(
        "lib.utility2.js",
        "utf8"
    ).replace("/* istanbul instrument in package utility2 */", ""));
    require("./tmp/lib.utility2.js");
    onError(null, options);
};

local.testCase_listGetElementRandom_default = function (options, onError) {
/*
 * this function will test listGetRandom's default handling-behavior
 */
    options = {};
    // init list
    options.list = ["aa", "bb", "cc", "dd"];
    options.elementDict = {};
    // get 1000 random elements from list
    options.ii = 0;
    while (options.ii < 1000) {
        options.elementDict[local.listGetElementRandom(options.list)] = true;
        options.ii += 1;
    }
    // validate all elements were retrieved from list
    local.assertJsonEqual(
        Object.keys(options.elementDict).sort(),
        ["aa", "bb", "cc", "dd"]
    );
    onError(null, options);
};

local.testCase_listShuffle_default = function (options, onError) {
/*
 * this function will test listShuffle's default handling-behavior
 */
    options = {};
    // init list
    options.list = "[0,1]";
    // shuffle list 100 times
    options.ii = 0;
    while (options.ii < 100) {
        options.listShuffled = JSON.stringify(local.listShuffle(JSON.parse(options.list)));
        // validate shuffled list
        local.assertJsonEqual(options.listShuffled.length, options.list.length);
        options.changed = options.changed || options.listShuffled !== options.list;
        options.ii += 1;
    }
    // validate list changed at least once during the shuffle
    local.assert(options.changed, options);
    onError(null, options);
};

local.testCase_localStorageSetItemOrClear_default = function (options, onError) {
/*
 * this function will localStorageSetItemOrClear's default handling-behavior
 */
    if (!local.isBrowser) {
        onError(null, options);
        return;
    }
    local.localStorageSetItemOrClear(
        "testCase_localStorageSetItemOrClear_default",
        null
    );
    local.assertJsonEqual(
        localStorage.testCase_localStorageSetItemOrClear_default,
        "null"
    );
    local.testMock([
        [localStorage, {
            clear: null,
            setItem: function () {
                throw local.errorDefault;
            }
        }]
    ], function (onError) {
        localStorage.clear = onError;
        local.localStorageSetItemOrClear(
            "testCase_localStorageSetItemOrClear_default",
            null
        );
    }, onError);
};

local.testCase_middlewareForwardProxy_default = function (options, onError) {
/*
 * this function will test middlewareForwardProxy's default handling-behavior
 */
    var onParallel;
    if (local.isBrowser) {
        onError(null, options);
        return;
    }
    onParallel = local.onParallel(onError);
    onParallel.counter += 1;
    // test preflight-cors handling-behavior
    onParallel.counter += 1;
    local.ajax({headers: {
        "access-control-request-headers": "forward-proxy-headers,forward-proxy-url"
    }, method: "OPTIONS", url: ""}, onParallel);
    // test forward-proxy-http handling-behavior
    onParallel.counter += 1;
    local.ajax({headers: {
        "forward-proxy-url": "/assets.hello.txt"
    }, url: ""}, function (error, xhr) {
        // validate no error occurred
        local.assert(!error, error);
        // validate responseText
        local.assertJsonEqual(xhr.responseText, local.stringHelloEmoji);
        onParallel(null, options, xhr);
    });
    // test error handling-behavior
    onParallel.counter += 1;
    local.ajax({headers: {
        "forward-proxy-url": "https://undefined:0"
    }, url: ""}, function (error) {
        // validate error occurred
        local.assert(error, error);
        onParallel(null, options);
    });
    onParallel(null, options);
};

local.testCase_middlewareJsonpStateInit_assetsList = function (options, onError) {
/*
 * this function will middlewareJsonpStateInit's assetsList handling-behavior
 */
    local.testMock([
        [local.env, {npm_package_assetsList: "undefined"}],
        [local, {assetsDict: {}}]
    ], function (onError) {
        local.middlewareJsonpStateInit({stateInit: true});
        // validate data
        local.assertJsonEqual(local.assetsDict["/undefined"], "");
        onError(null, options);
    }, onError);
};

local.testCase_moduleDirname_default = function (options, onError) {
/*
 * this function will test moduleDirname's default handling-behavior
 */
    if (local.isBrowser) {
        onError(null, options);
        return;
    }
    // test null-case handling-behavior
    local.assertJsonEqual(local.moduleDirname(null, module.paths), process.cwd());
    // test path handling-behavior
    local.assertJsonEqual(local.moduleDirname(".", module.paths), process.cwd());
    local.assertJsonEqual(local.moduleDirname("./", module.paths), process.cwd());
    // test module-exists handling-behavior
    options = local.moduleDirname("electron-lite", module.paths);
    local.assert((/\/electron-lite$/).test(options), options);
    // test module-does-not-exist handling-behavior
    local.assertJsonEqual(local.moduleDirname("syntax error", module.paths), "");
    onError(null, options);
};

local.testCase_numberToRomanNumerals_default = function (options, onError) {
/*
 * this function will test numberToRomanNumerals's default handling-behavior
 */
    options = {};
    options.list = [
"","I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX","XXI","XXII","XXIII","XXIV","XXV","XXVI","XXVII","XXVIII","XXIX","XXX","XXXI","XXXII","XXXIII","XXXIV","XXXV","XXXVI","XXXVII","XXXVIII","XXXIX","XL","XLI","XLII","XLIII","XLIV","XLV","XLVI","XLVII","XLVIII","XLIX","L","LI","LII","LIII","LIV","LV","LVI","LVII","LVIII","LIX","LX","LXI","LXII","LXIII","LXIV","LXV","LXVI","LXVII","LXVIII","LXIX","LXX","LXXI","LXXII","LXXIII","LXXIV","LXXV","LXXVI","LXXVII","LXXVIII","LXXIX","LXXX","LXXXI","LXXXII","LXXXIII","LXXXIV","LXXXV","LXXXVI","LXXXVII","LXXXVIII","LXXXIX","XC","XCI","XCII","XCIII","XCIV","XCV","XCVI","XCVII","XCVIII","XCIX","C" // jslint ignore:line
    ];
    options.ii = 0;
    while (options.ii < 10) {
        local.assertJsonEqual(
            local.numberToRomanNumerals(options.ii),
            options.list[options.ii]
        );
        options.ii += 1;
    }
    onError(null, options);
};

local.testCase_objectKeysTypeOf_default = function (options, onError) {
/*
 * this function will test objectKeysTypeOf's default handling-behavior
 */
    local.assertJsonEqual(local.objectKeysTypeof({
        aa: true,
        bb: local.nop,
        cc: 0,
        dd: null,
        ee: "",
        ff: undefined
    }), "boolean aa\nfunction bb\nnumber cc\nobject dd\nstring ee\nundefined ff");
    onError(null, options);
};

local.testCase_objectLiteralize_default = function (options, onError) {
/*
 * this function will test objectLiteralize's default handling-behavior
 */
    local.assertJsonEqual(local.objectLiteralize({
        "": "$[]",
        "$[]1": [1, {"$[]2": [2, 3]}]
    }), {"1": {"2": 3}, "": "$[]"});
    onError(null, options);
};

local.testCase_objectSetDefault_default = function (options, onError) {
/*
 * this function will test objectSetDefault's default handling-behavior
 */
    // test null-case handling-behavior
    local.objectSetDefault();
    local.objectSetDefault({});
    // test falsy handling-behavior
    ["", 0, false, null, undefined].forEach(function (aa) {
        ["", 0, false, null, undefined].forEach(function (bb) {
            local.assertJsonEqual(
                local.objectSetDefault({data: aa}, {data: bb}).data,
                (aa === 0 || aa === false || bb === undefined)
                    ? aa
                    : bb
            );
        });
    });
    // test non-recursive handling-behavior
    local.assertJsonEqual(local.objectSetDefault(
        {aa: 0, bb: {cc: 1}, cc: {dd: {}}, dd: [1, 1], ee: [1, 1]},
        {aa: 2, bb: {dd: 2}, cc: {dd: {ee: 2}}, dd: [2, 2], ee: {ff: 2}},
        // test default-depth handling-behavior
        null
    ), {aa: 0, bb: {cc: 1}, cc: {dd: {}}, dd: [1, 1], ee: [1, 1]});
    // test recursive handling-behavior
    local.assertJsonEqual(local.objectSetDefault(
        {aa: 0, bb: {cc: 1}, cc: {dd: {}}, dd: [1, 1], ee: [1, 1]},
        {aa: 2, bb: {dd: 2}, cc: {dd: {ee: 2}}, dd: [2, 2], ee: {ff: 2}},
        // test depth handling-behavior
        2
    ), {aa: 0, bb: {cc: 1, dd: 2}, cc: {dd: {}}, dd: [1, 1], ee: [1, 1]});
    onError(null, options);
};

local.testCase_objectSetOverride_default = function (options, onError) {
/*
 * this function will test objectSetOverride's default handling-behavior
 */
    // test null-case handling-behavior
    local.objectSetOverride();
    local.objectSetOverride({});
    // test falsy handling-behavior
    ["", 0, false, null, undefined].forEach(function (aa) {
        ["", 0, false, null, undefined].forEach(function (bb) {
            local.assertJsonEqual(
                local.objectSetOverride({data: aa}, {data: bb}).data,
                bb === undefined
                    ? aa
                    : bb
            );
        });
    });
    // test non-recursive handling-behavior
    local.assertJsonEqual(local.objectSetOverride(
        {aa: 1, bb: {cc: 1}, cc: {dd: 1}, dd: [1, 1], ee: [1, 1]},
        {aa: 2, bb: {dd: 2}, cc: {ee: 2}, dd: [2, 2], ee: {ff: 2}},
        // test default-depth handling-behavior
        null
    ), {aa: 2, bb: {dd: 2}, cc: {ee: 2}, dd: [2, 2], ee: {ff: 2}});
    // test recursive handling-behavior
    local.assertJsonEqual(local.objectSetOverride(
        {aa: 1, bb: {cc: 1}, cc: {dd: 1}, dd: [1, 1], ee: [1, 1]},
        {aa: 2, bb: {dd: 2}, cc: {ee: 2}, dd: [2, 2], ee: {ff: 2}},
        // test depth handling-behavior
        2
    ), {aa: 2, bb: {cc: 1, dd: 2}, cc: {dd: 1, ee: 2}, dd: [2, 2], ee: {ff: 2}});
    // test env with empty-string handling-behavior
    local.assertJsonEqual(local.objectSetOverride(
        local.env,
        {"emptyString": null},
        // test default-depth handling-behavior
        null,
        local.env
    ).emptyString, "");
    onError(null, options);
};

local.testCase_objectTraverse_default = function (options, onError) {
/*
 * this function will test objectTraverse's default handling-behavior
 */
    options = {aa: null, bb: 2, cc: {dd: 4, ee: [5, 6, 7]}};
    // test circular-reference handling-behavior
    options.data = options;
    local.objectTraverse(options, function (element) {
        if (typeof element === "object" && element && !Array.isArray(element)) {
            element.zz = true;
        }
    });
    // validate options
    local.assertJsonEqual(
        options,
        {aa: null, bb: 2, cc: {dd: 4, ee: [5, 6, 7], zz: true}, zz: true}
    );
    onError(null, options);
};

local.testCase_onErrorDefault_default = function (options, onError) {
/*
 * this function will test onErrorDefault's default handling-behavior
 */
    local.testMock([
        [console, {error: function (arg) {
            options = arg;
        }}],
        [local.global, {__coverage__: null}]
    ], function (onError) {
        // test no error handling-behavior
        local.onErrorDefault();
        // validate options
        local.assert(!options, options);
        // test error handling-behavior
        local.onErrorDefault(local.errorDefault);
        // validate options
        local.assert(options, options);
        onError(null, options);
    }, onError);
};

local.testCase_onErrorThrow_error = function (options, onError) {
/*
 * this function will test onErrorThrow's error handling-behavior
 */
    local.tryCatchOnError(function () {
        local.onErrorThrow(local.errorDefault);
    }, function (error) {
        // validate error occurred
        local.assert(error, error);
        onError(null, options);
    });
};

local.testCase_onErrorWithStack_toString = function (options, onError) {
/*
 * this function will test onErrorWithStack's toString handling-behavior
 */
    local.assertJsonEqual(String(local.onErrorWithStack(local.nop)), String(local.nop));
    onError(null, options);
};

local.testCase_onFileModifiedRestart_watchFile = function (options, onError) {
/*
 * this function will test onFileModifiedRestart's watchFile handling-behavior
 */
    var onParallel;
    if (local.isBrowser) {
        onError(null, options);
        return;
    }
    onParallel = local.onParallel(onError);
    onParallel.counter += 1;
    local.fs.stat(__filename, function (error, stat) {
        // test default watchFile handling-behavior
        onParallel.counter += 1;
        local.fs.utimes(__filename, stat.atime, new Date(), onParallel);
        // test nop watchFile handling-behavior
        onParallel.counter += 1;
        setTimeout(function () {
            local.fs.utimes(__filename, stat.atime, stat.mtime, onParallel);
        }, 1000);
        onParallel(error, options);
    });
};

local.testCase_onNext_error = function (options, onError) {
/*
 * this function will test onNext's error handling-behavior
 */

    options = {};
    options.modeDebug = true;
    local.onNext(options, function () {
        throw local.errorDefault;
    });
    options.modeNext = 0;
    local.tryCatchOnError(function () {
        options.onNext();
    }, function (error) {
        // validate error occurred
        local.assert(error, error);
        onError(null, options);
    });
};

local.testCase_onParallelList_default = function (options, onError) {
/*
 * this function will test onParallelList's default handling-behavior
 */
    options = {};
    local.onNext(options, function (error) {
        switch (options.modeNext) {
        case 1:
            // test null-case handling-behavior
            local.onParallelList({}, local.onErrorThrow, options.onNext);
            break;
        case 2:
            options.list = [null];
            // test retryLimit handling-behavior
            options.retryLimit = 1;
            local.onParallelList(options, function (options2, onParallel) {
                onParallel.counter += 1;
                // test error handling-behavior
                onParallel(local.errorDefault, options2);
                // test multiple-callback handling-behavior
                setTimeout(onParallel, 5000);
            }, function (error) {
                // validate error occurred
                local.assert(error, error);
                options.onNext();
            });
            break;
        case 3:
            options.data = [];
            // test rateLimit handling-behavior
            options.rateLimit = 3;
            options.rateMax = 0;
            // test retryLimit handling-behavior
            options.retryLimit = 1;
            local.onParallelList({
                list: [1, 2, 3, 4],
                rateLimit: options.rateLimit
            }, function (options2, onParallel) {
                onParallel.counter += 1;
                options.rateMax = Math.max(onParallel.counter - 1, options.rateMax);
                // test async handling-behavior
                setTimeout(function () {
                    // test list-growth handling-behavior
                    if (options2.ii === 3) {
                        options2.list.push(5);
                    }
                    options.data[options2.ii] = options2.element;
                    // test retry handling-behavior
                    local.assert(options2.retry < 1);
                    onParallel(null, options2);
                });
            }, options.onNext, options.rateLimit);
            break;
        case 4:
            // validate data
            local.assertJsonEqual(options.data, [1, 2, 3, 4, 5]);
            local.assertJsonEqual(options.rateMax, 3);
            options.data = [];
            options.rateLimit = "syntax error";
            options.rateMax = 0;
            local.onParallelList({
                list: [1, 2, 3, 4, 5],
                rateLimit: options.rateLimit
            }, function (options2, onParallel) {
                // test sync handling-behavior
                onParallel.counter += 1;
                options.rateMax = Math.max(onParallel.counter, options.rateMax);
                options.data[options2.ii] = options2.element;
                onParallel(null, options);
            }, options.onNext);
            break;
        case 5:
            // validate data
            local.assertJsonEqual(options.data, [1, 2, 3, 4, 5]);
            local.assertJsonEqual(options.rateMax, 2);
            options.onNext();
            break;
        default:
            onError(error, options);
        }
    });
    options.modeNext = 0;
    options.onNext();
};

local.testCase_onParallel_default = function (options, onError) {
/*
 * this function will test onParallel's default handling-behavior
 */
    var onParallel, onParallelError;
    // test onEach handling-behavior
    onParallel = local.onParallel(onError, function () {
        // validate counter
        local.assert(onParallel.counter >= 0, onParallel);
    });
    onParallel.counter += 1;
    // test multiple-task handling-behavior
    onParallel.counter += 1;
    setTimeout(function () {
        onParallelError = local.onParallel(onParallel);
        onParallelError.counter += 1;
        onParallelError();
        // test multiple-callback-error handling-behavior
        onParallelError();
        // validate error occurred
        local.assert(onParallelError.error, onParallelError.error);
        // test error handling-behavior
        onParallelError(local.errorDefault);
        // validate error occurred
        local.assert(onParallelError.error, onParallelError.error);
        // test ignore-after-error handling-behavior
        onParallelError();
    });
    // test default handling-behavior
    onParallel(null, options);
};

local.testCase_onTimeout_timeout = function (options, onError) {
/*
 * this function will test onTimeout's timeout handling-behavior
 */
    options = local.timeElapsedStart();
    local.onTimeout(function (error) {
        // validate error occurred
        local.assert(error, error);
        // validate error message
        local.assert(
            error.message.indexOf("testCase_onTimeout_errorTimeout") >= 0,
            error
        );
        // poll timeElapsed
        local.timeElapsedPoll(options);
        // validate timeElapsed passed is greater than timeout
        local.assert(options.timeElapsed >= 1000, options);
        onError(null, options);
    }, 1000, function () {
        return "testCase_onTimeout_errorTimeout";
    });
};

local.testCase_profileXxx_default = function (options, onError) {
/*
 * this function will test profileXxx's default handling-behavior
 */
    options = {};
    // test profileSync's handling-behavior
    options.timeElapsed = local.profileSync(function () {
        return;
    });
    // validate timeElapsed
    local.assert(
        0 <= options.timeElapsed && options.timeElapsed < 1000,
        options.timeElapsed
    );
    // test profile's async handling-behavior
    local.profile(function (onError) {
        setTimeout(onError);
    }, function (error, timeElapsed) {
        // validate no error occurred
        local.assert(!error, error);
        options.timeElapsed = timeElapsed;
        // validate timeElapsed
        local.assert(
            0 <= options.timeElapsed &&
                    options.timeElapsed < local.timeoutDefault,
            options.timeElapsed
        );
        onError(null, options);
    });
};

local.testCase_replStart_default = function (options, onError) {
/*
 * this function will test replStart's default handling-behavior
 */
    if (local.isBrowser) {
        onError(null, options);
        return;
    }
    local.replStart();
    // coverage-hack - test replStart's muliple-call handling-behavior
    local.replStart();
    local.testMock([
        [local.child_process, {spawn: function () {
            return {on: function (event, callback) {
                callback(null, event);
            }};
        }}],
        // suppress process.stdout
        [process.stdout, {write: local.nop}]
    ], function (onError) {
        [
            // test null-case handling-behavior
            "",
            // test shell handling-behavior
            "$ :\n",
            // test git diff handling-behavior
            "$ git diff\n",
            // test git log handling-behavior
            "$ git log\n",
            // test grep handling-behavior
            "grep \\baa\\b\n",
            // test keys handling-behavior
            "keys {}\n",
            // test print handling-behavior
            "print\n",
            // test error handling-behavior
            "undefined()\n"
        ].forEach(function (script) {
            local.global.utility2_serverRepl1.eval(script, null, "repl", local.nop);
        });
        // test nop handling-behavior
        local.global.utility2_serverRepl1.nop();
        // test error handling-behavior
        local.global.utility2_serverRepl1.onError(local.errorDefault);
        onError(null, options);
    }, onError);
};

local.testCase_replStart_tcp = function (options, onError) {
/*
 * this function will test replStart's tcp handling-behavior
 */
    if (local.isBrowser) {
        onError(null, options);
        return;
    }
    options = {};
    options.data = "";
    options.input = Math.random();
    options.socket = local.net.createConnection(local.env.PORT_REPL);
    options.socket.on("data", function (data) {
    /*
     * this function will concat data to options.data
     */
        options.data += data;
    });
    options.socket.setEncoding("utf8");
    options.socket.on("end", function () {
        // validate data
        local.assert(
            options.data.indexOf(options.input) >= 0,
            JSON.stringify([options.data, options.input])
        );
        onError(null, options);
    });
    options.socket.write(options.input + "\n");
    // test error handling-behavior
    options.socket.end("undefined()\n");
};

local.testCase_requireReadme_start = function (options, onError) {
/*
 * this function will test requireReadme's start handling-behavior
 */
    if (local.isBrowser) {
        onError(null, options);
        return;
    }
    local.testMock([
        [local, {
            assetsDict: {},
            onFileModifiedRestart: local.nop
        }],
        [local.env, {
            npm_config_mode_start: "1",
            npm_package_nameLib: "_testCase_requireReadme_start"
        }],
        [local.fs, {
            readFile: function (file, options, onError) {
                onError(null, "{}", file, options);
            },
            readdirSync: function () {
                // test jslintAndPrintConditional handling-behavior
                return [
                    "aa.css",
                    "aa.html",
                    "aa.js",
                    "aa.json",
                    "aa.rollup.js",
                    "assets.swgg.swagger.json"
                ];
            }
        }]
    ], function (onError) {
        // validate data
        local.requireReadme();
        local.assert(local._testCase_requireReadme_start === local);
        onError(null, options);
    }, onError);
};

local.testCase_semverCompare_default = function (options, onError) {
/*
 * this function will test semverCompare's default handling-behavior
 */
    var aa;
    // test aa = bb
    options = [
        "1.2.3",
        "1.2.3-",
        "1.2.3-alpha.beta",
        "1.2.3-alpha.beta"
    ];
    options.forEach(function (bb, ii) {
        if (ii & 1) {
            local.assert(
                local.semverCompare(aa, bb) === 0,
                [local.semverCompare(aa, bb), aa, bb]
            );
        }
        aa = bb;
    });
    options = [
        "1.2.3-a",
        "1.2.3-a.2",
        "1.2.3-a.10",
        "1.2.3-b",
        "1.2.3",
        "1.2.10"
    ];
    // test aa < bb
    options.reduce(function (aa, bb) {
        local.assert(
            local.semverCompare(aa, bb) === -1,
            [local.semverCompare(aa, bb), aa, bb]
        );
        return bb;
    });
    // test aa > bb
    options.reverse().reduce(function (aa, bb) {
        local.assert(
            local.semverCompare(aa, bb) === 1,
            [local.semverCompare(aa, bb), aa, bb]
        );
        return bb;
    });
    onError(null, options);
};

local.testCase_serverRespondTimeoutDefault_timeout = function (options, onError) {
/*
 * this function will test serverRespondTimeoutDefault's timeout handling-behavior
 */
    options = function (fnc1, fnc2) {
        [fnc1, fnc2].forEach(function (fnc) {
            if (typeof fnc === "function") {
                fnc();
            }
        });
    };
    local.testMock([
        [local, {onTimeout: options, serverRespondDefault: local.nop, setTimeout: options}]
    ], function (onError) {
        local.serverRespondTimeoutDefault({headers: {}}, {on: options});
        onError(null, options);
    }, onError);
};

local.testCase_setTimeoutOnError_default = function (options, onError) {
/*
 * this function will test setTimeoutOnError's default handling-behavior
 */
    // test null-case handling-behavior
    local.assertJsonEqual(local.setTimeoutOnError(), undefined);
    // test onError handling-behavior
    local.assertJsonEqual(local.setTimeoutOnError(onError, 0, null, {}, options), {});
};

local.testCase_sjclHashScryptXxx_default = function (options, onError) {
/*
 * this function will test sjclHashScryptXxx's default handling-behavior
 */
    // test sjclHashScryptCreate's null-case handling-behavior
    local.assertJsonEqual(local.sjclHashScryptCreate().slice(0, 10), "$s0$10801$");
    // https://github.com/wg/scrypt
    // test sjclHashScryptValidate's fail handling-behavior
    local.assertJsonEqual(local.sjclHashScryptValidate(
        "password",
        "$s0$80801$epIxT/h6HbbwHaehFnh/bw==" +
                "$l/guDhz2Q0v/D93gq0K0qtSX6FWP8pH5maAJkbIcRaEA"
    ), false);
    // https://github.com/wg/scrypt
    // test sjclHashScryptValidate's pass handling-behavior
    local.assertJsonEqual(local.sjclHashScryptValidate(
        "password",
        "$s0$80801$epIxT/h6HbbwHaehFnh/bw==" +
                "$l/guDhz2Q0v/D93gq0K0qtSX6FWP8pH5maAJkbIcRaE="
    ), true);
    onError(null, options);
};

local.testCase_sjclHashShaXxxCreate_default = function (options, onError) {
/*
 * this function will test sjclHashShaXxxCreate's default handling-behavior
 */
    local.assertJsonEqual(
        local.sjclHashSha1Create("aa"),
        "4MkDWJjdUvxlxBRUzsnE0mEb+zc="
    );
    local.assertJsonEqual(
        local.sjclHashSha256Create("aa"),
        "lhtt0+3jy47LqsvWjeBAzXjrLtWIkTDM60xJJo6k1QY="
    );
    onError(null, options);
};

local.testCase_sjclHmacShaXxx_default = function (options, onError) {
/*
 * this function will test sjclHmacShaXxx's default handling-behavior
 */
    local.assertJsonEqual(
        local.sjclHmacSha1Create("aa", "bb"),
        "15pOinCz63A+qZoxnv+mJB6UF1k="
    );
    local.assertJsonEqual(
        local.sjclHmacSha256Create("aa", "bb"),
        "94Xv3VdPHA+ohKyjkM1pb0W5ZVAuMVcmIAAI2AqNRCQ="
    );
    onError(null, options);
};

local.testCase_stringHtmlSafe_default = function (options, onError) {
/*
 * this function will test stringHtmlSafe's default handling-behavior
 */
    local.assertJsonEqual(
        local.stringHtmlSafe(local.stringHtmlSafe(local.stringCharsetAscii).slice(32, -1)),
        " !&quot;#$%&amp;&apos;()*+,-./0123456789:;&lt;=&gt;?@" +
                "ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~"
    );
    onError(null, options);
};

local.testCase_stringQuotedToAscii_default = function (options, onError) {
/*
 * this function will test stringQuotedToAscii's default handling-behavior
 */
    local.assertJsonEqual(
        local.stringQuotedToAscii(local.stringHelloEmoji),
        "hello \\ud83d\\ude01\n"
    );
    onError(null, options);
};

local.testCase_stringRegexpEscape_default = function (options, onError) {
/*
 * this function will test stringRegexpEscape's default handling-behavior
 */
    local.assertJsonEqual(
        local.stringRegexpEscape(local.stringCharsetAscii),
        "\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007" +
                "\b\t\n\u000b\f\r\u000e\u000f" +
                "\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017" +
                "\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f" +
                " !\"#\\$%&'\\(\\)\\*\\+,\\-\\.\\/0123456789:;<=>\\?@" +
                "ABCDEFGHIJKLMNOPQRSTUVWXYZ\\[\\\\\\]\\^_`" +
                "abcdefghijklmnopqrstuvwxyz\\{\\|\\}~" +
                "\u007f"
    );
    onError(null, options);
};

local.testCase_stringTruncate_default = function (options, onError) {
/*
 * this function will test stringTruncate's default handling-behavior
 */
    local.assertJsonEqual(local.stringTruncate("aa"), "aa");
    local.assertJsonEqual(local.stringTruncate("aa", 1), "...");
    local.assertJsonEqual(local.stringTruncate("aa", 2), "aa");
    onError(null, options);
};

local.testCase_stringUniqueKey_default = function (options, onError) {
/*
 * this function will test stringUniqueKey's default handling-behavior
 */
    local.assert(("zqxj").indexOf(local.stringUniqueKey("zqxj") < 0));
    onError(null, options);
};

local.testCase_taskCreateCached_default = function (options, onError) {
/*
 * this function will test taskCreateCached's default handling-behavior
 */
    var cacheValue, onTask, optionsCopy;
    options = {};
    local.onNext(options, function (error, data) {
        switch (options.modeNext) {
        // test no cache handling-behavior
        case 1:
            onTask = function (onError) {
                onError(null, cacheValue);
            };
            options.cacheDict = "testCase_taskCreateCached_default";
            options.key = "memory";
            // cleanup memory-cache
            local.cacheDict[options.cacheDict] = null;
            cacheValue = "aa";
            optionsCopy = {
                cacheDict: options.cacheDict,
                key: options.key,
                // test onCacheWrite handling-behavior
                onCacheWrite: options.onNext
            };
            local.taskCreateCached(optionsCopy, onTask, options.onNext);
            break;
        case 2:
            // validate data
            local.assertJsonEqual(data, "aa");
            // validate no cache-hit
            local.assert(!optionsCopy.modeCacheHit, optionsCopy.modeCacheHit);
            break;
        // test cache with update handling-behavior
        case 3:
            cacheValue = "bb";
            optionsCopy = {
                cacheDict: options.cacheDict,
                key: options.key,
                // test modeCacheUpdate handling-behavior
                modeCacheUpdate: true,
                // test onCacheWrite handling-behavior
                onCacheWrite: options.onNext
            };
            local.taskCreateCached(optionsCopy, onTask, options.onNext);
            break;
        case 4:
            // validate data
            local.assertJsonEqual(data, "aa");
            // validate modeCacheHit
            local.assertJsonEqual(optionsCopy.modeCacheHit, true);
            break;
        // test cache handling-behavior
        case 5:
            optionsCopy = {
                cacheDict: options.cacheDict,
                key: options.key
            };
            local.taskCreateCached(optionsCopy, onTask, options.onNext);
            break;
        case 6:
            // validate data
            local.assertJsonEqual(data, "bb");
            // validate modeCacheHit
            local.assertJsonEqual(optionsCopy.modeCacheHit, true);
            options.onNext();
            break;
        default:
            onError(error, options);
        }
    });
    options.modeNext = 0;
    options.onNext();
};

local.testCase_taskCreate_multipleCallback = function (options, onError) {
/*
 * this function will test taskCreate's multiple-callback handling-behavior
 */
    options = {counter: 0, key: "testCase_taskCreate_multiCallback"};
    local.taskCreate(options, function (onError) {
        onError(null, options);
        // test multiple-callback handling-behavior
        onError(null, options);
    }, function () {
        options.counter += 1;
    });
    // validate counter incremented once
    local.assertJsonEqual(options.counter, 1);
    onError(null, options);
};

local.testCase_taskCreate_upsert = function (options, onError) {
/*
 * this function will test taskCreate's upsert handling-behavior
 */
    options = {counter: 0, key: "testCase_taskCreate_upsert"};
    // test upsert handling-behavior
    [null, null].forEach(function () {
        local.taskCreate(options, function (onError) {
            options.counter += 1;
            setTimeout(onError);
        });
    });
    // validate counter incremented once
    setTimeout(function () {
        local.assertJsonEqual(options.counter, 1);
        onError(null, options);
    });
};

local.testCase_templateRender_default = function (options, onError) {
/*
 * this function will test templateRender's default handling-behavior
 */
    // test null-case handling-behavior
    local.assertJsonEqual(local.templateRender(), "");
    // test undefined-value handling-behavior
    local.assertJsonEqual(local.templateRender("{{aa}}", {}), "{{aa}}");
    // test basic handling-behavior
    local.assertJsonEqual(local.templateRender("{{aa}}", {
        aa: "```<aa\nbb>```"
    }), "```&lt;aa\nbb&gt;```");
    // test markdownToHtml handling-behavior
    local.assertJsonEqual(
        local.templateRender("{{aa markdownToHtml}}", {
            aa: local.stringCharsetAscii.slice(32, -1)
        }),
        "<p> !&quot;#$%&amp;&apos;()*+,-./0123456789:;&lt;=&gt;?@" +
                "ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~</p>\n"
    );
    // test markdownSafe handling-behavior
    local.assertJsonEqual(
        local.templateRender("{{aa markdownSafe notHtmlSafe}}", {
            aa: local.stringCharsetAscii.slice(32, -1)
        }),
        " !\"#$%&'()*+,-./0123456789:;<=>?@" +
                "ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_'abcdefghijklmnopqrstuvwxyz{|}~"
    );
    // test notHtmlSafe handling-behavior
    local.assertJsonEqual(local.templateRender("{{aa notHtmlSafe}}", {
        aa: "```<aa\nbb>```"
    }), "```<aa\nbb>```");
    // test default handling-behavior
    local.assertJsonEqual(local.templateRender(
        "{{aa alphanumeric}} " +
                "{{aa truncate 4 truncate 4}} " +
                "{{aa jsonStringify jsonStringify4 decodeURIComponent encodeURIComponent " +
                "trim}} " +
                "{{bb}} {{cc}} {{dd}} {{ee.ff}}",
        {
            // test string value handling-behavior
            aa: "`<aa>`",
            // test non-string value handling-behavior
            bb: 1,
            // test null-value handling-behavior
            cc: null,
            // test undefined-value handling-behavior
            dd: undefined,
            // test nested value handling-behavior
            ee: {ff: "gg"}
        }
    ), "__aa__ `... %22%5C%22%60%3Caa%3E%60%5C%22%22 1 null {{dd}} gg");
    // test partial handling-behavior
    local.assertJsonEqual(
        local.templateRender(
            "{{#undefined aa}}\n" +
                    "list1{{#each list1}}\n" +
                    "    aa - {{aa}}\n" +
                    "    list2{{#eachTrimRightComma list2}}\n" +
                    "        {{#this/ notHtmlSafe jsonStringify}}\n" +
                    "        bb - {{bb}}\n" +
                    "        {{#if bb}}\n" +
                    "        if\n" +
                    "        {{#unless bb}}\n" +
                    "        else\n" +
                    "        {{/if bb}}\n" +
                    "        {{#unless bb}}\n" +
                    "        unless\n" +
                    "        {{/unless bb}}\n" +
                    "        ,\n" +
                    "    {{/eachTrimRightComma list2}}\n" +
                    "{{/each list1}}\n" +
                    "{{/undefined aa}}\n",
            {list1: [
            // test null-value handling-behavior
                null,
                {
                    aa: "aa",
                // test recursive-list handling-behavior
                    list2: [{bb: "bb"}, {bb: null}]
                }
            ]}
        ),
        "{{#undefined aa}}\n" +
                "list1\n" +
                "    aa - {{aa}}\n" +
                "    list2\n" +
                "\n" +
                "    aa - aa\n" +
                "    list2\n" +
                "        {\"bb\":\"bb\"}\n" +
                "        bb - bb\n" +
                "        \n" +
                "        if\n" +
                "        \n" +
                "        \n" +
                "        ,\n" +
                "    \n" +
                "        {\"bb\":null}\n" +
                "        bb - null\n" +
                "        \n" +
                "        else\n" +
                "        \n" +
                "        \n" +
                "        unless\n" +
                "        \n" +
                "        \n" +
                "\n" +
                "{{/undefined aa}}\n"
    );
    // test error handling-behavior
    local.tryCatchOnError(function () {
        local.templateRender("{{aa bb}}", {aa: 1});
    }, local.nop);
    // validate error occurred
    local.assert(local._debugTryCatchError, local._debugTryCatchError);
    onError(null, options);
};

local.testCase_testReportCreate_default = function (options, onError) {
/*
 * this function will test testReport's default handling-behavior
 */
    if (local.isBrowser) {
        onError(null, options);
        return;
    }
    local.testMock([], function (onError) {
        // test null-case handling-behavior
        local.testReportCreate();
        // test testsFailed handling-behavior
        local.testReportCreate({testPlatformList: [{
            testCaseList: [{status: "failed"}, {status: "passed"}]
        }]});
        onError(null, options);
    }, onError);
};

local.testCase_throwError_default = function (options, onError) {
/*
 * this function will test throwError's default handling-behavior
 */
    local.tryCatchOnError(function () {
        local.throwError();
    }, function (error) {
        // validate error occurred
        local.assert(error, error);
        onError(null, options);
    });
};

local.testCase_uglify_default = function (options, onError) {
/*
 * this function will test uglify's default handling-behavior
 */
    // test css handling-behavior
    local.assertJsonEqual(local.uglify("body { margin: 0; }", "aa.css"), "body{margin:0;}");
    // test js handling-behavior
    local.assertJsonEqual(
        local.uglify("aa = 'hello \ud83d\ude01\\n'", "aa.js"),
        "aa=\"hello \\ud83d\\ude01\\n\""
    );
    onError(null, options);
};

local.testCase_uiAnimateXxx_default = function (options, onError) {
/*
 * this function will test uiAnimateXxx's default handling-behavior
 */
    if (!local.isBrowser) {
        onError(null, options);
        return;
    }
    options = document.createElement("div");
    // test uiAnimateShake handling-behavior
    local.uiAnimateShake();
    local.uiAnimateShake(options);
    local.assert(options.classList.contains("uiAnimateShake"), options.classList);
    local.uiAnimateShake(options);
    local.assert(options.classList.contains("uiAnimateShake"), options.classList);
    // test uiAnimateShakeIfError handling-behavior
    local.uiAnimateShakeIfError();
    local.uiAnimateShakeIfError(null, options);
    local.assert(!options.classList.contains("hasError"), options.classList);
    local.uiAnimateShakeIfError(true, options);
    local.assert(options.classList.contains("hasError"), options.classList);
    local.uiAnimateShakeIfError(null, options);
    local.assert(!options.classList.contains("hasError"), options.classList);
    // test uiAnimateSlideXxx handling-behavior
    local.uiAnimateSlideDown();
    local.uiAnimateSlideUp();
    options.classList.add("uiAnimateSlide");
    local.uiAnimateSlideDown(options);
    local.assert(options.style.maxHeight.indexOf("px") >= 0, options.style.maxHeight);
    local.uiAnimateSlideUp(options);
    local.assertJsonEqual(options.style.maxHeight, "0px");
    // test uiAnimateSlideAccordian handling-behavior
    local.uiAnimateSlideAccordian(options, [options, document.createElement("div")]);
    onError(null, options);
};

local.testCase_urlJoin_default = function (options, onError) {
/*
 * this function will test urlJoin's default handling-behavior
 */
    local.assertJsonEqual(local.urlJoin("", ""), "/");
    local.assertJsonEqual(local.urlJoin("http://aa/bb", "zz"), "http://aa/zz");
    local.assertJsonEqual(local.urlJoin("http://aa/bb/", "zz"), "http://aa/bb/zz");
    local.assertJsonEqual(local.urlJoin("http://aa/bb/", "/zz"), "http://aa/zz");
    local.assertJsonEqual(local.urlJoin("http://aa/bb/", "//zz"), "http://zz");
    local.assertJsonEqual(local.urlJoin("http://aa/bb/", "http://zz"), "http://zz");
    onError(null, options);
};

local.testCase_urlParse_default = function (options, onError) {
/*
 * this function will test urlParse's default handling-behavior
 */
    local.testMock([
        [local, {
            // test default PORT handling-behavior
            env: {},
            // test init-serverLocalHost handling-behavior
            serverLocalHost: ""
        }]
    ], function (onError) {
        // test default handling-behavior
        local.assertJsonEqual(local.urlParse(
            "https://127.0.0.1:80/foo/bar?aa=1&bb%20cc=dd%20=ee&aa=2&aa#zz=1"
        ), {
            basename: "bar",
            hash: "#zz=1",
            host: "127.0.0.1:80",
            hostname: "127.0.0.1",
            href: "https://127.0.0.1:80/foo/bar?aa=1&bb%20cc=dd%20=ee&aa=2&aa#zz=1",
            path: "/foo/bar?aa=1&bb%20cc=dd%20=ee&aa=2&aa",
            pathname: "/foo/bar",
            port: "80",
            protocol: "https:",
            query: {aa: ["1", "2", ""], "bb cc": "dd =ee"},
            search: "?aa=1&bb%20cc=dd%20=ee&aa=2&aa"
        });
        // test error handling-behavior
        local.assertJsonEqual(local.urlParse(null), {
            basename: "",
            hash: "",
            host: "",
            hostname: "",
            href: "",
            path: "",
            pathname: "",
            port: "",
            protocol: "",
            query: {},
            search: ""
        });
        onError(null, options);
    }, onError);
};

local.testCase_uuid4Create_default = function (options, onError) {
/*
 * this function will test uuid4Create's default handling-behavior
 */
    local.assert((local.regexpValidateUuid).test(local.uuid4Create()), local.uuid4Create());
    onError(null, options);
};

local.testCase_webpage_error = function (options, onError) {
/*
 * this function will test webpage's error handling-behavior
 */
    if (local.env.npm_config_mode_test_fast || local.isBrowser) {
        onError(null, options);
        return;
    }
    local.browserTest({
        modeCoverageMerge: true,
        modeSilent: true,
        timeoutDefault: local.timeoutDefault - 5000,
        // /assets.script_only.html?modeTest=1&modeTestCase=_testCase_testRunDefault_failure&timeExit=
        url: local.serverLocalHost +
                // test script_only handling-behavior
                "/assets.script_only.html" +
                // test electron-callback handling-behavior
                "?modeTest=1&" +
                // test specific testCase handling-behavior
                // test testRunDefault's failure handling-behavior
                "modeTestCase=_testCase_testRunDefault_failure&" +
                // test timeExit handling-behavior
                "timeExit={{timeExit}}"
    }, function (error) {
        // validate error occurred
        local.assert(error, error);
        onError(null, options);
    });
};

local.utility2.serverLocalUrlTest = function (url) {
/*
 * this function will test if the url is local
 */
    url = local.urlParse(url).pathname;
    return local.isBrowser && !local.env.npm_config_mode_backend && (/^\/test\./).test(url);
};
}());



// run shared js-env code - init-after
(function () {



// init assets
local.assetsDict["/assets.swgg.swagger.json"] =
        local.fsReadFileOrEmptyStringSync("assets.swgg.swagger.json") ||
        local.assetsDict["/assets.swgg.swagger.json"] ||
        local.assetsDict["/assets.swgg.swagger.petstore.json"];
// coverage-hack - re-run test-server
local.testRunServer(local);
// coverage-hack - stateInit
local.stateInit({});
// init test-middleware
local.middlewareList.push(function (request, response, nextMiddleware) {
/*
 * this function will run the test-middleware
 */
    switch (request.urlParsed.pathname) {
    // test http POST handling-behavior
    case "/test.echo":
        // test response header handling-behavior
        local.serverRespondHeadSet(request, response, null, {
            "X-Response-Header-Test": "bb"
        });
        local.serverRespondEcho(request, response);
        break;
    // test http POST handling-behavior
    case "/test.body":
        // test request-body-read handling-behavior
        local.middlewareBodyRead(request, response, function () {
            // test multiple request-body-read handling-behavior
            local.middlewareBodyRead(request, response, function () {
                response.write(request.bodyRaw);
                response.end();
            });
        });
        break;
    // test 500-internal-server-error handling-behavior
    case "/test.error-500":
        // test multiple-callback serverRespondHeadSet handling-behavior
        local.serverRespondHeadSet(request, response, null, {});
        nextMiddleware(local.errorDefault);
        // test multiple-callback-error handling-behavior
        nextMiddleware(local.errorDefault);
        // test onErrorDefault handling-behavior
        local.testMock([
            [local, {swgg: null}]
        ], function (onError) {
            var error;
            error = new Error("error");
            error.statusCode = 500;
            local.middlewareError(error, request, response);
            onError();
        }, local.onErrorThrow);
        break;
    // test undefined-error handling-behavior
    case "/test.error-undefined":
        local.serverRespondDefault(request, response, 999);
        break;
    // test timeout handling-behavior
    case "/test.timeout":
        setTimeout(function () {
            response.end();
        }, 2000);
        break;
    // serve file
    default:
        local.middlewareFileServer(request, response, nextMiddleware);
    }
});
}());



// run node js-env code - init-after
/* istanbul ignore next */
(function () {
if (local.isBrowser) {
    return;
}



switch (local.env.HEROKU_APP_NAME) {
case "h1-cron1":
    // heroku-keepalive
    setInterval(function () {
        local.ajax({url: "https://h1-cron1.herokuapp.com"}, local.onErrorThrow);
    }, 5 * 60 * 1000);
    local.cronJob = local.nop;
    // update cron
    local.ajax({
        url: "https://kaizhu256.github.io/node-utility2/cronJob.js"
    }, function (error, xhr) {
        if (!error && xhr.responseText !== local.cronScript) {
            local.cronScript = xhr.responseText;
            local.vm.runInThisContext(local.cronScript);
        }
    });
    setInterval(function () {
        var cronTime;
        cronTime = new Date();
        if (
            cronTime.toISOString().slice(0, 16) <
            (local.cronTime && local.cronTime.toISOString())
        ) {
            return;
        }
        local.cronTime = cronTime;
        // cron every 5 minutes
        if (local.cronTime.getUTCMinutes() % 5 === 0) {
            // update cron
            local.ajax({
                url: "https://kaizhu256.github.io/node-utility2/cronJob.js"
            }, function (error, xhr) {
                if (!error && xhr.responseText !== local.cronScript) {
                    local.cronScript = xhr.responseText;
                    local.vm.runInThisContext(local.cronScript);
                }
            });
        }
        local.cronJob();
    }, 30000);
    break;
case "h1-proxy1":
    // heroku-keepalive
    setInterval(function () {
        local.ajax({url: "https://h1-proxy1.herokuapp.com"}, local.onErrorThrow);
    }, 5 * 60 * 1000);
    break;
}
// init cli
if (module !== require.main || local.global.utility2_rollup) {
    return;
}
local.assetsDict["/assets.script_only.html"] = "<h1>script_only_test</h1>\n" +
        "<script src=\"assets.utility2.js\"></script>\n" +
        "<script>window.utility2_onReadyBefore.counter += 1;</script>\n" +
        "<script src=\"assets.example.js\"></script>\n" +
        "<script src=\"assets.test.js\"></script>\n" +
        "<script>window.utility2_onReadyBefore();</script>\n";
if (process.argv[2]) {
    // start with coverage
    if (local.env.npm_config_mode_coverage) {
        process.argv.splice(1, 1, __dirname + "/lib.istanbul.js", "cover");
        local.istanbul.cliDict[process.argv[2]]();
        return;
    }
    // start
    process.argv.splice(1, 1);
    process.argv[1] = local.path.resolve(process.cwd(), process.argv[1]);
    local.Module.runMain();
}
}());
}());
