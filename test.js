const test = require('tape')
const InsularObserver = require('./')
const Div = () => document.createElement('div')

test('InsularObserver() returns a function', t => {
  t.equal(typeof InsularObserver(IntersectionObserver), 'function')
  t.end()
})


test('observe(target, listener)', t => {
  t.plan(2)
  const observe = InsularObserver(IntersectionObserver)

  const d1 = Div()
  const d2 = Div()
  ;[ d1, d2 ].forEach(element => document.body.appendChild(element))
  const unobserves = [
    observe(d1, e => t.equal(e.target, d1, 'intersection observer called its callback')),
    observe(d2, e => t.equal(e.target, d2, 'intersection observer called its callback'))
  ]
  setTimeout(() => {
    unobserves.forEach(f => f())
    ;[ d1, d2 ].forEach(element => document.body.removeChild(element))
    t.end()
  }, 1000)
})

test('observe(target, options, listener)', t => {
  t.plan(2)
  const observe = InsularObserver(MutationObserver)

  const div = Div()
  document.body.appendChild(div)
  const unobserve = observe(div, { attributes: true }, mutation => {
    t.equal(mutation.type, 'attributes', 'mutation observer called its callback with correct { type }')
    t.equal(mutation.attributeName, 'contenteditable', 'and correct { attributeName }')
  })
  div.contentEditable = true

  setTimeout(() => {
    unobserve()
    document.body.removeChild(div)
    t.end()
  }, 1000)
})

test('unobserve() removes listener', t => {
  t.plan(1)
  const observe = InsularObserver(MutationObserver)

  const div = Div()
  const unobserve = observe(div, { attributes: true }, mutation => {
    t.fail('This should not be called. `unobserve()` did not work.')
  })
  unobserve()
  div.contentEditable = true

  setTimeout(() => t.pass('listener was removed'))
})
