

// <1> init state & update state
const INITIAL_STATE = {
		clicked: [],
		input: '',
		length: 0,
		on: false,
		playback: false,
		required_length: 5,
		sequence: [],
		strict: false,
		target: '',
		user_turn: false,
		ok: true;
	},
	updateState = (obj, ...callbacks) => {
		let current = _state;
		_state = Object.assign({}, current, obj);
		return (!callbacks[0] || (function() {
			console.log(callbacks);
			callbacks.forEach(fn => fn());
		})());
	};
// </1>
let _state = Object.assign({}, INITIAL_STATE);
$(document).ready(function() {
	// <1> jQuery Objects & Click Event Handlers
	const $power_switch = $('.switch'), // <-- $ Power Switch
		// $power_knob = $('.knob'),  <-- $ Power Knob
		$color_panels = $('.panel'), // <-- $ Color Panels
		$start_reset = $('.start-reset'), // <-- $ Start Stop Button
		$strict_mode = $('.strict'), // <-- $ Strict Mode Button
		$length_display = $('.digits'), // <-- $ Length Display
		$game_status = $('.status'); // <-- $ Status Display

	// POWER SWITCH CLICK HANDLER
	$power_switch.click(function() {
		updateState({
			on: !_state.on,
			length: updateLengthDisplay(0)
		});
		$power_switch.toggleClass('on');
		$length_display.toggleClass('on');
	});

	// COLOR PANELS CLICK HANDLER
	$color_panels.click(colorPanel);
	// START-RESET CLICK HANDLER
	$start_reset.on('click', function() {
		if (!_sbtate.on) {
			return;
		}
		if (_state.playback) {
			clearInterval(playbackSequence.playbackInterval);
			updateState({
				user_turn: false,
				sequence: getNewSequence(),
				length: updateLengthDisplay(0),
			}, playbackSequence);
			updateLengthDisplay(_state.required_length);
		}
		updateState({sequence: getNewSequence()});
	});
	// </1>

	// <2> functions - GAME OPS
	function gameStart() {
		playbackSequence(_state.length);
		updateState({running: true});
	}

	function gameReset() {
		updateState({
			running: false,
			user_turn: false,
			sequence: getNewSequence(),
			length: updateLengthDisplay(0),
			required_length: 1,
		});
	}

	function strictMode() {
		updateState({
			strict: !_state.strict
		});
	}

	function initUserTurn() {
		updateState({clicked: [], input: ''});
	}

	function colorPanel(e) {
		let {on, playback, user_turn, clicked, segment} = _state,
			pressed = e.target.id;
		if (!on || playback) {
			return;
		}
		if (user_turn) {}
		activatePanel($(e.target).get(0).id);
	}

	// </2>

	// <3>
	function activatePanel(color_str) {
		let $panel = $(`#${color_str}`),
			ms = _state.error
				? 2000
				: 750;
		$panel.addClass('active');
		$(`#panel-tone-${color_str}`).get(0).play();
		setTimeout(function() {
			$panel.removeClass('active');
		}, ms);
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
				updateState({
					playback: false
				}, initUserTurn);
			}
		}, 780);
	}

	function getDisplayLength(num = 0) {
		return num > 9
			? `${num}`
			: `0${num}`;
	}

	function updateLengthDisplay(length) {
		$length_display.text(
			length !== null
			? getDisplayLength(length)
			: '--');
		return length;
	}

	function getNewSequence(length = 20) {
		let colors = [ 'r', 'g', 'b', 'y', ],
			seq = [],
			i;
		for (i = 0; i < length; i++) {
			let n = Math.floor(Math.random() * (5 - 1)) + 1;
			seq = [
				...seq,
				colors[n - 1],
			];
			console.log(seq);
		}
		return seq;
	}

	// DEBUG
	updateState({
		sequence: getNewSequence()
	}, playbackSequence, function() {
		console.log('fn_one');
	}, function() {
		console.log('fn_two');
	}, function() {
		console.log('fn_tre');
	});
});
