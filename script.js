const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const messageBox = document.getElementById("chat-messages");

let API_URL = "https://api.openai.com/v1/chat/completions";
let API_KEY = ""; // Replace with your OpenAI API key

sendButton.onclick = function() {
  const userTypedMessage = messageInput.value.trim();

  if (userTypedMessage !== "") {
    messageInput.value = "";
    addMessage("user", userTypedMessage);

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [{ "role": "user", "content": userTypedMessage }]
      })
    };

    fetch(API_URL, requestOptions)
      .then(res => res.json())
      .then(data => {
        const botResponse = data.choices[0].message.content;
        addMessage("bot", botResponse);
        scrollToBottom();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
};

function addMessage(role, content) {
  const message = `
    <div class="chat message-container ${role}-message">
      <i class="fas fa-${role === 'user' ? 'user' : 'robot'}"></i>
      <div class="message">
        ${content}
      </div>
    </div>
  `;

  messageBox.insertAdjacentHTML("beforeend", message);
}

function scrollToBottom() {
  messageBox.scrollTop = messageBox.scrollHeight;
}