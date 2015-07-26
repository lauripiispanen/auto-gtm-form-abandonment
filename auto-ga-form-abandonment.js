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
      [].forEach.call(document.querySelectorAll("form"), function(form) {
        var name = form.getAttribute("name")
        history[name] = [];

        [].forEach.call(form.querySelectorAll("input"), function(input) {

          var inputName = input.getAttribute("name")
          input.addEventListener('change', function(e) {
            if (history[name].slice(-1) != inputName) {
              history[name].push(inputName)
            }
          })
        })
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