// ===================================== Main script file
function getData() {
    return fetch("http://127.0.0.1:5000/data")
        .then(response => response.json())
        .then(data => console.log(data));
}

function renderMsg() {
    return `<div id="${data['id']}" class="paste">
                <div class="contentBox">${message}</div>
                <div class="removeBtn btn">Remove</div>
                </div>`
}

let data = {}
window.onload = function () {
    data = getData()

};

// Variables
let pasteForm = document.getElementById("pasteForm"); // form element
let clipTextID = document.getElementById("clipTextID"); // form input
let clipBox = document.getElementById("clipBox"); // pastes container
let syncBtn = document.getElementById("syncBtn"); // btn to start server
let cleanBtn = document.getElementById("cleanBtn"); // btn to remove all the pastes
// Global
let count = 0

// Functions
// set ID function
async function setID() {
    const response = await fetch("http://127.0.0.1:5000/getID");
    let data = await response.json();
    return data.value
}

// API function
function callAPI(apiName, message = "", eleId = "") {
    if ((message !== "" || message != null) && (apiName === "add")) {
        fetch("http://127.0.0.1:5000/add_paste", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                "id": setID(),
                "paste": message
            })
        })
            .then(response => response.json())
            .then(data => console.log('Success:', data))
            .catch((error) => console.error('Error:', error));

        let paste = `<div id="${data['id']}" class="paste">
                <div class="contentBox">${message}</div>
                <div class="removeBtn btn">Remove</div>
                </div>`;

        clipBox.innerHTML += paste;
    } else if ((message === "" || message == null) && (apiName === "add")){
        alert("Kuch likh toh le")
    }
    if (apiName === "remove_single") {
        fetch("http://127.0.0.1:5000/remove_paste", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                "id": eleId,
            })
        })
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch((error) => console.error('Error:', error));
        
        document.getElementById(eleId).remove();
    }
    if (apiName === "remove_all") {
        fetch("http://127.0.0.1:5000/clean")
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch((error) => console.error('Error:', error));
        location.reload();
    }
    if (apiName === "startSync") {
        syncBtn.classList.add("disabled");
    }
}


// EVENT LISTENERS

// Handling form event to get data from input
pasteForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let message = clipTextID.value;
    // Calling add paste function
    callAPI("add", message = message)
});

syncBtn.addEventListener("click", function (e) {
    callAPI("startSync")
});

cleanBtn.addEventListener("click", function (e) {
    callAPI("remove_all")
});