const INITIAL_STATE = {
    on: false,
    running: false,
    user_turn: false,
    strict: false,
    sequence: getNewSequence(),
    segment: [],
    user_length: 0,
    target: '',
    clicked: [],
    input: '',
    length: 5,
  },
  updateState = (obj, cb) => {
    let current = _state;
    _state = Object.assign({}, current, obj);
    return !cb || cb();
  };

let _state = Object.assign({}, INITIAL_STATE);

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
  // DEBUG
  $(document).click(function(e) {
    console.log('----------\n', e.target, '\n::::::::::::\n', _state, '\n----------');
    _state.input = e.target.id.length === 1 ? e.target.id : '';
  });
  document.debugState = setInterval(() => {
    console.log(_state);
  }, 10000);
  // JQUERY OBJECTS
  const $power_switch = $('.switch'), // <-- $ Power Switch
    $power_knob = $('.knob'), // <-- $ Power Knob
    $color_panels = $('.panel'), // <-- $ Color Panels
    $start_reset = $('.start-reset'), // <-- $ Start Stop Button
    $strict_mode = $('.strict'), // <-- $ Strict Mode Button
    $length_display = $('.digits'), // <-- $ Length Display
    $status_display = $('.status'); // <-- $ Status Display

  // POWER SWITCH CLICK HANDLER
  $power_switch.click(function() {
    updateState({ on: !_state.on, length: updateLengthDisplay(0) });
    $power_switch.toggleClass('on');
    $length_display.toggleClass('on');
  });
  // COLOR PANELS CLICK HANDLER
  $color_panels.click(function(e) {
    colorPanel();
    activatePanel($(e.target).get(0).id);
  });
  // START-RESET CLICK HANDLER
  $start_reset.click(function() {
    if (!_state.on) {
      return;
    }
    updateState({
      sequence: getNewSequence(),
    });
    if (!_state.running) {
      gameStart();
    } else {
      gameReset();
    }
  });
  /*
  \\
   \\ HANDLERS
    &
   // CALLBACKS
  //
*/
  function gameStart() {
    playbackSequence(_state.length);
    updateState({
      running: true,
    });
  }
  function gameReset() {
    updateState({
      running: false,
      user_turn: false,
      sequence: getNewSequence(),
      length: updateLengthDisplay(1),
    });
  }
  function strictMode() {
    updateState({
      strict: !_state.strict,
    });
  }
  function userTurn(length) {
    initUserSequence();
    updateState({
      segment: getSegment(length),
      user_turn: true,
    });
  }
  function getTargetPanel() {
    return _state.clicked.slice(-1);
  }
  function advance(len = _state.length) {
    playbackSequence(len);
    len < 20 && setTimeout(playbackSequence, len + 1, 2000);
    updateState({ length: updateLengthDisplay(len + 1) });
  }
  function userError() {
    if (strict) {
      gameReset();
    }
    if (!strict) {
      playbackSequence();
    }
  }
  function userCorrect(index) {
    updateState({ target: _state.sequence[index] });
  }
  function colorPanel(e) {
    if (!on || running) return;
    let { on, running, user_turn, clicked, segment } = _state;
    if (user_turn) {
      if (clicked.length < segment.length) {
        updateState({
          target: getTargetPanel(),
          input: e.target.id,
        });

        updateState({
          clicked: [...clicked, e.target.id],
          input: e.target.id,
        });
      }
    }
  }

  function getSegment(length) {
    return _state.sequence.slice(0, length);
  }
  function getDisplayLength(num = 0) {
    return num > 9 ? `${num}` : `0${num}`;
  }
  function updateLengthDisplay(length = 0) {
    $length_display.text(length !== null ? getDisplayLength(length) : '');
    return length;
  }
  function updateStatusDisplay(ok = true) {
    $status_display.text(ok ? 'OK' : 'ERROR');
    return ok;
  }
  function addToUserSequence(panel_id) {
    let { clicked: c, user_turn: u } = _state,
      clicked = u ? [...c, panel_id] : c;
    updateState({ clicked });
  }
  function initUserSequence() {
    updateState({ clicked: [], input: '' });
  }
});
