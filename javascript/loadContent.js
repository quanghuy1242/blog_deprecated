const db = firebase.firestore();

const blogContent = document.querySelector('#content-blog');
const listTitleContent = document.querySelector('#cs-list-summary');

function appendBlog(blog, id, modifyContentBlog, blogMainContent) {
  let mdcCard = document.createElement('div');
  mdcCard.className = "mdc-card cs-card";

  let mdcCardInner = document.createElement('div');
  mdcCardInner.className = "mdc-card__primary-action mdc-ripple-surface--accent";

  let cardHeader = document.createElement('div');
  cardHeader.className = "cs-card-header";

  let cardTitle = document.createElement('h2');
  let cardTitletext = document.createTextNode(blog.title);
  cardTitle.className = "cs-card__title mdc-typography--headline5";
  cardTitle.appendChild(cardTitletext);

  let cardSubTitle = document.createElement('h3');
  let cardSubTitletext = document.createTextNode(blog.day);
  cardSubTitle.className = "cs-card__subtitle mdc-typography--subtitle2";
  cardSubTitle.appendChild(cardSubTitletext);

  cardHeader.append(cardTitle, cardSubTitle);

  let cardContent = document.createElement('div');
  cardContent.className = "cs-card__content mdc-card__actions mdc-typography--body2";
  cardContent.innerHTML = modifyContentBlog;

  mdcCardInner.appendChild(cardHeader);
  mdcCard.append(mdcCardInner, cardContent);

  let offsetDiv = document.createElement('div');
  offsetDiv.style.height = '64px';
  offsetDiv.style.marginTop = '-64px';
  offsetDiv.setAttribute("id", id);
  offsetDiv.className = "cs-card-content";

  blogMainContent.append(offsetDiv, mdcCard);
}

function appendListTitle(title, id, listTitleMainContent) {
  let mdcListItem = document.createElement('a');
  mdcListItem.setAttribute("href", "#" + id);
  mdcListItem.className = "mdc-list-item mdc-button";
  mdcListItem.setAttribute("tabindex", 0);

  let mdcListItemContent = document.createElement('span');
  let mdcListItemContentText = document.createTextNode(title);
  mdcListItemContent.className = "mdc-list-item__text";
  mdcListItemContent.appendChild(mdcListItemContentText);

  mdcListItem.appendChild(mdcListItemContent);

  listTitleMainContent.appendChild(mdcListItem);
}

//#region scroll
function scrollPy () {
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
};
//#endregion

db.collection('blogs')
  .get()
  .then((blogs) => {
    blogs.forEach((blog) => {
      let modifyContentBlog = blog.data().content.replace(/\n/g, "<div class='cs-ngat-dong'></div>");
      appendBlog(blog.data(), blog.id, modifyContentBlog, blogContent);
      appendListTitle(blog.data().title, blog.id, listTitleContent);
    }); 
    document.querySelector('.mdc-list a').classList.add('mdc-list-item__actived'); // active cái đầu tiên
    // Ripple
    document.querySelectorAll('.mdc-card__primary-action').forEach(element => {
      mdc.ripple.MDCRipple.attachTo(element);
    })
  })
  .then(() => {
    // Ẩn cái thanh loader
    document.querySelector('.mdc-linear-progress').style.display = "none";
    scrollPy();
  });