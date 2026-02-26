import requests
import json

def test_llm():
    # Simple test data
    test_data = """
    Senior Software Engineer
    Tech Corp
    
    About the Role:
    We are seeking a talented Software Engineer to join our growing team. The ideal candidate will have a passion for building scalable applications and working with cutting-edge technologies.
    
    Requirements:
    - 3+ years of experience in full-stack development
    - Proficiency in Python and JavaScript
    - Experience with React and Node.js
    """
    
    print("Testing LLM server...")
    
    try:
        response = requests.post('http://localhost:3000/process', 
            json={'prompt': test_data}
        )
        
        print(f"\nStatus Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            
            if 'error' in result:
                print(f"Error: {result['error']}")
                return
                
            data = result['response']
            print("\nExtracted Data:")
            print("-" * 50)
            print(f"Job Title: {data.get('jobTitle', 'Not found')}")
            print(f"Company: {data.get('company', 'Not found')}")
            print(f"Description: {data.get('description', 'Not found')}")
            
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    test_llm()
