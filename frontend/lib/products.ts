export type Product = {
  id: number
  name: string
  description?: string
  price: number
  quantity: number
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  // attach bearer token from session/local storage if present
  const token = (typeof window !== "undefined" && (sessionStorage.getItem("access_token") || localStorage.getItem("access_token"))) || null
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (token) headers["Authorization"] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, {
    headers,
    ...init,
  })

  const text = await res.text()
  let body: any = null
  try {
    body = text ? JSON.parse(text) : null
  } catch (e) {
    body = text
  }

  if (!res.ok) {
    // if backend provided a detail/message, surface it
    const message = body?.detail || body?.message || `HTTP ${res.status}`
    throw new Error(message)
  }

  return body as T
}

export async function getProducts(): Promise<Product[]> {
  const data = await http<any[]>("/products/")
  return Array.isArray(data)
    ? data.map((p) => ({
        id: Number(p.id),
        name: p.name ?? "",
        description: p.description ?? "",
        price: typeof p.price === "number" ? p.price : parseFloat(p.price ?? 0),
        quantity: typeof p.quantity === "number" ? p.quantity : parseInt(p.quantity ?? 0),
      }))
    : []
}

export async function createProduct(p: Product): Promise<Product> {
  return await http<Product>("/products/", {
    method: "POST",
    body: JSON.stringify(p),
  })
}

export async function updateProduct(id: number, p: Partial<Product>): Promise<void> {
  await http(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(p),
  })
}

export async function deleteProduct(id: number): Promise<void> {
  await http(`/products/${id}`, { method: "DELETE" })
}
