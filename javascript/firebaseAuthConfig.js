let email = document.querySelector('#email');
let password = document.querySelector('#pass');
let disableDiv = document.querySelector('.disable-div');
document.querySelector('#aaaa').addEventListener('click', () => {
  document.querySelector('.mdc-linear-progress').style.opacity = "1";
  disableDiv.style.display = 'block';
  firebase.auth()
    .signInWithEmailAndPassword(email.value, password.value)
    .then(() => {
      let user = firebase.auth().currentUser;
      if (user) {
        console.log('Đã đăng nhập');
        window.location.replace('./admin/admin.html');
      } else {
        // No user is signed in.
      }
    })
    .catch(function (error) {
      // Handle Errors here.
      document.querySelector('.mdc-linear-progress').style.opacity = "0";
      disableDiv.style.display = 'none';
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
      document.querySelector('.invalid-text').innerHTML = errorMessage;
    });
})