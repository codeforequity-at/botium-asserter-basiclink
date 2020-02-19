# Botium Asserter: Hyperlink

[![NPM](https://nodei.co/npm/botium-asserter-basiclink.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/botium-asserter-basiclink/)

[![Codeship Status for codeforequity-at/botium-asserter-basiclink](https://app.codeship.com/projects/92741190-da3f-0136-2f75-7a4a4ba9342f/status?branch=master)](https://app.codeship.com/projects/317527)
[![npm version](https://badge.fury.io/js/botium-asserter-basiclink.svg)](https://badge.fury.io/js/botium-asserter-basiclink)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()

Asserts Botium Message contains a hyperlink

If it is used without argument, then it fails if there is no hyperlink at all.
 
## Configuration

### Botium Box

Preconfigured in Botium Box with *HASLINK* reference code.

See https://botium.atlassian.net/wiki/spaces/BOTIUM/pages/2293815/Botium+Asserters

### Botium Core / Botium Bindings / Botium CLI

    npm install --save botium-asserter-basiclink

Add to ASSERTERS capability, see [sample](https://github.com/codeforequity-at/botium-asserter-basiclink/blob/master/samples/botium.json)

## Usage

```
#me
Give me some links

#bot
HASLINK www.google.com|www.facebook.com
```
