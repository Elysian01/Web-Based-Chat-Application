const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


var firebaseConfig = {
    apiKey: "AIzaSyCYKCL6elNPZ8cSSH5wsJOBQddmMnSKnKc",
    authDomain: "chat-app-5cf99.firebaseapp.com",
    projectId: "chat-app-5cf99",
    storageBucket: "chat-app-5cf99.appspot.com",
    messagingclient_mail_idId: "482191452418",
    appId: "1:482191452418:web:f47321386952baa2107a1b",
    databaseURL: "https://chat-app-5cf99-default-rtdb.firebaseio.com"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();


// Get username and room from URL
var { email, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});
const room_name = room;
room = "Chats/" + room
client = { email: email, room: room }
    // console.log(email, room);

const participant_room = room + "/" + "participant/"


// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room_name;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user;
        userList.appendChild(li);
    });

}

chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;

    // Emit message to server
    sendMessage(msg);

    // clear client input
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
});

function sendMessage(message) {
    // with room name as key
    database.ref(room).push().set({
        "client_mail_id": email,
        "message": message
    })
}

// Listen for incoming Messages
database.ref(room).on("child_added", function(snapshot) {
    var msg = { email: snapshot.val().client_mail_id, text: snapshot.val().message }
    outputMessage(msg)
})

function outputMessage(message) {
    if (message.text) {
        const div = document.createElement("div");
        div.classList.add("message");
        div.innerHTML = `<p class="meta">${message.email}</p>
                    <p class="text">
                        ${message.text}
                    </p>`;
        document.querySelector(".chat-messages").appendChild(div);
    }
}

function get_problem_name() {
    if (room.endsWith("del")) return "delivery"
    else if (room.endsWith("oth")) return "other"
    return "quality"
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
        problem = get_problem_name()
        get_participant_key(problem, email);

    }
});

function add_participant(email) {
    database.ref(participant_room).push().set({
        "client_mail_id": email,
    })
}


// function to get all the participants from firebase and display in UI under Users section
function get_participants() {
    var participants = new Set()

    database.ref(participant_room).once('value').then((snapshot) => {
        var arrayLength = Object.values(snapshot.val()).length;
        var obj = Object.values(snapshot.val())

        for (var i = 0; i < arrayLength; i++) {
            participants.add(obj[i].client_mail_id)
        }
        participants = [...participants]
    }).then((result) => {
        // console.log(participants)
        outputUsers(participants);
    });
}

// when customer leaves the meeting his resolved_status is set to true
function get_participant_key(problem, email) {
    var participant_key;

    database.ref(problem + "/").orderByChild("email").equalTo(email).limitToFirst(1).once('value').then((snapshot) => {
        if (snapshot.val()) {
            console.log(Object.keys(snapshot.val())[0])
            participant_key = Object.keys(snapshot.val())[0]
        }
    }).then((result) => {
        update_resolved_status(problem, participant_key);

    })

}


function update_resolved_status(problem, participant_key) {
    data = {
        email: email,
        resolved_status: true,
        room_name: room
    }
    var updates = {}
    updates[problem + "/" + participant_key] = data;
    firebase.database().ref().update(updates).then((result) => { window.location = '../index.html'; });

}


// Listen for new user
database.ref(participant_room).on("child_added", function(snapshot) {
    var msg = { email: snapshot.val().client_mail_id, text: snapshot.val().message }
    outputMessage(msg)
})

function init() {
    outputRoomName(room);
    add_participant(email);
    get_participants()
}

init()