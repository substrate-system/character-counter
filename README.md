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

A visual character counter web component with a circular progress indicator,
inspired by Bluesky's post composer.

[See a live demo](https://bskyprism.github.io/character-counter/)


## _Featuring_

- **[No Shadow DOM](https://gomakethings.com/podcast/the-shadow-dom-is-an-anti-pattern/)**
- **Accessible** - ARIA labels and screen reader support

<!-- toc -->

- [Install](#install)
- [Use](#use)
  * [Basic Example](#basic-example)
  * [Dynamic Updates](#dynamic-updates)
  * [Toggling Display Attributes](#toggling-display-attributes)
- [Attributes](#attributes)
  * [Display Behavior](#display-behavior)
- [Data Attributes](#data-attributes)
- [CSS Custom Properties](#css-custom-properties)
  * [Change size globally](#change-size-globally)
  * [Change colors](#change-colors)
- [Behavior](#behavior)
- [API](#api)
  * [ESM](#esm)
  * [Common JS](#common-js)
  * [TypeScript](#typescript)
- [Pre-Built Files](#pre-built-files)
  * [Copy Files](#copy-files)
  * [Use in HTML](#use-in-html-1)

<!-- tocstop -->

## Install

```sh
npm i -S @bskyprism/character-counter
```

## Use

### Basic Example

This calls the global function `customElements.define`. Just import,
then use the tag in your HTML.

#### Import JavaScript

```js
import '@bskyprism/character-counter'
```

#### Import CSS

```js
import '@bskyprism/character-counter/css'
```

Or minified:
```js
import '@bskyprism/character-counter/min/css'
```

#### Use in HTML

```html
<character-counter max="300" count="50"></character-counter>
```

### Dynamic Updates

Update the `count` attribute as the user types:

```js
const textarea = document.querySelector('textarea')
const counter = document.querySelector('character-counter')

textarea.addEventListener('input', () => {
    counter.setAttribute('count', textarea.value.length)
})
```

Or use the setter:

```js
counter.count = textarea.value.length
```

### Toggling Display Attributes

The `hide-count` and `warn` attributes can be dynamically added or removed:

```js
const counter = document.querySelector('character-counter')

// Enable warning mode (only show count near limit)
counter.setAttribute('warn', '')

// Hide count completely
counter.setAttribute('hide-count', '')

// Remove hide-count to show count again
counter.removeAttribute('hide-count')
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `max` | number | `300` | Maximum character count |
| `count` | number | `0` | Current character count |
| `hide-count` | boolean | `false` | When present, never shows the remaining count text |
| `warn` | boolean | `false` | When present, only shows count when within 20 of limit (ignored if `hide-count` is present) |

### Display Behavior

The component's text display behavior depends on these attributes:

- **Default** (no attributes): Always shows the remaining count
- **With `warn`**: Only shows count when 20 or fewer characters remain
- **With `hide-count`**: Never shows the count (takes precedence over `warn`)

```html
<!-- Always show count -->
<character-counter max="300" count="50"></character-counter>

<!-- Only show count when near limit -->
<character-counter max="300" count="285" warn></character-counter>

<!-- Never show count -->
<character-counter max="300" count="50" hide-count></character-counter>
```

## Data Attributes

Sets data attributes based on state:

| Attribute | Description |
|-----------|-------------|
| `data-over-limit` | Present when `count` exceeds `max` |
| `data-hide-count` | Present when count text should be hidden (uses `visibility: hidden` to prevent layout shift) |


## CSS Custom Properties

Customize the appearance using CSS variables:

| Property | Default | Description |
|----------|---------|-------------|
| `--counter-diameter` | `2rem` | Circle diameter (supports any CSS unit) |
| `--counter-stroke-width` | `4` | Circle stroke width in pixels |
| `--counter-track-color` | `#e0e0e0` | Background ring color |
| `--counter-normal-color` | `#1d9bf0` | Progress color when under limit |
| `--counter-warning-color` | `#f4212e` | Progress color when over limit |
| `--counter-text-color` | `#536471` | Remaining count text color |

### Change size globally

```css
character-counter {
    --counter-diameter: 3rem;
    --counter-stroke-width: 5;
}
```

### Change colors

```css
character-counter {
    --counter-normal-color: #059669;
    --counter-warning-color: #dc2626;
    --counter-track-color: #f3f4f6;
}
```

#### Per-instance customization
```html
<character-counter
    max="280"
    count="0"
    style="--counter-diameter: 32px; --counter-normal-color: purple"
>
</character-counter>
```

## Behavior

- **Progress indicator**: The circular ring fills as `count` approaches `max`
- **Number display**: The remaining count appears to the left of the circle (controlled by `hide-count` and `warn` attributes)
- **Over-limit state**: When `count` > `max`, the component turns red and shows a negative number (if count display is enabled)
- **Accessibility**: Announces character count to screen readers via ARIA live regions

## API

This exposes ESM and common JS via
[package.json `exports` field](https://nodejs.org/api/packages.html#exports).

### ESM
```js
import '@bskyprism/character-counter'
// Named import
import { CharacterCounter } from '@bskyprism/character-counter'
```

### Common JS

```js
require('@bskyprism/character-counter')
```

### TypeScript

The component includes TypeScript definitions and extends the
global `HTMLElementTagNameMap`.

```ts
// Type-safe querySelector
const counter = document.querySelector('character-counter')
// counter is typed as CharacterCounter | null

// Set count via property
counter.count = 42

// Get computed values
console.log(counter.remaining)      // number
console.log(counter.isOverLimit)    // boolean
console.log(counter.hideCount)      // boolean
console.log(counter.warn)           // boolean
console.log(counter.shouldShowCount) // boolean
```

## Pre-Built Files

This package exposes minified JS and CSS files. Copy them to a location accessible to your web server, then link to them in HTML.

### Copy Files
```sh
cp ./node_modules/@bskyprism/character-counter/dist/index.min.js ./public/character-counter.min.js
cp ./node_modules/@bskyprism/character-counter/dist/style.min.css ./public/character-counter.css
```

### Use in HTML
```html
<head>
    <link rel="stylesheet" href="./character-counter.css">
</head>
<body>
    <character-counter max="300" count="0"></character-counter>

    <script type="module" src="./character-counter.min.js"></script>
</body>
```
