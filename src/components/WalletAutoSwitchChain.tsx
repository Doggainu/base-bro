"use client";

import { useEffect, useRef } from "react";
import {
  useChainId,
  useConnection,
  useSwitchChain,
} from "wagmi";

import { BRO_CHAIN } from "@/config/contracts";

/**
 * Prompts the wallet to switch to Base when connected on another network.
 * One attempt per wrong chainId; manual switch button remains as fallback.
 */
export function WalletAutoSwitchChain() {
  const chainId = useChainId();
  const { isConnected, isConnecting, isReconnecting } = useConnection();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();
  const switchAttemptedForChainRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isConnected || isConnecting || isReconnecting) return;
    if (chainId === BRO_CHAIN.id) {
      switchAttemptedForChainRef.current = null;
      return;
    }
    if (isSwitchingChain) return;
    if (switchAttemptedForChainRef.current === chainId) return;

    switchAttemptedForChainRef.current = chainId;
    switchChain({ chainId: BRO_CHAIN.id });
  }, [
    chainId,
    isConnected,
    isConnecting,
    isReconnecting,
    isSwitchingChain,
    switchChain,
  ]);

  return null;
}
