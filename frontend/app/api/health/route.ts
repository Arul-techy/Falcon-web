import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Falcon Web-Builder API is running on Vercel',
  });
}
