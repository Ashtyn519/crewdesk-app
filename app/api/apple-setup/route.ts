import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

// Temporary route to generate Apple client_secret JWT from env var
// Delete this file after setup is complete!
export async function GET() {
    const p8Key = process.env.APPLE_P8_KEY
    if (!p8Key) {
          return NextResponse.json({ error: 'APPLE_P8_KEY env var not set' }, { status: 400 })
        }

    try {
          const teamId = 'XDLNSF664J'
          const clientId = 'com.crewdeskapp.web'
          const keyId = 'Q2AL8ZYYWZ'

          // Import the EC private key from PEM
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
          const exp = now + 15552000 // 180 days

          const b64url = (obj: object | ArrayBuffer) => {
                  const str = obj instanceof ArrayBuffer
                    ? String.fromCharCode(...new Uint8Array(obj))
                    : JSON.stringify(obj)
                  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
                }

          const header = b64url({ alg: 'ES256', kid: keyId, typ: 'JWT' })
          const payload = b64url({
                  iss: teamId,
                  iat: now,
                  exp,
                  aud: 'https://appleid.apple.com',
                  sub: clientId,
                })

          const msg = new TextEncoder().encode(`${header}.${payload}`)
          const sigDer = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, cryptoKey, msg)

          // Convert DER signature to raw R||S format for JWT
          const der = new Uint8Array(sigDer)
          let offset = 2
          const rLen = der[offset + 1]
          offset += 2
          const r = der.slice(offset, offset + rLen)
          offset += rLen + 2
          const sLen = der[offset - 1]
          const s = der.slice(offset, offset + sLen)

          const pad = (arr: Uint8Array) => {
                  const out = new Uint8Array(32)
                  out.set(arr.slice(-32), 32 - Math.min(arr.length, 32))
                  return out
                }

          const sig = new Uint8Array(64)
          sig.set(pad(r), 0)
          sig.set(pad(s), 32)

          const sigB64 = btoa(String.fromCharCode(...sig))
            .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')

          const jwt = `${header}.${payload}.${sigB64}`

          return NextResponse.json({ jwt, expires: new Date(exp * 1000).toISOString() })
        } catch (e) {
          return NextResponse.json({ error: String(e) }, { status: 500 })
        }
  }
