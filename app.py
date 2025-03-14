from dotenv import load_dotenv
load_dotenv()

import os
from flask import Flask, render_template, request
from openai import AzureOpenAI

app = Flask(__name__)

# Azure OpenAI 설정 (환경 변수 사용)
client = AzureOpenAI(
  azure_endpoint = os.environ.get("AZURE_OPENAI_ENDPOINT"),
  api_key=os.environ.get("AZURE_OPENAI_KEY"),
  api_version=os.environ.get("AZURE_OPENAI_API_VERSION")
)

def generate_conflict_analysis(character1_description, character2_description, max_tokens, temperature):
    """
    Azure OpenAI Service를 사용하여 두 캐릭터 간의 갈등 분석을 생성합니다.
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a creative writing assistant specializing in character interactions. Given the following two character descriptions, suggest a single, compelling scenario where these characters would come into conflict or have a significant interaction. Focus on highlighting their contrasting motivations and personalities."}, # Concise response instruction removed from system message
                {"role": "user", "content": f"Character 1: {character1_description}\nCharacter 2: {character2_description}"}
            ],
            max_tokens=max_tokens,  # 사용자 지정 max_tokens 사용
            n=1,
            stop=None,
            temperature=temperature,  # 사용자 지정 temperature 사용
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error: {e}"

@app.route("/", methods=["GET", "POST"]) # GET 요청도 처리하도록 변경
def index():
    analysis = None # 분석 결과를 저장할 변수 초기화
    error = None

    if request.method == "POST":
        character1_description = request.form["character1_description"]
        character2_description = request.form["character2_description"]
        max_tokens = int(request.form["max_tokens"])  # 문자열을 정수로 변환
        temperature = float(request.form["temperature"])  # 문자열을 실수로 변환

        try:
            analysis = generate_conflict_analysis(character1_description, character2_description, max_tokens, temperature)
        except Exception as e:
            error = str(e)

    return render_template("index.html", analysis=analysis, error=error) # 결과와 오류를 템플릿에 전달

if __name__ == '__main__':
    app.run(debug=True)