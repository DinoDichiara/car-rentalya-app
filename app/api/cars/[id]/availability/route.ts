import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  // Get only the dates and status, not customer details (privacy)
  const { data: reservations, error } = await supabase
    .from('reservations')
    .select('start_date, end_date, status')
    .eq('car_id', id)
    .eq('status', 'confirmed')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(reservations)
}
