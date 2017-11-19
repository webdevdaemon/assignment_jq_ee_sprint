/*  A FEW STYLISTIC NOTES...
*   <|-|| Variables Naming Convention ||-|>
* " _scoredCamelCase " = function/method w/ return value
* " camelCase " = function/method w/o return value
* " snake_case " = primative, non-function, or DOM Element
* " $snake_case " = jQuery object
*/

const INIT_STATE = {
      on: false,
      user_turn: false,
      strict: false,
      error: false,
      sequence: [],
      segment: [],
      clicked: [],
      input: '',
      length: 0,
    },
    STATE_BUFFER = {};

let the_state = Object.create(INIT_STATE),
    the_previous = Object.assign({} , INIT_STATE, the_state);

// let the_state = Object.assign({}, STATE_BUFFER, INIT_STATE),

$(document).ready(function() {
  // <1> DEBUG HELPERS & CLICK LOGGERS
  $(document).on('click', 'div, span', function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log({the_state});
  });
  // </1>
  // <1> jQuery DOM ELEMENTS
  const $power_switch = $('.switch'), // <-- $ Power Switch
    $power_knob = $('.knob'), // <-- $ Power Knob
    $color_panels = $('.panel'), // <-- $ Color Panels
    $start_reset = $('.start-reset'), // <-- $ Start Stop Button
    $strict_mode = $('.strict'), // <-- $ Strict Mode Button
    $length_display = $('.digits'), // <-- $ Length Display
    $game_status = $('.status');
  $length_display.text('--');

  $(document).on('click', 'div.panel', function(e) {
    afterEveryClick(e);
  });
  const _cloneState  = obj => Object.create(obj),
    _updateState = updater => Object.assign({}, the_state, updater);

  function updateUI(curr = the_state, prev = the_previous) {
  }

  function cycleUpdate(nu_state = {}) {
    the_previous =
    the_state =
    updateUI(the_state);
  }
  function afterEveryClick(event) {
    let t = event.currentTarget;
    if (the_state.on && the_state.user_turn && t.id.length === 1) {
      cycleUpdate({
        input: t.id,
        clicked: [...the_state.clicked, t.id]
      });
      return;
    }
  }
  function newSequence(length = 20) {
    let colors = ['r', 'g', 'b', 'y'],
      seq = [],
      i;
    for (i = 0; i < length; i++) {
      let n = Math.floor(Math.random() * 3.999);
      seq = [...seq, colors[n]];
    }
    console.log(seq);
    return seq;
  }
  function updateSegment(len = 0) {
    let segment = the_state.sequence.slice(0, the_state.segment.length);
    cycleUpdate({segment, length: len});
  }
  function activatePanel(color_str) {
    let $panel = $(`#${color_str}`), ms = the_state.error ? 2000 : 750;
    $panel.addClass('active');
    setTimeout(function() { $panel.removeClass('active'); }, ms);
  }
  function checkUserInput(user_input = '') {
    if (user_input === the_state.sequence[length + 1]) {
      the_state = {length: (the_state.length) ? the_state.length - 1 : 0};
      return true;
    }
    return false;
  }
  function displayLength(num = 0) {
    let str = num > 9 ? `${num}` : `0${num}`;
    $length_display.text(str);
  }
  function playbackSequence(l = the_state.length) {
    let i = 0;
    displayLength(i);
    the_state.playbackInterval = setInterval(function() {
      if (i < l) {
        activatePanel(the_state.sequence[i]);
        i++;
        displayLength(i);
      } else {
        the_state.user_turn = !the_state.user_turn;
        clearInterval(the_state.playbackInterval);
      }
    }, 850);
  }
  function errorSequence() {
    let $not_red = $color_panels.not('.red'); console.log($not_red); // <-- test
    the_state.error = true;
    $not_red.addClass('error');
    ['r', 'g', 'b', 'y'].forEach(activatePanel);
    $('#no').get(0).play();
    $length_display.text('Er')
    setTimeout(function() {
      $not_red.removeClass('error');
      displayLength(the_state.length);
    }, 3000);
    the_state.error = false;
  }
  // </1> end
  // <1> HANDLERS & TRIGGERS
  $power_switch.click(function() {
    $power_knob.text(the_state.on ? '' : 'ON');
    $power_switch.toggleClass('on');
    $length_display.toggleClass('on');
    the_state.on = !the_state.on;
    if (the_state.on) {
      the_state.sequence = newSequence(5);
      console.log(the_state);
      playbackSequence(the_state.length);
      errorSequence();
    }
  });
  // COLOR PANELS CLICK HANDLER
  $color_panels.click(function() {
    let id = $(this).get(0).id,
        ok = checkUserInput(id, the_state.length);
    activatePanel(id);
    if (ok) {
      displayLength(the_state.length + 1);

      console.log('O%', $(this).get(0).id, 'CORRECT!!!');
    } else {

    }
    the_state.input = id;
  });
  $start_reset.on('click', function() {
  });

  let game = {
    newGame() {},
  };
});
