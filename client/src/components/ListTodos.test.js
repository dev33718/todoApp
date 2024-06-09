import React from 'react';
import { render, waitFor } from '@testing-library/react';

import ListTodos from './ListTodos';

const mockTodos = [
  { todo_id: 1, description: 'Todo 1' },
  { todo_id: 2, description: 'Todo 2' },
  // Add more mock todos as needed
];

test('renders ListTodos component', async () => {
  const { getByText } = render(<ListTodos initialTodos={mockTodos} />);
  
  // Wait for the table to be rendered with mock data
  await waitFor(() => {
    const todo1Element = getByText(/Todo 1/i);
    const todo2Element = getByText(/Todo 2/i);
    expect(todo1Element).toBeInTheDocument();
    expect(todo2Element).toBeInTheDocument();
  });
});