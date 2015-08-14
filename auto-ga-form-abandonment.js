(function() {
  if (typeof document.querySelectorAll === "undefined") {
    return
  }
    window.addEventListener('beforeunload', function(e) {
      findUnsubmittedForms().forEach(function(it) {
        window.dataLayer.push({
          'event' : 'formAbandonment',
          'eventCategory' : 'Form Abandonment',
          'eventAction' : it.name + ": " + it.history.join(" > ")
        })
      })
    })

    var history = {}

    window.addEventListener("load", function() {
      document.addEventListener("change", function(e) {
        var target = e.target
        if (target && target.tagName && (target.tagName.toUpperCase() == "INPUT")) {
          var inputName = target.getAttribute("name")
          var form = target.form
          if (form && inputName) {
            var formName = form.getAttribute("name")
            if (typeof history[formName] == "undefined") {
              history[formName] = []
            }
            if (history[formName].slice(-1) != inputName) {
              history[formName].push(inputName)
            }
          }
        }
      })
    })

    function findUnsubmittedForms() {
      return Object.keys(history).filter(hasNoFormSubmitEvent(window.dataLayer)).map(findFormFromHistory).filter(notEmpty)
    }

    function hasNoFormSubmitEvent(dataLayer) {
      return function(name) {
        return dataLayer.filter(isFormSubmitEvent).map(getFormName).indexOf(name) == -1
      }
    }

    function isFormSubmitEvent(e) {
      return e.event === 'gtm.formSubmit'
    }

    function getFormName(e) {
      return e['gtm.element'].name
    }

    function findFormFromHistory(name) {
      return {
        name: name,
        history: (history[name] || [])
      }
    }

    function notEmpty(form) {
      return form.history.length > 0
    }

})()