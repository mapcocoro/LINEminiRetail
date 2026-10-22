import { TIME_SLOTS, type TimeSlot } from '@/types'

const MAX_ITEM_TYPES = 20
const MAX_NOTE_LENGTH = 500
const MAX_ID_LENGTH = 64
const MAX_DAYS_AHEAD = 8 // 画面では翌日〜7日後を選べる。時差の分だけ余裕を持たせる
const DAY_MS = 24 * 60 * 60 * 1000

export interface ReservationInput {
  pickupDate: Date
  pickupTimeSlot: TimeSlot
  note: string | null
  items: { productId: string; quantity: number }[]
}

/**
 * 予約APIの入力を検証する。金額・単価はクライアントから受け取らず、サーバー側でDBの価格から計算する。
 * 正しければ入力を、誤りがあればエラーメッセージを返す。
 */
export function parseReservationInput(body: unknown): ReservationInput | string {
  if (typeof body !== 'object' || body === null) return '入力内容が正しくありません'
  const { pickupDate, pickupTimeSlot, note, items } = body as Record<string, unknown>

  const date = typeof pickupDate === 'string' ? new Date(pickupDate) : null
  const now = Date.now()
  if (
    !date ||
    Number.isNaN(date.getTime()) ||
    date.getTime() <= now ||
    date.getTime() > now + MAX_DAYS_AHEAD * DAY_MS
  ) {
    return '受取日が正しくありません'
  }

  if (!TIME_SLOTS.includes(pickupTimeSlot as TimeSlot)) {
    return '受取時間帯が正しくありません'
  }

  if (note != null && (typeof note !== 'string' || note.length > MAX_NOTE_LENGTH)) {
    return `備考は${MAX_NOTE_LENGTH}文字以内で入力してください`
  }

  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_ITEM_TYPES) {
    return '商品の指定が正しくありません'
  }

  // 同じ商品が複数行あってもまとめて数える（上限チェックをすり抜けられないように）
  const quantities = new Map<string, number>()
  for (const item of items) {
    const { productId, quantity } = (item ?? {}) as Record<string, unknown>
    if (
      typeof productId !== 'string' ||
      productId.length === 0 ||
      productId.length > MAX_ID_LENGTH ||
      !Number.isInteger(quantity) ||
      (quantity as number) < 1
    ) {
      return '商品の指定が正しくありません'
    }
    quantities.set(productId, (quantities.get(productId) ?? 0) + (quantity as number))
  }

  return {
    pickupDate: date,
    pickupTimeSlot: pickupTimeSlot as TimeSlot,
    note: note ? (note as string) : null,
    items: Array.from(quantities, ([productId, quantity]) => ({ productId, quantity })),
  }
}
