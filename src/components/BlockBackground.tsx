'use client'

import { useEffect, useRef } from 'react'

export default function BlockBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const squareSize = 134
    // Vibrant color palette - electric and bold
    const colorPalette: Array<[number, number, number]> = [
      [255, 71, 133],   // Hot pink
      [138, 43, 226],   // Blue violet
      [255, 140, 0],    // Dark orange
      [0, 191, 255],    // Deep sky blue
      [255, 20, 147],   // Deep pink
      [123, 104, 238],  // Medium slate blue
      [255, 69, 0],     // Orange red
      [30, 144, 255],   // Dodger blue
      [255, 105, 180],  // Hot pink
      [147, 51, 234],   // Purple
    ]

    let squares: Array<{
      x: number
      y: number
      opacity: number
      targetOpacity: number
      gradientOffset: number
      hovered: boolean
      color: [number, number, number]
    }> = []

    let animationFrame: number

    const random = (max: number, min = 0) => {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    const map = (value: number, start1: number, stop1: number, start2: number, stop2: number) => {
      return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
    }

    const resize = () => {
      canvas.width = document.body.clientWidth
      canvas.height = document.body.scrollHeight

      squares = []
      for (let x = 0; x < canvas.width; x += squareSize) {
        for (let y = 0; y < canvas.height; y += squareSize) {
          const gradientOffset = random(-40, 40)
          const initialOpacity = random(140, 220)  // Even more vibrant
          const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)]
          squares.push({
            x,
            y,
            opacity: initialOpacity,
            targetOpacity: initialOpacity,
            gradientOffset,
            hovered: false,
            color: randomColor,
          })
        }
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      squares.forEach((square) => {
        // Smooth interpolation - only happens when targetOpacity changes (on hover)
        if (Math.abs(square.opacity - square.targetOpacity) > 0.1) {
          square.opacity += (square.targetOpacity - square.opacity) * 0.05
        }

        // Draw gradient line by line
        for (let i = 0; i < squareSize; i++) {
          const gradientAlpha = map(
            i,
            0,
            squareSize,
            square.opacity,
            square.opacity - 40 + square.gradientOffset
          )
          ctx.fillStyle = `rgba(${square.color[0]}, ${square.color[1]}, ${square.color[2]}, ${gradientAlpha / 255})`
          ctx.fillRect(square.x, square.y + i, squareSize, 1)
        }
      })

      animationFrame = requestAnimationFrame(draw)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left + window.scrollX
      const mouseY = e.clientY - rect.top + window.scrollY

      squares.forEach((square) => {
        if (
          mouseX >= square.x &&
          mouseX < square.x + squareSize &&
          mouseY >= square.y &&
          mouseY < square.y + squareSize
        ) {
          // Only trigger new target when first entering the square
          if (!square.hovered) {
            square.targetOpacity = random(255)
            square.hovered = true
          }
        } else {
          square.hovered = false
        }
      })
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', resize)
    document.addEventListener('mousemove', handleMouseMove)
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', resize)
      document.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        filter: 'url(#noise)',
      }}
    />
  )
}
