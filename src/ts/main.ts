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
const inputFilePath = path.join(cwd, '/json/input.json')
try {
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

// fs stream利用
try {
  const outputFilePath = path.join(cwd, '/json/output3.json')
  fs.createReadStream(inputFilePath)
    .pipe(fs.createWriteStream(outputFilePath))
    .on('finish', () => console.log('fs.createWriteStream finish'))
} catch (e) {
  console.log('error:', e)
}

// fs stream pipe中にハッシュ化
import crypto from 'crypto'
try {
  const outputFilePath = path.join(cwd, '/json/output4.json')
  fs.createReadStream(inputFilePath)
    .pipe(crypto.createHash('sha256'))
    .pipe(fs.createWriteStream(outputFilePath))
    .on('finish', () => console.log('fs.createWriteStream & crypto finish'))
} catch (e) {
  console.log('error:', e)
}

//  fs stream pipe中に暗号化し出力、暗号化したファイルを復号し出力
try {
  const outputFilePath = path.join(cwd, '/json/output5.json')
  const algorithm = 'aes-256-cbc'
  const key = crypto.scryptSync('abcdefgh', '12345678', 32)
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  fs.createReadStream(inputFilePath)
    .pipe(cipher)
    .pipe(fs.createWriteStream(outputFilePath))
    .on('finish', () => console.log('cipher finish'))

  // TODO: 暗号化が終わってから実行の違う書き方（今はsetTimeoutで決め打ちでwaitさせて実行している）
  ;(async () => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const outputFilePath2 = path.join(cwd, '/json/output6.json')
    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    // decipher.setAutoPadding(false)
    fs.createReadStream(outputFilePath)
      .pipe(decipher)
      .pipe(fs.createWriteStream(outputFilePath2))
      .on('finish', () => console.log('decipher finish'))
  })()
} catch (e) {
  console.log('error:', e)
}

// fs 読み込みストリーム
{
  const cwd = process.cwd()
  console.log(cwd)
  const filePath = path.join(cwd, '/json//input.json')
  const readStream = fs.createReadStream(filePath)
  readStream
    .on('readable', () => {
      let chunk
      while ((chunk = readStream.read()) !== null) {
        console.log(`chunk:${chunk}`)
      }
    })
    .on('end', () => console.log('end'))
}
