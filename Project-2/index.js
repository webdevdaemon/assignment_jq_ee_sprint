let selected;

$(document).ready(() => {

  $('li').each(function(index, element) {
    $(this).attr('value', element.innerText);
  }); // <-- populate each <li> 'value' with it's own text content for reliable retrieval

  const $elect = $('#select'), // main "select" pulldown menu element

		toggleMenu = function() {
			// opens & closes menu
      $('#pulldown').slideToggle(100);
    },

		toggleButton = function() {
      $('#submit').fadeToggle('slow');
			// show/hide submit button
    },

		submitSelected = function() {
      // "mock" submit selected menu item...alert choice to user
      alert(`You've chosen to ${selected}...\nHAVE FUN!!!`);
    },

		updateSelected = function(str = 'Click to Choose...') {
			// update "select" display element after selection is made, toggle submit btn
      selected = str;
      $elect.text(str);
      toggleButton();
    },

		menuSwitch = $elect.click(function() {
      toggleMenu();
    }),

		itemClick = $('.line-item').click(function() {
      updateSelected($(this).attr('value'));
      toggleMenu();
    }),

		submitButton = $('#submit').click(function() {
      submitSelected();
    });
});
