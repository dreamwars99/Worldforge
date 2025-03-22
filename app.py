from flask import Flask, request, jsonify, render_template
import os
import json
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Azure OpenAI API configuration
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_KEY = os.getenv("AZURE_OPENAI_KEY")
AZURE_OPENAI_DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4o-mini")
AZURE_OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview")

# Conversation history
conversation_history = []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '')
        
        # Add user message to conversation history
        conversation_history.append({"role": "user", "content": user_message})
        
        # Check if Azure OpenAI credentials are available
        if AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY:
            # Call Azure OpenAI API
            response = call_azure_openai(conversation_history)
        else:
            # Use mock response for development
            response = generate_mock_response(user_message)
        
        # Add AI response to conversation history
        conversation_history.append({"role": "assistant", "content": response})
        
        return jsonify({"response": response})
    
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

def call_azure_openai(messages):
    """Call Azure OpenAI API with the conversation history."""
    try:
        headers = {
            "Content-Type": "application/json",
            "api-key": AZURE_OPENAI_KEY
        }
        
        payload = {
            "messages": messages,
            "max_tokens": 1000,
            "temperature": 0.7,
            "top_p": 0.95,
            "frequency_penalty": 0,
            "presence_penalty": 0
        }
        
        api_url = f"{AZURE_OPENAI_ENDPOINT}/openai/deployments/{AZURE_OPENAI_DEPLOYMENT}/chat/completions?api-version={AZURE_OPENAI_API_VERSION}"
        
        response = requests.post(api_url, headers=headers, json=payload)
        
        if response.status_code == 200:
            return response.json()["choices"][0]["message"]["content"]
        else:
            print(f"Azure OpenAI API error: {response.status_code} - {response.text}")
            return generate_mock_response(messages[-1]["content"])
    
    except Exception as e:
        print(f"Error calling Azure OpenAI: {str(e)}")
        return generate_mock_response(messages[-1]["content"])

def generate_mock_response(user_message):
    """Generate a mock response for development purposes."""
    if "girl from ocean" in user_message.lower():
        return """
The concept of "the girl from ocean" is rich with potential for worldbuilding. Below is an analysis of relevant worldbuilding elements, followed by targeted questions to help you develop the remaining aspects of your story world.

### Relevant Worldbuilding Elements

1. **Concept**: The central idea of your story revolves around a girl who is connected to the ocean. This could imply themes of identity, nature, adventure, or even magic.

2. **Characters**: The protagonist (the girl) and supporting characters (friends, family, mentors, adversaries) will play crucial roles in the development of the story.

3. **Worldview**: The way inhabitants of this world perceive the ocean and its significance will shape the narrative. Is the ocean a source of life, a dangerous entity, or something mystical?

4. **Creatures**: The ocean is home to a plethora of mythical beings. Consider what kinds of creatures inhabit this world. Are there mermaids, sea monsters, or entirely new species?

5. **Nature**: The ocean's ecosystem, weather patterns, and the geography of coastal areas will influence the plot and the characters' lives.

6. **Culture**: The society surrounding the ocean will have unique customs, traditions, and lifestyles. What do they value? How do they interact with the ocean?

7. **Mythology/Religion**: The ocean often features in the myths and beliefs of cultures. What stories or deities are associated with it in your world?

### Targeted Questions

1. "Is the girl from the ocean literally (born in/emerged from the water) or figuratively (from a coastal community)?" (Characters → My Characters Management)

2. "Does she possess any supernatural abilities related to water or marine life?" (Characters → My Characters Management, Rules → Magic Systems)

3. "What is the relationship between land-dwellers and ocean-dwellers in your world? Is there conflict, harmony, or ignorance of each other?" (Worldview → Societal Values)

4. "Are there specific ocean-related rituals or ceremonies that play a role in your story?" (Culture → Traditions, Mythology/Religion → Religious Practices)

5. "What threats or challenges does your ocean world face? Environmental destruction, magical imbalance, invasion?" (Nature → Environmental Factors, Story/Plot → Conflicts)

### Scale Assessment

Based on your initial idea, this concept could work well as either a short story focused on the girl's personal journey or a feature-length narrative exploring the broader world and its oceanic mysteries. The intimate connection between a character and the ocean suggests potential for deep character development while also allowing for expansion into larger themes of environmental stewardship, belonging, or discovering one's true nature.

I recommend focusing on the Character, Nature, and Mythology elements as they seem most central to your concept, while using Culture and Worldview to add depth and context to your ocean world.
"""
    elif "magical girl" in user_message.lower():
        return """
Your idea of "a magical girl meet mermaid from ocean" combines several fascinating elements that can create a rich story world. Let me break this down and help you develop it further.

### Core Analysis

This concept blends the magical girl genre (typically featuring a young girl with magical powers who fights evil) with merfolk mythology, creating an interesting cross-genre premise. The ocean setting adds a layer of mystery and a distinct environment for your story.

### Relevant Elementals

1. **Characters → My Characters Management**
   The magical girl protagonist would need a clear identity, powers, and motivations. Is she human who discovers mermaid heritage? Or a land-dweller who gains ocean-based powers? Her character arc could involve accepting responsibility, discovering her true nature, or bridging two worlds.

2. **Creatures → Magical Beings**
   Mermaids in your world need definition. Are they traditional half-fish, half-human? Do they have their own society? Are there different types with various abilities? Consider how they differ from pop culture depictions to make your world unique.

3. **Rules → Magic Systems**
   Your world needs consistent rules for how magic works. Is the magic tied to the ocean itself? Does it manifest differently underwater versus on land? Are there magical items, incantations, or is it innate? The limitations of magic are as important as its capabilities.

4. **Tone & Manner → Genre**
   This concept bridges magical girl anime/manga conventions with fantasy and possibly coming-of-age elements. The tone could range from whimsical and light-hearted to more serious exploration of responsibility and identity.

### Cross-Links Between Elementals

**Characters ↔ Rules**: How does your protagonist's magical girl transformation work underwater? Does water amplify or change her powers? This connection creates unique battle scenarios and challenges.

**Creatures ↔ Culture**: Merfolk would have their own customs, values, and possibly prejudices about surface dwellers. This creates natural tension and opportunities for cultural exchange and growth.

**Rules ↔ Story/Plot**: The limitations of magic in water versus land could create strategic challenges that drive plot points and create tension in critical moments.

### Targeted Questions

1. "What is the source of your magical girl's powers, and how does her connection to the ocean affect or enhance them?" (Characters → My Characters Management, Rules → Magic Systems)

2. "Is there a hidden history between humans and merfolk in your world? Perhaps ancient conflicts, alliances, or shared threats that have been forgotten?" (Worldview → Societal Values, Time → Historical Timeline)

3. "What underwater locations will feature in your story, and how do they differ from human environments in terms of architecture, function, and cultural significance?" (Space → Locations, Culture → Arts)

4. "What threatens both the human world and the merfolk world that requires cooperation between the magical girl and her mermaid allies?" (Story/Plot → Conflicts, Nature → Environmental Factors)

5. "How do transformations work in your world - both the magical girl's power-up sequence and any potential human-to-mermaid transformations?" (Rules → Magic Systems)

### Scale Assessment

This concept has potential for either approach:

**Feature-length/series potential**: The combination of magical girl adventures, underwater exploration, and cross-cultural dynamics between humans and merfolk offers rich material for an ongoing series or feature film with sequel potential.

**Short story potential**: Focusing on a single adventure where the magical girl discovers merfolk and must quickly adapt her powers to help them against a specific threat could work well as a standalone story.

I recommend focusing on the unique aspects of underwater magical combat and the cultural exchange between surface and ocean societies to make your story stand out in both the magical girl and mermaid fantasy genres.
"""
    else:
        return """
I've analyzed your creative idea and identified several key elements that can help develop it into a rich story world.

### Core Analysis

Your concept contains seeds of an intriguing narrative with potential for exploration across multiple dimensions of worldbuilding. Let me break down the most relevant elements and suggest connections between them.

### Relevant Elementals

1. **Concept → Core Premise**
   The foundation of your idea centers on a unique situation or character that can be developed in multiple directions. This premise has potential to explore themes of identity, discovery, conflict, or transformation.

2. **Characters → Character Relationships**
   The dynamics between your central character(s) and others in this world will be crucial to developing emotional depth. Consider how their backgrounds, motivations, and growth arcs intersect and create tension or harmony.

3. **Worldview → Societal Values**
   The broader society in which your story takes place will have established norms, beliefs, and values that either support or conflict with your characters' journeys. These underlying assumptions shape how characters interact with their world.

4. **Rules → Natural Laws or Magic Systems**
   Whether your world follows our physical laws or contains fantastical elements, establishing consistent rules creates a framework for what's possible and impossible, creating both opportunities and limitations for your characters.

### Cross-Links Between Elementals

**Concept ↔ Rules**: How does your core premise interact with the fundamental rules of your world? Does it challenge them, exploit them, or reveal new aspects of them?

**Characters ↔ Worldview**: How do your characters either embody or rebel against the dominant worldview? This tension often drives meaningful character development and thematic exploration.

**Rules ↔ Story/Plot**: The limitations imposed by your world's rules often create the most interesting challenges for characters to overcome, driving plot development.

### Targeted Questions

1. "What aspect of your protagonist's background or identity makes them uniquely suited to face the central conflict of your story?" (Characters → My Characters Management, Story/Plot → Conflicts)

2. "Is there a specific location in your world that serves as a physical manifestation of your story's themes? How does this environment affect the characters who inhabit or visit it?" (Space → Locations, Tone & Manner → Themes)

3. "What established rule or expectation in your world does your protagonist challenge or subvert? What are the consequences of this challenge?" (Rules → World Rules, Story/Plot → Conflicts)

4. "Are there cultural practices, traditions, or ceremonies that play a significant role in your story's progression or in revealing character motivations?" (Culture → Traditions, Characters → Character Relationships)

5. "What historical event in your world's past continues to influence the present circumstances your characters face?" (Time → Significant Events, Worldview → Societal Values)

### Scale Assessment

Your idea contains elements that could work well at different scales:

For a short story, I recommend focusing tightly on a single character's transformation or realization within a limited timeframe and setting, emphasizing emotional impact over extensive worldbuilding.

For a feature-length work, your concept allows for deeper exploration of the world's systems, history, and the complex interplay between multiple characters and factions.

The most promising approach would be to start by developing the elements that most excite you personally, then determine the appropriate scale based on how much complexity those elements introduce.
"""

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
