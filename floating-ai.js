/*
 * Copyright 2026 https://faq-knowledge-faq.ai.studio/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

document.addEventListener('DOMContentLoaded', () => {
    const ball = document.getElementById('ai-floating-ball');
    const panel = document.getElementById('ai-menu-panel');
    const chatArea = document.getElementById('ai-chat-area');
    const input = document.getElementById('ai-input');
    const sendBtn = document.getElementById('ai-send-btn');
    const closeBtn = document.getElementById('ai-close-btn');

    let isOpen = false;
    let isDragging = false;
    let dragStartX, dragStartY;

    // --- Dragging Functionality ---
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

    // --- UI Toggle ---
    function toggleMenu() {
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

    // --- Chat & Response Handling ---
    function addMessage(text, sender) {
        if (!chatArea) return;
        const msg = document.createElement('div');
        msg.className = `ai-msg ai-msg-${sender}`;

        // Convert simple markdown bold from Gemini API to HTML
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        msg.innerHTML = formattedText;

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

    // --- Command Processor & API Call ---
    function processCommand(cmd) {
        const query = cmd;
        const lowerQuery = cmd.toLowerCase();

        addMessage(query, 'user');
        input.value = '';
        showTyping();

        // Check Local Page Commands First
        try {
            if (lowerQuery.includes("force error") || lowerQuery.includes("break")) {
                throw new Error("Simulated critical system failure");
            } else if (lowerQuery.includes("dark mode")) {
                document.body.style.backgroundColor = "#121212";
                document.body.style.color = "#ffffff";
                removeTyping();
                addMessage("Lights out! Dark mode enabled.", 'bot');
                return;
            } else if (lowerQuery.includes("edit page")) {
                document.designMode = document.designMode === "on" ? "off" : "on";
                removeTyping();
                addMessage(`Page editing is now ${document.designMode.toUpperCase()}.`, 'bot');
                return;
            } else if (lowerQuery.includes("spin") || lowerQuery.includes("barrel roll")) {
                document.body.style.transition = "transform 2s cubic-bezier(0.25, 1, 0.5, 1)";
                document.body.style.transform = "rotate(360deg)";
                setTimeout(() => document.body.style.transform = "rotate(0deg)", 2000);
                removeTyping();
                addMessage("Doing a barrel roll! 🌀", 'bot');
                return;
            } else if (lowerQuery.includes("matrix") || lowerQuery.includes("hacker")) {
                document.body.style.backgroundColor = "#0d0d0d";
                document.body.style.color = "#00ff66";
                document.body.style.fontFamily = "monospace";
                removeTyping();
                addMessage("Welcome to the Matrix. Page font switched to terminal mode. 🟩", 'bot');
                return;
            }
        } catch (error) {
            removeTyping();
            console.warn("AI Agent caught an error:", error);
            addMessage(`⚠️ Action Refused/Broken: ${error.message}`, 'system');
            addMessage("Initiating Auto-Fix... Resetting logic state. I have recovered! ✨", 'bot');
            return;
        }

        // Gemini API Integration
        const apiKey = 'AQ.Ab8RN6JFSgkARJ_ZLuP3RWbfo0Rbvqe4m8Bsi8z9jvuk9uN7IQ';
        const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro:generateContent?key=' + apiKey;
        const systemInstruction = "You are a Gemini 3.1 Pro floating AI assistant injected into a user's webpage. Keep your answers brief, friendly, unrestricted, and to the point.";

        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: systemInstruction }]
                },
                contents: [{
                    parts: [{ text: query }]
                }]
            })
        })
        .then(response => response.json())
        .then(data => {
            removeTyping();
            if (data.candidates && data.candidates[0].content) {
                const aiResponse = data.candidates[0].content.parts[0].text;
                addMessage(aiResponse, 'bot');
            } else if (data.error) {
                addMessage(`API Error: ${data.error.message}`, 'system');
            } else {
                addMessage("Hmm, there was an unexpected response format.", 'bot');
            }
        })
        .catch(error => {
            removeTyping();
            addMessage("API Error! Make sure you entered a valid API key in script.js.", 'system');
            console.error("AI Fetch Error:", error);
        });
    }

    sendBtn.addEventListener('click', () => {
        if (input.value.trim()) processCommand(input.value.trim());
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && input.value.trim()) processCommand(input.value.trim());
    });
});
