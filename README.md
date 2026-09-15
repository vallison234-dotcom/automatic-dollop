# Floating AI Web Assistant 🔮

A lightweight, plug-and-play JavaScript widget that adds an interactive floating AI assistant to any webpage. It features a sleek glass-morphism floating ball, smooth expand/collapse animations, and built-in scripts to interact with the DOM (like enabling dark mode or summarizing the page).

## ✨ Features
* **Floating Emoji Orb (🔮):** Docks neatly in the bottom corner of the screen.
* **Fluid UI Animations:** Smooth transitions when opening and closing the chat panel.
* **DOM Interactivity:** Can manipulate the website you are currently on (e.g., hiding images, changing styles).
* **Future-Proof:** Built with a modular function ready to connect to real LLM APIs. *(Note: More models are coming soon!)*

## 🚀 How to Use

**Option 1: Inject via Browser Console (Quick Test)**
1. Copy the entire code from `floating-ai.js`.
2. Open your browser's Developer Tools (F12 or Right-Click -> Inspect).
3. Go to the **Console** tab.
4. Paste the code and press Enter.

**Option 2: Embed in your GitHub/WebSim HTML Projects**
Add the script just before your closing `</body>` tag:
\`\`\`html
<script src="https://github.com/vallison234-dotcom/automatic-dollop/blob/main/floating-ai.js"></script>
\`\`\`

---

## ❓ Frequently Asked Questions (FAQ)

### Is this a "Real" AI?
Out of the box, the script acts as a **UI shell with simulated logic**. It uses standard JavaScript `if/else` statements to look for specific keywords (like "dark mode" or "summarize page") and directly manipulates the website's code in response. 

However, the interface is completely ready for a **real AI brain**. You can easily replace the placeholder logic inside the `processCommand()` function with a `fetch()` request to connect it to an actual AI model (like Google Gemini, Anthropic Claude, or OpenAI). We will be adding official support for these models soon!

### Why isn't the floating ball showing up on some websites? (Why did it get blocked?)
If you try to click this bookmark shortcut script into the website on certain websites (like GitHub, Twitter, or banking sites), you might see a red error in the console, and the ball won't appear. 

This happens because of a web security standard called **Content Security Policy (CSP)**. 
* **What is CSP?** It is a security layer that websites use to prevent hackers from injecting malicious scripts (Cross-Site Scripting or XSS). 
* **Why it blocks the ball:** High-security websites tell your browser, *"Do not run any JavaScript that doesn't come directly from our own servers."* When you click the floating ball code bookmark into the website, the browser blocks it to follow the website's safety rules.

**Where does it work best?**
The script works perfectly on your own HTML projects, local development environments, WebSim sandboxes, and standard websites with relaxed CSP rules. 

---
*Created for web prototyping and interactive DOM manipulation.*
