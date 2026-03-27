export const enterFullscreen = async () => {
  const element = document.documentElement

  try {
    if (document.fullscreenElement) return true
    if (element.requestFullscreen) {
      await element.requestFullscreen()
      return true
    }
  } catch (error) {
    console.error('Failed to enter fullscreen:', error)
  }

  return false
}

export const exitFullscreen = async () => {
  try {
    if (document.fullscreenElement && document.exitFullscreen) {
      await document.exitFullscreen()
    }
  } catch (error) {
    console.error('Failed to exit fullscreen:', error)
  }
}

let popStateHandler = null

export const lockBackNavigation = () => {
  if (popStateHandler) return

  window.history.pushState(null, '', window.location.href)
  popStateHandler = () => {
    window.history.pushState(null, '', window.location.href)
    alert('Back navigation is disabled during the test.')
  }
  window.addEventListener('popstate', popStateHandler)
}

export const unlockBackNavigation = () => {
  if (!popStateHandler) return
  window.removeEventListener('popstate', popStateHandler)
  popStateHandler = null
}
