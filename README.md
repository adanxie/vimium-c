<span style="color: #2f508e;">Vim</span>ium <span style="color: #8e5e2f;">C</span>
========
[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.txt)
[![Version 1.74](https://img.shields.io/badge/release-1.74-orange.svg
  )](https://github.com/gdh1995/vimium-c/releases)
[![Current Build Status](https://travis-ci.org/gdh1995/vimium-c.svg?branch=master
  )](https://travis-ci.org/gdh1995/vimium-c)
**[Visit Vimium C on Chrome Web Store](
  https://chrome.google.com/webstore/detail/vimium-c/hfjbmagddngcpeloejdejnfgbamkjaeg
  )**

A <span style="color: #8e5e2f;">C</span>ustomized
  [<span style="color: #2f508e;">Vim</span>ium](https://github.com/philc/vimium)
  having <span style="color: #8e5e2f;">C</span>hinese support,
    global <span style="color: #8e5e2f;">C</span>ommands
    and injection functionality,
  in <span style="color: #8e5e2f;">C</span>-style code for better speed and less resource cost.
It supports Chrome and other Chromium-based browsers whose core versions are >= 35,
  and partly supports latest Firefox.

This project is developed by [gdh1995](https://github.com/gdh1995)
  and licensed under the [MIT license](LICENSE.txt).

![Usage Demo of Vimium C](https://gdh1995.github.io/vimium-c/demo.gif)

An old name of this project is "Vimium++", which has been given up on 2018-08-21.

This extension can also work on Firefox (since version 64.0).
It can also run on MS Edge, though there're still some errors.

# Project Introduction

__<span style="color: #2f508e;">Vim</span>ium <span style="color: #8e5e2f;">C</span>:__

* a Chrome extension that provides keyboard-based navigation and control
    of the web in the spirit of the Vim editor.
* forked from [philc/vimium:master](https://github.com/philc/vimium).
* customized after translating it from CoffeeScript into JavaScript.
* add some powerful functions and provide more convenience (for me, at least ^_^).
* here is its [license](LICENSE.txt) and [privacy policy](PRIVACY-POLICY.md)

__Other extensions supporting Vimium C:__

* [PDF Viewer for Vimium C](https://chrome.google.com/webstore/detail/pdf-viewer-for-vimium%20%20/nacjakoppgmdcpemlfnfegmlhipddanj)
  : a modified version of [PDF Viewer](https://chrome.google.com/webstore/detail/pdf-viewer/oemmndcbldboiebfnladdacbdfmadadm)
    from [PDF.js](https://github.com/mozilla/pdf.js/)

# Known Issues

Here're some issues still existing on the master branch, which are mostly caused by Chrome bugs:

1. If a page in another extension is the preferred Vomnibar page, and the extension is disabled in incognito mode,
  Vomnibar might break in such a situation, and there seems no way to detect it.
  So Vimium C has disabled other extension Vomnibar pages in incognito mode.
2. *Before ver 42*, Chrome has a flag `#enable-embedded-extension-options` causing wrong dialog width on high-DPI screens,
  which can not be worked-around.
3. *Before ver 49*, Chrome has bugs in `Window.postMessage` if the flag `#enable-site-per-process` is on,
  which breaks `Vomnibar`. Then `Vomnibar` would only work well on Vimium C Options pages.
4. If a http/file/... Vomnibar page is preferred, then there're some cases where it breaks,
  such as on some websites with very strict Content Security Policies (CSP),
  so users may need to wait about 1 second to let Vimium C retry the inner page.<br/>
  *Before ver 50*, such vomnibar webpages won't work because Chrome lacks some features,
  so Vimium C will use the inner page directly.
5. *Since ver 56*, Chrome does not apply content settings (at least images) on file:// URLs.
  Currently, no effective ways have been found (up to Chrome 69).
6. *Before ver 68*, Chrome has a bug on sandboxed pages without an `allow-scripts` permission in their CSP.
  So HUD will always be visible in order to solve some browser issues on Chrome *from ver 52 to 67*.<br/>
  While *before ver 52*, all functions of Vimium C will be broken on such pages.
7. *When ver 64 and 65*, Chrome always cleans console logs if only Vomnibar is opened, and there's nothing we can do for it.
8. *When ver 69*, Chrome disables `requestAnimationFrame` on some sandboxed pages, so Vimium C can not scroll them smoothly.

# Release Notes

1.74:
* *BREAKING*: now **use `s-` to represent the `ShiftKey`** is being pressed when constructing keys
  * e.g. `<a-s-f>`: just like using `a-`, `c-` and `m-` to represent `AltKey`, `CtrlKey` and `MetaKey`
  * if a key is one of function key, space and arrow keys, should also use `s-` (like `<s-space>` and `<s-f12>`)
  * an exception is when a key is a punctuation (is a single character and has no lower/UPPER forms)
    * in this case, use `<a-#>` and `<c-+>` directly
* full-featured Firefox support (although Firefox has no "contentSettings" support)
* Exclusions:
  * passKeys always takes effects, even when a prior key has matched
  * passKeys supports `<esc>` and `<c-[>`
  * *BREAKING*: use "`^`" as a prefix of passKeys now means it's a whitelist of hooked keys
* LinkHints:
  * can simulate clicking the right mouse button (use an option of `button="right"`)
  * in hover mode, can toggle class names of given HTML nodes (use `toggle={".selector":"className"}`)
* Vomnibar:
* vimium://show : now auto decrypt "thunder://" URLs
* fix some typos about `<a-c>` and `<a-t>` in recommended key mappings
* fix the detection of fullscreen status on Chrome >= 71

1.73:
* now LinkHints can hint items using the `.onclick` handler
  * work well in websites like https://youpin.mi.com
* in LinkHints mode, press `<a-f2>` if some hint markers are covered by page content
* Vomnibar supports keyword/phase blacklist, and matched items are hidden except you type the keyword
* on Vomnibar, a perfectly matched domain suggestion may get auto selected
* on Vomnibar, query "`:w`" to search tabs only in current window (or use an option `currentWindow`)
* if an iframe is embeded dynamically and no exclusion rules found, now apply those rules of the top frame on it
  * for pages like https://docs.google.com
* `w` and `e` in visual mode now jump among words much more smartly
* Vimium C's blank page will also be dark if Vomnibar is in dark mode
* FindMode supports `<c-j/k>` to go next on a host frame
* fix broken `togglePinTab`
* Vomnibar fixes some UI issues including the wrong box shadow on Chrome 73
* fix issues when syncing settings
* fix lots of edge cases

1.72:
* fix that UI may break on some pages since Chrome 70.
* be able to read the system clipboard since Firefox 63.
* VisualMode: support cursor movement on `<input type=number>` correctly
* make usages of command count consistent, for `removeTab`, `removeRightTab`, `reloadTab`, `moveTabToNewWindow` and `togglePinTab`
* add a dark theme of Vomnibar, and use `gn` to toggle it
* search engines: support default URLs when a query is empty
* custom CSS: now can specify styles for FindMode HUD and Vomnibar, and live preview any changes
* VisualMode: `<f1>` to flash selection area
* help dialog: support customized key mapping names and descriptions

1.71.3:
* fix broken code on Vimium C's background process
* a few bug fixes and improvements of `FindMode` and `VisualMode`
* Firefox: fix Vomnibar UI and broken `FindMode`
* `vimium://show` now supports history actions and stores history data safely and secretly

1.71:
* use Google, instead of Baidu, as the default search engine, for non-Chinese users
* LinkHints: always match all links under Shadow DOMs
* LinkHints.activateModeToOpenImage / `vimium://show#image` : try to auto parse higher-res image URLs
* VisualMode: rewrite all code and make commands cost much less CPU and energy
* redesign the whole message + build systems: smaller code size
* fix lots of regressions and edge bugs
* now can run absolutely safely on all malformed HTML webpages, and avoid potential crashes or dead loops
* inject Vimium C into other extensions: auto reload content scripts when Vimium C updates to a new version

1.69.2:
* fix that Vomnibar often shows and disappears on reopening
* fix that some web pages can not be scrolled without a click
* fix the functionality of syncing with the cloud which is broken for a long time
* fix some old bugs of the options page

1.69.0:
* FindMode: `\w` means to enable whole-word searching
  * now it ensures search results to match regexp queries, so `\bword\b` will work well
* fix that Vimium C could not scroll on some pages
  * some of scrolling failures are because of a bug of Chrome 69, which will be fixed on Chrome 70
* LinkHints: fix that the drawer menu hides unexpectedly on google docs
* fix that `visitPreviousTab` breaks if some new tabs are not visited yet
* LinkHints: add `focus` mode and `hideHUD` switch
* limit command count: must between `-9999` and `9999`
* fix that it might break some pages in case Vimium C got disabled suddenly
* fix many edge cases

1.68.2:
* rename this project into "Vimium C"

# Building

If you want to compile this project manually, please run:

``` bash
npm install typescript@3.3.1
node scripts/tsc all
#./scripts/make.sh output-file.zip
```

`gulp local` can also compile files in place (using configurable build options),
while `gulp dist` compiles and minimizes files into `dist/`.

The options including `MinCVer` and `BTypes` in [gulp.tsconfig.json](scripts/gulp.tsconfig.json)
  are used to control supported target browsers and set a minimum browser version.

# Thanks & Licenses

Vimium C: Copyright (c) Dahan Gong, Phil Crosby, Ilya Sukhar.
See the [MIT LICENSE](LICENSE.txt) for details.

* [Vimium](https://github.com/philc/vimium):
  Copyright (c) 2010 Phil Crosby, Ilya Sukhar.
  [MIT-licensed](https://github.com/philc/vimium/blob/master/MIT-LICENSE.txt).
* [微度新标签页](http://www.weidunewtab.com/):
  ©2012 杭州佐拉网络有限公司 保留所有权利.
* [JavaScript Expression Evaluator](https://github.com/silentmatt/expr-eval)
  ([Modified](https://github.com/gdh1995/js-expression-eval)):
  Copyright (c) 2015 Matthew Crumley.
  [MIT-licensed](https://github.com/silentmatt/expr-eval/blob/master/LICENSE.txt).
* [Viewer.js](https://github.com/fengyuanchen/viewerjs)
  ([Modified by gdh1995](https://github.com/gdh1995/viewerjs/tree/for-vimium-c)):
  Copyright (c) 2015-present Chen Fengyuan.
  [MIT-licensed](https://github.com/fengyuanchen/viewerjs/blob/master/LICENSE).
* [TypeScript](https://github.com/Microsoft/TypeScript):
    and modified `es.d.ts`, `es/*`, `dom.d.ts` and `chrome.d.ts` in `types/`:
  Copyright (c) Microsoft Corporation (All rights reserved).
  Licensed under the Apache License, Version 2.0.
  See more on [www.typescriptlang.org](http://www.typescriptlang.org/).
* [PDF.js](https://github.com/mozilla/pdf.js/):
  Copyright (c) Mozilla and individual contributors.
  Licensed under the Apache License, Version 2.0.
