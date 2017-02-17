var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
        id: 1,
        description: 'Meet mom for lunch',
        completed: false
}, {
    id: 2,
    description: 'Go to market',
    complete: false
}, {
    id: 3,
    description: 'Get oil changed',
    complete: true
}];

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
    
//    res.send('Asking for todo with if of ' + req.params.id); 
});

app.get('/', function (req, res) {
   res.send('Todo API Root'); 
});

app.listen(PORT, function () {
   console.log('Express listening on  port:' + PORT); 
});