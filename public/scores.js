function filterTable() {
    let input = document.getElementById('searchInput');
    let filter = input.value.toUpperCase();
    let table = document.getElementById('scoresTable');
    let rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) {
        let cells = rows[i].getElementsByTagName('td');
        let studentName = cells[0].textContent || cells[0].innerText;
        
        if (studentName.toUpperCase().indexOf(filter) > -1) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    fetch('/api/students/studentscores')
        .then(response => response.json())
        .then(data => {
            console.log(data.success)
            if(data.studentsData){
                const tableBody = document.querySelector("#scoresTable tbody");
            tableBody.innerHTML = '';

            console.log(data)
            data.studentsData.forEach(student => {
                const row = document.createElement('tr');
                row.classList.add((data.studentsData.indexOf(student) % 2 === 0) ? 'even' : 'odd');

                const nameCell = document.createElement('td');
                nameCell.textContent = student.name ;

                const emailCell = document.createElement('td');
                emailCell.textContent = student.email || 'N/A';

                const level1Cell = document.createElement('td');
                level1Cell.textContent = student.level1 !== null ? student.level1 : '0';

                const level2Cell = document.createElement('td');
                level2Cell.textContent = student.level2 !== null ? student.level2 : '0';

                const level3Cell = document.createElement('td');
                level3Cell.textContent = student.level3 !== null ? student.level3 : '0';

                const level4Cell = document.createElement('td');
                level4Cell.textContent = student.level4 !== null ? student.level4 : '0';

                row.appendChild(nameCell);
                row.appendChild(emailCell);
                row.appendChild(level1Cell);
                row.appendChild(level2Cell);
                row.appendChild(level3Cell);
                row.appendChild(level4Cell);

                tableBody.appendChild(row);
            });
            }
            
        })
        .catch(error => console.error('Error fetching student data:', error));
});

document.getElementById('downloadBtn').addEventListener('click', function () {
    let table = document.getElementById('scoresTable');
    let workbook = XLSX.utils.table_to_book(table, { sheet: "Scores" });
    XLSX.writeFile(workbook, 'StudentScores.xlsx');
});


