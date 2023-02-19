const express = require('express')
const names = require('random-names-generator');
const mysql = require('mysql')
const app = express()
const port = 3000
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};

const queryExecute = async query => {
    const connection = mysql.createConnection(config)

    const result = new Promise((resolve, reject) => {
        connection.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    })

    connection.end()

    return await result
}

app.get('/', async (req, res) => {
    const randomName = names.random();

    const getNames = async queryResult => {
        const result = await queryResult
        if (result) {
            return result.map(e => `<li>${e.name}</li>`).join('')
        }
    }

    const databaseInit = async () => {
        const sqlCreate = `CREATE TABLE IF NOT EXISTS people(id int NOT NULL AUTO_INCREMENT, name varchar(255) NOT NULL, PRIMARY KEY(id))`;
        const sqlInsert = `INSERT INTO people(name) values('${randomName}')`
        await queryExecute(sqlCreate)
        await queryExecute(sqlInsert)
    }

    const databaseGetNames = async () => {
        const sqlNamesQuery = `select name from people`
        const result = await queryExecute(sqlNamesQuery)
        return await getNames(result)
    }

    await databaseInit()
    
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

app.listen(port, () => {
    console.log('Rodando na porta ' + port)
})
