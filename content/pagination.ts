import {
  clickable_, vApi, isAlive_, safer, timeout_, escapeAllForRe, tryCreateRegExp, VTr, unwrap_ff, isTY, Lower, chromeVer_,
  OnChrome, OnFirefox, OnEdge
} from "../lib/utils"
import {
  docEl_unsafe_, htmlTag_, isAriaNotTrue_, isStyleVisible_, querySelectorAll_unsafe_, isIFrameElement, ALA, attr_s,
  contains_s
} from "../lib/dom_utils"
import { getBoundingClientRect_, view_ } from "../lib/rect"
import { kSafeAllSelector, detectUsableChild, set_addChildFrame_ } from "./link_hints"
import { traverse, ngEnabled } from "./local_links"
import { find_box } from "./mode_find"
import { omni_box } from "./omni"
import { flash_ } from "./dom_ui"
import { click_ } from "./async_dispatcher"
import { contentCommands_ } from "./port"

let iframesToSearchForNext: VApiTy[] | null

const isVisibleInPage = (element: SafeHTMLElement): boolean => {
  let rect: ClientRect
  return isAriaNotTrue_(element, kAria.disabled)
      && (rect = getBoundingClientRect_(element)).width > 2 && rect.height > 2 && isStyleVisible_(element)
}

export const filterTextToGoNext: VApiTy["g"] = (candidates, names, options, maxLen): number => {
  // Note: this traverser should not need a prepareCrop
  const links = isAlive_ ? (set_addChildFrame_((_, el, _view, subList): void => {
    subList!.push(el as KnownIFrameElement & SafeHTMLElement)
  }), traverse(kSafeAllSelector, options, (hints, element): void => {
    let s: string | null
    const tag = element.localName, isClickable = tag === "a" || tag && (
      tag === "button" ? !(element as HTMLButtonElement).disabled
      : clickable_.has(element)
      || (OnFirefox ? unwrap_ff(element).onclick : attr_s(element, "onclick"))
      || ((s = attr_s(element, "role")) ? (<RegExpI> /^(button|link)$/i).test(s)
          : ngEnabled && attr_s(element, "ng-click")))
    if (isClickable && isVisibleInPage(element)) {
      hints.push([element])
    }
    if (isIFrameElement(element)) {
      if (OnFirefox || OnChrome && Build.MinCVer >= BrowserVer.MinEnsuredShadowDOMV1
          || element !== find_box && element !== omni_box) {
        const rect = getBoundingClientRect_(element),
        childApi = rect.width > 99 && rect.height > 15 && detectUsableChild(element)
        childApi && iframesToSearchForNext!.push(childApi)
      }
    }
  }, 1, 1)) : [],
  isNext = options.n, lenLimits = options.l, totalMax = options.m,
  quirk = isNext ? ">>" : "<<", quirkIdx = names.indexOf(quirk),
  rel = isNext ? "next" : "prev", relIdx = names.indexOf(rel),
  detectQuirk = quirkIdx > 0 ? names.lastIndexOf(quirk[0], quirkIdx) : -1,
  wsRe = <RegExpOne> /\s+/,
  refusedStr = isNext ? "<" : ">";
  // @ts-ignore
  let i = isAlive_ ? 0 : GlobalConsts.MaxNumberOfNextPatterns + 1
  let candInd = 0, index = links.length
  set_addChildFrame_(null)
  links.push(docEl_unsafe_() as never);
  for (; i < names.length; i++) {
    if (GlobalConsts.SelectorPrefixesInPatterns.includes(names[i][0])) {
      const arr = querySelectorAll_unsafe_(names[i]);
      if (arr && arr.length === 1 && htmlTag_(arr[0])) {
        candidates.push([arr[0] as SafeHTMLElement, vApi, i << 23, ""])
        names.length = i + 1
      }
    }
  }
  let ch: string, s: string, len: number
  for (; 0 <= --index; ) {
    const link = links[index][0]
    if (contains_s(link, links[index + 1][0]) || (s = link.innerText).length > totalMax) { continue }
    if (s = s.length > 2 ? s : !s && (ch = (link as HTMLInputElement).value) && isTY(ch, kTY.str) && ch
            || attr_s(link, ALA) || link.title || s) {
      if (s.length > totalMax) { continue; }
      s = Lower(s)
      for (i = 0; i < names.length; i++) {
        if (s.length < lenLimits[i] && s.includes(names[i])) {
          if (!s.includes(refusedStr) && (len = (s = s.trim()).split(wsRe).length) <= maxLen) {
            maxLen > len && (maxLen = len + 1);
            let i2 = names.indexOf(s, i);
            if (i2 >= 0) { i = i2; len = 0; }
            else if (detectQuirk === i && s.includes(quirk)) { i = quirkIdx; len = 1; }
            // requires GlobalConsts.MaxNumberOfNextPatterns <= 255
            candidates.push([link, vApi,
                  (OnChrome ? Build.MinCVer >= BrowserVer.MinStableSort : !OnEdge)
                  ? (i << 23) | (len << 16) : (i << 23) | (len << 16) | candInd++ & 0xffff,
                s])
          }
          break;
        }
      }
    }
    // for non-English pages like www.google.co.jp
    if (s.length < 5 && relIdx >= 0 && (ch = link.id) && ch.includes(rel)) {
      candidates.push([link, vApi,
            (OnChrome ? Build.MinCVer >= BrowserVer.MinStableSort : !OnEdge)
            ? (relIdx << 23) | (((4 + ch.length) & 0x3f) << 16)
            : (relIdx << 23) | (((4 + ch.length) & 0x3f) << 16) | candInd++ & 0xffff,
          rel])
    }
  }
  return maxLen
}

export const findNextInText = (names: string[], options: CmdOptions[kFgCmd.goNext]
    ): GoNextBaseCandidate | null => {
  const wordRe = <RegExpOne> /\b/
  let array: GoNextCandidate[] = [], officer: VApiTy | undefined, maxLen = options.m, s: string
  let curLenLimit: number
  iframesToSearchForNext = [vApi]
  while (officer = iframesToSearchForNext!.pop()) {
    try {
      maxLen = officer.g(array, names, options, maxLen)
    } catch {}
    curLenLimit = (maxLen + 1) << 16
    array = array.filter(a => (a[2] & 0x7fffff) < curLenLimit)
  }
  iframesToSearchForNext = null
  array = array.sort((a, b) => a[2] - b[2])
  for (let i = array.length ? array[0][2] >> 23 : GlobalConsts.MaxNumberOfNextPatterns; i < names.length; ) {
    s = names[i++];
    const re = tryCreateRegExp(wordRe.test(s[0]) || wordRe.test(s.slice(-1))
        ? `\\b${escapeAllForRe(s)}\\b` : escapeAllForRe(s), "")!, j = i << 23
    for (const candidate of array) {
      if (candidate[2] > j) { break }
      if (!candidate[3] || re.test(candidate[3])) { return candidate }
    }
  }
  return null;
}

export const findNextInRel = (relName: string): GoNextBaseCandidate | null | undefined => {
  const elements = querySelectorAll_unsafe_(OnEdge ? "a[rel],area[rel],link[rel]"
      : OnFirefox && Build.MinFFVer >= FirefoxBrowserVer.MinEnsuredCSS$is$selector
      ? VTr(kTip.webkitWithRel).replace("-webkit-any", "is")
      : OnFirefox ? VTr(kTip.webkitWithRel).replace("webkit", "moz") : VTr(kTip.webkitWithRel))!
  let s: string | null | undefined;
  type HTMLElementWithRel = HTMLAnchorElement | HTMLAreaElement | HTMLLinkElement;
  let matched: HTMLElementWithRel | undefined, tag: string;
  const re1 = <RegExpOne> /\s/
  const array = OnChrome && Build.MinCVer < BrowserVer.MinEnsured$ForOf$forEach$ForDOMListTypes
      && Build.MinCVer >= BrowserVer.MinTestedES6Environment
      && chromeVer_ < BrowserVer.MinEnsured$ForOf$forEach$ForDOMListTypes
      ? [].slice.call(elements) : elements as { [i: number]: Element } as Element[]
  for (const element of array) {
    if ((tag = htmlTag_(element))
        && (s = OnChrome && Build.MinCVer < BrowserVer.Min$HTMLAreaElement$rel
                ? attr_s(element as SafeHTMLElement, "rel")
                : (element as TypeToPick<HTMLElement, HTMLElementWithRel, "rel">).rel)
        && Lower(s).split(re1).indexOf(relName) >= 0
        && ((s = (element as HTMLElementWithRel).href) || tag < "aa")
        && (tag > "b" || isVisibleInPage(element as SafeHTMLElement))) {
      if (matched) {
        if (s && matched.href && s.split("#")[0] !== matched.href.split("#")[0]) {
          return null;
        }
      }
      matched = element as HTMLElementWithRel;
    }
  }
  return matched && [matched as SafeHTMLElement, vApi]
}

export const jumpToNextLink = (linkElement: GoNextBaseCandidate[0]): void => {
  let url = htmlTag_(linkElement) === "link" && (linkElement as HTMLLinkElement).href
  view_(linkElement)
  flash_(linkElement) // here calls getRect -> preparCrop_
  if (url) {
    contentCommands_[kFgCmd.framesGoBack](safer({ r: 1, url }))
  } else {
    timeout_((): void => { click_(linkElement) }, 100)
  }
}
