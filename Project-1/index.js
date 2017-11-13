let legend = { pass_ok: false, name_ok: false, area_ok: false }

$(document).ready(function () {
  const form$ = $('form'),
    pwds$ = $('.password'),
    reset$ = $('.reset'),
    submit$ = $('.submit'),
    redirect$ = $('.redirect')

  //* ***** TEXTAREA & TEXT-INPUT event listener & handler ******//
  form$.on('input', 'input, textarea', function () {
    let thi$ = $(this),
      length = thi$.val().length, // <- length of input
      { maxLength, id } = thi$.get(0), // <- decon maxlength & id from DOM obj
      count = id === 'username'
        ? '.counter-1'
        : id === 'text-area' ? '.counter-2' : undefined, // <- determine which counter to update
      remaining = maxLength - length // <- determine updated amount
    // if length > 4, update amount to the proper counter
    $(count).html(length > 4 ? remaining : '')
    // finish by making appropriate changes to legend obj
    legend[id === 'username' ? 'name_ok' : 'area_ok'] = length > 4
      ? true
      : false
  })

  //* ***** PASSWORD INPUT & CONFIRMATION event listener & handler ******//
  form$.on('input', 'input[type="password"]', function () {
    let [ create, confirm ] = pwds$, // <- decon password inputs $ object
      pwd1 = { v: $(create).val(), l: $(create).val().length },
      pwd2 = { v: $(confirm).val(), l: $(confirm).val().length }
    // change triggers length/accuracy check
    if (pwd1.l >= 6 && pwd1.l === pwd2.l && pwd1.v === pwd2.v) {
      $('.password-msg').html('<p class="green">PASSWORD OK</p>')
      legend.pass_ok = true
    } else {
      $('.password-msg').html('<p class="red">DOES NOT MATCH</p>')
      legend.pass_ok = false
    }
  })

  //* ***** SUBMISSION EVENT LISTENER/HANDLER ******//
  submit$.on('click', function (e) {
    e.preventDefault()
    populateModal()
    validateForm()
  })

  //* ***** RESET FORM LISTENER/HANDLER ******//
  reset$.on('click', function () {
    window.location.reload()
  })

  //* ***** REDIRECT TO HOMEPAGE LISTENER/HANDLER ******//
  redirect$.on('click', function () {
    window.location.replace('../index.html')
  })

  //* ***** SUCCESS MODAL POPULATOR ******//
  const populateModal = function () {
    let username = $('#username').val(),
      summary = $('#text-area').val(),
      password = $('#confirmation').val()
    $('.modal-username').text('"' + username + '"')
    $('.modal-summary').text('"' + summary + '"')
    $('.modal-password').text('"' + password + '"')
  }

  //* ***** FORM VALIDATION HANDLER ******//
  const validateForm = function () {
    let { pass_ok, name_ok, area_ok } = legend // <- decon legend obj
    let arr = [ pass_ok, name_ok, area_ok ], // <- create array
      	result = arr.reduce(function (acc, curr) {
          return curr ? [ ...acc, curr ] : acc
				}, []) // <- reduce array, only addding TRUTHY values to output
    if (result.length === 3) { // <- PASS - return TRUE
      $('.overlay-wrapper').toggle(500)
      return
    } else { // <- FAIL - prepare 'fixit' strings for individual validation issues
      let issue$ = $('<p class="issues red"></p>'),
        x_pass = 'Please re-type password (6 - 16 characters).<br />',
        x_name = 'Username not valid! Must contain 4 - 32 characters.<br />',
        x_area = 'Summary must contain between 4 - 140 characters.<br />'
      // append necessary fixit strings to error msg
      if (!pass_ok) { issue$.append(x_pass) }
      if (!name_ok) { issue$.append(x_name) }
      if (!area_ok) { issue$.append(x_area) }
      form$.append(issue$) // append error message to form
    }
  }
})
