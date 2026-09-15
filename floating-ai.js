(function() {
    // Prevent multiple injections
    if (document.getElementById('ai-assistant-wrapper')) return;

    // --- 1. Inject CSS ---
    const style = document.createElement('style');
    style.innerHTML = `
        #ai-assistant-wrapper {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        /* Floating Ball */
        #ai-floating-ball {
            width: 60px;
            height: 60px;
            background: rgba(30, 30, 30, 0.8);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 30px;
            cursor: pointer;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease;
        }
        #ai-floating-ball:hover {
            transform: scale(1.1);
        }

        /* AI Menu Panel */
        #ai-menu-panel {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 350px;
            height: 450px;
            background: rgba(20, 20, 20, 0.95);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            
            /* Animation Starting State */
            opacity: 0;
            transform: scale(0.8) translateY(20px);
            transform-origin: bottom right;
            pointer-events: none;
            transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
        }

        /* Animation Active State */
        #ai-menu-panel.ai-open {
            opacity: 1;
            transform: scale(1) translateY(0);
            pointer-events: all;
        }

        /* Menu Header */
        #ai-menu-header {
            padding: 15px;
            background: rgba(255,255,255,0.05);
            border-bottom: 1px solid rgba(255,255,255,0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #fff;
        }
        #ai-menu-header-title {
            font-weight: 600;
            font-size: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .ai-badge {
            font-size: 10px;
            background: linear-gradient(90deg, #ff8a00, #e52e71);
            padding: 3px 8px;
            border-radius: 12px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        /* Chat Area */
        #ai-chat-area {
            flex-grow: 1;
            padding: 15px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .ai-msg {
            max-width: 85%;
            padding: 10px 14px;
            border-radius: 12px;
            font-size: 14px;
            line-height: 1.4;
            word-wrap: break-word;
        }
        .ai-msg-user {
            background: #007aff;
            color: #fff;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
        }
        .ai-msg-bot {
            background: rgba(255,255,255,0.1);
            color: #eee;
            align-self: flex-start;
            border-bottom-left-radius: 4px;
        }

        /* Input Area */
        #ai-input-area {
            padding: 15px;
            border-top: 1px solid rgba(255,255,255,0.1);
            display: flex;
            gap: 10px;
        }
        #ai-input {
            flex-grow: 1;
            background: rgba(0,0,0,0.5);
            border: 1px solid rgba(255,255,255,0.2);
            color: #fff;
            padding: 10px 15px;
            border-radius: 20px;
            outline: none;
            font-size: 14px;
            transition: border-color 0.2s;
        }
        #ai-input:focus {
            border-color: #007aff;
        }
        #ai-send-btn {
            background: #007aff;
            border: none;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: background 0.2s;
        }
        #ai-send-btn:hover {
            background: #005bb5;
        }
    `;
    document.head.appendChild(style);

    // --- 2. Build the DOM ---
    const wrapper = document.createElement('div');
    wrapper.id = 'ai-assistant-wrapper';

    const panel = document.createElement('div');
    panel.id = 'ai-menu-panel';

    const header = document.createElement('div');
    header.id = 'ai-menu-header';
    header.innerHTML = `
        <div id="ai-menu-header-title">🔮 Site AI <span class="ai-badge">More models coming soon!</span></div>
        <div style="cursor:pointer; opacity:0.7;" id="ai-close-btn">✖</div>
    `;

    const chatArea = document.createElement('div');
    chatArea.id = 'ai-chat-area';
    chatArea.innerHTML = `<div class="ai-msg ai-msg-bot">Hello! I am injected into this page. Tell me to "summarize page", "dark mode", or ask me anything.</div>`;

    const inputArea = document.createElement('div');
    inputArea.id = 'ai-input-area';
    inputArea.innerHTML = `
        <input type="text" id="ai-input" placeholder="Ask AI to do something..." autocomplete="off" />
        <button id="ai-send-btn">➤</button>
    `;

    panel.appendChild(header);
    panel.appendChild(chatArea);
    panel.appendChild(inputArea);

    const ball = document.createElement('div');
    ball.id = 'ai-floating-ball';
    ball.innerHTML = '🔮';

    wrapper.appendChild(panel);
    wrapper.appendChild(ball);
    document.body.appendChild(wrapper);

    // --- 3. Interaction Logic ---
    const input = document.getElementById('ai-input');
    const sendBtn = document.getElementById('ai-send-btn');
    const closeBtn = document.getElementById('ai-close-btn');
    let isOpen = false;

    function toggleMenu() {
        isOpen = !isOpen;
        if (isOpen) {
            panel.classList.add('ai-open');
            ball.style.transform = 'scale(0)'; // Hide ball when open
            setTimeout(() => input.focus(), 300);
        } else {
            panel.classList.remove('ai-open');
            ball.style.transform = 'scale(1)'; // Show ball
        }
    }

    ball.addEventListener('click', toggleMenu);
    closeBtn.addEventListener('click', toggleMenu);

    function addMessage(text, sender) {
        const msg = document.createElement('div');
        msg.className = \`ai-msg ai-msg-\${sender}\`;
        msg.innerText = text;
        chatArea.appendChild(msg);
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    // --- 4. AI Page Scripts & Logic ---
    function processCommand(cmd) {
        const query = cmd.toLowerCase();
        
        // Add user message
        addMessage(cmd, 'user');
        input.value = '';

        // Simulate AI processing delay
        setTimeout(() => {
            if (query.includes("dark mode")) {
                document.body.style.backgroundColor = "#121212";
                document.body.style.color = "#ffffff";
                addMessage("I've inverted the page colors to dark mode for you.", 'bot');
            } 
            else if (query.includes("summarize page") || query.includes("what is this page")) {
                const title = document.title;
                const h1 = document.querySelector('h1') ? document.querySelector('h1').innerText : 'No main heading';
                addMessage(\`This page is titled "\${title}". The main heading is "\${h1}".\`, 'bot');
            }
            else if (query.includes("remove images")) {
                const imgs = document.querySelectorAll('img');
                imgs.forEach(img => img.style.display = 'none');
                addMessage(\`I hid \${imgs.length} images on this website.\`, 'bot');
            }
            else {
                // Placeholder for connecting to a real API (like Gemini/Claude)
                addMessage("I hear you! To connect me to a real brain, you can add your API fetch request inside my JavaScript code. More models are coming soon!", 'bot');
            }
        }, 600);
    }

    sendBtn.addEventListener('click', () => {
        if (input.value.trim()) processCommand(input.value.trim());
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && input.value.trim()) {
            processCommand(input.value.trim());
        }
    });

})();
