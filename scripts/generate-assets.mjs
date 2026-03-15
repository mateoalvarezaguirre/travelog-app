import { createCanvas, registerFont } from 'canvas'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const assetsDir = path.join(__dirname, '..', 'assets')

const FONT_PATH = path.join(
  __dirname, '..', 'node_modules/@expo-google-fonts/merriweather/700Bold/Merriweather_700Bold.ttf'
)

registerFont(FONT_PATH, { family: 'Merriweather', weight: '700' })

const BG = '#fffbeb'
const TEXT_COLOR = '#92400e'

function generate(filename, size, fontSize) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = BG
  ctx.fillRect(0, 0, size, size)

  ctx.fillStyle = TEXT_COLOR
  ctx.font = `700 ${fontSize}px Merriweather`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('Travelog', size / 2, size / 2)

  const buffer = canvas.toBuffer('image/png')
  fs.writeFileSync(path.join(assetsDir, filename), buffer)
  console.log(`✓ ${filename}`)
}

generate('icon.png', 1024, 160)
generate('adaptive-icon.png', 1024, 160)
generate('splash-icon.png', 1024, 200)
generate('favicon.png', 196, 32)

console.log('Done.')
