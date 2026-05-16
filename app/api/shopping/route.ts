import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const item = await prisma.shoppingItem.findFirst({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json({ content: item?.content ?? '', updatedAt: item?.updatedAt ?? null })
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const content: string = body.content ?? ''

  const existing = await prisma.shoppingItem.findFirst({
    where: { userId: session.user.id },
  })

  let item
  if (existing) {
    item = await prisma.shoppingItem.update({
      where: { id: existing.id },
      data: { content },
    })
  } else {
    item = await prisma.shoppingItem.create({
      data: { userId: session.user.id, content },
    })
  }

  return NextResponse.json({ content: item.content, updatedAt: item.updatedAt })
}
