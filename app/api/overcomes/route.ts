import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const where: { userId: string; createdAt?: { gte?: Date; lte?: Date } } = {
    userId: session.user.id,
  }

  if (from || to) {
    where.createdAt = {}
    if (from) where.createdAt.gte = new Date(from)
    if (to) where.createdAt.lte = new Date(to)
  }

  const overcomes = await prisma.overcome.findMany({
    where,
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json({
    overcomes: overcomes.map((o) => ({
      id: o.id,
      createdAt: o.createdAt,
      checklistKey: o.checklistKey,
    })),
  })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const checklistKey: string = body.checklistKey ?? ''

  // Create overcome record
  const overcome = await prisma.overcome.create({
    data: {
      userId: session.user.id,
      checklistKey,
    },
  })

  // Increment user points (אונקיות)
  await prisma.user.update({
    where: { id: session.user.id },
    data: { points: { increment: 1 } },
  })

  return NextResponse.json({
    id: overcome.id,
    createdAt: overcome.createdAt,
    checklistKey: overcome.checklistKey,
  })
}
