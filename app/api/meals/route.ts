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

  const meals = await prisma.meal.findMany({
    where,
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json({
    meals: meals.map((m) => ({
      id: m.id,
      createdAt: m.createdAt,
      foodChoice: m.foodChoice,
    })),
  })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const foodChoice: string = body.foodChoice ?? ''

  const meal = await prisma.meal.create({
    data: {
      userId: session.user.id,
      foodChoice,
    },
  })

  return NextResponse.json({
    id: meal.id,
    createdAt: meal.createdAt,
    foodChoice: meal.foodChoice,
  })
}
