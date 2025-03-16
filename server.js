/*********************************************************************************
WEB322 – Assignment 02
I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
No part of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Elthan Nyenti
Student ID: 118460237
Date: 16 February 2025
Vercel Web App URL: web322-app-rho.vercel.app
GitHub Repository URL: https://github.com/eenyenti/web322-app

********************************************************************************/ 

const express = require('express');
const path = require('path');
const store = require('./store-service');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

/********************************************************************************/

// Paths and directories

app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.redirect('/about');
  });

app.get('/about', (req, res) => {
res.sendFile(path.join(__dirname, 'views/about.html'));
});

app.get('/items/add', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/addItem.html'));
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
  
  function processItem(req, imageUrl) {
    req.body.featureImage = imageUrl;
    
    // TODO: Process the req.body and add it as a new item
    addItem(req.body)
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