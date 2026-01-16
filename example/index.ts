import '../src/index.css'
import '../src/index.js'

if (import.meta.env.DEV || import.meta.env.MODE === 'staging') {
    localStorage.setItem('DEBUG', 'character-counter,character-counter:*')
} else {
    localStorage.removeItem('DEBUG')
}

// Wire up default counter
const defaultTextarea = document.querySelector('#abc') as HTMLTextAreaElement
const defaultCounter = document.querySelector('#counter-default') as HTMLElement & { count: number }

defaultTextarea?.addEventListener('input', (ev) => {
    const el = ev.target as HTMLTextAreaElement
    defaultCounter.count = el.value.length
})

// Wire up warn counter
const warnTextarea = document.querySelector('#warn') as HTMLTextAreaElement
const warnCounter = document.querySelector('#counter-warn') as HTMLElement & { count: number }

warnTextarea?.addEventListener('input', (ev) => {
    const el = ev.target as HTMLTextAreaElement
    warnCounter.count = el.value.length
})

// Wire up hidden counter
const hiddenTextarea = document.querySelector('#hidden') as HTMLTextAreaElement
const hiddenCounter = document.querySelector('#counter-hidden') as HTMLElement & { count: number }

hiddenTextarea?.addEventListener('input', (ev) => {
    const el = ev.target as HTMLTextAreaElement
    hiddenCounter.count = el.value.length
})
