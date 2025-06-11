// Utility to check if profile has changed since last indexing
export function hasProfileChanged(
  userProfile: { companyDescription?: string; lastIndexedAt?: string; updatedAt?: string } | null,
  latestIndexingJob: { completedAt?: string; startedAt: string } | null
): boolean {
  if (!userProfile || !latestIndexingJob) return false;
  
  // If profile has been updated after the last indexing
  const lastIndexed = latestIndexingJob.completedAt || latestIndexingJob.startedAt;
  const profileUpdated = userProfile.updatedAt || userProfile.lastIndexedAt;
  
  if (profileUpdated && lastIndexed) {
    return new Date(profileUpdated) > new Date(lastIndexed);
  }
  
  return false;
}