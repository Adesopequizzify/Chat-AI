const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');
let requestCount = 0;

sendButton.addEventListener('click', async function() {
    const userMessage = messageInput.value.trim();

    if (userMessage !== '') {
        // Display user message in the chat interface
        displayMessage('user', userMessage);

        // Send message to the model and handle response
        try {
            const response = await sendMessageToModel(userMessage);
            handleModelResponse(response);
        } catch (error) {
            displayMessage('model', 'Oops! An error occurred. Please try again.');
        }

        // Clear the input field
        messageInput.value = '';
    }
});

async function sendMessageToModel(message) {
    try {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer your-api-key`, // Replace with your API key
            },
            body: JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages": [{"role": "user", "content": message}]
            })
        };

        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        const modelReply = formatChatResponse(data.choices[0].message.content);

        return modelReply;
    } catch (error) {
        throw new Error(error);
    }
}

function handleModelResponse(response) {
    // Display model response in the chat interface
    displayMessage('model', response);

    // Update request count and handle limits
    requestCount++;
    if (requestCount === 75) {
        sendButton.disabled = true;
        messageInput.disabled = true;
        displayMessage('model', 'You\'ve reached the number of requests today. Please support us by sharing with your friends: <a href="https://ai.quizzify.com.ng">ai.quizzify.com.ng</a>.');
    }
}

function displayMessage(sender, message) {
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');
    messageContainer.classList.add(sender + '-message');

    const messageBubble = document.createElement('div');
    messageBubble.classList.add('message');

    const messageText = document.createElement('div');
    messageText.classList.add('message-text');
    messageText.innerHTML = message; // Use innerHTML to render anchor tags

    messageBubble.appendChild(messageText);
    messageContainer.appendChild(messageBubble);

    chatMessages.appendChild(messageContainer);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function detectIntent(message) {
    const lowerCaseMessage = message.toLowerCase();

    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
        return 'greeting';
    } else if (lowerCaseMessage.includes('who') && lowerCaseMessage.includes('you')) {
        return 'identity';
    }

    // If no specific intent is detected, return a default intent
    return 'default';
}

function createContext(intent) {
    switch (intent) {
        case 'greeting':
            return 'You\'re a helpful assistant.';
        default:
            return '';
    }
}

function handleGreeting() {
    const greetingResponse = 'Hello! How can I assist you today?';
    displayMessage('model', greetingResponse);
}

function handleIdentity() {
    const identityResponse = 'I\'m a helpful assistant here to provide you with information and assistance.';
    displayMessage('model', identityResponse);
}
