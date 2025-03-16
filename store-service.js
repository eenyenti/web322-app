const fs = require('fs').promises;
const path = require('path'); 

let items = [];
let categories = [];

async function initialize() {
    try {
        const itemsData = await fs.readFile(path.join(__dirname, 'data', 'items.json'), 'utf8');
        items = JSON.parse(itemsData);

        const categoriesData = await fs.readFile(path.join(__dirname, 'data', 'categories.json'), 'utf8');
        categories = JSON.parse(categoriesData);
        
        return Promise.resolve(); 
    } catch (err) {
        return Promise.reject("Error reading or parsing the files");
    }
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

function addItem(itemData) {
    return new Promise((resolve, reject) => {
        if (itemData.published === "" || itemData.published === undefined) {
            itemData.published = false;
        }
        else {
            itemData.published = true;
        }
        itemData.id = items.length + 1;
    
        items.push(itemData);
    
        resolve(itemData);
    });
}

function getItemsByCategory(category) {
    let categoryItems = items.filter(item => item.category === category);
    if (categoryItems.length > 0) {
        return Promise.resolve(categoryItems);
    } else {
        return Promise.reject('No results returned for category ' + category);
    }
}

function getItemsByMinDate(minDateStr) {
    let dateItems = items.filter(item => new Date(item.postDate) >= new Date(minDateStr));
    if (dateItems.length > 0) {
        return Promise.resolve(dateItems);
    } else {
        return Promise.reject('No results returned for date ' + minDateStr);
    }
}

function getItemById(id) {
    let item = items.find(item => item.id === id);
    if (item) {
        return Promise.resolve(item);
    } else {
        return Promise.reject('No result returned for id ' + id);
    }
}


module.exports = 
{
    initialize,
    getAllItems,
    getPublishedItems,
    getCategories,
    addItem,
    getItemsByCategory,
    getItemsByMinDate,
    getItemById
}