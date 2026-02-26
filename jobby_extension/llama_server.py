from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import logging
import csv
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def create_prompt(text):
    return f"""Extract key information from this job posting. Respond with ONLY a JSON object in this format:
{{
    "jobTitle": "exact job title from posting",
    "company": "exact company name from posting",
    "description": "brief summary of key responsibilities, job equirements/skills sets, and state the prefered education level whether its BS, MS, PhD, MD, or a combination of them."
}}

Job Posting:
{text}
"""

@app.route('/process', methods=['POST'])
def process_text():
    try:
        data = request.json
        text = data.get('prompt', '')
        
        logger.info("Sending request to Ollama...")
        
        response = requests.post('http://localhost:11434/api/generate', 
            json={
                "model": "llama3.2",
                "prompt": create_prompt(text),
                "stream": False,
                "options": {
                    "temperature": 0.1  # Lower temperature for more focused output
                }
            }
        )
        
        if response.status_code != 200:
            logger.error(f"Ollama error: {response.text}")
            return jsonify({'error': 'Failed to get response from Ollama'})
            
        response_data = response.json()
        llm_response = response_data.get('response', '').strip()
        
        try:
            # Try to parse the response as JSON
            parsed_response = json.loads(llm_response)
            return jsonify({'response': parsed_response})
            
        except json.JSONDecodeError:
            logger.error(f"Failed to parse LLM response as JSON: {llm_response}")
            return jsonify({'error': 'Invalid response format'})
            
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return jsonify({'error': str(e)})

@app.route('/save-csv', methods=['POST'])
def save_to_csv():
    try:
        print("Received save request")  # Debug log
        data = request.json
        print("Received data:", data)  # Debug log
        
        csv_file = 'job_applications.csv'
        file_exists = os.path.isfile(csv_file)
        
        # Add timestamp
        data['timestamp'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # Define headers (make sure these match your data keys)
        headers = ['timestamp', 'company', 'jobTitle', 'description', 'status', 'date', 'url']
        
        try:
            with open(csv_file, mode='a', newline='', encoding='utf-8') as file:
                writer = csv.DictWriter(file, fieldnames=headers)
                
                # Write headers if file is new
                if not file_exists:
                    writer.writeheader()
                
                # Write data row
                row_data = {
                    'timestamp': data['timestamp'],
                    'company': data.get('company', ''),
                    'jobTitle': data.get('jobTitle', ''),
                    'description': data.get('description', ''),
                    'status': data.get('status', ''),
                    'date': data.get('date', ''),
                    'url': data.get('url', '')
                }
                writer.writerow(row_data)
                
            print("Data saved successfully")  # Debug log
            return jsonify({'success': True, 'message': 'Data saved successfully'})
            
        except IOError as e:
            print(f"IOError while writing CSV: {e}")  # Debug log
            return jsonify({'error': f'Failed to write to CSV file: {str(e)}'}), 500
            
    except Exception as e:
        print(f"Error in save_to_csv: {e}")  # Debug log
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=3000, debug=True)