const INIT_STATE = {
    on: false,
    running: false,
    user_turn: false,
    strict: false,
    error: false,
    sequence: [],
    segment: [],
    clicked: [],
    input: '',
    length: 0,
  },
  _getNewState = (options = {}) => new GameState(options);

function GameState(mods = {}, base = INIT_STATE) {
  let o = Object.assign({}, base, mods);
  for (let x in o) {
    this[x] = o[x];
  }
}

let _now_ = new GameState(),
  _previous_ = {},
  _history_ = [],
  _updater_ = {};

$(document).ready(function() {
  $(document).on('click', 'div, span', function(e) {
    e.preventDefault();
    e.stopPropagation();
    afterEveryClick(e);
  });
  //
  // ─── JQUERY OBJECTS ─────────────────────────────────────────────────────────────
  //
  const $power_switch = $('.switch'), // <-- $ Power Switch
    $power_knob = $('.knob'), // <-- $ Power Knob
    $color_panels = $('.panel'), // <-- $ Color Panels
    $start_reset = $('.start-reset'), // <-- $ Start Stop Button
    $strict_mode = $('.strict'), // <-- $ Strict Mode Button
    $length_display = $('.digits'), // <-- $ Length Display
    $game_status = $('.status'); // <-- $ Status Display

  function afterEveryClick(e) {
    let id = e.currentTarget.id;
    updateState(
      _now_.on && id.length === 1 ?
      {
        input: id,
        clicked: [..._now_.clicked, id],
      } :
      {
        input: '--',
      },
    );
    console.log({
      _now_,
      _updater_,
      _history_
    });
    console.table([_now_, _previous_]); // <- DEBUG
  }

  function updateUI(state = _now_) {}

  function updateState(updates = {}) {
    _previous_ = _getNewState(_now_);
    _updater_ = updates;
    _history_ = [_getNewState(_now_), ..._history_];
    _now_ = _getNewState(updates);
  }

  function updateLengthDisplay(length = 0) {
    $length_display.text(length !== null ? _getDisplayLength(length) : '');
  }

  function _getNewSequence(length = 20) {
    let colors = ['r', 'g', 'b', 'y'],
      seq = [],
      i;
    for (i = 0; i < length; i++) {
      let n = Math.floor(Math.random() * 3.999);
      seq = [...seq, colors[n]];
    }
    return seq;
  }

  function _getDisplayLength(num = 0) {
    num > 9 ? `${num}` : `0${num}`;
  }

  function updateSegment(length = 0) {
    let segment = _now_.sequence.slice(0, _now_.segment.length);
    updateState({
      segment,
      length
    });
  }

  function playColorPanelAudio(str) {
    $(`#panel-tone-${str}`)
      .get(0)
      .play();
  }

  function activatePanel(color_str) {
    let $panel = $(`#${color_str}`), ms = _now_.error ? 2000 : 750;
    if (!_now_.error) {playColorPanelAudio(color_str);}
    $panel.addClass('active');
    setTimeout(function() { $panel.removeClass('active'); }, ms);
  }


  function playbackSequence(l = _now_.length) {
    let i = 0;
    updateLengthDisplay(i);
    playbackSequence.playbackInterval = setInterval(function() {
      if (i < l) {
        activatePanel(_now_.sequence[i]);
        i++;
        updateLengthDisplay(i);
      } else {
        updateState({user_turn: true});
        clearInterval(playbackSequence.playbackInterval);
      }
    }, 780);
  }

  function errorSequence(muted = false) {
    let $not_red = $color_panels.not('.red');
    if (!muted) {
      $('#no')
      .get(0)
      .play();
    }
    $length_display.text(muted ? ':)' : 'XX');
    updateState({
      error: true,
    });
    $not_red.addClass('error');
    ['r', 'g', 'b', 'y'].forEach(activatePanel);
    setTimeout(function() {
      $not_red.removeClass('error');
      updateLengthDisplay(_now_.length);
    }, 3000);
    updateState({
      error: false,
    });
  }

  function checkUserInput(user_input = '') {
    if (user_input === _now_.sequence[length - 1]) {
      updateState({
        length: _now_.length ? _now_.length - 1 : 0,
      });
      return true;
    }
    return false;
  }

  let game = {
    init(on = _now_.on) {
      if (on) {
        errorSequence(true);
        updateState(
          new GameState({
            on: true,
            user_turn: false,
            sequence: _getNewSequence(20),
            length: 5
          })
        );
        updateState({segment: _now_.sequence.slice(_now_.length)});
      } else {
        updateState(new GameState());
        updateLengthDisplay(null);
      }
    },
    startReset() {

    }
  };

  // POWER SWITCH CLICK HANDLER
  $power_switch.click(function() {
    updateState({on: !_now_.on});
    let onn = _now_.on;
    $length_display.text(onn ? '--' : '');
    $power_knob.text(onn ? 'ON' : '');
    $power_switch.toggleClass('on');
    $length_display.toggleClass('on');
    game.init(onn);
  });
  // COLOR PANELS CLICK HANDLER
  $color_panels.click(function() {
    let id = $(this).get(0).id,
      ok = checkUserInput(id, _now_.length);
    activatePanel(id);
    if (_now_.running && ok) {
      updateState({length: _now_.length + 1});
      updateLengthDisplay(_now_.length);
      console.log('O%', $(this).get(0).id, 'CORRECT!!!');
    } else {}
    updateState({
      input: id
    });
  });
  // START-RESET CLICK HANDLER
  $start_reset.on('click', function() {
    if (!_now_.on) {return;}
    else if (_now_.running) {
      game.init();
      playbackSequence();

    }
  });
});

// game on

// 1
