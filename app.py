from flask import Flask, render_template, request, redirect, url_for
import os
from openai import AzureOpenAI
from dotenv import load_dotenv
import json

load_dotenv()

app = Flask(__name__)

# Azure OpenAI setup (using environment variables)
client = AzureOpenAI(
  azure_endpoint = os.environ.get("AZURE_OPENAI_ENDPOINT"),
  api_key=os.environ.get("AZURE_OPENAI_KEY"),
  api_version=os.environ.get("AZURE_OPENAI_API_VERSION")
)

# --- Story Weaving Function ---
def generate_story_weaving(char_name, char_description, char_motivation, plot_point):
    prompt = f"""You are a seasoned story editor. Given the following character:

Name: {char_name}
Description: {char_description}
Motivation: {char_motivation}

and the following plot point:

{plot_point}

Suggest three ways these elements could be connected in a compelling narrative. Focus on creating conflict and raising the stakes.
"""
    response = client.chat.completions.create(
        model=os.environ.get("AZURE_OPENAI_MODEL_NAME"),
        messages=[
            {"role": "system", "content": "You are a helpful storytelling assistant."},
            {"role": "user", "content": prompt},
        ]
    )
    return response.choices[0].message.content

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/new_project")
def new_project():
    #  For now, just redirect to a simple character creation page
    return redirect(url_for('create_character')) # We'll define this later

@app.route("/chartflow")
def chartflow():
    return render_template("chart_flow.html")  # Create this template later

@app.route('/example')
def example():
    return "Avartar Example is here. We will create this page later"

@app.route('/about')
def about():
    return render_template("about.html")

@app.route('/help')
def help():
    return render_template("help.html")

# --- Start from Imagination Route ---
@app.route("/start_from_imagination", methods=["GET", "POST"])
def start_from_imagination():
    mode = request.args.get('mode', 'default')  # Get mode from query parameter
    story_weaving_result = None
    character = None
    if request.method == "POST":
        if request.form['mode'] == 'create':
            char_name = request.form["char_name"]
            char_description = request.form["char_description"]
            char_motivation = request.form["char_motivation"]
            # Basic Data Storage
            character_data = {
              "name": char_name,
              "description": char_description,
              "motivation": char_motivation
            }

            if not os.path.exists('projects'):
              os.makedirs('projects')

            with open("projects/character_data.json", "w") as f:
                json.dump(character_data, f, indent=4)
            # Prepare for story weaving
            mode = "weave"
            character = character_data

        elif request.form['mode'] == 'weave' or request.form['mode'] == 'avatar_weave':
            char_name = request.form["char_name"]
            char_description = request.form["char_description"]
            char_motivation = request.form["char_motivation"]
            plot_point = request.form["plot_point"]
            story_weaving_result = generate_story_weaving(char_name, char_description, char_motivation, plot_point)

    return render_template("start_from_imagination.html", mode=mode, story_weaving_result=story_weaving_result, character=character)

# --- Placeholder routes for later ---
@app.route("/create_character", methods=["GET", "POST"])
def create_character():
    return "Character creation page - to be implemented"

if __name__ == "__main__":
    app.run(debug=True)