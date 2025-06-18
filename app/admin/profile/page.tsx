import { redirect } from 'next/navigation';

export default function ProfilePage() {
  // Redirect to company info as the default profile page
  redirect('/admin/profile/company-info');
}