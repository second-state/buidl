<style lang="stylus">
icomoon-font-path ?= "../assets/fonts"

icon-drawer = "\e95c"
icon-drawer2 = "\e95d"
icon-user = "\e971"
icon-equalizer2 = "\e993"
icon-cogs = "\e995"
icon-clipboard = "\e9b8"
icon-play3 = "\ea1c"

@font-face
  font-family 'icomoon'
  src url(icomoon-font-path + '/icomoon.ttf?3nrrqy') format('truetype'), url(icomoon-font-path + '/icomoon.woff?3nrrqy') format('woff'), url(icomoon-font-path + '/icomoon.svg?3nrrqy#icomoon') format('svg')
  font-weight normal
  font-style normal

[class^="icon-"], [class*=" icon-"]
  font-family 'icomoon' !important
  speak none
  font-style normal
  font-weight normal
  font-variant normal
  text-transform none
  line-height 1

  /* Better Font Rendering =========== */
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale

.icon-drawer
  &:before
    content icon-drawer
.icon-drawer2
  &:before
    content icon-drawer2
.icon-user
  &:before
    content icon-user
.icon-equalizer2
  &:before
    content icon-equalizer2
.icon-cogs
  &:before
    content icon-cogs
.icon-clipboard
  &:before
    content icon-clipboard
.icon-play3
  &:before
    content icon-play3
</style>
