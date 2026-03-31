import { NextResponse, NextRequest } from 'next/server'

export const runtime = 'nodejs'

async function generateJWT(p8Key: string): Promise<string> {
      const teamId = 'XDLNSF664J'
      const clientId = 'com.crewdeskapp.web'
      const keyId = 'Q2AL8ZYYWZ'

  const pemBody = p8Key
        .replace(/-----BEGIN PRIVATE KEY-----/, '')
        .replace(/-----END PRIVATE KEY-----/, '')
        .replace(/\s+/g, '')
      const keyDer = Buffer.from(pemBody, 'base64')

  const cryptoKey = await crypto.subtle.importKey(
          'pkcs8',
          keyDer,
      { name: 'ECDSA', namedCurve: 'P-256' },
          false,
          ['sign']
        )

  const now = Math.floor(Date.now() / 1000)
      const header = { alg: 'ES256', kid: keyId }
      const payload = {
              iss: teamId,
              iat: now,
              exp: now + 15777000,
              aud: 'https://appleid.apple.com',
              sub: clientId,
      }

  const encode = (obj: object) =>
          Buffer.from(JSON.stringify(obj)).toString('base64url')

  const headerB64 = encode(header)
      const payloadB64 = encode(payload)
      const signingInput = `${headerB64}.${payloadB64}`

  const signature = await crypto.subtle.sign(
      { name: 'ECDSA', hash: { name: 'SHA-256' } },
          cryptoKey,
          Buffer.from(signingInput)
        )

  const sigB64 = Buffer.from(signature).toString('base64url')
      return `${signingInput}.${sigB64}`
}

export async function GET() {
      const p8Key = process.env.APPLE_P8_KEY
      if (!p8Key) {
              return NextResponse.json({ error: 'APPLE_P8_KEY env var not set' }, { status: 400 })
      }
      try {
              const jwt = await generateJWT(p8Key)
              return NextResponse.json({ jwt })
      } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : String(err)
              return NextResponse.json({ error: msg }, { status: 500 })
      }
}

export async function POST(request: NextRequest) {
      try {
              const body = await request.json()
              const p8Key = body.p8Key || process.env.APPLE_P8_KEY
              if (!p8Key) {
                        return NextResponse.json({ error: 'No p8Key provided' }, { status: 400 })
              }
              const jwt = await generateJWT(p8Key)
              return NextResponse.json({ jwt })
      } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : String(err)
              return NextResponse.json({ error: msg }, { status: 500 })
      }
}
