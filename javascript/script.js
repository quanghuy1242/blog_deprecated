const MDCDialog = mdc.dialog.MDCDialog;
const MDCTabBar = mdc.tabBar.MDCTabBar;
const MDCTab = mdc.tab.MDCTab;

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
  let tabscontentId = tabId.split('-')[2];
  document.querySelector(`#mdc-tab-content-${tabscontentId}`).classList.add('show');
});
//#endregion

//#region scroll
(
  function () {
    let section = document.querySelectorAll(".cs-card-content");
    let sections = {};
    let i = 0;

    Array.prototype.forEach.call(section, e => {
      sections[e.id] = e.offsetTop;
    });

    window.onscroll = function () {
      let scrollPostion = document.documentElement.scrollTop || document.body.scrollTop;

      for (i in sections) {
        if (sections[i] <= scrollPostion) {
          document.querySelectorAll('.mdc-list a').forEach(ele => {
            ele.classList.remove('mdc-list-item__actived');
          });
          document.querySelector(`a[href='#${i}']`).classList.add('mdc-list-item__actived');
        }
      }
    };

  }
)();
document.querySelector('.mdc-list a').classList.add('mdc-list-item__actived');
//#endregion