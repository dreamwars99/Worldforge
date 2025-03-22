// Translation Loader for WorldForge
// This script handles loading and applying translations from the JSON database

let translationsData = null;
let currentLanguage = 'en';

// Load translations from JSON file
async function loadTranslations() {
    try {
        // Updated path to reference the static folder in Flask
        const response = await fetch('/static/translations.json');
        if (!response.ok) {
            throw new Error(`Failed to load translations: ${response.status}`);
        }
        translationsData = await response.json();
        console.log('Translations loaded successfully');
        
        // Apply initial translations based on saved language or default to English
        const savedLanguage = localStorage.getItem('worldforge_language') || 'en';
        
        // Set the language selector to match the saved/default language
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.value = savedLanguage;
        }
        
        // Apply translations
        applyTranslations(savedLanguage);
    } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback to English if translations fail to load
        currentLanguage = 'en';
        
        // Set the language selector to English
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.value = 'en';
        }
    }
}

// Apply translations to all UI elements based on selected language
function applyTranslations(language) {
    if (!translationsData || !translationsData[language]) {
        console.error(`Translations not available for language: ${language}`);
        return;
    }
    
    currentLanguage = language;
    localStorage.setItem('worldforge_language', language);
    
    // Update the data-lang attribute on the body element
    document.body.setAttribute('data-lang', language);
    
    // Apply translations to all UI elements
    applyTopNavigationTranslations();
    applyCategoryTranslations();
    applyElementalsTranslations();
    applyAIAssistantTranslations();
    applyCommonUITranslations();
    
    // If a submenu is open, update its content
    updateCurrentSubmenu();
    
    console.log(`Language changed to: ${language}`);
}

// Apply translations to top navigation elements
function applyTopNavigationTranslations() {
    const topNav = translationsData[currentLanguage].top_navigation;
    
    // Update logo text
    const logoText = document.querySelector('.logo-text');
    if (logoText) {
        logoText.textContent = topNav.worldforge;
    }
    
    // Update menu buttons
    updateButtonText('forge-new-world', topNav.forge_new_world);
    updateButtonText('story-architect', topNav.story_architect);
    updateButtonText('start-imagination', topNav.start_from_imagination);
    updateButtonText('load-project', topNav.load_project);
    updateButtonText('save-project', topNav.save_project);
    updateButtonText('intermediate-save', topNav.intermediate_save);
    updateButtonText('story-weaving', topNav.story_weaving);
}

// Apply translations to category labels
function applyCategoryTranslations() {
    const categories = translationsData[currentLanguage].categories;
    
    // Update category labels
    const categoryLabels = document.querySelectorAll('.menu-category-label');
    categoryLabels.forEach(label => {
        if (label.parentElement.classList.contains('mode-category')) {
            label.textContent = categories.mode;
        } else if (label.parentElement.classList.contains('project-category')) {
            label.textContent = categories.project_management;
        } else if (label.parentElement.classList.contains('special-category')) {
            label.textContent = categories.special_function;
        }
    });
}

// Apply translations to elementals in the left sidebar
function applyElementalsTranslations() {
    const elementals = translationsData[currentLanguage].elementals;
    
    // Update elemental items in the sidebar
    document.querySelectorAll('.elemental-item').forEach(item => {
        const elementalKey = item.getAttribute('data-elemental');
        const translationKey = elementalKey.replace(/-/g, '_'); // Convert hyphens to underscores
        const elementalText = elementals[translationKey];
        
        if (elementalText) {
            // Clear the item's content first, preserving only the icon
            const icon = item.querySelector('i.fas');
            if (icon) {
                // Remove all child nodes except the icon
                while (item.firstChild) {
                    item.removeChild(item.firstChild);
                }
                
                // Add back the icon and the translated text
                item.appendChild(icon);
                item.appendChild(document.createTextNode(` ${elementalText}`));
            }
        }
    });
}

// Apply translations to AI Assistant panel
function applyAIAssistantTranslations() {
    const assistant = translationsData[currentLanguage].ai_assistant;
    
    // Update assistant header
    const assistantHeader = document.querySelector('.assistant-header h3');
    if (assistantHeader) {
        assistantHeader.textContent = assistant.title;
    }
    
    // Update placeholder text in input
    const assistantInput = document.getElementById('assistant-prompt');
    if (assistantInput) {
        assistantInput.placeholder = assistant.ask_anything;
    }
}

// Apply translations to common UI elements
function applyCommonUITranslations() {
    const commonUI = translationsData[currentLanguage].common_ui;
    
    // Update story text placeholder
    const storyText = document.getElementById('story-text');
    if (storyText) {
        storyText.placeholder = commonUI.start_writing;
    }
    
    // Update default message in workspace
    const defaultMessage = document.querySelector('.default-message');
    if (defaultMessage) {
        const heading = defaultMessage.querySelector('h2');
        const paragraph = defaultMessage.querySelector('p');
        
        if (heading) {
            heading.textContent = commonUI.start_writing;
        }
        
        if (paragraph) {
            paragraph.textContent = commonUI.select_elemental;
        }
    }
}

// Update the currently open submenu with translations
function updateCurrentSubmenu() {
    const currentElemental = state.currentElemental;
    if (currentElemental) {
        // Close and reopen the submenu to refresh its content with new translations
        const submenuPanel = document.getElementById('submenu-panel');
        const wasActive = submenuPanel.classList.contains('active');
        
        if (wasActive) {
            // Store current scroll position
            const scrollPos = submenuPanel.scrollTop;
            
            // Reopen the submenu with new translations
            showSubmenu(currentElemental);
            
            // Restore scroll position
            submenuPanel.scrollTop = scrollPos;
            
            // If a submenu item was selected, reselect it
            if (state.currentSubmenu) {
                const submenuItem = document.querySelector(`.submenu-item[data-submenu="${state.currentSubmenu}"]`);
                if (submenuItem) {
                    submenuItem.classList.add('active');
                }
            }
        }
    }
}

// Helper function to update button text
function updateButtonText(id, text) {
    const button = document.getElementById(id);
    if (button) {
        // Preserve the icon
        const icon = button.querySelector('i');
        if (icon) {
            button.innerHTML = '';
            button.appendChild(icon);
            button.appendChild(document.createTextNode(` ${text}`));
        } else {
            button.textContent = text;
        }
    }
}

// Add a message to the assistant panel about language change
function addLanguageChangedMessage(language) {
    const languageNames = {
        'en': 'English',
        'ko': 'Korean',
        'ja': 'Japanese',
        'zh': 'Chinese'
    };
    
    const languageName = languageNames[language] || language;
    addAssistantMessage(`Language changed to ${languageName}.`);
}

// Override the original showSubmenu function to use translations
function showSubmenu(elemental) {
    const submenuPanel = document.getElementById('submenu-panel');
    
    // Get the template for the selected elemental
    const templateId = `${elemental}-submenu`;
    const template = document.getElementById(templateId);
    
    if (template) {
        // Clear current submenu content
        submenuPanel.innerHTML = '';
        
        // Clone the template content
        const content = template.content.cloneNode(true);
        
        // Apply translations to the cloned content
        applySubmenuTranslations(content, elemental);
        
        // Append to submenu panel
        submenuPanel.appendChild(content);
        
        // Add active class to submenu panel
        submenuPanel.classList.add('active');
        
        // Add event listeners to submenu items
        const submenuItems = submenuPanel.querySelectorAll('.submenu-item');
        submenuItems.forEach(item => {
            item.addEventListener('click', function() {
                const submenu = this.getAttribute('data-submenu');
                selectSubmenu(submenu);
            });
        });
    } else {
        console.error(`Template not found for elemental: ${elemental}`);
    }
}

// Apply translations to submenu content
function applySubmenuTranslations(content, elemental) {
    const elementalKey = elemental.replace(/-/g, '_'); // Convert hyphens to underscores
    
    // Get translations for this elemental
    const headerTranslations = translationsData[currentLanguage].submenu_headers[elementalKey];
    const itemTranslations = translationsData[currentLanguage].submenu_items[elementalKey];
    
    if (!headerTranslations || !itemTranslations) {
        console.error(`Translations not found for elemental: ${elemental}`);
        return;
    }
    
    // Update header and description
    const header = content.querySelector('.submenu-header h3');
    const description = content.querySelector('.submenu-header p');
    
    if (header) {
        header.textContent = headerTranslations.header;
    }
    
    if (description) {
        description.textContent = headerTranslations.description;
    }
    
    // Update submenu items
    const items = content.querySelectorAll('.submenu-item');
    items.forEach(item => {
        const itemKey = item.getAttribute('data-submenu').replace(/-/g, '_');
        const translation = itemTranslations[itemKey];
        
        if (translation) {
            item.textContent = translation;
        }
    });
}

// Function to get translation for a specific key
function getTranslation(section, key) {
    if (!translationsData || !translationsData[currentLanguage]) {
        return null;
    }
    
    const sectionData = translationsData[currentLanguage][section];
    if (!sectionData) {
        return null;
    }
    
    return sectionData[key] || null;
}

// Function to format submenu title with proper translation
function formatTitle(submenu) {
    // This function would be called from the original script
    const submenuKey = submenu.replace(/-/g, '_');
    const elemental = state.currentElemental.replace(/-/g, '_');
    
    if (translationsData && translationsData[currentLanguage] && 
        translationsData[currentLanguage].submenu_items && 
        translationsData[currentLanguage].submenu_items[elemental]) {
        
        return translationsData[currentLanguage].submenu_items[elemental][submenuKey] || submenu;
    }
    
    return submenu;
}

// Function to get submenu description with proper translation
function getSubmenuDescription(elemental, submenu) {
    // This would be called from the original script
    // For now, return a placeholder
    return `Description for ${submenu} in ${elemental}`;
}

// Initialize translations when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadTranslations();
});

// Export functions for use in other scripts
window.translationSystem = {
    applyTranslations,
    getTranslation,
    formatTitle,
    getSubmenuDescription
};

// Integrate with the original changeLanguage function
// This preserves the original functionality while adding translation support
const originalChangeLanguage = window.changeLanguage;
window.changeLanguage = function() {
    const selectedLanguage = document.getElementById('language-select').value;
    
    // Update state (original functionality)
    state.projectData.language = selectedLanguage;
    
    // Apply translations (new functionality)
    applyTranslations(selectedLanguage);
    
    // Add message to assistant (original functionality)
    addLanguageChangedMessage(selectedLanguage);
};