/*
 * Copyright 2026 https://faq-knowledge-faq.ai.studio/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 */

(function() {
    if (document.getElementById('ai-assistant-wrapper')) return;

    // --- 1. Inject CSS ---
    const style = document.createElement('style');
    style.innerHTML = `
        #ai-assistant-wrapper {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 2147483647; /* Max z-index to stay on top of everything */
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #fff;
        }

        #ai-floating-ball {
            width: 60px;
            height: 60px;
            background: rgba(30, 30, 30, 0.85);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 30px;
            cursor: grab;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            transition: transform 0.2s, opacity 0.3s ease;
            user-select: none;
            position: absolute;
            bottom: 0;
            right: 0;
        }
        #ai-floating-ball:active { cursor: grabbing; }
        #ai-floating-ball:hover:not(:active) { transform: scale(1.1); }

        #ai-menu-panel {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 350px;
            height: 480px;
            background: rgba(15, 15, 15, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 16px;
            box-shadow: 0 10px 50px rgba(0, 0, 0, 0.6);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            opacity: 0;
            transform: scale(0.8) translateY(20px);
            transform-origin: bottom right;
            pointer-events: none;
            transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
        }

        #ai-menu-panel.ai-open {
            opacity: 1;
            transform: scale(1) translateY(0);
            pointer-events: all;
        }

        #ai-menu-header {
            padding: 15px;
            background: rgba(255,255,255,0.05);
            border-bottom: 1px solid rgba(255,255,255,0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #ai-menu-header-title { font-weight: 600; font-size: 15px; display: flex; align-items: center; gap: 8px; }
        .ai-badge {
            font-size: 9px;
            background: linear-gradient(90deg, #ff8a00, #e52e71);
            padding: 3px 6px;
            border-radius: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        #ai-chat-area {
            flex-grow: 1;
            padding: 15px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 12px;
            scrollbar-width: thin;
            scrollbar-color: rgba(255,255,255,0.2) transparent;
        }
        .ai-msg {
            max-width: 85%;
            padding: 10px 14px;
            border-radius: 14px;
            font-size: 14px;
            line-height: 1.4;
            word-wrap: break-word;
            animation: aiFadeIn 0.3s ease;
        }
        @keyframes aiFadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        
        .ai-msg-user { background: #007aff; color: #fff; align-self: flex-end; border-bottom-right-radius: 4px; }
        .ai-msg-bot { background: rgba(255,255,255,0.1); color: #eee; align-self: flex-start; border-bottom-left-radius: 4px; }
        
        /* Typing Indicator */
        .ai-typing { display: flex; gap: 4px; align-items: center; height: 20px; }
        .ai-dot { width: 6px; height: 6px; background: #bbb; border-radius: 50%; animation: aiBlink 1.4s infinite both; }
        .ai-dot:nth-child(1) { animation-delay: 0.2s; }
        .ai-dot:nth-child(2) { animation-delay: 0.4s; }
        .ai-dot:nth-child(3) { animation-delay: 0.6s; }
        @keyframes aiBlink { 0%, 80%, 100% { opacity: 0.2; } 40% { opacity: 1; } }

        #ai-input-area {
            padding: 12px;
            background: rgba(0,0,0,0.2);
            border-top: 1px solid rgba(255,255,255,0.1);
            display: flex;
            gap: 10px;
        }
        #ai-input {
            flex-grow: 1;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.15);
            color: #fff;
            padding: 10px 15px;
            border-radius: 20px;
            outline: none;
            font-size: 14px;
            transition: all 0.2s;
        }
        #ai-input:focus { border-color: #007aff; background: rgba(255,255,255,0.15); }
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
            transition: transform 0.1s, background 0.2s;
        }
        #ai-send-btn:active { transform: scale(0.9); }
    `;
    document.head.appendChild(style);

    // --- 2. Build DOM ---
    const wrapper = document.createElement('div');
    wrapper.id = 'ai-assistant-wrapper';

    const panel = document.createElement('div');
    panel.id = 'ai-menu-panel';
    panel.innerHTML = `
        <div id="ai-menu-header">
            <div id="ai-menu-header-title">🔮 Site AI <span class="ai-badge">More models soon!</span></div>
            <div style="cursor:pointer; opacity:0.7; font-size: 18px;" id="ai-close-btn">×</div>
        </div>
        <div id="ai-chat-area">
            <div class="ai-msg ai-msg-bot">Hello! I am injected. Try saying:<br>• "dark mode"<br>• "edit page"<br>• "highlight links"<br>• "read page"</div>
        </div>
        <div id="ai-input-area">
            <input type="text" id="ai-input" placeholder="Ask AI..." autocomplete="off" />
            <button id="ai-send-btn">➤</button>
        </div>
    `;

    const ball = document.createElement('div');
    ball.id = 'ai-floating-ball';
    ball.innerHTML = '🔮';

    wrapper.appendChild(panel);
    wrapper.appendChild(ball);
    document.body.appendChild(wrapper);

    // --- 3. UI Logic & Dragging ---
    const chatArea = document.getElementById('ai-chat-area');
    const input = document.getElementById('ai-input');
    const sendBtn = document.getElementById('ai-send-btn');
    const closeBtn = document.getElementById('ai-close-btn');
    let isOpen = false;

    // Drag Logic
    let isDragging = false;
    let dragStartX, dragStartY;

    ball.addEventListener('mousedown', (e) => {
        isDragging = false;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        
        const moveHandler = (moveEvent) => {
            if (Math.abs(moveEvent.clientX - dragStartX) > 5 || Math.abs(moveEvent.clientY - dragStartY) > 5) {
                isDragging = true;
                ball.style.right = 'auto';
                ball.style.bottom = 'auto';
                ball.style.left = (moveEvent.clientX - 30) + 'px';
                ball.style.top = (moveEvent.clientY - 30) + 'px';
            }
        };
        
        const upHandler = () => {
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mouseup', upHandler);
        };
        
        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);
    });

    function toggleMenu(e) {
        if (isDragging) return; // Prevent opening if the user was just dragging the ball
        isOpen = !isOpen;
        if (isOpen) {
            panel.classList.add('ai-open');
            ball.style.transform = 'scale(0)';
            setTimeout(() => input.focus(), 300);
        } else {
            panel.classList.remove('ai-open');
            ball.style.transform = 'scale(1)';
        }
    }

    ball.addEventListener('click', toggleMenu);
    closeBtn.addEventListener('click', toggleMenu);

    // --- 4. Chat & AI Logic ---
    function addMessage(text, sender) {
        const msg = document.createElement('div');
        msg.className = `ai-msg ai-msg-${sender}`;
        msg.innerHTML = text;
        chatArea.appendChild(msg);
        chatArea.scrollTop = chatArea.scrollHeight;
        return msg;
    }

    function showTyping() {
        const typing = document.createElement('div');
        typing.className = 'ai-msg ai-msg-bot ai-typing';
        typing.id = 'ai-typing-indicator';
        typing.innerHTML = '<div class="ai-dot"></div><div class="ai-dot"></div><div class="ai-dot"></div>';
        chatArea.appendChild(typing);
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    function removeTyping() {
        const typing = document.getElementById('ai-typing-indicator');
        if (typing) typing.remove();
    }

    function processCommand(cmd) {
        const query = cmd.toLowerCase();
        addMessage(cmd, 'user');
        input.value = '';
        showTyping();

        // Simulate network delay
        setTimeout(() => {
            removeTyping();

            if (query.includes("dark mode")) {
                document.body.style.backgroundColor = "#121212";
                document.body.style.color = "#ffffff";
                document.body.style.transition = "all 0.5s ease";
                addMessage("Lights out! Dark mode enabled.", 'bot');
            } 
            else if (query.includes("edit page")) {
                if(document.designMode === "on") {
                    document.designMode = "off";
                    addMessage("Page editing disabled. It's locked again.", 'bot');
                } else {
                    document.designMode = "on";
                    addMessage("Page editing enabled! You can now click anywhere on this website and type to change the text.", 'bot');
                }
            }
            else if (query.includes("highlight links")) {
                const links = document.querySelectorAll('a');
                links.forEach(a => {
                    a.style.backgroundColor = "yellow";
                    a.style.color = "black";
                });
                addMessage(`Highlighted ${links.length} links on this page.`, 'bot');
            }
            else if (query.includes("read page")) {
                const title = document.title;
                const msg = new SpeechSynthesisUtterance(`You are currently on a page titled: ${title}`);
                window.speechSynthesis.speak(msg);
                addMessage("I am reading the page title out loud now.", 'bot');
            }
            else if (query.includes("remove images")) {
                const imgs = document.querySelectorAll('img');
                imgs.forEach(img => img.style.display = 'none');
                addMessage(`I hid ${imgs.length} images on this website.`, 'bot');
            }
            else {
                addMessage("I hear you! To connect me to a real brain, you can add your API fetch request inside my JavaScript code. More models are coming soon!", 'bot');
            }
        }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
    }

    sendBtn.addEventListener('click', () => {
        if (input.value.trim()) processCommand(input.value.trim());
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && input.value.trim()) processCommand(input.value.trim());
    });
})();
