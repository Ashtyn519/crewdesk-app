import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const TO_EMAIL = 'info@crewdeskapp.com'
const FROM_EMAIL = process.env.RESEND_FROM || 'noreply@crewdeskapp.com'

export async function POST(req: NextRequest) {
  try {
      const body = await req.json()
          const { name, email, company, message, type } = body

              if (!name || !email || !message) {
                    return NextResponse.json(
                            { error: 'Name, email, and message are required.' },
                                    { status: 400 }
                                          )
                                              }

                                                  const subject =
                                                        type === 'sales'
                                                                ? `Sales Enquiry from ${name}${company ? ` at ${company}` : ''}`
                                                                        : `Contact Form: ${name}${company ? ` (${company})` : ''}`

                                                                            const html = `
                                                                                  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                                                                                          <h2 style="color: #111;">${subject}</h2>
                                                                                                  <table style="width: 100%; border-collapse: collapse;">
                                                                                                            <tr>
                                                                                                                        <td style="padding: 8px 0; font-weight: bold; width: 120px;">Name</td>
                                                                                                                                    <td style="padding: 8px 0;">${name}</td>
                                                                                                                                              </tr>
                                                                                                                                                        <tr>
                                                                                                                                                                    <td style="padding: 8px 0; font-weight: bold;">Email</td>
                                                                                                                                                                                <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
                                                                                                                                                                                          </tr>
                                                                                                                                                                                                    ${company ? `<tr><td style="padding: 8px 0; font-weight: bold;">Company</td><td style="padding: 8px 0;">${company}</td></tr>` : ''}
                                                                                                                                                                                                              <tr>
                                                                                                                                                                                                                          <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Message</td>
                                                                                                                                                                                                                                      <td style="padding: 8px 0; white-space: pre-wrap;">${message}</td>
                                                                                                                                                                                                                                                </tr>
                                                                                                                                                                                                                                                        </table>
                                                                                                                                                                                                                                                                <hr style="margin-top: 24px;" />
                                                                                                                                                                                                                                                                        <p style="color: #888; font-size: 12px;">Sent via CrewDesk contact form</p>
                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                  `

                                                                                                                                                                                                                                                                                      await resend.emails.send({
                                                                                                                                                                                                                                                                                            from: FROM_EMAIL,
                                                                                                                                                                                                                                                                                                  to: TO_EMAIL,
                                                                                                                                                                                                                                                                                                        replyTo: email,
                                                                                                                                                                                                                                                                                                              subject,
                                                                                                                                                                                                                                                                                                                    html,
                                                                                                                                                                                                                                                                                                                        })

                                                                                                                                                                                                                                                                                                                            return NextResponse.json({ success: true })
                                                                                                                                                                                                                                                                                                                              } catch (err) {
                                                                                                                                                                                                                                                                                                                                  console.error('[contact/route] Error:', err)
                                                                                                                                                                                                                                                                                                                                      return NextResponse.json(
                                                                                                                                                                                                                                                                                                                                            { error: 'Failed to send message. Please try again.' },
                                                                                                                                                                                                                                                                                                                                                  { status: 500 }
                                                                                                                                                                                                                                                                                                                                                      )
                                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                                        }