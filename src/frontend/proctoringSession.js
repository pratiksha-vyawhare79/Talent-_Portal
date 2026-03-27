let mediaStream = null
let mediaRecorder = null
let recordedChunks = []
let isMonitoring = false
let isTestSubmitted = false
let violationHandler = null
let blurHandler = null
let visibilityHandler = null

const safeInvoke = (fn, message) => {
  if (typeof fn === 'function') fn(message)
}

const onVisibilityChange = () => {
  if (document.hidden) {
    safeInvoke(violationHandler, 'Tab switching detected. Please stay on the test window.')
  }
}

const onWindowBlur = () => {
  safeInvoke(violationHandler, 'Window focus lost. Please return to the test window.')
}

export const startProctoring = async ({ onViolation, onError } = {}) => {
  try {
    isTestSubmitted = false

    if (!mediaStream) {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true
      })
    }

    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
      recordedChunks = []
      mediaRecorder = new MediaRecorder(mediaStream)
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunks.push(event.data)
        }
      }
      mediaRecorder.start(1000)
    }

    violationHandler = onViolation || null

    if (!isMonitoring) {
      visibilityHandler = onVisibilityChange
      blurHandler = onWindowBlur
      document.addEventListener('visibilitychange', visibilityHandler)
      window.addEventListener('blur', blurHandler)
      isMonitoring = true
    }

    return { stream: mediaStream }
  } catch (error) {
    safeInvoke(onError, 'Unable to start audio/video recording.')
    throw error
  }
}

export const setTestSubmitted = () => {
  isTestSubmitted = true
  stopProctoring()
}

export const getProctoringStream = () => mediaStream

export const isProctoringActive = () =>
  Boolean(!isTestSubmitted && mediaRecorder && mediaRecorder.state === 'recording' && mediaStream)

export const stopProctoring = () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop()
  }

  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop())
  }

  mediaRecorder = null
  mediaStream = null
  recordedChunks = []

  if (isMonitoring) {
    document.removeEventListener('visibilitychange', visibilityHandler)
    window.removeEventListener('blur', blurHandler)
    isMonitoring = false
  }

  visibilityHandler = null
  blurHandler = null
  violationHandler = null
}

export const getRecordingBlob = () => {
  if (!recordedChunks.length) return null
  return new Blob(recordedChunks, { type: 'video/webm' })
}
