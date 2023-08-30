var express = require('express');
var router = express.Router();
const { Pool } = require('pg')

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'example',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})
// interface User {
  
// }

/* GET users listing. */
router.get('/', function (req, resp, next) {
  let user;
  pool
    .query('select bank_name,balance,bank_account_name,name,gender from wallets as wt left join banks as b on wt.bank_id = b.bank_id left join users as ut on wt.user_id = ut.user_id')
    .then((res) => {
      console.log(res.rows[0])
      user = res.rows[0];
      resp.send(user);
    })
    .catch((err) => console.error('Error executing query', err.stack))
});

// Create user 
router.post('/create', function (req, resp, next) {
  let data = req.body; //payload 
  // const reqDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
  const reqDate = new Date().toISOString()
  const status = "1"
  data.reg_date = reqDate
  data.status_no = status
  console.log(data, reqDate, status)
  const query = `insert into users (name,birth_date,gender,reg_date,pid,status_no,phone_number,user_type_no)
   values ($1,$2,$3,$4,$5,$6,$7,$8)`
  const values = [data.name, data.birth_date, data.gender, data.reg_date, data.pid, data.status_no, data.phone_number, data.user_type_no]
  try {
    pool
      .query(query, values)
      .then((res) => {
        resp.send({
          message: "Success",
          status: 200
        }); // case1
      })
      .catch((err) => {
        console.error('Error executing query', err.stack)
        resp.status(500).send({
          message: "Database Error",
          status: 500
        })
      })


  } catch (error) {
    console.log(error)
    resp.status(500).send({
      message: error.message,
      status: 500
    })

  }
}
)


module.exports = router;
