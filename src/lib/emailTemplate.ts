export interface EmailField { label: string; value: string }
export interface EmailBlock { heading: string; html: string }

export interface EmailOptions {
  badge: string
  title: string
  fields: EmailField[]
  blocks?: EmailBlock[]
  footer?: string
}

const BG_PAGE      = '#f5f6fa'
const BG_CARD      = '#ffffff'
const BG_SOFT      = '#f5f6fa'
const NAVY_DEEP    = '#0e1c33'
const NAVY         = '#162847'
const TEXT_MUTED   = '#6c7891'
const RED          = '#ec6a3a'
const AMBER        = '#c45018'
const BORDER       = '#dde1ec'
const BORDER_LIGHT = '#eef0f5'

export function escapeHtml(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function fieldRow({ label, value }: EmailField): string {
  if (!value) return ''
  return `
    <tr>
      <td style="padding:14px 24px;width:38%;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${RED};border-bottom:1px solid ${BORDER_LIGHT};vertical-align:top;">${label}</td>
      <td style="padding:14px 24px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${NAVY};border-bottom:1px solid ${BORDER_LIGHT};word-break:break-word;line-height:1.55;">${value}</td>
    </tr>`
}

function longBlock({ heading, html }: EmailBlock): string {
  return `
    <tr>
      <td style="padding:22px 24px 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:${RED};">${heading}</td>
    </tr>
    <tr>
      <td style="padding:0 24px 24px;">
        <div style="background:${BG_SOFT};border:1px solid ${BORDER_LIGHT};border-radius:10px;padding:18px 20px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${NAVY};line-height:1.75;">
          ${html}
        </div>
      </td>
    </tr>`
}

export function buildEmail(opts: EmailOptions): string {
  const fieldsHtml = opts.fields.map(fieldRow).join('')
  const blocksHtml = (opts.blocks ?? []).map(longBlock).join('')
  const footer     = opts.footer ?? 'ALLBOTIX TECHNOLOGIES · Ahmedabad, Gujarat · allbotix.ai'

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${escapeHtml(opts.title)}</title>
</head>
<body style="margin:0;padding:0;background:${BG_PAGE};">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${BG_PAGE};padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:${BG_CARD};border-radius:16px;overflow:hidden;border:1px solid ${BORDER};max-width:600px;width:100%;box-shadow:0 4px 24px rgba(22,40,71,0.06);">

        <!-- Brand accent bar -->
        <tr><td style="height:4px;background:${RED};background-image:linear-gradient(90deg,${RED},${AMBER});line-height:0;font-size:0;">&nbsp;</td></tr>

        <!-- Header -->
        <tr>
          <td style="background:${NAVY_DEEP};padding:32px 32px 28px;">
            <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:rgba(255,255,255,0.6);">${escapeHtml(opts.badge)}</p>
            <h1 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:0.01em;line-height:1.25;">${escapeHtml(opts.title)}</h1>
            <div style="margin-top:14px;width:36px;height:2px;background:${RED};background-image:linear-gradient(90deg,${RED},${AMBER});line-height:0;font-size:0;">&nbsp;</div>
          </td>
        </tr>

        <!-- Fields -->
        <tr><td>
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            ${fieldsHtml}
          </table>
        </td></tr>

        ${blocksHtml}

        <!-- Footer -->
        <tr>
          <td style="padding:18px 24px;border-top:1px solid ${BORDER_LIGHT};text-align:center;background:${BG_SOFT};">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:${TEXT_MUTED};letter-spacing:0.1em;">${escapeHtml(footer)}</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export const EMAIL_COLORS = { RED, AMBER, NAVY, NAVY_DEEP, BG_SOFT, BORDER_LIGHT, TEXT_MUTED }
