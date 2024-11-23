const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
let userMessage = null; // Variable to store user's message
const inputInitHeight = chatInput.scrollHeight;

// API configuration
const API_URL = "https://payload.vextapp.com/hook/3L4EYEFWY6/catch/reuben";
const API_KEY = "4iYRGcom.jvaQwO8z5uur4nFJm8PYL3A3gfkH1kfk";

// Function to create chat list items
const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", `${className}`);
  let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi; // Return chat <li> element
}

// Function to generate a response using the Python API
const generateResponse = async (chatElement) => {
  const messageElement = chatElement.querySelector("p");

  // Define the payload for the request
  const requestData = {
    payload: userMessage
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Apikey": `Api-key ${API_KEY}`
    },
    body: JSON.stringify(requestData)
  };

  try {
    // Send the POST request to the Python backend
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    
    if (!response.ok) throw new Error(data.error || "Error fetching response");

    // Update the message element with the response
    messageElement.textContent = data.text || "No response available";
  } catch (error) {
    // Handle errors
    messageElement.classList.add("error");
    messageElement.textContent = error.message;
  } finally {
    chatbox.scrollTo(0, chatbox.scrollHeight);
  }
}

// Function to handle user chat input
const handleChat = () => {
  userMessage = chatInput.value.trim(); // Get user message
  if (!userMessage) return;

  // Clear the input textarea and reset height
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  // Append user's message to chatbox
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    // Append "Thinking..." message while waiting for response
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi);
  }, 600);
}

// Event listeners
chatInput.addEventListener("input", () => {
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
