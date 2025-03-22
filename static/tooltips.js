/**
 * Worldforge - AI-assisted storytelling tool
 * Tooltips JavaScript functionality
 *
 * This file contains the tooltips functionality for the Worldforge application.
 * It handles the display of tooltips for UI elements.
 *
 * Author: AI Assistant
 * Date: March 18, 2025
 */

// Debug mode
const DEBUG = false;

/**
 * Debug logging function
 * @param {string} message - The message to log
 */
function debug(message) {
    if (DEBUG) {
        console.log(`[Tooltips] ${message}`);
    }
}

// Tooltip data for top-level menu items
const tooltipData = {
    "forge-new-world": {
        "title": "Forge New World",
        "description": "Create a new story from scratch with a blank canvas."
    },
    "story-architect": {
        "title": "Story Architect",
        "description": "Plan your story structure using visual flowcharts and templates."
    },
    "start-imagination": {
        "title": "Start from Imagination",
        "description": "Begin with a simple idea and let AI help expand it into a full story concept."
    },
    "load-project": {
        "title": "Load Project",
        "description": "Open an existing .wf project file from your computer."
    },
    "save-project": {
        "title": "Save Project",
        "description": "Save your current project as a .wf file to your computer."
    }
};

// Tooltip data for worldbuilding elements
const elementTooltipData = {
    "concept": "Define the core idea and premise of your story world.",
    "worldview": "Establish the philosophical and societal perspectives of your world.",
    "time": "Develop the temporal aspects of your story world.",
    "space": "Create the geographical and spatial elements of your world.",
    "creatures": "Design the living beings that inhabit your world.",
    "characters": "Craft the individuals who drive your story.",
    "rules": "Establish the laws and systems that govern your world.",
    "nature": "Define the natural world and environmental aspects.",
    "culture": "Create the social structures and cultural elements.",
    "language": "Develop the communication methods and languages.",
    "mythology_religion": "Craft the spiritual beliefs and mythological elements.",
    "philosophy": "Establish the philosophical systems and schools of thought.",
    "tone_manner": "Define the emotional tone and stylistic approach.",
    "story_plot": "Structure the narrative and plot elements."
};

// Current active tooltip element
let activeTooltip = null;

/**
 * Create and show a tooltip for an element
 * @param {HTMLElement} element - The element to show the tooltip for
 * @param {string} title - The tooltip title
 * @param {string} description - The tooltip description
 */
function showTooltip(element, title, description) {
    // If there's already an active tooltip, remove it first
    if (activeTooltip) {
        hideTooltip();
    }
    
    // Create the tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    
    // Create the tooltip content
    tooltip.innerHTML = `
        <div class="tooltip-title">${title}</div>
        <div class="tooltip-description">${description}</div>
    `;
    
    // Position the tooltip relative to the element
    const rect = element.getBoundingClientRect();
    
    // For top menu buttons, position below
    if (element.classList.contains('top-menu-btn')) {
        tooltip.style.top = `${rect.bottom + 10}px`;
        tooltip.style.left = `${rect.left + (rect.width / 2) - 150}px`;
        tooltip.classList.add('tooltip-top');
    } 
    // For toolbar buttons, position to the right
    else if (element.classList.contains('tool-btn')) {
        tooltip.style.top = `${rect.top + (rect.height / 2) - 30}px`;
        tooltip.style.left = `${rect.right + 10}px`;
        tooltip.classList.add('tooltip-left');
    }
    
    // Add the tooltip to the DOM
    document.body.appendChild(tooltip);
    
    // Store the active tooltip
    activeTooltip = tooltip;
}

/**
 * Hide the currently active tooltip
 */
function hideTooltip() {
    if (activeTooltip && activeTooltip.parentNode) {
        activeTooltip.parentNode.removeChild(activeTooltip);
        activeTooltip = null;
    }
}

/**
 * Initialize tooltips for top-level menu buttons
 */
function initTopMenuTooltips() {
    document.querySelectorAll('.top-menu-btn').forEach(button => {
        const id = button.id;
        
        if (tooltipData[id]) {
            // Add translated title if available
            let title = tooltipData[id].title;
            if (typeof safeTranslate === 'function') {
                const key = id.replace(/-/g, '_');
                title = safeTranslate(key);
            }
            
            // Add mouseenter event to show tooltip
            button.addEventListener('mouseenter', () => {
                showTooltip(button, title, tooltipData[id].description);
            });
            
            // Add mouseleave event to hide tooltip
            button.addEventListener('mouseleave', () => {
                hideTooltip();
            });
        }
    });
}

/**
 * Initialize tooltips for worldbuilding element buttons
 */
function initElementTooltips() {
    document.querySelectorAll('.tool-btn[data-element]').forEach(button => {
        const element = button.getAttribute('data-element');
        
        if (elementTooltipData[element]) {
            // Add translated title if available
            let title = element.charAt(0).toUpperCase() + element.slice(1).replace(/_/g, ' ');
            if (typeof safeTranslate === 'function') {
                title = safeTranslate(`worldbuilding_elements.${element}`);
            }
            
            // Add mouseenter event to show tooltip
            button.addEventListener('mouseenter', () => {
                showTooltip(button, title, elementTooltipData[element]);
            });
            
            // Add mouseleave event to hide tooltip
            button.addEventListener('mouseleave', () => {
                hideTooltip();
            });
        }
    });
}

/**
 * Initialize all tooltips
 */
function initTooltips() {
    debug('Initializing tooltips');
    
    // Initialize tooltips for top-level menu buttons
    initTopMenuTooltips();
    
    // Initialize tooltips for worldbuilding element buttons
    initElementTooltips();
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    debug('DOM loaded, initializing tooltips');
    
    // Wait a short time to ensure other scripts have initialized
    setTimeout(initTooltips, 500);
});