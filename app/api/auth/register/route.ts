import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'מייל וסיסמה הם שדות חובה' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'הסיסמה חייבת להכיל לפחות 6 תווים' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'כתובת המייל כבר רשומה במערכת' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        name: name || email.split('@')[0],
        password: hashedPassword,
      },
    })

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 })
  }
}
