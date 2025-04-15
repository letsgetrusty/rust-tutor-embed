(function(){const scriptTag=document.currentScript||(function(){const scripts=document.getElementsByTagName('script');return scripts[scripts.length-1]})();const apiUrl=scriptTag.getAttribute('data-api-url')||'https://api.letsgetrusty.com/chat';const chatTitle=scriptTag.getAttribute('data-chat-title')||'Rust Tutor';const primaryColor=scriptTag.getAttribute('data-primary-color')||'#000000';const prefix='rt-';const style=document.createElement('style');style.textContent=`
    .${ prefix }container {
      --primary-color: #000000;
      --secondary-color: #f3f4f6;
      --text-color: #111827;
      --light-text: #6b7280;
      --border-radius: 12px;
      --shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    }
    
    .${ prefix }container * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    
    /* Chat Bubble */
    .${ prefix }chat-bubble {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      background-color: var(--primary-color);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      box-shadow: var(--shadow);
      z-index: 999;
      transition: transform 0.3s ease;
    }
    
    .${ prefix }chat-bubble:hover {
      transform: scale(1.05);
    }
    
    .${ prefix }chat-bubble svg {
      width: 28px;
      height: 28px;
      fill: white;
    }
    
    /* Chat Window */
    .${ prefix }chat-window {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 460px;
      height: 80%;
      max-height: 700px;
      background-color: white;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow);
      z-index: 998;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform: scale(0);
      transform-origin: bottom right;
      transition: transform 0.3s ease;
    }
    
    .${ prefix }chat-window.active {
      transform: scale(1);
    }
    
    /* Chat Header */
    .${ prefix }chat-header {
      padding: 16px 20px;
      background-color: var(--primary-color);
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .${ prefix }chat-header h3 {
      font-size: 18px;
      font-weight: 600;
      color: white;
    }

    .${ prefix }chat-title-subtext {
      font-size: 14px;
      font-weight: 400;
      color: #b6b6b6;
    }
    
    .${ prefix }header-buttons {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .${ prefix }close-btn, .${ prefix }reset-btn {
      cursor: pointer;
      width: 20px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .${ prefix }close-btn svg, .${ prefix }reset-btn svg {
      width: 18px;
      height: 18px;
      fill: white;
    }
    
    .${ prefix }reset-btn:hover svg, .${ prefix }close-btn:hover svg {
      opacity: 0.8;
    }
    
    /* Chat Body */
    .${ prefix }chat-body {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .${ prefix }message {
      max-width: 85%;
      padding: 12px 16px;
      border-radius: var(--border-radius);
      word-wrap: break-word;
    }
    
    .${ prefix }user-message {
      align-self: flex-end;
      background-color: var(--primary-color);
      color: white;
      border-bottom-right-radius: 4px;
    }
    
    .${ prefix }ai-message {
      align-self: flex-start;
      background-color: var(--secondary-color);
      color: var(--text-color);
      border-bottom-left-radius: 4px;
    }
    
    /* Chat Footer */
    .${ prefix }chat-footer {
      padding: 12px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .${ prefix }chat-input {
      flex: 1;
      border: none;
      outline: none;
      padding: 12px 16px;
      border-radius: 20px;
      background-color: var(--secondary-color);
      font-size: 14px;
    }
    
    .${ prefix }send-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--primary-color);
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      border: none;
      outline: none;
      transition: background-color 0.2s ease;
    }
    
    .${ prefix }send-btn:hover {
      background-color:rgb(255, 75, 4);
    }
    
    .${ prefix }send-btn svg {
      width: 20px;
      height: 20px;
      fill: white;
    }
    
    /* Typing Indicator */
    .${ prefix }typing-indicator {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      background-color: var(--secondary-color);
      border-radius: var(--border-radius);
      align-self: flex-start;
      margin-top: 8px;
      border-bottom-left-radius: 4px;
    }
    
    .${ prefix }typing-indicator span {
      width: 8px;
      height: 8px;
      margin: 0 1px;
      background-color: var(--light-text);
      border-radius: 50%;
      display: inline-block;
      opacity: 0.4;
    }
    
    .${ prefix }typing-indicator span:nth-child(1) {
      animation: pulse 1s infinite;
    }
    
    .${ prefix }typing-indicator span:nth-child(2) {
      animation: pulse 1s infinite 0.2s;
    }
    
    .${ prefix }typing-indicator span:nth-child(3) {
      animation: pulse 1s infinite 0.4s;
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 0.4;
      }
      50% {
        opacity: 1;
      }
    }
    
    /* Hide typing indicator by default */
    .${ prefix }typing-indicator {
      display: none;
    }
    
    /* Hide chat on mobile devices */
    @media (max-width: 480px) {
      .${ prefix }chat-bubble {
        display: none;
      }
    }
    
    /* Move chat bubble up on smaller screens */
    @media (max-width: 700px) and (min-width: 481px) {
      .${ prefix }chat-bubble {
        bottom: 70px;
      }
      
      .${ prefix }chat-window {
        bottom: 140px;
      }
    }
    
    /* Markdown styling */
    .${ prefix }ai-message .${ prefix }message-content {
      line-height: 1.5;
    }
    
    .${ prefix }ai-message .${ prefix }message-content p {
      margin-bottom: 10px;
    }
    
    .${ prefix }ai-message .${ prefix }message-content p:last-child {
      margin-bottom: 0;
    }
    
    .${ prefix }ai-message .${ prefix }message-content pre {
      background-color: #f0f0f0;
      padding: 10px;
      border-radius: 4px;
      overflow-x: auto;
      margin: 10px 0;
    }
    
    .${ prefix }ai-message .${ prefix }message-content code {
      font-family: monospace;
      background-color: #f0f0f0;
      padding: 2px 4px;
      border-radius: 3px;
      font-size: 0.9em;
    }
    
    .${ prefix }ai-message .${ prefix }message-content pre code {
      padding: 0;
      background-color: transparent;
    }
    
    .${ prefix }ai-message .${ prefix }message-content ul, 
    .${ prefix }ai-message .${ prefix }message-content ol {
      margin: 10px 0;
      padding-left: 20px;
    }
    
    .${ prefix }ai-message .${ prefix }message-content h1,
    .${ prefix }ai-message .${ prefix }message-content h2,
    .${ prefix }ai-message .${ prefix }message-content h3,
    .${ prefix }ai-message .${ prefix }message-content h4,
    .${ prefix }ai-message .${ prefix }message-content h5,
    .${ prefix }ai-message .${ prefix }message-content h6 {
      margin-top: 15px;
      margin-bottom: 10px;
    }
    
    .${ prefix }ai-message .${ prefix }message-content a {
      color: var(--primary-color);
      text-decoration: none;
    }
    
    .${ prefix }ai-message .${ prefix }message-content a:hover {
      text-decoration: underline;
    }
    
    .${ prefix }ai-message .${ prefix }message-content blockquote {
      border-left: 3px solid #d1d5db;
      padding-left: 10px;
      margin-left: 0;
      color: #6b7280;
    }
  `;document.head.appendChild(style);const container=document.createElement('div');container.className=`${ prefix }container`;container.innerHTML=`
    <!-- Chat Bubble -->
    <div class="${ prefix }chat-bubble">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11c.894 0 1.776-.088 2.627-.256l3.394 2.547a1 1 0 0 0 1.555-.832v-4.01A10.949 10.949 0 0 0 23 12c0-6.075-4.925-11-11-11zm-1 16h2v-2h-2v2zm0-4h2V7h-2v6z"/>
        </svg>
    </div>
    
    <!-- Chat Window -->
    <div class="${ prefix }chat-window">
        <div class="${ prefix }chat-header">
            <h3>${ chatTitle } <span class="${ prefix }chat-title-subtext">(Alpha)</span></h3>
            <div class="${ prefix }header-buttons">
                <div class="${ prefix }reset-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                        <path fill="white" d="M12 5V2L8 6l4 4V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                    </svg>
                </div>
                <div class="${ prefix }close-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6L6.4 19z"/>
                    </svg>
                </div>
            </div>
        </div>
        <div class="${ prefix }chat-body">
            <div class="${ prefix }message ${ prefix }ai-message">
                👋 Hello! I'm your Rust tutor. How can I help you today?
            </div>
        </div>
        <div class="${ prefix }chat-footer">
            <input type="text" class="${ prefix }chat-input" placeholder="Type your message...">
            <button class="${ prefix }send-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
            </button>
        </div>
    </div>
  `;document.body.appendChild(container);const loadMarked=()=>{return new Promise((resolve)=>{if(window.marked){resolve()}else{const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/marked/marked.min.js';script.onload=()=>resolve();document.head.appendChild(script)}})};loadMarked().then(()=>{const chatBubble=container.querySelector(`.${ prefix }chat-bubble`);const chatWindow=container.querySelector(`.${ prefix }chat-window`);const closeBtn=container.querySelector(`.${ prefix }close-btn`);const chatInput=container.querySelector(`.${ prefix }chat-input`);const sendBtn=container.querySelector(`.${ prefix }send-btn`);const chatBody=container.querySelector(`.${ prefix }chat-body`);const resetBtn=container.querySelector(`.${ prefix }reset-btn`);const typingIndicator=document.createElement('div');typingIndicator.className=`${ prefix }typing-indicator`;typingIndicator.innerHTML='<span></span><span></span><span></span>';typingIndicator.style.display='none';let currentConversationId=null;chatBubble.addEventListener('click',()=>{chatWindow.classList.toggle(`active`)});function sendMessage(){const message=chatInput.value.trim();if(message===''){return}addMessage(message,'user');chatInput.value='';showTypingIndicator();getAIResponse(message).then(response=>{hideTypingIndicator();addMessage(response,'ai')}).catch(error=>{hideTypingIndicator();addMessage("Sorry, I'm having trouble connecting right now.",'ai');console.error('Error:',error)})}sendBtn.addEventListener('click',sendMessage);chatInput.addEventListener('keypress',(e)=>{if(e.key==='Enter'){sendMessage()}});function addMessage(text,sender){if(typingIndicator.parentNode===chatBody){chatBody.removeChild(typingIndicator)}const messageDiv=document.createElement('div');messageDiv.classList.add(`${ prefix }message`,`${ prefix }${ sender }-message`);if(sender==='ai'){messageDiv.innerHTML=`
          <div class="${ prefix }message-content">${marked.parse(text)}</div>
        `}else{messageDiv.innerHTML=text}chatBody.appendChild(messageDiv);chatBody.scrollTop=chatBody.scrollHeight}function showTypingIndicator(){if(typingIndicator.parentNode===chatBody){chatBody.removeChild(typingIndicator)}chatBody.appendChild(typingIndicator);typingIndicator.style.display='flex';chatBody.scrollTop=chatBody.scrollHeight}function hideTypingIndicator(){typingIndicator.style.display='none'}async function getAIResponse(userMessage){try{const response=await fetch(apiUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:userMessage,conversation_id:currentConversationId})});if(!response.ok){throw new Error(`HTTP error! status: ${response.status }`)}const data=await response.json();currentConversationId=data.conversation_id;return data.answer}catch(error){console.error('Error:',error);throw error}}function resetConversation(){currentConversationId=null;chatBody.innerHTML=`
        <div class="${ prefix }message ${ prefix }ai-message">
          👋 Hello! I'm your Rust tutor. How can I help you today?
        </div>
      `}resetBtn.addEventListener('click',resetConversation);closeBtn.addEventListener('click',()=>{chatWindow.classList.remove(`active`);resetConversation()})});window.RustTutorChat={show:function(){const chatWindow=document.querySelector(`.${ prefix }chat-window`);if(chatWindow){chatWindow.classList.add(`active`)}},hide:function(){const chatWindow=document.querySelector(`.${ prefix }chat-window`);if(chatWindow){chatWindow.classList.remove(`active`)}},reset:function(){const resetBtn=document.querySelector(`.${ prefix }reset-btn`);if(resetBtn){resetBtn.click()}}}})();
