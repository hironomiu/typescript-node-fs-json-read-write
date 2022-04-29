import * as fs from 'fs'
import * as path from 'path'
import input from '../../json/input.json'

const cwd = process.cwd()

type User = {
  firstName: string
  lastName: string
  nickname: string
  email: string
  age: number
}

// fsでJSONの読み込み&書き込み
try {
  const inputFilePath = path.join(cwd, '/json/input.json')
  const json = fs.readFileSync(inputFilePath, 'utf-8')
  const users: User[] = JSON.parse(json)

  // 適当にデータを加工 toUpperCase()
  const outputUsers: User[] = users.map((user) => ({
    firstName: user.firstName.toUpperCase(),
    lastName: user.lastName.toUpperCase(),
    nickname: user.nickname.toUpperCase(),
    email: user.email,
    age: user.age,
  }))

  const outputFilePath = path.join(cwd, '/json/output.json')

  // ファイルが存在する場合は上書き
  fs.writeFileSync(outputFilePath, JSON.stringify(outputUsers))
} catch (e) {
  console.log('error:', e)
}

// importで読み込んだJSONをfsで書き込み
// tsconfig.json -> "moduleResolution": "node"
// tsconfig.json -> "resolveJsonModule": true
try {
  const outputFilePath = path.join(cwd, '/json/output2.json')

  // 適当にデータを加工 user.age * 2
  const outputUsers = input.map((user) => ({
    firstName: user.firstName,
    lastName: user.lastName,
    nickname: user.nickname,
    email: user.email,
    age: user.age * 2,
  }))

  // ファイルが存在する場合は上書き
  fs.writeFileSync(outputFilePath, JSON.stringify(outputUsers))
} catch (e) {
  console.log('error:', e)
}
