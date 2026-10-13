// Apply the saved theme (dark by default) before first paint to avoid a flash.
// Kept as a file (not inline) so the Content Security Policy can forbid inline scripts.
(function () {
  var theme
  try { theme = localStorage.getItem('theme') } catch (e) {}
  // First visit opens in dark mode; after that, the visitor's own choice is remembered.
  if (theme !== 'light' && theme !== 'dark') theme = 'dark'
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]').setAttribute('content', theme === 'dark' ? '#0f0f0f' : '#f3f2ed')
})()
