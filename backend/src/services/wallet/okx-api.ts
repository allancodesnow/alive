/**
 * OKX Onchain OS API Client
 * Uses the onchainos CLI for wallet operations on X Layer
 * CLI must be authenticated: onchainos wallet login <email>
 */

import { execSync, exec } from "child_process";
import crypto from "crypto";

// X Layer (OKB) chain ID
const X_LAYER_CHAIN_ID = "196";
const CHAIN_NAME = "xlayer";

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
  private cliAvailable: boolean;
  private mockMode: boolean;

  constructor() {
    // Check if onchainos CLI is available and authenticated
    this.cliAvailable = this.checkCliAvailable();
    this.mockMode = !this.cliAvailable;

    if (this.mockMode) {
      console.log("[OKX] Running in mock mode - onchainos CLI not available or not authenticated");
    } else {
      console.log("[OKX] Using onchainos CLI for wallet operations");
    }
  }

  /**
   * Check if onchainos CLI is installed and authenticated
   */
  private checkCliAvailable(): boolean {
    try {
      const result = execSync("onchainos wallet status", {
        encoding: "utf-8",
        timeout: 5000,
        env: { ...process.env, PATH: `${process.env.HOME}/.local/bin:${process.env.PATH}` },
      });
      const status = JSON.parse(result);
      return status.ok && status.data?.loggedIn === true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Execute onchainos CLI command
   */
  private runCli(command: string): any {
    try {
      const result = execSync(`onchainos ${command}`, {
        encoding: "utf-8",
        timeout: 30000,
        env: { ...process.env, PATH: `${process.env.HOME}/.local/bin:${process.env.PATH}` },
      });
      return JSON.parse(result);
    } catch (error: any) {
      console.error(`[OKX CLI] Error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Check if running in mock mode (no real API calls)
   */
  isMockMode(): boolean {
    return this.mockMode;
  }

  /**
   * Get the primary wallet address for X Layer
   */
  async getPrimaryAddress(): Promise<string | null> {
    if (this.mockMode) return null;

    try {
      const result = this.runCli(`wallet addresses --chain ${CHAIN_NAME}`);
      if (result.ok && result.data?.xlayer?.length > 0) {
        return result.data.xlayer[0].address;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Create an agentic wallet for a character
   * Uses OKX Onchain OS - creates a sub-account under the main wallet
   */
  async createWallet(characterTicker: string): Promise<WalletInfo> {
    if (this.mockMode) {
      // Generate mock wallet for testing
      const mockId = `mock_wallet_${characterTicker}_${Date.now()}`;
      const mockAddress = `0x${crypto.randomBytes(20).toString("hex")}`;
      console.log(`[OKX Mock] Created wallet for ${characterTicker}: ${mockAddress}`);
      return { walletId: mockId, address: mockAddress };
    }

    try {
      // Use onchainos wallet add to create a new account
      const result = this.runCli(`wallet add --name "ALIVE_${characterTicker}"`);

      if (result.ok && result.data) {
        // Get the new account's address
        const addresses = this.runCli(`wallet addresses --chain ${CHAIN_NAME}`);
        const xlayerAddr = addresses.data?.xlayer?.[0]?.address;

        return {
          walletId: result.data.accountId || `alive_${characterTicker}`,
          address: xlayerAddr || `0x${crypto.randomBytes(20).toString("hex")}`,
        };
      }

      throw new Error("Failed to create wallet");
    } catch (error: any) {
      // Fall back to using existing primary wallet with character-specific ID
      const primaryAddr = await this.getPrimaryAddress();
      if (primaryAddr) {
        return {
          walletId: `alive_${characterTicker}_${Date.now()}`,
          address: primaryAddr,
        };
      }

      // Final fallback to mock
      const mockId = `mock_wallet_${characterTicker}_${Date.now()}`;
      const mockAddress = `0x${crypto.randomBytes(20).toString("hex")}`;
      return { walletId: mockId, address: mockAddress };
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
        okb: "10.5", // Mock 10.5 OKB
        tokens: [],
      };
    }

    try {
      const result = this.runCli(`wallet balance --chain ${CHAIN_NAME}`);

      if (result.ok && result.data) {
        // Parse balance from CLI output
        const balances = result.data.balances || [];
        const okbBalance = balances.find((b: any) =>
          b.symbol?.toUpperCase() === "OKB" ||
          b.tokenAddress === OKB_ADDRESS
        );

        return {
          okb: okbBalance?.balance || "0",
          tokens: balances
            .filter((b: any) => b.symbol?.toUpperCase() !== "OKB")
            .map((b: any) => ({
              tokenAddress: b.tokenAddress || "",
              symbol: b.symbol || "",
              balance: b.balance || "0",
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
   * Send OKB to another address (for tips, battle stakes)
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
      const result = this.runCli(
        `wallet send --chain ${CHAIN_NAME} --to ${toAddress} --amount ${amount}`
      );

      if (result.ok && result.data?.txHash) {
        return { success: true, txHash: result.data.txHash };
      }

      return { success: false, error: result.msg || "Transaction failed" };
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
      const result = this.runCli(
        `swap quote --chain ${CHAIN_NAME} --from ${fromToken} --to ${toToken} --amount ${amount}`
      );

      if (result.ok && result.data) {
        return {
          fromToken,
          toToken,
          fromAmount: amount,
          toAmount: result.data.toAmount || amount,
          priceImpact: result.data.priceImpact || "0",
          route: result.data.route || [fromToken, toToken],
        };
      }

      throw new Error("Failed to get quote");
    } catch (error: any) {
      // Return mock quote on error
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
   * Execute a DEX swap (okx-dex-swap skill)
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
      const result = this.runCli(
        `swap execute --chain ${CHAIN_NAME} --from ${fromToken} --to ${toToken} --amount ${amount} --slippage ${slippageTolerance}`
      );

      if (result.ok && result.data?.txHash) {
        return { success: true, txHash: result.data.txHash };
      }

      return { success: false, error: result.msg || "Swap failed" };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Check token security (okx-security skill)
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
      const result = this.runCli(
        `security token-scan --chain ${CHAIN_NAME} --token ${tokenAddress}`
      );

      if (result.ok && result.data) {
        const riskLevel = result.data.riskLevel || "medium";
        return {
          isSecure: riskLevel !== "high" && !result.data.isHoneypot,
          riskLevel: riskLevel as "low" | "medium" | "high",
          warnings: result.data.warnings || [],
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
