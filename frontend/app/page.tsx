"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import InventoryApp from "@/components/inventory-app"

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    // Require session token to access home. We store token in sessionStorage at login.
    try {
      const token = sessionStorage.getItem("access_token")
      if (!token) {
        router.replace("/login")
      }
    } catch (e) {
      router.replace("/login")
    }
  }, [router])

  return (
    <main className="min-h-dvh bg-background">
      <InventoryApp />
    </main>
  )
}
