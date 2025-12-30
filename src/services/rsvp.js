export async function saveRsvp(data) {
  try {
    const response = await fetch('/api/rsvp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error saving RSVP locally:', error);
    throw error;
  }
}

export async function listRsvps() {
  const res = await fetch('/api/rsvps')
  if (!res.ok) throw new Error('Failed to fetch list')
  return res.json()
}

export async function updateRsvp(id, payload) {
  const res = await fetch(`/api/rsvp/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error('Update failed')
  return res.json()
}

export async function deleteRsvp(id) {
  const res = await fetch(`/api/rsvp/${id}`, {
    method: 'DELETE'
  })
  if (!res.ok) throw new Error('Delete failed')
  return res.json()
}
