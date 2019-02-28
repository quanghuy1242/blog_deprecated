const blogContent = document.querySelector('#content-blog');
const listTitleContent = document.querySelector('#cs-list-summary');

function appendBlog(blog, blogMainContent) {
    let mdcCard = document.createElement('div');
    mdcCard.className = "mdc-card cs-card";
    mdcCard.setAttribute("id", blog.id)

    let mdcCardInner = document.createElement('div');
    mdcCardInner.className = "mdc-card__primary-action mdc-ripple-surface--accent";

    let cardHeader = document.createElement('div');
    cardHeader.className = "cs-card-header";

    let cardTitle = document.createElement('h2');
    let cardTitleText = document.createTextNode(blog.title);
    cardTitle.className = "cs-card__title mdc-typography--headline5";
    cardTitle.appendChild(cardTitleText);

    let cardSubTitle = document.createElement('h3');
    let cardSubTitleText = document.createTextNode(blog.day);
    cardSubTitle.className = "cs-card__subtitle mdc-typography--subtitle2";
    cardSubTitle.appendChild(cardSubTitleText);

    cardHeader.append(cardTitle, cardSubTitle);

    let cardContent = document.createElement('div');
    cardContent.className = "cs-card__content mdc-card__actions mdc-typography--body2";
    cardContent.innerHTML = blog.content;

    mdcCardInner.appendChild(cardHeader);
    mdcCard.append(mdcCardInner, cardContent);

    blogMainContent.append(mdcCard);
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

blogs.forEach(function (blog) {
    let modifyContentBlog = blog.content.replace(/\n/g, "<div class='cs-ngat-dong'></div>");
    blog.content = modifyContentBlog;
    appendBlog(blog, blogContent);
    appendListTitle(blog.title, blog.id, listTitleContent);
});