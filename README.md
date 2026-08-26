# Chaufal Tech Website

A multi-page React and Vite website for Chaufal Tech.

## Local development

```bash
npm install
npm run dev
```

The frontend normally runs at `http://localhost:5173`. The contact endpoint is a
Vercel serverless function, so use `vercel dev` when testing the full form locally.

Build the production frontend with:

```bash
npm run build
```

## Google Sheets contact-form storage

Contact submissions are appended to a private Google Sheet by `api/contact.js`.
Google credentials remain in the serverless function and are never sent to the
browser.

### 1. Create the spreadsheet

1. Create a Google Sheet.
2. Rename its first tab to `Contact Submissions`.
3. Put these headers in cells A1 through F1:

   `id | created_at | name | email | company | message`

4. Copy the spreadsheet ID from its URL. In
   `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`, it is the value
   between `/d/` and `/edit`.

### 2. Create Google API credentials

1. In Google Cloud Console, create or select a project.
2. Enable the Google Sheets API for that project.
3. Open **IAM & Admin > Service Accounts** and create a service account.
4. Open that account, choose **Keys > Add key > Create new key > JSON**, and
   download the JSON file.
5. Share the Google Sheet with the JSON file's `client_email` as an **Editor**.

The JSON key is a secret. Do not commit it or upload the file to the website.

### 3. Configure environment variables

Copy `.env.example` to `.env` for local development and fill in:

- `GOOGLE_SHEETS_ID`: the spreadsheet ID from step 1.
- `GOOGLE_SHEET_NAME`: `Contact Submissions` unless you chose another tab name.
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`: `client_email` from the downloaded JSON.
- `GOOGLE_PRIVATE_KEY`: `private_key` from the downloaded JSON.

Add the same variables under **Vercel > Project > Settings > Environment
Variables**, then redeploy. Vercel accepts the private key with its line breaks;
the application also accepts `\n`-escaped line breaks.

`RESEND_API_KEY` and `CONTACT_NOTIFY_EMAIL` are optional. When omitted, the
submission is still saved to Google Sheets, but no notification email is sent.

## Project structure

```text
api/                 Vercel serverless functions and Google Sheets integration
src/components/      Shared React components
src/data/            Site copy and page data
src/pages/           Route components
```
