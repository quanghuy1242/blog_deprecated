document.querySelectorAll('.mdc-button, .mdc-card__primary-action, .mdc-fab').forEach(element => {
  mdc.ripple.MDCRipple.attachTo(element);
})

const MDCDialog = mdc.dialog.MDCDialog;

let dialog = new MDCDialog(document.querySelector('.mdc-dialog'));

let modal = document.querySelector('#aboutDialog');
let btnModal = document.querySelector('#cs-btn-dialog');
let btnCloseModal = document.querySelector('#cs-btn-close-dialog');

btnModal.addEventListener('click', function () {
  dialog.open();
}, false);

btnCloseModal.addEventListener('click', function () {
  dialog.close();
});

document.querySelector('.mdc-dialog__scrim').addEventListener('click', function (event) {
  dialog.close();
})