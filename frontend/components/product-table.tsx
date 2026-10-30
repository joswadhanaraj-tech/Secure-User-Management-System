"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useProducts } from "@/lib/use-products"
import type { Product } from "@/lib/products"

function currency(n: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n || 0)
}

export default function ProductTable({ query }: { query: string }) {
  const { products, update, remove } = useProducts()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draft, setDraft] = useState<Partial<Product>>({})

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = (products || []).slice().sort((a, b) => Number(a.id) - Number(b.id))
    if (!q) return list
    return list.filter(
      (p) =>
        String(p.id).includes(q) ||
        p.name.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q),
    )
  }, [products, query])

  function startEdit(p: Product) {
    setEditingId(p.id)
    setDraft({ ...p })
  }
  function cancelEdit() {
    setEditingId(null)
    setDraft({})
  }
  async function saveEdit() {
    if (!editingId) return
    await update(editingId, {
      id: Number(draft.id ?? editingId),
      name: String(draft.name || ""),
      description: String(draft.description || ""),
      price: Number(draft.price || 0),
      quantity: Number(draft.quantity || 0),
    } as Product)
    setEditingId(null)
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[64px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((p) => {
            const isEditing = editingId === p.id
            return (
              <TableRow key={p.id}>
                <TableCell className="font-medium">
                  {isEditing ? (
                    <Input
                      value={String(draft.id ?? p.id)}
                      onChange={(e) => setDraft((d) => ({ ...d, id: e.target.value }))}
                      aria-label="Edit ID"
                    />
                  ) : (
                    p.id
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      value={String(draft.name ?? p.name)}
                      onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                      aria-label="Edit name"
                    />
                  ) : (
                    p.name
                  )}
                </TableCell>
                <TableCell className="max-w-[320px]">
                  {isEditing ? (
                    <Input
                      value={String(draft.description ?? p.description ?? "")}
                      onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                      aria-label="Edit description"
                    />
                  ) : (
                    <span className="text-muted-foreground">{p.description}</span>
                  )}
                </TableCell>
                <TableCell className="font-semibold text-primary">
                  {isEditing ? (
                    <Input
                      type="number"
                      inputMode="decimal"
                      value={String(draft.price ?? p.price)}
                      onChange={(e) => setDraft((d) => ({ ...d, price: Number(e.target.value) }))}
                      aria-label="Edit price"
                    />
                  ) : (
                    currency(p.price)
                  )}
                </TableCell>
                <TableCell className="w-[120px]">
                  {isEditing ? (
                    <Input
                      type="number"
                      value={String(draft.quantity ?? p.quantity)}
                      onChange={(e) => setDraft((d) => ({ ...d, quantity: Number(e.target.value) }))}
                      aria-label="Edit quantity"
                    />
                  ) : (
                    <span className="inline-flex min-w-[3ch] items-center justify-center rounded-md bg-secondary px-2 py-1 text-sm">
                      {p.quantity}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {isEditing ? (
                    <div className="flex justify-end gap-2">
                      <Button size="sm" onClick={saveEdit}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={() => startEdit(p)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => remove(p.id)}>
                        Delete
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
          {filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No products found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
