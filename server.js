/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Elthan Nyenti       Student ID: 118460237       Date: 15 March 2025
*
*  Vercel Web App URL: web322-app-rho.vercel.app
* 
*  GitHub Repository URL: https://github.com/eenyenti/web322-app
*
********************************************************************************/ 

const express = require('express');
const path = require('path');
const store = require('./store-service');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

/********************************************************************************/

// Paths and directories

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.redirect('/about');
});

  // app.get('/about', (req, res) => {
  //   res.sendFile(path.join(__dirname, 'views/about.html'));
  // });
  app.get('/about', (req, res) => {
    res.render('about');
  });
    
  // app.get('/items/add', (req, res) => {
  //   res.sendFile(path.join(__dirname, 'views/addItem.html'));
  // });
  app.get('/items/add', (req, res) => {
    res.render('addItem');
  });

app.use((req, res, next) => {
  res.locals.activeRoute = req.originalUrl;
  next();
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
  let { category, minDate } = req.query;

  let message = "No items found.";

  if (category) {
    
    category = parseInt(category, 10);
    if (![1, 2, 3, 4, 5].includes(category)) {
      return res.status(400).json({ message: "Invalid category value. Must be between 1 and 5." });
    }

    // store.getItemsByCategory(category)
    //   .then(items => res.json(items))
    //   .catch(err => res.status(500).json({ message: err }));
    store.getItemsByCategory(category)
      .then(items => {
        if (items.length === 0) {
          return res.render('items', { items, message });
        }
        res.render('items', { items });
      })
      .catch(err => res.status(500).json({ message: err }));
  }
  else if (minDate) {
    // Ensures minDate is a valid format
    if (isNaN(new Date(minDate).getTime())) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD." });
    }

    // store.getItemsByMinDate(minDate)
    //   .then(items => res.json(items))
    //   .catch(err => res.status(500).json({ message: err }));
    store.getItemsByMinDate(minDate)
      .then(items => {
        if (items.length === 0) {
          return res.render('items', { items, message });
        }
        res.render('items', { items });
      })
      .catch(err => res.status(500).json({ message: err }));
  }
  else {
    // Returns all items if no filters
    // store.getAllItems()
    //   .then(items => res.json(items))
    //   .catch(err => res.status(500).json({ message: err }));
    store.getAllItems()
      .then(items => {
        if (items.length === 0) {
          return res.render('items', { items, message });
        }
        res.render('items', { items });
      })
      .catch(err => res.status(500).json({ message: err }));
  }
});

// Update this to render
app.get('/item/:id', (req, res) => {
  const { id } = req.params;

  store.getItemById(id)
    .then(item => res.json(item))
    .catch(err => res.status(404).json({ message: `Item with id ${id} not found` }));
});

// Category names not displaying
app.get('/categories', (req, res) => {
  // res.send('This is categories');
  store.getCategories()
  .then(categories => {
    res./*json(categories);*/render('categories', {categories});
  })
  .catch(err => {
    res.status(500).json({message: err});
  });
});

app.get('*', (req, res) => {
  res.status(404).send('PAGE NOT FOUND');
});

/********************************************************************************/

// Adding multer, cloudinary and streamifier

const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

const upload = multer(); // no { storage: storage } 

cloudinary.config({
  cloud_name: 'dl7airznk',
  api_key: '538186999491745',
  api_secret: 'hiZjrudYe598WRg_Bt-uNkZduqQ',
  secure: true
});

// Adding the "Item" route 

app.post("/items/add", upload.single("featureImage"), async (req, res) => {
  
  if (req.file) {
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    
    async function upload(req) {
      let result = await streamUpload(req);
      console.log(result);
      return result;
    }

    upload(req).then((uploaded)=>{
      processItem(uploaded.url);
    });
  }else{
    processItem("");
  }
  
  function processItem(imageUrl){
    req.body.featureImage = imageUrl;
    
    // TODO: Process the req.body and add it as a new Item before redirecting to /items
    store.addItem(req.body)
    .then(() => res.redirect("/items"))
    .catch((err) => res.status(500).send("Your add items don't work buddy"))
} 

});

/********************************************************************************/

store.initialize()
.then(() => { 
  // start the server on the port and output a confirmation to the console
  app.listen(HTTP_PORT, () => console.log(`Express http server listening on ${HTTP_PORT}`));
})
.catch(()=>{ 
  console.log('Failed to load resources :(');
});