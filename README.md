# SpamZero - Spam Detection Web Application

A full-stack Machine Learning web application that detects spam messages and emails using Natural Language Processing (NLP) and a Supervised ML pipeline, deployed professionally with React.js + Flask.

## Project Overview

Spam emails and malicious messages pose serious security risks. This project addresses that problem by building an end-to-end AI-powered spam detection system that works on both manual text input and real Gmail inbox messages.

## The system integrates:

- A trained ML model for spam classification

- A RESTful Flask backend for inference

- A modern React.js frontend for user interaction

## Objectives

- Detect spam messages accurately using Machine Learning

- Provide a clean and professional web interface

- Enable real-world email inbox scanning

- Demonstrate practical ML deployment skills

## Machine Learning Approach

- Text Preprocessing: TF-IDF Vectorization

- Model Used: Linear Support Vector Machine (Linear SVC)

- Pipeline:
```bash
Text → TF-IDF → Linear SVM → Prediction
```

- Output Classes:
```bash
SPAM

NOT SPAM
```
The model is trained offline and serialized using pickle, then loaded dynamically by the Flask backend.

## System Architecture
```yaml
React.js (Frontend)
        ↓
REST API (JSON)
        ↓
Flask Backend
        ↓
ML Pipeline (TF-IDF + SVM)
        ↓
Prediction Results
```

# Key Features
🔹 Message Spam Detection

- Paste any message and instantly check if it is spam

🔹 Gmail Inbox Scanning

- Scans recent inbox messages using Gmail API

- Displays only spam messages (noise-free results)

🔹 Professional UI

- Left panel: Detection input

- Right panel: Results display

- Loader-enabled buttons

- Responsive layout

🔹 Real Deployment Workflow

- Backend API integration

- Model inference via HTTP requests

- Proper error handling and logging

## Tech Stack
### Frontend

- React.js

- CSS (Custom styling)

- Fetch / Axios for API calls

### Backend

- Flask

- Flask-CORS

- Gmail API

### Machine Learning

- Python

- Scikit-learn

- TF-IDF Vectorizer

- Linear SVM

### Tools

- Jupyter Notebook (Model Training)

- Pickle (Model Serialization)

- Git & GitHub

## project structure
```yaml
Project1/
│
├── backend/
│   ├── app.py
│   ├── spam_model.pkl
│   ├── credentials.json
│   ├── token.json
│
├── my-app/
│   ├── public/
│   │   └── logo.png
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│
├── model_training.ipynb
└── README.md
```

## Installation & Setup
🔹 Backend Setup

```bash
cd backend
pip install flask flask-cors scikit-learn google-api-python-client
python app.py
```
Backend runs on:
```bash
http://localhost:5000
```
🔹 Frontend Setup
```bash
cd my-app
npm install
npm start
```

Frontend runs on:
```bash
http://localhost:3000
```
## Sample Output

### Manual Message Scan:
```bash
Prediction: SPAM
```

### Inbox Scan Output:
```bash
From: LinkedIn Job Alerts
Message: Apply now for high-paying jobs...
```
## Model Performance

- High accuracy on benchmark spam datasets

- Robust against common spam patterns

- Fast inference suitable for real-time usage

## Challenges Addressed

- ML model serialization compatibility

- Gmail API OAuth handling

- CORS and frontend-backend communication

- UI responsiveness and UX refinement

## Future Enhancements

- Spam probability score

- PDF/CSV export of scan results

- Dark mode UI

- Cloud deployment (AWS / Render)

- Deep learning models (LSTM / Transformers)

##  Author - **Ravindran S**

Developer • AI/ML Enthusiast • Linux Power User  


## 🔗 Connect With Me

You can reach me here:

###  **Socials**
<a href="www.linkedin.com/in/ravindran-s-982702327" target="_blank">
  <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white">
</a>


<a href="https://github.com/ravindran-dev" target="_blank">
  <img src="https://img.shields.io/badge/GitHub-111111?style=for-the-badge&logo=github&logoColor=white">
</a>


###  **Contact**
<a href="mailto:ravindrans.dev@gmail.com" target="_blank">
  <img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white">
</a>

<a href="mailto:ravindrans.dev@gmail.com" target="_blank">
  <img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white">
</a>

