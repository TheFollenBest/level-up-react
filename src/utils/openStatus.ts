import { company, workingHours, type WorkingDay } from '../data/company.ts'

const weekdayIndex: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }

const localTimeFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: company.timeZone,
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

const dayNames = ['в воскресенье', 'в понедельник', 'во вторник', 'в среду', 'в четверг', 'в пятницу', 'в субботу']

function toMinutes(time: string) {
  const [hours = 0, minutes = 0] = time.split(':').map(Number)
  return hours * 60 + minutes
}

function localNow(date: Date) {
  const parts = Object.fromEntries(localTimeFormatter.formatToParts(date).map((part) => [part.type, part.value]))
  return {
    day: weekdayIndex[parts.weekday ?? 'Mon'] ?? 1,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  }
}

function findDay(day: number): WorkingDay | undefined {
  return workingHours.find((entry) => entry.day === day)
}

export type OpenStatus = {
  isOpen: boolean
  label: string
  today: number
}

export function getOpenStatus(date: Date): OpenStatus {
  const { day, minutes } = localNow(date)
  const today = findDay(day)

  if (today?.opens && today.closes) {
    const opens = toMinutes(today.opens)
    const closes = toMinutes(today.closes)
    if (minutes >= opens && minutes < closes) {
      return { isOpen: true, label: `Открыто до ${today.closes}`, today: day }
    }
    if (minutes < opens) {
      return { isOpen: false, label: `Закрыто, откроемся сегодня в ${today.opens}`, today: day }
    }
  }

  for (let offset = 1; offset <= 7; offset += 1) {
    const nextDay = (day + offset) % 7
    const next = findDay(nextDay)
    if (next?.opens) {
      const when = offset === 1 ? 'завтра' : dayNames[nextDay]
      return { isOpen: false, label: `Закрыто, откроемся ${when} в ${next.opens}`, today: day }
    }
  }

  return { isOpen: false, label: 'Закрыто', today: day }
}
