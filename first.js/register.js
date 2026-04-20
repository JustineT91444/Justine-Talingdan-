
function register() {
   const username = document.getElementById('username').value;
   const password = document.getElementById('password').value;
   const confirm = document.getElementById('confirm').value;

   if (username.length === 0 || password.length === 0 || confirm.length === 0) {
    alert("Username,Password and Confirmation is required")
   }
   if (username !== 'admin' && password && confirm === 'password') {
    alert('username is not correct')
   }
   if (username === 'admin' && password && confirm !== 'password') {
            alert('password mismatch')
   }
   if (username !== 'admin' && password && confirm !== 'password') {
    alert('username and password incorrect')
   }
    if ((username === 'admin') && (password === 'password') && (confirm==='password')) {
    alert('Login successful');
    }
   
}