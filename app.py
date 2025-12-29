from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pickle
import logging
import base64
from email.mime.text import MIMEText

import joblib
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from google.auth.transport.requests import Request

# ================= APP SETUP =================
app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)

# ================= LOAD MODEL =================
model = joblib.load("spam_model.pkl")
vectorizer = joblib.load("vectorizer.pkl")
logging.info("✅ Model and vectorizer loaded")

# ================= GMAIL API SCOPES =================
# IMPORTANT: BOTH scopes are required
SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send'
]

def authenticate_gmail():
    creds = None
    if os.path.exists("token.pickle"):
        with open("token.pickle", "rb") as token:
            creds = pickle.load(token)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                "credentials.json", SCOPES
            )
            creds = flow.run_local_server(port=0)

        with open("token.pickle", "wb") as token:
            pickle.dump(creds, token)

    return build("gmail", "v1", credentials=creds)

# ================= SEND EMAIL (GMAIL API) =================
def send_email(service, to_email, subject, body):
    message = MIMEText(body)
    message["to"] = to_email
    message["subject"] = subject

    raw_message = base64.urlsafe_b64encode(
        message.as_bytes()
    ).decode()

    service.users().messages().send(
        userId="me",
        body={"raw": raw_message}
    ).execute()

    logging.info(f"📤 Report email sent to {to_email}")

# ================= PREDICT SINGLE MESSAGE =================
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    email = data.get("email", "").strip()
    text = data.get("text", "").strip()[:1000]

    if not email or not text:
        return jsonify({"error": "Email and message text required"}), 400

    vec = vectorizer.transform([text])
    prediction = model.predict(vec)[0]
    label = "SPAM" if prediction == 1 else "Not Spam"

    service = authenticate_gmail()

    subject = "Spam Scanner - Message Result"
    body = f"""
Hi,

You submitted the following message:

{text}

Prediction: {label}

Thanks,
Spam Scanner
"""

    send_email(service, email, subject, body)

    return jsonify({
        "email": email,
        "prediction": int(prediction),
        "label": label
    })

# ================= SCAN GMAIL INBOX =================
@app.route("/scan-inbox", methods=["POST"])
def scan_inbox():
    data = request.get_json()
    email = data.get("email", "").strip()

    if not email:
        return jsonify({"error": "Email address required"}), 400

    try:
        service = authenticate_gmail()

        results = service.users().messages().list(
            userId="me",
            maxResults=10
        ).execute()

        messages = results.get("messages", [])
        spam_details = []

        for msg in messages:
            msg_data = service.users().messages().get(
                userId="me",
                id=msg["id"],
                format="full"
            ).execute()

            snippet = msg_data.get("snippet", "")[:1000]
            headers = msg_data.get("payload", {}).get("headers", [])

            sender = next(
                (h["value"] for h in headers if h["name"] == "From"),
                "Unknown"
            )

            vec = vectorizer.transform([snippet])
            prediction = model.predict(vec)[0]

            if prediction == 1:
                spam_details.append({
                    "from": sender,
                    "message": snippet,
                    "label": "SPAM"
                })

        spam_count = len(spam_details)

        spam_text = "\n\n".join(
            [f"From: {m['from']}\nMessage: {m['message']}" for m in spam_details]
        )

        subject = "Spam Scanner - Gmail Inbox Report"
        body = f"""
Hi,

We scanned your latest 10 Gmail messages.

Spam detected: {spam_count}

{spam_text if spam_count > 0 else "No spam messages found."}

Thanks,
Spam Scanner
"""

        send_email(service, email, subject, body)

        return jsonify({
            "email": email,
            "spam_detected": spam_count,
            "details": spam_details
        })

    except Exception as e:
        logging.error(f"❌ Inbox scan failed: {e}")
        return jsonify({"error": str(e)}), 500

# ================= MAIN =================
if __name__ == "__main__":
    app.run(debug=True)
