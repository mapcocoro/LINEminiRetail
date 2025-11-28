'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from 'date-fns'
import { ja } from 'date-fns/locale'
import type { BusinessDay } from '@/types'

interface BusinessCalendarProps {
  businessDays: BusinessDay[]
  regularHolidays?: number[] // 0 = Sunday, 1 = Monday, etc.
  onSelectDate?: (date: Date) => void
  selectedDate?: Date | null
}

export default function BusinessCalendar({
  businessDays,
  regularHolidays = [],
  onSelectDate,
  selectedDate,
}: BusinessCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const weekDays = ['日', '月', '火', '水', '木', '金', '土']

  const getDateStatus = (date: Date) => {
    // Check specific business day settings
    const businessDay = businessDays.find((bd) => isSameDay(new Date(bd.date), date))
    if (businessDay) {
      return {
        isOpen: businessDay.isOpen,
        note: businessDay.note,
        openTime: businessDay.openTime,
        closeTime: businessDay.closeTime,
      }
    }

    // Check regular holidays
    if (regularHolidays.includes(date.getDay())) {
      return { isOpen: false, note: '定休日', openTime: null, closeTime: null }
    }

    // Default: open
    return { isOpen: true, note: null, openTime: '09:00', closeTime: '18:00' }
  }

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const today = new Date()

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-stone-100 rounded-lg"
        >
          <ChevronLeft className="w-5 h-5 text-stone-600" />
        </button>
        <h2 className="text-lg font-bold text-stone-800">
          {format(currentMonth, 'yyyy年M月', { locale: ja })}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-stone-100 rounded-lg"
        >
          <ChevronRight className="w-5 h-5 text-stone-600" />
        </button>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`text-center text-sm font-medium py-2 ${
              index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-stone-600'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const status = getDateStatus(day)
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isToday = isSameDay(day, today)
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const isPast = day < today && !isToday

          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDate && !isPast && status.isOpen && onSelectDate(day)}
              disabled={isPast || !status.isOpen || !onSelectDate}
              className={`
                aspect-square p-1 rounded-lg text-sm relative
                ${!isCurrentMonth ? 'opacity-30' : ''}
                ${isToday ? 'ring-2 ring-amber-400' : ''}
                ${isSelected ? 'bg-amber-500 text-white' : ''}
                ${!status.isOpen ? 'bg-stone-100' : 'hover:bg-amber-50'}
                ${isPast ? 'opacity-40 cursor-not-allowed' : ''}
                ${onSelectDate && status.isOpen && !isPast ? 'cursor-pointer' : 'cursor-default'}
              `}
            >
              <span
                className={`
                  ${day.getDay() === 0 ? 'text-red-500' : ''}
                  ${day.getDay() === 6 ? 'text-blue-500' : ''}
                  ${isSelected ? 'text-white' : ''}
                  ${!status.isOpen && !isSelected ? 'text-stone-400' : ''}
                `}
              >
                {format(day, 'd')}
              </span>

              {/* Holiday indicator */}
              {!status.isOpen && isCurrentMonth && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-stone-400 rounded-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs text-stone-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-stone-100 rounded" />
          <span>休業日</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 ring-2 ring-amber-400 rounded" />
          <span>今日</span>
        </div>
      </div>
    </div>
  )
}
