export async function getPortfolios() {
  const response = await fetch('/api/portfolio');
  if (!response.ok) throw new Error('Failed to fetch portfolios');
  return response.json();
}

export async function getPortfolio(id: string) {
  const response = await fetch(`/api/portfolio/${id}`);
  if (!response.ok) throw new Error('Failed to fetch portfolio');
  return response.json();
}

export async function createPortfolio(data: any) {
  const response = await fetch('/api/portfolio', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create portfolio');
  return response.json();
}

export async function updatePortfolio(id: string, data: any) {
  const response = await fetch(`/api/portfolio/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update portfolio');
  return response.json();
}

export async function deletePortfolio(id: string) {
  const response = await fetch(`/api/portfolio/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete portfolio');
  return response.json();
} 