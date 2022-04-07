export default class Api {
  static hasTokens() {
    if (localStorage.accessToken || localStorage.refreshToken) return true
    return false
  }
}