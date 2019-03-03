const MDCDialog = mdc.dialog.MDCDialog;
const MDCTabBar = mdc.tabBar.MDCTabBar;
const MDCTab = mdc.tab.MDCTab;
const MDCLinearProgress = mdc.linearProgress.MDCLinearProgress;

//#region ripple
document.querySelectorAll('.mdc-button, .mdc-card__primary-action, .mdc-fab').forEach(element => {
  mdc.ripple.MDCRipple.attachTo(element);
})
//#endregion

//#region Dialog
let dialog = new MDCDialog(document.querySelector('.mdc-dialog'));
let modal = document.querySelector('#aboutDialog');
let btnModal = document.querySelector('#cs-btn-dialog');
let btnCloseModal = document.querySelector('#cs-btn-close-dialog');

btnModal.addEventListener('click', function () {
  dialog.open();
}, false);
btnCloseModal.addEventListener('click', function () {
  dialog.close();
}, false);
document.querySelector('.mdc-dialog__scrim').addEventListener('click', function (event) {
  dialog.close();
}, false);
//#endregion

//#region tabBar
let tabBarAbout = new MDCTabBar(document.querySelector('.mdc-tab-bar'));
let tabs = document.querySelectorAll('.mdc-tab'); // các tab-clickable
let tabscontent = document.querySelectorAll('.tab-content'); // nội dung từng tab

tabBarAbout.listen('MDCTabBar:activated', function (event) {
  let tabId = tabs[event.detail.index].getAttribute('id'); // Lấy id của tab đã click
  // Xoá hết class .show của tất cả các thẻ content
  tabscontent.forEach(tc => {
    tc.classList.remove('show');
  });
  // cái nào đã click thì add .show vô lại thẻ content đó
  let tabscontentId = tabId.split('-').reverse()[0];
  document.querySelector(`#mdc-tab-content-${tabscontentId}`).classList.add('show');
});
//#endregion