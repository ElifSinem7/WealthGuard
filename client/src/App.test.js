import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/ASKINDAN PARAMPARCA BIR KALBI TASIYORUM/i);
  expect(linkElement).toBeInTheDocument();
});
