import { prisma } from '@/lib/prisma'
import BusinessCalendar from '@/components/calendar/BusinessCalendar'
import { Clock, MapPin, Phone, Car } from 'lucide-react'

async function getBusinessDays() {
  const today = new Date()
  const threeMonthsLater = new Date()
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3)

  return await prisma.businessDay.findMany({
    where: {
      date: {
        gte: today,
        lte: threeMonthsLater,
      },
    },
  })
}

async function getRegularHolidays() {
  const holidays = await prisma.regularHoliday.findMany()
  return holidays.map((h) => h.dayOfWeek)
}

export default async function CalendarPage() {
  const [businessDays, regularHolidays] = await Promise.all([
    getBusinessDays(),
    getRegularHolidays(),
  ])

  return (
    <div className="px-4 py-4 space-y-6">
      <h1 className="text-xl font-bold text-stone-800">営業日カレンダー</h1>

      {/* Store Info Card */}
      <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">🥐</span>
          <div>
            <h2 className="font-bold text-amber-900">Boulangerie SOLEIL</h2>
            <p className="text-xs text-amber-700">ブーランジェリー ソレイユ</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-amber-800">
            <Clock className="w-4 h-4" />
            <span>9:00 - 18:00</span>
          </div>
          <div className="flex items-center gap-2 text-amber-800">
            <Car className="w-4 h-4" />
            <span>駐車場2台</span>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <BusinessCalendar
        businessDays={businessDays}
        regularHolidays={regularHolidays}
      />

      {/* Regular Holidays Notice */}
      <div className="bg-stone-100 rounded-xl p-4">
        <h3 className="font-bold text-stone-800 mb-2">定休日</h3>
        <p className="text-sm text-stone-600">毎週月曜日</p>
        <p className="text-xs text-stone-400 mt-2">
          ※ 祝日の場合は営業し、翌火曜日がお休みになります
        </p>
      </div>

      {/* Location */}
      <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
        <h3 className="font-bold text-stone-800">店舗情報</h3>

        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-stone-600">
              〒150-0001
              <br />
              東京都渋谷区神宮前1-2-3
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-stone-600">03-1234-5678</p>
        </div>

        {/* Map Placeholder */}
        <div className="bg-stone-100 rounded-lg aspect-video flex items-center justify-center">
          <div className="text-center text-stone-400">
            <MapPin className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Google Map</p>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <h3 className="font-bold text-amber-800 mb-2">ご来店のお客様へ</h3>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>・人気商品は午前中に売り切れることがあります</li>
          <li>・取り置き予約をご利用ください</li>
          <li>・臨時休業の際はLINEでお知らせします</li>
        </ul>
      </div>
    </div>
  )
}
