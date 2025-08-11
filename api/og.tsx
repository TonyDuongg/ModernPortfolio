/* @jsxImportSource react */
import { ImageResponse } from '@vercel/og';
export const config = { runtime: 'edge' };

export default function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'TonyDeveloper';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(135deg, #0b0b0e 0%, #12131a 100%)',
        }}
      >
        <div
          style={{
            fontSize: 84,
            fontWeight: 800,
            color: 'white',
            letterSpacing: -2,
            backgroundImage:
              'linear-gradient(90deg,#a78bfa,#ec4899,#22d3ee)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            padding: '0 40px',
            textAlign: 'center'
          }}
        >
          {title}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
