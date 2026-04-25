"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useEffect, useState } from "react";

/**
 * Hook que busca dados do banco e mantém um cache em localStorage.
 * - Se o banco responder, salva os dados no cache e os exibe.
 * - Se o banco cair, exibe os dados do cache (última versão conhecida).
 */
export function useCachedQuery<T>(
  queryKey: string,
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn" | "initialData">
) {
  const cacheKey = `cache_${queryKey}`;

  // Ler o cache do localStorage (com segurança para SSR)
  const [cachedData, setCachedData] = useState<T | undefined>(() => {
    if (typeof window === "undefined") return undefined;
    try {
      const raw = localStorage.getItem(cacheKey);
      return raw ? (JSON.parse(raw) as T) : undefined;
    } catch {
      return undefined;
    }
  });

  const query = useQuery<T, Error>({
    queryKey: [queryKey],
    queryFn,
    initialData: cachedData,
    ...options,
  });

  // Quando os dados chegam do banco, atualizar o cache
  useEffect(() => {
    if (query.data && !query.isPlaceholderData) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(query.data));
        setCachedData(query.data);
      } catch {
        // Ignorar erros de localStorage (ex: modo privado)
      }
    }
  }, [query.data, query.isPlaceholderData, cacheKey]);

  // Retornar dados do banco ou do cache, nunca undefined se houver cache
  return {
    ...query,
    data: query.data ?? cachedData,
  };
}
