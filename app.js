const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const cors = require("cors"); // Di chuyển require cors đến đây

const app = express();
const port = 3000;

// Kết nối đến SQL Server
const config = {
  user: "sa",
  password: "quoctb@123",
  server: "149.28.157.26",
  database: "CHATBOT",
  options: {
    encrypt: false,
  },
};

app.use(bodyParser.json());
app.use(cors());
// Route để thêm mới dữ liệu
app.post("/addData", (req, res) => {
  const { CMD, Description, Response } = req.body;

  sql.connect(config, (err) => {
    if (err) {
      console.error("Error connecting to SQL Server:", err);
      res.status(500).json({ status: false, message: "Internal Server Error" });
    } else {
      const request = new sql.Request();

      const query = `INSERT INTO CommandList VALUES ('${CMD}',N'${Description}',N'${Response}')`;

      request.query(query, (err, result) => {
        if (err) {
          console.error("Error executing query:", err);
          res
            .status(500)
            .json({ status: false, message: "Internal Server Error" });
        } else {
          res
            .status(200)
            .json({ status: true, message: "Data added successfully" });
        }

        sql.close();
      });
    }
  });
});
//Lấy dữ liệu
app.get('/getData', (req, res) => {
  sql.connect(config, (err) => {
    if (err) {
      console.error('Database connection error:', err);
      res.status(500).json({ status: false, message: 'Internal Server Error' });
    } else {
      const request = new sql.Request();
      request.query('SELECT * FROM CommandList', (err, result) => {
        if (err) {
          console.error('Query error:', err);
          res.status(500).json({ status: false, message: 'Internal Server Error' });
        } else {
          // Trả về dữ liệu dưới dạng JSON nếu query thành công
          res.json(result.recordset);
        }

        // Đóng kết nối đến cơ sở dữ liệu sau khi truy vấn
        sql.close();
      });
    }
  });
});

// Khởi động máy chủ
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
