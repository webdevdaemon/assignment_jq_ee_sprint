//-----------//
// GAME INIT //
//-----------//
let comp_seq = [],
  level = 4,
  display_level = 0,
  user_turn = false,
  ok = true,
  strict = false;

function getNewSequence(length = 20) {
  let colors = ['r', 'g', 'b', 'y'],
    seq = [],
    i;
  for (i = 0; i < length; i++) {
    let n = Math.floor(Math.random() * (5 - 1)) + 1;
    seq = [...seq, colors[n - 1]];
    console.log(seq);
  }
  return seq;
}
$(document).ready(function() {
  const $color_panels = $('.panel'), // <-- $ Color Panels
    $start_reset = $('.start-reset'), // <-- $ Start Stop Button
    $strict_mode = $('.strict'), // <-- $ Strict Mode Button
    $length_display = $('.digits'), // <-- $ Length Display
    $app_background = $('.app-wrapper'),
    $status_display = $('.status'); // <-- $ Status Display
  //----------------//
  // click handlers //
  //----------------//
  $color_panels.click(function(e) {
    let t = e.target.id;
    console.log(t);
    if (user_turn && display_level <= level && display_level > 0) {
      if (t !== comp_seq[level - display_level]) {
        userError();
      }
      console.log('correct');
      activatePanel(t);
      display_level--;
      updateLevelDisplay(display_level);
      if (display_level === 0) {
        user_turn = false;
        level++;
        playbackSequence(level);
      }
    } else {
      return;
    }
  });
  $start_reset.click(function() {
    if (!ok) {
      $color_panels.removeClass('error');
      $app_background.removeClass('error');
      $status_display.removeClass('error');
      $status_display.text('OK');
    }
    gameRestart();
  });

  function gameRestart() {
    comp_seq = getNewSequence();
    level = 4;
    display_level = updateLevelDisplay(0);
    user_turn = false;
    ok = true;
    strict = false;
    playbackSequence();
  }

  function userError() {
    ok = false;
    user_turn = false;
    $playAudio($('#no'));
    $app_background.addClass('error');
    $status_display.addClass('error');
    $status_display.text('WRONG!!!');
    $color_panels.addClass('error');
    // setTimeout(() => {}, 3000);
    return;
  }

  function playbackSequence(lvl = level) {
    let i = 1;
    playbackSequence.playbackInterval = setInterval(function() {
      if (i <= lvl) {
        display_level = updateLevelDisplay(i);
        activatePanel(comp_seq[i - 1]);
        i++;
      } else {
        clearInterval(playbackSequence.playbackInterval);
        user_turn = true;
      }
    }, 780);
  }

  function getDisplayLevel(num = 0) {
    return num > 9 ? `${num}` : `0${num}`;
  }

  function updateLevelDisplay(length = 0) {
    $length_display.text(getDisplayLevel(length));
    return length;
  }

  function activatePanel(color_str) {
    let $panel = $(`#${color_str}`);
    $playAudio($(`#panel-tone-${color_str}`));
    $panel.addClass('active');
    setTimeout(function() {
      $panel.removeClass('active');
    }, 750);
  }

  function $playAudio($_el) {
    $_el.get(0).play();
  }
});
