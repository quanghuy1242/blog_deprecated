document.querySelectorAll('.mdc-button, .mdc-card__primary-action, .mdc-fab').forEach(function(element) {
  mdc.ripple.MDCRipple.attachTo(element);
})