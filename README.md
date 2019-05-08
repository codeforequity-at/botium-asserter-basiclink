# Botium Asserter: Hyperlink

Asserts Botium Message contains a hyperlink

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
HASLINK www.google.com
```

