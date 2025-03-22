/**
 * Worldforge - AI-assisted storytelling tool
 * Chartflow (Story Architect) JavaScript functionality
 *
 * This file contains the JavaScript functionality for the Story Architect feature.
 * It handles the interactive story structure visualization, node interaction,
 * progress tracking, and zoom/navigation controls.
 *
 * Author: AI Assistant
 * Date: March 17, 2025
 */

// Story structure templates
const storyStructures = {
    "heroJourney": {
        name: "Hero's Journey",
        description: "The classic monomyth structure popularized by Joseph Campbell",
        stages: [
            {
                id: "departure",
                name: "I. Departure",
                nodes: [
                    { id: "ordinary_world", name: "Ordinary World", description: "The hero's normal world before the adventure begins." },
                    { id: "call_to_adventure", name: "Call to Adventure", description: "The hero is presented with a challenge or quest." },
                    { id: "refusal_of_call", name: "Refusal of the Call", description: "The hero initially refuses the adventure due to fear or insecurity." },
                    { id: "meeting_mentor", name: "Meeting the Mentor", description: "The hero meets a mentor figure who provides guidance or aid." },
                    { id: "crossing_threshold", name: "Crossing the Threshold", description: "The hero commits to the adventure and enters the special world." }
                ]
            },
            {
                id: "initiation",
                name: "II. Initiation",
                nodes: [
                    { id: "tests_allies_enemies", name: "Tests, Allies, Enemies", description: "The hero faces tests, makes allies, and confronts enemies." },
                    { id: "approach_inmost_cave", name: "Approach to Inmost Cave", description: "The hero prepares for the major challenge ahead." },
                    { id: "ordeal", name: "The Ordeal", description: "The hero faces their greatest fear or a dangerous challenge." },
                    { id: "reward", name: "Reward (Seizing the Sword)", description: "The hero achieves the goal or gains a reward." }
                ]
            },
            {
                id: "return",
                name: "III. Return",
                nodes: [
                    { id: "road_back", name: "The Road Back", description: "The hero begins the journey back to the ordinary world." },
                    { id: "resurrection", name: "Resurrection", description: "The hero faces a final test where everything is at stake." },
                    { id: "return_with_elixir", name: "Return with the Elixir", description: "The hero returns with something to improve the ordinary world." }
                ]
            }
        ]
    },
    "masterPlots": {
        name: "20 Master Plots",
        description: "Ronald Tobias's framework of 20 plot types that form the basis of most stories",
        stages: [
            {
                id: "quest_plots",
                name: "Quest Plots",
                nodes: [
                    { id: "quest", name: "Quest", description: "The protagonist searches for a person, place, or thing." },
                    { id: "pursuit", name: "Pursuit", description: "The protagonist chases or is chased by an antagonist." },
                    { id: "rescue", name: "Rescue", description: "The protagonist saves someone from peril." },
                    { id: "escape", name: "Escape", description: "The protagonist flees from a threatening situation or antagonist." }
                ]
            },
            {
                id: "transformation_plots",
                name: "Transformation Plots",
                nodes: [
                    { id: "transformation", name: "Transformation", description: "The protagonist undergoes a change in character." },
                    { id: "maturation", name: "Maturation", description: "The protagonist grows from youth to adulthood." },
                    { id: "discovery", name: "Discovery", description: "The protagonist discovers something important about themselves." },
                    { id: "underdog", name: "Underdog", description: "The protagonist overcomes overwhelming odds." }
                ]
            },
            {
                id: "tragedy_plots",
                name: "Tragedy Plots",
                nodes: [
                    { id: "tragedy", name: "Tragedy", description: "The protagonist comes to ruin through a character flaw." },
                    { id: "fall", name: "Fall", description: "The protagonist falls from a high place in life." },
                    { id: "sacrifice", name: "Sacrifice", description: "The protagonist gives up something precious for a greater cause." },
                    { id: "redemption", name: "Redemption", description: "The protagonist atones for past wrongs." }
                ]
            },
            {
                id: "other_plots",
                name: "Other Plots",
                nodes: [
                    { id: "love", name: "Love", description: "The protagonist pursues or is pursued by a love interest." },
                    { id: "forbidden_love", name: "Forbidden Love", description: "The protagonist loves someone they cannot have." },
                    { id: "rivalry", name: "Rivalry", description: "The protagonist competes with an antagonist for the same goal." },
                    { id: "temptation", name: "Temptation", description: "The protagonist faces a temptation that could lead to downfall." },
                    { id: "monster", name: "Monster", description: "The protagonist confronts a monster (literal or figurative)." },
                    { id: "mystery", name: "Mystery", description: "The protagonist solves a puzzle or crime." },
                    { id: "revenge", name: "Revenge", description: "The protagonist seeks vengeance for a wrong." },
                    { id: "rebellion", name: "Rebellion", description: "The protagonist fights against an established power." }
                ]
            }
        ]
    },
    "storyPhysics": {
        name: "Story Physics",
        description: "Larry Brooks's framework focusing on the core turning points of a story",
        stages: [
            {
                id: "setup",
                name: "Part 1: Setup",
                nodes: [
                    { id: "hook", name: "Hook", description: "Grabs attention, introduces the world." },
                    { id: "first_plot_point", name: "1st Plot Point", description: "Commitment to the story's conflict." }
                ]
            },
            {
                id: "response",
                name: "Part 2: Response",
                nodes: [
                    { id: "first_pinch_point", name: "1st Pinch Point", description: "Antagonist asserts power, raises stakes." },
                    { id: "midpoint_shift", name: "Midpoint Shift", description: "Story direction changes, new information." }
                ]
            },
            {
                id: "attack",
                name: "Part 3: Attack",
                nodes: [
                    { id: "second_pinch_point", name: "2nd Pinch Point", description: "Antagonist intensifies pressure, major setback." },
                    { id: "lull", name: "Lull Before 2nd Plot Point", description: "False calm, building tension." }
                ]
            },
            {
                id: "resolution",
                name: "Part 4: Resolution",
                nodes: [
                    { id: "second_plot_point", name: "2nd Plot Point", description: "All is lost, character at lowest point." },
                    { id: "climax", name: "Climax", description: "Final confrontation, peak tension." },
                    { id: "ending", name: "Ending", description: "Immediate aftermath, resolution of conflict." },
                    { id: "epilogue", name: "Epilogue", description: "Final thoughts, long-term consequences." }
                ]
            }
        ]
    }
};

// Global variables for the chartflow
let currentStructure = "heroJourney";
let zoomLevel = 1;
let chartContent = {};
let selectedNode = null;

// Initialize the chartflow when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the chartflow view
    if (document.getElementById('chartflow-view')) {
        initializeChartflow();
    }
});

/**
 * Initialize the chartflow visualization
 */
function initializeChartflow() {
    // Create the structure selector
    createStructureSelector();
    
    // Create the initial visualization
    createVisualization(currentStructure);
    
    // Set up event listeners
    setupChartflowEventListeners();
    
    // Log initialization
    if (typeof logToConsole === 'function') {
        logToConsole("Story Architect initialized with " + storyStructures[currentStructure].name + " structure.");
    }
}

/**
 * Create the structure selector dropdown
 */
function createStructureSelector() {
    const chartflowView = document.getElementById('chartflow-view');
    
    // Create the selector container
    const selectorContainer = document.createElement('div');
    selectorContainer.className = 'structure-selector-container';
    
    // Create the label
    const label = document.createElement('label');
    label.htmlFor = 'structure-selector';
    label.textContent = 'Select Story Structure:';
    
    // Create the selector
    const selector = document.createElement('select');
    selector.id = 'structure-selector';
    
    // Add options
    for (const key in storyStructures) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = storyStructures[key].name;
        selector.appendChild(option);
    }
    
    // Set the current structure
    selector.value = currentStructure;
    
    // Add event listener
    selector.addEventListener('change', function() {
        currentStructure = this.value;
        createVisualization(currentStructure);
        
        // Log the change
        if (typeof logToConsole === 'function') {
            logToConsole("Switched to " + storyStructures[currentStructure].name + " structure.");
        }
    });
    
    // Assemble the selector container
    selectorContainer.appendChild(label);
    selectorContainer.appendChild(selector);
    
    // Add controls for zoom
    const zoomControls = document.createElement('div');
    zoomControls.className = 'zoom-controls';
    
    const zoomInBtn = document.createElement('button');
    zoomInBtn.className = 'zoom-btn';
    zoomInBtn.innerHTML = '<i class="fas fa-search-plus"></i>';
    zoomInBtn.addEventListener('click', function() {
        zoomIn();
    });
    
    const zoomOutBtn = document.createElement('button');
    zoomOutBtn.className = 'zoom-btn';
    zoomOutBtn.innerHTML = '<i class="fas fa-search-minus"></i>';
    zoomOutBtn.addEventListener('click', function() {
        zoomOut();
    });
    
    const zoomResetBtn = document.createElement('button');
    zoomResetBtn.className = 'zoom-btn';
    zoomResetBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
    zoomResetBtn.addEventListener('click', function() {
        resetZoom();
    });
    
    zoomControls.appendChild(zoomInBtn);
    zoomControls.appendChild(zoomOutBtn);
    zoomControls.appendChild(zoomResetBtn);
    
    selectorContainer.appendChild(zoomControls);
    
    // Add to the chartflow view
    chartflowView.innerHTML = '';
    chartflowView.appendChild(selectorContainer);
}

/**
 * Create the visualization for the selected story structure
 * 
 * @param {string} structureKey - The key of the structure to visualize
 */
function createVisualization(structureKey) {
    const chartflowView = document.getElementById('chartflow-view');
    const structure = storyStructures[structureKey];
    
    // Create the visualization container if it doesn't exist
    let visualizationContainer = document.querySelector('.visualization-container');
    if (!visualizationContainer) {
        visualizationContainer = document.createElement('div');
        visualizationContainer.className = 'visualization-container';
        chartflowView.appendChild(visualizationContainer);
    } else {
        visualizationContainer.innerHTML = '';
    }
    
    // Create the flowchart container
    const flowchartContainer = document.createElement('div');
    flowchartContainer.className = 'flowchart-container';
    flowchartContainer.style.transform = `scale(${zoomLevel})`;
    
    // Create the structure description
    const descriptionElement = document.createElement('div');
    descriptionElement.className = 'structure-description';
    descriptionElement.textContent = structure.description;
    visualizationContainer.appendChild(descriptionElement);
    
    // Create the stages and nodes
    structure.stages.forEach((stage, stageIndex) => {
        // Create the stage container
        const stageContainer = document.createElement('div');
        stageContainer.className = 'stage-container';
        stageContainer.id = `stage-${stage.id}`;
        
        // Create the stage header
        const stageHeader = document.createElement('div');
        stageHeader.className = 'stage-header';
        stageHeader.textContent = stage.name;
        stageContainer.appendChild(stageHeader);
        
        // Create the nodes container
        const nodesContainer = document.createElement('div');
        nodesContainer.className = 'nodes-container';
        
        // Create the nodes
        stage.nodes.forEach((node, nodeIndex) => {
            // Create the node element
            const nodeElement = document.createElement('div');
            nodeElement.className = 'node';
            nodeElement.id = `node-${node.id}`;
            nodeElement.setAttribute('data-node-id', node.id);
            
            // Check if we have content for this node
            const hasContent = chartContent[node.id] && chartContent[node.id].content;
            if (hasContent) {
                nodeElement.classList.add('has-content');
            }
            
            // Create the node name
            const nodeName = document.createElement('div');
            nodeName.className = 'node-name';
            nodeName.textContent = node.name;
            nodeElement.appendChild(nodeName);
            
            // Add event listener
            nodeElement.addEventListener('click', function() {
                openNodeEditor(node);
            });
            
            // Add to the nodes container
            nodesContainer.appendChild(nodeElement);
            
            // Add connector if not the last node
            if (nodeIndex < stage.nodes.length - 1) {
                const connector = document.createElement('div');
                connector.className = 'connector';
                connector.innerHTML = '<i class="fas fa-arrow-down"></i>';
                nodesContainer.appendChild(connector);
            }
        });
        
        // Add the nodes container to the stage container
        stageContainer.appendChild(nodesContainer);
        
        // Add the stage container to the flowchart container
        flowchartContainer.appendChild(stageContainer);
        
        // Add stage connector if not the last stage
        if (stageIndex < structure.stages.length - 1) {
            const stageConnector = document.createElement('div');
            stageConnector.className = 'stage-connector';
            stageConnector.innerHTML = '<i class="fas fa-arrow-right"></i>';
            flowchartContainer.appendChild(stageConnector);
        }
    });
    
    // Add the flowchart container to the visualization container
    visualizationContainer.appendChild(flowchartContainer);
    
    // Create the node editor panel
    createNodeEditorPanel(visualizatio<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>)
      // Create the node editor panel
 createNodeEditorPanel(visualizationContainer);

 // Add progress tracker
 const progressTracker = document.createElement('div');
 progressTracker.className = 'progress-tracker';
 progressTracker.innerHTML = `
     <div class="progress-bar">
         <div class="progress-fill" style="width: 0%;"></div>
     </div>
     <div class="progress-text">0% Complete</div>
 `;
 visualizationContainer.appendChild(progressTracker);
 function createNodeEditorPanel(container) {
    // ... existing code ...
      // Add related elements section
      const relatedElements = document.createElement('div');
      relatedElements.className = 'related-elements';
      relatedElements.innerHTML = `
          <h4>Related Elements</h4>
          <div class="related-elements-list">
              <!-- Related elements will be added here -->
          </div>
      `;
      editorContent.appendChild(relatedElements);
  
      // Add AI suggestions section
      const aiSuggestions = document.createElement('div');
      aiSuggestions.className = 'ai-suggestions';
      aiSuggestions.innerHTML = `
          <h4>AI Suggestions</h4>
          <button class="get-ai-suggestions-btn"><i class="fas fa-robot"></i> Get Suggestions</button>
          <div class="suggestions-list">
              <!-- AI suggestions will be added here -->
          </div>
        <div class="loading-suggestions" style="display: none;">Loading...</div>
  
      `;
      editorContent.appendChild(aiSuggestions);
  
      // ... rest of existing code ...
  }