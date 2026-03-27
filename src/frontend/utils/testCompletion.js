// Test completion tracking utility

export const markTestCompleted = (testType) => {
  const completedTests = JSON.parse(localStorage.getItem('completedTests') || '{}')
  completedTests[testType] = true
  localStorage.setItem('completedTests', JSON.stringify(completedTests))
  console.log(`Marked ${testType} as completed`)
}

export const getCompletedTests = () => {
  return JSON.parse(localStorage.getItem('completedTests') || '{}')
}

export const isTestCompleted = (testType) => {
  const completedTests = getCompletedTests()
  return completedTests[testType] === true
}

export const clearTestCompletion = () => {
  localStorage.removeItem('completedTests')
  console.log('Cleared test completion data')
}
