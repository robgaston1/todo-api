var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

//  GET request /todos
app.get('/todos', function (req, res) {
   res.json(todos); 
});

//  GET /todos/:id (of a specific todo)
app.get('/todos/:id', function (req, res) {
    var todoID = parseInt(req.params.id);
    var toDoItem;
    todos.forEach(function (item) {
        if (item.id === todoID) {
            toDoItem = item;
        }
    });

    if (toDoItem) {
       res.json(toDoItem);
    }   else {
       res.status('404').send();
    }
});

// POST /todos
app.post('/todos', function (req, res) {
    var body = req.body;
    body.id = todoNextId++;
    todos.push(body);
    
    res.json(body);
});

app.get('/', function (req, res) {
   res.send('Todo API Root'); 
});

app.listen(PORT, function () {
   console.log('Express listening on  port:' + PORT); 
});