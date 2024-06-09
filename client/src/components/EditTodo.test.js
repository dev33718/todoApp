import React from 'react';
import { render } from '@testing-library/react';
import EditTodo from './EditTodo';

const todo = { id: 1, description: 'Test todo' };

test('renders EditTodo component', () => {
  const { getByText } = render(<EditTodo todo={todo} />);
  // Find the Edit button associated with the specific todo within the modal
  const editButton = getByText(/Edit/i, { selector: 'button[aria-label="Edit Todo"]' }); 
  expect(editButton).toBeInTheDocument();
});