import { define } from '@substrate-system/web-component'
import Debug from '@substrate-system/debug'
const debug = Debug('character-counter')

// for document.querySelector
declare global {
    interface HTMLElementTagNameMap {
        'character-counter': CharacterCounter
    }
}

/**
 * <character-counter> - A visual character counter with circular progress
 *
 * Built without Shadow DOM following HTML-first principles. All styles are
 * defined in index.css and scoped with the custom element selector.
 *
 * Attributes:
 *   - max: Maximum character count (default: 300)
 *   - count: Current character count (default: 0)
 *
 * CSS Custom Properties for theming:
 *   - --counter-diameter: Circle diameter (default: 2rem)
 *   - --counter-stroke-width: Circle stroke width (default: 3)
 *   - --counter-track-color: Background ring color (default: #e0e0e0)
 *   - --counter-normal-color: Progress color when under limit (default: #1d9bf0)
 *   - --counter-warning-color: Progress color when over limit (default: #f4212e)
 *   - --counter-text-color: Text color for remaining count (default: #536471)
 *
 * Data Attributes (set automatically):
 *   - data-over-limit: Present when count exceeds max
 *
 * Usage:
 *   <character-counter max="300" count="50"></character-counter>
 */
export class CharacterCounter extends HTMLElement {
    static observedAttributes = ['max', 'count']

    get max ():number {
        return parseInt(this.getAttribute('max') ?? '300', 10)
    }

    get count ():number {
        return parseInt(this.getAttribute('count') ?? '0', 10)
    }

    set count (n) {
        this.setAttribute('count', '' + n)
    }

    get remaining ():number {
        return this.max - this.count
    }

    get progress ():number {
        // Returns 0-1, capped at 1 for over-limit
        return Math.min(this.count / this.max, 1)
    }

    get isOverLimit ():boolean {
        return this.count > this.max
    }

    get isNearLimit ():boolean {
        // Show number when less than 20 characters remaining
        return this.remaining <= 20
    }

    attributeChangedCallback (name:string, oldValue:string, newValue:string) {
        debug('attribute changed', name, oldValue, newValue)
        if (this.isConnected) {
            this.render()
        }
    }

    disconnectedCallback () {
        debug('disconnected')
    }

    connectedCallback () {
        this.render()
    }

    render () {
        // Set data attribute for over-limit state
        if (this.isOverLimit) {
            this.setAttribute('data-over-limit', '')
        } else {
            this.removeAttribute('data-over-limit')
        }

        // First render the HTML structure
        this.innerHTML = `
            <div class="counter-wrapper">
                <span class="remaining">${this.remaining}</span>
                <svg class="circle-container" viewBox="0 0 100 100" aria-hidden="true">
                    <circle class="track" cx="50" cy="50" r="47.5" />
                    <circle class="progress" cx="50" cy="50" r="47.5" />
                </svg>
            </div>
        `

        // Now get the actual rendered size in pixels
        const svg = this.querySelector('.circle-container') as SVGElement
        if (svg) {
            const rect = svg.getBoundingClientRect()
            const size = rect.width || 24
            const computedStyle = getComputedStyle(this)
            const strokeWidth = parseFloat(computedStyle.getPropertyValue('--counter-stroke-width')) || 3
            const radius = (size - strokeWidth) / 2
            const circumference = 2 * Math.PI * radius
            const offset = circumference - (this.progress * circumference)

            // Set CSS custom properties for dynamic values
            this.style.setProperty('--circumference', String(circumference))
            this.style.setProperty('--offset', String(offset))

            // Update SVG viewBox to match the actual pixel size
            svg.setAttribute('viewBox', `0 0 ${size} ${size}`)
            const circles = svg.querySelectorAll('circle')
            circles.forEach(circle => {
                circle.setAttribute('cx', String(size / 2))
                circle.setAttribute('cy', String(size / 2))
                circle.setAttribute('r', String(radius))
            })
        }

        // Update aria-label for screen readers
        this.setAttribute('role', 'status')
        this.setAttribute('aria-live', 'polite')
        this.setAttribute('aria-label',
            this.isOverLimit
                ? `${Math.abs(this.remaining)} characters over limit`
                : `${this.remaining} characters remaining`
        )
    }
}

define('character-counter', CharacterCounter)
