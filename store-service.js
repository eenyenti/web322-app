const fs = require('fs').promises;
let items = [];
let categories = [];

// async function initialize() {
//     try {
//         const itemsData = await fs.readFile('./data/items.json', 'utf8');
//         items = JSON.parse(itemsData);

//         const categoriesData = await fs.readFile('./data/categories.json', 'utf8');
//         categories = JSON.parse(categoriesData);
        
//         return Promise.resolve(); 
//     } catch (err) {
//         return Promise.reject("Error reading or parsing the files");
//     }
// }
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

function getAllItems() {
    if (items.length) {
        return Promise.resolve(items);
    } else {
        return Promise.reject('No results returned for items');
    }
}

function getPublishedItems() {
    let publishedItems = items.filter((items) => items.published === true);
    if (publishedItems.length) {
        return Promise.resolve(publishedItems);
    } else {
        return Promise.reject('No results returned for categories');
    }
}

function getCategories() {
    if (categories.length) {
        return Promise.resolve(categories);
    } else {
        return Promise.reject('No results returned for categories');
    }
}

module.exports = 
{
    initialize,
    getAllItems,
    getPublishedItems,
    getCategories
}