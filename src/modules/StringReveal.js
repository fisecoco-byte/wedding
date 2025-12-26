import { StringModule } from '@fiddle-digital/string-tune'

export class StringReveal extends StringModule {
  constructor(context) {
    super(context)
    this.htmlKey = 'string-reveal'
    this.attributesToMap = [
      { key: 'delay', type: 'number', fallback: 0 },
      { key: 'class', type: 'string', fallback: 'in' },
      { key: 'repeat', type: 'boolean', fallback: true }
    ]
  }

  enterObject(id, object) {
    const delay = object.getProperty('delay') || 0
    const className = object.getProperty('class') || 'in'
    
    if (delay > 0) {
      // Store timeout ID to clear it if we exit before it fires
      object.revealTimeout = setTimeout(() => {
        object.htmlElement.classList.add(className)
      }, delay)
    } else {
      object.htmlElement.classList.add(className)
    }
  }

  exitObject(id) {
    const object = this.objectMap.get(id)
    if (!object) return

    const className = object.getProperty('class') || 'in'
    const repeat = object.getProperty('repeat')

    if (object.revealTimeout) {
      clearTimeout(object.revealTimeout)
      object.revealTimeout = null
    }

    if (repeat) {
      object.htmlElement.classList.remove(className)
    }
  }
}
