const PHONE_LENGTH = 11

export function phoneDigits(value: string) {
  let digits = value.replace(/\D/g, '')
  if (digits.startsWith('8')) digits = `7${digits.slice(1)}`
  if (digits.length > 0 && !digits.startsWith('7')) digits = `7${digits}`
  return digits.slice(0, PHONE_LENGTH)
}

export function formatPhoneInput(value: string) {
  const digits = phoneDigits(value)
  if (digits.length === 0) return ''

  const code = digits.slice(1, 4)
  const first = digits.slice(4, 7)
  const second = digits.slice(7, 9)
  const third = digits.slice(9, 11)

  let result = '+7'
  if (code) result += ` (${code}`
  if (code.length === 3) result += ')'
  if (first) result += ` ${first}`
  if (second) result += `-${second}`
  if (third) result += `-${third}`
  return result
}

export function isValidPhone(value: string) {
  return phoneDigits(value).length === PHONE_LENGTH
}
