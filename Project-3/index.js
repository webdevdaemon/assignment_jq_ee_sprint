// -----------// GAME INIT -----------//
let comp_seq = [],
  level = 4,
  display_level = 0,
  user_turn = false,
  ok = true,
  strict = false

function getNewSequence(length = 20) {
  let colors = ['r', 'g', 'b', 'y'],
    seq = [],
    i
  for (i = 0; i < length; i++) {
    const n = Math.floor(Math.random() * (5 - 1)) + 1
    seq = [...seq, colors[n - 1]]
    console.log(seq)
  }
  return seq
}
$(document).ready(() => {
  const $color_panels = $('.panel'), // <- Color Panels
    $start_reset = $('.start-reset'), // <- Start Reset Button
    $strict_mode = $('.strict'), // <-- Strict Mode Button
    $length_display = $('.digits'), // <- Length Display
    $app_background = $('.app-wrapper'), // <- UI
    $status_display = $('.status'), // <- Status Display
    $power_switch = $('.power-switch')// <- Power Switch

  /*   \/                \ /
       /-----------------/|\
      / click handlers  / | \
     /_________________/__|__\  */

  $color_panels.click(e => {
    if (!user_turn) {
      return
    } else if (user_turn && display_level <= level && display_level > 0) {
      const t = e.target.id
      t !== comp_seq[level - display_level] && userFail()
      activatePanel(t)
      display_level--
      updateLevelDisplay(display_level)
      if (display_level === 0) {
        user_turn = false
        level++
        playbackSequence(level)
      }
    }
  })

  $start_reset.click(() => {
    !ok && toggleFailState()
    gameRestart()
  })

  $power_switch.click(() => {
    const $pow = $power_switch.children('.switch')
    ;($pow.hasClass('on') && $pow.removeClass('on')) || $pow.addClass('on')
  })

  function toggleFailState() {
    !ok && $status_display.text('OK') || $status_display.text('FAIL!!!')
    $color_panels.toggleClass('error')
    $app_background.toggleClass('error')
    $status_display.toggleClass('error')
  }

  f

  function gameRestart() {
    comp_seq = getNewSequence()
    level = 4
    display_level = updateLevelDisplay(0)
    user_turn = false
    ok = true
    strict = false
    playbackSequence()
  }

  function userFail() {
    ok = false
    user_turn = false
    toggleFailState()
  }

  function playbackSequence(lvl = level) {
    let i = 1
    playbackSequence.playbackInterval = setInterval(() => {
      if (i <= lvl) {
        display_level = updateLevelDisplay(i)
        activatePanel(comp_seq[i - 1])
        i++
      } else {
        clearInterval(playbackSequence.playbackInterval)
        user_turn = true
      }
    }, 780)
  }

  function getDisplayLevel(num = 0) {
    return num > 9 ? `${num}` : `0${num}`
  }

  function updateLevelDisplay(length = 0) {
    $length_display.text(getDisplayLevel(length))
    return length
  }

  function activatePanel(color_str) {
    const $pnl = $(`#${color_str}`)
    $playAudio($(`#panel-tone-${color_str}`))
    $pnl.addClass('active')
    setTimeout(() => {
      $pnl.removeClass('active')
    }, 750)
  }

  function $playAudio($el) {
    $el && $el.get(0).play()
  }
})
