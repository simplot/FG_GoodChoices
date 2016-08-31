
function pageReady() {
    // here's where any run-once-on-setup code can be put
    console.log('page is set up and running');

    //Handles the navigation for seasonal product group carousels
    $('[id^=seasonal-group-carousel-selector-]').click(function () {
      var id_selector = $(this).attr("id");
      var carousel_index = 0;
      try {
        var id = /-(\d+)$/.exec(id_selector)[1];

        //set the carousel index on group change
        if( id == 1 ) {
          carousel_index = 3;
        }
        else if( id == 2 ) {
          carousel_index = 6;
        }
        $('#seasonal-carousel').carousel(carousel_index);
        // console.log(id_selector, id);
        $('#seasonal .nav-tabs .inner').removeClass('active');
        $(this).parent().addClass('active');
        $('#seasonal .product-group').removeClass('active');
        $('#seasonal .product-group.group-' + id).addClass('active');

        //Default to the first product in group
        $('#seasonal .product-group > article').removeClass('active');
        $('#seasonal .product-group.group-' + id + ' > article:first-child').addClass('active');
      }
      catch (e) {
        console.log('Regex failed!', e);
      }
    });

    //Handles the seasonal product carousel links
    $('[id^=seasonal-carousel-selector-]').click(function () {
      var id_selector = $(this).attr("id");
      try {
        var id = /-(\d+)$/.exec(id_selector)[1];
        // console.log(id_selector, id);
        $('#seasonal .product-group > article').removeClass('active');
        $(this).parent().parent().parent().addClass('active');
        $('#seasonal-carousel').carousel(parseInt(id));
      }
      catch (e) {
        console.log('Regex failed!', e);
      }
    });

    //Handles the navigation for gameday product group carousels
    $('[id^=gameday-group-carousel-selector-]').click(function () {
      var id_selector = $(this).attr("id");
      var carousel_index = 0;
      try {
        var id = /-(\d+)$/.exec(id_selector)[1];

        //set the carousel index on group change
        if( id == 1 ) {
          carousel_index = 3;
        }
        else if( id == 2 ) {
          carousel_index = 6;
        }
        $('#gameday-carousel').carousel(carousel_index);
        // console.log(id_selector, id);
        $('#gameday .nav-tabs .inner').removeClass('active');
        $(this).parent().addClass('active');
        $('#gameday .product-group').removeClass('active');
        $('#gameday .product-group.group-' + id).addClass('active');

        //Default to the first product in group
        $('#gameday .product-group > article').removeClass('active');
        $('#gameday .product-group.group-' + id + ' > article:first-child').addClass('active');
      }
      catch (e) {
        console.log('Regex failed!', e);
      }
    });

    //Handles the gameday product carousel links
    $('[id^=gameday-carousel-selector-]').click(function () {
      var id_selector = $(this).attr("id");
      try {
        var id = /-(\d+)$/.exec(id_selector)[1];
        // console.log(id_selector, id);
        $('#gameday .product-group > article').removeClass('active');
        $(this).parent().parent().parent().addClass('active');
        $('#gameday-carousel').carousel(parseInt(id));
      }
      catch (e) {
        console.log('Regex failed!', e);
      }
    });

    //Makes all anchor tags smooth scroll, except for carousel controls
    $('a[href^="#"]').on('click',function( event ) {
  		if( event.preventDefault() ) {
      	event.preventDefault();
  		}
  		var isCarousel = true;
  		isCarousel = $(this).hasClass('carousel-control');
  		//do not anchor scrolls for carousel links
  		if( !isCarousel ) {
  			var target = $( $(this).attr('href') );
  			var scrollHeight = target.offset().top;
  	    if( target.length ) {
        //  event.preventDefault();
          $('html, body').animate({
              scrollTop: scrollHeight
          }, 500);
  	    }
  		}
  	});

    //Play videos when still cover image is clicked
    $( '#seasonal-video-link' ).click( function(e) {
      e.preventDefault();
      $(this).hide();
      $(this).next().show();
    });
    $( '#gameday-video-link' ).click( function(e) {
      e.preventDefault();
      $(this).hide();
      $(this).next().show();
      //$( '#seasonal-video-link iframe' ).show();
    });


}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var app = angular.module('FallHarvestApp', ['ngMaterial']);

///////////////////////////////////////////////////////////////////////////////

app.controller('FallHarvestController', function($scope, $timeout) {
    var vm = this;
    window.gep = vm;

    vm.recipes = getRecipes();
    initializeRecipes(vm.recipes);

    vm.occasionTerms = extractTerms(vm.recipes, 'occasion');
    vm.productTerms = extractTerms(vm.recipes, 'products');
    vm.trendTerms = extractTerms(vm.recipes, 'trends');

    vm.filterParameters = {
        text: '',
        occasion: '',
        product: '',
        trend: ''
    };

    vm.updateFilterResults = function () {
        var filterText = vm.filterParameters.text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

        vm.recipes.forEach(function (recipe) {
            var occasionMatch = !vm.filterParameters.occasion || recipe.occasion == vm.filterParameters.occasion;
            var productMatch = !vm.filterParameters.product || recipe.products.indexOf(vm.filterParameters.product) >= 0;
            var trendMatch = !vm.filterParameters.trend || recipe.trends.indexOf(vm.filterParameters.trend) >= 0;
            var textMatch = !filterText || recipe.searchText.indexOf(filterText) >= 0;

            recipe.isVisible = occasionMatch && productMatch && trendMatch && textMatch;
        });
    }
    vm.updateFilterResults();

    // example emit-on-update receiver:
    // $scope.$on('someName', function(event) {
    //     console.log('event fired:', event);
    // });

    $timeout(function() {
        pageReady();
    });
});

///////////////////////////////////////////////////////////////////////////////

// put emit-on-update="someName" on an ng-repeat and it will fire someName
// after the DOM settles down from the angular rendering
app.directive('emitOnUpdate', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit(attr.emitOnUpdate);
                });
            }
        }
    }
});

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// exported a csv from the recipes spreadsheet, then used http://papaparse.com/demo to parse it ("," delimiter)
// finally, used the console to view the result and save as global and then
// JSON.stringify(result.data.map(x=>{ return { name: x[0].trim(), columns: 1, rows: 1, download: x[1].trim(), image: x[2].trim(), occasion: x[3].trim(), trends: (x[4].trim() + '|' + x[5].trim()).replace(/(^\|)|(\|$)/,'').split('|'), products: (x[6].trim() + '|' + x[7].trim()).replace(/(^\|)|(\|$)/,'').split('|')}; }))
// to have something to copy-n-paste to here
function getRecipes() {
    return [{
        "name": "Bacon Wrapped Cracked Pepper Fries",
        "columns": 1,
        "rows": 3,
        "download": "BaconWrappedCrackedPepperFries.pdf",
        "image": "BaconWrappedCrackedPepperFries.jpg",
        "occasion": "Game Day",
        "trends": ["Extreme Indulgence", "Sharables"],
        "products": ["Fries"]
    }, {
        "name": "Curried Vegetables",
        "columns": 2,
        "rows": 3,
        "download": "CurriedCauliflower.pdf",
        "image": "CurriedCauliflower.jpg",
        "occasion": "Seasonal Celebrations",
        "trends": ["Classics with a Twist", "Spicy & Bold"],
        "products": ["Vegetables"]
    }, {
        "name": "Flame-Roasted Maple Sweet Potato Pancakes with Bourbon Butter & Pecans",
        "columns": 1,
        "rows": 2,
        "download": "FlameRoastedMapleSweetPotatoPancakesWBourbonButterPecans.pdf",
        "image": "FlameRoastedMapleSweetPotatoPancakesWBourbonButterPecans.jpg",
        "occasion": "Seasonal Celebrations",
        "trends": ["Sharables", "Classics with a twist"],
        "products": ["Roasted"]
    }, {
        "name": "Hearty Grains & Butternut Squash Soup",
        "columns": 1,
        "rows": 3,
        "download": "HeartyGrainsButternutSquashSoup.pdf",
        "image": "HeartyGrainsButternutSquashSoup.jpg",
        "occasion": "Seasonal Celebrations",
        "trends": ["Classics with a Twist"],
        "products": ["Grains"]
    }, {
        "name": "Parisian Carrots in Brown Butter Sage Sauce with Redskin Mashed",
        "columns": 1,
        "rows": 2,
        "download": "ParisianCarrotsinBrownButterSaucewithRedskinMashed.pdf",
        "image": "ParisianCarrotsinBrownButterSaucewithRedskinMashed.jpg",
        "occasion": "Seasonal Celebrations",
        "trends": ["Classics with a Twist"],
        "products": ["Vegetables", "Roasted"]
    }, {
        "name": "Bourbon and Flame-Roasted Fuji Apple Glazed Turkey",
        "columns": 1,
        "rows": 3,
        "download": "BourbonandFlameRoastedFujiAppleGlazedTurkey.pdf",
        "image": "BourbonandFlameRoastedFujiAppleGlazedTurkey.jpg",
        "occasion": "Seasonal Celebrations",
        "trends": ["Classics with a Twist"],
        "products": ["Roasted"]
    }, {
        "name": "Roasted Maple Sweet Potatoes with Chili Flakes & Pumpkin Seeds",
        "columns": 2,
        "rows": 3,
        "download": "RoastedMapleSweetPotatoeswithChiliFlakesNPumpkinSeeds.pdf",
        "image": "RoastedMapleSweetPotatoeswithChiliFlakesNPumpkinSeeds.jpg",
        "occasion": "Seasonal Celebrations",
        "trends": ["Classics with a Twist", "Spicy & Bold"],
        "products": ["Roasted"]
    }, {
        "name": "Bacon and Brussels Mashed with Stout Gravy",
        "columns": 1,
        "rows": 3,
        "download": "BaconBrusslesMashedStoutGravy.pdf",
        "image": "BaconBrusslesMashedStoutGravy.jpg",
        "occasion": "Seasonal Celebrations",
        "trends": ["Classics with a Twist"],
        "products": ["Mashed", "Vegetables"]
    }, {
        "name": "Spicy Sriracha SIDEWINDERS™",
        "columns": 1,
        "rows": 2,
        "download": "SpicySrirachaSIDEWINDERS.pdf",
        "image": "SpicySrirachaSIDEWINDERS.jpg",
        "occasion": "Game Day",
        "trends": ["Spicy & Bold", "Sharables"],
        "products": ["Fries"]
    }, {
        "name": "Roasted Salmon with Redskin Mashed, Tri-Colored Carrots & Pesto",
        "columns": 2,
        "rows": 3,
        "download": "RoastedSalmonwithRedskinMashedTriColoredCarrotsNPesto.pdf",
        "image": "RoastedSalmonwithRedskinMashedTriColoredCarrotsNPesto.jpg",
        "occasion": "Seasonal Celebrations",
        "trends": ["Classics with a Twist"],
        "products": ["Mashed"]
    }, {
        "name": "Roasted Yukon Gold & Reds and Haricot Vert with Ancho Dust",
        "columns": 2,
        "rows": 3,
        "download": "RoastedYukonGoldNRedsandHaricotVertwithAnchoDust.pdf",
        "image": "RoastedYukonGoldNRedsandHaricotVertwithAnchoDust.jpg",
        "occasion": "Seasonal Celebrations",
        "trends": ["Classics with a Twist", "Spicy & Bold"],
        "products": ["Roasted", "Vegetables"]
    }, {
        "name": "Haricot de Deux with Raspberry Honey Vinaigrette",
        "columns": 1,
        "rows": 2,
        "download": "HaricotdeDeuxwithRaspberryHoneyVinaigrette.pdf",
        "image": "HaricotdeDeuxwithRaspberryHoneyVinaigrette.jpg",
        "occasion": "Seasonal Celebrations",
        "trends": ["Classics with a Twist"],
        "products": ["Vegetables"]
    }, {
        "name": "Roasted Sweet Potato Breakfast Hash",
        "columns": 2,
        "rows": 3,
        "download": "RoastedSweetPotatoBreakfastHash.pdf",
        "image": "RoastedSweetPotatoBreakfastHash.jpg",
        "occasion": "Seasonal Celebrations",
        "trends": ["Classics with a Twist"],
        "products": ["Roasted"]
    }, {
        "name": "Morel Waffle Mash Stacker with Shrimp, Scallops & Lobster",
        "columns": 1,
        "rows": 2,
        "download": "MoralWaffleMashStacker.pdf",
        "image": "MoralWaffleMashStacker.jpg",
        "occasion": "Game Day",
        "trends": ["Extreme Indulgence"],
        "products": ["Mashed"]
    }, {
        "name": "Chipotle Breakfast Scramble",
        "columns": 1,
        "rows": 2,
        "download": "ChipotleBreakfastScramble.pdf",
        "image": "ChipotleBreakfastScramble.jpg",
        "occasion": "Game Day",
        "trends": ["Spicy & Bold"],
        "products": ["Mashed", "Avocado"]
    }, {
        "name": "South of the Border Mashed",
        "columns": 1,
        "rows": 2,
        "download": "SouthoftheBorderMashed.pdf",
        "image": "SouthoftheBorderMashed.jpg",
        "occasion": "Game Day",
        "trends": ["Spicy & Bold"],
        "products": ["Mashed", "Avocado"]
    }, {
        "name": "Avocado Buffalo Chicken Sliders",
        "columns": 2,
        "rows": 3,
        "download": "AvocadoBuffaloChickenSliders.pdf",
        "image": "AvocadoBuffaloChickenSliders.jpg",
        "occasion": "Game Day",
        "trends": ["Spicy & Bold", "Sharables"],
        "products": ["Avocado"]
    }, {
        "name": "Sweet Potatocado Smoothie",
        "columns": 2,
        "rows": 3,
        "download": "SweetPotatocadoSmoothie.pdf",
        "image": "SweetPotatocadoSmoothie.jpg",
        "occasion": "Seasonal Celebrations",
        "trends": ["Seasonal Beverages", "Classics with a twist"],
        "products": ["Avocado", "Mashed"]
    }, {
        "name": "Fondue Frites",
        "columns": 1,
        "rows": 2,
        "download": "FondueFrites.pdf",
        "image": "FondueFrites.jpg",
        "occasion": "Game Day",
        "trends": ["Extreme Indulgence"],
        "products": ["Fries"]
    }, {
        "name": "Spicy Sweet Mashed Potatoes",
        "columns": 1,
        "rows": 3,
        "download": "SpicySweetMashedPotatos.pdf",
        "image": "SpicySweetMashedPotatos.jpg",
        "occasion": "Seasonal Celebrations",
        "trends": ["Spicy & Bold", "Classics with a twist"],
        "products": ["Mashed"]
    }, {
        "name": "Oktoberfest Sausage Platter",
        "columns": 1,
        "rows": 2,
        "download": "OktoberfestSausagePlatter.pdf",
        "image": "OktoberfestSausagePlatter.jpg",
        "occasion": "Seasonal Celebrations",
        "trends": ["Classics with a Twist"],
        "products": ["Mashed"]
    }, {
        "name": "Brussels Sprouts with Corn & Jalapeno and Bacon",
        "columns": 2,
        "rows": 3,
        "download": "BrusslesSproutswithCornNJalapenosandBacon.pdf",
        "image": "BrusselsSproutswithCornNJalapenoandBacon.jpg",
        "occasion": "Seasonal Celebrations",
        "trends": ["Sharables", "Classics with a twist"],
        "products": ["Vegetables", "Roasted"]
    }, {
        "name": "Pork Nachos with Pineapple and Pepper",
        "columns": 1,
        "rows": 2,
        "download": "PorkNachosWPineappleNPepper.pdf",
        "image": "PorkNachosWPineappleNPepper.jpg",
        "occasion": "Game Day",
        "trends": ["Spicy & Bold", "Shareable"],
        "products": []
    }, {
        "name": "Quinoa Kale Stuffed Mushrooms",
        "columns": 1,
        "rows": 2,
        "download": "QuinoaKaleStuffedMushrooms.pdf",
        "image": "QuinoaKaleStuffedMushrooms.jpg",
        "occasion": "Seasonal Celebrations",
        "trends": ["Sharables"],
        "products": ["Grains"]
    }, {
        "name": "Spicy Pulled Pork Shepherd Pie",
        "columns": 1,
        "rows": 2,
        "download": "SpicyPulledPorkShepherdsPie.pdf",
        "image": "SpicyPulledPorkShepherdsPie.jpg",
        "occasion": "Seasonal Celebrations",
        "trends": ["Classics with a Twist", "Sharables"],
        "products": ["Mashed"]
    }, {
        "name": "Avocado Mary",
        "columns": 1,
        "rows": 3,
        "download": "AvocadoMary.pdf",
        "image": "AvocadoMary.jpg",
        "occasion": "Game Day",
        "trends": ["Craft Cocktails/Mocktails"],
        "products": ["Avocado"]
    }, {
        "name": "Marionberry Mule",
        "columns": 2,
        "rows": 5,
        "download": "MarionberryMule.pdf",
        "image": "MarionberryMule.jpg",
        "occasion": "Game Day",
        "trends": ["Craft Cocktails/Mocktails"],
        "products": ["Fruit"]
    }, {
        "name": "Loaded Ghost Pepper Cheese & Pork Belly Sidewinders",
        "columns": 1,
        "rows": 2,
        "download": "LoadedGhostPepperCheeseNPorkBellySidewinders.pdf",
        "image": "LoadedGhostPepperCheeseNPorkBellySidewinders.jpg",
        "occasion": "Game Day",
        "trends": ["Extreme Indulgence"],
        "products": ["Fries", "Avocado"]
    }, {
        "name": "Ultimate Salted Caramel Fuji Apple Donutshake",
        "columns": 1,
        "rows": 2,
        "download": "UltimateSaltedCaramelFujiAppleDonutshake.pdf",
        "image": "UltimateSaltedCaramelFujiAppleDonutshake.jpg",
        "occasion": "Game Day",
        "trends": ["Extreme Indulgence"],
        "products": ["Roasted", "Fruit"]
    }, {
        "name": "Spicy Bourbon Peach Short Rib Sliders",
        "columns": 1,
        "rows": 2,
        "download": "SpicyBourbonPeachShortRibSliders.pdf",
        "image": "SpicyBourbonPeachShortRibSliders.jpg",
        "occasion": "Game Day",
        "trends": ["Sharables"],
        "products": ["Fruit"]
    }, {
        "name": "Angry Edamame",
        "columns": 1,
        "rows": 2,
        "download": "AngryEdamame.pdf",
        "image": "AngryEdamame.jpg",
        "occasion": "Game Day",
        "trends": ["Spicy & Bold", "Sharables"],
        "products": ["Vegetables"]
    }, {
        "name": "Flame-Roasted Corn & Jalapeno Queso",
        "columns": 1,
        "rows": 2,
        "download": "FlameRoastedCornNJalapenoQueso.pdf",
        "image": "FlameRoastedCornNJalapenoQueso.jpg",
        "occasion": "Game Day",
        "trends": ["Spicy & Bold", "Sharables"],
        "products": ["Roasted"]
    }, {
        "name": "Eggs Benny Rosemary Brunch Fries",
        "columns": 2,
        "rows": 1,
        "download": "EggsBennyRosemaryBrunchFries.pdf",
        "image": "EggsBennyRosemaryBrunchFries.jpg",
        "occasion": "Seasonal Celebrations",
        "trends": ["Classics with a Twist", "Sharables"],
        "products": ["Fries"]
    }, {
        "name": "Roasted Pork Loin with Mango Mojo & Ancient Grains & Kale",
        "columns": 1,
        "rows": 2,
        "download": "RoastedPorkwithMangoMojoNAncientGrainsNKale.pdf",
        "image": "RoastedPorkwithMangoMojoNAncientGrainsNKale.jpg",
        "occasion": "Seasonal Celebrations",
        "trends": ["Classics with a Twist", "Sharables"],
        "products": ["Fruit", "Grains"]
    }, {
        "name": "Black Cherry Old Fashioned Smash",
        "columns": 1,
        "rows": 2,
        "download": "BlackCherryOldFashionedSmash.pdf",
        "image": "BlackCherryOldFashionedSmash.jpg",
        "occasion": "Seasonal Celebrations",
        "trends": ["Seasonal Beverages"],
        "products": ["Fruit"]
    }, {
        "name": "Fuji Apple Fizz",
        "columns": 1,
        "rows": 3,
        "download": "FujiAppleFizz.pdf",
        "image": "FujiAppleFizz.jpg",
        "occasion": "Seasonal Celebrations",
        "trends": ["Seasonal Beverages"],
        "products": ["Fruit"]
    }, {
        "name": "Sparkling Rosemary Berry Sangria",
        "columns": 2,
        "rows": 4,
        "download": "SparklingRosemaryBerrySangria.pdf",
        "image": "SparklingRosemaryBerrySangria.jpg",
        "occasion": "Seasonal Celebrations",
        "trends": ["Seasonal Beverages"],
        "products": ["Fruit"]
    }, {
        "name": "Sweet Potato & Bacon Alfredo Pizza",
        "columns": 1,
        "rows": 2,
        "download": "SweetPotatoNBaconAlfredoPizza.pdf",
        "image": "SweetPotatoNBaconAlfredoPizza.jpg",
        "occasion": "Seasonal Celebrations",
        "trends": ["Sharables"],
        "products": ["Roasted"]
    }];
}

function initializeRecipes(recipes) {
    recipes.forEach(function (recipe) {
        recipe.searchText = recipe.name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    });
}

function extractTerms(items, property) {
    return _.uniq(_.flatten(items.map(function (item) { return item[property]; })));
}
