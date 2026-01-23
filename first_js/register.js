
function register() {
   const username = document.getElementById('username').value;
   const password = document.getElementById('password').value;
   const confirm = document.getElementById('confirm').value;
   const error = document.getElementById('error');
   
   if (username.length === 0 || password.length === 0 || confirm.length === 0) {
    error.innerHTML = "Username,Password and Confirmation is required";
    error.style.visibility = "visible";
   }
   if (username !== 'admin' && password && confirm === 'password') {
    error.innerHTML = 'username is not correct';
    error.style.visibility = "visible";
   }
   if (username === 'admin' && password && confirm !== 'password') {
    error.innerHTML = 'pasword mismatch';
    error.style.visibility = "visible";
   }
   if (username !== 'admin' && password && confirm !== 'password') {
    error.innerHTML = 'username and password incorrect';
    error.style.visibility = "visible";
   }
    if ((username === 'admin') && (password === 'password') && (confirm==='password')) {
    error.innerHTML = "Login successfully";
    error.style.visibility = "visible";
    error.style.backgroundcolor = "green";
    error.style.border = "2px yellow-green solid";
    }
   
}
