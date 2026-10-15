// Every visit opens in dark mode; the switch changes it only for the current visit.
// Kept as a file (not inline) so the Content Security Policy can forbid inline scripts.
(function () {
  try { localStorage.removeItem('theme') } catch (e) {}
  document.documentElement.dataset.theme = 'dark'
  document.querySelector('meta[name="theme-color"]').setAttribute('content', '#0f0f0f')
})()
