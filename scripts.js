(function($) {
  $.fn.autocomplete = function(words, output) {
    var startsWith = function(letters) {
      return function(word) {
        return word.indexOf(letters) === 0;
      }
    }

    var matches = function(letters) {
      return letters ?
        $.grep(words, startsWith(letters)) : [];
    }

    this.keyup(function() {
      var newValue = capitalizeFirstLetter($(this).val());
      $(this).val(newValue)
      var letters = newValue;
      if (newValue.length < 3) {
        letters = '';
      }

      output(letters, matches(letters));
    });
  };
})(jQuery);

var base_api = "https://restcountries.eu/rest/v2";
var countries = [];


var render = function($output) {
  return function(letters, matches) {
    $output.empty()

    if(matches.length) {
      $.each(matches, function(index, match) {
        $match = $('<li/>')
          .append(match)
          .addClass('match');
        $output.append($match);
      });
    }
  }
}

$( document ).ready(function() {
  $.get( base_api + '/all', function( data ) {
    countries = $.map( data, function( val, i ) {
      return val.name
    });
    $('#search-input').autocomplete(countries.sort(), render($('.matches')));
  });
});

$('body').on('click', '.match', function() {
  $('#search-input').val($(this).html())
  $('.matches').html('');
  getCountriesCards($(this).html())
})
$('#search-button').on('click', function() {
  $('.matches').html('');
  getCountriesCards($('#search-input').val())
})

function getCountriesCards (name) {
  $('#cards').html('');
  $.get( base_api + `/name/${name}?fields=name;region;currencies;languages;population`, function( data ) {
    console.log(data)
    $.each( data, function( index, item ) {
      var currencies = $.map(item.currencies, function( val, i ) {
        return val.name;
      })
      var languages = $.map(item.languages, function( val, i ) {
        return val.name;
      })

      $('#cards').append(
        $('<div class="col-md-4">').append(
          $('<div class="card country-card mt-4">').append(
            $('<div class="card-body">').append(
              $('<h5 class="card-title">').html(item.name)
            ).append(
              $('<p>').html('<strong>Region:</strong> ' +item.region)
            ).append(
              $('<p>').html('<strong>Currencies:</strong> ' +currencies.join(', '))
            ).append(
              $('<p>').html('<strong>Languages:</strong> ' +languages.join(', '))
            ).append(
              $('<p>').html('<strong>Population:</strong> ' +item.population)
            )
          )
        )
      )
    });
  });
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}