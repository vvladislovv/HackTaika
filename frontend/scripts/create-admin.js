const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2] || 'admin@hacktaika.com'
  const password = process.argv[3] || 'admin123'
  const name = process.argv[4] || 'Главный администратор'

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })

    console.log('✅ Администратор успешно создан!')
    console.log('Email:', admin.email)
    console.log('Пароль:', password)
    console.log('Имя:', admin.name)
  } catch (error) {
    if (error.code === 'P2002') {
      console.error('❌ Администратор с таким email уже существует')
    } else {
      console.error('❌ Ошибка создания администратора:', error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

main()

