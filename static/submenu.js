document.addEventListener('DOMContentLoaded', function() {
    // Initialize submenu system
    initSubmenuSystem();
});

// Function to initialize the submenu system
function initSubmenuSystem() {
    // Add event listeners to elemental items
    const elementalItems = document.querySelectorAll('.elemental-item');
    elementalItems.forEach(item => {
        item.addEventListener('click', function() {
            const elemental = this.getAttribute('data-elemental');
            showSubmenu(elemental);
        });
    });
}

// Function to show submenu for the selected elemental
function showSubmenu(elemental) {
    // Remove active class from all elementals
    document.querySelectorAll('.elemental-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to selected elemental
    document.querySelector(`.elemental-item[data-elemental="${elemental}"]`).classList.add('active');
    
    // Get the submenu panel
    const submenuPanel = document.getElementById('submenu-panel');
    
    // Get the template for the selected elemental
    const templateId = `${elemental}-submenu`;
    const template = document.getElementById(templateId);
    
    if (template) {
        // Clear current submenu content
        submenuPanel.innerHTML = '';
        
        // Clone the template content and append to submenu panel
        const content = template.content.cloneNode(true);
        submenuPanel.appendChild(content);
        
        // Add active class to submenu panel
        submenuPanel.classList.add('active');
        
        // Add event listeners to submenu items
        const submenuItems = submenuPanel.querySelectorAll('.submenu-item');
        submenuItems.forEach(item => {
            item.addEventListener('click', function() {
                const submenu = this.getAttribute('data-submenu');
                selectSubmenu(submenu, elemental);
            });
        });
    } else {
        console.error(`Template not found for elemental: ${elemental}`);
    }
}

// Function to handle selecting a submenu item
function selectSubmenu(submenu, elemental) {
    // Remove active class from all submenu items
    document.querySelectorAll('.submenu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to selected submenu item
    document.querySelector(`.submenu-item[data-submenu="${submenu}"]`).classList.add('active');
    
    // Update the workspace area based on the selected submenu
    updateWorkspace(elemental, submenu);
}

// Function to update the workspace area based on selected elemental and submenu
function updateWorkspace(elemental, submenu) {
    const workspace = document.querySelector('.elemental-workspace');
    
    // Clear current workspace content
    workspace.innerHTML = '';
    
    // Create header for the workspace
    const header = document.createElement('h2');
    header.textContent = formatTitle(submenu);
    workspace.appendChild(header);
    
    // Create description for the workspace
    const description = document.createElement('p');
    description.textContent = getSubmenuDescription(elemental, submenu);
    workspace.appendChild(description);
    
    // Create form elements based on the submenu
    createWorkspaceForm(workspace, elemental, submenu);
}

// Function to create form elements for the workspace
function createWorkspaceForm(workspace, elemental, submenu) {
    const formContainer = document.createElement('div');
    formContainer.className = 'workspace-form';
    
    // For demo purposes, we'll implement the Space > Geography submenu
    if (elemental === 'space' && submenu === 'geography') {
        // Create a form for geography
        const form = document.createElement('form');
        form.id = 'geography-form';
        
        // Create input for terrain type
        const terrainGroup = document.createElement('div');
        terrainGroup.className = 'form-group';
        
        const terrainLabel = document.createElement('label');
        terrainLabel.textContent = 'Terrain Type:';
        terrainLabel.setAttribute('for', 'terrain-type');
        
        const terrainInput = document.createElement('input');
        terrainInput.type = 'text';
        terrainInput.id = 'terrain-type';
        terrainInput.placeholder = 'e.g., Mountains, Desert, Forest';
        
        terrainGroup.appendChild(terrainLabel);
        terrainGroup.appendChild(terrainInput);
        
        // Create textarea for description
        const descGroup = document.createElement('div');
        descGroup.className = 'form-group';
        
        const descLabel = document.createElement('label');
        descLabel.textContent = 'Description:';
        descLabel.setAttribute('for', 'geography-description');
        
        const descTextarea = document.createElement('textarea');
        descTextarea.id = 'geography-description';
        descTextarea.rows = 5;
        descTextarea.placeholder = 'Describe the geographical features of your world...';
        
        descGroup.appendChild(descLabel);
        descGroup.appendChild(descTextarea);
        
        // Create button to generate with AI
        const aiButton = document.createElement('button');
        aiButton.type = 'button';
        aiButton.id = 'generate-geography';
        aiButton.className = 'ai-generate-btn';
        aiButton.innerHTML = '<i class="fas fa-magic"></i> Generate with AI';
        aiButton.addEventListener('click', generateGeographyWithAI);
        
        // Create button to save
        const saveButton = document.createElement('button');
        saveButton.type = 'button';
        saveButton.id = 'save-geography';
        saveButton.className = 'save-btn';
        saveButton.innerHTML = '<i class="fas fa-save"></i> Save';
        saveButton.addEventListener('click', saveGeography);
        
        // Append all elements to the form
        form.appendChild(terrainGroup);
        form.appendChild(descGroup);
        form.appendChild(aiButton);
        form.appendChild(saveButton);
        
        // Append form to container
        formContainer.appendChild(form);
    } else {
        // For other submenus, show a placeholder message
        const placeholder = document.createElement('div');
        placeholder.className = 'placeholder-message';
        placeholder.textContent = `This feature (${formatTitle(submenu)}) will be implemented in the full version.`;
        formContainer.appendChild(placeholder);
    }
    
    workspace.appendChild(formContainer);
}

// Function to generate geography with AI
function generateGeographyWithAI() {
    const terrainType = document.getElementById('terrain-type').value;
    
    if (!terrainType) {
        addAssistantMessage("Please enter a terrain type first.");
        return;
    }
    
    addAssistantMessage(`Generating geography details for terrain type: ${terrainType}...`);
    
    // Make API call to the backend
    fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: `Generate a detailed description of a ${terrainType} terrain for a fictional world. Include climate, flora, fauna, and unique geographical features.`
        }),
    })
    .then(response => response.json())
    .then(data => {
        // Update the description textarea with the AI-generated content
        document.getElementById('geography-description').value = data.response;
        
        // Add confirmation message
        addAssistantMessage("Geography details generated! You can edit them as needed.");
    })
    .catch(error => {
        console.error('Error:', error);
        addAssistantMessage("There was an error generating geography details. Please try again.");
    });
}

// Function to save geography data
function saveGeography() {
    const terrainType = document.getElementById('terrain-type').value;
    const description = document.getElementById('geography-description').value;
    
    if (!terrainType || !description) {
        addAssistantMessage("Please fill in all fields before saving.");
        return;
    }
    
    // Add confirmation message
    addAssistantMessage("Geography details saved successfully!");
    
    // Clear form
    document.getElementById('terrain-type').value = '';
    document.getElementById('geography-description').value = '';
}

// Function to format submenu title (convert kebab-case to Title Case)
function formatTitle(submenu) {
    return submenu
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Function to get description for a submenu
function getSubmenuDescription(elemental, submenu) {
    // This could be expanded with more detailed descriptions
    const descriptions = {
        'space': {
            'geography': 'Define the geographical features of your world, including terrain types, landforms, and natural formations.',
            'locations': 'Create and manage specific locations within your world.',
            'maps': 'Design and visualize maps of your world.',
            'scale-size': 'Define the scale and size of your world.',
            'environmental-features': 'Describe environmental features that make your world unique.'
        }
    };
    
    if (descriptions[elemental] && descriptions[elemental][submenu]) {
        return descriptions[elemental][submenu];
    }
    
    return `Create and manage ${formatTitle(submenu)} for your world.`;
}

// Function to add a message from the AI assistant
function addAssistantMessage(message) {
    const messagesContainer = document.querySelector('.assistant-messages');
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'assistant-message';
    
    const messagePara = document.createElement('p');
    messagePara.textContent = message;
    
    messageDiv.appendChild(messagePara);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to the bottom of the messages container
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}