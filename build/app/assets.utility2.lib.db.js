// usr/bin/env node
/*
 * lib.db.js (2019.8.21)
 * https://github.com/kaizhu256/node-db-lite
 * this zero-dependency package will provide a persistent, in-browser database, with a working web-demo
 *
 * browser example:
    <script src="assets.db-lite.js"></script>
    <script>
    let dbTable1;
    dbTable1 = window.dbTable1 = window.utility2_db.dbTableCreateOne({
        name: "dbTable1"
    });
    dbTable1.idIndexCreate({ name: "field1" });
    dbTable1.crudSetOneById({ field1: "hello", field2: "world" });
    console.log(dbTable1.crudGetManyByQuery({
        limit: Infinity,
        query: { field1: "hello" },
        skip: 0,
        sort: [{ fieldName: 'field1', isDescending: false }]
    }));
    </script>
 *
 * node example:
    let db, dbTable1;
    utility2_db = require("./assets.db-lite.js");
    dbTable1 = global.dbTable1 = utility2_db.dbTableCreateOne({
        name: "dbTable1"
    });
    dbTable1.idIndexCreate({ name: "field1" });
    dbTable1.crudSetOneById({ field1: "hello", field2: "world" });
    console.log(dbTable1.crudGetManyByQuery({
        limit: Infinity,
        query: { field1: "hello" },
        skip: 0,
        sort: [{ fieldName: 'field1', isDescending: false }]
    }));
 */



/* istanbul instrument in package db */
// assets.utility2.header.js - start
/* istanbul ignore next */
/* jslint utility2:true */
(function (globalThis) {
    "use strict";
    let ArrayPrototypeFlat;
    let TextXxcoder;
    let consoleError;
    let debugName;
    let local;
    debugName = "debug" + String("Inline");
    // init globalThis
    globalThis.globalThis = globalThis.globalThis || globalThis;
    // init debug_inline
    if (!globalThis[debugName]) {
        consoleError = console.error;
        globalThis[debugName] = function (...argList) {
        /*
         * this function will both print <argList> to stderr
         * and return <argList>[0]
         */
            consoleError("\n\n" + debugName);
            consoleError.apply(console, argList);
            consoleError("\n");
            // return arg0 for inspection
            return argList[0];
        };
    }
    // polyfill
    ArrayPrototypeFlat = function (depth) {
    /*
     * this function will polyfill Array.prototype.flat
     * https://github.com/jonathantneal/array-flat-polyfill
     */
        depth = (
            globalThis.isNaN(depth)
            ? 1
            : Number(depth)
        );
        if (!depth) {
            return Array.prototype.slice.call(this);
        }
        return Array.prototype.reduce.call(this, function (acc, cur) {
            if (Array.isArray(cur)) {
                // recurse
                acc.push.apply(acc, ArrayPrototypeFlat.call(cur, depth - 1));
            } else {
                acc.push(cur);
            }
            return acc;
        }, []);
    };
    Array.prototype.flat = Array.prototype.flat || ArrayPrototypeFlat;
    Array.prototype.flatMap = Array.prototype.flatMap || function flatMap(
        ...argList
    ) {
    /*
     * this function will polyfill Array.prototype.flatMap
     * https://github.com/jonathantneal/array-flat-polyfill
     */
        return this.map(...argList).flat();
    };
    (function () {
        try {
            globalThis.TextDecoder = (
                globalThis.TextDecoder || require("util").TextDecoder
            );
            globalThis.TextEncoder = (
                globalThis.TextEncoder || require("util").TextEncoder
            );
        } catch (ignore) {}
    }());
    TextXxcoder = function () {
    /*
     * this function will polyfill TextDecoder/TextEncoder
     * https://gist.github.com/Yaffle/5458286
     */
        return;
    };
    TextXxcoder.prototype.decode = function (octets) {
    /*
     * this function will polyfill TextDecoder.prototype.decode
     * https://gist.github.com/Yaffle/5458286
     */
        let bytesNeeded;
        let codePoint;
        let ii;
        let kk;
        let octet;
        let string;
        string = "";
        ii = 0;
        while (ii < octets.length) {
            octet = octets[ii];
            bytesNeeded = 0;
            codePoint = 0;
            if (octet <= 0x7F) {
                bytesNeeded = 0;
                codePoint = octet & 0xFF;
            } else if (octet <= 0xDF) {
                bytesNeeded = 1;
                codePoint = octet & 0x1F;
            } else if (octet <= 0xEF) {
                bytesNeeded = 2;
                codePoint = octet & 0x0F;
            } else if (octet <= 0xF4) {
                bytesNeeded = 3;
                codePoint = octet & 0x07;
            }
            if (octets.length - ii - bytesNeeded > 0) {
                kk = 0;
                while (kk < bytesNeeded) {
                    octet = octets[ii + kk + 1];
                    codePoint = (codePoint << 6) | (octet & 0x3F);
                    kk += 1;
                }
            } else {
                codePoint = 0xFFFD;
                bytesNeeded = octets.length - ii;
            }
            string += String.fromCodePoint(codePoint);
            ii += bytesNeeded + 1;
        }
        return string;
    };
    TextXxcoder.prototype.encode = function (string) {
    /*
     * this function will polyfill TextEncoder.prototype.encode
     * https://gist.github.com/Yaffle/5458286
     */
        let bits;
        let cc;
        let codePoint;
        let ii;
        let length;
        let octets;
        octets = [];
        length = string.length;
        ii = 0;
        while (ii < length) {
            codePoint = string.codePointAt(ii);
            cc = 0;
            bits = 0;
            if (codePoint <= 0x0000007F) {
                cc = 0;
                bits = 0x00;
            } else if (codePoint <= 0x000007FF) {
                cc = 6;
                bits = 0xC0;
            } else if (codePoint <= 0x0000FFFF) {
                cc = 12;
                bits = 0xE0;
            } else if (codePoint <= 0x001FFFFF) {
                cc = 18;
                bits = 0xF0;
            }
            octets.push(bits | (codePoint >> cc));
            cc -= 6;
            while (cc >= 0) {
                octets.push(0x80 | ((codePoint >> cc) & 0x3F));
                cc -= 6;
            }
            ii += (
                codePoint >= 0x10000
                ? 2
                : 1
            );
        }
        return octets;
    };
    globalThis.TextDecoder = globalThis.TextDecoder || TextXxcoder;
    globalThis.TextEncoder = globalThis.TextEncoder || TextXxcoder;
    // init local
    local = {};
    local.local = local;
    globalThis.globalLocal = local;
    // init isBrowser
    local.isBrowser = (
        typeof globalThis.XMLHttpRequest === "function"
        && globalThis.navigator
        && typeof globalThis.navigator.userAgent === "string"
    );
    // init isWebWorker
    local.isWebWorker = (
        local.isBrowser && typeof globalThis.importScript === "function"
    );
    // init function
    local.assertOrThrow = function (passed, message) {
    /*
     * this function will throw err.<message> if <passed> is falsy
     */
        let err;
        if (passed) {
            return;
        }
        err = (
            (
                message
                && typeof message.message === "string"
                && typeof message.stack === "string"
            )
            // if message is errObj, then leave as is
            ? message
            : new Error(
                typeof message === "string"
                // if message is a string, then leave as is
                ? message
                // else JSON.stringify message
                : JSON.stringify(message, undefined, 4)
            )
        );
        throw err;
    };
    local.fsRmrfSync = function (dir) {
    /*
     * this function will sync "rm -rf" <dir>
     */
        let child_process;
        try {
            child_process = require("child_process");
        } catch (ignore) {
            return;
        }
        child_process.spawnSync("rm", [
            "-rf", dir
        ], {
            stdio: [
                "ignore", 1, 2
            ]
        });
    };
    local.fsWriteFileWithMkdirpSync = function (file, data) {
    /*
     * this function will sync write <data> to <file> with "mkdir -p"
     */
        let fs;
        try {
            fs = require("fs");
        } catch (ignore) {
            return;
        }
        // try to write file
        try {
            fs.writeFileSync(file, data);
        } catch (ignore) {
            // mkdir -p
            require("child_process").spawnSync(
                "mkdir",
                [
                    "-p", require("path").dirname(file)
                ],
                {
                    stdio: [
                        "ignore", 1, 2
                    ]
                }
            );
            // rewrite file
            fs.writeFileSync(file, data);
        }
    };
    local.functionOrNop = function (fnc) {
    /*
     * this function will if <fnc> exists,
     * return <fnc>,
     * else return <nop>
     */
        return fnc || local.nop;
    };
    local.nop = function () {
    /*
     * this function will do nothing
     */
        return;
    };
    local.objectAssignDefault = function (target, source) {
    /*
     * this function will if items from <target> are
     * null, undefined, or empty-string,
     * then overwrite them with items from <source>
     */
        target = target || {};
        Object.keys(source || {}).forEach(function (key) {
            if (
                target[key] === null
                || target[key] === undefined
                || target[key] === ""
            ) {
                target[key] = target[key] || source[key];
            }
        });
        return target;
    };
    local.querySelector = function (selectors) {
    /*
     * this function will return first dom-elem that match <selectors>
     */
        return (
            typeof document === "object" && document
            && typeof document.querySelector === "function"
            && document.querySelector(selectors)
        ) || {};
    };
    local.querySelectorAll = function (selectors) {
    /*
     * this function will return dom-elem-list that match <selectors>
     */
        return (
            typeof document === "object" && document
            && typeof document.querySelectorAll === "function"
            && Array.from(document.querySelectorAll(selectors))
        ) || [];
    };
    local.value = function (val) {
    /*
     * this function will return <val>
     */
        return val;
    };
    local.valueOrEmptyList = function (val) {
    /*
     * this function will return <val> or []
     */
        return val || [];
    };
    local.valueOrEmptyObject = function (val) {
    /*
     * this function will return <val> or {}
     */
        return val || {};
    };
    local.valueOrEmptyString = function (val) {
    /*
     * this function will return <val> or ""
     */
        return val || "";
    };
    // require builtin
    if (!local.isBrowser) {
        local.assert = require("assert");
        local.buffer = require("buffer");
        local.child_process = require("child_process");
        local.cluster = require("cluster");
        local.crypto = require("crypto");
        local.dgram = require("dgram");
        local.dns = require("dns");
        local.domain = require("domain");
        local.events = require("events");
        local.fs = require("fs");
        local.http = require("http");
        local.https = require("https");
        local.net = require("net");
        local.os = require("os");
        local.path = require("path");
        local.querystring = require("querystring");
        local.readline = require("readline");
        local.repl = require("repl");
        local.stream = require("stream");
        local.string_decoder = require("string_decoder");
        local.timers = require("timers");
        local.tls = require("tls");
        local.tty = require("tty");
        local.url = require("url");
        local.util = require("util");
        local.vm = require("vm");
        local.zlib = require("zlib");
    }
}((typeof globalThis === "object" && globalThis) || (function () {
    return Function("return this")(); // jslint ignore:line
}())));
// assets.utility2.header.js - end



(function (local) {
"use strict";



/* istanbul ignore next */
// run shared js-env code - init-before
(function () {
// init local
local = (
    globalThis.utility2_rollup
    // || globalThis.utility2_rollup_old
    // || require("./assets.utility2.rollup.js")
    || globalThis.globalLocal
);
// init exports
if (local.isBrowser) {
    globalThis.utility2_db = local;
} else {
    module.exports = local;
    module.exports.__dirname = __dirname;
}
// init lib main
local.db = local;



/* validateLineSortedReset */
local.cliRun = function (opt) {
/*
 * this function will run the cli with given <opt>
 */
    local.cliDict._eval = local.cliDict._eval || function () {
    /*
     * <code>
     * will eval <code>
     */
        globalThis.local = local;
        local.vm.runInThisContext(process.argv[3]);
    };
    local.cliDict._help = local.cliDict._help || function () {
    /*
     *
     * will print help
     */
        let commandList;
        let file;
        let packageJson;
        let text;
        let textDict;
        commandList = [
            {
                argList: "<arg2>  ...",
                description: "usage:",
                command: [
                    "<arg1>"
                ]
            }, {
                argList: "'console.log(\"hello world\")'",
                description: "example:",
                command: [
                    "--eval"
                ]
            }
        ];
        file = __filename.replace((
            /.*\//
        ), "");
        opt = Object.assign({}, opt);
        packageJson = require("./package.json");
        // validate comment
        opt.rgxComment = opt.rgxComment || (
            /\)\u0020\{\n(?:|\u0020{4})\/\*\n(?:\u0020|\u0020{5})\*((?:\u0020<[^>]*?>|\u0020\.\.\.)*?)\n(?:\u0020|\u0020{5})\*\u0020(will\u0020.*?\S)\n(?:\u0020|\u0020{5})\*\/\n(?:\u0020{4}|\u0020{8})\S/
        );
        textDict = {};
        Object.keys(local.cliDict).sort().forEach(function (key, ii) {
            if (key[0] === "_" && key !== "_default") {
                return;
            }
            text = String(local.cliDict[key]);
            if (key === "_default") {
                key = "";
            }
            textDict[text] = textDict[text] || (ii + 2);
            ii = textDict[text];
            if (commandList[ii]) {
                commandList[ii].command.push(key);
                return;
            }
            try {
                commandList[ii] = opt.rgxComment.exec(text);
                commandList[ii] = {
                    argList: local.valueOrEmptyString(
                        commandList[ii][1]
                    ).trim(),
                    command: [
                        key
                    ],
                    description: commandList[ii][2]
                };
            } catch (ignore) {
                local.assertOrThrow(null, new Error(
                    "cliRun - cannot parse comment in COMMAND "
                    + key
                    + ":\nnew RegExp("
                    + JSON.stringify(opt.rgxComment.source)
                    + ").exec(" + JSON.stringify(text).replace((
                        /\\\\/g
                    ), "\u0000").replace((
                        /\\n/g
                    ), "\\n\\\n").replace((
                        /\u0000/g
                    ), "\\\\") + ");"
                ));
            }
        });
        text = "";
        text += packageJson.name + " (" + packageJson.version + ")\n\n";
        text += commandList.filter(function (elem) {
            return elem;
        }).map(function (elem, ii) {
            elem.command = elem.command.filter(function (elem) {
                return elem;
            });
            switch (ii) {
            case 0:
            case 1:
                elem.argList = [
                    elem.argList
                ];
                break;
            default:
                elem.argList = elem.argList.split(" ");
                elem.description = (
                    "# COMMAND "
                    + (elem.command[0] || "<none>") + "\n# "
                    + elem.description
                );
            }
            return (
                elem.description + "\n  " + file
                + "  " + elem.command.sort().join("|") + "  "
                + elem.argList.join("  ")
            );
        }).join("\n\n");
        console.log(text);
    };
    local.cliDict["--eval"] = local.cliDict["--eval"] || local.cliDict._eval;
    local.cliDict["--help"] = local.cliDict["--help"] || local.cliDict._help;
    local.cliDict["-e"] = local.cliDict["-e"] || local.cliDict._eval;
    local.cliDict["-h"] = local.cliDict["-h"] || local.cliDict._help;
    local.cliDict._default = local.cliDict._default || local.cliDict._help;
    local.cliDict.help = local.cliDict.help || local.cliDict._help;
    local.cliDict._interactive = local.cliDict._interactive || function () {
    /*
     *
     * will start interactive-mode
     */
        globalThis.local = local;
        local.value(local.replStart || require("repl").start)({
            useGlobal: true
        });
    };
    local.cliDict["--interactive"] = (
        local.cliDict["--interactive"]
        || local.cliDict._interactive
    );
    local.cliDict["-i"] = local.cliDict["-i"] || local.cliDict._interactive;
    local.cliDict._version = local.cliDict._version || function () {
    /*
     *
     * will print version
     */
        console.log(require(__dirname + "/package.json").version);
    };
    local.cliDict["--version"] = (
        local.cliDict["--version"]
        || local.cliDict._version
    );
    local.cliDict["-v"] = local.cliDict["-v"] || local.cliDict._version;
    // default to --help command if no arguments are given
    if (process.argv.length <= 2) {
        local.cliDict._help();
        return;
    }
    if (local.cliDict[process.argv[2]]) {
        local.cliDict[process.argv[2]]();
        return;
    }
    local.cliDict._default();
};

local.jsonCopy = function (obj) {
/*
 * this function will deep-copy obj
 */
    return (
        obj === undefined
        ? undefined
        : JSON.parse(JSON.stringify(obj))
    );
};

local.jsonStringifyOrdered = function (obj, replacer, space) {
/*
 * this function will JSON.stringify <obj>,
 * with object-keys sorted and circular-references removed
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#Syntax
 */
    let circularSet;
    let stringify;
    let tmp;
    stringify = function (obj) {
    /*
     * this function will recursively JSON.stringify obj,
     * with object-keys sorted and circular-references removed
     */
        // if obj is not an object or function, then JSON.stringify as normal
        if (!(
            obj
            && typeof obj === "object"
            && typeof obj.toJSON !== "function"
        )) {
            return JSON.stringify(obj);
        }
        // ignore circular-reference
        if (circularSet.has(obj)) {
            return;
        }
        circularSet.add(obj);
        // if obj is an array, then recurse its items
        if (Array.isArray(obj)) {
            tmp = "[" + obj.map(function (obj) {
                // recurse
                tmp = stringify(obj);
                return (
                    typeof tmp === "string"
                    ? tmp
                    : "null"
                );
            }).join(",") + "]";
            circularSet.delete(obj);
            return tmp;
        }
        // if obj is not an array,
        // then recurse its items with object-keys sorted
        tmp = "{" + Object.keys(obj).sort().map(function (key) {
            // recurse
            tmp = stringify(obj[key]);
            if (typeof tmp === "string") {
                return JSON.stringify(key) + ":" + tmp;
            }
        }).filter(function (obj) {
            return typeof obj === "string";
        }).join(",") + "}";
        circularSet.delete(obj);
        return tmp;
    };
    circularSet = new Set();
    return JSON.stringify((
        (typeof obj === "object" && obj)
        // recurse
        ? JSON.parse(stringify(obj))
        : obj
    ), replacer, space);
};

local.listShuffle = function (list) {
/*
 * this function will inplace shuffle <list> using fisher-yates algorithm
 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 */
    let ii;
    let random;
    let swap;
    ii = list.length;
    while (ii > 1) {
        ii -= 1;
        random = Math.floor(Math.random() * (ii + 1));
        swap = list[ii];
        list[ii] = list[random];
        list[random] = swap;
    }
    return list;
};

local.objectSetOverride = function (dict, overrides, depth, env) {
/*
 * this function will recursively set overrides for items in dict
 */
    dict = dict || {};
    env = env || (typeof process === "object" && process.env) || {};
    overrides = overrides || {};
    Object.keys(overrides).forEach(function (key) {
        let dict2;
        let overrides2;
        dict2 = dict[key];
        overrides2 = overrides[key];
        if (overrides2 === undefined) {
            return;
        }
        // if both dict2 and overrides2 are non-null and non-array objects,
        // then recurse with dict2 and overrides2
        if (
            depth > 1
            // dict2 is a non-null and non-array object
            && typeof dict2 === "object" && dict2 && !Array.isArray(dict2)
            // overrides2 is a non-null and non-array object
            && typeof overrides2 === "object" && overrides2
            && !Array.isArray(overrides2)
        ) {
            local.objectSetOverride(dict2, overrides2, depth - 1, env);
            return;
        }
        // else set dict[key] with overrides[key]
        dict[key] = (
            dict === env
            // if dict is env, then overrides falsy-value with empty-string
            ? overrides2 || ""
            : overrides2
        );
    });
    return dict;
};

local.onErrorDefault = function (err) {
/*
 * this function will if <err> exists, then print it to stderr
 */
    if (err) {
        console.error(err);
    }
    return err;
};

local.onErrorWithStack = function (onError) {
/*
 * this function will wrap <onError> with wrapper preserving current-stack
 */
    let onError2;
    let stack;
    stack = new Error().stack.replace((
        /(.*?)\n.*?$/m
    ), "$1");
    onError2 = function (err, data, meta) {
        // append current-stack to err.stack
        if (
            err
            && typeof err.stack === "string"
            && err !== local.errDefault
            && String(err.stack).indexOf(stack.split("\n")[2]) < 0
        ) {
            err.stack += "\n" + stack;
        }
        onError(err, data, meta);
    };
    // debug onError
    onError2.toString = function () {
        return String(onError);
    };
    return onError2;
};

local.onParallel = function (onError, onEach, onRetry) {
/*
 * this function will create a function that will
 * 1. run async tasks in parallel
 * 2. if counter === 0 or err occurred, then call onError(err)
 */
    let onParallel;
    onError = local.onErrorWithStack(onError);
    onEach = onEach || local.nop;
    onRetry = onRetry || local.nop;
    onParallel = function (err, data) {
        if (onRetry(err, data)) {
            return;
        }
        // decrement counter
        onParallel.counter -= 1;
        // validate counter
        if (!(onParallel.counter >= 0 || err || onParallel.err)) {
            err = new Error(
                "invalid onParallel.counter = " + onParallel.counter
            );
        // ensure onError is run only once
        } else if (onParallel.counter < 0) {
            return;
        }
        // handle err
        if (err) {
            onParallel.err = err;
            // ensure counter <= 0
            onParallel.counter = -Math.abs(onParallel.counter);
        }
        // call onError when isDone
        if (onParallel.counter <= 0) {
            onError(err, data);
            return;
        }
        onEach();
    };
    // init counter
    onParallel.counter = 0;
    // return callback
    return onParallel;
};

local.replStart = function () {
/*
 * this function will start repl-debugger
 */
    let that;
    if (globalThis.utility2_repl1) {
        return;
    }
    // start repl
    that = require("repl").start({
        useGlobal: true
    });
    globalThis.utility2_repl1 = that;
    // save eval-function
    that.evalDefault = that.eval;
    // hook custom-eval-function
    that.eval = function (script, context, file, onError) {
        script.replace((
            /^(\S+)\u0020(.*?)\n/
        ), function (ignore, match1, match2) {
            switch (match1) {
            // syntax-sugar - run shell-command
            case "$":
                switch (match2) {
                // syntax-sugar - run git diff
                case "git diff":
                    match2 = "git diff --color | cat";
                    break;
                // syntax-sugar - run git log
                case "git log":
                    match2 = "git log -n 4 | cat";
                    break;
                // syntax-sugar - run ll
                case "ll":
                    match2 = "ls -Fal";
                    break;
                }
                // source lib.utility2.sh
                if (
                    process.platform !== "win32"
                    && process.env.npm_config_dir_utility2 && (match2 !== ":")
                ) {
                    match2 = (
                        ". " + process.env.npm_config_dir_utility2
                        + "/lib.utility2.sh;" + match2
                    );
                }
                // run shell-command
                require("child_process").spawn(match2, {
                    shell: true,
                    stdio: [
                        "ignore", 1, 2
                    ]
                // print exitCode
                }).on("exit", function (exitCode) {
                    console.error("exitCode " + exitCode);
                    that.evalDefault("\n", context, file, onError);
                });
                script = "\n";
                break;
            // syntax-sugar - map text with charCodeAt
            case "charCode":
                console.error(
                    match2.split("").map(function (chr) {
                        return (
                            "\\u"
                            + chr.charCodeAt(0).toString(16).padStart(4, 0)
                        );
                    }).join("")
                );
                script = "\n";
                break;
            // syntax-sugar - sort chr
            case "charSort":
                console.error(JSON.stringify(match2.split("").sort().join("")));
                script = "\n";
                break;
            // syntax-sugar - grep current dir
            case "grep":
                // run shell-command
                require("child_process").spawn((
                    "find . -type f | grep -v -E "
/* jslint ignore:start */
+ '"\
/\\.|~\$|(\\b|_)(\\.\\d|\
archive|artifact|\
bower_component|build|\
coverage|\
doc|\
external|\
fixture|\
git_module|\
jquery|\
log|\
min|misc|mock|\
node_module|\
raw|\rollup|\
swp|\
tmp|\
vendor)s{0,1}(\\b|_)\
" '
/* jslint ignore:end */
                    + "| tr \"\\n\" \"\\000\" | xargs -0 grep -HIin -E \""
                    + match2 + "\""
                ), {
                    shell: true,
                    stdio: [
                        "ignore", 1, 2
                    ]
                }).on("exit", function (exitCode) {
                    console.error("exitCode " + exitCode);
                    that.evalDefault("\n", context, file, onError);
                });
                script = "\n";
                break;
            // syntax-sugar - list obj's keys, sorted by item-type
            // console.error(Object.keys(global).map(function(key){return(typeof global[key]==='object'&&global[key]&&global[key]===global[key]?'global':typeof global[key])+' '+key;}).sort().join('\n')) // jslint ignore:line
            case "keys":
                script = (
                    "console.error(Object.keys(" + match2
                    + ").map(function(key){return("
                    + "typeof " + match2 + "[key]==='object'&&"
                    + match2 + "[key]&&"
                    + match2 + "[key]===global[key]"
                    + "?'global'"
                    + ":typeof " + match2 + "[key]"
                    + ")+' '+key;"
                    + "}).sort().join('\\n'))\n"
                );
                break;
            // syntax-sugar - print String(val)
            case "print":
                script = "console.error(String(" + match2 + "))\n";
                break;
            }
        });
        // eval script
        that.evalDefault(script, context, file, onError);
    };
};

local.setTimeoutOnError = function (onError, timeout, err, data) {
/*
 * this function will after timeout has passed,
 * then call <onError>(<err>, <data>)
 */
    if (typeof onError === "function") {
        setTimeout(function () {
            onError(err, data);
        }, timeout);
    }
    return data;
};
}());



// run shared js-env code - lib.storage.js
(function (local) {
let child_process;
let clear;
let defer;
let deferList;
let fs;
let getItem;
let init;
let keys;
let length;
let os;
let removeItem;
let setItem;
let storage;
let storageDir;

storageDir = "tmp/storage." + (
    local.isBrowser
    ? "undefined"
    : process.env.NODE_ENV
);
if (!local.isBrowser) {
    // require modules
    child_process = require("child_process");
    fs = require("fs");
    os = require("os");
}

clear = function (onError) {
/*
 * this function will clear storage
 */
    defer({
        action: "clear"
    }, onError);
};

defer = function (opt, onError) {
/*
 * this function will defer <opt>.action until storage is ready
 */
    let data;
    let isDone;
    let objectStore;
    let onError2;
    let req;
    let tmp;
    onError = onError || function (err) {
        // handle err
        local.assertOrThrow(!err, err);
    };
    if (!storage) {
        deferList.push(function () {
            defer(opt, onError);
        });
        init();
        return;
    }
    if (local.isBrowser) {
        onError2 = function () {
            /* istanbul ignore next */
            if (isDone) {
                return;
            }
            isDone = true;
            onError(
                req && (req.error || req.transaction.error),
                data || req.result || ""
            );
        };
        switch (opt.action) {
        case "clear":
        case "removeItem":
        case "setItem":
            objectStore = storage.transaction(
                storageDir,
                "readwrite"
            ).objectStore(storageDir);
            break;
        default:
            objectStore = storage.transaction(
                storageDir,
                "readonly"
            ).objectStore(storageDir);
        }
        switch (opt.action) {
        case "clear":
            req = objectStore.clear();
            break;
        case "getItem":
            req = objectStore.get(String(opt.key));
            break;
        case "keys":
            data = [];
            req = objectStore.openCursor();
            req.onsuccess = function () {
                if (!req.result) {
                    onError2();
                    return;
                }
                data.push(req.result.key);
                req.result.continue();
            };
            break;
        case "length":
            req = objectStore.count();
            break;
        case "removeItem":
            req = objectStore.delete(String(opt.key));
            break;
        case "setItem":
            req = objectStore.put(opt.value, String(opt.key));
            break;
        }
        [
            "onabort", "onerror", "onsuccess"
        ].forEach(function (handler) {
            req[handler] = req[handler] || onError2;
        });
        // debug req
        local._debugStorageReq = req;
    } else {
        switch (opt.action) {
        case "clear":
            child_process.spawnSync("rm -f " + storage + "/*", {
                shell: true,
                stdio: [
                    "ignore", 1, 2
                ]
            });
            setTimeout(onError);
            break;
        case "getItem":
            fs.readFile(
                storage + "/" + encodeURIComponent(String(opt.key)),
                "utf8",
                function (ignore, data) {
                    onError(null, data || "");
                }
            );
            break;
        case "keys":
            fs.readdir(storage, function (err, data) {
                onError(err, data && data.map(decodeURIComponent));
            });
            break;
        case "length":
            fs.readdir(storage, function (err, data) {
                onError(err, data && data.length);
            });
            break;
        case "removeItem":
            fs.unlink(
                storage + "/" + encodeURIComponent(String(opt.key)),
                // ignore err
                function () {
                    onError();
                }
            );
            break;
        case "setItem":
            tmp = os.tmpdir() + "/" + Date.now() + Math.random();
            // save to tmp
            fs.writeFile(tmp, opt.value, function (err) {
                // handle err
                local.assertOrThrow(!err, err);
                // rename tmp to key
                fs.rename(
                    tmp,
                    storage + "/" + encodeURIComponent(String(opt.key)),
                    onError
                );
            });
            break;
        }
    }
};

deferList = [];

getItem = function (key, onError) {
/*
 * this function will get the item with given key from storage
 */
    defer({
        action: "getItem",
        key
    }, onError);
};

init = function () {
/*
 * this function will init storage
 */
    let onError;
    let req;
    onError = function (err) {
        // handle err
        local.assertOrThrow(!err, err);
        if (local.isBrowser) {
            storage = globalThis[storageDir];
        }
        while (deferList.length) {
            deferList.shift()();
        }
    };
    if (local.isBrowser) {
        storage = globalThis[storageDir];
    }
    if (storage) {
        onError();
        return;
    }
    if (local.isBrowser) {
        // init indexedDB
        try {
            req = globalThis.indexedDB.open(storageDir);
            // debug req
            local._debugStorageReqIndexedDB = req;
            req.onerror = onError;
            req.onsuccess = function () {
                globalThis[storageDir] = req.result;
                onError();
            };
            req.onupgradeneeded = function () {
                if (!req.result.objectStoreNames.contains(storageDir)) {
                    req.result.createObjectStore(storageDir);
                }
            };
        } catch (ignore) {}
    } else {
        // mkdirp storage
        storage = storageDir;
        child_process.spawnSync("mkdir", [
            "-p", storage
        ], {
            stdio: [
                "ignore", 1, 2
            ]
        });
        onError();
    }
};

keys = function (onError) {
/*
 * this function will get all the keys in storage
 */
    defer({
        action: "keys"
    }, onError);
};

length = function (onError) {
/*
 * this function will get the number of items in storage
 */
    defer({
        action: "length"
    }, onError);
};

removeItem = function (key, onError) {
/*
 * this function will remove the item with given key from storage
 */
    defer({
        action: "removeItem",
        key
    }, onError);
};

setItem = function (key, value, onError) {
/*
 * this function will set the item with given key and value to storage
 */
    defer({
        action: "setItem",
        key,
        value
    }, onError);
};

// init local
local.storage = storage;
local.storageClear = clear;
local.storageDefer = defer;
local.storageDeferList = deferList;
local.storageDir = storageDir;
local.storageGetItem = getItem;
local.storageInit = init;
local.storageKeys = keys;
local.storageLength = length;
local.storageRemoveItem = removeItem;
local.storageSetItem = setItem;
}(local));



// run shared js-env code - lib.dbTable.js
(function () {
local._DbTable = function (opt) {
/*
 * this function will create a dbTable
 */
    this.name = String(opt.name);
    // register dbTable in dbTableDict
    local.dbTableDict[this.name] = this;
    this.dbRowList = [];
    this.isDirty = null;
    this.idIndexList = [
        {
            isInteger: false,
            name: "_id",
            dict: {}
        }
    ];
    this.onSaveList = [];
    this.sizeLimit = opt.sizeLimit || 0;
};

local._DbTable.prototype._cleanup = function () {
/*
 * this function will cleanup soft-deleted records from the dbTable
 */
    let dbRow;
    let ii;
    let list;
    if (!this.isDirty && this.dbRowList.length <= this.sizeLimit) {
        return;
    }
    this.isDirty = null;
    // cleanup dbRowList
    list = this.dbRowList;
    this.dbRowList = [];
    // optimization - while-loop
    ii = 0;
    while (ii < list.length) {
        dbRow = list[ii];
        // cleanup isRemoved
        if (!dbRow.$isRemoved) {
            this.dbRowList.push(dbRow);
        }
        ii += 1;
    }
    if (this.sizeLimit && this.dbRowList.length >= 1.5 * this.sizeLimit) {
        this.dbRowList = this._crudGetManyByQuery(
            {},
            this.sortDefault,
            0,
            this.sizeLimit
        );
    }
};

local._DbTable.prototype._crudGetManyByQuery = function (
    query,
    sort,
    skip,
    limit,
    shuffle
) {
/*
 * this function will get the dbRow's in the dbTable,
 * with given query, sort, skip, and limit
 */
    let ii;
    let result;
    result = this.dbRowList;
    // get by query
    if (result.length && query && Object.keys(query).length) {
        result = local.dbRowListGetManyByQuery(this.dbRowList, query);
    }
    // sort
    local.valueOrEmptyList(sort).forEach(function (element) {
        // bug-workaround - v8 does not have stable-sort
        // optimization - while-loop
        ii = 0;
        while (ii < result.length) {
            result[ii].$ii = ii;
            ii += 1;
        }
        result.sort(function (aa, bb) {
            return local.sortCompare(
                local.dbRowGetItem(aa, element.fieldName),
                local.dbRowGetItem(bb, element.fieldName),
                aa.$ii,
                bb.$ii
            );
        });
        if (element.isDescending) {
            result.reverse();
        }
    });
    // skip
    result = result.slice(skip || 0);
    // shuffle
    local.functionOrNop(shuffle && local.listShuffle)(result);
    // limit
    result = result.slice(0, limit || Infinity);
    return result;
};

local._DbTable.prototype._crudGetOneById = function (idDict) {
/*
 * this function will get the dbRow in the dbTable with given idDict
 */
    let id;
    let result;
    idDict = local.objectSetOverride(idDict);
    result = null;
    this.idIndexList.some(function (idIndex) {
        id = idDict[idIndex.name];
        // optimization - hasOwnProperty
        if (idIndex.dict.hasOwnProperty(id)) {
            result = idIndex.dict[id];
            return result;
        }
    });
    return result;
};

local._DbTable.prototype._crudRemoveOneById = function (idDict, circularSet) {
/*
 * this function will remove the dbRow from the dbTable with given idDict
 */
    let id;
    let result;
    let that;
    if (!idDict) {
        return null;
    }
    that = this;
    circularSet = circularSet || new Set([
        idDict
    ]);
    result = null;
    that.idIndexList.forEach(function (idIndex) {
        id = idDict[idIndex.name];
        // optimization - hasOwnProperty
        if (!idIndex.dict.hasOwnProperty(id)) {
            return;
        }
        result = idIndex.dict[id];
        delete idIndex.dict[id];
        // optimization - soft-delete
        result.$isRemoved = true;
        that.isDirty = true;
        if (circularSet.has(result)) {
            return;
        }
        circularSet.add(result);
        // recurse
        that._crudRemoveOneById(result, circularSet);
    });
    that.save();
    return result;
};

local._DbTable.prototype._crudSetOneById = function (dbRow) {
/*
 * this function will set the dbRow into the dbTable with given dbRow._id
 * WARNING - existing dbRow with conflicting dbRow._id will be removed
 */
    let existing;
    let id;
    let normalize;
    let timeNow;
    normalize = function (dbRow) {
    /*
     * this function will recursively normalize dbRow
     */
        switch (typeof dbRow) {
        case "boolean":
        case "string":
            return dbRow;
        case "number":
            return (
                Number.isFinite(dbRow)
                ? dbRow
                : undefined
            );
        case "object":
            if (!dbRow) {
                return;
            }
            break;
        default:
            return;
        }
        Object.keys(dbRow).forEach(function (key) {
            dbRow[key] = (
                (key[0] === "$" || key.indexOf(".") >= 0)
                // invalid-property
                ? undefined
                // recurse
                : normalize(dbRow[key])
            );
        });
        return dbRow;
    };
    dbRow = local.jsonCopy(local.objectSetOverride(dbRow));
    // update timestamp
    timeNow = new Date().toISOString();
    dbRow._timeCreated = dbRow._timeCreated || timeNow;
    if (!local.modeImport) {
        dbRow._timeUpdated = timeNow;
    }
    // normalize
    dbRow = normalize(dbRow);
    dbRow = local.jsonCopy(dbRow);
    // remove existing dbRow
    existing = this._crudRemoveOneById(dbRow) || dbRow;
    this.idIndexList.forEach(function (idIndex) {
        // auto-set id
        id = local.dbRowSetId(existing, idIndex);
        // copy id from existing to dbRow
        dbRow[idIndex.name] = id;
        // set dbRow
        idIndex.dict[id] = dbRow;
    });
    // update dbRowList
    this.dbRowList.push(dbRow);
    this.save();
    return dbRow;
};

local._DbTable.prototype._crudUpdateOneById = function (dbRow) {
/*
 * this function will update the dbRow in the dbTable,
 * if it exists with given dbRow._id
 * WARNING
 * existing dbRow's with conflicting unique-keys (besides the one being updated)
 * will be removed
 */
    let id;
    let result;
    dbRow = local.jsonCopy(local.objectSetOverride(dbRow));
    result = {};
    this.idIndexList.some(function (idIndex) {
        id = dbRow[idIndex.name];
        // optimization - hasOwnProperty
        if (idIndex.dict.hasOwnProperty(id)) {
            result = idIndex.dict[id];
            return true;
        }
    });
    // remove existing dbRow
    result = local.jsonCopy(this._crudRemoveOneById(result)) || result;
    // update dbRow
    delete dbRow._timeCreated;
    local.objectSetOverride(result, dbRow, 10);
    // replace dbRow
    result = this._crudSetOneById(result);
    return result;
};

local._DbTable.prototype.crudCountAll = function (onError) {
/*
 * this function will count all of dbRow's in dbTable
 */
    this._cleanup();
    return local.setTimeoutOnError(onError, 0, null, this.dbRowList.length);
};

local._DbTable.prototype.crudCountManyByQuery = function (query, onError) {
/*
 * this function will count the number of dbRow's in dbTable with given query
 */
    this._cleanup();
    return local.setTimeoutOnError(
        onError,
        0,
        null,
        this._crudGetManyByQuery(query).length
    );
};

local._DbTable.prototype.crudGetManyById = function (idDictList, onError) {
/*
 * this function will get the dbRow's in the dbTable with given idDictList
 */
    let that;
    this._cleanup();
    that = this;
    return local.setTimeoutOnError(onError, 0, null, local.dbRowProject(
        local.valueOrEmptyList(idDictList).map(function (idDict) {
            return that._crudGetOneById(idDict);
        })
    ));
};

local._DbTable.prototype.crudGetManyByQuery = function (opt, onError) {
/*
 * this function will get the dbRow's in the dbTable with given <opt>.query
 */
    this._cleanup();
    opt = local.objectSetOverride(opt);
    return local.setTimeoutOnError(onError, 0, null, local.dbRowProject(
        this._crudGetManyByQuery(
            opt.query,
            opt.sort || this.sortDefault,
            opt.skip,
            opt.limit,
            opt.shuffle
        ),
        opt.fieldList
    ));
};

local._DbTable.prototype.crudGetOneById = function (idDict, onError) {
/*
 * this function will get the dbRow in the dbTable with given idDict
 */
    this._cleanup();
    return local.setTimeoutOnError(onError, 0, null, local.dbRowProject(
        this._crudGetOneById(idDict)
    ));
};

local._DbTable.prototype.crudGetOneByQuery = function (query, onError) {
/*
 * this function will get the dbRow in the dbTable with given query
 */
    let ii;
    let result;
    this._cleanup();
    // optimization - while-loop
    ii = 0;
    while (ii < this.dbRowList.length) {
        result = local.dbRowListGetManyByQuery([
            this.dbRowList[ii]
        ], query)[0];
        if (result) {
            break;
        }
        ii += 1;
    }
    return local.setTimeoutOnError(
        onError,
        0,
        null,
        local.dbRowProject(result)
    );
};

local._DbTable.prototype.crudGetOneByRandom = function (onError) {
/*
 * this function will get a random dbRow in the dbTable
 */
    this._cleanup();
    return local.setTimeoutOnError(onError, 0, null, local.dbRowProject(
        this.dbRowList[Math.floor(Math.random() * this.dbRowList.length)]
    ));
};

local._DbTable.prototype.crudRemoveAll = function (onError) {
/*
 * this function will remove all of the dbRow's from the dbTable
 */
    let idIndexList;
    // save idIndexList
    idIndexList = this.idIndexList;
    // reset dbTable
    local._DbTable.call(this, this);
    // restore idIndexList
    local.dbTableCreateOne({
        name: this.name,
        idIndexCreateList: idIndexList
    }, onError);
};

local._DbTable.prototype.crudRemoveManyById = function (idDictList, onError) {
/*
 * this function will remove the dbRow's from the dbTable with given idDictList
 */
    let that;
    that = this;
    return local.setTimeoutOnError(onError, 0, null, local.dbRowProject(
        local.valueOrEmptyList(idDictList).map(function (dbRow) {
            return that._crudRemoveOneById(dbRow);
        })
    ));
};

local._DbTable.prototype.crudRemoveManyByQuery = function (query, onError) {
/*
 * this function will remove the dbRow's from the dbTable with given query
 */
    let that;
    that = this;
    return local.setTimeoutOnError(onError, 0, null, local.dbRowProject(
        that._crudGetManyByQuery(query).map(function (dbRow) {
            return that._crudRemoveOneById(dbRow);
        })
    ));
};

local._DbTable.prototype.crudRemoveOneById = function (idDict, onError) {
/*
 * this function will remove the dbRow from the dbTable with given idDict
 */
    return local.setTimeoutOnError(onError, 0, null, local.dbRowProject(
        this._crudRemoveOneById(idDict)
    ));
};

local._DbTable.prototype.crudSetManyById = function (dbRowList, onError) {
/*
 * this function will set the dbRowList into the dbTable
 */
    let that;
    that = this;
    return local.setTimeoutOnError(onError, 0, null, local.dbRowProject(
        local.valueOrEmptyList(dbRowList).map(function (dbRow) {
            return that._crudSetOneById(dbRow);
        })
    ));
};

local._DbTable.prototype.crudSetOneById = function (dbRow, onError) {
/*
 * this function will set the dbRow into the dbTable with given dbRow._id
 */
    return local.setTimeoutOnError(onError, 0, null, local.dbRowProject(
        this._crudSetOneById(dbRow)
    ));
};

local._DbTable.prototype.crudUpdateManyById = function (dbRowList, onError) {
/*
 * this function will update the dbRowList in the dbTable,
 * if they exist with given dbRow._id's
 */
    let that;
    that = this;
    return local.setTimeoutOnError(onError, 0, null, local.dbRowProject(
        local.valueOrEmptyList(dbRowList).map(function (dbRow) {
            return that._crudUpdateOneById(dbRow);
        })
    ));
};

local._DbTable.prototype.crudUpdateManyByQuery = function (
    query,
    dbRow,
    onError
) {
/*
 * this function will update the dbRow's in the dbTable with given query
 */
    let result;
    let that;
    let tmp;
    that = this;
    tmp = local.jsonCopy(local.objectSetOverride(dbRow));
    result = that._crudGetManyByQuery(query).map(function (dbRow) {
        tmp._id = dbRow._id;
        return that._crudUpdateOneById(tmp);
    });
    return local.setTimeoutOnError(onError, 0, null, result);
};

local._DbTable.prototype.crudUpdateOneById = function (dbRow, onError) {
/*
 * this function will update the dbRow in the dbTable,
 * if it exists with given dbRow._id
 */
    return local.setTimeoutOnError(onError, 0, null, local.dbRowProject(
        this._crudUpdateOneById(dbRow)
    ));
};

local._DbTable.prototype.drop = function (onError) {
/*
 * this function will drop the dbTable
 */
    console.error("db - dropping dbTable " + this.name + " ...");
    // cancel pending save
    this.timerSave = null;
    while (this.onSaveList.length) {
        this.onSaveList.shift()();
    }
    // reset dbTable
    local._DbTable.call(this, this);
    // clear persistence
    local.storageRemoveItem("dbTable." + this.name + ".json", onError);
};

local._DbTable.prototype.export = function (onError) {
/*
 * this function will export the db
 */
    let result;
    let that;
    this._cleanup();
    that = this;
    result = "";
    that.idIndexList.forEach(function (idIndex) {
        result += that.name + " idIndexCreate " + JSON.stringify({
            isInteger: idIndex.isInteger,
            name: idIndex.name
        }) + "\n";
    });
    result += that.name + " sizeLimit " + that.sizeLimit + "\n";
    result += that.name + " sortDefault " + JSON.stringify(
        that.sortDefault
    ) + "\n";
    that.crudGetManyByQuery({}).forEach(function (dbRow) {
        result += that.name + " dbRowSet " + JSON.stringify(dbRow) + "\n";
    });
    return local.setTimeoutOnError(onError, 0, null, result.trim());
};

local._DbTable.prototype.idIndexCreate = function (opt, onError) {
/*
 * this function will create an idIndex with given <opt>.name
 */
    let dbRow;
    let idIndex;
    let ii;
    let name;
    opt = local.objectSetOverride(opt);
    name = String(opt.name);
    // disallow idIndex with dot-name
    if (name.indexOf(".") >= 0 || name === "_id") {
        return local.setTimeoutOnError(onError);
    }
    // remove existing idIndex
    this.idIndexRemove(opt);
    // init idIndex
    idIndex = {
        dict: {},
        isInteger: Boolean(opt.isInteger),
        name
    };
    this.idIndexList.push(idIndex);
    // populate idIndex with dbRowList
    // optimization - while-loop
    ii = 0;
    while (ii < this.dbRowList.length) {
        dbRow = this.dbRowList[ii];
        // auto-set id
        if (!dbRow.$isRemoved) {
            idIndex.dict[local.dbRowSetId(dbRow, idIndex)] = dbRow;
        }
        ii += 1;
    }
    this.save();
    return local.setTimeoutOnError(onError);
};

local._DbTable.prototype.idIndexRemove = function (opt, onError) {
/*
 * this function will remove the idIndex with given <opt>.name
 */
    let name;
    opt = local.objectSetOverride(opt);
    name = String(opt.name);
    this.idIndexList = this.idIndexList.filter(function (idIndex) {
        return idIndex.name !== name || idIndex.name === "_id";
    });
    this.save();
    return local.setTimeoutOnError(onError);
};

local._DbTable.prototype.save = function (onError) {
/*
 * this function will save the dbTable to storage
 */
    let that;
    that = this;
    if (local.modeImport) {
        return;
    }
    if (onError) {
        that.onSaveList.push(onError);
    }
    // throttle storage-writes to once every 1000 ms
    that.timerSave = that.timerSave || setTimeout(function () {
        that.timerSave = null;
        local.storageSetItem(
            "dbTable." + that.name + ".json",
            that.export(),
            function (err) {
                while (that.onSaveList.length) {
                    that.onSaveList.shift()(err);
                }
            }
        );
    }, 1000);
};

local.dbCrudRemoveAll = function (onError) {
/*
 * this function will remove all dbRow's from the db
 */
    let onParallel;
    onParallel = local.onParallel(function (err) {
        local.setTimeoutOnError(onError, 0, err);
    });
    onParallel.counter += 1;
    Object.keys(local.dbTableDict).forEach(function (key) {
        onParallel.counter += 1;
        local.dbTableDict[key].crudRemoveAll(onParallel);
    });
    onParallel();
};

local.dbDrop = function (onError) {
/*
 * this function will drop the db
 */
    let onParallel;
    console.error("db - dropping database ...");
    onParallel = local.onParallel(function (err) {
        local.setTimeoutOnError(onError, 0, err);
    });
    onParallel.counter += 1;
    onParallel.counter += 1;
    local.storageClear(onParallel);
    Object.keys(local.dbTableDict).forEach(function (key) {
        onParallel.counter += 1;
        local.dbTableDict[key].drop(onParallel);
    });
    onParallel();
};

local.dbExport = function (onError) {
/*
 * this function will export the db as serialized text
 */
    let result;
    result = "";
    Object.keys(local.dbTableDict).forEach(function (key) {
        console.error(
            "db - exporting dbTable " + local.dbTableDict[key].name + " ..."
        );
        result += local.dbTableDict[key].export();
        result += "\n\n";
    });
    return local.setTimeoutOnError(onError, 0, null, result.trim());
};

local.dbImport = function (text, onError) {
/*
 * this function will import the serialized text into the db
 */
    let dbTable;
    let dbTableDict;
    dbTableDict = {};
    local.modeImport = true;
    setTimeout(function () {
        local.modeImport = null;
    });
    text.replace((
        /^(\w\S*?)\u0020(\S+?)\u0020(\S.*?)$/gm
    ), function (match0, match1, match2, match3) {
        switch (match2) {
        case "dbRowSet":
            dbTableDict[match1] = true;
            dbTable = local.dbTableCreateOne({
                isLoaded: true,
                name: match1
            });
            dbTable.crudSetOneById(JSON.parse(match3));
            break;
        case "idIndexCreate":
            dbTableDict[match1] = true;
            dbTable = local.dbTableCreateOne({
                isLoaded: true,
                name: match1
            });
            dbTable.idIndexCreate(JSON.parse(match3));
            break;
        case "sizeLimit":
            dbTableDict[match1] = true;
            dbTable = local.dbTableCreateOne({
                isLoaded: true,
                name: match1
            });
            dbTable.sizeLimit = JSON.parse(match3);
            break;
        case "sortDefault":
            dbTableDict[match1] = true;
            dbTable = local.dbTableCreateOne({
                isLoaded: true,
                name: match1
            });
            dbTable.sortDefault = JSON.parse(match3);
            break;
        default:
            local.onErrorDefault(new Error(
                "db - dbImport - invalid operation - " + match0
            ));
        }
    });
    Object.keys(dbTableDict).forEach(function (name) {
        console.error("db - importing dbTable " + name + " ...");
    });
    local.modeImport = null;
    return local.setTimeoutOnError(onError);
};

local.dbLoad = function (onError) {
/*
 * this function will load the db from storage
 */
    let onParallel;
    onParallel = local.onParallel(function (err) {
        local.setTimeoutOnError(onError, 0, err);
    });
    local.storageKeys(function (err, data) {
        onParallel.counter += 1;
        // handle err
        onParallel.counter += 1;
        onParallel(err);
        local.valueOrEmptyList(data).forEach(function (key) {
            if (key.indexOf("dbTable.") !== 0) {
                return;
            }
            onParallel.counter += 1;
            local.storageGetItem(key, function (err, data) {
                onParallel.counter += 1;
                onParallel(err);
                local.dbImport(data, onParallel);
            });
        });
        onParallel();
    });
};

local.dbReset = function (dbSeedList, onError) {
/*
 * this function will drop and seed the db with given dbSeedList
 */
    let onParallel;
    onParallel = globalThis.utility2_onReadyBefore || local.onParallel(onError);
    onParallel.counter += 1;
    // drop db
    onParallel.counter += 1;
    local.dbDrop(function (err) {
        local.onErrorDefault(err);
        // seed db
        local.dbSeed(
            dbSeedList,
            !globalThis.utility2_onReadyBefore && onParallel
        );
        local.functionOrNop(globalThis.utility2_onReadyBefore)();
    });
    local.functionOrNop(globalThis.utility2_onReadyAfter)(onError);
    onParallel();
};

local.dbRowGetItem = function (dbRow, key) {
/*
 * this function will get the item with given key from dbRow
 */
    let ii;
    let value;
    value = dbRow;
    key = String(key).split(".");
    // optimization - while-loop
    ii = 0;
    while (ii < key.length && typeof value === "object" && value) {
        value = value[key[ii]];
        ii += 1;
    }
    return (
        value === undefined
        ? null
        : value
    );
};

local.dbRowListGetManyByOperator = function (
    dbRowList,
    fieldName,
    operator,
    bb,
    not
) {
/*
 * this function will get the dbRow's in dbRowList with given operator
 */
    let fieldValue;
    let ii;
    let jj;
    let result;
    let test;
    let typeof2;
    result = [];
    typeof2 = typeof bb;
    if (bb && typeof2 === "object") {
        switch (operator) {
        case "$in":
        case "$nin":
        case "$regex":
            break;
        default:
            return result;
        }
    }
    switch (operator) {
    case "$eq":
        test = function (aa, bb) {
            return aa === bb;
        };
        break;
    case "$exists":
        bb = !bb;
        test = function (aa, bb) {
            return !((aa === null) ^ bb); // jslint ignore:line
        };
        break;
    case "$gt":
        test = function (aa, bb, typeof1, typeof2) {
            return typeof1 === typeof2 && aa > bb;
        };
        break;
    case "$gte":
        test = function (aa, bb, typeof1, typeof2) {
            return typeof1 === typeof2 && aa >= bb;
        };
        break;
    case "$in":
        if (bb && typeof bb.indexOf === "function") {
            if (typeof2 === "string") {
                test = function (aa, bb, typeof1, typeof2) {
                    return typeof1 === typeof2 && bb.indexOf(aa) >= 0;
                };
            } else {
                test = function (aa, bb) {
                    return bb.indexOf(aa) >= 0;
                };
            }
        }
        break;
    case "$lt":
        test = function (aa, bb, typeof1, typeof2) {
            return typeof1 === typeof2 && aa < bb;
        };
        break;
    case "$lte":
        test = function (aa, bb, typeof1, typeof2) {
            return typeof1 === typeof2 && aa <= bb;
        };
        break;
    case "$ne":
        test = function (aa, bb) {
            return aa !== bb;
        };
        break;
    case "$nin":
        if (bb && typeof bb.indexOf === "function") {
            if (typeof2 === "string") {
                test = function (aa, bb, typeof1, typeof2) {
                    return typeof1 === typeof2 && bb.indexOf(aa) < 0;
                };
            } else {
                test = function (aa, bb) {
                    return bb.indexOf(aa) < 0;
                };
            }
        }
        break;
    case "$regex":
        if (bb && typeof bb.test === "function") {
            test = function (aa, bb) {
                return bb.test(aa);
            };
        }
        break;
    case "$typeof":
        test = function (ignore, bb, typeof1) {
            return typeof1 === bb;
        };
        break;
    }
    if (!test) {
        return result;
    }
    // optimization - while-loop
    ii = dbRowList.length;
    while (ii >= 1) {
        ii -= 1;
        fieldValue = local.dbRowGetItem(dbRowList[ii], fieldName);
        // normalize to list
        if (!Array.isArray(fieldValue)) {
            fieldValue = [
                fieldValue
            ];
        }
        // optimization - while-loop
        jj = fieldValue.length;
        while (jj >= 1) {
            jj -= 1;
            if (Boolean(
                not ^ test(fieldValue[jj], bb, typeof fieldValue[jj], typeof2)
            )) {
                result.push(dbRowList[ii]);
                break;
            }
        }
    }
    return result;
};

local.dbRowListGetManyByQuery = function (dbRowList, query, fieldName, not) {
/*
 * this function will get the dbRow's in dbRowList with given query
 */
    let bb;
    let dbRowDict;
    let result;
    // optimization - convert to boolean
    not = Boolean(not);
    result = dbRowList;
    if (!(typeof query === "object" && query)) {
        result = local.dbRowListGetManyByOperator(
            result,
            fieldName,
            "$eq",
            query,
            not
        );
        return result;
    }
    Object.keys(query).some(function (key) {
        bb = query[key];
        switch (key) {
        case "$not":
            key = fieldName;
            not = !not;
            break;
        case "$or":
            if (!Array.isArray(bb)) {
                break;
            }
            dbRowDict = {};
            bb.forEach(function (query) {
                // recurse
                local.dbRowListGetManyByQuery(result, query).forEach(function (
                    dbRow
                ) {
                    dbRowDict[dbRow._id] = dbRow;
                });
            });
            result = Object.keys(dbRowDict).map(function (id) {
                return dbRowDict[id];
            });
            return !result.length;
        }
        if (key[0] === "$") {
            result = local.dbRowListGetManyByOperator(
                result,
                fieldName,
                key,
                bb,
                not
            );
            return !result.length;
        }
        // recurse
        result = local.dbRowListGetManyByQuery(result, bb, key, not);
        return !result.length;
    });
    return result;
};

local.dbRowProject = function (dbRow, fieldList) {
/*
 * this function will deepcopy and project the dbRow with given fieldList
 */
    let result;
    if (!dbRow) {
        return null;
    }
    // handle list-case
    if (Array.isArray(dbRow)) {
        return dbRow.map(function (dbRow) {
            // recurse
            return local.dbRowProject(dbRow, fieldList);
        });
    }
    // normalize to list
    if (!(Array.isArray(fieldList) && fieldList.length)) {
        fieldList = Object.keys(dbRow);
    }
    result = {};
    fieldList.forEach(function (key) {
        if (key[0] !== "$") {
            result[key] = dbRow[key];
        }
    });
    return JSON.parse(local.jsonStringifyOrdered(result));
};

local.dbRowSetId = function (dbRow, idIndex) {
/*
 * this function will if does not exist,
 * then set a random and unique id into dbRow for given idIndex,
 */
    let id;
    id = dbRow[idIndex.name];
    if (typeof id !== "number" && typeof id !== "string") {
        do {
            id = (
                idIndex.isInteger
                ? (1 + Math.random()) * 0x10000000000000
                : "a" + Number(
                    (1 + Math.random()) * 0x10000000000000
                ).toString(36).slice(1)
            );
        // optimization - hasOwnProperty
        } while (idIndex.dict.hasOwnProperty(id));
        dbRow[idIndex.name] = id;
    }
    return id;
};

local.dbSave = function (onError) {
/*
 * this function will save the db to storage
 */
    let onParallel;
    onParallel = local.onParallel(function (err) {
        local.setTimeoutOnError(onError, 0, err);
    });
    onParallel.counter += 1;
    Object.keys(local.dbTableDict).forEach(function (key) {
        onParallel.counter += 1;
        local.dbTableDict[key].save(onParallel);
    });
    onParallel();
};

local.dbSeed = function (dbSeedList, onError) {
/*
 * this function will seed the db with given dbSeedList
 */
    let dbTableDict;
    let onParallel;
    dbTableDict = {};
    onParallel = globalThis.utility2_onReadyBefore || local.onParallel(onError);
    onParallel.counter += 1;
    // seed db
    onParallel.counter += 1;
    local.dbTableCreateMany(dbSeedList, onParallel);
    local.valueOrEmptyList(dbSeedList).forEach(function (opt) {
        dbTableDict[opt.name] = true;
    });
    Object.keys(dbTableDict).forEach(function (name) {
        console.error("db - seeding dbTable " + name + " ...");
    });
    local.functionOrNop(globalThis.utility2_onReadyAfter)(onError);
    onParallel();
};

local.dbTableCreateMany = function (optionList, onError) {
/*
 * this function will create many dbTables with given optionList
 */
    let onParallel;
    let result;
    onParallel = local.onParallel(function (err) {
        local.setTimeoutOnError(onError, 0, err, result);
    });
    onParallel.counter += 1;
    result = local.valueOrEmptyList(optionList).map(function (opt) {
        onParallel.counter += 1;
        return local.dbTableCreateOne(opt, onParallel);
    });
    return local.setTimeoutOnError(onParallel, 0, null, result);
};

local.dbTableCreateOne = function (opt, onError) {
/*
 * this function will create a dbTable with given <opt>
 */
    let DbTable;
    let that;
    opt = local.objectSetOverride(opt);
    // register dbTable
    DbTable = local._DbTable;
    local.dbTableDict[opt.name] = local.dbTableDict[opt.name] || new DbTable(
        opt
    );
    that = local.dbTableDict[opt.name];
    that.sortDefault = (
        opt.sortDefault
        || that.sortDefault
        || [
            {
                fieldName: "_timeUpdated",
                isDescending: true
            }
        ]
    );
    // remove idIndex
    local.valueOrEmptyList(opt.idIndexRemoveList).forEach(function (idIndex) {
        that.idIndexRemove(idIndex);
    });
    // create idIndex
    local.valueOrEmptyList(opt.idIndexCreateList).forEach(function (idIndex) {
        that.idIndexCreate(idIndex);
    });
    // upsert dbRow
    that.crudSetManyById(opt.dbRowList);
    // restore dbTable from persistent-storage
    that.isLoaded = that.isLoaded || opt.isLoaded;
    if (!that.isLoaded) {
        local.storageGetItem("dbTable." + that.name + ".json", function (
            err,
            data
        ) {
            // handle err
            local.assertOrThrow(!err, err);
            if (!that.isLoaded) {
                local.dbImport(data);
            }
            that.isLoaded = true;
            local.setTimeoutOnError(onError, 0, null, that);
        });
        return that;
    }
    return local.setTimeoutOnError(onError, 0, null, that);
};

local.dbTableDict = {};

local.onEventDomDb = function (evt) {
/*
 * this function will handle db dom-events
 */
    let ajaxProgressUpdate;
    let reader;
    let tmp;
    let utility2;
    utility2 = globalThis.utility2 || {};
    ajaxProgressUpdate = utility2.ajaxProgressUpdate || local.nop;
    switch (evt.target.dataset.oneventDb) {
    case "dbExport":
        tmp = URL.createObjectURL(new globalThis.Blob([
            local.dbExport()
        ]));
        document.querySelector(
            "#dbExportA1"
        ).href = tmp;
        document.querySelector(
            "#dbExportA1"
        ).click();
        setTimeout(function () {
            URL.revokeObjectURL(tmp);
        }, 30000);
        break;
    case "dbImport":
        document.querySelector(
            "[data-onevent-db='dbImportInput']"
        ).click();
        break;
    case "dbImportInput":
        if (evt.type !== "change") {
            return;
        }
        ajaxProgressUpdate();
        reader = new FileReader();
        reader.addEventListener("load", function () {
            local.dbImport(reader.result);
            ajaxProgressUpdate();
        });
        reader.readAsText(evt.target.files[0]);
        break;
    case "dbReset":
        ajaxProgressUpdate();
        local.dbReset(globalThis.utility2_dbSeedList, function (err) {
            local.onErrorDefault(err);
            if (
                utility2.uiEventListenerDict
                && typeof utility2.uiEventListenerDict[".onEventUiReload"]
                === "function"
            ) {
                utility2.uiEventListenerDict[".onEventUiReload"]();
            }
        });
        break;
    }
};

local.sortCompare = function (aa, bb, ii, jj) {
/*
 * this function will compare aa vs bb and return:
 * -1 if aa < bb
 *  0 if aa === bb
 *  1 if aa > bb
 * the priority for comparing different typeof's is:
 * null < boolean < number < string < object < undefined
 */
    let typeof1;
    let typeof2;
    if (aa === bb) {
        return (
            ii < jj
            ? -1
            : 1
        );
    }
    if (aa === null) {
        return -1;
    }
    if (bb === null) {
        return 1;
    }
    typeof1 = typeof aa;
    typeof2 = typeof bb;
    if (typeof1 === typeof2) {
        return (
            typeof1 === "object"
            ? 0
            : aa > bb
            ? 1
            : -1
        );
    }
    if (typeof1 === "boolean") {
        return -1;
    }
    if (typeof2 === "boolean") {
        return 1;
    }
    if (typeof1 === "number") {
        return -1;
    }
    if (typeof2 === "number") {
        return 1;
    }
    if (typeof1 === "string") {
        return -1;
    }
    if (typeof2 === "string") {
        return 1;
    }
    return 0;
};
}());



// run node js-env code - init-after
/* istanbul ignore next */
(function () {
if (local.isBrowser) {
    return;
}



local.cliDict = {};

local.cliDict.dbTableCrudGetManyByQuery = function () {
/*
 * <dbTable> <query>
 * will get from <dbTable> with json <query>, <dbRowList>
 */
    local.dbTableCreateOne({
        name: process.argv[3]
    }, function (err, that) {
        // handle err
        local.assertOrThrow(!err, err);
        console.log(JSON.stringify(that.crudGetManyByQuery(
            JSON.parse(process.argv[4] || "{}")
        ), null, 4));
    });
};

local.cliDict.dbTableCrudRemoveManyByQuery = function () {
/*
 * <dbTable> <query>
 * will remove from <dbTable> with json <query>, <dbRowList>
 */
    local.dbTableCreateOne({
        name: process.argv[3]
    }, function (err, that) {
        // handle err
        local.assertOrThrow(!err, err);
        console.log(JSON.stringify(that.crudRemoveManyByQuery(
            JSON.parse(process.argv[4])
        ), null, 4));
    });
};

local.cliDict.dbTableCrudSetManyById = function () {
/*
 * <dbTable> <dbRowList>
 * will set in <dbTable>, <dbRowList>
 */
    local.dbTableCreateOne({
        name: process.argv[3]
    }, function (err, that) {
        // handle err
        local.assertOrThrow(!err, err);
        that.crudSetManyById(JSON.parse(process.argv[4]));
    });
};

local.cliDict.dbTableHeaderDictGet = function () {
/*
 * <dbTable>
 * will get from <dbTable>, <headerDict>
 */
    local.dbTableCreateOne({
        name: process.argv[3]
    }, function (err, that) {
        // handle err
        local.assertOrThrow(!err, err);
        let tmp;
        tmp = [];
        that.idIndexList.forEach(function (idIndex) {
            tmp.push({
                isInteger: idIndex.isInteger,
                name: idIndex.name
            });
        });
        console.log(JSON.stringify({
            idIndexList: tmp,
            sizeLimit: that.sizeLimit,
            sortDefault: that.sortDefault
        }, null, 4));
    });
};

local.cliDict.dbTableHeaderDictSet = function () {
/*
 * <dbTable> <headerDict>
 * will set in <dbTable>, <headerDict>
 */
    local.dbTableCreateOne({
        name: process.argv[3]
    }, function (err, that) {
        // handle err
        local.assertOrThrow(!err, err);
        local.tmp = JSON.parse(process.argv[4]);
        that.sizeLimit = local.tmp.sizeLimit || that.sizeLimit;
        that.sortDefault = local.tmp.sortDefault || that.sortDefault;
        that.save();
        local.tmp = [];
        that.idIndexList.forEach(function (idIndex) {
            local.tmp.push({
                isInteger: idIndex.isInteger,
                name: idIndex.name
            });
        });
        local.cliDict.dbTableHeaderDictGet();
    });
};

local.cliDict.dbTableIdIndexCreate = function () {
/*
 * <dbTable> <idIndex>
 * will create in <dbTable>, <idIndex>
 */
    local.dbTableCreateOne({
        name: process.argv[3]
    }, function (err, that) {
        // handle err
        local.assertOrThrow(!err, err);
        that.idIndexCreate(JSON.parse(process.argv[4]));
        that.save();
        local.tmp = [];
        that.idIndexList.forEach(function (idIndex) {
            local.tmp.push({
                isInteger: idIndex.isInteger,
                name: idIndex.name
            });
        });
        local.cliDict.dbTableHeaderDictGet();
    });
};

local.cliDict.dbTableIdIndexRemove = function () {
/*
 * <dbTable> <idIndex>
 * will remove from <dbTable>, <idIndex>
 */
    local.dbTableCreateOne({
        name: process.argv[3]
    }, function (err, that) {
        // handle err
        local.assertOrThrow(!err, err);
        that.idIndexRemove(JSON.parse(process.argv[4]));
        that.save();
        local.cliDict.dbTableHeaderDictGet();
    });
};

local.cliDict.dbTableList = function () {
/*
 *
 * will get from db, <dbTableList>
 */
    local.storageKeys(function (err, data) {
        // handle err
        local.assertOrThrow(!err, err);
        console.log(JSON.stringify(data.map(function (element) {
            return element.split(".").slice(1, -1).join(".");
        }), null, 4));
    });
};

local.cliDict.dbTableRemove = function () {
/*
 * <dbTable>
 * will remove from db, <dbTable>
 */
    local.storageRemoveItem("dbTable." + process.argv[3] + ".json", function (
        err
    ) {
        // handle err
        local.assertOrThrow(!err, err);
        local.cliDict.dbTableList();
    });
};

// run the cli
if (module === require.main && !globalThis.utility2_rollup) {
    local.cliRun();
}
}());
}());
