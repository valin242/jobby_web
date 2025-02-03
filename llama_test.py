import requests

def test_ollama_direct():
    prompt = "Say hello!"
    
    try:
        print("Testing direct Ollama API...")
        response = requests.post('http://localhost:11434/api/generate',
            json={
                "model": "llama3.2",
                "prompt": prompt,
                "stream": False
            }
        )
        
        print(f"Status: {response.status_code}")
        print("Response:", response.json())
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_ollama_direct()