# অপরূপা - AI Legal & Governance Agent

This project is an AI agent that enhances legal literacy and simplifies access to Bangladeshi government services, with the explicit goal of preventing corruption by strengthening transparency in local governance.

It features a web-based chat interface and an SMS-based interface for accessibility without internet.

## Features

-   **Web Interface**: A rich, interactive chat experience with document upload and analysis capabilities.
-   **SMS Interface**: Allows users to interact with the agent via standard SMS, making it accessible to users without smartphones or consistent internet access.
-   **Legal & Governance Q&A**: Answers questions about Bangladeshi laws, regulations, and government processes using Google Search for up-to-date information.
-   **Document Analysis**: (Web-only) Can analyze legal documents like deeds and land records to extract key information.

---

## Backend SMS Middleware Setup

To make the SMS functionality work, you need to set up and deploy the serverless middleware located in the `/api` directory.

### Prerequisites

1.  **Node.js**: Ensure you have Node.js installed.
2.  **Twilio Account**: [Sign up for a free Twilio account](https://www.twilio.com/try-twilio) and get a phone number.
3.  **Google Gemini API Key**: Get an API key from [Google AI Studio](https://ai.google.dev/).
4.  **Firebase Project**: [Create a new Firebase project](https://console.firebase.google.com/) and enable the **Firestore** database.
5.  **Deployment Platform**: A platform that supports Node.js serverless functions, such as [Vercel](https://vercel.com) or [Netlify](https://www.netlify.com).

### Step 1: Install Dependencies

If you haven't already, install the project dependencies:

```bash
npm install
```

### Step 2: Set Up Environment Variables

The middleware requires several secret keys and identifiers to function. You must set these as environment variables on your deployment platform (e.g., in the Vercel project settings). **Do not hardcode these in your files.**

| Variable Name                   | Description                                                                                                                              | Your Value To Set                               |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `API_KEY`                       | Your Google Gemini API Key.                                                                                                              | `AIzaSy...` (Your actual Gemini Key)            |
| `TWILIO_ACCOUNT_SID`            | Your Account SID from the Twilio Console Dashboard.                                                                                      | `AC435c880151ea56af386f316805bfc53d`            |
| `TWILIO_AUTH_TOKEN`             | Your Auth Token from the Twilio Console Dashboard. **Remember to generate a new one if you have shared the old one.**                        | `your_new_twilio_auth_token`                    |
| `TWILIO_PHONE_NUMBER`           | The Twilio phone number you purchased, in E.164 format.                                                                                  | `+18573080372`                                  |
| `FIREBASE_SERVICE_ACCOUNT_KEY`  | The JSON content of your Firebase service account key. Go to Project Settings > Service accounts in Firebase, and generate a new private key. Copy the entire JSON content as the value for this variable. | `{"type": "service_account", "project_id": ...}` |

### Step 3: Deploy the Project

Deploy your project to your chosen platform (e.g., Vercel). When you push your code, the platform should automatically detect the `api/sms.ts` file and deploy it as a serverless function.

After deployment, you will get a public URL for your function, which will look something like this: `https://your-project-name.vercel.app/api/sms`.

### Step 4: Configure Twilio Webhook

1.  Go to your Twilio Console and navigate to the settings for your phone number.
2.  Find the "Messaging" section.
3.  Under "A MESSAGE COMES IN", select "Webhook".
4.  Paste the URL of your deployed serverless function (from Step 3) into the text field.
5.  Set the HTTP method to `HTTP POST`.
6.  Click **Save**.

Your SMS service is now live! When a user sends an SMS to your Twilio number, Twilio will forward it to your deployed middleware, which will then process the request and send a reply.