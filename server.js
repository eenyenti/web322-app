// const express = require('express');
// const path = require('path');
// const store = require('./store-service');
// const app = express();

// const HTTP_PORT = process.env.PORT || 8080;

// app.set('views', __dirname + '/views')
// app.use(express.static(__dirname + '/public'))

// app.get('/', (req, res) => {
//     res.redirect('/about');
//   });

// app.get('/about', (req, res) => {
// res.sendFile(path.join(__dirname, 'views/about.html'));
// });

// app.get('/shop', (req, res) => {
//   // res.send('This is shopping');
//   store.getPublishedItems()
//   .then(publishedItems => {
//     res.json(publishedItems);
//   })
//   .catch(err => {
//     res.status(500).json({message: err});
//   });
// });

// app.get('/items', (req, res) => {
//   // res.send('This is items');
//   store.getAllItems()
//   .then(items => {
//     res.json(items);
//   })
//   .catch(err => {
//     res.status(500).json({ message: err }); 
//   });
// });

// app.get('/categories', (req, res) => {
//   // res.send('This is categories');
//   store.getCategories()
//   .then(categories => {
//     res.json(categories);
//   })
//   .catch(err => {
//     res.status(500).json({message: err});
//   });
// });

// app.get('*', (req, res) => {
//   res.status(404).send('PAGE NOT FOUND');
// });


// store.initialize()
// .then(() => { 
//   // start the server on the port and output a confirmation to the console
//   app.listen(HTTP_PORT, () => console.log(`Express http server listening on ${HTTP_PORT}`));
// })
// .catch(()=>{ 
//   console.log('Failed to load resources :(');
// });
const express = require('express'); 
const path = require('path'); 
const storeService = require('./store-service'); 

const app = express();
const HTTP_PORT = process.env.PORT || 8080; 



app.set('views', __dirname + '/views')
 
app.use(express.static(__dirname + '/public'))


app.get('/', (req, res) => {
    res.redirect('/about');
});

// Serve the about.html file
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/about.html'));
});

// Route for "/shop" (published items)
app.get('/shop', (req, res) => {
    storeService.getPublishedItems()
        .then(publishedItems => {
            res.json(publishedItems); 
        })
        .catch(err => {
            res.status(500).json({ message: err });
        });
});

// Route for "/items" (all items)
app.get('/items', (req, res) => {
    storeService.getAllItems()
        .then(items => {
            res.json(items); 
        })
        .catch(err => {
            res.status(500).json({ message: err }); 
        });
});

// Route for "/categories" (all categories)
app.get('/categories', (req, res) => {
    storeService.getCategories()
        .then(categories => {
            res.json(categories); 
        })
        .catch(err => {
            res.status(500).json({ message: err }); 
        });
});

// Handle unrecognized routes (404)
app.get('*', (req, res) => {
    res.status(404).send('Page Not Found');
});

// Initialize data and start the server only if initialization succeeds
storeService.initialize()
    .then(() => {
        
        console.log('Initialization successful. Starting server...');
        app.listen(HTTP_PORT, () => {
            console.log(`Express http server listening on port ${HTTP_PORT}`); 
        });
    })
    .catch(err => {
        // If initialization fails, log the error 
        console.error("Initialization failed:", err);
    });
