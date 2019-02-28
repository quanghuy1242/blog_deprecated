document.querySelectorAll('.mdc-button, .mdc-card__primary-action, .mdc-fab').forEach(element => {
  mdc.ripple.MDCRipple.attachTo(element);
})