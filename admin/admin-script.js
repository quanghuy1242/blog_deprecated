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

//#region input new
let newBlogTitle = new MDCTextField(document.querySelector('#newBlogTitle'));
let newBlogContent = new MDCTextField(document.querySelector('#newBlogContent'));
//#endregion

//#region dialog
let selectionConfirm;

let dialog = new MDCDialog(document.querySelector('#aboutDialog'));
let btnCReload = document.querySelector('#cs-btn-close-dialog');
dialog.scrimClickAction = '';
dialog.escapeKeyAction = '';


let dialogLoading = new MDCDialog(document.querySelector('#loadingPopUp'));
dialogLoading.scrimClickAction = '';
dialogLoading.escapeKeyAction = '';


let dialogNewPost = new MDCDialog(document.querySelector('#dialogNewPost'));
dialogNewPost.scrimClickAction = '';
dialogNewPost.escapeKeyAction = '';

let dialogConfirmDelete = new MDCDialog(document.querySelector('#dialogConfirm'));
dialogConfirmDelete.scrimClickAction = '';
dialogConfirmDelete.escapeKeyAction = '';
//#endregion

//#region load danh sách

let ulListItem = document.querySelector('#listDanhSachChuDe');
let contentReceived = document.querySelector('.cs-edit-post');
let idCLick;
let selectedBlog;
let getBlogs = [];

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

function getDSBlogs(blogs) {
  getBlogs.length = 0;
  blogs.forEach(blog => {
    getBlogs.push({ 
      id: blog.id, 
      title: blog.data().title,
      day: blog.data().day,
      content: blog.data().content,
      isChanged: false 
    });
  });
}

function renderList(blogs) {
  ulListItem.innerHTML = "";
  blogs.forEach(blog => {
    appendList(blog.title, blog.id, ulListItem);
  });
  
  document.querySelector('#listDanhSachChuDe li').setAttribute('aria-selected', true);
  document.querySelector('#listDanhSachChuDe li').classList.add('mdc-list-item--selected');

  list = new MDCList(document.querySelector('#listDanhSachChuDe'));
  listItem = list.listElements.map(ele => new MDCRipple(ele));
  list.singleSelection = true;
}

function loadList(blogs) {
  getDSBlogs(blogs);
  renderList(getBlogs);
  list.listen('MDCList:action', function (e) {
    idCLick = e.detail;
    if (!getBlogs[idCLick].isChanged) {
      titleInput.value = getBlogs[idCLick].title;
      titleContent.value = getBlogs[idCLick].content;
    }
    else {
      dialogLoading.open();
      db.collection('blogs')
        .orderBy("day", "desc")
        .get()
        .then((blogss) => {
          getDSBlogs(blogss);
          titleInput.value = getBlogs[idCLick].title;
          titleContent.value = getBlogs[idCLick].content;
          getBlogs[idCLick].isChanged = false;
          dialogLoading.close();
        })
    }
  })
  document.querySelector('#listDanhSachChuDe li').click();
}

//#region KIểm tra đăng nhập
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log('Đã đăng nhập');
    document.querySelector('body').style.display = "initial";
    db.collection('blogs')
      .orderBy("day", "desc")
      .get()
      .then((blogs) => {
        loadList(blogs);
      })
  } else {
    console.log('Chưa đăng nhập');
    window.location.replace('../signin.html');
  }
});

//#endregion
//#endregion

//#region Đăng kí sự kiện
btnUpdate.addEventListener('click', () => {
  if (!titleInput.value || !titleContent.value) {
    dialog.content_.innerText = "Không thể bỏ trống trường nào!";
    dialog.open();
    return;
  }
  dialogLoading.open();
  db.collection('blogs')
    .doc(getBlogs[idCLick].id)
    .update({
      title: titleInput.value,
      content: titleContent.value
    })
    .then(() => {
      getBlogs[idCLick].isChanged = true;
      dialogLoading.close();
      dialog.content_.innerText = "Update thành công!";
      dialog.open();
      btnCReload.addEventListener('click', () => {
        // Trên thanh list ul, đổi title của li đã thay đổi
        list.listElements[idCLick].querySelector('.mdc-list-item__primary-text').innerText = titleInput.value;
      })
    })
    .catch((err) => {
      alert('Lỗi: ' + err);
    });
})


document.querySelector('#btnNewPost').addEventListener('click', () => {
  dialogNewPost.open();
})

document.querySelector('#btnAddPost').addEventListener('click', () => {
  if (!newBlogTitle.value || !newBlogContent.value) {
    dialog.content_.innerText = "Không thể bỏ trống trường nào!";
    dialog.open();
    return;
  }
  dialogLoading.open();
  db.collection('blogs')
    .add({
      title: newBlogTitle.value,
      day: new Date(),
      content: newBlogContent.value
    })
    .then((blogadded) => {
      dialogLoading.close();
      // load lại danh sách
      db.collection('blogs')
        .orderBy("day", "desc")
        .get()
        .then((blogs) => {
          loadList(blogs);
        })
      dialog.content_.innerText = "Đã thêm bài đăng với id: " + blogadded.id;
      dialog.open();
      newBlogTitle.value = "";
      newBlogContent.value = "";
      dialogNewPost.close();
    })
    .catch(e => {
      dialog.content_.innerText = e;
      dialog.open();
    })
})

dialogConfirmDelete.listen('MDCDialog:closing', (e) => {
  selectionConfirm = e.detail.action;
  if (selectionConfirm !== 'accept') {
    return;
  }
  dialogLoading.open();
  db.collection('blogs')
    .doc(getBlogs[idCLick].id)
    .delete()
    .then(() => {
      dialogLoading.close();
      dialog.content_.innerText = "Đã xoá thành công bài đăng!";
      dialog.open();
      // load lại danh sách
      db.collection('blogs')
        .orderBy("day", "desc")
        .get()
        .then((blogs) => {
          loadList(blogs);
        })
    })
    .catch(e => {
      dialog.content_.innerText = e;
      dialog.open();
    })
})

document.querySelector('#btnDelete').addEventListener('click', () => {
  dialogConfirmDelete.open();
})

//#endregion