import { supabase } from '../lib/supabase.js'

export async function saveRsvp(data) {
  if (!supabase) throw new Error('Supabase 未初始化')

  // Check if user has already submitted by name
  const { data: existing, error: searchError } = await supabase
    .from('rsvps')
    .select('id')
    .eq('name', data.name)
    .limit(1)
    .maybeSingle()
  
  if (searchError) {
    // If table not found error, try creating it (though client can't create tables usually)
    // or just fallback to generic error handling.
    // For now, let's revert to 'rsvps' table if 'wedding' table doesn't exist or permissions issue.
    // However, the error 'Could not find the table' suggests the table name might be wrong or schema cache issue.
    // Let's stick to 'rsvps' as it was likely the original table name.
    throw searchError
  }

  if (existing) {
    // Update existing record
    const { error } = await supabase
      .from('rsvps')
      .update(data)
      .eq('id', existing.id)
    if (error) throw error
  } else {
    // Create new record
    const { error } = await supabase
      .from('rsvps')
      .insert([data])
    if (error) throw error
  }
}

export async function listRsvps() {
  if (!supabase) throw new Error('Supabase 未初始化')
  const { data, error } = await supabase
    .from('rsvps')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}
