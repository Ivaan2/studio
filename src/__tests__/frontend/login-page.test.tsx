import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '@/app/login/page';
import { signInWithPopup } from 'firebase/auth';

const toastMock = jest.fn();

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: toastMock }),
}));

jest.mock('@/lib/firebase', () => ({
  auth: {},
}));

jest.mock('firebase/auth', () => ({
  GoogleAuthProvider: jest.fn().mockImplementation(() => ({})),
  signInWithPopup: jest.fn(),
}));

describe('LoginPage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('logs in with Google and shows a success toast', async () => {
    // Given
    (signInWithPopup as jest.Mock).mockResolvedValue({ user: { uid: 'user-123' } });
    const user = userEvent.setup();
    render(<LoginPage />);

    // When
    await user.click(
      screen.getByRole('button', { name: /continuar con google/i })
    );

    // Then
    await waitFor(() => expect(signInWithPopup).toHaveBeenCalled());
    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Éxito' })
    );
  });
});
