import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import InputTodo from './InputTodo';

test('renders InputTodo component', () => {
  const { getByText, getByPlaceholderText } = render(<InputTodo />);
  const addButton = getByText(/Add/i);
  const inputElement = getByPlaceholderText('Enter a todo...');
  expect(addButton).toBeInTheDocument();
  expect(inputElement).toBeInTheDocument();
});

test('adds a new todo', async () => {
  const { getByText, getByPlaceholderText } = render(<InputTodo />);
  const inputElement = getByPlaceholderText('Enter a todo...');
  const addButton = getByText(/Add/i);
  fireEvent.change(inputElement, { target: { value: 'Test todo' } });
  fireEvent.click(addButton);
});
