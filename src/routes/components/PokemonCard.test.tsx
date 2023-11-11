const pokemon: Pokemon = {
  name: 'Pikachu',
  id: 1,
  height: 10,
  weight: 10,
  sprites: { front_default: '', back_default: '' },
  species: { name: '', url: '' },
  types: [{ slot: 1, type: { name: 'electric', url: '' } }],
  stats: [
    {
      base_stat: 1,
      effort: 1,
      stat: {
        name: 'hp',
        url: '',
      },
    },
  ],
};
import { Pokemon } from '../../api/types';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import PokemonCard from './PokemonCard';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { pokemonsContext } from '../Root';
import PokemonsList from './PokemonsList';
import PokemonDetails from '../PokemonDetails';

const mockUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
  useLocation: jest.fn().mockReturnValue({
    search: '',
    pathname: '/page/1',
  }),
  useLoaderData: jest.fn().mockReturnValue({
    details: {
      pokemon: pokemon,
      desc: 'When several of these POKéMON gather, their electricity could build and cause lightning storms.',
    },
  }),
  useParams: jest.fn().mockReturnValue({
    pageId: '1',
  }),
  useNavigation: jest.fn().mockReturnValue({
    state: '',
  }),
}));

jest.mock('../../api/getPokemons', () => ({
  getDetails: jest
    .fn()
    .mockReturnValue(
      'When several of these POKéMON gather, their electricity could build and cause lightning storms.'
    ),
}));
jest.spyOn(React, 'useEffect').mockImplementation((f) => f());

const fakeLoader = jest.fn().mockReturnValue(() => {});

describe('Pokemon card ', () => {
  it('Ensure that the card component renders the relevant card data', async () => {
    render(
      <MemoryRouter initialEntries={['/page/1/']}>
        <PokemonCard pokemon={pokemon} />
      </MemoryRouter>
    );

    await waitFor(() => {
      const name = screen.getByText('PIKACHU');
      const weight = screen.getByText('Weight: 1 kg');
      const description = screen.getByText(
        'When several of these POKéMON gather, their electricity could build and cause lightning storms.'
      );
      const type = screen.getByText('electric');

      expect(name).toBeInTheDocument();
      expect(weight).toBeInTheDocument();
      expect(description).toBeInTheDocument();
      expect(type).toBeInTheDocument();
    });
  });

  it('Validate that clicking on a card opens a detailed card component', async () => {
    render(
      <MemoryRouter initialEntries={['/page/1/']}>
        <pokemonsContext.Provider value={[pokemon]}>
          <Routes>
            <Route path="/page/1" element={<PokemonsList />}>
              <Route
                loader={fakeLoader}
                path="details/1"
                element={<PokemonDetails />}
              />
            </Route>
          </Routes>
        </pokemonsContext.Provider>
      </MemoryRouter>
    );

    const card = screen.getByTestId('card');
    fireEvent.click(card);

    await waitFor(() => {
      const details = screen.getByTestId('details');
      expect(details).toBeInTheDocument();
    });
  });
});
