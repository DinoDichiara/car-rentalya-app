import { AuthErrorContent } from './error-content'

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams
  return <AuthErrorContent error={params?.error} />
}
