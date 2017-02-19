var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

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
    var toDoItem = _.findWhere(todos, {id: todoID});

    if (toDoItem) {
       res.json(toDoItem);
    }   else {
       res.status('404').send();
    }
});

// POST /todos
app.post('/todos', function (req, res) {
    var body = _.pick(req.body, 'description', 'completed');
    
    body.description = body.description.trim();
    
    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.length === 0) {
        return res.status(400).send();
    }
    
    body.id = todoNextId++;
    
    todos.push(body);
    
    res.json(body);
});

app.get('/', function (req, res) {
   res.send('Todo API Root'); 
});

// DELETE /todos:id 
app.delete('/todos/:id', function (req,res) {
    var todoID = parseInt(req.params.id);
    var toDoItem = _.findWhere(todos, {id: todoID});
    if (toDoItem) {
        todos = _.without(todos, toDoItem);
        res.json(toDoItem);
    } else {
        res.status(404).json({"error": "no todo found with that id"});
    }
});

// Put /todos/:id

app.put('/todos/:id', function (req, res) {
    var todoID = parseInt(req.params.id);
    var toDoItem = _.findWhere(todos, {id: todoID});
    var body = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};
    
    if (!toDoItem) {
        return res.status(404).send();
    }

    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    }   else if (body.hasOwnProperty('completed')){
            return res.status(400).send();
    };
    
    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
            return res.status(400).send();
    }
    
    _.extend(toDoItem, validAttributes);
    res.json(toDoItem);
    
})

app.listen(PORT, function () {
   console.log('Express listening on  port:' + PORT); 
});