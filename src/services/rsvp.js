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
  try {
    const response = await fetch('/api/rsvps');
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error listing RSVPs locally:', error);
    throw error;
  }
}
