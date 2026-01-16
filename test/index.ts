import { test } from '@substrate-system/tapzero'
import { waitFor } from '@substrate-system/dom'
import {
    assertNoViolations,
    assertWCAGCompliance
} from '@substrate-system/tapout/axe'
import '../src/index.js'

// Helper to create a fresh counter element
function createCounter (attrs: Record<string, string> = {}): HTMLElement {
    const el = document.createElement('character-counter')
    for (const [key, value] of Object.entries(attrs)) {
        el.setAttribute(key, value)
    }
    document.body.appendChild(el)
    return el
}

// Helper to clean up
function cleanup () {
    document.body.innerHTML = ''
}

// =============================================================================
// Basic functionality tests
// =============================================================================

test('component is defined', async t => {
    const el = createCounter()
    await waitFor('character-counter')
    t.ok(el, 'should create element')
    t.ok(customElements.get('character-counter'), 'should be registered')
    cleanup()
})

test('default attribute values', async t => {
    const el = createCounter() as HTMLElement & { max: number; count: number }
    await waitFor('character-counter')

    t.equal(el.max, 300, 'default max should be 300')
    t.equal(el.count, 0, 'default count should be 0')
    cleanup()
})

test('custom attribute values', async t => {
    const el = createCounter({ max: '280', count: '50' }) as HTMLElement & {
        max: number;
        count: number;
        remaining: number;
    }
    await waitFor('character-counter')

    t.equal(el.max, 280, 'max should be 280')
    t.equal(el.count, 50, 'count should be 50')
    t.equal(el.remaining, 230, 'remaining should be 230')
    cleanup()
})

test('count setter', async t => {
    const el = createCounter({ max: '300' }) as HTMLElement & {
        count: number;
        remaining: number;
    }
    await waitFor('character-counter')

    el.count = 100
    t.equal(el.count, 100, 'count should be updated via setter')
    t.equal(el.getAttribute('count'), '100', 'attribute should reflect property')
    t.equal(el.remaining, 200, 'remaining should update')
    cleanup()
})

// =============================================================================
// Progress calculation tests
// =============================================================================

test('progress calculation', async t => {
    const el = createCounter({ max: '100', count: '50' }) as HTMLElement & {
        progress: number;
    }
    await waitFor('character-counter')

    t.equal(el.progress, 0.5, 'progress should be 0.5 at 50%')
    cleanup()
})

test('progress is capped at 1 when over limit', async t => {
    const el = createCounter({ max: '100', count: '150' }) as HTMLElement & {
        progress: number;
    }
    await waitFor('character-counter')

    t.equal(el.progress, 1, 'progress should be capped at 1')
    cleanup()
})

// =============================================================================
// Over-limit state tests
// =============================================================================

test('isOverLimit when under limit', async t => {
    const el = createCounter({ max: '300', count: '100' }) as HTMLElement & {
        isOverLimit: boolean;
    }
    await waitFor('character-counter')

    t.equal(el.isOverLimit, false, 'should not be over limit')
    t.equal(el.hasAttribute('data-over-limit'), false, 'should not have data-over-limit')
    cleanup()
})

test('isOverLimit when over limit', async t => {
    const el = createCounter({ max: '300', count: '350' }) as HTMLElement & {
        isOverLimit: boolean;
        remaining: number;
    }
    await waitFor('character-counter')

    t.equal(el.isOverLimit, true, 'should be over limit')
    t.equal(el.hasAttribute('data-over-limit'), true, 'should have data-over-limit')
    t.equal(el.remaining, -50, 'remaining should be negative')
    cleanup()
})

test('data-over-limit updates when count changes', async t => {
    const el = createCounter({ max: '100', count: '50' }) as HTMLElement & {
        count: number;
    }
    await waitFor('character-counter')

    t.equal(el.hasAttribute('data-over-limit'), false, 'initially not over limit')

    el.count = 150
    t.equal(el.hasAttribute('data-over-limit'), true, 'should add data-over-limit')

    el.count = 50
    t.equal(el.hasAttribute('data-over-limit'), false, 'should remove data-over-limit')
    cleanup()
})

// =============================================================================
// Display behavior tests (hide-count, warn)
// =============================================================================

test('default: always shows count', async t => {
    const el = createCounter({ max: '300', count: '50' }) as HTMLElement & {
        shouldShowCount: boolean;
    }
    await waitFor('character-counter')

    t.equal(el.shouldShowCount, true, 'shouldShowCount should be true by default')
    t.equal(el.hasAttribute('data-hide-count'), false, 'should not have data-hide-count')

    const remaining = el.querySelector('.remaining')
    t.ok(remaining, 'remaining element should exist')
    cleanup()
})

test('hide-count: never shows count', async t => {
    const el = createCounter({ max: '300', count: '50', 'hide-count': '' }) as HTMLElement & {
        hideCount: boolean;
        shouldShowCount: boolean;
    }
    await waitFor('character-counter')

    t.equal(el.hideCount, true, 'hideCount should be true')
    t.equal(el.shouldShowCount, false, 'shouldShowCount should be false')
    t.equal(el.hasAttribute('data-hide-count'), true, 'should have data-hide-count')
    cleanup()
})

test('warn: shows count only when near limit', async t => {
    const el = createCounter({ max: '300', count: '50', warn: '' }) as HTMLElement & {
        warn: boolean;
        shouldShowCount: boolean;
        count: number;
    }
    await waitFor('character-counter')

    t.equal(el.warn, true, 'warn should be true')
    t.equal(el.shouldShowCount, false, 'shouldShowCount should be false when far from limit')
    t.equal(el.hasAttribute('data-hide-count'), true, 'should have data-hide-count')

    // Move near limit
    el.count = 285
    t.equal(el.shouldShowCount, true, 'shouldShowCount should be true near limit')
    t.equal(el.hasAttribute('data-hide-count'), false, 'should not have data-hide-count')
    cleanup()
})

test('hide-count takes precedence over warn', async t => {
    const el = createCounter({
        max: '300',
        count: '295',
        'hide-count': '',
        warn: ''
    }) as HTMLElement & {
        hideCount: boolean;
        warn: boolean;
        shouldShowCount: boolean;
    }
    await waitFor('character-counter')

    t.equal(el.hideCount, true, 'hideCount should be true')
    t.equal(el.warn, true, 'warn should be true')
    t.equal(el.shouldShowCount, false, 'shouldShowCount should be false (hide-count wins)')
    cleanup()
})

test('warn with integer value: parses correctly', async t => {
    const el = createCounter({ max: '300', count: '50', warn: '50' }) as HTMLElement & {
        warn: boolean | number;
    }
    await waitFor('character-counter')

    t.equal(el.warn, 50, 'warn should return 50 as a number')
    cleanup()
})

test('warn with integer value: shows count at custom threshold', async t => {
    const el = createCounter({ max: '300', count: '200', warn: '50' }) as HTMLElement & {
        shouldShowCount: boolean;
        count: number;
        isNearLimit: boolean;
    }
    await waitFor('character-counter')

    // 100 remaining, threshold is 50, should not show
    t.equal(el.isNearLimit, false, 'should not be near limit with 100 remaining and threshold of 50')
    t.equal(el.shouldShowCount, false, 'should not show count when far from custom threshold')
    t.equal(el.hasAttribute('data-hide-count'), true, 'should have data-hide-count')

    // Move to exactly the threshold
    el.count = 250
    t.equal(el.isNearLimit, true, 'should be near limit at exactly 50 remaining')
    t.equal(el.shouldShowCount, true, 'should show count at threshold')
    t.equal(el.hasAttribute('data-hide-count'), false, 'should not have data-hide-count')

    // Move beyond threshold
    el.count = 251
    t.equal(el.isNearLimit, true, 'should be near limit with 49 remaining')
    t.equal(el.shouldShowCount, true, 'should show count when under threshold')
    cleanup()
})

test('warn with integer value: different thresholds', async t => {
    const el1 = createCounter({ max: '200', count: '100', warn: '100' }) as HTMLElement & {
        shouldShowCount: boolean;
        warn: boolean | number;
    }
    await waitFor('character-counter')

    t.equal(el1.warn, 100, 'warn should be 100')
    t.equal(el1.shouldShowCount, true, 'should show count at 100 remaining with threshold 100')

    cleanup()

    const el2 = createCounter({ max: '200', count: '100', warn: '99' }) as HTMLElement & {
        shouldShowCount: boolean;
        warn: boolean | number;
    }
    await waitFor('character-counter')

    t.equal(el2.warn, 99, 'warn should be 99')
    t.equal(el2.shouldShowCount, false, 'should not show count at 100 remaining with threshold 99')

    cleanup()
})

test('warn boolean vs integer: boolean defaults to 20', async t => {
    const el = createCounter({ max: '300', count: '279', warn: '' }) as HTMLElement & {
        warn: boolean | number;
        isNearLimit: boolean;
        count: number;
    }
    await waitFor('character-counter')

    t.equal(el.warn, true, 'warn should be true (boolean)')
    t.equal(el.isNearLimit, false, 'should not be near limit at 21 remaining')

    el.count = 280
    t.equal(el.isNearLimit, true, 'should be near limit at 20 remaining (default threshold)')

    cleanup()
})

test('warn with zero value', async t => {
    const el = createCounter({ max: '100', count: '50', warn: '0' }) as HTMLElement & {
        warn: boolean | number;
        shouldShowCount: boolean;
        count: number;
    }
    await waitFor('character-counter')

    t.equal(el.warn, 0, 'warn should be 0')
    t.equal(el.shouldShowCount, false, 'should not show count with positive remaining and threshold 0')

    el.count = 100
    t.equal(el.shouldShowCount, true, 'should show count at 0 remaining')

    el.count = 101
    t.equal(el.shouldShowCount, true, 'should show count when over limit')

    cleanup()
})

test('isNearLimit threshold', async t => {
    const el = createCounter({ max: '300', count: '279' }) as HTMLElement & {
        isNearLimit: boolean;
        count: number;
    }
    await waitFor('character-counter')

    t.equal(el.isNearLimit, false, 'should not be near limit at 21 remaining')

    el.count = 280
    t.equal(el.isNearLimit, true, 'should be near limit at 20 remaining')

    el.count = 300
    t.equal(el.isNearLimit, true, 'should be near limit at 0 remaining')

    el.count = 320
    t.equal(el.isNearLimit, true, 'should be near limit when over')
    cleanup()
})

// =============================================================================
// Attribute change reactivity tests
// =============================================================================

test('reacts to hide-count attribute changes', async t => {
    const el = createCounter({ max: '300', count: '50' }) as HTMLElement & {
        shouldShowCount: boolean;
    }
    await waitFor('character-counter')

    t.equal(el.shouldShowCount, true, 'initially shows count')

    el.setAttribute('hide-count', '')
    t.equal(el.shouldShowCount, false, 'hides count after attribute added')

    el.removeAttribute('hide-count')
    t.equal(el.shouldShowCount, true, 'shows count after attribute removed')
    cleanup()
})

test('reacts to warn attribute changes', async t => {
    const el = createCounter({ max: '300', count: '50' }) as HTMLElement & {
        shouldShowCount: boolean;
        count: number;
    }
    await waitFor('character-counter')

    t.equal(el.shouldShowCount, true, 'initially shows count')

    el.setAttribute('warn', '')
    t.equal(el.shouldShowCount, false, 'hides count in warn mode when far from limit')

    el.count = 285
    t.equal(el.shouldShowCount, true, 'shows count in warn mode when near limit')

    el.removeAttribute('warn')
    el.count = 50
    t.equal(el.shouldShowCount, true, 'shows count after warn removed')
    cleanup()
})

// =============================================================================
// DOM structure tests
// =============================================================================

test('renders correct DOM structure', async t => {
    const el = createCounter({ max: '300', count: '50' })
    await waitFor('character-counter')

    const wrapper = el.querySelector('.counter-wrapper')
    t.ok(wrapper, 'should have counter-wrapper')

    const remaining = el.querySelector('.remaining')
    t.ok(remaining, 'should have remaining element')
    t.equal(remaining?.textContent, '250', 'remaining should show correct value')

    const svg = el.querySelector('.circle-container')
    t.ok(svg, 'should have circle-container SVG')

    const track = el.querySelector('.track')
    t.ok(track, 'should have track circle')

    const progress = el.querySelector('.progress')
    t.ok(progress, 'should have progress circle')
    cleanup()
})

test('remaining text updates when count changes', async t => {
    const el = createCounter({ max: '300', count: '50' }) as HTMLElement & {
        count: number;
    }
    await waitFor('character-counter')

    let remaining = el.querySelector('.remaining')
    t.equal(remaining?.textContent, '250', 'initial remaining value')

    el.count = 200
    remaining = el.querySelector('.remaining')
    t.equal(remaining?.textContent, '100', 'updated remaining value')
    cleanup()
})

// =============================================================================
// ARIA and accessibility attribute tests
// =============================================================================

test('has correct ARIA attributes', async t => {
    const el = createCounter({ max: '300', count: '50' })
    await waitFor('character-counter')

    t.equal(el.getAttribute('role'), 'status', 'should have role="status"')
    t.equal(el.getAttribute('aria-live'), 'polite', 'should have aria-live="polite"')
    t.ok(el.getAttribute('aria-label')?.includes('remaining'), 'aria-label should mention remaining')
    cleanup()
})

test('ARIA label updates for over-limit state', async t => {
    const el = createCounter({ max: '100', count: '150' })
    await waitFor('character-counter')

    const label = el.getAttribute('aria-label')
    t.ok(label?.includes('over limit'), 'aria-label should mention over limit')
    t.ok(label?.includes('50'), 'aria-label should include amount over')
    cleanup()
})

// =============================================================================
// CSS custom properties tests
// =============================================================================

test('sets CSS custom properties for circumference and offset', async t => {
    const el = createCounter({ max: '100', count: '50' })
    await waitFor('character-counter')

    const circumference = el.style.getPropertyValue('--circumference')
    const offset = el.style.getPropertyValue('--offset')

    t.ok(circumference, 'should set --circumference')
    t.ok(offset, 'should set --offset')

    // At 50%, offset should be roughly half of circumference
    const circumferenceNum = parseFloat(circumference)
    const offsetNum = parseFloat(offset)
    t.ok(
        Math.abs(offsetNum - circumferenceNum / 2) < 1,
        'offset should be approximately half of circumference at 50%'
    )
    cleanup()
})

// =============================================================================
// Accessibility tests with axe-core
// =============================================================================

// Exclude html-has-lang since that's a test harness issue, not the component
const axeOptions = {
    rules: {
        'html-has-lang': { enabled: false }
    }
}

test('default state has no accessibility violations', async t => {
    document.body.innerHTML = `
        <main>
            <character-counter max="300" count="50"></character-counter>
        </main>
    `
    await waitFor('character-counter')

    await assertNoViolations(t, axeOptions)
    cleanup()
})

test('over-limit state has no accessibility violations', async t => {
    document.body.innerHTML = `
        <main>
            <character-counter max="100" count="150"></character-counter>
        </main>
    `
    await waitFor('character-counter')

    await assertNoViolations(t, axeOptions)
    cleanup()
})

test('with hide-count has no accessibility violations', async t => {
    document.body.innerHTML = `
        <main>
            <character-counter max="300" count="50" hide-count></character-counter>
        </main>
    `
    await waitFor('character-counter')

    await assertNoViolations(t, axeOptions)
    cleanup()
})

test('with warn attribute has no accessibility violations', async t => {
    document.body.innerHTML = `
        <main>
            <character-counter max="300" count="285" warn></character-counter>
        </main>
    `
    await waitFor('character-counter')

    await assertNoViolations(t, axeOptions)
    cleanup()
})

test('with warn integer value has no accessibility violations', async t => {
    document.body.innerHTML = `
        <main>
            <character-counter max="300" count="250" warn="50"></character-counter>
        </main>
    `
    await waitFor('character-counter')

    await assertNoViolations(t, axeOptions)
    cleanup()
})

test('meets WCAG AA compliance', async t => {
    document.body.innerHTML = `
        <main>
            <h1>Test Form</h1>
            <form>
                <label for="message">Message</label>
                <textarea id="message"></textarea>
                <character-counter max="300" count="50"></character-counter>
            </form>
        </main>
    `
    await waitFor('character-counter')

    await assertWCAGCompliance(t, 'AA', axeOptions)
    cleanup()
})

test('multiple counters have no accessibility violations', async t => {
    document.body.innerHTML = `
        <main>
            <div>
                <character-counter max="300" count="0"></character-counter>
            </div>
            <div>
                <character-counter max="100" count="80" warn></character-counter>
            </div>
            <div>
                <character-counter max="50" count="60"></character-counter>
            </div>
        </main>
    `
    await waitFor('character-counter')

    await assertNoViolations(t, axeOptions)
    cleanup()
})

// =============================================================================
// Cleanup
// =============================================================================

test('cleanup', () => {
    cleanup()
    // @ts-expect-error browser global
    window.testsFinished = true
})
