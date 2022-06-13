pnpm run build-icons
curl -fsSL https://deno.land/x/install/install.sh | sh
export DENO_INSTALL="/vercel/.deno"
export PATH="$DENO_INSTALL/bin:$PATH"
deno task build
