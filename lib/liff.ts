'use client'

import liff from '@line/liff'

let isInitialized = false

export async function initLiff(): Promise<void> {
  if (isInitialized) return

  const liffId = process.env.NEXT_PUBLIC_LIFF_ID
  if (!liffId) {
    console.error('LIFF ID is not set')
    return
  }

  try {
    await liff.init({ liffId })
    isInitialized = true
  } catch (error) {
    console.error('LIFF initialization failed:', error)
    throw error
  }
}

export function getLiff() {
  return liff
}

export function isLoggedIn(): boolean {
  return liff.isLoggedIn()
}

export function login(): void {
  liff.login()
}

export function logout(): void {
  liff.logout()
}

export async function getProfile() {
  if (!liff.isLoggedIn()) return null
  return await liff.getProfile()
}

export function getAccessToken(): string | null {
  return liff.getAccessToken()
}

export function closeWindow(): void {
  liff.closeWindow()
}

export function isInClient(): boolean {
  return liff.isInClient()
}
