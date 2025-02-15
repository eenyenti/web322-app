const express = require('express'); // "require" the Express module
const app = express(); // obtain the "app" object

const HTTP_PORT = process.env.PORT || 8080; // assign a port
const path = require('path');

app.use(express.static('public')); 

app.get('/', (req, res) => {
    res.redirect('/about');
  });

app.get('/about', (req, res) => {
res.sendFile(path.join(__dirname, 'views/about.html'));
});

// start the server on the port and output a confirmation to the console
app.listen(HTTP_PORT, () => console.log(`Express http server listening on ${HTTP_PORT}`));