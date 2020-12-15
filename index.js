const http = require('http')
const path = require('path')
const fs = require('fs')
let todoArray = []

const server = http.createServer((req,res) => {
    if (req.method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
        })

        if (req.url === '/') {
            fs.readFile(
                path.join(__dirname, 'views', 'index.html'),
                'utf-8',
                (err, content) => {
                    if (err) {
                        throw err
                    }
                    res.end(content)
                }
            )
        } else if (req.url === '/css/style.css') {
            res.writeHead(200, {
                'Content-Type': 'text/css; charset=utf-8'
            })

            fs.readFile(
                path.join(__dirname, 'views/css', 'style.css'),
                (err, content) => {
                    if (err) {
                        throw err
                    }
                    res.end(content)
                }
            )
        } else if (req.url === '/about') {
            fs.readFile(
                path.join(__dirname, 'views', 'about.html'),
                'utf-8',
                (err, content) => {
                    if (err) {
                        throw err
                    }
                    res.end(content)
                }
            )
        } else if (req.url === '/js/script.js') {
            res.writeHead(200, {
                'Content-Type': 'text/javascript; charset=utf-8'
            })
            
            fs.readFile(
                path.join(__dirname, 'views/js', 'script.js'),
                (err, content) => {
                    if (err) {
                        throw err
                    }
                    res.end(content)
                }
            ) 
        } else if (req.url === '/api/todos') {
            res.end(JSON.stringify({data: {success: true, todoArray}}))
        }
    } else if (req.method === 'POST') {
        res.writeHead(200, {
            'Content-Type': 'text/json; charset=utf-8'
        })

        if (req.url === '/api/todos') {
            let todoItem = null
            req.on('data', chunk => {
                const todoData = JSON.parse(chunk.toString())
                todoItem = {id: `${Date.now()}`, data: todoData.replaceAll('"', '')}
                todoArray.push(todoItem)
                res.end(JSON.stringify({data: {success: true, id: String(todoItem.id)}}))
            })
        }
    } else if (req.method === 'DELETE') {
        res.writeHead(200, {
            'Content-Type': 'text/json; charset=utf-8'
        })
        if (req.url === '/api/todos') {
            req.on('data', chunk => {
                const todoId = JSON.parse(chunk.toString()).replaceAll('"', '')
                todoArray = todoArray.filter(el => el.id !== todoId)
                res.end(JSON.stringify({data: {success: true}}))
            })
        }
    } else if (req.method === 'PUT') {
        res.writeHead(200, {
            'Content-Type': 'text/json; charset=utf-8'
        })
        if (req.url === '/api/todos') {
            req.on('data', chunk => {
                const todoItem = JSON.parse(JSON.parse(chunk))
                todoArray = todoArray.map(el =>  {
                    if (el.id === todoItem.id) {
                        return {id: el.id, data: todoItem.value}
                    }
                    return el
                })
                res.end(JSON.stringify({data: {success: true}}))
            })
        }
    }
})

server.listen(3000, (err)  => {
    if (err) {
        console.log(`Error: ${err}`)
    } else {
        console.log('Server listening at port 3000')
    }
})