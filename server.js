const express = require('express');
const store = require('./store-service');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;
const path = require('path');

app.use(express.static('public')); 

app.get('/', (req, res) => {
    res.redirect('/about');
  });

app.get('/about', (req, res) => {
res.sendFile(path.join(__dirname, 'views/about.html'));
});

app.get('/shop', (req, res) => {
  // res.send('This is shopping');
  store.getPublishedItems()
  .then(publishedItems => {
    res.json(publishedItems);
  })
  .catch(err => {
    res.status(500).json({message: err});
  });
});

app.get('/items', (req, res) => {
  // res.send('This is items');
  store.getAllItems()
  .then(items => {
    res.json(items);
  })
  .catch(err => {
    res.status(500).json({ message: err }); 
  });
});

app.get('/categories', (req, res) => {
  // res.send('This is categories');
  store.getCategories()
  .then(categories => {
    res.json(categories);
  })
  .catch(err => {
    res.status(500).json({message: err});
  });
});

app.get('*', (req, res) => {
  res.status(404).send('PAGE NOT FOUND');
});


store.initialize()
.then(() => { 
  // start the server on the port and output a confirmation to the console
  app.listen(HTTP_PORT, () => console.log(`Express http server listening on ${HTTP_PORT}`));
})
.catch(()=>{ 
  console.log('Failed to load resources :(')
});