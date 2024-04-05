const Pool= require("pg").Pool

const pool=new Pool({
    user:'postgres',
    password:'password',
    host: 'localhost', // Assuming PostgreSQL is running on the local machine
    database:'portfolio'
})

module.exports=pool;