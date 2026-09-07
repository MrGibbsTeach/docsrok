import { ImageResponse } from 'next/og'

export const alt = 'Docs Rok — business paperwork for Australian trades'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * The preview card for every link to this site: forum posts, directory
 * listings, anything shared. Generated rather than a static asset so the
 * wording stays in sync with the offer.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#ffffff',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: '#c2410c',
              letterSpacing: '-0.01em',
            }}
          >
            Docs Rok
          </div>
          <div
            style={{
              marginTop: 34,
              fontSize: 66,
              fontWeight: 800,
              color: '#1b1917',
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              maxWidth: 900,
            }}
          >
            The paperwork your trade business never gets around to.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 26, color: '#57524c' }}>
              SOPs · Quote templates · Subbie packs · Policies
            </div>
            <div style={{ fontSize: 26, color: '#57524c' }}>
              Any Australian trade, any state
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 25,
              fontWeight: 700,
              color: '#ffffff',
              background: '#c2410c',
              padding: '15px 28px',
              borderRadius: 12,
            }}
          >
            2 documents free
          </div>
        </div>
      </div>
    ),
    size
  )
}
