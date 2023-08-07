  const messageBar = document.getElementById("message-input");
  const sendBtn = document.getElementById("send-button");
  const messageBox = document.getElementById("chat-messages");
  const requestCounter = document.getElementById("requestCounter");
  
  let API_URL = "https://api.openai.com/v1/chat/completions";
  let API_KEY = "";
  let requestCount = 0;
  
  sendBtn.onclick = function() {
    if (messageBar.value.length > 0) {
      const userTypedMessage = messageBar.value;
      messageBar.value = "";
  
      let userMessage =
        `<div class="chat message-container user-message">
          <div class="message user-message">
            ${userTypedMessage}
          </div>
        </div>`;
  
      let modelMessage =
        `<div class="chat message-container model-message">
          <div class="message model-message">
            ...
          </div>
        </div>`;
  
      messageBox.insertAdjacentHTML("beforeend", userMessage);
  
      setTimeout(() => {
        messageBox.insertAdjacentHTML("beforeend", modelMessage);
  
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
            const chatBotResponse = document.querySelector(".model-message .message");
            const formattedResponse = formatChatResponse(data.choices[0].message.content);
            chatBotResponse.innerHTML = formattedResponse;
  
            messageBox.insertAdjacentHTML("beforeend", `<div class="chat"></div>`);
  
            scrollToBottom();
          })
          .catch((error) => {
            const chatBotResponse = document.querySelector(".model-message .message");
            chatBotResponse.innerHTML = "Oops! An error occurred. Please try again.";
  
            messageBox.insertAdjacentHTML("beforeend", `<div class="chat"></div>`);
  
            scrollToBottom();
          });
  
        requestCount++;
        requestCounter.textContent = requestCount;
  
        if (requestCount === 75) {
          const limitMessage =
            `<div class="chat message-container model-message">
              <div class="message model-message">
                You've reached the number of requests today. Please support us by sharing with your friends: <a href="https://ai.quizzify.com.ng">ai.quizzify.com.ng</a>.
              </div>
            </div>`;
  
          messageBox.insertAdjacentHTML("beforeend", limitMessage);
  
          messageBox.insertAdjacentHTML("beforeend", `<div class="chat"></div>`);
  
          scrollToBottom();
          sendBtn.disabled = true;
          messageBar.disabled = true;
        }
      }, 100);
    }
  };
  messageBox.addEventListener("click", function (event) {
  if (event.target.classList.contains("fa-clipboard")) {
    const responseText = event.target.previousElementSibling.textContent;
    copyToClipboard(responseText);

    event.target.classList.add("clicked");
    setTimeout(function () {
      event.target.classList.remove("clicked");
    }, 300);

    // Show the Bootstrap alert when clipboard is clicked
    showClipboardAlert();
  }
});

// Function to format mathematical answers and emphasize important parts
function formatChatResponse(responseText) {
  let formattedResponse = responseText.replace(/\*/g, "×").replace(/\//g, "÷");

  // Emphasize important parts (you can customize this based on your criteria)
  formattedResponse = formattedResponse.replace(/(result|answer|solution)/gi, '<strong>$1</strong>');

  // Additional formatting for mathematical symbols
  formattedResponse = formattedResponse.replace(/(\+\s*\-\s*|\-\s*\+\s*|\+\s*\+\s*|\-\s*\-\s*)/g, "±"); // Plus-Minus (±)
  formattedResponse = formattedResponse.replace(/\^2/g, "<sup>2</sup>"); // Square (x^2)
  formattedResponse = formattedResponse.replace(/\^3/g, "<sup>3</sup>"); // Cube (x^3)
  formattedResponse = formattedResponse.replace(/sqrt\(([^)]+)\)/g, "√$1"); // Square Root (sqrt(x))
  formattedResponse = formattedResponse.replace(/(\d+)\^(\d+)/g, "$1<sup>$2</sup>"); // Exponent (x^y)

  return formattedResponse;
}

// Function to display Bootstrap alert when clipboard icon is clicked
function showClipboardAlert() {
  const clipboardAlert = document.createElement("div");
  clipboardAlert.classList.add("alert", "alert-success", "alert-dismissible", "fade", "show");
  clipboardAlert.innerHTML = `
    <strong>Copied!</strong> Response text has been copied to clipboard.
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  const chatBox = document.querySelector(".chatbox-wrapper");
  chatBox.appendChild(clipboardAlert);

  setTimeout(() => {
    clipboardAlert.remove();
  }, 3000);
}

function copyToClipboard(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function scrollToBottom() {
  messageBox.scrollTop = messageBox.scrollHeight;
}
