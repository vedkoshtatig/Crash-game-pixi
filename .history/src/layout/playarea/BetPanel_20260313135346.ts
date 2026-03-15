private updateFromStore() {

  const s = this.store

  const cards = this.wrapper.querySelectorAll(".bet-card-ui")

  cards.forEach((card) => {

    const btn = card.querySelector(".bc-bet-btn") as HTMLButtonElement
    const title = card.querySelector(".bc-bet-title")!
    const amt = card.querySelector(".bc-bet-amt")!
    const amtDisplay = card.querySelector(".bc-amount")!

    amtDisplay.textContent = s.betAmount.toFixed(2)

    // ⭐ WAITING
    if (s.phase === "WAITING") {

      btn.className = "bc-bet-btn bc-state-bet"

      if (s.hasBet || s.scheduledBet) {
        title.textContent = "Cancel"
        amt.textContent = s.scheduledBet
          ? "Waiting next round"
          : s.betAmount.toFixed(2) + " USD"

        btn.onclick = () => s.cancelBet()

      } else {

        title.textContent = "Bet"
        amt.textContent = s.betAmount.toFixed(2) + " USD"

        btn.onclick = () => s.placeBet()
      }
    }

    // ⭐ FLYING
    else if (s.phase === "FLYING") {

      if (s.hasBet && !s.hasCashedOut) {

        btn.className = "bc-bet-btn bc-state-cashout"
        title.textContent = "Cashout"
        amt.textContent = s.liveWinAmount.toFixed(2) + " USD"

        btn.onclick = () => s.cashOut()

      } else {

        btn.className = "bc-bet-btn bc-state-bet"

        if (s.scheduledBet) {
          title.textContent = "Cancel"
          amt.textContent = "Waiting next round"
          btn.onclick = () => s.cancelBet()
        } else {
          title.textContent = "Bet"
          amt.textContent = s.betAmount.toFixed(2) + " USD"
          btn.onclick = () => s.placeBet()
        }
      }
    }

    // ⭐ CRASHED
    else if (s.phase === "CRASHED") {

      btn.className = "bc-bet-btn bc-state-disabled"
      title.textContent = "Crashed"
      amt.textContent = ""
      btn.onclick = null
    }

    // ⭐ CASHED
    else if (s.phase === "CASHED_OUT") {

      btn.className = "bc-bet-btn bc-state-success"
      title.textContent = "Cashed"
      amt.textContent = s.winAmount.toFixed(2) + " USD"
      btn.onclick = null
    }

  })
}