"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useProducts } from "@/lib/use-products"
import ProductForm from "@/components/product-form"
import ProductTable from "@/components/product-table"

export default function InventoryApp() {
  const [query, setQuery] = useState("")
  const { products, refresh } = useProducts()

  const totalQty = useMemo(() => (products || []).reduce((acc, p) => acc + Number(p.quantity || 0), 0), [products])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-6 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <img src="/package-box-icon.jpg" alt="Box icon" className="h-8 w-8" />
          <h1 className="text-pretty text-3xl font-semibold tracking-tight">Grow Higher</h1>
          <div className="ml-4 rounded-full bg-secondary px-3 py-1 text-sm">
            <span className="font-medium">Total:</span> {totalQty}
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by id, name or description..."
            className="md:w-[460px]"
            aria-label="Search products"
          />
          <Button variant="outline" onClick={refresh} aria-label="Refresh products">
            Refresh
          </Button>
        </div>
      </header>

      <section className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Add Product</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductTable query={query} />
          </CardContent>
        </Card>

        <details className="rounded-md border p-3">
          <summary className="cursor-pointer text-sm text-muted-foreground">Design reference</summary>
          <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
            <img
              src="/images/reference-1.jpg"
              alt="Reference: header, search and add product card"
              className="rounded-lg border"
            />
            <img
              src="/images/reference-2.jpg"
              alt="Reference: add product and products table layout"
              className="rounded-lg border"
            />
          </div>
        </details>
      </section>
    </div>
  )
}
