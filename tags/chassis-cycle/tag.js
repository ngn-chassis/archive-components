var NgnCycle = document.registerElement('chassis-cycle', { // eslint-disable-line no-unused-vars
  prototype: Object.create(HTMLElement.prototype, { // eslint-disable-line no-undef
    initTpl: {
      enumerable: false,
      value: function () {
        var tag = 'chassis-cycle'
        var src = document.querySelector('script[src*="' + tag + '"]') || document.querySelector('link[href*="' + tag + '.html"]')

        document.body.classList.add('chassis')

        if (src) {
          src = (src.hasAttribute('src') ? src.getAttribute('src') : src.getAttribute('href')).replace(/\\/g, '/')
          src = src.split('/')
          src.pop()
          src = src.join('/') + '/template.html'
          var req = new XMLHttpRequest()
          var me = this
          req.addEventListener('load', function () {
            var content = this.responseText.replace(/\n|\s+/g, ' ').replace(/\s\s/g, ' ').replace(/<(\/?)template(.*?)>/gi, '')
            var shadow = me.createShadowRoot()
            var ph = document.createElement('p')
            ph.insertAdjacentHTML('afterbegin', content)
            Array.prototype.slice.call(ph.children).forEach(function (el) {
              shadow.appendChild(document.importNode(el, true))
            })
          })
          req.open('GET', src)
          req.send()
        } else {
          this.createShadowRoot()
        }
      }
    },

    createdCallback: {
      value: function () {
        this.initTpl()
      }
    },

    /**
     * @property selected
     * The current active section.
     * @return {HTMLElement}
     */
    selected: {
      get: function () {
        return this.querySelector('.active')
      }
    },

    /**
     * @property selectedIndex
     * The index number of the current active section.
     * @return {Number}
     */
    selectedIndex: {
      get: function () {
        var el = this.querySelector('.active')
        return Array.prototype.slice.call(el.parentNode.children).indexOf(el)
      }
    },

    /**
     * @method next
     * Display the next screen.
     * @param {function} callback
     * Executed when the operation is complete.
     */
    next: {
      value: function (callback) {
        var curr = this.querySelector('.active')
        var next = curr ? curr.nextElementSibling : null
        curr && curr.classList.remove('active')
        if (curr && next) {
          next.classList.add('active')
        } else if (this.getAttribute('restart') === 'true') {
          // next = this.querySelector('section')
          next = this.children[0]
          next.classList.add('active')
        }
        this.dispatchEvent(new CustomEvent('change', { // eslint-disable-line no-undef
          detail: {
            previous: curr || null,
            el: next || null
          }
        }))
        callback && callback(next || null)
      }
    },

    /**
     * @method previous
     * Display the previous screen.
     * @param {function} callback
     * Executed when the operation is complete.
     */
    previous: {
      value: function (callback) {
        var curr = this.querySelector('.active')
        var prev = curr ? curr.previousElementSibling : null
        curr && curr.classList.remove('active')
        if (curr && prev) {
          prev.classList.add('active')
        } else if (this.getAttribute('restart') === 'true') {
          // If current selection is first, display the last
          if (curr === this.children[0]) {
            prev = this.children[this.children.length - 1]
          } else {
            prev = this.children[0]
          }
          prev.classList.add('active')
        }
        this.dispatchEvent(new CustomEvent('change', { // eslint-disable-line no-undef
          detail: {
            next: curr || null,
            el: prev || null
          }
        }))
        callback && callback(prev || null)
      }
    },

    /**
     * @method show
     * Show the specified screen (1-based index, i.e. first element is 1).
     * @param {number} index
     * The index of the screen to display.
     */
    show: {
      value: function (i) {
        var next
        switch ((typeof i).toLowerCase()) {
          case 'number':
            next = this.children[i - 1]
            break
          case 'string':
            next = document.querySelector(i)
            break
          default:
            next = i
        }
        var curr = this.querySelector('.active')
        curr && curr.classList.remove('active')
        next && next.classList.add('active')
        this.dispatchEvent(new CustomEvent('change', { // eslint-disable-line no-undef
          detail: {
            previous: curr || null,
            el: next || null
          }
        }))
      }
    },

    /**
     * @method first
     * A helper method to display the first element.
     */
    first: {
      value: function (i) {
        this.show(1)
      }
    },

    /**
     * @method last
     * A helper method to display the first element.
     */
    last: {
      value: function (i) {
        this.show(this.children.length)
      }
    }
  })
})
