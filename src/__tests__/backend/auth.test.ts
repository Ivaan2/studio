/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';
import { adminAuth } from '@/lib/firebase-admin';

jest.mock('@/lib/firebase-admin', () => ({
  adminAuth: {
    verifyIdToken: jest.fn(),
  },
}));

describe('verifyAuthToken', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns the user id when the token is valid', async () => {
    // Given
    (adminAuth.verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'user-123' });
    const request = new NextRequest('http://localhost/api/items', {
      headers: { authorization: 'Bearer valid-token' },
    });

    // When
    const result = await verifyAuthToken(request);

    // Then
    expect(result).toBe('user-123');
    expect(adminAuth.verifyIdToken).toHaveBeenCalledWith('valid-token');
  });

  it('throws when the authorization header is missing', async () => {
    // Given
    const request = new NextRequest('http://localhost/api/items');

    // When / Then
    await expect(verifyAuthToken(request)).rejects.toThrow(
      'Missing or invalid authorization header'
    );
  });

  it('throws when the token is invalid', async () => {
    // Given
    (adminAuth.verifyIdToken as jest.Mock).mockRejectedValue(new Error('invalid token'));
    const request = new NextRequest('http://localhost/api/items', {
      headers: { authorization: 'Bearer bad-token' },
    });

    // When / Then
    await expect(verifyAuthToken(request)).rejects.toThrow('Invalid authentication token');
  });
});
