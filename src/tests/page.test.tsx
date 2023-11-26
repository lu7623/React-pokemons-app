import { FetchMock } from 'jest-fetch-mock';
import { render, screen, waitFor } from '@testing-library/react';
import mockRouter from 'next-router-mock';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import { Provider } from 'react-redux';
import { setupStore } from '../store/store';
jest.mock('next/router', () => jest.requireActual('next-router-mock'));
import Pokemons from '../pages/page/[pageId]';

const fetchMock = fetch as FetchMock;
fetchMock.enableMocks();
beforeEach(() => {
  fetchMock.resetMocks();
});

describe('SSR page', () => {
  mockRouter.push('/page/1?qty=20');
  it('renders correctly', async () => {
    fetchMock.mockRejectOnce();
    render(
      <Provider store={setupStore()}>
        <Pokemons />
      </Provider>,
      { wrapper: MemoryRouterProvider }
    );
    await waitFor(() => {
      expect(screen.getByText('next')).toBeInTheDocument();
    });
  });
});