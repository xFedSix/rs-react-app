import { LoaderFunctionArgs } from 'react-router-dom';
import { fetchItemDetails } from '../utils/pokemonApi';

export async function detailsLoader({ params }: LoaderFunctionArgs) {
  if (!params.id) {
    throw new Error('Item ID is required');
  }

  try {
    const item = await fetchItemDetails(params.id);
    return { item };
  } catch (error) {
    throw new Error('Failed to load item details');
  }
}
