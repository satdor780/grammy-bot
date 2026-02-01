import crypto from 'node:crypto';

const BOT_TOKEN = process.env.BOT_TOKEN!;

export function validateInitData(initData: string): { user: any; auth_date: number } | null {
    console.log(initData)
    const params = new URLSearchParams(initData);
  
    const hash = params.get('hash');
    if (!hash) return null;
  
    params.delete('hash');
  
    const dataCheckArr: string[] = [];
    for (const [key, value] of params) {
      dataCheckArr.push(`${key}=${value}`);
    }
    dataCheckArr.sort();
    const dataCheckString = dataCheckArr.join('\n');

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(BOT_TOKEN)
      .digest();
  
    const computedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');
  
    if (computedHash !== hash) {
      return null;
    }

    const userRaw = params.get('user');
    if (!userRaw) return null;
  
    let user;
    try {
      user = JSON.parse(userRaw);
    } catch {
      return null;
    }
  
    const authDate = Number(params.get('auth_date'));
    const now = Math.floor(Date.now() / 1000);
    if (now - authDate > 86400) {
      return null;
    }
  
    return { user, auth_date: authDate };
  }
  