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
  
  if (searchError) throw searchError

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
