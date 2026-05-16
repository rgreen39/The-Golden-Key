import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET — all weight entries + whether user needs to log weight (last entry > 14 days ago)
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const entries = await prisma.weightEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'asc' },
  })

  const latest = entries[entries.length - 1]
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  const shouldPrompt = !latest || new Date(latest.createdAt) < twoWeeksAgo

  return NextResponse.json({
    entries: entries.map(e => ({ id: e.id, weight: e.weight, createdAt: e.createdAt })),
    shouldPrompt,
  })
}

// POST — save new weight entry
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { weight } = await request.json()
  if (!weight || isNaN(Number(weight))) {
    return NextResponse.json({ error: 'משקל לא תקין' }, { status: 400 })
  }

  const entry = await prisma.weightEntry.create({
    data: { userId: session.user.id, weight: Number(weight) },
  })

  return NextResponse.json({ id: entry.id, weight: entry.weight, createdAt: entry.createdAt })
}
