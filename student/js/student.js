

const students = [
  { name: "Ana", scores: [85, 90, 88], present: true },
  { name: "Ben", scores: [70, 75, 72], present: false },
  { name: "Cara", scores: [95, 92, 94], present: true },
  { name: "Daniel", scores: [60, 65, 70], present: true },
  { name: "Ella", scores: [88, 85, 90], present: true },
  { name: "Felix", scores: [78, 80, 82], present: false },
  { name: "Grace", scores: [92, 89, 94], present: true },
  { name: "Hannah", scores: [73, 70, 68], present: false },
  { name: "Ivan", scores: [81, 84, 79], present: true },
  { name: "Julia", scores: [96, 98, 97], present: true }
];

// Helper: compute average and remarks. Fails if any individual score < 75 or average < 75
function getStudentStatus(student) {
    const average = student.scores.reduce((sum, score) => sum + score, 0) / student.scores.length;
    const hasLowScore = student.scores.some(score => score < 75);
    const remarks = (hasLowScore || average < 75) ? "Failed" : "Passed";
    return { average, remarks };
}

function searchStudent() {
    const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
    const searchResult = document.getElementById('searchResult');
    
    if (searchInput === "") {
        searchResult.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #999;">Please enter a student name to search.</td></tr>';
        return;
    }
    
    const student = students.find(s => s.name.toLowerCase() === searchInput);
    
    if (!student) {
        searchResult.innerHTML = '<tr><td colspan="7" style="text-align: center; color: red;">No student found with the name "' + searchInput + '"</td></tr>';
        return;
    }
    
    const { average, remarks } = getStudentStatus(student);
    
    // Determine attendance status
    const attendanceStatus = student.present ? "Present" : "Absent";
    
    // Create table row with student data
    let tableRow = '<tr>';
    tableRow += '<td>' + student.name + '</td>';
    tableRow += '<td>' + student.scores[0] + '</td>';
    tableRow += '<td>' + student.scores[1] + '</td>';
    tableRow += '<td>' + student.scores[2] + '</td>';
    tableRow += '<td>' + average.toFixed(2) + '</td>';
    tableRow += '<td style="background-color: ' + (remarks === "Failed" ? "#ffcccc" : "#ccffcc") + ';">' + remarks + '</td>';
    tableRow += '<td>' + attendanceStatus + '</td>';
    tableRow += '</tr>';
    
    searchResult.innerHTML = tableRow;
}

function showPresent() {
    const searchResult = document.getElementById('searchResult');
    const presentStudents = students.filter(s => s.present);
    
    if (presentStudents.length === 0) {
        searchResult.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #999;">No present students.</td></tr>';
        return;
    }
    
    let tableRows = '';
    presentStudents.forEach(student => {
        const { average, remarks } = getStudentStatus(student);
        tableRows += '<tr>';
        tableRows += '<td>' + student.name + '</td>';
        tableRows += '<td>' + student.scores[0] + '</td>';
        tableRows += '<td>' + student.scores[1] + '</td>';
        tableRows += '<td>' + student.scores[2] + '</td>';
        tableRows += '<td>' + average.toFixed(2) + '</td>';
        tableRows += '<td style="background-color: ' + (remarks === "Failed" ? "#ffcccc" : "#ccffcc") + ';">' + remarks + '</td>';
        tableRows += '<td>Present</td>';
        tableRows += '</tr>';
    });
    
    searchResult.innerHTML = tableRows;
}

function showAbsent() {
    const searchResult = document.getElementById('searchResult');
    const absentStudents = students.filter(s => !s.present);
    
    if (absentStudents.length === 0) {
        searchResult.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #999;">No absent students.</td></tr>';
        return;
    }
    
    let tableRows = '';
    absentStudents.forEach(student => {
        const { average, remarks } = getStudentStatus(student);
        tableRows += '<tr>';
        tableRows += '<td>' + student.name + '</td>';
        tableRows += '<td>' + student.scores[0] + '</td>';
        tableRows += '<td>' + student.scores[1] + '</td>';
        tableRows += '<td>' + student.scores[2] + '</td>';
        tableRows += '<td>' + average.toFixed(2) + '</td>';
        tableRows += '<td style="background-color: ' + (remarks === "Failed" ? "#ffcccc" : "#ccffcc") + ';">' + remarks + '</td>';
        tableRows += '<td>Absent</td>';
        tableRows += '</tr>';
    });
    
    searchResult.innerHTML = tableRows;
}

function showPassed() {
    const searchResult = document.getElementById('searchResult');
    const passedStudents = students.filter(student => {
        const { remarks } = getStudentStatus(student);
        return remarks === "Passed";
    });
    
    if (passedStudents.length === 0) {
        searchResult.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #999;">No passed students.</td></tr>';
        return;
    }
    
    let tableRows = '';
    passedStudents.forEach(student => {
        const { average } = getStudentStatus(student);
        const attendanceStatus = student.present ? "Present" : "Absent";
        tableRows += '<tr>';
        tableRows += '<td>' + student.name + '</td>';
        tableRows += '<td>' + student.scores[0] + '</td>';
        tableRows += '<td>' + student.scores[1] + '</td>';
        tableRows += '<td>' + student.scores[2] + '</td>';
        tableRows += '<td>' + average.toFixed(2) + '</td>';
        tableRows += '<td style="background-color: #ccffcc;">Passed</td>';
        tableRows += '<td>' + attendanceStatus + '</td>';
        tableRows += '</tr>';
    });
    
    searchResult.innerHTML = tableRows;
}

function showFailed() {
    const searchResult = document.getElementById('searchResult');
    const failedStudents = students.filter(student => {
        const { remarks } = getStudentStatus(student);
        return remarks === "Failed";
    });
    
    if (failedStudents.length === 0) {
        searchResult.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #999;">No failed students.</td></tr>';
        return;
    }
    
    let tableRows = '';
    failedStudents.forEach(student => {
        const { average } = getStudentStatus(student);
        const attendanceStatus = student.present ? "Present" : "Absent";
        tableRows += '<tr>';
        tableRows += '<td>' + student.name + '</td>';
        tableRows += '<td>' + student.scores[0] + '</td>';
        tableRows += '<td>' + student.scores[1] + '</td>';
        tableRows += '<td>' + student.scores[2] + '</td>';
        tableRows += '<td>' + average.toFixed(2) + '</td>';
        tableRows += '<td style="background-color: #ffcccc;">Failed</td>';
        tableRows += '<td>' + attendanceStatus + '</td>';
        tableRows += '</tr>';
    });
    
    searchResult.innerHTML = tableRows;
}