// ===================================== Main script file

window.onload = async function () {
    const response = await fetch("http://192.168.1.11:5000/data");
    let data = await response.json();
    let pastes = data.pastes;
    for (const i of pastes) {
        let paste = `<div id="${i.id}" class="paste">
        <div class="contentBox">${i.paste}</div>
        <div class="removeBtn btn" onclick="removePaste(this)">Remove</div>
        </div>`;
        
        clipBox.innerHTML += paste;
    }
};

function removePaste(obj) {
    callAPI("remove_single", message="" ,eleId=obj.parentNode.id)
}

// Variables
let pasteForm = document.getElementById("pasteForm"); // form element
let clipTextID = document.getElementById("clipTextID"); // form input
let clipBox = document.getElementById("clipBox"); // pastes container
let syncBtn = document.getElementById("syncBtn"); // btn to start server
let cleanBtn = document.getElementById("cleanBtn"); // btn to remove all the pastes

// Functions
// set ID function
async function setID() {
    const response = await fetch("http://192.168.1.11:5000/getID");
    let data = await response.json();
    return data.value;
}

// API function
async function callAPI(apiName, message = "", eleId = "") {
    if ((message !== "" || message != null) && (apiName === "add")) {
        const id = await setID();
        try {
            fetch("http://192.168.1.11:5000/add_paste", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    "id": `pasteID_${id}`,
                    "paste": message
                })
            })
        } catch (error) {
            console.error('Error:', error);
        }

        let paste = `<div id="pasteID_${id}" class="paste">
                <div class="contentBox">${message}</div>
                <div class="removeBtn btn" onclick="removePaste(this)">Remove</div>
                </div>`;

        clipBox.innerHTML += paste;

    } else if ((message === "" || message == null) && (apiName === "add")){
        alert("Kuch likh toh le")
    }
    if (apiName === "remove_single") {
        fetch("http://192.168.1.11:5000/remove_paste", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                "id": eleId,
            })
        })
        
        document.getElementById(eleId).remove();
    }
    if (apiName === "remove_all") {
        fetch("http://192.168.1.11:5000/clean")
        location.reload();
    }
    if (apiName === "startSync") {
        location.reload();
    }
}


// EVENT LISTENERS


// Handling form event to get data from input
pasteForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let message = clipTextID.value;
    // Calling add paste function
    callAPI("add", message = message)
    clipTextID.value = "";
});

syncBtn.addEventListener("click", function (e) {
    callAPI("startSync")
});

cleanBtn.addEventListener("click", function (e) {
    callAPI("remove_all")
});

