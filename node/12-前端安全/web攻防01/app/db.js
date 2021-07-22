const mysql = require('mysql')
const pool = mysql.createPool({
    host: '192.168.2.100',
    user: 'root',
    password: '123',
    database: 'web-securty'
})

module.exports = function (sql, values) {
    // 返回一个 Promise
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    // 结束会话
                    connection.release()
                })
            }
        })
    })
}
