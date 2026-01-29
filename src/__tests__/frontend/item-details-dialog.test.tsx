import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ItemDetailsDialog } from '@/components/freezer/item-details-dialog';
import type { FoodItem } from '@/lib/types';

describe('ItemDetailsDialog', () => {
  it('confirms deletion and closes the dialog', async () => {
    // Given
    const item: FoodItem = {
      id: 'item-1',
      userId: 'user-1',
      name: 'Helado',
      description: 'Chocolate',
      freezerBox: 'Cajón 1',
      itemType: 'otro',
      frozenDate: new Date('2024-01-01'),
      freezerId: 'freezer-1',
    };
    const onOpenChange = jest.fn();
    const onItemDeleted = jest.fn();
    const user = userEvent.setup();

    render(
      <ItemDetailsDialog
        item={item}
        open
        onOpenChange={onOpenChange}
        onItemDeleted={onItemDeleted}
      />
    );

    // When
    await user.click(screen.getByRole('button', { name: /eliminar alimento/i }));
    await user.click(screen.getByRole('button', { name: /^eliminar$/i }));

    // Then
    expect(onItemDeleted).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
