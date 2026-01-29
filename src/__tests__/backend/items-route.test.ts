/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/items/route';
import { DELETE } from '@/app/api/items/[id]/route';
import { adminDb } from '@/lib/firebase-admin';
import { verifyAuthToken } from '@/lib/auth';

const nowTimestamp = { toMillis: jest.fn(() => 1700000000000) };

jest.mock('@/lib/auth', () => ({
  verifyAuthToken: jest.fn(),
}));

jest.mock('@/lib/firebase-admin', () => ({
  adminDb: {
    collection: jest.fn(),
  },
}));

jest.mock('firebase-admin/firestore', () => ({
  Timestamp: {
    now: jest.fn(() => nowTimestamp),
    fromDate: jest.fn(() => nowTimestamp),
  },
}));

describe('items routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates an item for an authenticated user', async () => {
    // Given
    (verifyAuthToken as jest.Mock).mockResolvedValue('user-123');
    const addMock = jest.fn().mockResolvedValue({ id: 'item-123' });
    (adminDb.collection as jest.Mock).mockReturnValue({ add: addMock });

    const request = new NextRequest('http://localhost/api/items', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer valid-token',
      },
      body: JSON.stringify({
        name: 'Pollo congelado',
        description: 'Pechugas 1kg',
        freezerId: 'freezer-1',
        itemType: 'otro',
      }),
    });

    // When
    const response = await POST(request);
    const json = await response.json();

    // Then
    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.id).toBe('item-123');
    expect(json.data.userId).toBe('user-123');
    expect(adminDb.collection).toHaveBeenCalledWith('foodItems');
    expect(addMock).toHaveBeenCalled();
  });

  it('deletes an item owned by the authenticated user', async () => {
    // Given
    (verifyAuthToken as jest.Mock).mockResolvedValue('user-123');
    const deleteMock = jest.fn().mockResolvedValue(undefined);
    const getMock = jest.fn().mockResolvedValue({
      exists: true,
      data: () => ({ userId: 'user-123' }),
    });
    const docMock = jest.fn().mockReturnValue({
      get: getMock,
      delete: deleteMock,
    });
    (adminDb.collection as jest.Mock).mockReturnValue({ doc: docMock });

    const request = new NextRequest('http://localhost/api/items/item-123', {
      method: 'DELETE',
      headers: {
        authorization: 'Bearer valid-token',
      },
    });

    // When
    const response = await DELETE(request, { params: Promise.resolve({ id: 'item-123' }) });
    const json = await response.json();

    // Then
    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.id).toBe('item-123');
    expect(deleteMock).toHaveBeenCalled();
  });
});
