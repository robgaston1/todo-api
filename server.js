var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;
app.use(bodyParser.json());
app.get('/', function(req, res) {
    res.send('Todo API Root');
});
//  GET request /todos
app.get('/todos', function(req, res) {
    var query = req.query;
    var where = {};
    if (query.hasOwnProperty('completed') && query.completed === 'true') {
        where.completed = true;
    } else if (query.hasOwnProperty('completed') && query.completed === 'false') {
        where.completed = false;
    }
    if (query.hasOwnProperty('q') && _.isString(query.q) && query.q.trim().length > 0) {
        where.description = {
            $like: '%' + query.q + '%'
        };
    }

    db.todo.findAll({where: where}).then(function (todos) {
        res.json(todos);
    }, function() {
        res.status(500).send();
    });


    // var filteredTodos = todos;
    // if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
    //     filteredTodos = _.where(filteredTodos, {
    //         completed: true
    //     });
    // } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
    //     console.log('else if statement');
    //     filteredTodos = _.where(filteredTodos, {
    //         completed: false
    //     });
    // }
    // if (queryParams.hasOwnProperty('q') && _.isString(queryParams.q) && queryParams.q.trim().length > 0) {
    //     filteredTodos = _.filter(filteredTodos, function(item) {
    //         return (item.description.toLocaleLowerCase().indexOf(queryParams.q.toLowerCase()) > -1);
    //     });
    // }
    // res.json(filteredTodos);
});
//  GET /todos/:id (of a specific todo)
app.get('/todos/:id', function(req, res) {
    var todoID = parseInt(req.params.id);
    db.todo.findById(todoID).then(function(todo) {
        if (!!todo) {
            res.json(todo.toJSON());
        } else {
            res.status(404).send();
        }
    }, function(e) {
        res.status(500).send();
    });
    //    var toDoItem = _.findWhere(todos, {
    //        id: todoID
    //    });
    //    if (toDoItem) {
    //        res.json(toDoItem);
    //    }
    //    else {
    //        res.status('404').send();
    //    }
});
// POST /todos
app.post('/todos', function(req, res) {
    var body = _.pick(req.body, 'description', 'completed');
    body.description = body.description.trim();
    db.todo.create(body).then(function(todo) {
        res.json(todo.toJSON());
    }, function(e) {
        res.status(400).json(e);
    });
});
// DELETE /todos:id 
app.delete('/todos/:id', function(req, res) {
    var todoID = parseInt(req.params.id);
    var toDoItem = _.findWhere(todos, {
        id: todoID
    });
    if (toDoItem) {
        todos = _.without(todos, toDoItem);
        res.json(toDoItem);
    } else {
        res.status(404).json({
            "error": "no todo found with that id"
        });
    }
});
// Put /todos/:id
app.put('/todos/:id', function(req, res) {
    var todoID = parseInt(req.params.id);
    var toDoItem = _.findWhere(todos, {
        id: todoID
    });
    var body = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};
    if (!toDoItem) {
        return res.status(404).send();
    }
    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
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
db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
        console.log('Express listening on  port:' + PORT);
    });
});