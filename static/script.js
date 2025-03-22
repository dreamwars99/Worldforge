// Set up event listeners for user interactions
function setupEventListeners() {
    // Top menu buttons
    document.getElementById('forge-new-world').addEventListener('click', () => activateMode('forge-new-world'));
    document.getElementById('story-architect').addEventListener('click', () => activateMode('story-architect'));
    document.getElementById('start-imagination').addEventListener('click', () => activateMode('start-imagination'));
    document.getElementById('load-project').addEventListener('click', loadProject);
    document.getElementById('save-project').addEventListener('click', saveProject);
    document.getElementById('intermediate-save').addEventListener('click', intermediateSave);
    document.getElementById('story-weaving').addEventListener('click', storyWeaving);
    
    // Language selector
    document.getElementById('language-select').addEventListener('change', changeLanguage);
    
    // Elemental items in the left sidebar
    const elementalItems = document.querySelectorAll('.elemental-item');
    elementalItems.forEach(item => {
        item.addEventListener('click', function() {
            const elemental = this.getAttribute('data-elemental');
            selectElemental(elemental);
        });
    });
    
    // AI Assistant
    document.getElementById('send-prompt').addEventListener('click', sendAssistantPrompt);
    document.getElementById('assistant-prompt').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendAssistantPrompt();
        }
    });
    
    // Story text area
    document.getElementById('story-text').addEventListener('input', function() {
        state.projectData.story = this.value;
    });
}

// Function to handle selecting an elemental from the sidebar
function selectElemental(elemental) {
    // Remove active class from all elementals
    document.querySelectorAll('.elemental-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to selected elemental
    document.querySelector(`.elemental-item[data-elemental="${elemental}"]`).classList.add('active');
    
    // Update current elemental in state
    state.currentElemental = elemental;
    
    // Show submenu for the selected elemental
    showSubmenu(elemental);
}

// NEW FUNCTION: Activate a specific mode
function activateMode(mode) {
    // Remove active class from all mode buttons
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to selected mode button
    document.getElementById(mode).classList.add('active');
    
    // Update state
    state.currentMode = mode;
    
    // Handle mode-specific UI changes
    switch(mode) {
        case 'forge-new-world':
            // Reset workspace to default state
            resetWorkspace();
            break;
            
        case 'story-architect':
            // Load story architect interface
            loadStoryArchitect();
            break;
            
        case 'start-imagination':
            // Load imagination interface
            activateStartFromImagination();
            break;
    }
}

// Function to reset workspace to default state
function resetWorkspace() {
    const workspace = document.querySelector('.elemental-workspace');
    workspace.innerHTML = `
        <div class="default-message">
            <h2>Start writing your story here...</h2>
            <p>Select a tool from the left sidebar or use one of the top menu options to get started.</p>
        </div>
    `;
}

// Function to load story architect interface
function loadStoryArchitect() {
    const workspace = document.querySelector('.elemental-workspace');
    workspace.innerHTML = `
        <h2>Story Architect</h2>
        <p>Design your story structure using visual flowcharts and templates.</p>
        <div class="placeholder-message">
            <p>This feature will be implemented in the full version.</p>
        </div>
    `;
}

// Function to handle loading a project
function loadProject() {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.wf';
    fileInput.style.display = 'none';
    
    // Add event listener for file selection
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const projectData = JSON.parse(e.target.result);
                    loadProjectData(projectData);
                    addAssistantMessage(`Project "${file.name}" loaded successfully.`);
                } catch (error) {
                    console.error('Error loading project:', error);
                    addAssistantMessage('Error loading project. The file may be corrupted.');
                }
            };
            reader.readAsText(file);
        }
    });
    
    // Trigger file selection dialog
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
}

// Function to handle saving a project
function saveProject() {
    // Get project data
    const projectData = {
        title: 'My WorldForge Project',
        version: '1.0',
        date: new Date().toISOString(),
        story: document.getElementById('story-text').value,
        elements: state.projectData.elements || {}
    };
    
    // Convert to JSON
    const jsonData = JSON.stringify(projectData, null, 2);
    
    // Create download link
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my_project.wf';
    a.style.display = 'none';
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
    
    addAssistantMessage('Project saved successfully.');
}

// Function to handle intermediate save
function intermediateSave() {
    // This would typically save to local storage or perform an auto-save
    localStorage.setItem('worldforge_autosave', document.getElementById('story-text').value);
    addAssistantMessage('Progress saved. Your work is safe.');
}

// Function to handle story weaving
function storyWeaving() {
    addAssistantMessage('Story Weaving feature will be available in the full version.');
}

// Function to handle language change
function changeLanguage() {
    const language = document.getElementById('language-select').value;
    applyTranslations(language);
    addLanguageChangedMessage(language);
}

// Function to send prompt to AI assistant
function sendAssistantPrompt() {
    const promptInput = document.getElementById('assistant-prompt');
    const prompt = promptInput.value.trim();
    
    if (!prompt) {
        return;
    }
    
    // Clear input
    promptInput.value = '';
    
    // Add user message to chat
    const messagesContainer = document.querySelector('.assistant-messages');
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'user-message';
    userMessageDiv.innerHTML = `<p>${prompt}</p>`;
    messagesContainer.appendChild(userMessageDiv);
    
    // Add loading message
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'assistant-message loading';
    loadingDiv.innerHTML = `<p><i class="fas fa-spinner fa-spin"></i> Thinking...</p>`;
    messagesContainer.appendChild(loadingDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Make API call to get response
    fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: prompt }),
    })
    .then(response => response.json())
    .then(data => {
        // Replace loading message with response
        loadingDiv.innerHTML = `<p>${data.response}</p>`;
        loadingDiv.classList.remove('loading');
        
        // Scroll to bottom again
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    })
    .catch(error => {
        console.error('Error:', error);
        loadingDiv.innerHTML = `<p>Sorry, I encountered an error. Please try again.</p>`;
        loadingDiv.classList.remove('loading');
    });
}

// Function to load project data
function loadProjectData(data) {
    // Update story text
    if (data.story) {
        document.getElementById('story-text').value = data.story;
    }
    
    // Update state
    state.projectData = data;
    
    // Update UI based on loaded data
    // This would be expanded in the full version
}
// Add this to your existing elemental menu click handlers
document.querySelectorAll('.elemental-menu-item').forEach(item => {
    item.addEventListener('click', function() {
        // Your existing code for handling elemental menu clicks
        
        // Check if we have data for this elemental from imagination
        const elemental = this.getAttribute('data-elemental') || this.textContent.trim();
        const storageKeys = Object.keys(localStorage).filter(key => 
            key.startsWith(`worldforge_${elemental.toLowerCase()}_`));
        
        // If we have stored data, populate the appropriate fields
        storageKeys.forEach(key => {
            const content = localStorage.getItem(key);
            const submenuName = key.split('_').slice(2).join('_').replace(/_/g, ' ');
            
            // Find the corresponding input field and populate it
            // This will depend on your specific HTML structure
            const inputField = document.querySelector(`[data-submenu="${submenuName}"] textarea, [data-submenu="${submenuName}"] input`);
            if (inputField) {
                inputField.value = content;
            }
        });
    });
});
// Add to script.js
// Central database for all worldbuilding elements
const worldforgeDB = {
    // Initialize from localStorage if available
    init: function() {
        const savedData = localStorage.getItem('worldforge_data');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                this.data = parsedData;
            } catch (e) {
                console.error('Error loading saved data:', e);
                this.data = this.createEmptyDatabase();
            }
        } else {
            this.data = this.createEmptyDatabase();
        }
    },
    
    // Create empty database structure
    createEmptyDatabase: function() {
        const elementals = [
            "Concept", "Worldview", "Time", "Space", "Creatures", 
            "Characters", "Rules", "Nature", "Culture", "Language", 
            "Mythology/Religion", "Philosophy", "Tone & Manner", "Story/Plot"
        ];
        
        const db = {
            imagination: {
                userIdea: '',
                conversation: [],
                elements: {}
            },
            elementals: {}
        };
        
        // Create structure for each elemental
        elementals.forEach(elemental => {
            db.elementals[elemental] = {};
        });
        
        return db;
    },
    
    // Save data to localStorage
    save: function() {
        localStorage.setItem('worldforge_data', JSON.stringify(this.data));
    },
    
    // Save imagination data
    saveImaginationData: function(idea, conversation, elements) {
        this.data.imagination.userIdea = idea || this.data.imagination.userIdea;
        if (conversation) this.data.imagination.conversation = conversation;
        if (elements) this.data.imagination.elements = elements;
        this.save();
    },
    
    // Save elemental data
    saveElementalData: function(elemental, submenu, content) {
        if (!this.data.elementals[elemental]) {
            this.data.elementals[elemental] = {};
        }
        this.data.elementals[elemental][submenu] = content;
        this.save();
    },
    
    // Get imagination data
    getImaginationData: function() {
        return this.data.imagination;
    },
    
    // Get elemental data
    getElementalData: function(elemental, submenu) {
        if (this.data.elementals[elemental] && submenu) {
            return this.data.elementals[elemental][submenu];
        } else if (this.data.elementals[elemental]) {
            return this.data.elementals[elemental];
        }
        return null;
    },
    
    // Data storage
    data: {}
};

// Initialize database on page load
document.addEventListener('DOMContentLoaded', function() {
    worldforgeDB.init();
});

// Add these functions to handle mode switching
function switchToElementalMode(elemental, submenu) {
    // Save current state if in imagination mode
    const imaginationInput = document.getElementById('imagination-input');
    if (imaginationInput) {
        worldforgeDB.saveImaginationData(imaginationInput.value);
    }
    
    // Your existing code to switch to elemental mode...
    
    // Load data for this elemental if available
    const data = worldforgeDB.getElementalData(elemental, submenu);
    if (data) {
        // Find the appropriate input field and populate it
        // This depends on your specific HTML structure
        setTimeout(() => {
            const inputField = document.querySelector('.elemental-workspace textarea, .elemental-workspace input[type="text"]');
            if (inputField && data) {
                inputField.value = data;
            }
        }, 100);
    }
}

function switchToImaginationMode() {
    // Your existing code to switch to imagination mode...
    
    // Load imagination data if available
    setTimeout(() => {
        const imaginationData = worldforgeDB.getImaginationData();
        if (imaginationData.userIdea) {
            const ideaInput = document.getElementById('imagination-input');
            if (ideaInput) {
                ideaInput.value = imaginationData.userIdea;
            }
            
            // Restore conversation if available
            if (imaginationData.conversation && imaginationData.conversation.length > 0) {
                const conversationArea = document.getElementById('imagination-conversation');
                if (conversationArea) {
                    // Rebuild conversation
                    // (implementation depends on your conversation structure)
                }
            }
        }
    }, 100);
}
