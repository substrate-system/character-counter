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
 * Attributes:
 *   - max: Maximum character count (default: 300)
 *   - count: Current character count (default: 0)
 *
 * CSS Custom Properties:
 *   - --counter-track-color: Background ring color (default: #e0e0e0)
 *   - --counter-normal-color: Progress color when under limit (default: #1d9bf0)
 *   - --counter-warning-color: Progress color when over limit (default: #f4212e)
 *   - --counter-text-color: Text color for remaining count (default: #536471)
 *
 * Usage:
 *   <character-counter max="300" count="50"></character-counter>
 */
export class CharacterCounter extends HTMLElement {
    static observedAttributes = ['max', 'count']

    constructor () {
        super()
        this.attachShadow({ mode: 'open' })
    }

    get max ():number {
        return parseInt(this.getAttribute('max') ?? '300', 10)
    }

    get count ():number {
        return parseInt(this.getAttribute('count') ?? '0', 10)
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
        if (this.shadowRoot && this.isConnected) {
            this.render()
        }
    }

    disconnectedCallback () {
        debug('disconnected')
    }

    connectedCallback () {
        debug('connected')
        this.render()
    }

    render () {
        if (!this.shadowRoot) return

        const size = 24
        const strokeWidth = 2
        const radius = (size - strokeWidth) / 2
        const circumference = 2 * Math.PI * radius
        const offset = circumference - (this.progress * circumference)

        // Colors
        const trackColor = 'var(--counter-track-color, #e0e0e0)'
        const normalColor = 'var(--counter-normal-color, #1d9bf0)'
        const warningColor = 'var(--counter-warning-color, #f4212e)'
        const progressColor = this.isOverLimit ? warningColor : normalColor
        const textColor = this.isOverLimit
            ? warningColor
            : 'var(--counter-text-color, #536471)'

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }

                .counter-wrapper {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                }

                .remaining {
                    font-size: 13px;
                    font-weight: 400;
                    color: ${textColor};
                    min-width: 2ch;
                    text-align: right;
                }

                .circle-container {
                    width: ${size}px;
                    height: ${size}px;
                    transform: rotate(-90deg);
                }

                .track {
                    fill: none;
                    stroke: ${trackColor};
                    stroke-width: ${strokeWidth};
                }

                .progress {
                    fill: none;
                    stroke: ${progressColor};
                    stroke-width: ${strokeWidth};
                    stroke-linecap: round;
                    stroke-dasharray: ${circumference};
                    stroke-dashoffset: ${offset};
                    transition: stroke-dashoffset 0.15s ease-out, stroke 0.15s ease-out;
                }

                @media (prefers-reduced-motion: reduce) {
                    .progress {
                        transition: none;
                    }
                }
            </style>

            <div class="counter-wrapper">
                ${this.isNearLimit ? `<span class="remaining">${this.remaining}</span>` : ''}
                <svg class="circle-container" viewBox="0 0 ${size} ${size}" aria-hidden="true">
                    <circle
                        class="track"
                        cx="${size / 2}"
                        cy="${size / 2}"
                        r="${radius}"
                    />
                    <circle
                        class="progress"
                        cx="${size / 2}"
                        cy="${size / 2}"
                        r="${radius}"
                    />
                </svg>
            </div>
        `

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
