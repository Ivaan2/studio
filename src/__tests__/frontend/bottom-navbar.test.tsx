import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BottomNavbar } from '@/components/bottom-navbar';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';

jest.mock('@/hooks/use-auth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/lib/firebase', () => ({
  auth: {
    signOut: jest.fn(),
  },
}));

describe('BottomNavbar', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('signs out the user from the menu', async () => {
    // Given
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        displayName: 'Test User',
        email: 'test@example.com',
        photoURL: 'https://example.com/avatar.png',
      },
      loading: false,
    });

    const user = userEvent.setup();
    render(
      <BottomNavbar
        view="grid"
        setView={jest.fn()}
        onAddClick={jest.fn()}
        searchQuery=""
        onSearchQueryChange={jest.fn()}
        freezers={[{ id: 'freezer-1', name: 'Freezer 1' }]}
        currentFreezerId="freezer-1"
        onFreezerChange={jest.fn()}
      />
    );

    // When
    await user.click(screen.getByRole('button', { name: /test user/i }));
    await user.click(
      await screen.findByRole('menuitem', { name: /cerrar sesión/i })
    );

    // Then
    expect(auth.signOut).toHaveBeenCalled();
  });
});
