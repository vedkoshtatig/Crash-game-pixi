export class ApiClient {

  private BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

    return res.json();
  }

  getSession() {
    return this.request<{
      data: {
        sessionId: string;
        operatorCode: string;
        playerExternalId: string;
        playerNickname: string;
        currency: string;
        gameCode: string;
        balance: { amount: string; currency: string } | null;
      };
    }>("/runtime/v1/session", { method: "GET" });
  }

  getRound() {
    return this.request<{
      data: {
        currentRound: {
          id: string;
          roundId: string;
          roundState: string;
          onHoldAt?: string;
          createdAt: string;
        } | null;
        previousRounds: { roundId: string; crashRate: string; startedAt: string; stoppedAt: string }[];
        topWinners: any[];
      };
    }>("/runtime/v1/crash/round", { method: "GET" });
  }

  placeBet(betAmount: number, autoRate: number | null) {
    return this.request("/runtime/v1/crash/bets", {
      method: "POST",
      body: JSON.stringify({ betAmount, autoRate }),
    });
  }

  cashOut() {
    return this.request<{
      data: {
        id: string;
        roundId: string;
        escapeRate: string;
        result: string;
        winningAmount: string;
        balanceAfter: string;
      };
    }>("/runtime/v1/crash/cashout", {
      method: "POST",
      body: "{}",
    });
  }
}
