const express = require('express')
const names = require('random-names-generator');
const mysql = require('mysql')
const app = express()
const port = 3000
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database:'nodedb'
};

const randomName = names.random();

const getNames = sqlSelectResult => {
    if(sqlSelectResult) {
        return sqlSelectResult.map(e => `<li>${e.name}</li>`).join('')
    }
}

const databaseInit = () => {
    const connection = mysql.createConnection(config)
    const sql_create = `CREATE TABLE IF NOT EXISTS people(id int NOT NULL AUTO_INCREMENT, name varchar(255) NOT NULL, PRIMARY KEY(id))`;
    const sql_insert = `INSERT INTO people(name) values('${randomName}')`

    connection.query(sql_create)
    connection.query(sql_insert)

    connection.end()
}

const databaseGetNames = async () => {
    const connection = mysql.createConnection(config)
    const sqlNamesQuery = `select name from people`
    
    const result = new Promise((resolve, reject) => {
        connection.query(sqlNamesQuery, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
    })
      
    connection.end()

    const resultList = await result
    return getNames(resultList)
}

databaseInit()

app.get('/', async (req,res) => {
    const namesListItems = await databaseGetNames()
    const html = 
        `
            <h1>Full Cycle</h1>
            <ul>
                ${namesListItems}
            </ul>
        `
    res.send(html)
})

app.listen(port, ()=> {
    console.log('Rodando na porta ' + port)
})
