export const fetchItemDetails = async (itemId: string) => {
  if (!itemId) {
    throw new Error('Item ID is required');
  }

  const baseUrl = 'https://api.pokemontcg.io/v2/cards';
  const url = `${baseUrl}/${itemId}`;

  try {
    const response = await fetch(url, {
      headers: {
        'X-Api-Key': import.meta.env.VITE_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unknown error occurred');
  }
};
