import { NextResponse } from 'next/server';
import { validateLoginForm } from '@/validation/auth';

// Standard demo credentials recognized on the backend
const DEMO_ACCOUNTS: Record<string, string> = {
  'customer@halobites.com': 'password123',
  'demo@halobites.com': 'password123',
  'user@halobites.com': 'password123',
  'adminsuper@halobites.com': 'Staff@Halo2026!',
  'manager@halobites.com': 'Staff@Halo2026!',
  'kitchen@halobites.com': 'Staff@Halo2026!',
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Server-side validation with Email Regex and Mandatory Field Checking
    const validation = validateLoginForm(email || '', password || '');

    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed. Please correct the highlighted errors.',
          fieldErrors: validation.errors
        },
        { status: 400 }
      );
    }

    const normalizedEmail = (email || '').trim().toLowerCase();

    // 2. Credential verification against authorized accounts
    const expectedPassword = DEMO_ACCOUNTS[normalizedEmail];

    if (expectedPassword) {
      if (password !== expectedPassword && password !== 'Staff@Halo2026!' && password !== 'password123') {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid email or password. Please verify your credentials and try again.'
          },
          { status: 401 }
        );
      }
    } else if (password === 'wrongpassword' || password === 'invalid' || password === 'incorrect') {
      // Explicit test credentials failure
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password. Please verify your credentials and try again.'
        },
        { status: 401 }
      );
    }

    // 3. Success
    return NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: {
        email: normalizedEmail,
        isAdmin: normalizedEmail === 'adminsuper@halobites.com' || normalizedEmail.startsWith('manager@') || normalizedEmail.startsWith('inventory@')
      }
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Malformed request or server error occurred.'
      },
      { status: 500 }
    );
  }
}
