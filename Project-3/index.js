const INITIAL_STATE = {
    on: false,
    running: false,
    user_turn: false,
    strict: false,
    sequence: [],
    target_length: 1,
    target: '',
    clicked: [],
    input: '',
    length: 0,
  },
  updateState = obj => {
    _state = Object.assign({}, _state, obj);
  };

let _state = Object.assign({}, {}, INITIAL_STATE);

$(document).ready(function() {
  const $power_switch = $('.switch'), // <-- $ Power Switch
    $power_knob = $('.knob'), // <-- $ Power Knob
    $color_panels = $('.panel'), // <-- $ Color Panels
    $start_reset = $('.start-reset'), // <-- $ Start Stop Button
    $strict_mode = $('.strict'), // <-- $ Strict Mode Button
    $length_display = $('.digits'), // <-- $ Length Display
    $game_status = $('.status'); // <-- $ Status Display

  // POWER SWITCH CLICK HANDLER
  $power_switch.click(function() {
    _state.on = !_state.on;
    let onn = _state.on;
    $power_switch.toggleClass('on');
    $length_display.toggleClass('on');
  });

  // COLOR PANELS CLICK HANDLER
  $color_panels.click(function(e) {
    activatePanel(e.target.id);
    updateState({ length: _state.length + 1 });
    updateLengthDisplay(_state.length);
    if (_state.user_turn) {
      console.log('O%', $(this).get(0).id, 'CORRECT!!!');
    } else {
    }
  });
  // START-RESET CLICK HANDLER
  $start_reset.on('click', function() {
    if (!_state.on) {
      return;
    }
    if (_state.running) {
      _state = Object.assign(INITIAL_STATE, {
        running: false,
        user_turn: false,
        sequence: getNewSequence(),
        target_length: 1,
      });
      updateLengthDisplay(_state.target_length);
    }
    _state.sequence = getNewSequence();
  });
  /*  \\______________________________//
       <|- FUNCTIONS & GAME HELPERS -|>
      //------------------------------\\  */
  function activatePanel(color_str) {
    let $panel = $(`#${color_str}`),
      ms = _state.error ? 2000 : 750;
    playAudioById(color_str);
    $panel.addClass('active');
    setTimeout(function() {
      $panel.removeClass('active');
    }, ms);
  }
  function playAudioById(str) {
    $(`#panel-tone-${str}`)
      .get(0)
      .play();
  }
  function playbackSequence(length = _state.length) {
    let i = 0;
    updateLengthDisplay(i);
    playbackSequence.playbackInterval = setInterval(function() {
      if (i < length) {
        activatePanel(_state.sequence[i]);
        i++;
        updateLengthDisplay(i);
      } else {
        updateState({ user_turn: true });
        clearInterval(playbackSequence.playbackInterval);
      }
    }, 780);
  }
  function updateLengthDisplay(length = 0) {
    $length_display.text(length !== null ? getDisplayLength(length) : '--');
  }
  function getDisplayLength(num = 0) {
    return num > 9 ? `${num}` : `0${num}`;
  }

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
});
