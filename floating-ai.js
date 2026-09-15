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
    // Prevent double injection
    if (document.getElementById('ai-assistant-wrapper')) return;

    // --- 1. Inject CSS ---
    const style = document.createElement('style');
    style.innerHTML = `
        #ai-assistant-wrapper {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 2147483647; /* Max z-index to stay on top */
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
            border: 1px solid rgba(255,255,255,0.15);
            border-radius: 16px;
            box-shadow: 0 10px 50px rgba(0, 0, 0, 0.6);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            opacity: 0;
            transform: scale(0.8) translateY(20px);
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
        .ai-msg-system { background: rgba(255, 59, 48, 0.2); color: #ff453a; border: 1px solid rgba(255, 59, 48, 0.5); align-self: center; font-size: 12px; text-align: center; }
        
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
        }
        #ai-input:focus { border-color: #007aff; }
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
        }
    `;
    document.head.appendChild(style);

    // --- 2. Build DOM ---
    const wrapper = document.createElement('div');
    wrapper.id = 'ai-assistant-wrapper';

    const panel = document.createElement('div');
    panel.id = 'ai-menu-panel';
    panel.innerHTML = `
        <div id="ai-menu-header">
            <div id="ai-menu-header-title">🔮 Site AI <span class="ai-badge">Auto-Fix Enabled</span></div>
            <div style="cursor:pointer; opacity:0.7; font-size: 18px;" id="ai-close-btn">×</div>
        </div>
        <div id="ai-chat-area">
            <div class="ai-msg ai-msg-bot">Hello! I am protected by Auto-Fix protocols. If a script breaks, I will recover. <br><br>Try: "dark mode", "edit page", or "force error".</div>
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

    // --- 3. SELF-HEALING OBSERVER (AUTO-FIX UI) ---
    // If the user deletes the AI ball while in "edit page" mode, it respawns instantly.
    const bodyObserver = new MutationObserver((mutations) => {
        if (!document.getElementById('ai-assistant-wrapper')) {
            document.body.appendChild(wrapper);
            addMessage("UI deletion detected. Auto-fixing and respawning interface... 🛠️", "system");
        }
    });
    bodyObserver.observe(document.body, { childList: true, subtree: true });

    // --- 4. UI Logic & Dragging ---
    const chatArea = document.getElementById('ai-chat-area');
    const input = document.getElementById('ai-input');
    const sendBtn = document.getElementById('ai-send-btn');
    const closeBtn = document.getElementById('ai-close-btn');
    let isOpen = false;
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
        if (isDragging) return; 
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

    // --- 5. Chat & Auto-Fix AI Logic ---
    function addMessage(text, sender) {
        if (!document.getElementById('ai-chat-area')) return; // Sanity check
        const msg = document.createElement('div');
        msg.className = `ai-msg ai-msg-${sender}`;
        msg.innerHTML = text;
        chatArea.appendChild(msg);
        chatArea.scrollTop = chatArea.scrollHeight;
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

        setTimeout(() => {
            removeTyping();

            // === CRASH PROTECTION (AUTO-FIX BLOCK) ===
            try {
                
                if (query.includes("force error") || query.includes("break")) {
                    // Purposefully causing an error to demonstrate auto-fix
                    throw new Error("Simulated critical system failure");
                }
                else if (query.includes("dark mode")) {
                    document.body.style.backgroundColor = "#121212";
                    document.body.style.color = "#ffffff";
                    addMessage("Lights out! Dark mode enabled.", 'bot');
                } 
                else if (query.includes("edit page")) {
                    document.designMode = document.designMode === "on" ? "off" : "on";
                    addMessage(`Page editing is now ${document.designMode.toUpperCase()}.`, 'bot');
                }
                else if (query.includes("highlight links")) {
                    const links = document.querySelectorAll('a');
                    if(links.length === 0) throw new Error("No links found on this page to highlight.");
                    links.forEach(a => { a.style.backgroundColor = "yellow"; a.style.color = "black"; });
                    addMessage(`Highlighted ${links.length} links.`, 'bot');
                }
                else {
                    // Fallback mechanism instead of just refusing
                    addMessage(`I am not connected to an LLM to answer "${cmd}", but I've noted the request. More models are coming soon!`, 'bot');
                }

            } catch (error) {
                // AUTO-FIX TRIGGERED: Catches errors so the script doesn't die.
                console.warn("AI Agent caught an error:", error);
                addMessage(`⚠️ Action Refused/Broken: ${error.message}`, 'system');
                addMessage("Initiating Auto-Fix... Resetting logic state. I have recovered! ✨", 'bot');
            }
            // ==========================================

        }, 800 + Math.random() * 800);
    }

    sendBtn.addEventListener('click', () => {
        if (input.value.trim()) processCommand(input.value.trim());
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && input.value.trim()) processCommand(input.value.trim());
    });
})();
