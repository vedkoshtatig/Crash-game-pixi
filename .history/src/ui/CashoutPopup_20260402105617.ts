export function showCashoutPopup(multiplier: number, amount: number) {
  const popup = document.getElementById("cashout-popup");

  if (!popup) return;

  const multiEl = popup.querySelector(".popup-multiplier");
  const amtEl = popup.querySelector(".popup-amount");

  if (multiEl) multiEl.textContent = multiplier.toFixed(2) + "x";
  if (amtEl) amtEl.textContent = "₹" + amount.toFixed(2);

  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
  }, 2000);
}