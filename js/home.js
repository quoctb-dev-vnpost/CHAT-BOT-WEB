function addData() {
    const CMD = document.getElementById('CMD').value;
    const Description = document.getElementById('Description').value;
    const Response = document.getElementById('Response').value;
    if (CMD.length != 0 && Description.length != 0 && Response.length != 0) {
      const data = { CMD, Description, Response };

      fetch('http://localhost:3000/addData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then(response => {
          console.log('Server Response:', response);

          if (!response.ok) {
            // If the response is not OK, try to parse it as text
            return response.text().then(text => { throw new Error(text); });
          }

          // Attempt to parse the response as JSON
          return response.json();
        })
        .then(result => {
          // Check if the result is a string (error message) or an object
          console.log(result.status ? 'Success:' : 'Error:', result);
          alert(result.status ? 'CAS hỗ trợ của bạn đã được thêm vào hệ thống' : 'Error: ' + result.message);
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Error: ' + error.message);
        });
    }
    else {
      alert("Nội dung các trường không được để trống!")
    }
  }
  

  document.addEventListener('DOMContentLoaded', () => {
    // Khi trang được tải, gọi hàm để lấy dữ liệu từ server và đổ vào bảng
    fetchDataAndPopulateTable();
  });

  function fetchDataAndPopulateTable() {
    fetch('http://localhost:3000/getData')
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text); });
        }
        return response.json();
      })
      .then(data => {
        // Gọi hàm để đổ dữ liệu vào bảng
        populateTable(data);
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error: ' + error.message);
      });
  }

  function populateTable(data) {
    const tableBody = document.getElementById('commandTableBody');

    // Xóa nội dung hiện tại của bảng
    tableBody.innerHTML = '';

    // Duyệt qua dữ liệu và thêm từng hàng vào bảng
    data.forEach(item => {
      const row = document.createElement('tr');
      
      const commandIDCell = document.createElement('td');
      commandIDCell.textContent = item.CommandID;
      row.appendChild(commandIDCell);

      const commandCell = document.createElement('td');
      commandCell.textContent = item.Command;
      row.appendChild(commandCell);

      const descriptionCell = document.createElement('td');
      descriptionCell.textContent = item.Description;
      row.appendChild(descriptionCell);

      const responseCell = document.createElement('td');
      responseCell.textContent = item.Response;
      row.appendChild(responseCell);

      tableBody.appendChild(row);
    });
  }


  // Thêm vào file home.js
function filterTable() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toUpperCase();
    const tableBody = document.getElementById('commandTableBody');
    const rows = tableBody.getElementsByTagName('tr');
  
    for (let i = 0; i < rows.length; i++) {
      const td = rows[i].getElementsByTagName('td')[1]; // Chỉ lọc theo cột Description, bạn có thể thay đổi số này tùy theo cột bạn muốn lọc
      if (td) {
        const textValue = td.textContent || td.innerText;
        if (textValue.toUpperCase().indexOf(filter) > -1) {
          rows[i].style.display = '';
        } else {
          rows[i].style.display = 'none';
        }
      }
    }
  
    // Auto scroll
    tableBody.scrollTop = 0;
  }
  