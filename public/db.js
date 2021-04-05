let db;

const request = window.indexedDB.open("budget", 1);

request.onupgradeneeded = function (e){
    const db = e.target.result;

    const pending = db.createObjectStore("pending",{
        autoIncrement: true
    });
};

request.onsuccess = function (e){
    db = e.target.result;

    if (navigator.onLine){
        checkDatabase();
    }
};

request.onerror = function (e){

    console.log(err);
};

function saveRecord(record){

    const transaction = db.transaction(["pending"], "readwrite");
    // access your pending object store
    const pending = transaction.objectStore("pending");
    // add record to your store with add method.
    pending.add(record);
}

function checkDatabase(){
    const transaction = db.transaction(["pending"], "readwrite");
    const pending = transaction.objectStore("pending");
    const getMatches = pending.getAll();

    getMatches.onsuccess = function (){
        if (getMatches.result.length > 0){
            fetch('/api/transaction/bulk',{
                method: 'POST',
                body: JSON.stringify(getMatches.result),
                headers:{
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then(() => {
            
                    const transaction = db.transaction(["pending"], "readwrite");
                    // access your pending object store
                    const pending = transaction.objectStore("pending");
                    // clear all items in your store
                    pending.clear();
                });
        }
    };
}

// listen for app coming back online
window.addEventListener('online', checkDatabase);