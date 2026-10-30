"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useProducts } from "@/lib/use-products"
import type { Product } from "@/lib/products"

export default function ProductForm() {
  const { add } = useProducts()
  const [form, setForm] = useState<Partial<Product>>({
    id: "" as any,
    name: "",
    description: "",
    price: "" as any,
    quantity: "" as any,
  })

  function update<K extends keyof Product>(key: K, value: Product[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsed: Product = {
      id: Number(form.id || 0),
      name: String(form.name || "").trim(),
      description: String(form.description || "").trim(),
      price: Number(form.price || 0),
      quantity: Number(form.quantity || 0),
    }
    if (!parsed.name) return
    try {
      await add(parsed)
      setForm({ id: "" as any, name: "", description: "", price: "" as any, quantity: "" as any })
    } catch (err: any) {
      // surface API error to the user
      alert(err?.message || "Failed to add product")
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 gap-3 md:grid-cols-4">
      <Input
        placeholder="ID"
        value={String(form.id ?? "")}
        onChange={(e) => update("id", e.target.value as any)}
        aria-label="Product ID"
      />
      <Input
        placeholder="Name"
        value={String(form.name ?? "")}
        onChange={(e) => update("name", e.target.value as any)}
        aria-label="Product name"
      />
      <Input
        placeholder="Description"
        value={String(form.description ?? "")}
        onChange={(e) => update("description", e.target.value as any)}
        aria-label="Product description"
      />
      <Input
        placeholder="Price"
        type="number"
        inputMode="decimal"
        value={String(form.price ?? "")}
        onChange={(e) => update("price", Number(e.target.value) as any)}
        aria-label="Product price"
      />
      <Input
        placeholder="Quantity"
        type="number"
        value={String(form.quantity ?? "")}
        onChange={(e) => update("quantity", Number(e.target.value) as any)}
        aria-label="Product quantity"
        className="md:col-span-1"
      />
      <div className="md:col-span-3 flex items-center">
        <Button type="submit" className="mt-1">
          Add
        </Button>
      </div>
    </form>
  )
}
