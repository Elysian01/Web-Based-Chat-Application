const deliveryBody = document.getElementById("delivery-body");
const qualityBody = document.getElementById("quality-body");
const otherBody = document.getElementById("other-body");
const csr_email = "elysian@gmail.com"

// http://127.0.0.1:5500/chat.html?email=abhig0209%40gmail.com&room=abcd
function addRow(email, room_name, problem) {
    link = "http://127.0.0.1:5500/chat.html?email=" + csr_email + "&room=" + room_name;
    link = link.replace("@", "%40");

    row_html = `
                <tr class="text-center">
                <td>${email}</td>
                <td>${room_name}</td>
                <td><a href="${link}"><button class="btn btn-warning" type="button">Chat</button></a></td>
                </tr>
    `
    if (problem === "delivery") {
        deliveryBody.innerHTML += row_html;
    } else if (problem == "quality") {
        qualityBody.innerHTML += row_html;
    } else {
        otherBody.innerHTML += row_html;
    }
}



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

const delivery_ref = database.ref("delivery/")
const quality_ref = database.ref("quality/")
const other_ref = database.ref("other/")


delivery_ref.orderByChild("resolved_status").equalTo(false).on("value", (snapshot) => {
    curr_ss = snapshot.val()
    deliveryBody.innerHTML = ""
    for (var obj in snapshot.val()) {
        email = curr_ss[obj].email;
        room_name = curr_ss[obj].room_name;
        // console.log("Email: " + email + "   Room: " + room_name);
        addRow(email, room_name, "delivery")
    };
});

quality_ref.orderByChild("resolved_status").equalTo(false).on("value", (snapshot) => {
    curr_ss = snapshot.val()
    qualityBody.innerHTML = ""
    for (var obj in snapshot.val()) {
        email = curr_ss[obj].email;
        room_name = curr_ss[obj].room_name;
        // console.log("Email: " + email + "   Room: " + room_name);
        addRow(email, room_name, "quality")
    };
});

other_ref.orderByChild("resolved_status").equalTo(false).on("value", (snapshot) => {
    curr_ss = snapshot.val();
    otherBody.innerHTML = ""
    for (var obj in snapshot.val()) {
        email = curr_ss[obj].email;
        room_name = curr_ss[obj].room_name;
        addRow(email, room_name, "other")
    };
});


// 'once' method will only execute when we refresh the page
// delivery_ref.once("value", (snapshot) => {
//     console.log(snapshot.val())
// })