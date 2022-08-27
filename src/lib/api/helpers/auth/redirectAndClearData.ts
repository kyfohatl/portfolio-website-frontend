// Returns true if user data is present in local storage, and false otherwise
export function hasData() {
  if (localStorage.getItem("userId")) return true
  return false
}

// Removes all locally stored (local storage) user data
export function deleteLocalData() {
  localStorage.removeItem("userId")
}

// Deletes local tokens and redirects to the sign in page
export function redirectToSignInAndClearData() {
  deleteLocalData()
  window.location.href = process.env.REACT_APP_FRONTEND_SERVER_ADDR + "signin"
}