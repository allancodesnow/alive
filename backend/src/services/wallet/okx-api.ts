/**
 * OKX Onchain OS API Client
 * Uses direct HTTP API calls for wallet operations on X Layer
 */

import crypto from "crypto";

// X Layer chain config
const X_LAYER_CHAIN_ID = "196";
const X_LAYER_TESTNET_CHAIN_ID = "195";

// OKX API endpoints
const OKX_BASE_URL = "https://www.okx.com";
const OKX_DEX_API = "https://www.okx.com/api/v5/dex/aggregator";
const OKX_WALLET_API = "https://www.okx.com/api/v5/waas";

// Native OKB token
const OKB_ADDRESS = "0x0000000000000000000000000000000000000000";

interface WalletInfo {
  walletId: string;
  address: string;
}

interface TokenBalance {
  tokenAddress: string;
  symbol: string;
  balance: string;
  balanceUsd: string;
}

interface SwapQuote {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  priceImpact: string;
  route: string[];
}

interface TxResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

export class OkxApiClient {
  private apiKey: string;
  private secretKey: string;
  private passphrase: string;
  private projectId: string;
  private mockMode: boolean;

  constructor() {
    this.apiKey = process.env.OKX_API_KEY || "";
    this.secretKey = process.env.OKX_SECRET_KEY || "";
    this.passphrase = process.env.OKX_PASSPHRASE || "";
    this.projectId = process.env.OKX_PROJECT_ID || this.apiKey;

    // Check if credentials are available
    this.mockMode = !this.apiKey || !this.secretKey || !this.passphrase;

    if (this.mockMode) {
      console.log("[OKX] Running in mock mode - API credentials not configured");
    } else {
      console.log("[OKX] API credentials configured - using real OKX API");
    }
  }

  /**
   * Generate OKX API signature
   */
  private generateSignature(
    timestamp: string,
    method: string,
    requestPath: string,
    body: string = ""
  ): string {
    const preHash = timestamp + method.toUpperCase() + requestPath + body;
    return crypto
      .createHmac("sha256", this.secretKey)
      .update(preHash)
      .digest("base64");
  }

  /**
   * Make authenticated API request to OKX
   */
  private async apiRequest(
    method: string,
    path: string,
    body?: any
  ): Promise<any> {
    const timestamp = new Date().toISOString();
    const bodyStr = body ? JSON.stringify(body) : "";
    const signature = this.generateSignature(timestamp, method, path, bodyStr);

    const headers: Record<string, string> = {
      "OK-ACCESS-KEY": this.apiKey,
      "OK-ACCESS-SIGN": signature,
      "OK-ACCESS-TIMESTAMP": timestamp,
      "OK-ACCESS-PASSPHRASE": this.passphrase,
      "OK-ACCESS-PROJECT": this.projectId,
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(`${OKX_BASE_URL}${path}`, {
        method,
        headers,
        body: bodyStr || undefined,
      });

      const data = await response.json();

      if (data.code !== "0" && data.code !== 0) {
        console.error(`[OKX API] Error: ${data.msg || JSON.stringify(data)}`);
        return { ok: false, error: data.msg || "API error" };
      }

      return { ok: true, data: data.data };
    } catch (error: any) {
      console.error(`[OKX API] Request failed: ${error.message}`);
      return { ok: false, error: error.message };
    }
  }

  /**
   * Check if running in mock mode
   */
  isMockMode(): boolean {
    return this.mockMode;
  }

  /**
   * Create an agentic wallet for a character
   */
  async createWallet(characterTicker: string): Promise<WalletInfo> {
    if (this.mockMode) {
      const mockId = `mock_wallet_${characterTicker}_${Date.now()}`;
      const mockAddress = `0x${crypto.randomBytes(20).toString("hex")}`;
      console.log(`[OKX Mock] Created wallet for ${characterTicker}: ${mockAddress}`);
      return { walletId: mockId, address: mockAddress };
    }

    try {
      // Create wallet using WaaS API
      const result = await this.apiRequest("POST", "/api/v5/waas/wallet/create-wallet", {
        walletName: `ALIVE_${characterTicker}`,
        chainId: X_LAYER_TESTNET_CHAIN_ID,
      });

      if (result.ok && result.data) {
        const wallet = Array.isArray(result.data) ? result.data[0] : result.data;
        return {
          walletId: wallet.walletId || `alive_${characterTicker}_${Date.now()}`,
          address: wallet.address || `0x${crypto.randomBytes(20).toString("hex")}`,
        };
      }

      // Fallback: generate deterministic address from character
      const deterministicAddr = "0x" + crypto
        .createHash("sha256")
        .update(`ALIVE_${characterTicker}_${this.projectId}`)
        .digest("hex")
        .slice(0, 40);

      return {
        walletId: `alive_${characterTicker}_${Date.now()}`,
        address: deterministicAddr,
      };
    } catch (error: any) {
      console.error(`[OKX] Failed to create wallet: ${error.message}`);
      const mockAddress = `0x${crypto.randomBytes(20).toString("hex")}`;
      return { walletId: `fallback_${characterTicker}`, address: mockAddress };
    }
  }

  /**
   * Get wallet balance (OKB + tokens)
   */
  async getBalance(walletAddress: string): Promise<{
    okb: string;
    tokens: TokenBalance[];
  }> {
    if (this.mockMode) {
      return {
        okb: "10.5",
        tokens: [],
      };
    }

    try {
      // Get token balances using DEX API
      const result = await this.apiRequest(
        "GET",
        `/api/v5/dex/aggregator/all-tokens?chainId=${X_LAYER_TESTNET_CHAIN_ID}`
      );

      // Also try to get balance from wallet API
      const balanceResult = await this.apiRequest(
        "GET",
        `/api/v5/waas/asset/balances?address=${walletAddress}&chainId=${X_LAYER_TESTNET_CHAIN_ID}`
      );

      if (balanceResult.ok && balanceResult.data) {
        const balances = Array.isArray(balanceResult.data) ? balanceResult.data : [balanceResult.data];
        const okbBalance = balances.find((b: any) =>
          b.tokenSymbol?.toUpperCase() === "OKB" ||
          b.tokenAddress === OKB_ADDRESS ||
          b.tokenAddress === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
        );

        return {
          okb: okbBalance?.balance || okbBalance?.tokenBalance || "0",
          tokens: balances
            .filter((b: any) => b.tokenSymbol?.toUpperCase() !== "OKB")
            .map((b: any) => ({
              tokenAddress: b.tokenAddress || "",
              symbol: b.tokenSymbol || "",
              balance: b.balance || b.tokenBalance || "0",
              balanceUsd: b.balanceUsd || "0",
            })),
        };
      }

      return { okb: "0", tokens: [] };
    } catch (error) {
      console.error("[OKX] Failed to get balance:", error);
      return { okb: "0", tokens: [] };
    }
  }

  /**
   * Send OKB to another address
   */
  async sendOkb(
    fromWalletId: string,
    toAddress: string,
    amount: string
  ): Promise<TxResult> {
    if (this.mockMode) {
      const mockTxHash = `0x${crypto.randomBytes(32).toString("hex")}`;
      console.log(`[OKX Mock] Sent ${amount} OKB to ${toAddress}: ${mockTxHash}`);
      return { success: true, txHash: mockTxHash };
    }

    try {
      const result = await this.apiRequest("POST", "/api/v5/waas/wallet/transfer", {
        walletId: fromWalletId,
        toAddress,
        amount,
        tokenAddress: OKB_ADDRESS,
        chainId: X_LAYER_TESTNET_CHAIN_ID,
      });

      if (result.ok && result.data) {
        const tx = Array.isArray(result.data) ? result.data[0] : result.data;
        return { success: true, txHash: tx.txHash || tx.transactionHash };
      }

      return { success: false, error: result.error || "Transaction failed" };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get swap quote from DEX aggregator
   */
  async getSwapQuote(
    fromToken: string,
    toToken: string,
    amount: string
  ): Promise<SwapQuote> {
    if (this.mockMode) {
      const mockToAmount = (parseFloat(amount) * 0.99).toString();
      return {
        fromToken,
        toToken,
        fromAmount: amount,
        toAmount: mockToAmount,
        priceImpact: "0.01",
        route: [fromToken, toToken],
      };
    }

    try {
      // Use OKX DEX Aggregator API
      const params = new URLSearchParams({
        chainId: X_LAYER_TESTNET_CHAIN_ID,
        fromTokenAddress: fromToken,
        toTokenAddress: toToken,
        amount,
        slippage: "0.01",
      });

      const result = await this.apiRequest(
        "GET",
        `/api/v5/dex/aggregator/quote?${params.toString()}`
      );

      if (result.ok && result.data) {
        const quote = Array.isArray(result.data) ? result.data[0] : result.data;
        return {
          fromToken,
          toToken,
          fromAmount: amount,
          toAmount: quote.toTokenAmount || quote.toAmount || amount,
          priceImpact: quote.priceImpact || "0",
          route: quote.routerList || [fromToken, toToken],
        };
      }

      // Fallback mock quote
      return {
        fromToken,
        toToken,
        fromAmount: amount,
        toAmount: (parseFloat(amount) * 0.99).toString(),
        priceImpact: "0.01",
        route: [fromToken, toToken],
      };
    } catch (error: any) {
      return {
        fromToken,
        toToken,
        fromAmount: amount,
        toAmount: (parseFloat(amount) * 0.99).toString(),
        priceImpact: "0.01",
        route: [fromToken, toToken],
      };
    }
  }

  /**
   * Execute a DEX swap
   */
  async swap(
    walletId: string,
    fromToken: string,
    toToken: string,
    amount: string,
    slippageTolerance: string = "0.01"
  ): Promise<TxResult> {
    if (this.mockMode) {
      const mockTxHash = `0x${crypto.randomBytes(32).toString("hex")}`;
      console.log(`[OKX Mock] Swap ${amount} ${fromToken} → ${toToken}: ${mockTxHash}`);
      return { success: true, txHash: mockTxHash };
    }

    try {
      // First get the swap data
      const params = new URLSearchParams({
        chainId: X_LAYER_TESTNET_CHAIN_ID,
        fromTokenAddress: fromToken,
        toTokenAddress: toToken,
        amount,
        slippage: slippageTolerance,
        userWalletAddress: walletId,
      });

      const swapResult = await this.apiRequest(
        "GET",
        `/api/v5/dex/aggregator/swap?${params.toString()}`
      );

      if (swapResult.ok && swapResult.data) {
        const swap = Array.isArray(swapResult.data) ? swapResult.data[0] : swapResult.data;

        // Execute the transaction
        const execResult = await this.apiRequest("POST", "/api/v5/waas/wallet/send-transaction", {
          walletId,
          chainId: X_LAYER_TESTNET_CHAIN_ID,
          to: swap.tx?.to || swap.routerAddress,
          data: swap.tx?.data || swap.data,
          value: swap.tx?.value || "0",
        });

        if (execResult.ok && execResult.data) {
          const tx = Array.isArray(execResult.data) ? execResult.data[0] : execResult.data;
          return { success: true, txHash: tx.txHash || tx.transactionHash };
        }
      }

      return { success: false, error: "Swap execution failed" };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Check token security
   */
  async checkTokenSecurity(tokenAddress: string): Promise<{
    isSecure: boolean;
    riskLevel: "low" | "medium" | "high";
    warnings: string[];
  }> {
    if (this.mockMode) {
      return {
        isSecure: true,
        riskLevel: "low",
        warnings: [],
      };
    }

    try {
      const result = await this.apiRequest(
        "GET",
        `/api/v5/dex/aggregator/token-info?chainId=${X_LAYER_TESTNET_CHAIN_ID}&tokenAddress=${tokenAddress}`
      );

      if (result.ok && result.data) {
        const token = Array.isArray(result.data) ? result.data[0] : result.data;
        const isHoneypot = token.isHoneypot === true || token.honeypot === true;
        const hasWarnings = (token.warnings?.length || 0) > 0;

        return {
          isSecure: !isHoneypot && !hasWarnings,
          riskLevel: isHoneypot ? "high" : hasWarnings ? "medium" : "low",
          warnings: token.warnings || [],
        };
      }

      return { isSecure: true, riskLevel: "low", warnings: [] };
    } catch (error: any) {
      return { isSecure: false, riskLevel: "high", warnings: [error.message] };
    }
  }
}

// Export singleton instance
export const okxApi = new OkxApiClient();

// Export types
export type { WalletInfo, TokenBalance, SwapQuote, TxResult };
