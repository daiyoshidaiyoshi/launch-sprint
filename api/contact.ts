import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ContactRequestBody {
  company: string;
  email: string;
  message: string;
}

interface ContactErrors {
  company?: string;
  email?: string;
  message?: string;
}

const EMAIL_REGEX =
  /^[a-zA-Z0-9_%+\-]+(\.[a-zA-Z0-9_%+\-]+)*@[a-zA-Z0-9\-]+(\.[a-zA-Z0-9\-]+)*\.[a-zA-Z]{2,}$/;

function validate(body: ContactRequestBody): ContactErrors {
  const errors: ContactErrors = {};

  if (!body.company.trim()) {
    errors.company = '会社名を入力してください';
  }

  if (!body.email.trim()) {
    errors.email = 'メールアドレスを入力してください';
  } else if (!EMAIL_REGEX.test(body.email)) {
    errors.email = 'メールアドレスの形式が正しくありません';
  }

  if (!body.message.trim()) {
    errors.message = 'ご相談内容を入力してください';
  } else if (body.message.length > 1000) {
    errors.message = '1000文字以内で入力してください';
  }

  return errors;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  if (req.headers['content-type'] !== 'application/json') {
    return res.status(400).json({ success: false, message: 'Invalid Content-Type' });
  }

  const { company, email, message } = (req.body ?? {}) as ContactRequestBody;

  if (typeof company !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
    return res.status(400).json({ success: false, message: 'Invalid request' });
  }

  const trimmed: ContactRequestBody = {
    company: company.trim(),
    email: email.trim(),
    message: message.trim(),
  };

  const errors = validate(trimmed);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  console.log(`[${new Date().toISOString()}] Contact form received:`, trimmed);

  return res.status(200).json({ success: true, message: '送信が完了しました' });
}
