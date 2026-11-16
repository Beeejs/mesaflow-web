import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createOrderRefreshQueue, subscribeOrderEvents } from './orderEvents.js'

const mockBrowser = (t) => {
  const browser = {
    document: Object.assign(new EventTarget(), { visibilityState: 'visible' }),
    window: new EventTarget(),
  }
  for (const [key, value] of Object.entries(browser)) {
    const original = globalThis[key]
    globalThis[key] = value
    t.after(() => {
      if (original === undefined) delete globalThis[key]
      else globalThis[key] = original
    })
  }
  return browser
}

test('agrupa avisos y conserva cambios recibidos durante una consulta sin superponer recargas', async (t) => {
  const timers = []
  t.mock.method(globalThis, 'setTimeout', (callback, delay) => {
    const timer = { callback, delay }
    timers.push(timer)
    return timer
  })
  t.mock.method(globalThis, 'clearTimeout', () => {})
  let calls = 0
  let complete
  const queue = createOrderRefreshQueue(() => {
    calls++
    return new Promise((resolve) => { complete = resolve })
  })
  for (let i = 0; i < 5; i++) queue.request()
  assert.equal(timers.length, 1)
  assert.equal(timers[0].delay, 250)
  assert.equal(calls, 0)
  const first = timers[0].callback()
  assert.equal(calls, 1)
  queue.request()
  queue.request(true)
  assert.equal(calls, 1)
  assert.equal(timers.length, 1)
  complete()
  await first
  assert.equal(timers.length, 2)
  const next = timers[1].callback()
  assert.equal(calls, 2)
  complete()
  await next
  assert.equal(timers.length, 2)
  queue.stop()
})

test('sincroniza inmediatamente al conectar y descarta recargas pendientes al salir', async (t) => {
  const timers = []
  t.mock.method(globalThis, 'setTimeout', (callback) => {
    const timer = { callback }
    timers.push(timer)
    return timer
  })
  t.mock.method(globalThis, 'clearTimeout', (timer) => { if (timer) timer.cleared = true })
  let calls = 0
  let complete
  const queue = createOrderRefreshQueue(() => {
    calls++
    return new Promise((resolve) => { complete = resolve })
  })
  queue.request()
  queue.request(true)
  assert.equal(timers[0].cleared, true)
  assert.equal(calls, 1)
  queue.request()
  queue.stop()
  complete()
  await Promise.resolve()
  assert.equal(timers.length, 1)
  await timers[0].callback()
  queue.request(true)
  assert.equal(calls, 1)
})

test('escucha eventos autenticados y deja de notificar al cerrar', (t) => {
  mockBrowser(t)
  const instances = []
  class FakeEventSource {
    static CLOSED = 2
    constructor(url, options) {
      this.url = url
      this.options = options
      this.listeners = {}
      instances.push(this)
    }
    addEventListener(name, callback) { this.listeners[name] = callback }
    close() { this.closed = true }
  }
  const original = globalThis.EventSource
  globalThis.EventSource = FakeEventSource
  t.after(() => {
    if (original === undefined) delete globalThis.EventSource
    else globalThis.EventSource = original
  })
  let connected = 0
  let changes = 0
  const unsubscribe = subscribeOrderEvents('/eventos', {
    onConnected: () => connected++,
    onDisconnected: () => {},
    onChange: () => changes++,
  })
  const source = instances[0]
  assert.deepEqual(source.options, { withCredentials: true })
  assert.equal(source.url, '/eventos')
  source.onopen?.()
  assert.equal(connected, 0)
  source.listeners.CONECTADO()
  for (const event of ['PEDIDO_NUEVO', 'PEDIDO_ACTUALIZADO', 'PEDIDO_CANCELADO', 'SESION_CERRADA']) {
    source.listeners[event]()
  }
  assert.equal(connected, 1)
  assert.equal(changes, 4)
  unsubscribe()
  assert.equal(source.closed, true)
  source.listeners.CONECTADO()
  source.listeners.PEDIDO_NUEVO()
  assert.equal(connected, 1)
  assert.equal(changes, 4)
})

test('una reconexion nativa vuelve a sincronizar sin abrir otra conexion', (t) => {
  mockBrowser(t)
  const instances = []
  class FakeEventSource {
    static CLOSED = 2
    constructor() {
      this.listeners = {}
      instances.push(this)
    }
    addEventListener(name, callback) { this.listeners[name] = callback }
    close() {}
  }
  const original = globalThis.EventSource
  globalThis.EventSource = FakeEventSource
  t.after(() => {
    if (original === undefined) delete globalThis.EventSource
    else globalThis.EventSource = original
  })
  let connected = 0
  let disconnected = 0
  const unsubscribe = subscribeOrderEvents('/eventos', {
    onConnected: () => connected++,
    onDisconnected: () => disconnected++,
    onChange: () => {},
  })
  const source = instances[0]
  source.listeners.CONECTADO()
  source.readyState = 0
  source.onerror()
  source.listeners.CONECTADO()
  assert.equal(connected, 2)
  assert.equal(disconnected, 1)
  assert.equal(instances.length, 1)
  unsubscribe()
})

test('ante cierre definitivo reintenta y cancela el reintento al salir', (t) => {
  mockBrowser(t)
  const instances = []
  class FakeEventSource {
    static CLOSED = 2
    constructor() {
      this.listeners = {}
      instances.push(this)
    }
    addEventListener(name, callback) { this.listeners[name] = callback }
    close() { this.closed = true }
  }
  const original = globalThis.EventSource
  globalThis.EventSource = FakeEventSource
  t.after(() => {
    if (original === undefined) delete globalThis.EventSource
    else globalThis.EventSource = original
  })
  const timers = []
  t.mock.method(globalThis, 'setTimeout', (callback, delay) => {
    const timer = { callback, delay }
    timers.push(timer)
    return timer
  })
  t.mock.method(globalThis, 'clearTimeout', (timer) => { if (timer) timer.cleared = true })
  let disconnected = 0
  let connected = 0
  const unsubscribe = subscribeOrderEvents('/eventos', {
    onConnected: () => connected++,
    onDisconnected: () => disconnected++,
    onChange: () => {},
  })
  instances[0].readyState = FakeEventSource.CLOSED
  instances[0].onerror()
  instances[0].onerror()
  assert.equal(disconnected, 2)
  assert.equal(timers.length, 1)
  assert.equal(timers[0].delay, 10000)
  timers[0].callback()
  assert.equal(instances.length, 2)
  instances[0].listeners.CONECTADO()
  assert.equal(connected, 0)
  instances[1].listeners.CONECTADO()
  assert.equal(connected, 1)
  instances[1].readyState = FakeEventSource.CLOSED
  instances[1].onerror()
  unsubscribe()
  assert.equal(timers[1].cleared, true)
  timers[1].callback()
  assert.equal(instances.length, 2)
})

test('sincroniza al volver a una pestaña visible o recuperar la red y elimina los listeners al salir', (t) => {
  const browser = mockBrowser(t)
  const documentCleanup = t.mock.method(browser.document, 'removeEventListener')
  const windowCleanup = t.mock.method(browser.window, 'removeEventListener')
  class FakeEventSource {
    addEventListener() {}
    close() {}
  }
  const original = globalThis.EventSource
  globalThis.EventSource = FakeEventSource
  t.after(() => {
    if (original === undefined) delete globalThis.EventSource
    else globalThis.EventSource = original
  })
  let changes = 0
  const unsubscribe = subscribeOrderEvents('/eventos', {
    onConnected: () => {},
    onDisconnected: () => {},
    onChange: () => changes++,
  })
  browser.document.visibilityState = 'hidden'
  browser.document.dispatchEvent(new Event('visibilitychange'))
  assert.equal(changes, 0)
  browser.document.visibilityState = 'visible'
  browser.document.dispatchEvent(new Event('visibilitychange'))
  assert.equal(changes, 1)
  browser.window.dispatchEvent(new Event('online'))
  assert.equal(changes, 2)
  unsubscribe()
  assert.equal(documentCleanup.mock.calls[0].arguments[0], 'visibilitychange')
  assert.equal(windowCleanup.mock.calls[0].arguments[0], 'online')
  browser.document.dispatchEvent(new Event('visibilitychange'))
  browser.window.dispatchEvent(new Event('online'))
  assert.equal(changes, 2)
})
