<div align="center">
<img align="left" width="150" height="150" src="./public/tapmytab.png" alt="tapmytab logo">
<img align="right" src="https://deno.land/logo.svg" height="150px" alt="the deno mascot dinosaur standing in the rain">

# tapmytab

Effortless Kanban, drag-and-drop magic — right from your browser tab! 🎨✨

[krehwell](https://krehwell.com) 👾 · [Hafizh Izzan Zaldi](https://www.linkedin.com/in/hafizh-izzan-zaldi/) 👩🏻‍🎨🖌 · [**Download**](https://chromewebstore.google.com/detail/tapmytab/djfcjmnpjgalklhjilkfngplignmfkim?authuser=0&hl=en) 🚀

</div>

<p align="center">
  <img src="https://i.imgur.com/8dgYdJH.png" width="720" alt="tapmytab ui">
</p>

## ✨ Features

- 🪶 Super light, ~1mb
- 🌟 Open Source
- ✏️ Scratch anything on your new tab
- 📋 Instant Kanban on every new browser tab
- 🎯 Drag-and-drop cards across boards and reorder freely
- 📝 Full Markdown Rich Text editor support
- ♾️ Unlimited local storage — keep as many boards & cards as you like
- 🔄 Sync across tabs
- 🔒 Local storage for data privacy and offline access
- 🏷️ Custom tags label
- 📅 Due dates 
- 💾 Export / Import your boards for backup
- 🦊 Cross-browser — available for both Chrome and Firefox

## 📦 Installation

We love Deno and you should too

```
cd ./tapmytab
deno install --allow-scripts
deno task dev
```

## ⚡️ Getting the dev extension to work locally

1. The `deno task dev` script will generate a `dist/` dir which you can load it to the chrome extension. [See Instruction](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world?authuser=1#load-unpacked)

2. If you have load unpacked the `dist/` into your `chrome://extensions/` now you can open a new tab and override the
   tab with the dev extension. Any changes will trigger the hot-reload

### 🚢 Build & Publish

Bump the version first on: `deno.json`, `manifest.json`, and `manifest.firefox.json` then

```bash
# build for chrome & firefox
deno task zip 
```

**Chrome Web Store**: upload `tapmytab-chrome.zip` at [Chrome Developer Dashboard](https://chrome.google.com/webstore/devconsole) 

**Firefox Add-ons (AMO)**: upload `tapmytab-firefox.zip` at [addons.mozilla.org/developers](https://addons.mozilla.org/developers/) 

> Note: the Firefox build swaps in `manifest.firefox.json` after the Chrome build, so always produce the Firefox zip with `zip:firefox` (not by hand) to get the right manifest.
