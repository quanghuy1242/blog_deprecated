const MDCDialog = mdc.dialog.MDCDialog;
const MDCTabBar = mdc.tabBar.MDCTabBar;
const MDCTab = mdc.tab.MDCTab;

document.querySelectorAll('.mdc-button, .mdc-card__primary-action, .mdc-fab').forEach(element => {
  mdc.ripple.MDCRipple.attachTo(element);
})

let dialog = new MDCDialog(document.querySelector('.mdc-dialog'));
let tabBarAbout = new MDCTabBar(document.querySelector('.mdc-tab-bar'));

let tab1 = new MDCTab(document.querySelector('#mdc-tab-1'));
let tab2 = new MDCTab(document.querySelector('#mdc-tab-2'));

let tabs = document.querySelectorAll('.mdc-tab');

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
});

// tab
// tabBarAbout.listen('MDCTabBar:activated', function (event) {
//   let tab = tabs[event.detail.index];
//   console.log(tab.getAttribute('id'));
//   document.querySelector('#mdc-tab-content-1').classList.add('show');
//   document.querySelector('#mdc-tab-content-2').classList.remove('show');
// });
tabBarAbout.activateTab(0);

let tabscontent = document.querySelectorAll('.tab-content');
function a (tab) {
  tab.listen('MDCTab:interacted', function (event) {
    tabscontent.forEach(tc => {
      tc.classList.remove('show');
    });
    let tabscontentId = event.detail.tabId.split('-')[2];
    document.querySelector(`#mdc-tab-content-${tabscontentId}`).classList.add('show');
  });
};
a(tab1);
a(tab2);
tabs[0].click();