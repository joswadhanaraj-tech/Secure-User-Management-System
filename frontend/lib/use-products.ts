"use client"

import useSWR from "swr"
import type { Product } from "./products"
import { createProduct, deleteProduct, getProducts, updateProduct } from "./products"

const fetcher = async () => getProducts()

export function useProducts() {
  const { data, mutate } = useSWR<Product[]>("products", fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnReconnect: false,
  })

  const products = data ?? []

  return {
    products,
    refresh: () => mutate(),
    add: async (p: Product) => {
      await createProduct(p)
      await mutate()
    },
    update: async (id: number, p: Product) => {
      await updateProduct(id, p)
      await mutate()
    },
    remove: async (id: number) => {
      await deleteProduct(id)
      await mutate()
    },
  }
}
