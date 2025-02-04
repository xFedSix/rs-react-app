export const fetchData = async (
  searchQuery = '',
  page = 1,
  pageSize = 9,
  orderBy = '',
  select = ''
) => {
  const baseUrl = 'https://api.pokemontcg.io/v2/cards';
  const queryString = searchQuery
    ? `q=name:${encodeURIComponent(searchQuery)}*`
    : '';
  const urlParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(queryString && { q: queryString }),
    ...(orderBy && { orderBy }),
    ...(select && { select })
  });

  const url = `${baseUrl}?${urlParams.toString()}`;
  console.log('Constructed URL:', url);

  try {
    const apiKey = import.meta.env.VITE_API_KEY;
    if (!apiKey) {
      throw new Error('API key is missing');
    }
    const response = await fetch(url, {
      headers: {
        'X-Api-Key': apiKey
      }
    });
    console.log('response:', response);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error('Error occurred in fetchData:', error);
    throw error;
  }
};
