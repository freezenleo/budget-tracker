//create variable to hold db connection
let db;
//establish a connection to IndexedDB database called 'budget_tracker' and set it to version 1
const request = indexedDB.open('budget_tracker', 1);

//this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc)
request.onupgradeneeded = function (event) {
    //save a reference to the database
    const db = event.target.result;
    //create an object store (table) called `budget_amount`, set it to have an auto incrementing primary key of sorts
    db.createObjectStore('budget_amount', { autoIncrement: true });
};

// upon a successful
request.onsuccess = function (event) {
    //when db is successfully created with its object store (from onupgradeneeded event above) or simply established a connection, save reference to db in global variable
    db = event.target.result;

    //check if app is online, if yes run uploadBudget() function to send all local db data to api
    if (navigator.onLine) {
        uploadBudget();
    }
};

request.onerror = function (event) {
    //log error here
    console.log(event.target.errorCode);
};

// this function will be executed if we attempt to submit a new budget and there's no internet connection
function saveRecord(record) {
    //open a new transaction with the database with read and write permissions
    const transaction = db.transaction(['budget_amount', 'readwrite']);

    //access the object store for 'budget_amount'
    const budgetObjectStore = transaction.objectStore('budget_amount');

    //add record to store with add method
    budgetObjectStore.add(record);
}