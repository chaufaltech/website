import assert from 'node:assert/strict'
import { generateKeyPairSync } from 'node:crypto'
import test from 'node:test'

test('appends a contact submission to the configured sheet', async (context) => {
  const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 })
  process.env.GOOGLE_SHEETS_ID = 'spreadsheet-id'
  process.env.GOOGLE_SHEET_NAME = 'Contact Submissions'
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'website@example.iam.gserviceaccount.com'
  process.env.GOOGLE_PRIVATE_KEY = privateKey.export({ type: 'pkcs8', format: 'pem' })

  const requests = []
  context.mock.method(globalThis, 'fetch', async (url, options) => {
    requests.push({ url: String(url), options })

    if (String(url) === 'https://oauth2.googleapis.com/token') {
      return new Response(JSON.stringify({ access_token: 'test-token', expires_in: 3600 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ updates: { updatedRows: 1 } }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  })

  const { appendContactSubmission } = await import('../api/lib/googleSheets.js')
  const result = await appendContactSubmission({
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    company: 'Analytical Engines',
    message: '=This remains plain text',
  })

  assert.equal(requests.length, 2)
  assert.match(requests[1].url, /spreadsheets\/spreadsheet-id\/values/)
  assert.match(requests[1].url, /valueInputOption=RAW/)
  assert.equal(requests[1].options.headers.Authorization, 'Bearer test-token')

  const requestBody = JSON.parse(requests[1].options.body)
  assert.deepEqual(requestBody.values[0].slice(2), [
    'Ada Lovelace',
    'ada@example.com',
    'Analytical Engines',
    '=This remains plain text',
  ])
  assert.equal(result.name, 'Ada Lovelace')
  assert.match(result.id, /^[0-9a-f-]{36}$/)
})
