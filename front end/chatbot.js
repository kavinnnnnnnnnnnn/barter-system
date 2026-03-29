/* 🤖 INTELLIGENT CHATBOT FOR BARTER SYSTEM */

class BarterChatBot {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.user = JSON.parse(localStorage.getItem("user")) || {};
    this.allOffers = [];
    this.language = localStorage.getItem("chatbot-language") || "en"; // "en" or "ta"
    this.isListening = false;
    this.isSpeaking = false;
    this.recognition = this.initSpeechRecognition();
    
    // Load available voices and ensure female voice is ready
    this.initializeVoices();
    
    this.loadOffers();
    this.initChatbot();
  }

  // Initialize and preload voices for female voice selection
  initializeVoices() {
    // Voices may not be loaded immediately, listen for voice list change
    window.speechSynthesis.onvoiceschanged = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log("🎤 Available voices:", voices.map(v => v.name).join(", "));
    };
    
    // Try to load voices immediately
    try {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        console.log("🎤 Available voices:", voices.map(v => v.name).join(", "));
      }
    } catch(e) {
      console.log("⏳ Voices loading...");
    }
  }

  // Initialize Speech Recognition API
  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("⚠️ Speech Recognition not supported");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = this.language === "ta" ? "ta-IN" : "en-US";

    recognition.onstart = () => {
      this.isListening = true;
      this.updateVoiceButton(true);
    };

    recognition.onend = () => {
      this.isListening = false;
      this.updateVoiceButton(false);
    };

    recognition.onerror = (event) => {
      console.error("🎤 Speech recognition error:", event.error);
      this.addBotMessage(this.translate("voiceError"));
      this.isListening = false;
      this.updateVoiceButton(false);
    };

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      if (event.results[0].isFinal) {
        document.getElementById("chatbot-input").value = transcript;
        this.sendMessage();
      }
    };

    return recognition;
  }

  // Update voice button state
  updateVoiceButton(listening) {
    const voiceBtn = document.getElementById("chatbot-voice");
    if (voiceBtn) {
      if (listening) {
        voiceBtn.style.background = "rgba(255, 100, 100, 0.8)";
        voiceBtn.textContent = "🎤🔴";
      } else {
        voiceBtn.style.background = "rgba(100, 200, 255, 0.6)";
        voiceBtn.textContent = "🎤";
      }
    }
  }

  // Start listening
  startListening() {
    if (this.recognition && !this.isListening) {
      this.recognition.lang = this.language === "ta" ? "ta-IN" : "en-US";
      this.recognition.start();
    }
  }

  // Stop listening
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  // Text-to-Speech function with iPhone female voice (Siri-like)
  speak(text, isFemaleVoice = true) {
    if (this.isSpeaking) {
      window.speechSynthesis.cancel();
    }

    // Remove emojis from text before speaking
    const textWithoutEmojis = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{200D}\u{23CF}\u{23E9}-\u{23EF}\u{23F0}-\u{23F3}\u{25FD}-\u{25FE}\u{2614}-\u{2615}\u{2648}-\u{2653}\u{267B}\u{267F}\u{2693}\u{26A1}\u{26AA}-\u{26AB}\u{26BD}-\u{26BE}\u{26C4}-\u{26C5}\u{26CE}\u{26D4}\u{26EA}\u{26F2}-\u{26F3}\u{26F5}\u{26FA}\u{26FD}\u{2705}\u{270A}-\u{270B}\u{2728}\u{274C}\u{274E}\u{2753}-\u{2755}\u{2757}\u{2764}\u{27A1}\u{27B0}\u{27BF}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}\u{FE0F}]/gu, '');

    const utterance = new SpeechSynthesisUtterance(textWithoutEmojis);
    utterance.lang = this.language === "ta" ? "ta-IN" : "en-US";
    
    // iPhone Siri-like settings
    utterance.rate = 0.95;        // Slightly slower and natural speed
    utterance.pitch = 1.8;        // Higher pitch for feminine voice (iPhone female characteristic)
    utterance.volume = 1;         // Full volume

    // Select iPhone female voice (Siri-like)
    const voices = window.speechSynthesis.getVoices();
    
    // Priority list for iPhone-like female voices
    const voiceOptions = [
      'Siri',           // macOS/iOS Siri
      'Victoria',       // macOS female voice
      'Samantha',       // Natural female voice
      'Fiona',          // Irish female
      'Karen',          // Australian female
      'Moira',          // Irish English
      'Zira',           // Windows female
      'Google US English Female',  // Chrome
      'Google UK English Female'
    ];

    let selectedVoice = null;

    // Try to find voice from priority list
    for (let option of voiceOptions) {
      selectedVoice = voices.find(voice => 
        voice.name.toLowerCase().includes(option.toLowerCase())
      );
      if (selectedVoice) break;
    }

    // If no priority voice found, look for any female voice
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => {
        const name = voice.name.toLowerCase();
        return name.includes('female') || 
               name.includes('woman') ||
               name.includes('girl') ||
               name.includes('en-us-x-');  // Chrome female voices
      });
    }

    // Fallback to first available voice
    if (!selectedVoice && voices.length > 0) {
      selectedVoice = voices[Math.max(0, voices.length - 2)];  // Often female voice at end
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log("🎤 Using voice: " + selectedVoice.name);
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
    };

    utterance.onerror = (event) => {
      console.error("🎤 Speech synthesis error:", event.error);
      this.isSpeaking = false;
    };

    window.speechSynthesis.speak(utterance);
  }

  // Translate messages (basic translations)
  translate(key) {
    const translations = {
      en: {
        voiceError: "❌ Sorry, I couldn't understand. Please try again.",
        listening: "🎤 Listening...",
        askVoice: "🎤 Click to speak or type your message",
        english: "English",
        tamil: "Tamil",
        switchLang: "🌐 Language switched to"
      },
      ta: {
        voiceError: "❌ மன்னிக்கவும், நான் புரிந்துகொள்ள முடியவில்லை. மீண்டும் முயற்சி செய்யவும்.",
        listening: "🎤 கேட்டுக்கொண்டிருக்கிறேன்...",
        askVoice: "🎤 பேச கிளிக் செய்யவும் அல்லது உங்கள் செய்தியை தொcarlos்க",
        english: "ஆங்கிலம்",
        tamil: "தமிழ்",
        switchLang: "🌐 மொழி மாற்றப்பட்டது"
      }
    };
    return translations[this.language]?.[key] || key;
  }

  // Load all offers from backend
  loadOffers() {
    fetch("http://localhost:3000/products")
      .then(res => res.json())
      .then(data => {
        this.allOffers = data || [];
        console.log("✅ Loaded offers:", this.allOffers.length);
      })
      .catch(err => console.error("❌ Error loading offers:", err));
  }

  // Initialize chatbot UI
  initChatbot() {
    // Check if chatbot already exists
    if (document.getElementById('chatbot-widget')) return;

    // Create chatbot HTML
    const chatbotHTML = `
      <div id="chatbot-widget" style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      ">
        <!-- Chat Toggle Button -->
        <button id="chatbot-toggle" style="
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(100, 200, 255, 0.8), rgba(30, 144, 255, 0.8));
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(100, 200, 255, 0.4);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          💬
        </button>

        <!-- Chat Window -->
        <div id="chatbot-window" style="
          display: none;
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 400px;
          height: 550px;
          background: linear-gradient(180deg, #0a0e27 0%, #1a1a3a 100%);
          border: 2px solid rgba(100, 200, 255, 0.3);
          border-radius: 15px;
          box-shadow: 0 8px 32px rgba(100, 200, 255, 0.3);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideIn 0.3s ease;
        ">
          <!-- Header -->
          <div style="
            background: linear-gradient(135deg, rgba(100, 200, 255, 0.2), rgba(30, 144, 255, 0.2));
            padding: 15px;
            border-bottom: 1px solid rgba(100, 200, 255, 0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <div>
              <h4 style="margin: 0; color: white; font-size: 16px;">🤖 Barter Assistant</h4>
              <small style="color: rgba(100, 200, 255, 0.7);">Online • Ready to help</small>
            </div>
            <button id="chatbot-close" style="
              background: none;
              border: none;
              color: white;
              font-size: 20px;
              cursor: pointer;
            ">×</button>
          </div>

          <!-- Language Selector -->
          <div style="
            padding: 8px 12px;
            border-bottom: 1px solid rgba(100, 200, 255, 0.2);
            display: flex;
            gap: 6px;
            justify-content: center;
          ">
            <button id="lang-en" style="
              background: rgba(100, 200, 255, 0.6);
              border: 1px solid rgba(100, 200, 255, 0.3);
              color: white;
              padding: 5px 12px;
              border-radius: 5px;
              font-size: 12px;
              cursor: pointer;
              transition: all 0.3s;
            ">🇬🇧 EN</button>
            <button id="lang-ta" style="
              background: rgba(100, 200, 255, 0.3);
              border: 1px solid rgba(100, 200, 255, 0.3);
              color: white;
              padding: 5px 12px;
              border-radius: 5px;
              font-size: 12px;
              cursor: pointer;
              transition: all 0.3s;
            ">🇮🇳 TA</button>
          </div>

          <!-- Messages Area -->
          <div id="chatbot-messages" style="
            flex: 1;
            overflow-y: auto;
            padding: 15px;
            background: rgba(10, 14, 39, 0.5);
          "></div>

          <!-- Input Area -->
          <div style="
            padding: 12px;
            border-top: 1px solid rgba(100, 200, 255, 0.2);
            display: flex;
            gap: 8px;
          ">
            <input id="chatbot-input" type="text" placeholder="Ask me anything..." style="
              flex: 1;
              background: rgba(255, 255, 255, 0.05);
              border: 1px solid rgba(100, 200, 255, 0.3);
              border-radius: 8px;
              color: white;
              padding: 8px 12px;
              outline: none;
            " />
            <button id="chatbot-voice" style="
              background: rgba(100, 200, 255, 0.6);
              border: none;
              color: white;
              padding: 8px 12px;
              border-radius: 8px;
              cursor: pointer;
              transition: all 0.3s;
              font-size: 16px;
            ">🎤</button>
            <button id="chatbot-send" style="
              background: rgba(100, 200, 255, 0.6);
              border: none;
              color: white;
              padding: 8px 15px;
              border-radius: 8px;
              cursor: pointer;
              transition: all 0.3s;
            ">📤</button>
          </div>
        </div>
      </div>

      <style>
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        #chatbot-toggle:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(100, 200, 255, 0.6);
        }

        #chatbot-messages::-webkit-scrollbar {
          width: 6px;
        }

        #chatbot-messages::-webkit-scrollbar-track {
          background: rgba(100, 200, 255, 0.1);
          border-radius: 10px;
        }

        #chatbot-messages::-webkit-scrollbar-thumb {
          background: rgba(100, 200, 255, 0.3);
          border-radius: 10px;
        }

        #chatbot-messages::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 200, 255, 0.5);
        }

        .chatbot-message {
          margin-bottom: 12px;
          animation: slideIn 0.3s ease;
        }

        .chatbot-message.bot {
          text-align: left;
        }

        .chatbot-message.user {
          text-align: right;
        }

        .chatbot-message-content {
          display: inline-block;
          max-width: 85%;
          padding: 10px 12px;
          border-radius: 10px;
          word-wrap: break-word;
        }

        .chatbot-message.bot .chatbot-message-content {
          background: rgba(100, 200, 255, 0.2);
          border-left: 3px solid rgba(100, 200, 255, 0.6);
          color: rgba(255, 255, 255, 0.9);
        }

        .chatbot-message.user .chatbot-message-content {
          background: rgba(100, 200, 255, 0.5);
          color: white;
          border-right: 3px solid rgba(100, 200, 255, 0.8);
        }

        .chatbot-offer-card {
          background: rgba(30, 144, 255, 0.1);
          border: 1px solid rgba(100, 200, 255, 0.3);
          border-radius: 10px;
          padding: 10px;
          margin-top: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .chatbot-offer-card:hover {
          background: rgba(30, 144, 255, 0.2);
          transform: translateX(5px);
          box-shadow: 0 4px 12px rgba(100, 200, 255, 0.2);
        }

        .chatbot-typing {
          display: flex;
          gap: 4px;
        }

        .chatbot-typing span {
          width: 8px;
          height: 8px;
          background: rgba(100, 200, 255, 0.6);
          border-radius: 50%;
          animation: bounce 1.4s infinite;
        }

        .chatbot-typing span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .chatbot-typing span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.5;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }
      </style>
    `;

    document.body.insertAdjacentHTML('beforeend', chatbotHTML);

    // Add event listeners
    document.getElementById('chatbot-toggle').addEventListener('click', () => this.toggleChat());
    document.getElementById('chatbot-close').addEventListener('click', () => this.toggleChat());
    document.getElementById('chatbot-send').addEventListener('click', () => this.sendMessage());
    document.getElementById('chatbot-voice').addEventListener('click', () => this.toggleVoiceInput());
    document.getElementById('lang-en').addEventListener('click', () => this.switchLanguage('en'));
    document.getElementById('lang-ta').addEventListener('click', () => this.switchLanguage('ta'));
    document.getElementById('chatbot-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });

    // Initial login welcome greeting with female voice
    setTimeout(() => this.showLoginWelcome(), 1000);
  }

  // 🎤 Show login welcome with user name in female voice
  showLoginWelcome() {
    const userName = this.user.name || this.user.email || 'there';
    const welcomeMessage = `Welcome back, ${userName}! 👋 I'm ready to help you with your exchanges. How can I assist you today? 😊`;
    // Only speak after login, and only once per user
    const lastSpokenUser = localStorage.getItem('chatbot-welcome-user');
    const currentUser = this.user.email || this.user.name || 'unknown';
    if (currentUser && lastSpokenUser !== currentUser) {
      this.addBotMessage(welcomeMessage);
      this.speak(welcomeMessage, true);
      localStorage.setItem('chatbot-welcome-user', currentUser);
      console.log(`✨ Welcome ${userName} to Barter System!`);
    } else {
      this.addBotMessage(welcomeMessage);
      // Do not speak again unless new user logs in
    }
  }

  // Toggle chat window
  toggleChat() {
    this.isOpen = !this.isOpen;
    const window = document.getElementById('chatbot-window');
    const button = document.getElementById('chatbot-toggle');
    const messagesDiv = document.getElementById('chatbot-messages');
    
    if (this.isOpen) {
      window.style.display = 'flex';
      button.style.opacity = '0.7';
      document.getElementById('chatbot-input').focus();
      
      // 🎉 Show greeting when chatbot is first opened (if no messages yet)
      if (messagesDiv.children.length === 0) {
        this.showWelcomeGreeting();
      }
    } else {
      window.style.display = 'none';
      button.style.opacity = '1';
    }
  }

  // 🎉 Show welcome greeting message
  showWelcomeGreeting() {
    const greetings = {
      en: [
        `👋 Hello ${this.user.name || 'there'}! Welcome to Barter System!\n\n✨ I'm here to help you with:\n• Finding products to exchange\n• Posting your offers\n• Understanding how to trade\n• Answering your questions\n\n🎤 Try speaking or typing: "Show me watches" or "Help me post"`,
        
        `🤖 Hey ${this.user.name || 'Friend'}! Ready to exchange?\n\n📚 What can I help you with?\n• Browse by category (bikes, watches, gadgets, etc.)\n• Get exchange tips\n• Find specific items\n• Learn about verification\n\nJust ask! 💬`,
        
        `💡 Welcome! I'm your Barter Assistant.\n\n🔍 Quick options:\n✓ Show me [category]\n✓ How to exchange?\n✓ Help me post an offer\n✓ Find [item]\n\nLet's get trading! 🚀`
      ],
      ta: [
        `👋 வணக்கம் ${this.user.name || 'நண்பே'}! பார்டர் சிஸ்டத்தில் வரவேற்கிறோம்!\n\n✨ உதவ நான் இங்கே இருக்கிறேன்:\n• மாற்றுவதற்கான பொருட்களைக் கண்டுபிடிக்கவும்\n• உங்கள் விமர்சனங்களை வெளியிடவும்\n• வர்த்தகம் செய்வது எப்படி என்பதைப் புரிந்து கொள்ளவும்\n• உங்கள் கேள்விகளுக்கு பதிலளிக்கவும்\n\n🎤 கூற அல்லது டைப் செய்யவும்: "watches காட்டு" அல்லது "இடை உதவி"`,
        
        `🤖 வணக்கம் ${this.user.name || 'நண்பே'}! மாற்ற தயாரா?\n\n📚 நான் உங்களுக்கு என்ன உதவ முடியும்?\n• வகை অनুसार உலாவவும் (bikes, watches, gadgets, முதலியன)\n• பரிமாற்ற குறிப்புகளைப் பெறவும்\n• குறிப்பிட்ட பொருட்களைக் கண்டுபிடிக்கவும்\n• சரிபார்ப்பு பற்றி அறியவும்\n\nகேட்டால் போதும்! 💬`,
        
        `💡 வரவேற்கிறோம்! நான் உங்கள் பார்டர் உதவியாளி.\n\n🔍 விரைவு விருப்பங்கள்:\n✓ எனக்கு [வகை] காட்டு\n✓ மாற்ற எப்படி?\n✓ வெளியிடுவதில் உதவி செய்யவும்\n✓ [item] கண்டுபிடிக்கவும்\n\nவர்த்தகம் செய்வோம்! 🚀`
      ]
    };

    const lang = this.language || 'en';
    const langGreetings = greetings[lang] || greetings['en'];
    const randomGreeting = langGreetings[Math.floor(Math.random() * langGreetings.length)];

    // Add welcome message
    this.addBotMessage(randomGreeting);
    
    // Add quick suggestions after a short delay
    setTimeout(() => {
      const suggestions = this.language === 'ta' 
        ? "💬 நீங்கள் கேட்கலாம்:\n• \"Bikes காட்டு\"\n• \"Watches கண்டுபிடி\"\n• \"உதவி\""
        : "💬 You can ask:\n• \"Show me bikes\"\n• \"Find watches\"\n• \"Help\"";
      
      this.addBotMessage(suggestions);
    }, 1500);
  }

  // Toggle voice input
  toggleVoiceInput() {
    if (!this.recognition) {
      this.addBotMessage("🎤 Voice feature not supported in your browser");
      return;
    }

    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  // Switch language
  switchLanguage(lang) {
    this.language = lang;
    localStorage.setItem("chatbot-language", lang);

    if (this.recognition) {
      this.recognition.lang = lang === "ta" ? "ta-IN" : "en-US";
    }

    // Update language button styles
    const enBtn = document.getElementById("lang-en");
    const taBtn = document.getElementById("lang-ta");

    if (lang === "en") {
      enBtn.style.background = "rgba(100, 200, 255, 0.6)";
      taBtn.style.background = "rgba(100, 200, 255, 0.3)";
    } else {
      enBtn.style.background = "rgba(100, 200, 255, 0.3)";
      taBtn.style.background = "rgba(100, 200, 255, 0.6)";
    }

    // Greet in selected language
    const greeting = lang === "ta" 
      ? "🌐 தமிழ்தில் மொழி மாற்றப்பட்டது!" 
      : "🌐 Language switched to English!";
    
    this.addBotMessage(greeting);
    this.speak(greeting);
  }

  // Add bot message
  addBotMessage(message, isHTML = false, shouldSpeak = true) {
    const messagesDiv = document.getElementById('chatbot-messages');
    const messageEl = document.createElement('div');
    messageEl.className = 'chatbot-message bot';
    
    if (isHTML) {
      messageEl.innerHTML = `<div class="chatbot-message-content">${message}</div>`;
    } else {
      const contentEl = document.createElement('div');
      contentEl.className = 'chatbot-message-content';
      contentEl.textContent = message;
      messageEl.appendChild(contentEl);
    }
    
    messagesDiv.appendChild(messageEl);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    // Speak bot message (unless disabled)
    if (shouldSpeak) {
      this.speak(message);
    }
  }

  // Add user message
  addUserMessage(message) {
    const messagesDiv = document.getElementById('chatbot-messages');
    const messageEl = document.createElement('div');
    messageEl.className = 'chatbot-message user';
    
    const contentEl = document.createElement('div');
    contentEl.className = 'chatbot-message-content';
    contentEl.textContent = message;
    messageEl.appendChild(contentEl);
    
    messagesDiv.appendChild(messageEl);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  // Show typing indicator
  showTyping() {
    const messagesDiv = document.getElementById('chatbot-messages');
    const messageEl = document.createElement('div');
    messageEl.className = 'chatbot-message bot';
    messageEl.id = 'typing-indicator';
    messageEl.innerHTML = `
      <div class="chatbot-message-content">
        <div class="chatbot-typing">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    messagesDiv.appendChild(messageEl);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  // Remove typing indicator
  removeTyping() {
    const typing = document.getElementById('typing-indicator');
    if (typing) typing.remove();
  }

  // Send message
  sendMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    this.addUserMessage(message);
    input.value = '';
    
    this.showTyping();
    
    // Process message after delay for typing effect
    setTimeout(() => {
      this.removeTyping();
      this.processUserMessage(message.toLowerCase());
    }, 800);
  }

  // 🧠 NLP - Extract intent and entities from message
  extractIntent(message) {
    const synonyms = {
      // Category synonyms
      'bike': ['bike', 'bicycle', 'cycle', 'motorcycle', 'two wheeler', 'motor bike'],
      'car': ['car', 'auto', 'automobile', 'vehicle', 'sedan', 'suv', 'truck', 'van'],
      'watch': ['watch', 'wristwatch', 'timepiece', 'chronograph'],
      'book': ['book', 'novel', 'ebook', 'publication', 'textbook', 'story', 'read'],
      'fashion': ['fashion', 'clothes', 'clothing', 'apparel', 'dress', 'outfit', 'wear', 'garment'],
      'gadget': ['gadget', 'gadgets', 'electronic', 'electronics', 'device', 'phone', 'laptop', 'tablet', 'mobile', 'tech', 'technology'],
      'land': ['land', 'property', 'real estate', 'plot', 'acres', 'field'],
      'jewelry': ['jewelry', 'jewellery', 'necklace', 'ring', 'bracelet', 'earring'],
      
      // Intent synonyms
      'search': ['show', 'find', 'search', 'look', 'get', 'browse', 'see', 'display', 'fetch'],
      'suggest': ['suggest', 'recommend', 'what do you have', 'what have you', 'offer'],
      'help': ['help', 'guide', 'how to', 'tutorial', 'teach', 'explain', 'instructions'],
      'profile': ['profile', 'account', 'my info', 'my details', 'user', 'who am i'],
      'about': ['about', 'what is', 'tell me', 'explain', 'how does', 'information']
    };

    // Detect intent - what user wants to do
    let intent = 'general';
    const helpKeywords = ['help', 'guide', 'how', 'tutorial', 'teach', 'instructions', 'what do', 'how to'];
    const searchKeywords = ['show', 'find', 'search', 'look', 'get', 'browse', 'see', 'display', 'fetch', 'want', 'need', 'looking'];
    const suggestKeywords = ['suggest', 'recommend', 'offer', 'available', 'do you have'];
    const profileKeywords = ['profile', 'account', 'my', 'user', 'who am i'];
    const aboutKeywords = ['about', 'what is', 'tell me', 'explain', 'how does', 'information'];

    if (helpKeywords.some(kw => message.includes(kw))) intent = 'help';
    else if (suggestKeywords.some(kw => message.includes(kw))) intent = 'suggest';
    else if (searchKeywords.some(kw => message.includes(kw))) intent = 'search';
    else if (profileKeywords.some(kw => message.includes(kw))) intent = 'profile';
    else if (aboutKeywords.some(kw => message.includes(kw))) intent = 'about';

    // Detect category - what user is looking for
    let category = null;
    for (const [cat, keywords] of Object.entries(synonyms)) {
      if (['bike', 'car', 'watch', 'book', 'fashion', 'gadget', 'land', 'jewelry'].includes(cat)) {
        if (keywords.some(kw => message.includes(kw))) {
          category = cat;
          break;
        }
      }
    }

    return { intent, category, synonyms };
  }

  // 🧠 Fuzzy matching for typo tolerance
  fuzzyMatch(input, candidates) {
    input = input.toLowerCase().trim();
    let bestMatch = null;
    let bestScore = 0;

    for (const candidate of candidates) {
      let score = 0;
      candidate = candidate.toLowerCase();

      // Exact match
      if (input === candidate) return candidate;

      // Contains match
      if (candidate.includes(input) || input.includes(candidate)) score = 0.8;

      // Levenshtein distance (simple version)
      let matches = 0;
      for (let char of input) {
        if (candidate.includes(char)) matches++;
      }
      score = Math.max(score, matches / Math.max(input.length, candidate.length));

      if (score > bestScore) {
        bestScore = score;
        bestMatch = candidate;
      }
    }

    return bestScore > 0.6 ? bestMatch : null;
  }

  // Process user message and provide responses
  processUserMessage(message) {
    // 🧠 Use NLP to extract intent and entities
    const { intent, category } = this.extractIntent(message);

    // Help & Guidance
    if (intent === 'help') {
      this.showHelp(message);
    }
    // Category-based search detected
    else if (category) {
      this.searchByCategory(message, category);
    }
    // Suggest Offers
    else if (intent === 'suggest' || intent === 'search') {
      this.suggestOffers(message);
    }
    // Profile/Account Questions
    else if (intent === 'profile') {
      this.showProfile();
    }
    // About Feature
    else if (intent === 'about') {
      this.aboutBarter();
    }
    // Greetings
    else if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
      this.addBotMessage(`👋 Hi ${this.user.name || 'there'}! How can I assist you today? Try asking: "Show me offers" or "Help me post an offer"`);
    }
    // Default
    else {
      this.smartResponse(message);
    }
  }

  // Get greeting based on time
  getGreeting() {
    const hour = new Date().getHours();
    const name = this.user.name || 'Trader';
    
    if (hour < 12) return `🌅 Good morning, ${name}! Welcome back to Barter. How can I help you today?`;
    if (hour < 18) return `☀️ Good afternoon, ${name}! Ready to find some great exchanges?`;
    return `🌙 Good evening, ${name}! Let's find you the perfect trade!`;
  }

  // Show help and guidance
  showHelp(message) {
    if (message.includes('post') || message.includes('create')) {
      this.addBotMessage(`📝 Here's how to post an offer:

1. Click "📝 Post New Offer" on the right
2. Select a category (Watch, Car, Book, etc.)
3. Enter what you're offering
4. Enter what you need in return
5. Add product details (brand, model, condition)
6. Upload required documents
7. Click "📤 Post Offer"

Tip: More details = Better matches! 💡`);
    } else if (message.includes('exchange') || message.includes('trade')) {
      this.addBotMessage(`🔄 How to make an exchange:

1. Browse available offers
2. Click on an offer you're interested in
3. Click "Exchange" button
4. Provide exchange details (date, location)
5. Send your exchange request
6. Wait for seller approval
7. Meet and complete the exchange!

Tip: Check the product details carefully! ✅`);
    } else if (message.includes('search') || message.includes('find')) {
      this.addBotMessage(`🔍 How to find offers:

1. Use category tabs (Books, Fashion, Gadgets, etc.)
2. Search by keywords
3. Filter by condition
4. Check user ratings
5. View product details
6. Ask me: "Show me gadgets" or "Find watches"

Tip: Use specific keywords for better results! 🎯`);
    } else {
      this.addBotMessage(`📚 I can help you with:

✅ How to post offers
✅ How to search for products
✅ How to make exchanges
✅ Finding specific items
✅ Understanding ratings

What would you like help with? Just ask! 💬`);
    }
  }

  // Suggest offers based on user needs
  suggestOffers(message) {
    if (this.allOffers.length === 0) {
      this.addBotMessage('📭 No offers available right now. Check back soon!');
      return;
    }

    // Extract keywords from message
    let keyword = '';
    let detectedCategory = '';
    const categories = ['watch', 'car', 'bike', 'book', 'fashion', 'gadget', 'land', 'jewelry'];
    
    for (let cat of categories) {
      if (message.includes(cat)) {
        keyword = cat;
        detectedCategory = this.getCategoryPage(cat);
        break;
      }
    }

    // If category detected, navigate to that page
    if (detectedCategory) {
      this.addBotMessage(`🔍 Loading ${keyword} offers... Taking you there now! 🚀`);
      setTimeout(() => {
        window.location.href = detectedCategory + '?fromChat=true';
      }, 1200);
      return;
    }

    // Filter offers for general search
    let suggestions = this.allOffers.filter(offer => {
      if (keyword) {
        return offer.offer.toLowerCase().includes(keyword) || 
               offer.category.toLowerCase().includes(keyword);
      }
      return true;
    }).slice(0, 5);

    if (suggestions.length === 0) {
      this.addBotMessage(`🔍 No offers found for "${keyword}". Try searching for: watches, cars, bikes, books, fashion, gadgets, land, or jewelry!`);
    } else {
      this.addBotMessage(`✨ I found ${suggestions.length} perfect match${suggestions.length > 1 ? 'es' : ''} for you!`);
      
      suggestions.forEach((offer, index) => {
        const condition = offer.productDetails ? JSON.parse(offer.productDetails).condition || 'Unknown' : 'Unknown';
        this.addBotMessage(`
          <strong>${index + 1}. ${offer.offer}</strong><br/>
          <small>Category: ${offer.category} • Condition: ${condition}</small><br/>
          <strong>Looking for:</strong> ${offer.need}<br/>
          <small style="color: rgba(100, 200, 255, 0.7);">Posted by: ${offer.name || 'Unknown'}</small>
        `, true);
      });

      this.addBotMessage('💡 Click on any offer to view full details! Want me to suggest more?');
    }
  }

  // Map category to page file
  getCategoryPage(category) {
    const categoryMap = {
      'watch': 'land.html',
      'car': 'vehicles.html',
      'bike': 'vehicles.html',
      'book': 'books.html',
      'fashion': 'fashion.html',
      'gadget': 'gadgets.html',
      'land': 'land.html',
      'jewelry': 'other.html'
    };
    return categoryMap[category.toLowerCase()] || null;
  }

  // Search by category and navigate
  searchByCategory(message, detectedCategory) {
    let category = '';
    let categoryPage = '';
    const categoryMap = {
      'watch': { page: 'land.html', name: 'watch' },
      'car': { page: 'vehicles.html', name: 'car' },
      'bike': { page: 'vehicles.html', name: 'bike' },
      'book': { page: 'books.html', name: 'books' },
      'fashion': { page: 'fashion.html', name: 'fashion' },
      'gadget': { page: 'gadgets.html', name: 'gadgets' },
      'land': { page: 'land.html', name: 'land' },
      'jewelry': { page: 'other.html', name: 'jewelry' }
    };

    // If detectedCategory provided from NLP, use it
    if (detectedCategory && categoryMap[detectedCategory]) {
      const mapEntry = categoryMap[detectedCategory];
      category = mapEntry.name;
      categoryPage = mapEntry.page;
    } else {
      // Fallback: extract from message
      for (let [key, value] of Object.entries(categoryMap)) {
        if (message.includes(key)) {
          category = value.name;
          categoryPage = value.page;
          break;
        }
      }
    }

    if (!category) {
      this.addBotMessage(`🏷️ I understand you are looking for something! 💭

Try saying:
• "Show me watches or timepieces"
• "Find cars or vehicles"
• "Browse bikes or motorcycles"
• "Looking for books"
• "Show fashion or clothes"
• "Find gadgets or electronics"
• "Search for land"
• "Show jewelry"`);
      return;
    }

    // Show loading message and navigate
    this.addBotMessage(`🔍 Finding ${category} offers for you... Redirecting now! 🚀`);
    setTimeout(() => {
      window.location.href = categoryPage + '?category=' + category + '&fromChat=true';
    }, 1000);
  }

  // Show user profile
  showProfile() {
    const stats = `
      <strong>👤 Your Profile:</strong><br/>
      Name: ${this.user.name || 'Not set'}<br/>
      Email: ${this.user.email || 'Not set'}<br/>
      Rating: ⭐ 5.0<br/>
      Completed Exchanges: 0<br/>
    `;
    
    this.addBotMessage(stats, true);
    this.addBotMessage('📊 Start making exchanges to build your reputation! 💪');
  }

  // About Barter System
  aboutBarter() {
    this.addBotMessage(`🤝 Welcome to Barter System!

We connect traders like you to exchange goods and services without money.

✨ Why use Barter?
• Save money - No cash needed
• Share resources - Reduce waste
• Build community - Meet new people
• Fair exchanges - Both parties benefit

Ready to get started? 🚀`);
  }

  // Smart responses for general queries
  smartResponse(message) {
    const responses = [
      {
        keywords: ['price', 'cost', 'free', 'money'],
        response: '💰 Barter is FREE! No payments, just exchanges. You trade what you have for what you need!'
      },
      {
        keywords: ['safe', 'secure', 'trust', 'safe'],
        response: '🔒 Safety first! We verify users, track all exchanges, and have a rating system. Always meet in public places! ✅'
      },
      {
        keywords: ['popular', 'trending', 'best'],
        response: '🔥 Most popular right now: Electronics, Fashion, Books, and Vehicles. Want to see trending offers?'
      },
      {
        keywords: ['member', 'join', 'register'],
        response: '👋 Welcome to the community! You\'re already signed in. Start posting offers to begin trading!'
      },
      {
        keywords: ['contact', 'support', 'help'],
        response: '📞 Need support? Email us or check the Help section. I\'m here to answer your questions! 💬'
      }
    ];

    let found = false;
    for (let item of responses) {
      if (item.keywords.some(keyword => message.includes(keyword))) {
        this.addBotMessage(item.response);
        found = true;
        break;
      }
    }

    if (!found) {
      this.addBotMessage(`😊 That's interesting! Try asking me:

• "Show me offers"
• "Help me post an offer"
• "Find gadgets"
• "How to trade?"
• "About Barter"

Or I can search for specific items! 🔍`);
    }
  }
}

// Initialize chatbot when page loads
document.addEventListener('DOMContentLoaded', () => {
  window.chatbot = new BarterChatBot();
});

// Legacy function for compatibility
function chat(msg) {
  if (window.chatbot) {
    window.chatbot.addUserMessage(msg);
    window.chatbot.processUserMessage(msg.toLowerCase());
  }
}
