import API from "../services/api";

export async function startStripeCheckout(payload) {
  const { data } = await API.post("/stripe/checkout", payload);
  if (!data?.url) {
    throw new Error("No checkout URL returned");
  }
  window.location.assign(data.url);
  return data;
}

export async function openStripePortal() {
  const { data } = await API.post("/stripe/portal");
  if (!data?.url) {
    throw new Error("No portal URL returned");
  }
  window.location.assign(data.url);
  return data;
}
