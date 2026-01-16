# Character Counter
[![tests](https://img.shields.io/github/actions/workflow/status/bskyprism/character-counter/nodejs.yml?style=flat-square)](https://github.com/bskyprism/character-counter/actions/workflows/nodejs.yml)
[![types](https://img.shields.io/npm/types/@bskyprism/character-counter?style=flat-square)](README.md)
[![module](https://img.shields.io/badge/module-ESM%2FCJS-blue?style=flat-square)](README.md)
[![install size](https://flat.badgen.net/packagephobia/install/@bicycle-codes/keys?cache-control=no-cache)](https://packagephobia.com/result?p=@bicycle-codes/keys)
[![gzip size](https://img.shields.io/bundlephobia/minzip/@bskyprism/character-counter?style=flat-square)](https://bundlephobia.com/package/@bskyprism/character-counter)
[![dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen.svg?style=flat-square)](package.json)
[![semantic versioning](https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&style=flat-square)](https://semver.org/)
[![Common Changelog](https://nichoth.github.io/badge/common-changelog.svg)](./CHANGELOG.md)
[![license](https://img.shields.io/badge/license-Big_Time-blue?style=flat-square)](LICENSE)


Count characters.

[See a live demo](https://bskyprism.github.io/character-counter/)

<!-- toc -->

## Install

Installation instructions

```sh
npm i -S @bskyprism/character-counter
```

## API

This exposes ESM and common JS via [package.json `exports` field](https://nodejs.org/api/packages.html#exports).

### ESM
```js
import '@bskyprism/character-counter'
```

### Common JS
```js
require('@bskyprism/character-counter')
```

## CSS

### Import CSS

```js
import '@bskyprism/character-counter/css'
```

Or minified:
```js
import '@bskyprism/character-counter/min/css'
```

### CSS variables

How it works:                                                                 
- Default is set in the CSS: `--counter-diameter: 2rem;`
- The TypeScript reads this value and calculates the radius and circumference.
- You can override it globally or per-component.
                                                                                
                                                                                
#### Change All Counters

```css
character-counter {                                                           
    --counter-diameter: 32px;                                                 
}                                                                             
```

#### Change One Counter

```html
<character-counter style="--counter-diameter: 3rem"></character-counter>   
```

## Use
This calls the global function `customElements.define`. Just import, then use
the tag in your HTML.

### JS
```js
import '@bskyprism/character-counter'
```

### HTML
```html
<div>
    <character-counter></character-counter>
</div>
```

### Pre-Built
This package exposes minified JS and CSS files too. Copy them to a location that is
accessible to your web server, then link to them in HTML.

#### Copy
```sh
cp ./node_modules/@bskyprism/character-counter/dist/index.min.js ./public/character-counter.min.js
cp ./node_modules/@bskyprism/character-counter/dist/style.min.css ./public/character-counter.css
```

#### HTML
```html
<head>
    <link rel="stylesheet" href="./character-counter.css">
</head>
<body>
    <!-- ... -->
    <script type="module" src="./character-counter.min.js"></script>
</body>
```
