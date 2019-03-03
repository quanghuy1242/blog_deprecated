const db = firebase.firestore();

const MDCDialog = mdc.dialog.MDCDialog;
const MDCTabBar = mdc.tabBar.MDCTabBar;
const MDCTab = mdc.tab.MDCTab;
const MDCLinearProgress = mdc.linearProgress.MDCLinearProgress;
const MDCList = mdc.list.MDCList;
const MDCRipple = mdc.ripple.MDCRipple;
const MDCTextField = mdc.textField.MDCTextField;

document.querySelectorAll('.mdc-button').forEach(element => {
  mdc.ripple.MDCRipple.attachTo(element);
})

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

//#region list
let list;
let listItem;
//#endregion

//#region inputEdit
let titleInput = new MDCTextField(document.querySelector('#titleBlog'));
let titleContent = new MDCTextField(document.querySelector('#contentBlog'));
let btnEdit = document.querySelector('#btnEdit');
//#endregion

//#region dialog
let dialog = new MDCDialog(document.querySelector('.mdc-dialog'));
let btnCReload = document.querySelector('#cs-btn-close-dialog');
//#endregion

//#region load danh sách

let ulListItem = document.querySelector('.mdc-list');
let contentReceived = document.querySelector('.cs-edit-post');

function appendList (title, id, listElement) {
  let liListItem = document.createElement('li');
  liListItem.className = "mdc-list-item";
  liListItem.setAttribute('role', 'option');
  liListItem.setAttribute('tabindex', 0);
  liListItem.setAttribute('aria-selected', false);

  let spanListItemText = document.createElement('span');
  spanListItemText.className = "mdc-list-item__text";

  let spanPrimaryText = document.createElement('span');
  spanPrimaryText.className = "mdc-list-item__primary-text";
  let spanPrimaryText_text = document.createTextNode(title);
  spanPrimaryText.append(spanPrimaryText_text);

  let spanSecondaryText = document.createElement('span');
  spanSecondaryText.className = "mdc-list-item__secondary-text";
  let spanSecondaryText_text = document.createTextNode(id);
  spanSecondaryText.append(spanSecondaryText_text);

  spanListItemText.append(spanPrimaryText, spanSecondaryText);

  liListItem.append(spanListItemText);

  listElement.append(liListItem);
}

//#region KIểm tra đăng nhập
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log('Đã đăng nhập');
    document.querySelector('body').style.display = "initial";
    let idCLick;
    db.collection('blogs')
      .get()
      .then((blogs) => {
        blogs.forEach(blog => {
          appendList(blog.data().title, blog.id, ulListItem);
        });
        
        document.querySelector('.mdc-list li').setAttribute('aria-selected', true);
        document.querySelector('.mdc-list li').classList.add('mdc-list-item--selected');


        list = new MDCList(document.querySelector('.mdc-list'));
        listItem = list.listElements.map(ele => new MDCRipple(ele));
        list.singleSelection = true;

        list.listen('MDCList:action', function(e) {
          idCLick = e.detail;
          // console.log(blogs.docs[e.detail].id);
          // console.log(blogs.docs[e.detail].data().title);
          // contentReceived.innerHTML = blogs.docs[e.detail].data().content;
          titleInput.value = blogs.docs[idCLick].data().title;
          titleContent.value = blogs.docs[idCLick].data().content;
        })
        btnEdit.addEventListener('click', () => {
          console.log(idCLick);
          // update
          db.collection('blogs')
            .doc(blogs.docs[idCLick].id)
            .update({
              title: titleInput.value,
              content: titleContent.value
            })
            .then(() => {
              dialog.open();
              btnCReload.addEventListener('click', () => {
                window.location.reload(); // reload
              })
              document.querySelector('.mdc-dialog__scrim').addEventListener('click', function (event) {
                window.location.reload(); // reload
              }, false);
            })
            .catch((err) => {
              alert('Lỗi: ' + err);
            })
        })
        document.querySelector('.mdc-list li').click();
      })
  } else {
    console.log('Chưa đăng nhập');
    window.location.replace('../signin.html');
  }
});
//#endregion
//#endregion