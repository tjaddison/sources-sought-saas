// This file should be deleted 

import { redirect } from 'next/navigation'

export default function VisionPage() {
  // This will automatically redirect any visits to /vision to the features page
  redirect('/features')
  
  // The below code won't actually run because of the redirect
  return null
} 