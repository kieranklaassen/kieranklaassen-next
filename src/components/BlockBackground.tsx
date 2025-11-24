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
    // Single base color like the original - random RGB on mount
    const baseColor: [number, number, number] = [
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
    ]

    let squares: Array<{
      x: number
      y: number
      opacity: number
      targetOpacity: number
      gradientOffset: number
      hovered: boolean
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
          const gradientOffset = random(-30, 30)
          const initialOpacity = random(255)
          squares.push({
            x,
            y,
            opacity: initialOpacity,
            targetOpacity: initialOpacity, // Same as initial - no movement until hover
            gradientOffset,
            hovered: false,
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

        // Draw gradient line by line like original
        for (let i = 0; i < squareSize; i++) {
          const gradientAlpha = map(
            i,
            0,
            squareSize,
            square.opacity,
            square.opacity - 40 + square.gradientOffset
          )
          ctx.fillStyle = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${gradientAlpha / 255})`
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
