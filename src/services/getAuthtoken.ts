export function getAuthToken() {
  return (
    new URLSearchParams(location.search).get("token") ??
    import.meta.env.VITE_DEV_TOKEN ??
    null
  );
}
