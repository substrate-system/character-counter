import '../src/index.css'
import '../src/index.js'

if (import.meta.env.DEV || import.meta.env.MODE === 'staging') {
    localStorage.setItem('DEBUG', 'character-counter,character-counter:*')
} else {
    localStorage.removeItem('DEBUG')
}

const counter = document.querySelector('character-counter')

let count = 0
document.querySelector('textarea')?.addEventListener('input', (ev) => {
    const el = ev.target as HTMLTextAreaElement
    count = el.value.length
    counter!.count = count
})

