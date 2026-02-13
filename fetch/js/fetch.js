async function getData() {
    const response = await fetch(
        'http://localhost/api/student-list.php'
    );
    const data = await response.json();
    console.log(data);
}

async function getStudentList() {
    try {
        const response = await fetch(
            'http://localhost/api/student-list.php'
        );
        const data = await response.json();
        console.log('Student list data:', data);
        
        if (data.success) {
            displayStudentTable(data.data || data.students || data);
        } else {
            const tableContainer = document.getElementById('student-table-container');
            tableContainer.innerHTML = '<p>Error: ' + (data.message || 'Failed to load student list') + '</p>';
            tableContainer.style.display = 'block';
        }
    } catch (error) {
        console.error('Error fetching student list:', error);
        const tableContainer = document.getElementById('student-table-container');
        tableContainer.innerHTML = '<p>Error: ' + error.message + '</p>';
        tableContainer.style.display = 'block';
    }
}

function displayStudentTable(students) {
    const tableContainer = document.getElementById('student-table-container');
    console.log('Displaying students:', students);
    
    if (!Array.isArray(students) || students.length === 0) {
        tableContainer.innerHTML = '<p>No students found</p>';
        tableContainer.style.display = 'block';
        return;
    }
    
    let tableHTML = '<table class="student-table"><thead><tr>';
    
    // Get table headers from first student object
    const headers = Object.keys(students[0]);
    headers.forEach(header => {
        tableHTML += `<th>${header.charAt(0).toUpperCase() + header.slice(1)}</th>`;
    });
    
    tableHTML += '</tr></thead><tbody>';
    
    // Add table rows
    students.forEach(student => {
        tableHTML += '<tr>';
        headers.forEach(header => {
            tableHTML += `<td>${student[header]}</td>`;
        });
        tableHTML += '</tr>';
    });
    
    tableHTML += '</tbody></table>';
    tableContainer.innerHTML = tableHTML;
    tableContainer.style.display = 'block';
    console.log('Table displayed successfully');
}

async function submitData(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!username || !password) {
        const messageEl = document.getElementById('message');
        messageEl.textContent = 'Please enter both username and password';
        messageEl.className = 'message show error';
        return;
    }
    
    const data = {
        username: username,
        password: password
    }
    
    console.log('Sending login data:', data);
    
    const response = 
        await fetch(
            'http://localhost/api/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const resData = await response.json();
        console.log('Login response:', resData);
        
        const messageEl = document.getElementById('message');
        if (resData.success) {
            messageEl.textContent = 'Login Successful! Welcome ' + (resData.user.username || '');
            messageEl.className = 'message show success';
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            
            // Hide login form and show only table
            document.querySelector('.login-container h1').style.display = 'none';
            document.querySelector('.login-container form').style.display = 'none';
            document.querySelector('.login-container').classList.add('show-table');
            
            getStudentList();
        } else {
            messageEl.textContent = 'Login Failed: ' + (resData.message || 'Invalid credentials');
            messageEl.className = 'message show error';
            console.log('Full server response:', resData);
        }
}