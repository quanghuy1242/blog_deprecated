const db = firebase.firestore();

const MDCDialog = mdc.dialog.MDCDialog;
const MDCTabBar = mdc.tabBar.MDCTabBar;
const MDCTab = mdc.tab.MDCTab;
const MDCLinearProgress = mdc.linearProgress.MDCLinearProgress;
const MDCList = mdc.list.MDCList;
const MDCRipple = mdc.ripple.MDCRipple;
const MDCTextField = mdc.textField.MDCTextField;
const MDCMenu = mdc.menu.MDCMenu;
const MDCMenuSurface = mdc.menuSurface.MDCMenuSurface;

document.querySelectorAll('.mdc-button, .mdc-menu li').forEach(element => {
  mdc.ripple.MDCRipple.attachTo(element);
})

//#region Menu Quang Huy
const menuQH = new MDCMenu(document.querySelector('.mdc-menu'));
let btnOpenQH = document.querySelector('#btnOpenQH');

btnOpenQH.addEventListener('click', () => {
  menuQH.open = !menuQH.open;
  menuQH.listen('MDCMenu:selected', function(e) {
    let indexClick = e.detail.index;
    if (indexClick === 0) { // đăng xuất
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
        console.log('An error happened');
      });
    }
  });
});

document.querySelector('.mdc-menu li').click();

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

//#region list
let list;
let listItem;
//#endregion

//#region inputEdit
let titleInput = new MDCTextField(document.querySelector('#titleBlog'));
let titleContent = new MDCTextField(document.querySelector('#contentBlog'));
let btnUpdate = document.querySelector('#btnEdit');
//#endregion

//#region dialog
let dialog = new MDCDialog(document.querySelector('#aboutDialog'));
let btnCReload = document.querySelector('#cs-btn-close-dialog');
dialog.scrimClickAction = '';


let dialogLoading = new MDCDialog(document.querySelector('#loadingPopUp'));
dialogLoading.scrimClickAction = '';
dialogLoading.escapeKeyAction = '';
//#endregion

//#region load danh sách

let ulListItem = document.querySelector('#listDanhSachChuDe');
let contentReceived = document.querySelector('.cs-edit-post');
let idCLick;
let selectedBlog;

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

function getAndRenderList(blogs) {
  ulListItem.innerHTML = "";
  blogs.forEach(blog => {
    appendList(blog.data().title, blog.id, ulListItem);
  });
  
  document.querySelector('#listDanhSachChuDe li').setAttribute('aria-selected', true);
  document.querySelector('#listDanhSachChuDe li').classList.add('mdc-list-item--selected');

  list = new MDCList(document.querySelector('#listDanhSachChuDe'));
  listItem = list.listElements.map(ele => new MDCRipple(ele));
  list.singleSelection = true;
}

//#region KIểm tra đăng nhập
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log('Đã đăng nhập');
    document.querySelector('body').style.display = "initial";
    
    db.collection('blogs')
      .get()
      .then((blogs) => {
        getAndRenderList(blogs);

        list.listen('MDCList:action', function(e) {
          dialogLoading.open();
          idCLick = e.detail;
          db.collection('blogs')
            .get()
            .then((blogss) => {
              selectedBlog = blogss.docs[idCLick];
              titleInput.value = selectedBlog.data().title;
              titleContent.value = selectedBlog.data().content;
              dialogLoading.close();
            })
        })
        document.querySelector('#listDanhSachChuDe li').click();
      })
  } else {
    console.log('Chưa đăng nhập');
    window.location.replace('../signin.html');
  }
});
  
btnUpdate.addEventListener('click', () => {
  db.collection('blogs')
    .doc(selectedBlog.id)
    .update({
      title: titleInput.value,
      content: titleContent.value
    })
    .then(() => {
      dialog.open();
      btnCReload.addEventListener('click', () => {
        db.collection('blogs')
          .get()
          .then((blogs) => {
            getAndRenderList(blogs);
          })
      })
    })
    .catch((err) => {
      alert('Lỗi: ' + err);
    });
})

//#endregion
//#endregion