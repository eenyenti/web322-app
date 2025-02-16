// const fs = require('fs').promises;
// let items = [];
// let categories = [];

// // async function initialize() {
// //     try {
// //         const itemsData = await fs.readFile('./data/items.json', 'utf8');
// //         items = JSON.parse(itemsData);

// //         const categoriesData = await fs.readFile('./data/categories.json', 'utf8');
// //         categories = JSON.parse(categoriesData);
        
// //         return Promise.resolve(); 
// //     } catch (err) {
// //         return Promise.reject("Error reading or parsing the files");
// //     }
// // }
// async function initialize() {
//     return fs.readFile('data/items.json', 'utf8')
//     .then(data => {
//         items = JSON.parse(data);
//         return fs.readFile('data/categories.json', 'utf8');
//     })
//     .then(data => {
//         categories = JSON.parse(data);
//         return 'Initialized.';
//     })
//     .catch(err => {
//         throw new Error("Cannot open file.", err);
//     });
// }

// function getAllItems() {
//     if (items.length) {
//         return Promise.resolve(items);
//     } else {
//         return Promise.reject('No results returned for items');
//     }
// }

// function getPublishedItems() {
//     let publishedItems = items.filter((items) => items.published === true);
//     if (publishedItems.length) {
//         return Promise.resolve(publishedItems);
//     } else {
//         return Promise.reject('No results returned for categories');
//     }
// }

// function getCategories() {
//     if (categories.length) {
//         return Promise.resolve(categories);
//     } else {
//         return Promise.reject('No results returned for categories');
//     }
// }

// module.exports = 
// {
//     initialize,
//     getAllItems,
//     getPublishedItems,
//     getCategories
// }

const fs = require('fs').promises;
const path = require('path'); 

let items = [];
let categories = [];

function initialize() {
    return fs.readFile(path.join(__dirname, 'data', 'items.json'), 'utf8')
        .then(data => {
            items = JSON.parse(data);
            return fs.readFile(path.join(__dirname, 'data', 'categories.json'), 'utf8');
        })
        .then(data => {
            categories = JSON.parse(data);
            return 'Initialization successful';
        })
        .catch(err => {
            throw new Error("Unable to read JSON files: " + err.message);
        });
}

module.exports = {
    initialize,
    getAllItems: () => items.length ? Promise.resolve(items) : Promise.reject('No results returned for items'),
    getPublishedItems: () => {
        const publishedItems = items.filter(item => item.published === true);
        return publishedItems.length ? Promise.resolve(publishedItems) : Promise.reject('No published items found');
    },
    getCategories: () => categories.length ? Promise.resolve(categories) : Promise.reject('No results returned for categories')
};
