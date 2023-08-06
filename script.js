const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');

    // Handle send button click
    sendButton.addEventListener('click', async function() {
        const message = messageInput.value.trim();

        if (message !== '') {
            // Display user message in the chat interface
            displayMessage('user', message);

            // Detect user intent
            const intent = detectIntent(message);


            // Take appropriate action based on intent
            switch (intent) {
                case 'greeting':
                    handleGreeting();
                    break;
                case 'identity':
                    handleIdentity();
                    break;
                default:
                    // No specific intent detected, send the message to the model
                    const context = createContext(intent);
                    const response = await sendMessageToModel(message, context);
                    if (response) {
                        displayMessage('model', response);
                    } else {
                        displayMessage('model', 'Oops! Something went wrong. Please try again.');
                    }
                    break;
            }

            // Clear the input field
            messageInput.value = '';
        }
    });

    // Function to determine user intent based on message content
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

    // Function to create context based on intent
    function createContext(intent) {
        switch (intent) {
            case 'greeting':
                return 'You\'re a helpful assistant.';
            default:
                return '';
        }
    }

    // Handle greeting intent
    function handleGreeting() {
        const greetingResponse = 'Hello! How can I assist you today?';
        displayMessage('model', greetingResponse);
    }

    // Handle identity intent
    function handleIdentity() {
        const identityResponse = 'I\'m a helpful assistant here to provide you with information and assistance.';
        displayMessage('model', identityResponse);
    }

    // Function to send user message and context to the ChatGPT model
    async function sendMessageToModel(message, context) {
    try {
        const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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',
            },
            body: JSON.stringify({
                prompt: message,
                max_tokens: 100,
                temperature: 0.7,
                n: 1,
                stop: '\n',
                context: context,
            }),
        });

        if (!response.ok) {
            throw new Error('Request failed with status: ' + response.status);
        }

        const data = await response.json();
        const modelReply = data.choices[0].text.trim();
        return modelReply;
    } catch (error) {
        console.error(error);
        return null;
    }
}



    // Display message in the chat interface
    function displayMessage(sender, message) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message-container');
        messageContainer.classList.add(sender + '-message');

        const messageBubble = document.createElement('div');
        messageBubble.classList.add('message');

        const messageText = document.createElement('div');
        messageText.classList.add('message-text');
        messageText.textContent = message;

        messageBubble.appendChild(messageText);
        messageContainer.appendChild(messageBubble);

        chatMessages.appendChild(messageContainer);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }