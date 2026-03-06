document.addEventListener('DOMContentLoaded', () => {
    const chatbotIcon = document.getElementById('chatbot-icon');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeBtn = document.getElementById('chatbot-close-btn');
    const sendBtn = document.getElementById('chatbot-send-btn');
    const inputField = document.getElementById('chatbot-input');
    const messagesContainer = document.getElementById('chatbot-messages');

    // --- Knowledge Base for the Chatbot ---
    // Keywords are in lowercase. The bot will check if the user's message includes any of these.
    const knowledgeBase = {
        "greeting": {
            keywords: ["hello", "hi", "hey", "good morning", "good afternoon"],
            response: "Hello! Welcome to Ajor Doors. How can I assist you today?"
        },
        "products": {
            keywords: ["products", "doors", "types", "kinds", "sell"],
            response: "We manufacture a wide range of premium doors including Teak Wood, 100% waterproof WPC, stylish Laminates, Digital Print, Neo Classic, and HDF Moulded doors. You can see them all on our <a href='product.html'>Products page</a>."
        },
        "wpc": {
            keywords: ["wpc", "waterproof", "bathroom"],
            response: "Our WPC (Wood Polymer Composite) doors are 100% waterproof, termite-proof, and borer-proof, making them ideal for bathrooms and areas with high moisture. They come with a lifetime warranty against water damage."
        },
        "teak": {
            keywords: ["teak", "wood", "wooden"],
            response: "Yes, we specialize in premium Teak wood doors, known for their durability and classic elegance. We offer various designs and can customize them to your needs."
        },
        "custom": {
            keywords: ["custom", "size", "customize", "measurements"],
            response: "Absolutely! We are a factory-based manufacturer and can create doors in custom sizes to perfectly fit your requirements. You can even try our <a href='customize.html'>online door customizer</a> or <a href='contact.html'>contact us</a> for a quote."
        },
        "location": {
            keywords: ["location", "address", "where", "showroom", "map"],
            response: "You can visit our showroom at: SHREE DHANALAXMI HARDWARE AND PLY, Sy No. 107, 108 & 109, Rampura Main Road, K.channasandra Village, Bengaluru, Karnataka 560043. Here is a <a href='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.058197949511!2d77.6775798742191!3d13.03201491414418!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae113ac7d95d13%3A0xcbe9a51032d18a7c!2sSHREE%20DHANALAXMI%20HARDWARE%20AND%20PLY!5e0!3m2!1sen!2sin!4v1721300050085!5m2!1sen!2sin' target='_blank'>link to the map</a>."
        },
        "hours": {
            keywords: ["hours", "opening", "timing", "open", "close"],
            response: "We are open from Monday to Saturday, 9:00 AM to 7:00 PM. We are closed on Sundays."
        },
        "contact": {
            keywords: ["contact", "phone", "number", "email"],
            response: "You can call us at <a href='tel:+919844443388'>+91 98444 43388</a> or email us at <a href='mailto:sdlhp2002@gmail.com'>sdlhp2002@gmail.com</a>. You can also fill out the form on our <a href='contact.html'>Contact page</a>."
        },
        "warranty": {
            keywords: ["warranty", "guarantee"],
            response: "Warranty varies by product. Our WPC doors have a lifetime warranty against water and termite damage. Our wooden doors have a warranty covering structural integrity. Please check the specific product page for details."
        },
        "price": {
            keywords: ["price", "cost", "quote", "how much"],
            response: "Pricing depends on the door type, size, and customization. For a precise quote, please <a href='contact.html'>contact us</a> with your requirements or visit our showroom."
        },
        "thankyou": {
            keywords: ["thanks", "thank you"],
            response: "You're welcome! Is there anything else I can help you with?"
        },
        "default": {
            keywords: [],
            response: "I'm sorry, I didn't quite understand that. Could you please rephrase? You can ask me about our products, location, or contact details. For a detailed enquiry, please <a href='contact.html'>contact our team directly</a>."
        }
    };

    // --- Event Listeners ---
    if (chatbotIcon) {
        chatbotIcon.addEventListener('click', () => {
            chatbotWindow.classList.remove('hidden');
            chatbotIcon.classList.add('hidden');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            chatbotWindow.classList.add('hidden');
            chatbotIcon.classList.remove('hidden');
        });
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', handleUserInput);
    }

    if (inputField) {
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleUserInput();
            }
        });
    }

    // --- Core Functions ---
    async function handleUserInput() {
        const message = inputField.value.trim();
        if (message === "") return;

        addMessage(message, 'user');
        inputField.value = '';

        // Remove previous suggestions to keep the chat clean
        const existingSuggestions = messagesContainer.querySelector('.chat-suggestions');
        if (existingSuggestions) {
            existingSuggestions.remove();
        }

        // Add a "thinking" indicator while waiting for the AI
        addMessage('<i class="fas fa-spinner fa-spin"></i>', 'bot', 'thinking');

        const botResponse = await getBotResponse(message);

        // Update the "thinking" message with the actual response
        updateLastBotMessage(botResponse);
    }

    function updateLastBotMessage(text) {
        const thinkingMessage = messagesContainer.querySelector('.chat-message.thinking');
        if (thinkingMessage) {
            thinkingMessage.querySelector('p').innerHTML = text;
            thinkingMessage.classList.remove('thinking');
        } else {
            // If for some reason the thinking message isn't there, just add a new one
            addMessage(text, 'bot');
        }
    }

    function addMessage(text, sender, type = '') {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender);
        if (type) {
            messageElement.classList.add(type);
        }
        
        const paragraph = document.createElement('p');
        paragraph.innerHTML = text; // Use innerHTML to render links
        messageElement.appendChild(paragraph);
        
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
    }

    async function getBotResponse(userInput) {
        const lowerCaseInput = userInput.toLowerCase();

        // --- Step 1: Check local knowledgeBase for a quick, exact match. ---
        for (const key in knowledgeBase) {
            if (key !== 'default') {
                for (const keyword of knowledgeBase[key].keywords) {
                    if (lowerCaseInput.includes(keyword)) {
                        return knowledgeBase[key].response;
                    }
                }
            }
        }

        // --- Step 2: If no local match, call the AI backend. ---
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: userInput })
            });

            if (!response.ok) {
                console.error('AI service returned an error:', await response.text());
                return knowledgeBase.default.response; // Fallback on API error
            }

            const data = await response.json();
            return data.reply;

        } catch (error) {
            console.error('Failed to fetch from AI backend:', error);
            // Return a more specific error if the connection fails
            return "I'm having trouble connecting to my brain right now. Please try again in a moment.";
        }
    }

    // --- Suggestion Chips Logic ---
    function addSuggestions(suggestions) {
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.classList.add('chat-suggestions');

        suggestions.forEach(text => {
            const chip = document.createElement('button');
            chip.classList.add('suggestion-chip');
            chip.textContent = text;
            chip.addEventListener('click', () => {
                inputField.value = text;
                handleUserInput();
            });
            suggestionsContainer.appendChild(chip);
        });

        messagesContainer.appendChild(suggestionsContainer);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Add initial suggestions after a brief delay
    setTimeout(() => {
        addSuggestions(["View Products", "Showroom Location", "Contact Number", "Custom Options", "What is WPC?"]);
    }, 500);

    // Initially hide the window and show the icon
    if (chatbotWindow) chatbotWindow.classList.add('hidden');
    if (chatbotIcon) chatbotIcon.classList.remove('hidden');
});