import '../src/index.css'
import '../src/index.js'

if (import.meta.env.DEV || import.meta.env.MODE === 'staging') {
    localStorage.setItem('DEBUG', 'character-counter,character-counter:*')
}

document.body.innerHTML += `
    <character-counter></character-counter>
`
