import { createSign, randomUUID } from 'node:crypto'

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets'

let cachedAccessToken = null
let tokenRequest = null

function requireEnvironmentVariable(name) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

function encodeJwtPart(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url')
}

function createServiceAccountAssertion() {
  const serviceAccountEmail = requireEnvironmentVariable('GOOGLE_SERVICE_ACCOUNT_EMAIL')
  const privateKey = requireEnvironmentVariable('GOOGLE_PRIVATE_KEY').replace(/\\n/g, '\n')
  const issuedAt = Math.floor(Date.now() / 1000)

  const unsignedToken = [
    encodeJwtPart({ alg: 'RS256', typ: 'JWT' }),
    encodeJwtPart({
      iss: serviceAccountEmail,
      scope: SHEETS_SCOPE,
      aud: GOOGLE_TOKEN_URL,
      iat: issuedAt,
      exp: issuedAt + 3600,
    }),
  ].join('.')

  const signer = createSign('RSA-SHA256')
  signer.update(unsignedToken)
  signer.end()

  return `${unsignedToken}.${signer.sign(privateKey, 'base64url')}`
}

async function readError(response) {
  const body = await response.json().catch(() => null)
  return body?.error?.message || body?.error_description || `HTTP ${response.status}`
}

async function requestAccessToken() {
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: createServiceAccountAssertion(),
    }),
  })

  if (!response.ok) {
    throw new Error(`Google authentication failed: ${await readError(response)}`)
  }

  const token = await response.json()
  cachedAccessToken = {
    value: token.access_token,
    // Refresh one minute early so a token cannot expire during a request.
    expiresAt: Date.now() + (token.expires_in - 60) * 1000,
  }

  return cachedAccessToken.value
}

async function getAccessToken() {
  if (cachedAccessToken?.expiresAt > Date.now()) {
    return cachedAccessToken.value
  }

  if (!tokenRequest) {
    tokenRequest = requestAccessToken().finally(() => {
      tokenRequest = null
    })
  }

  return tokenRequest
}

async function appendRow(url, row, accessToken) {
  return fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      majorDimension: 'ROWS',
      values: [row],
    }),
  })
}

export async function appendContactSubmission({ name, email, company, message }) {
  const spreadsheetId = requireEnvironmentVariable('GOOGLE_SHEETS_ID')
  const sheetName = process.env.GOOGLE_SHEET_NAME || 'Contact Submissions'
  const submission = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    name,
    email,
    company: company || '',
    message,
  }
  const escapedSheetName = sheetName.replace(/'/g, "''")
  const range = encodeURIComponent(`'${escapedSheetName}'!A:F`)
  const query = new URLSearchParams({
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
  })
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${range}:append?${query}`
  const row = [
    submission.id,
    submission.createdAt,
    submission.name,
    submission.email,
    submission.company,
    submission.message,
  ]

  let response = await appendRow(url, row, await getAccessToken())

  // A warm serverless instance can hold an invalidated token. Refresh it once.
  if (response.status === 401) {
    cachedAccessToken = null
    response = await appendRow(url, row, await getAccessToken())
  }

  if (!response.ok) {
    throw new Error(`Google Sheets write failed: ${await readError(response)}`)
  }

  return submission
}
