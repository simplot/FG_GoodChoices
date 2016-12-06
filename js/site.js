// website.com/#?slide=name is the syntax for landing on a particular slide
var slideNames = ['jalapeno', 'kale' ,'quinoa' , 'mango', 'normandy', 'avocado'];

function pageReady(vm) {
    // here's where any run-once-on-setup code can be put
    console.log('page is set up and running');

    $('.carousel').slick({
      adaptiveHeight: true,
      swipe: true,
      prevArrow: '<button type="button" class="prev"><span class="visually-hidden">Previous</span></button>',
      nextArrow: '<button type="button" class="next"><span class="visually-hidden">Next</span></button>',
    });
    $('.carousel').slick('slickGoTo', vm.currentSlide); // initial slide

    //Makes all anchor tags smooth scroll, except for carousel controls
    $('a[href^="#"]').on('click',function( event ) {
        if( event.preventDefault() ) {
            event.preventDefault();
        }
        var target = $( $(this).attr('href') );
        var scrollHeight = target.offset().top;
        if( target.length ) {
            //  event.preventDefault();
            $('html, body').animate({
                scrollTop: scrollHeight
            }, 500);
        }
    });


    /*
    $('#gameday-video-link').click(function () {
        var src = 'https://www.youtube.com/embed/IHPC0zfiQ48?rel=0&showinfo=0&autoplay=1';
        $('#gameday-video-modal').modal('show');
        $('#gameday-video-modal iframe').attr('src', src);
    });

    $('#gameday-video-modal button').click(function () {
        $('#gameday-video-modal iframe').removeAttr('src');
    });
    */

}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var app = angular.module('FallHarvestApp', ['ngMaterial']);

///////////////////////////////////////////////////////////////////////////////

app.controller('FallHarvestController', function($scope, $timeout, $location) {
    var vm = this;
    window.gep = vm;

    vm.recipes = getRecipes();
    initializeRecipes(vm.recipes);

    vm.daypartTerms = extractTerms(vm.recipes, 'dayparts');
    vm.productTerms = extractTerms(vm.recipes, 'products');

    vm.filterParameters = {
        text: '',
        daypart: '',
        product: '',
    };

    vm.blurOnReturn = function (event) {
        if (event.keyCode == 13) {
            event.target.blur();
        }
    };

    vm.updateFilterResults = function () {
        var filterText = vm.filterParameters.text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

        vm.recipes.forEach(function (recipe) {
            var daypartMatch = !vm.filterParameters.daypart || recipe.dayparts.indexOf(vm.filterParameters.daypart) >= 0;
            var productMatch = !vm.filterParameters.product || recipe.products.indexOf(vm.filterParameters.product) >= 0;
            var textMatch = !filterText || recipe.searchText.indexOf(filterText) >= 0;

            recipe.isVisible = daypartMatch && productMatch && textMatch;
        });
    };
    vm.updateFilterResults();

    // example emit-on-update receiver:
    // $scope.$on('someName', function(event) {
    //     console.log('event fired:', event);
    // });

    vm.currentSlide = 0;

    $('.carousel').on('afterChange', function(event, slick, newSlide) {
        if (vm.currentSlide != newSlide) {
            vm.currentSlide = newSlide;
            $timeout(function() { $scope.$digest(); });
        }
    });

    vm.gotoSlide = function (n) {
        $('.carousel').slick('slickGoTo', n);
        // note: vm.currentSlide will be updated as an effect, above
    };

    // "pagelocation"/#?slide=name is the syntax
    var slideName = $location.search()['slide'];
    var slideNum = slideNames.indexOf(slideName);
    if (slideNum >= 0) {
        vm.currentSlide = slideNum; // for later initialization to move to.
    }

    $timeout(function() {
        pageReady(vm);
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
// JSON.stringify(result.data.map(x=>{ return { name: x[0].trim(), columns: 1, rows: 1, download: x[1].trim(), image: x[2].trim(), daypart: x[3].trim(), [4].trim() + '|' + x[5].trim()).replace(/(^\|)|(\|$)/,'').split('|'), products: (x[6].trim() + '|' + x[7].trim()).replace(/(^\|)|(\|$)/,'').split('|')}; }))
// to have something to copy-n-paste to here
function getRecipes() {
    var recipes = [{
        name: "Thai Style Pasty",
        image: "GGThaiStylePotPies.jpg",
        thumbnail: "GGThaiStylePotPiesThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "ThaiStylePasty.pdf",
        dayparts: "Lunch | Dinner",
        products: "Grains"
    }, {
        name: "Brussels Sprouts with Corn, Bacon & Jalapeno",
        image: "RWBlendsCornJlpnoBrussels.jpg",
        thumbnail: "RWBlendsCornJlpnoBrusselsThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "BrsslSprtJlpnCorn.pdf",
        dayparts: "Appetizer | Side",
        products: "Vegetables | Roasted"
    }, {
        name: "Pork Nachos with Pineapple & Pepper ",
        image: "RWBlendsPineapplePepprNachos.jpg",
        thumbnail: "RWBlendsPineapplePepprNachosThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "PinePplJlpnNch.pdf",
        dayparts: "Appetizer | Side | Lunch | Dinner",
        products: "Vegetables | Roasted | Potatoes"
    }, {
        name: "Mango Smoothie Bowl",
        image: "MangoSmoothieBowl.jpg",
        thumbnail: "MangoSmoothieBowlThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "MngSmthBwl.pdf",
        dayparts: "Breakfast | Side | Lunch",
        products: "Fruit"
    }, {
        name: "Artisanal Grilled Cheese and Fire Roasted Apples",
        image: "FujiApplePanini.jpg",
        thumbnail: "FujiApplePaniniThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "ArtsnlGrlldChsNFrRstdApple.pdf",
        dayparts: "Lunch | Dinner",
        products: "Fruit | Roasted"
    }, {
        name: "Pineapple & Bacon Cheese Burger",
        image: "RWBlendsPineapplePepprBurger.jpg",
        thumbnail: "RWBlendsPineapplePepprBurgerThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "PneAppleBcnChsBrgr.pdf",
        dayparts: "Lunch | Dinner",
        products: "Fruit | Roasted"
    }, {
        name: "Mediterranean Stuffed Mushrooms",
        image: "GGAncientGrainsKaleMedMush.jpg",
        thumbnail: "GGAncientGrainsKaleMedMushThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "MdtrrnnStffdMshrms.pdf",
        dayparts: "Appetizer | Side",
        products: "Grains"
    }, {
        name: "Asian Grain Salad",
        image: "GGAncientGrainsKaleSsmeSalad.jpg",
        thumbnail: "GGAncientGrainsKaleSsmeSaladThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "AsnGrnSld.pdf",
        dayparts: "Lunch | Dinner | Side",
        products: "Grains"
    }, {
        name: "Corn & Jalapeno Ho Cakes",
        image: "RWBlendsCornJlpnoHoCakes.jpg",
        thumbnail: "RWBlendsCornJlpnoHoCakesThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "CrnJlpnHoCakes.pdf",
        dayparts: "Breakfast | Side | Lunch | Appetizer",
        products: "Avocado | Vegetables | Roasted"
    }, {
        name: "Citrus Grain & Kale Salad",
        image: "GGAncientGrainsKaleSldPomgrnt.jpg",
        thumbnail: "GGAncientGrainsKaleSldPomgrntThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "CtrsGrnKlSld.pdf",
        dayparts: "Side | Lunch | Dinner",
        products: "Grains"
    }, {
        name: "Miso Glazed Salmon with Pineapple Salsa",
        image: "RWBlendsPineapplePepprSalmon.jpg",
        thumbnail: "RWBlendsPineapplePepprSalmonThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "MzGlzdSlmnwPnpplPpprBlnd.pdf",
        dayparts: "Lunch | Dinner",
        products: "Roasted | Fruit"
    }, {
        name: "Pineapple and Poke Tower",
        image: "RWBlendsPineapplePepprAhiTower.jpg",
        thumbnail: "RWBlendsPineapplePepprAhiTowerThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "PnpplePkTwr.pdf",
        dayparts: "Appetizer | Lunch | Dinner",
        products: "Avocado | Fruit | Roasted"
    }, {
        name: "Mango and Strawberry Salsa",
        image: "MangoSalsaTrio.jpg",
        thumbnail: "MangoSalsaTrioThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "MngStrwbrrySls.pdf",
        dayparts: "Appetizer | Side",
        products: "Fruit"
    }, {
        name: "Mango and Cucumber Salsa",
        image: "MangoSalsaTrio.jpg",
        thumbnail: "MangoSalsaTrioThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "MngCukeoSls.pdf",
        dayparts: "Appetizer | Side",
        products: "Fruit"
    }, {
        name: "Mango Guacamole",
        image: "MangoSalsaTrio.jpg",
        thumbnail: "MangoSalsaTrioThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "MngGucmole.pdf",
        dayparts: "Appetizer | Side",
        products: "Avocado | Fruit"
    }, {
        name: "Elote Street Corn",
        image: "RWBlendsCornJlpnoElote.jpg",
        thumbnail: "RWBlendsCornJlpnoEloteThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "EloteStrCrn.pdf",
        dayparts: "Apppetizer | Side | Lunch",
        products: "Vegetables | Roasted"
    }, {
        name: "Shrimp Taco",
        image: "RWBlendsCornJlpnoShrimpTacos.jpg",
        thumbnail: "RWBlendsCornJlpnoShrimpTacosThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "ShrimpTacos.pdf",
        dayparts: "Appetizer | Lunch | Dinner",
        products: "Avocado | Vegetables | Roasted"
    }, {
        name: "Salmon Burger Patties",
        image: "GGAncientGrainsKaleSalmBrgr.jpg",
        thumbnail: "GGAncientGrainsKaleSalmBrgrThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "BrsdPrkRstdRtVgtblsFrtCmpt.pdf",
        dayparts: "Lunch | Dinner",
        products: "Grains"
    }, {
        name: "Shrimp Spring Rolls ",
        image: "GGThaiStyleSpringRolls.jpg",
        thumbnail: "GGThaiStyleSpringRollsThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "ShrimpSprngRlls.pdf",
        dayparts: "Appetizer | Side | Lunch | Dinner",
        products: "Grains"
    }, {
        name: "Peanut Chicken Salad",
        image: "GGThaiStylePeanutChixSalad.jpg",
        thumbnail: "GGThaiStylePeanutChixSaladThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "PeanutChickenSalad.pdf",
        dayparts: "Side | Lunch | Dinner",
        products: "Grains"
    }, {
        name: "Short Ribs Lettuce Wraps",
        image: "GGThaiStyleLettuceVegWraps.jpg",
        thumbnail: "GGThaiStyleLettuceVegWrapsThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "ShrtRibLettuceWraps.pdf",
        dayparts: "Appetizer | Side | Lunch | Dinner",
        products: "Grains"
    }, {
        name: "Kimchi Rice Bowl",
        image: "KimChiRice.jpg",
        thumbnail: "KimChiRiceThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "Kimchi Rice Bowl.pdf",
        dayparts: "Lunch | Dinner",
        products: "Avocado"
    }, {
        name: "Flatbread Especial",
        image: "FlatBreadEspecial.jpg",
        thumbnail: "FlatBreadEspecialThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "FlatbreadEspecial.pdf",
        dayparts: "Lunch | Dinner | Appetizer",
        products: "Avocado"
    }, {
        name: "Avocado and Bean Wrap",
        image: "AvoBeanWrap.jpg",
        thumbnail: "AvoBeanWrapThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "AvocadoBeanWrap.pdf",
        dayparts: "Lunch | Dinner",
        products: "Avocado"
    }, {
        name: "Avocado and Egg Sandwich",
        image: "AvoEggSaladSandwich.jpg",
        thumbnail: "AvoEggSaladSandwichThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "AvocadoEggSldSndwch.pdf",
        dayparts: "Lunch | Dinner",
        products: "Avocado"
    }, {
        name: "Avocado Breakfast Pizza",
        image: "AvoBreakfastPizza.jpg",
        thumbnail: "AvoBreakfastPizzaThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "AvocadoBrkfstPzza.pdf",
        dayparts: "Breakfast | Lunch",
        products: "Avocado"
    }, {
        name: "Green Applecado Smoothie",
        image: "AplecadoSmoothie.jpg",
        thumbnail: "AplecadoSmoothieThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "GrnApplecdoSmthie.pdf",
        dayparts: "Breakfast | Appetizer | Side",
        products: "Avocado"
    }, {
        name: "Pacific Berry Smoothie",
        image: "PacificBerrySmoothie.jpg",
        thumbnail: "PacificBerrySmoothieThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "PcfcBrrySmthie.pdf",
        dayparts: "Breakfast | Appetizer | Side",
        products: "Avocado | Fruit"
    }, {
        name: "APB Smoothie",
        image: "APBSmoothie.jpg",
        thumbnail: "APBSmoothieThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "APBSmthie.pdf",
        dayparts: "Breakfast | Appetizer | Side",
        products: "Avocado"
    }, {
        name: "Stawvocado Smoothie",
        image: "StrawberryAvoSmoothie.jpg",
        thumbnail: "StrawberryAvoSmoothieThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "StrwvcdSmthie.pdf",
        dayparts: "Breakfast | Appetizer | Side",
        products: "Avocado | Fruit"
    }, {
        name: "Fiesta Salad Bowl",
        image: "FstaSldBwl.jpg",
        thumbnail: "FstaSldBwlThumbnail.jpg",
        columns: 1,
        rows: 3,
        pdf: "FiestaSldBwl.pdf",
        dayparts: "Lunch|Dinner",
        products: "Vegetables"
    }, {
        name: "Bourbon and Flame-Roasted Fuji Apple Glazed Turkey",
        image: "BourbonFlRstdFujiApTurkey.jpg",
        thumbnail: "BourbonFlRstdFujiApTurkeyThumbnail.jpg",
        columns: 1,
        rows: 6,
        pdf: "BrbnFlmRstdFjApplGlzdTrky.pdf",
        dayparts: "Dinner",
        products: "Roasted | Vegetables | Fruit | Potatoes"
    }, {
        name: "Parisian Carrots in  Brown Butter Sage Sauce with Redskin Mashed  ",
        image: "PrsnCrtsBrnBtrSgScRdsknMshd.jpg  ",
        thumbnail: "PrsnCrtsBrnBtrSgScRdsknMshdThumbnail.jpg  ",
        columns: 1,
        rows: 4,
        pdf: "PrsnCrrtsBrnBttrSgScRdsknMshd.pdf",
        dayparts: "Side | Dinner",
        products: "Vegetables | Potatoes"
    }, {
        name: "Curried Cauliflower",
        image: "CurriedCauliflower.jpg",
        thumbnail: "CurriedCauliflowerThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "CrrdClflwr.pdf",
        dayparts: "Side | Dinner",
        products: "Vegetables"
    }, {
        name: "Roasted Salmon with Redskin Mashed, Tri-Colored Carrots & Pesto",
        image: "RstdSlmnRdsknMshd.jpg",
        thumbnail: "RstdSlmnRdsknMshdThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "RstdSlmnRdsknMshd.pdf",
        dayparts: "Lunch | Dinner",
        products: "Potatoes | Vegetables"
    }, {
        name: "Braised Pork and Roasted Root Vegetables with Fruit Compote",
        image: "BrsdPrkRootVeg.jpg",
        thumbnail: "BrsdPrkRootVegThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "BrsdPrkRstdRtVgtblsFrtCmpt.pdf",
        dayparts: "Lunch | Dinner",
        products: "Vegetables | Potatoes | Fruit | Roasted"
    }, {
        name: "Haricot de Deux with Raspberry Honey Vinaigrette",
        image: "HrctDeDeuxRspbVin.jpg",
        thumbnail: "HrctDeDeuxRspbVinThumbnail.jpg",
        columns: 1,
        rows: 4,
        pdf: "HrctDeDxRspbrrHnyVngrtt.pdf",
        dayparts: "Side",
        products: "Vegetables | Fruit"
    }];

    recipes.forEach(function (recipe) {
        recipe.dayparts = recipe.dayparts.split('|').map(function (daypart) { return daypart.trim(); });
        recipe.products = recipe.products.split('|').map(function (product) { return product.trim(); });
    });

    return recipes;
}

function initializeRecipes(recipes) {
    recipes.forEach(function (recipe) {
        recipe.searchText = recipe.name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    });
}

function extractTerms(items, property) {
    return _.uniq(_.flatten(items.map(function (item) { return item[property]; })));
}
