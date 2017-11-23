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
};

function GameStateInstance(config = {}) {
  let o = Object.assign({}, INIT_STATE, config), output = {};
  for (let x in o) { this[x] = o[x]; }
}

let __st = new GameStateInstance(), st__ = {};

$(document).ready(function() {
  $(document).on('click', 'div, span', function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log({now});
  });
  const $power_switch = $('.switch'), // <-- $ Power Switch
    $power_knob = $('.knob'), // <-- $ Power Knob
    $color_panels = $('.panel'), // <-- $ Color Panels
    $start_reset = $('.start-reset'), // <-- $ Start Stop Button
    $strict_mode = $('.strict'), // <-- $ Strict Mode Button
    $length_display = $('.digits'), // <-- $ Length Display
    $game_status = $('.status'); // <-- $ Status Display
  $length_display.text('--');
  $(document).on('click', 'div.panel', function(e) {
    afterEveryClick(e);
  });

  const _getNewState = (mods_obj = {}) => (
    new GameStateInstance(config, x, x)
  );
  let fn = {
    updateUI(curr = now, prev = the_previous) {},
    cycleUpdate(nu_state = {}) {
      the_previous = now;
      now = nu_state;
      updateUI(now);
    },
    afterEveryClick(event) {
      let t = event.currentTarget;
      if (now.on && now.user_turn && t.id.length === 1) {
        cycleUpdate({
          input: t.id,
          clicked: [...now.clicked, t.id],
        });
        return;
      }
    },
    newSequence(length = 20) {
      let colors = ['r', 'g', 'b', 'y'],
        seq = [],
        i;
      for (i = 0; i < length; i++) {
        let n = Math.floor(Math.random() * 3.999);
        seq = [...seq, colors[n]];
      }
      console.log(seq);
      return seq;
    },
    updateSegment(len = 0) {
      let segment = now.sequence.slice(0, now.segment.length);
      cycleUpdate({
        segment,
        length: len,
      });
    },
    activatePanel(color_str) {
      let $panel = $(`#${color_str}`),
        ms = now.error ? 2000 : 750;
      $panel.addClass('active');
      setTimeout(function() {
        $panel.removeClass('active');
      }, ms);
    },
    checkUserInput(user_input = '') {
      if (user_input === now.sequence[length + 1]) {
        now = {
          length: now.length ? now.length - 1 : 0,
        };
        return true;
      }
      return false;
    },
    displayLength(num = 0) {
      let str = num > 9 ? `${num}` : `0${num}`;
      $length_display.text(str);
    },
    playbackSequence(l = now.length) {
      let i = 0;
      displayLength(i);
      now.playbackInterval = setInterval(function() {
        if (i < l) {
          activatePanel(now.sequence[i]);
          i++;
          displayLength(i);
        } else {
          now.user_turn = !now.user_turn;
          clearInterval(now.playbackInterval);
        }
      }, 850);
    },
    errorSequence() {
      let $not_red = $color_panels.not('.red');
      console.log($not_red); // <-- test
      now.error = true;
      $not_red.addClass('error');
      ['r', 'g', 'b', 'y'].forEach(activatePanel);
      $('#no')
        .get(0)
        .play();
      $length_display.text('Er');
      setTimeout(function() {
        $not_red.removeClass('error');
        displayLength(now.length);
      }, 3000);
      now.error = false;
    },
  };
  $power_switch.click(function() {
    $power_knob.text(now.on ? '' : 'ON');
    $power_switch.toggleClass('on');
    $length_display.toggleClass('on');
    now.on = !now.on;
    if (now.on) {
      now.sequence = newSequence(5);
      console.log(now);
      playbackSequence(now.length);
      errorSequence();
    }
  });
  // COLOR PANELS CLICK HANDLER
  $color_panels.click(function() {
    let id = $(this).get(0).id,
      ok = checkUserInput(id, now.length);
    activatePanel(id);
    if (ok) {
      displayLength(now.length + 1);

      console.log('O%', $(this).get(0).id, 'CORRECT!!!');
    } else {
    }
    now.input = id;
  });
  $start_reset.on('click', function() {});

  let game = {
    newGame() {},
  };
});
