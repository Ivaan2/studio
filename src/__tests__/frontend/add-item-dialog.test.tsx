import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddItemDialog from '@/components/freezer/add-item-dialog';
import { auth } from '@/lib/firebase';

const toastMock = jest.fn();

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: toastMock }),
}));

jest.mock('@/lib/firebase', () => ({
  auth: {
    currentUser: null,
  },
}));

describe('AddItemDialog', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates an item when the form is submitted', async () => {
    // Given
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const getIdTokenMock = jest.fn().mockResolvedValue('token-123');
    const authMock = auth as unknown as { currentUser: { getIdToken: jest.Mock } | null };
    authMock.currentUser = { getIdToken: getIdTokenMock };

    const onOpenChangeAction = jest.fn();
    const onItemAddedAction = jest.fn();

    const user = userEvent.setup();
    render(
      <AddItemDialog
        open
        onOpenChangeAction={onOpenChangeAction}
        onItemAddedAction={onItemAddedAction}
        currentFreezerId="freezer-1"
      />
    );

    // When
    await user.type(
      screen.getByLabelText(/nombre del alimento/i),
      'Alitas de pollo'
    );
    await user.type(
      screen.getByLabelText(/descripción/i),
      'Adobadas con limón'
    );
    await user.click(screen.getByRole('button', { name: /añadir/i }));

    // Then
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const [, options] = fetchMock.mock.calls[0];
    const body = JSON.parse(options.body as string);
    const headers = options.headers as Record<string, string>;

    expect(options.method).toBe('POST');
    expect(headers.Authorization).toBe('Bearer token-123');
    expect(body).toMatchObject({
      name: 'Alitas de pollo',
      description: 'Adobadas con limón',
      freezerId: 'freezer-1',
    });
    expect(onItemAddedAction).toHaveBeenCalled();
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Éxito' })
    );
  });
});
