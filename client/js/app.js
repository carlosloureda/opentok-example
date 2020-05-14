// replace these values with those generated in your TokBox Account
var apiKey = null;
var sessionId = null;
let token = null;
let session = null;

// (optional) add server code here
initializeSession();


// Handling all of our errors here by alerting them
function handleError(error) {
    if (error) {
        alert(error.message);
    }
}

async function getApiKey() {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response.json();
}

async function getCredentials() {
    // Default options are marked with *
    const response = await fetch("/generate-token", {
        method: 'GET',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response.json();
}


async function initializeSession() {

    let data = await getCredentials();

    token = data.token;
    sessionId = data.sessionId;
    apiKey = data.apiKey;


    session = OT.initSession(apiKey, sessionId);

    // Subscribe to a newly created stream
    session.on('streamCreated', function (event) {
        session.subscribe(event.stream, 'subscriber', {
            insertMode: 'append',
            width: '100%',
            height: '100%'
        }, handleError);
    });

    // Create a publisher
    var publisher = OT.initPublisher('publisher', {
        insertMode: 'append',
        width: '100%',
        height: '100%'
    }, handleError);



    // Connect to the session
    session.connect(token, function (error) {
        // If the connection is successful, publish to the session
        if (error) {
            handleError(error);
        } else {
            session.publish(publisher, handleError);
        }
    });
}

document.getElementById("buttonDisconnect").addEventListener("click", () => {
    console.log("Disconnect from session");
    session.disconnect();
})