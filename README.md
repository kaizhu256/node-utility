utility2
========
run dynamic browser tests with coverage (via istanbul-lite and phantomjs-lite)

[![NPM](https://img.shields.io/npm/v/utility2.svg?style=flat-square)](https://www.npmjs.com/package/utility2) [![Join the chat at https://gitter.im/kaizhu256/node-utility2](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/kaizhu256/node-utility2?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)



# live test-server
[![heroku.com test-server](https://kaizhu256.github.io/node-utility2/build/screen-capture.herokuTest.slimerjs..png)](https://hrku01-utility2-beta.herokuapp.com)



# build-status [![travis-ci.org build-status](https://api.travis-ci.org/kaizhu256/node-utility2.svg)](https://travis-ci.org/kaizhu256/node-utility2) ![codeship.io build-status](https://codeship.com/projects/df8f44c0-2ee3-0132-0af5-6a016ae0b812/status)

[![build commit status](https://kaizhu256.github.io/node-utility2/build/build.badge.svg)](https://travis-ci.org/kaizhu256/node-utility2)

| git-branch : | [master](https://github.com/kaizhu256/node-utility2/tree/master) | [beta](https://github.com/kaizhu256/node-utility2/tree/beta) | [alpha](https://github.com/kaizhu256/node-utility2/tree/alpha)|
|--:|:--|:--|:--|
| test-server : | [![heroku.com test-server](https://kaizhu256.github.io/node-utility2/heroku-logo.75x25.png)](https://hrku01-utility2-master.herokuapp.com) | [![heroku.com test-server](https://kaizhu256.github.io/node-utility2/heroku-logo.75x25.png)](https://hrku01-utility2-beta.herokuapp.com) | [![heroku.com test-server](https://kaizhu256.github.io/node-utility2/heroku-logo.75x25.png)](https://hrku01-utility2-alpha.herokuapp.com)|
| test-report : | [![test-report](https://kaizhu256.github.io/node-utility2/build..master..travis-ci.org/test-report.badge.svg)](https://kaizhu256.github.io/node-utility2/build..master..travis-ci.org/test-report.html) | [![test-report](https://kaizhu256.github.io/node-utility2/build..beta..travis-ci.org/test-report.badge.svg)](https://kaizhu256.github.io/node-utility2/build..beta..travis-ci.org/test-report.html) | [![test-report](https://kaizhu256.github.io/node-utility2/build..alpha..travis-ci.org/test-report.badge.svg)](https://kaizhu256.github.io/node-utility2/build..alpha..travis-ci.org/test-report.html)|
| coverage : | [![istanbul-lite coverage](https://kaizhu256.github.io/node-utility2/build..master..travis-ci.org/coverage.badge.svg)](https://kaizhu256.github.io/node-utility2/build..master..travis-ci.org/coverage.html/index.html) | [![istanbul-lite coverage](https://kaizhu256.github.io/node-utility2/build..beta..travis-ci.org/coverage.badge.svg)](https://kaizhu256.github.io/node-utility2/build..beta..travis-ci.org/coverage.html/index.html) | [![istanbul-lite coverage](https://kaizhu256.github.io/node-utility2/build..alpha..travis-ci.org/coverage.badge.svg)](https://kaizhu256.github.io/node-utility2/build..alpha..travis-ci.org/coverage.html/index.html)|
| build-artifacts : | [![build-artifacts](https://kaizhu256.github.io/node-utility2/glyphicons_144_folder_open.png)](https://github.com/kaizhu256/node-utility2/tree/gh-pages/build..master..travis-ci.org) | [![build-artifacts](https://kaizhu256.github.io/node-utility2/glyphicons_144_folder_open.png)](https://github.com/kaizhu256/node-utility2/tree/gh-pages/build..beta..travis-ci.org) | [![build-artifacts](https://kaizhu256.github.io/node-utility2/glyphicons_144_folder_open.png)](https://github.com/kaizhu256/node-utility2/tree/gh-pages/build..alpha..travis-ci.org)|

#### master branch
- stable branch
- HEAD should be tagged, npm-published package

#### beta branch
- stable branch
- HEAD should be latest, npm-published package

#### alpha branch
- unstable branch
- HEAD is arbitrary
- commit history may be rewritten



# quickstart interactive example

#### to run this example, follow the instruction in the script below
- example.sh

```shell
# example.sh

# this shell script will
    # npm install utility2
    # serve a webpage that will interactively run browser tests with coverage

# instruction
    # 1. copy and paste this entire shell script into a console and press enter
    # 2. open a browser to http://localhost:1337
    # 3. edit or paste script in browser to cover and test

shExampleSh() {
    # npm install utility2
    npm install utility2 || return $?

    # serve a webpage that will interactively run browser tests with coverage
    cd node_modules/utility2 && npm start --server-port=1337 || return $?
}
shExampleSh
```

#### output from shell
[![screen-capture](https://kaizhu256.github.io/node-utility2/build/screen-capture.testExampleSh.png)](https://travis-ci.org/kaizhu256/node-utility2)

#### output from phantomjs-lite
[![screen-capture](https://kaizhu256.github.io/node-utility2/build/screen-capture.testExampleSh.slimerjs..png)](https://hrku01-utility2-beta.herokuapp.com)



# quickstart node example

#### to run this example, follow the instruction in the script below
- example.js

```javascript
/*
example.js

this shared browser / node script will
run browser tests with coverage (via istanbul-lite and phantomjs-lite)

instruction
    1. save this js script as example.js
    2. run the shell command:
        $ npm install phantomjs-lite utility2 && \
            PATH=$(pwd)/node_modules/phantomjs-lite:$PATH && \
            node_modules/.bin/utility2 test example.js
    3. view test-report in ./tmp/build/test-report.html
    4. view coverage in ./tmp/build/coverage.html/index.html
*/

/*jslint
    browser: true,
    maxerr: 8,
    maxlen: 80,
    node: true,
    nomen: true,
    stupid: true
*/

(function () {
    'use strict';
    var local;



    // run shared js-env code
    (function () {
        // init local
        local = {};
        // init utility2
        local.utility2 = typeof window === 'object'
            ? window.utility2
            : require('utility2');
    }());



    // run browser js-env code
    if (typeof window === 'object') {
        // init tests
        local.testCase_ajax_200 = function (options, onError) {
            /*
             * this function will test ajax's "200 ok" handling behavior
             */
            var data;
            // jslint-hack
            local.utility2.nop(options);
            // test '/test/hello'
            local.utility2.ajax({
                url: '/test/hello'
            }, function (error, xhr) {
                local.utility2.testTryCatch(function () {
                    // validate no error occurred
                    local.utility2.assert(!error, error);
                    // validate data
                    data = xhr.responseText;
                    local.utility2.assert(data === 'hello', data);
                    onError();
                }, onError);
            });
        };
        local.testCase_ajax_404 = function (options, onError) {
            /*
             * this function will test ajax's "404 not found" handling behavior
             */
            // jslint-hack
            local.utility2.nop(options);
            // test '/test/undefined'
            local.utility2.ajax({ url: '/test/undefined' }, function (error) {
                local.utility2.testTryCatch(function () {
                    // validate error occurred
                    local.utility2.assert(error, error);
                    // validate 404 http statusCode
                    local.utility2.assert(
                        error.statusCode === 404,
                        error.statusCode
                    );
                    onError();
                }, onError);
            });
        };
        // run test
        local.utility2.testRun(local);



    // run node js-env code
    } else {
        // init node tests
        local.testCase_phantomTest_default = function (options, onError) {
            /*
             * this function will spawn phantomjs to test the test-page
             */
            // jslint-hack
            local.utility2.nop(options);
            local.utility2.phantomTest({
                url: 'http://localhost:' +
                    process.env.npm_config_server_port +
                    '?modeTest=phantom'
            }, onError);
        };
        // mock package.json env
        process.env.npm_package_description = 'this is an example module';
        process.env.npm_package_name = 'example-module';
        process.env.npm_package_version = '0.0.1';
        // require modules
        local.fs = require('fs');
        // init assets
        local['/'] = (String() +



/* jslint-ignore-begin */
'<!DOCTYPE html>\n' +
'<html>\n' +
'<head>\n' +
'    <meta charset="UTF-8">\n' +
'    <title>\n' +
'    {{envDict.npm_package_name}} [{{envDict.npm_package_version}}]\n' +
'    </title>\n' +
'    <link rel="stylesheet" href="/assets/utility2.css">\n' +
'    <style>\n' +
'    * {\n' +
'        box-sizing: border-box;\n' +
'    }\n' +
'    body {\n' +
'        background-color: #fff;\n' +
'        font-family: Helvetical Neue, Helvetica, Arial, sans-serif;\n' +
'    }\n' +
'    body > div {\n' +
'        margin-top: 20px;\n' +
'    }\n' +
'    textarea {\n' +
'        font-family: monospace;\n' +
'        height: 32em;\n' +
'        width: 100%;\n' +
'    }\n' +
'    .jslintOutputPre {\n' +
'        color: #f00;\n' +
'    }\n' +
'    .testReportDiv {\n' +
'        display: none;\n' +
'    }\n' +
'    </style>\n' +
'    {{envDict.npm_config_html_head_extra}}\n' +
'</head>\n' +
'<body>\n' +
'    <div class="ajaxProgressDiv" style="display: none;">\n' +
'    <div class="ajaxProgressBarDiv ajaxProgressBarDivLoading" \
>loading</div>\n' +
'    </div>\n' +
'    <h1 \
>{{envDict.npm_package_name}} [{{envDict.npm_package_version}}]</h1>\n' +
'    <h3>{{envDict.npm_package_description}}</h3>\n' +
'    <div>edit or paste script below to cover and test</div>\n' +
'<textarea class="istanbulInputTextarea jslintInputTextarea">\n' +
'/*jslint browser: true*/\n' +
'(function () {\n' +
'    "use strict";\n' +
'    var testCaseDict;\n' +
'    testCaseDict = {};\n' +
'    testCaseDict.modeTest = true;\n' +
'\n' +
'    // comment this testCase to disable the failed assertion demo\n' +
'    testCaseDict.testCase_failed_assertion_demo = function (options, onError) {\n' +
'        /*\n' +
'         * this function will demo a failed assertion test\n' +
'         */\n' +
'        // jslint-hack\n' +
'        local.utility2.nop(options);\n' +
'        window.utility2.assert(false, "this is a failed assertion demo");\n' +
'        onError();\n' +
'    };\n' +
'\n' +
'    testCaseDict.testCase_passed_ajax_demo = function (options, onError) {\n' +
'        /*\n' +
'         * this function will demo a passed ajax test\n' +
'         */\n' +
'        var data;\n' +
'        // jslint-hack\n' +
'        local.utility2.nop(options);\n' +
'        // test ajax request for main-page "/"\n' +
'        window.utility2.ajax({\n' +
'            url: "/"\n' +
'        }, function (error, xhr) {\n' +
'            try {\n' +
'                // validate no error occurred\n' +
'                window.utility2.assert(!error, error);\n' +
'                // validate non-empty data\n' +
'                data = xhr.responseText;\n' +
'                window.utility2.assert(data && data.length > 0, data);\n' +
'                // validate "200 ok" status\n' +
'                if (xhr.status === 200) {\n' +
'                    window.utility2.assert(data, data);\n' +
'                }\n' +
'                onError();\n' +
'            } catch (errorCaught) {\n' +
'                onError(errorCaught);\n' +
'            }\n' +
'        });\n' +
'    };\n' +
'\n' +
'    window.utility2.testRun(testCaseDict);\n' +
'}());\n' +
'</textarea>\n' +
'    <pre class="jslintOutputPre"></pre>\n' +
'    <div class="testReportDiv"></div>\n' +
'    <div class="istanbulCoverageDiv"></div>\n' +
'    <script src="/assets/istanbul-lite.js"></script>\n' +
'    <script src="/assets/jslint-lite.js"></script>\n' +
'    <script src="/assets/utility2.js"></script>\n' +
'    <script>\n' +
'    window.utility2 = window.utility2 || {};\n' +
'    window.utility2.envDict = {\n' +
'        npm_package_description: "{{envDict.npm_package_description}}",\n' +
'        npm_package_name: "{{envDict.npm_package_name}}",\n' +
'        npm_package_version: "{{envDict.npm_package_version}}"\n' +
'    };\n' +
'    document.querySelector(\n' +
'        ".istanbulInputTextarea"\n' +
'    ).addEventListener("keyup", function () {\n' +
'        window.jslint_lite.jslintTextarea();\n' +
'        window.istanbul_lite.coverTextarea();\n' +
'    });\n' +
'    if (!window.utility2.modeTest) {\n' +
'        window.jslint_lite.jslintTextarea();\n' +
'        window.istanbul_lite.coverTextarea();\n' +
'    }\n' +
'    </script>\n' +
'    <script src="/test/test.js"></script>\n' +
'    {{envDict.npm_config_html_body_extra}}\n' +
'</body>\n' +
'</html>\n' +
/* jslint-ignore-end */



        String()).replace((/\{\{envDict\.\w+?\}\}/g), function (match0) {
            switch (match0) {
            case '{{envDict.npm_package_description}}':
                return process.env.npm_package_description;
            case '{{envDict.npm_package_name}}':
                return process.env.npm_package_name;
            case '{{envDict.npm_package_version}}':
                return process.env.npm_package_version;
            default:
                return '';
            }
        });
        local['/assets/istanbul-lite.js'] =
            local.utility2.istanbul_lite['/assets/istanbul-lite.js'];
        local['/assets/jslint-lite.js'] =
            local.utility2.jslint_lite['/assets/jslint-lite.js'];
        local['/assets/utility2.css'] =
            local.utility2.cacheDict.assets['/assets/utility2.css'];
        local['/assets/utility2.js'] =
            local.utility2.cacheDict.assets['/assets/utility2.js'];
        local['/test/hello'] = 'hello';
        local['/test/test.js'] = local.utility2.istanbul_lite.instrumentSync(
            local.fs.readFileSync(__filename, 'utf8'),
            __filename
        );
        // init middleware
        local.middleware = local.utility2.middlewareGroupCreate([
            local.utility2.middlewareInit,
            function (request, response, nextMiddleware) {
                /*
                 * this will run the test-middleware
                 */
                switch (request.urlParsed.pathnameNormalized) {
                // serve assets
                case '/':
                case '/assets/istanbul-lite.js':
                case '/assets/jslint-lite.js':
                case '/assets/utility2.css':
                case '/assets/utility2.js':
                case '/test/hello':
                case '/test/test.js':
                    response.end(local[request.urlParsed.pathnameNormalized]);
                    break;
                // default to nextMiddleware
                default:
                    nextMiddleware();
                }
            }
        ]);
        // init middleware error-handler
        local.onMiddlewareError = local.utility2.onMiddlewareError;
        // run server-test
        local.utility2.testRunServer(local);
    }
    return;
}());
```

#### output from shell
[![screen-capture](https://kaizhu256.github.io/node-utility2/build/screen-capture.testExampleJs.png)](https://travis-ci.org/kaizhu256/node-utility2)

#### output from utility2
[![screen-capture](https://kaizhu256.github.io/node-utility2/build/screen-capture.testExampleSh.slimerjs._2Ftmp_2Fapp_2Ftmp_2Fbuild_2Ftest-report.html.png)](https://kaizhu256.github.io/node-utility2/build..beta..travis-ci.org/test-report.html)

#### output from istanbul-lite
[![screen-capture](https://kaizhu256.github.io/node-utility2/build/screen-capture.testExampleJs.slimerjs._2Ftmp_2Fapp_2Ftmp_2Fbuild_2Fcoverage.html_2Fapp_2Fexample.js.html.png)](https://kaizhu256.github.io/node-utility2/build..beta..travis-ci.org/coverage.html/node-utility2/index.js.html)



# npm-dependencies
- [istanbul-lite](https://www.npmjs.com/package/istanbul-lite)
- [jslint-lite](https://www.npmjs.com/package/jslint-lite)



# package-listing
[![screen-capture](https://kaizhu256.github.io/node-utility2/build/screen-capture.gitLsTree.png)](https://github.com/kaizhu256/node-utility2)



# package.json
```json
{
    "author": "kai zhu <kaizhu256@gmail.com>",
    "bin": { "utility2" : "index.sh" },
    "dependencies": {
        "istanbul-lite": "^2015.6.1",
        "jslint-lite": "^2015.6.2"
    },
    "description": "run dynamic browser tests with coverage \
(via istanbul-lite and phantomjs-lite)",
    "devDependencies": {
        "phantomjs-lite": "^2015.6.1"
    },
    "engines": { "node": ">=0.10 <=0.12" },
    "keywords": [
        "browser", "build",
        "ci", "code", "continuous-integration", "cover", "coverage",
        "headless", "headless-browser",
        "instrument", "istanbul",
        "jscover", "jscoverage",
        "phantom", "phantomjs",
        "slimer", "slimerjs",
        "test", "travis", "travis-ci",
        "web"
    ],
    "license": "MIT",
    "name": "utility2",
    "os": ["darwin", "linux"],
    "repository" : {
        "type" : "git",
        "url" : "https://github.com/kaizhu256/node-utility2.git"
    },
    "scripts": {
        "build-ci": "./index.sh shRun shReadmeBuild",
        "start": "npm_config_mode_auto_restart=1 ./index.sh shRun node test.js",
        "test": "./index.sh shRun shReadmeExportPackageJson && \
export npm_config_file_start=index.js && \
npm_config_mode_auto_restart=1 \
npm_config_mode_auto_restart_child=1 \
./index.sh test test.js"
    },
    "version": "2015.7.2"
}
```



# todo
- create flamegraph from istanbul coverage
- auto-generate help doc from README.md
- add server stress test using phantomjs
- minify /assets/utility2.js in production-mode
- none



# change since 71924385
- npm publish 2015.7.2
- test-cases now all require options param
- add utility2.middlewareBodyGet
- none



# changelog of last 50 commits
[![screen-capture](https://kaizhu256.github.io/node-utility2/build/screen-capture.gitLog.png)](https://github.com/kaizhu256/node-utility2/commits)



# internal build-script
- build.sh

```shell
# build.sh

# this shell script will run the build for this package

shBuild() {
    # this function will run the main build
    local TEST_URL || return $?

    # init env
    export npm_config_mode_slimerjs=1 || return $?
    . ./index.sh && shInit || return $?

    # run npm-test on published package
    shNpmTestPublished || return $?

    # test example js script
    MODE_BUILD=testExampleJs \
    MODE_NO_LINENO=1 \
        shRunScreenCapture shReadmeTestJs example.js || return $?
    # screen-capture example.js coverage
    MODE_BUILD=testExampleJs shPhantomScreenCapture \
        /tmp/app/tmp/build/coverage.html/app/example.js.html || return $?
    # copy phantomjs screen-capture to $npm_config_dir_build
    cp /tmp/app/tmp/build/screen-capture.*.png $npm_config_dir_build || \
        return $?
    # screen-capture example.js test-report
    MODE_BUILD=testExampleSh shPhantomScreenCapture \
        /tmp/app/tmp/build/test-report.html || return $?

    # test example shell script
    export npm_config_timeout_exit=1000 || return $?
    MODE_BUILD=testExampleSh \
        shRunScreenCapture shReadmeTestSh example.sh || return $?
    unset npm_config_timeout_exit || return $?
    # save screen-capture
    cp /tmp/app/node_modules/$npm_package_name/tmp/build/screen-capture.*.png \
        $npm_config_dir_build || return $?

    # run npm-test
    MODE_BUILD=npmTest shRunScreenCapture npm test || return $?

    # if running legacy-node, then do not continue
    [ "$(node --version)" \< "v0.12" ] && return

    # deploy app to heroku
    shHerokuDeploy hrku01-$npm_package_name-$CI_BRANCH || return $?

    # test deployed app to heroku
    if [ "$CI_BRANCH" = alpha ] ||
        [ "$CI_BRANCH" = beta ] ||
        [ "$CI_BRANCH" = master ]
    then
        TEST_URL="https://hrku01-$npm_package_name-$CI_BRANCH.herokuapp.com" \
            || return $?
        TEST_URL="$TEST_URL?modeTest=phantom&timeExit={{timeExit}}" || return $?
        MODE_BUILD=herokuTest shPhantomTest "$TEST_URL" || return $?
    fi
}
shBuild

# save exit-code
EXIT_CODE=$?

shBuildCleanup() {
    # this function will cleanup build-artifacts in local build dir
    # create package-listing
    MODE_BUILD=gitLsTree shRunScreenCapture shGitLsTree || return $?
    # create recent changelog of last 50 commits
    MODE_BUILD=gitLog shRunScreenCapture git log -50 --pretty="%ai\u000a%B" || \
        return $?
}
shBuildCleanup || exit $?

shBuildGithubUploadCleanup() {
    # this function will cleanup build-artifacts in local gh-pages repo
    return
}

# if running legacy-node, then do not continue
[ "$(node --version)" \< "v0.12" ] && exit $EXIT_CODE

# upload build-artifacts to github,
# and if number of commits > 16, then squash older commits
COMMIT_LIMIT=16 shBuildGithubUpload || exit $?

# exit with $EXIT_CODE
exit $EXIT_CODE
```
