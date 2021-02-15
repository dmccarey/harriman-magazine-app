$(document).ready(function() {


  $('.btn-menu').on('click', function(e) {
    console.log('next item')
    $('.main-menu').toggle()
  })

  $('.btn-close').on('click', function(e) {
    console.log('next item')
    $('.main-menu').toggle()
  })


  $(document).on('click', '.search-form button', function(e) {
    e.preventDefault()
    var val = $('.search-box').val()
    window.location = '/search/' + val
  })

})
