// Enhanced Start from Imagination functionality with advanced prompt
document.addEventListener('DOMContentLoaded', function() {
    // Advanced prompt directly included in the file
    const advancedPrompt = `
You are WorldForge AI, an advanced worldbuilding assistant specialized in decomposing narrative ideas into 14 elemental components and recognizing cross-element dependencies. You act as a knowledgeable co-creator, not just a responder.

Your task is to analyze the user's creative idea and help develop it into a complete story world by:

1. CLASSIFICATION: Identify the most relevant elementals and specific subcategories from the user's idea.
   - Precisely classify the idea within the 14 elementals framework: Concept, Worldview, Time, Space, Creatures, Characters, Rules, Nature, Culture, Language, Mythology/Religion, Philosophy, Tone & Manner, Story/Plot
   - Focus on the 2-4 most relevant elementals rather than forcing all 14
   - Specify the exact submenu category for each identified elemental

2. CROSS-LINKING: Recognize meaningful connections between elementals.
   - Identify how the primary elemental affects or relates to secondary elementals
   - Explain these relationships with specific examples
   - Highlight potential conflicts or synergies between elements

3. TARGETED QUESTIONS: Generate unique, context-sensitive questions that:
   - Fill missing worldbuilding details
   - Probe unusual narrative consequences
   - Suggest cross-element synergies
   - Avoid generic questions like "tell me more"

4. SCALE ASSESSMENT: Determine the appropriate scope for the story world.
   - Assess whether the idea suits a short story or feature-length narrative
   - Consider if it requires an epic setting (like Avatar or Lord of the Rings) or a more intimate scale
   - Recommend focusing on elementals that highlight the idea's uniqueness

5. FORMAT: Structure your response as follows:
   - Begin with a brief analysis of the core idea
   - List the 2-4 most relevant elementals with their specific submenus
   - For each elemental, provide specific extracted data and implications
   - Identify cross-links between elementals with clear rationales
   - Pose 3-5 highly specific, derivative questions that bridge different elementals
   - After each question, note the relevant elemental/submenu in parentheses
   - Conclude with a recommendation on story scale and focus

Remember to prioritize depth over breadth, focusing on the most relevant elementals rather than trying to cover all 14. Your goal is to help the user develop their idea into a rich, coherent world with unique and interconnected elements.
    `;

    // Elements for Start from Imagination
    const startImaginationBtn = document.getElementById('start-imagination');
    const workspaceArea = document.querySelector('.elemental-workspace');
    
    // Event listener for Start from Imagination button
    if (startImaginationBtn) {
        startImaginationBtn.addEventListener('click', function() {
            activateStartFromImagination();
        });
    }
    
    // Function to activate Start from Imagination mode
    function activateStartFromImagination() {
        // Update UI to show we're in Start from Imagination mode
        document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
        startImaginationBtn.classList.add('active');
        
        // Add the enhanced CSS directly to the page
        const styleElement = document.createElement('style');
        styleElement.textContent = `
/* Enhanced CSS for Start from Imagination UI */

/* Larger input window */
.imagination-input-container {
    margin: 20px 0;
}

#imagination-input {
    width: 100%;
    min-height: 120px; /* Increased height */
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 16px;
    font-family: inherit;
    resize: vertical;
    transition: border-color 0.3s;
}

#imagination-input:focus {
    border-color: #6c5ce7;
    outline: none;
    box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.2);
}

/* Improved conversation area */
.imagination-conversation {
    margin-top: 25px;
    border-radius: 8px;
    background-color: #f8f9fa;
    padding: 0;
    max-height: 500px;
    overflow-y: auto;
}

.ai-message, .user-message {
    padding: 15px 20px;
    margin: 0;
    border-bottom: 1px solid #eee;
}

.ai-message {
    background-color: #f0f2ff;
}

.user-message {
    background-color: #fff;
}

.ai-message p, .user-message p {
    margin: 0 0 10px 0;
}

.ai-message p:last-child, .user-message p:last-child {
    margin-bottom: 0;
}

/* Improved user response area */
.user-response-container {
    display: flex;
    margin: 20px 0;
    gap: 10px;
}

#user-followup {
    flex-grow: 1;
    min-height: 80px;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 16px;
    font-family: inherit;
    resize: vertical;
}

#user-followup:focus {
    border-color: #6c5ce7;
    outline: none;
    box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.2);
}

#send-followup {
    align-self: flex-end;
    height: 40px;
    padding: 0 20px;
    background-color: #6c5ce7;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
}

#send-followup:hover {
    background-color: #5b4bc4;
}

/* Improved elements display */
.imagination-elements {
    margin-top: 30px;
    display: none;
}

.elements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
    margin-top: 15px;
}

.element-card {
    background-color: white;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
}

.element-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.element-card h4 {
    margin: 0 0 10px 0;
    color: #6c5ce7;
    font-size: 18px;
}

.element-card p {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
}

/* Improved button styling */
#idea-to-world-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    background-color: #6c5ce7;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
}

#idea-to-world-btn:hover {
    background-color: #5b4bc4;
    transform: translateY(-2px);
}

#idea-to-world-btn:active {
    transform: translateY(0);
}

#idea-to-world-btn i {
    margin-right: 8px;
}

/* Loading indicator */
.loading-indicator {
    display: flex;
    align-items: center;
    color: #6c5ce7;
    font-style: italic;
}

.loading-indicator i {
    margin-right: 8px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Error message */
.error-message {
    padding: 15px;
    background-color: #ffebee;
    color: #c62828;
    border-radius: 8px;
    margin: 15px 0;
}

/* Elemental classification styling */
.elemental-tag {
    display: inline-block;
    padding: 3px 8px;
    background-color: #e0e7ff;
    color: #3949ab;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    margin-right: 5px;
    margin-bottom: 5px;
}

.submenu-tag {
    display: inline-block;
    padding: 2px 6px;
    background-color: #f0f2ff;
    color: #6c5ce7;
    border-radius: 4px;
    font-size: 11px;
    margin-right: 5px;
    margin-bottom: 5px;
}

/* Cross-link visualization */
.cross-link {
    margin: 15px 0;
    padding: 10px;
    background-color: #f5f5f5;
    border-left: 3px solid #6c5ce7;
    border-radius: 0 8px 8px 0;
}

.cross-link-title {
    font-weight: 600;
    color: #6c5ce7;
    margin-bottom: 5px;
}

/* Targeted questions styling */
.targeted-question {
    margin: 10px 0;
    padding: 10px 15px;
    background-color: #f0f7ff;
    border-radius: 8px;
    position: relative;
}

.targeted-question:before {
    content: "Q";
    position: absolute;
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
    background-color: #6c5ce7;
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
}

.question-tag {
    font-size: 11px;
    color: #6c5ce7;
    font-style: italic;
    margin-top: 5px;
    display: block;
}

/* Scale assessment section */
.scale-assessment {
    margin-top: 20px;
    padding: 15px;
    background-color: #f9f9f9;
    border-radius: 8px;
}

.scale-assessment h4 {
    margin-top: 0;
    color: #333;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .elements-grid {
        grid-template-columns: 1fr;
    }
    
    .user-response-container {
        flex-direction: column;
    }
    
    #send-followup {
        align-self: stretch;
        margin-top: 10px;
    }
}
        `;
        document.head.appendChild(styleElement);
        
        // Clear workspace and prepare Start from Imagination interface
        workspaceArea.innerHTML = `
            <div class="imagination-interface">
                <h2 class="imagination-title">Start from Imagination</h2>
                <p class="imagination-description">Enter your creative idea below. It can be a single word, a character, a scene, or any spark of inspiration. The AI will help you develop it into a complete world.</p>
                
                <div class="imagination-input-container">
                    <textarea id="imagination-input" placeholder="Enter your idea here... (e.g., 'A world where shadows have consciousness', 'A reluctant hero with the ability to speak to the dead', etc.)"></textarea>
                </div>
                
                <button id="idea-to-world-btn" class="btn primary-btn">
                    <i class="fas fa-brain"></i> Idea to World
                </button>
                
                <div id="imagination-conversation" class="imagination-conversation">
                    <!-- Conversation between AI and user will appear here -->
                </div>
                
                <div id="imagination-elements" class="imagination-elements">
                    <h3>Elements Identified</h3>
                    <div class="elements-grid">
                        <!-- Elements identified by AI will appear here -->
                    </div>
                </div>
            </div>
        `;
        
        // Add event listener to the Idea to World button
        const ideaToWorldBtn = document.getElementById('idea-to-world-btn');
        if (ideaToWorldBtn) {
            ideaToWorldBtn.addEventListener('click', processIdeaToWorld);
        }
    }
    
    // Function to process the idea and start the conversation
    async function processIdeaToWorld() {
        const ideaInput = document.getElementById('imagination-input');
        const conversationArea = document.getElementById('imagination-conversation');
        const elementsGrid = document.querySelector('.elements-grid');
        
        if (!ideaInput || !ideaInput.value.trim()) {
            alert('Please enter an idea first.');
            return;
        }
        
        const userIdea = ideaInput.value.trim();
        
        // Show loading state
        conversationArea.innerHTML = `
            <div class="ai-message">
                <div class="loading-indicator">
                    <i class="fas fa-spinner fa-spin"></i> Analyzing your idea...
                </div>
            </div>
        `;
        
        try {
            // Prepare the prompt with the user's idea
            const fullPrompt = `${advancedPrompt}\n\nUser's idea: "${userIdea}"`;
            
            // Call the backend API to process the idea
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message: fullPrompt
                }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to process idea');
            }
            
            const data = await response.json();
            
            // Extract elements from the response
            const elements = extractElementsFromResponse(data.response, userIdea);
            
            // Format the AI response with enhanced styling
            const formattedResponse = formatAIResponse(data.response);
            
            // Display AI response
            conversationArea.innerHTML = `
                <div class="ai-message">
                    ${formattedResponse}
                </div>
            `;
            
            // Add user response input
            conversationArea.innerHTML += `
                <div class="user-response-container">
                    <textarea id="user-followup" placeholder="Respond to the AI's questions..."></textarea>
                    <button id="send-followup" class="btn">
                        <i class="fas fa-paper-plane"></i> Send
                    </button>
                </div>
            `;
            
            // Display identified elements
            if (elements.length > 0) {
                elementsGrid.innerHTML = '';
                elements.forEach(element => {
                    elementsGrid.innerHTML += `
                        <div class="element-card" data-elemental="${element.category.toLowerCase()}">
                            <h4>${element.category}</h4>
                            <p>${element.content}</p>
                            ${element.submenu ? `<span class="submenu-tag">${element.submenu}</span>` : ''}
                        </div>
                    `;
                });
                
                document.getElementById('imagination-elements').style.display = 'block';
            }
            
            // Add event listener to the send followup button
            const sendFollowupBtn = document.getElementById('send-followup');
            if (sendFollowupBtn) {
                sendFollowupBtn.addEventListener('click', sendFollowupResponse);
            }
            
        } catch (error) {
            console.error('Error processing idea:', error);
            conversationArea.innerHTML = `
                <div class="error-message">
                    <p>Sorry, there was an error processing your idea. Please try again.</p>
                </div>
            `;
        }
    }
    
    // Function to format AI response with enhanced styling
    function formatAIResponse(response) {
        // Add styling for elemental tags
        let formatted = response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Style elemental references in parentheses
        formatted = formatted.replace(/\(([\w\s&]+)→([\w\s&]+)\)/g, '<span class="question-tag">($1 → $2)</span>');
        
        // Style targeted questions
        formatted = formatted.replace(/(\d+\.\s*".*?")/g, '<div class="targeted-question">$1</div>');
        
        // Add styling for cross-links
        if (formatted.includes("CROSS-LINKING") || formatted.includes("Cross-Link")) {
            formatted = formatted.replace(/(Cross-Link.*?)(?=\n\n|$)/gs, '<div class="cross-link"><div class="cross-link-title">Cross-Link</div>$1</div>');
        }
        
        // Style elemental tags
        const elementals = ["Concept", "Worldview", "Time", "Space", "Creatures", "Characters", "Rules", "Nature", "Culture", "Language", "Mythology/Religion", "Philosophy", "Tone & Manner", "Story/Plot"];
        elementals.forEach(elemental => {
            const regex = new RegExp(`\\b${elemental}\\b(?!.*?class="elemental-tag")`, 'g');
            formatted = formatted.replace(regex, `<span class="elemental-tag">${elemental}</span>`);
        });
        
        // Convert newlines to paragraphs
        formatted = '<p>' + formatted.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>') + '</p>';
        
        return formatted;
    }
    
    // Function to extract elements from AI response
    function extractElementsFromResponse(response, originalIdea) {
        const elements = [];
        const elementals = {
            "Concept": ["Core Premise", "Themes", "Logline", "Unique Selling Points"],
            "Worldview": ["Prime Order", "Societal Values", "Moral Systems"],
            "Time": ["Historical Timeline", "Era/Period", "Time Mechanics", "Significant Events"],
            "Space": ["Scale & Size of World", "Geography", "Locations", "Maps", "Environmental Features"],
            "Creatures": ["Species", "Fauna", "Flora", "Magical Beings", "Mutants", "Synthetic Organisms"],
            "Characters": ["My Characters Management", "Character Relationships Management", "Tribe & Factions Management", 
                          "The Eight Hero's Journey Archetypes", "Michael Hauge's Four Categories", 
                          "Jungian Character Archetypes", "MBTI", "Enneagram"],
            "Rules": ["Prime Principle", "World Rules", "Natural Laws", "Magic Systems", "Technology", "Limitations"],
            "Nature": ["Ecosystems", "Climate", "Natural Resources", "Environmental Factors"],
            "Culture": ["Traditions", "Economic System", "Arts", "Social Structures", "Customs"],
            "Language": ["Spoken Languages", "Written Systems", "Create Language", "Communication Methods"],
            "Mythology/Religion": ["Deities", "Creation Myths", "Religious Practices", "Spiritual Beliefs"],
            "Philosophy": ["Schools of Thought", "Ethical Systems", "Knowledge Systems", "Influential Thinkers"],
            "Tone & Manner": ["Atmosphere", "Genre", "Stylistic Approach", "Emotional Palette", "Narrative Voice"],
            "Story/Plot": ["Story Management", "Structure", "Arcs", "Conflicts", "Resolutions"]
        };
        
        // Look for elemental classifications in the response
        for (const [elemental, submenus] of Object.entries(elementals)) {
            // Check if the elemental is mentioned in the response
            if (response.includes(elemental)) {
                // Try to find which submenu is relevant
                let submenu = null;
                let content = "";
                
                // Look for submenu mentions
                for (const sub of submenus) {
                    if (response.includes(sub)) {
                        submenu = sub;
                        break;
                    }
                }
                
                // Extract content related to this elemental
                const elementalRegex = new RegExp(`${elemental}[^.]*\\.(.*?)(?=\\n\\n|$)`, 's');
                const match = response.match(elementalRegex);
                if (match && match[1]) {
                    content = match[1].trim();
                } else {
                    // If no specific content found, use a generic message
                    content = `${elemental} aspects identified in your idea: "${originalIdea}"`;
                }
                
                // Add to elements array
                elements.push({
                    category: elemental,
                    submenu: submenu,
                    content: content
                });
            }
        }
        
        // If no elements were identified, add a default one
        if (elements.length === 0) {
            elements.push({
                category: "Concept",
                submenu: "Core Premise",
                content: "Creative seed idea: " + originalIdea
            });
        }
        
        // Limit to the 4 most relevant elements
        return elements.slice(0, 4);
    }
    
    // Function to send followup response and continue the conversation
    async function sendFollowupResponse() {
        const userFollowup = document.getElementById('user-followup');
        const conversationArea = document.getElementById('imagination-conversation');
        const elementsGrid = document.querySelector('.elements-grid');
        
        if (!userFollowup || !userFollowup.value.trim()) {
            alert('Please enter your response first.');
            return;
        }
        
        const userResponse = userFollowup.value.trim();
        
        // Add user message to conversation
        conversationArea.innerHTML += `
            <div class="user-message">
                <p>${userResponse}</p>
            </div>
        `;
        
        // Remove the response input
        const responseContainer = document.querySelector('.user-response-container');
        if (responseContainer) {
            responseContainer.remove();
        }
        
        // Show loading state
        conversationArea.innerHTML += `
            <div class="ai-message">
                <div class="loading-indicator">
                    <i class="fas fa-spinner fa-spin"></i> Thinking...
                </div>
            </div>
        `;
        
        try {
            // Call the backend API to continue the conversation
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message: `User response: "${userResponse}"
                    
                    Continue helping the user develop their story world based on their response. 
                    Identify any new worldbuilding elements that emerge from their response.
                    Ask follow-up questions to further develop the world.
                    
                    Remember to:
                    1. Focus on the most relevant elementals rather than all 14
                    2. Make connections between different elementals
                    3. Ask specific, targeted questions that bridge different elements
                    4. Format your response with clear sections and elemental references`
                }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to continue conversation');
            }
            
            const data = await response.json();
            
            // Extract new elements from the response
            const newElements = extractElementsFromResponse(data.response, userResponse);
            
            // Format the AI response with enhanced styling
            const formattedResponse = formatAIResponse(data.response);
            
            // Replace loading indicator with AI response
            const loadingIndicator = document.querySelector('.loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.parentElement.innerHTML = formattedResponse;
            }
            
            // Add user response input again
            conversationArea.innerHTML += `
                <div class="user-response-container">
                    <textarea id="user-followup" placeholder="Respond to the AI's questions..."></textarea>
                    <button id="send-followup" class="btn">
                        <i class="fas fa-paper-plane"></i> Send
                    </button>
                </div>
            `;
            
            // Update identified elements
            if (newElements.length > 0) {
                // Add new elements to the grid
                newElements.forEach(element => {
                    // Check if this element category already exists
                    const existingElement = document.querySelector(`.element-card[data-elemental="${element.category.toLowerCase()}"]`);
                    if (existingElement) {
                        // Update existing element
                        existingElement.querySelector('p').textContent = element.content;
                        if (element.submenu) {
                            let submenuTag = existingElement.querySelector('.submenu-tag');
                            if (submenuTag) {
                                submenuTag.textContent = element.submenu;
                            } else {
                                existingElement.innerHTML += `<span class="submenu-tag">${element.submenu}</span>`;
                            }
                        }
                    } else {
                        // Add new element
                        elementsGrid.innerHTML += `
                            <div class="element-card" data-elemental="${element.category.toLowerCase()}">
                                <h4>${element.category}</h4>
                                <p>${element.content}</p>
                                ${element.submenu ? `<span class="submenu-tag">${element.submenu}</span>` : ''}
                            </div>
                        `;
                    }
                });
            }
            
            // Add event listener to the send followup button
            const sendFollowupBtn = document.getElementById('send-followup');
            if (sendFollowupBtn) {
                sendFollowupBtn.addEventListener('click', sendFollowupResponse);
            }
            
        } catch (error) {
            console.error('Error continuing conversation:', error);
            const loadingIndicator = document.querySelector('.loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.parentElement.innerHTML = `
                    <p class="error-text">Sorry, there was an error processing your response. Please try again.</p>
                `;
            }
            
            // Add user response input again to retry
            conversationArea.innerHTML += `
                <div class="user-response-container">
                    <textarea id="user-followup" placeholder="Respond to the AI's questions..."></textarea>
                    <button id="send-followup" class="btn">
                        <i class="fas fa-paper-plane"></i> Send
                    </button>
                </div>
            `;
            
            // Add event listener to the send followup button
            const sendFollowupBtn = document.getElementById('send-followup');
            if (sendFollowupBtn) {
                sendFollowupBtn.addEventListener('click', sendFollowupResponse);
            }
        }
    }
});
// Add this near the top of your imagination.js file
// Global state to store imagination data
const worldforgeState = {
    imagination: {
        userIdea: '',
        aiResponses: [],
        userResponses: [],
        identifiedElements: {}
    }
};

// Modify the processIdeaToWorld function to save data
async function processIdeaToWorld() {
    const ideaInput = document.getElementById('imagination-input');
    const conversationArea = document.getElementById('imagination-conversation');
    const elementsGrid = document.querySelector('.elements-grid');
    
    if (!ideaInput || !ideaInput.value.trim()) {
        alert('Please enter an idea first.');
        return;
    }
    
    const userIdea = ideaInput.value.trim();
    
    // Save to global state
    worldforgeState.imagination.userIdea = userIdea;
    
    // Rest of your existing function...
    
    // After extracting elements, save them to state
    if (elements.length > 0) {
        elements.forEach(element => {
            // Save to global state
            if (!worldforgeState.imagination.identifiedElements[element.category]) {
                worldforgeState.imagination.identifiedElements[element.category] = {
                    submenu: element.submenu,
                    content: element.content
                };
            }
            
            // Also save to the appropriate elemental submenu
            saveToElementalSubmenu(element.category, element.submenu, element.content);
        });
        
        // Rest of your existing element display code...
    }
}

// Add this function to save data to elemental submenus
function saveToElementalSubmenu(elemental, submenu, content) {
    // This function will save the content to the appropriate elemental submenu
    console.log(`Saving to ${elemental} → ${submenu}: ${content}`);
    
    // Create a storage key for this elemental and submenu
    const storageKey = `worldforge_${elemental.toLowerCase()}_${submenu ? submenu.toLowerCase().replace(/\s+/g, '_') : 'general'}`;
    
    // Save to localStorage for persistence across page reloads
    localStorage.setItem(storageKey, content);
}

// Add this function to restore data when returning to Start from Imagination
function restoreImaginationState() {
    if (worldforgeState.imagination.userIdea) {
        const ideaInput = document.getElementById('imagination-input');
        if (ideaInput) {
            ideaInput.value = worldforgeState.imagination.userIdea;
        }
        
        // If we have AI responses, restore the conversation
        if (worldforgeState.imagination.aiResponses.length > 0) {
            const conversationArea = document.getElementById('imagination-conversation');
            if (conversationArea) {
                // Rebuild conversation from saved responses
                conversationArea.innerHTML = '';
                
                for (let i = 0; i < worldforgeState.imagination.aiResponses.length; i++) {
                    // Add AI response
                    conversationArea.innerHTML += `
                        <div class="ai-message">
                            ${worldforgeState.imagination.aiResponses[i]}
                        </div>
                    `;
                    
                    // Add user response if available
                    if (worldforgeState.imagination.userResponses[i]) {
                        conversationArea.innerHTML += `
                            <div class="user-message">
                                <p>${worldforgeState.imagination.userResponses[i]}</p>
                            </div>
                        `;
                    }
                }
                
                // Add response input if needed
                if (worldforgeState.imagination.aiResponses.length > worldforgeState.imagination.userResponses.length) {
                    conversationArea.innerHTML += `
                        <div class="user-response-container">
                            <textarea id="user-followup" placeholder="Respond to the AI's questions..."></textarea>
                            <button id="send-followup" class="btn">
                                <i class="fas fa-paper-plane"></i> Send
                            </button>
                        </div>
                    `;
                    
                    // Add event listener to the send followup button
                    const sendFollowupBtn = document.getElementById('send-followup');
                    if (sendFollowupBtn) {
                        sendFollowupBtn.addEventListener('click', sendFollowupResponse);
                    }
                }
            }
            
            // Restore elements display
            if (Object.keys(worldforgeState.imagination.identifiedElements).length > 0) {
                const elementsGrid = document.querySelector('.elements-grid');
                if (elementsGrid) {
                    elementsGrid.innerHTML = '';
                    
                    for (const [category, data] of Object.entries(worldforgeState.imagination.identifiedElements)) {
                        elementsGrid.innerHTML += `
                            <div class="element-card" data-elemental="${category.toLowerCase()}">
                                <h4>${category}</h4>
                                <p>${data.content}</p>
                                ${data.submenu ? `<span class="submenu-tag">${data.submenu}</span>` : ''}
                            </div>
                        `;
                    }
                    
                    document.getElementById('imagination-elements').style.display = 'block';
                }
            }
        }
    }
}

// Modify the activateStartFromImagination function to restore state
function activateStartFromImagination() {
    // Your existing code...
    
    // After setting up the interface, restore the state
    setTimeout(restoreImaginationState, 100);
}

// Modify the sendFollowupResponse function to save responses
async function sendFollowupResponse() {
    // Your existing code...
    
    // After getting user response
    const userResponse = userFollowup.value.trim();
    
    // Save to global state
    worldforgeState.imagination.userResponses.push(userResponse);
    
    // After getting AI response
    // Add this inside the try block after formatting the response
    worldforgeState.imagination.aiResponses.push(formattedResponse);
    
    // Rest of your existing function...
}
