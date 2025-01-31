// Purpose: Main entry point for the server. This file is responsible for setting up the server and connecting to the database.
const express = require('express'),
    path = require('path'),
    cors = require('cors'),
    routers = require('./server/routes/routes.js');
// Set up port number
const port = 3001;
// Initialize express
const app=express();
app.use('/list', express.static(path.join(__dirname, 'client/html/list.html')));
app.use('/add_project', express.static(path.join(__dirname, 'client/html/add_project_form.html')));

app.use('/js', express.static(path.join(__dirname, 'client/js')));
app.use('/css', express.static(path.join(__dirname, 'client/css')));


//restfull 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routers);
// Listen to port
const server = app.listen(port, () => {
    console.log('listening on port %s...', server.address().port);
});