import { test } from '@substrate-system/tapzero'
import { waitFor } from '@substrate-system/dom'
import '../src/index.js'

test('example test', async t => {
    document.body.innerHTML += `
        <character-counter class="test">
        </character-counter>
    `

    const el = await waitFor('character-counter')

    t.ok(el, 'should find an element')
})
