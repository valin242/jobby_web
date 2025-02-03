# Jobby - Job Application Tracker Chrome Extension 🚀

Jobby is a sleek Chrome extension that helps you track your job applications with ease. It automatically extracts job information from various job posting websites and allows you to save and manage your applications in one place.

## Features ✨

- **Automatic Information Extraction**: Click 'Fill' to automatically extract:
  - Company name
  - Job title
  - Job description summary
  - Current webpage URL

- **Beautiful UI**:
  - Modern glassmorphism design
  - Smooth animations and transitions
  - Responsive and intuitive interface
  - Real-time visual feedback

- **Application Status Tracking**:
  - Track applications as: Applied, Interview, Rejected, or Offer
  - Maintain a comprehensive job application history

## Installation 🔧

1. Clone this repository:
git clone https://github.com/valin242/jobby_extension.git

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the extension directory

## Usage 📝

1. **On any job posting page**:
   - Click the Jobby extension icon
   - Click 'Fill' to automatically extract job information
   - Review and edit the extracted information if needed
   - Select the application status
   - Click 'Save' to store the application

2. **View Saved Applications**:
   - All applications are saved in `job_applications.csv`
   - Each entry includes:
     - Timestamp
     - Company name
     - Job title
     - Description
     - Status
     - Application date
     - Job posting URL

## Technical Requirements 🛠️

- Chrome browser (latest version recommended)
- Python 3.10.11 for the backend server
- Required Python packages:
  ```bash
  pip install flask flask-cors requests
  ```

## Setup 🚀

1. Start the Flask server:
python llama_server.py

2. The server will run on `http://localhost:3000`

3. Make sure the extension is enabled in Chrome

## Contributing 🤝

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## License 📄

[MIT License](LICENSE)

## Acknowledgments 🙏

- Built with Flask and Chrome Extensions API
- Uses modern CSS features including glassmorphism
- Powered by LLM for intelligent text extraction

## Support 💬

For support, please open an issue in the GitHub repository or contact [valin242.vp@gmail.com]

---

Made with ❤️ by [Tesh]
