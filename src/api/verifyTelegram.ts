import crypto from 'crypto'

const BOT_TOKEN = process.env.BOT_TOKEN!

interface TelegramUser {
  id: number
  username?: string
  first_name?: string
}

export function verifyTelegram(initData: string): TelegramUser | null {
  if (!initData) return null

  const params = new URLSearchParams(initData)

  const hash = params.get('hash')
  if (!hash) return null

  params.delete('hash')

  // формируем data_check_string
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')

  // secret key
  const secretKey = crypto
    .createHash('sha256')
    .update(BOT_TOKEN)
    .digest()

  // считаем хэш
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex')

  if (calculatedHash !== hash) {
    return null
  }

  const userRaw = params.get('user')
  if (!userRaw) return null

  return JSON.parse(userRaw)
}
