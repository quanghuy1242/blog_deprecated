let email = document.querySelector('#email');
let password = document.querySelector('#pass');
document.querySelector('#aaaa').addEventListener('click', () => {
  document.querySelector('.mdc-linear-progress').style.opacity = "1";
  firebase.auth().signInWithEmailAndPassword(email.value, password.value).catch(function (error) {
    // Handle Errors here.
    document.querySelector('.mdc-linear-progress').style.opacity = "0";
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode, errorMessage);
    document.querySelector('.invalid-text').innerHTML = errorMessage;
  });
  let user = firebase.auth().currentUser;
  if (user) {
    console.log('Đã đăng nhập');
    window.location.replace('./admin/admin.html');
  } else {
    // No user is signed in.
  }
})