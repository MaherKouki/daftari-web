/** N'accepte qu'un chemin interne de l'application (évite les redirections ouvertes via ?returnUrl=). */
export function safeReturnUrl(url: string | null | undefined, fallback = '/app'): string {
  if (!url || !url.startsWith('/') || url.startsWith('//') || url.includes('\\')) return fallback;
  return url;
}
