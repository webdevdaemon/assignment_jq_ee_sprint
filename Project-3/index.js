const INITIAL_STATE = {
    clicked: [],
    input: '',
    length: 5,
    ok: true,
    on: false,
    playback: false,
    required_length: 5,
    sequence: [],
    strict: false,
    target: '',
    user_turn: false,
  },
  updateState = (obj, ...callbacks) => {
    let current = Object.assign({}, _state);
    _state = Object.assign({}, current, obj);
    console.table([current, _state]);
    return (!callbacks[0] || (function() {
      callbacks.forEach(fn => fn());
    })());
  };
let _state = Object.assign({}, INITIAL_STATE);
$(document).ready(function() {
  const $power_switch = $('.switch'), // <-- $ Power Switch
    $color_panels = $('.panel'), // <-- $ Color Panels
    $start_reset = $('.start-reset'), // <-- $ Start Stop Button
    $strict_mode = $('.strict'), // <-- $ Strict Mode Button
    $length_display = $('.digits'), // <-- $ Length Display
    $game_status = $('.status'); // <-- $ Status Display
  $power_switch.click(function() {
    updateState({
      on: !_state.on,
      length: updateLengthDisplay(0),
      sequence: getNewSequence(),
    });
    $power_switch.toggleClass('on');
    $length_display.toggleClass('on');
  });
  $color_panels.click(colorPanel);

  $start_reset.click(function() {
    if (!_state.on) { return; }
    if (!_state.playback) { gameReset(); }
    if (_state.playback) {
      clearInterval(playbackSequence.playbackInterval);
      gameReset();
    }
    // updateState({sequence: getNewSequence()});
  });

  function gameStart(required_length = _state.required_length) {
    updateState({
      required_length,
      length: updateLengthDisplay(0),
      user_turn: false,
      playback: true,
    }, () => {
      setTimeout(() => {
        playbackSequence(_state.required_length);
      }, 1000);
    });
  }

  function gameReset() {
    updateState({
      user_turn: false,
      playback: false,
      sequence: getNewSequence(),
      length: updateLengthDisplay(0),
      required_length: 5
    }, gameStart);
  }

  function userStart(dex = _state.required_length) {
    let uStream = Rx.Observable.fromEvent($color_panels, 'click');
    let uTurn = uStream.take(dex)
    .map((evt, idx) => {
      let color = evt.target.id;
      console.log(color);
      if (color === _state.sequence[idx]) {
        console.log(`CORRECT: ${color}`);

      } else {
        console.error(`INCORRECT: ${color}`);
        updateState({
          ok: false,
          user_turn: false,
          playback: true
        }, () => {
          $game_status.text('WRONG!!!');
          setTimeout(() => { playbackSequence(); }, 2000);
        });
      }
    });
    let sub = uTurn.subscribe((x))
  }

  function userReset() {
    updateState({
      clicked: [],
      input: '',
    }, userStart);
  }

  function strictMode() {
    updateState({
      strict: !_state.strict
    });
  }

  function colorPanel(e) {
    if (!_state.on || _state.playback) {
      return;
    }
    if (_state.user_turn) {
      activatePanel(e.target.id)
    }
    // if(_state.user_turn) {}
  }

  function activatePanel(color_str) {
    let $panel = $(`#${color_str}`);
    $panel.addClass('active');
    $(`#panel-tone-${color_str}`).get(0).play();
    setTimeout(function() {
      $panel.removeClass('active');
    }, 1000);
  }

  function playbackSequence(length = _state.required_length) {
    let i = 0;
    updateLengthDisplay(i);
    playbackSequence.playbackInterval = setInterval(function() {
      if (i < length) {
        activatePanel(_state.sequence[i]);
        i++;
        updateLengthDisplay(i);
      } else {
        clearInterval(playbackSequence.playbackInterval);
        userReset();
      }
    }, 1100);
  }

  function stopPlaybackStartUser() {
    updateState({
      playback: false,
    }, userReset);
  }

  function getDisplayLength(num = 0) {
    return num > 9 ? `${num}` : `0${num}`;
  }

  function updateLengthDisplay(length) {
    $length_display.text(getDisplayLength(length));
    return length;
  }

  function getNewSequence(length = 20) {
    let colors = ['r', 'g', 'b', 'y'],
      seq = [],
      i;
    for (i = 0; i < length; i++) {
      let n = Math.floor(Math.random() * (5 - 1)) + 1;
      seq = [...seq, colors[n - 1]];
    }
    console.log(seq);
    return seq;
  }
});
