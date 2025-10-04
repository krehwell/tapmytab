/// <reference types="npm:@types/chrome" />
/// <reference types="npm:@types/firefox-webext-browser" />

export const isChrome = typeof chrome != 'undefined'
export const isFirefox = typeof browser != 'undefined'

export const extensionAPI: typeof browser | typeof chrome = isFirefox ? browser : isChrome ? chrome : {}
