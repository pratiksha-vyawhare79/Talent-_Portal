import { useEffect, useRef, useState } from 'react'
import * as tf from '@tensorflow/tfjs'
import * as blazeface from '@tensorflow-models/blazeface'
import { getProctoringStream, isProctoringActive } from './proctoringSession'
import './CameraCornerPreview.css'

const loadBlazeFaceModel = async () => {
  if (window.__blazeFaceModel) return window.__blazeFaceModel

  try {
    await tf.setBackend('webgl')
  } catch {
    // If webgl backend is not available, tfjs will use a fallback backend.
  }
  await tf.ready()

  const model = await blazeface.load()
  window.__blazeFaceModel = model
  return model
}

function CameraCornerPreview() {
  const videoRef = useRef(null)
  const detectionCanvasRef = useRef(null)
  const detectionCtxRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [multiFaceWarning, setMultiFaceWarning] = useState(false)
  const [detectedFaceCount, setDetectedFaceCount] = useState(0)
  const [detectionError, setDetectionError] = useState('')
  const stableMultiFaceHits = useRef(0)
  const lastPopupAt = useRef(0)
  const detectionFailureCount = useRef(0)

  useEffect(() => {
    const bindStream = () => {
      const stream = getProctoringStream()
      const active = isProctoringActive()

      if (stream) {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play().catch(() => {})
        }
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    bindStream()
    const intervalId = setInterval(bindStream, 1000)
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (!visible) {
      setMultiFaceWarning(false)
      setDetectedFaceCount(0)
      setDetectionError('')
      stableMultiFaceHits.current = 0
      detectionFailureCount.current = 0
      return
    }

    let detector = null
    let fallbackModel = null

    let cancelled = false
    let detectionId = null

    const waitForVideoFrame = async (video) => {
      if (video.readyState >= 2) return true

      try {
        await video.play()
      } catch {
        // Ignore autoplay/play promise errors; readiness check below handles it.
      }

      const becameReady = await new Promise((resolve) => {
        const timeoutId = setTimeout(() => {
          cleanup()
          resolve(false)
        }, 1200)

        const onLoaded = () => {
          cleanup()
          resolve(true)
        }

        const cleanup = () => {
          clearTimeout(timeoutId)
          video.removeEventListener('loadeddata', onLoaded)
          video.removeEventListener('loadedmetadata', onLoaded)
          video.removeEventListener('canplay', onLoaded)
        }

        video.addEventListener('loadeddata', onLoaded, { once: true })
        video.addEventListener('loadedmetadata', onLoaded, { once: true })
        video.addEventListener('canplay', onLoaded, { once: true })
      })

      return becameReady || video.readyState >= 2
    }

    const detectFaces = async () => {
      try {
        const video = videoRef.current
        if (!video) return
        const isReady = await waitForVideoFrame(video)
        if (!isReady || cancelled || !video.videoWidth || !video.videoHeight) return

        // Use both detectors (when possible) and keep the higher face count.
        // Native detector is fast; BlazeFace is often better for crowded frames.
        const faceCounts = []
        let detectorWorked = false

        if ('FaceDetector' in window) {
          try {
            if (!detector) {
              detector = new window.FaceDetector({
                maxDetectedFaces: 10,
                fastMode: false
              })
            }
            const nativeFaces = await detector.detect(video)
            faceCounts.push(Array.isArray(nativeFaces) ? nativeFaces.length : 0)
            detectorWorked = true
          } catch {
            // Fall through to BlazeFace if native detector errors.
          }
        }

        try {
          if (!fallbackModel) {
            fallbackModel = await loadBlazeFaceModel()
          }

          if (!detectionCanvasRef.current) {
            detectionCanvasRef.current = document.createElement('canvas')
          }
          const canvas = detectionCanvasRef.current
          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            detectionCtxRef.current = canvas.getContext('2d')
          }

          const ctx = detectionCtxRef.current
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          }

          let blazeFaces = []
          try {
            blazeFaces = await fallbackModel.estimateFaces(canvas, false, false, true)
          } catch {
            blazeFaces = await fallbackModel.estimateFaces(video, false, false, true)
          }
          faceCounts.push(Array.isArray(blazeFaces) ? blazeFaces.length : 0)
          detectorWorked = true
        } catch {
          // If BlazeFace fails, rely on native detector if available.
        }

        if (!detectorWorked) {
          detectionFailureCount.current += 1
          if (detectionFailureCount.current >= 3) {
            setDetectionError('Face detection engine failed')
          }
          return
        }

        const faceCount = faceCounts.length ? Math.max(...faceCounts) : 0

        if (cancelled) return
        setDetectedFaceCount(faceCount)
        detectionFailureCount.current = 0
        if (detectionError) setDetectionError('')

        if (faceCount >= 2) {
          stableMultiFaceHits.current += 1
          if (stableMultiFaceHits.current >= 1) {
            setMultiFaceWarning(true)
            const now = Date.now()
            if (now - lastPopupAt.current > 15000) {
              lastPopupAt.current = now
              // Use console warning instead of alert to prevent tab switching
              console.warn('Warning: Multiple faces detected in camera. Only one candidate should be visible.')
            }
          }
        } else {
          stableMultiFaceHits.current = 0
          setMultiFaceWarning(false)
        }
      } catch (error) {
        // Ignore transient camera readiness errors; mark unavailable only after repeated failures.
        const message = String(error?.message || '')
        const isTransient =
          message.includes('video') ||
          message.includes('ready') ||
          message.includes('current data') ||
          message.includes('play')
        if (isTransient) return

        detectionFailureCount.current += 1
        if (detectionFailureCount.current >= 5) {
          setDetectionError('Face detection unavailable')
        }
      }
    }

    // Preload BlazeFace once before loop so first detections don't miss.
    const startDetection = async () => {
      try {
        fallbackModel = await loadBlazeFaceModel()
      } catch {
        // Native detector may still work if BlazeFace fails.
      }
      if (cancelled) return
      await detectFaces()
      detectionId = setInterval(detectFaces, 1500)
    }

    startDetection()
    return () => {
      cancelled = true
      if (detectionId) clearInterval(detectionId)
    }
  }, [visible])

  if (!visible) return null

  return (
    <div className="camera-corner-preview">
      <div className="camera-rec-badge">REC</div>
      <div className="camera-face-count">Faces: {detectedFaceCount}</div>
      {multiFaceWarning && (
        <div className="camera-warning-badge">
          Warning: {detectedFaceCount} faces detected. Only one candidate should be visible.
        </div>
      )}
      {detectionError && (
        <div className="camera-warning-badge camera-error-badge">{detectionError}</div>
      )}
      <video id="camera-preview" ref={videoRef} autoPlay muted playsInline className="camera-corner-video" />
    </div>
  )
}

export default CameraCornerPreview
