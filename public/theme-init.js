// Theme for this tab: a refresh keeps the current mode (sessionStorage lives as long as the tab),
// while a new tab or a reopened portfolio always starts in dark mode.
// Kept as a file (not inline) so the Content Security Policy can forbid inline scripts.
(function () {
  var theme
  try { theme = sessionStorage.getItem('theme') } catch (e) {}
  if (theme !== 'light') theme = 'dark'
  try { localStorage.removeItem('theme') } catch (e) {}
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]').setAttribute('content', theme === 'dark' ? '#09090b' : '#fbf6ee')
})()
