export class ApiClient {
  private BASE_URL = "http://194.37.82.191:8004/api/v1";

  private token: string | null;

  constructor(token: string | null) {
    this.token = token;
  }

  private async request<T>(path: string, options: RequestInit): Promise<T> {
    const res = await fetch(`${this.BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      },
    });

    if (!res.ok) {
      const txt = await res.text();

      console.error("API ERROR:", txt);
      throw new Error("API request failed");
    }

    const data = await res.json();
    // console.log("API RESPONSE →", data);
    return data;
  }

  getGameStatus() {
    return this.request("/crash-game/get-crash-game-status", {
      method: "GET",
    });
  }

  placeBet(betAmount: number, autoRate?: number) {
    return this.request("/crash-game/place-bet-crash-game", {
      method: "POST",
      body: JSON.stringify({
        betAmount,
        autoRate:2,
        currencyCode: "USD",
      }),
    });
  }

  cancelBet() {
    return this.request("/crash-game/cancel-bet-crash-game", {
      method: "POST",
    });
  }

  cashOut() {
    return this.request("/crash-game/player-escape-crashGame", {
      method: "POST",
    });
  }
}
