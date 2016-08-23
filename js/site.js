var app = angular.module('FallHarvestApp', []);

///////////////////////////////////////////////////////////////////////////////

function extractTerms(items, property) {
    return _.uniq(_.flatten(items.map(function (item) { return item[property]; })));
}

function initializeRecipes(recipes) {
    recipes.forEach(function (recipe) {
        recipe.trendsDisplay = recipe.trendDescriptions.join(', ');
        recipe.searchText = (recipe.name + ' ' + recipe.description).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    });
}

app.controller('FallHarvestController', function($scope) {
    var vm = this;
    window.gep = vm;

    vm.recipes = getRecipes();
    initializeRecipes(vm.recipes);

    vm.daypartTerms = extractTerms(vm.recipes, 'dayparts');
    vm.productTerms = extractTerms(vm.recipes, 'products');
    vm.trendTerms = extractTerms(vm.recipes, 'trends');

    vm.filterParameters = {
        text: '',
        daypart: null,
        product: null,
        trend: null
    };

    vm.updateFilterResults = function () {
        var filterText = vm.filterParameters.text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
        vm.recipes.forEach(function (recipe) {
            recipe.isVisible = !filterText || recipe.searchText.indexOf(filterText) >= 0;
        });
    }
    vm.updateFilterResults();

    $scope.$on('someName', function(event) {
        console.log('event fired:', event);
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

// exported a csv from the old recipes spreadsheet, then used http://papaparse.com/demo to parse it ("," delimiter)
// finally, used the console to view the result and save as global and then JSON.stringify to copy-n-paste this:
function getRecipes() {
    return [
        ["Flame-Roasted Maple Sweet Potato Pancakes with Bourbon Butter & Pecans", "flame-roasted_maple_sweet_potato_pancakes_with_bourbon_butter_pecans", "FlRstdMplSwtPotPncksBrbnBtrPcns.jpg", "2", "FlRstdMplSwtPotPncksBrbnBtrPcns.pdf", "Bourbon-infused butter and crumbled pecans top these seasonally-inspired maple sweet potato pancakes. ", "Breakfast", "Potatoes", "Alcohol|Seasonal|Sweet", "Alcohol infused flavors, Seasonal Favorites, Sweet Complements Savory"],
        ["Sweet Potato Breakfast Pita with Balsamic Honey Onions", "sweet_potato_breakfast_pita", "SwtPotBrkfstPtaBlsmcHnyOn.jpg", "1", "SwtPotBrkfstPtaBlsmcHnyOn.pdf", "A breakfast pita for seasonal menus packed with sweet potato fries, bacon & eggs, and balsmic honey onions.", "Breakfast", "Potatoes", "Seasonal|Sweet", "Seasonal Favorites, Sweet & Savory"],
        ["Hearty Grains & Butternut Squash Soup", "hearty_grains_butternut_squash_soup", "HrtyGrnsBtrntSqshSp.jpg", "1", "HrtyGrnsBtrntSqshSp.pdf", "A creamy, hearty soup to add seasonal flavor to your menu. Pair with crusty bread for lunch, or serve as a dinner starter.", "Appetizer|Side|\nLunch|Dinner", "Grains|Vegetables\n", "Seasonal|Sweet", "Seasonal Favorites, Sweet & Savory"],
        ["Fiesta Salad Bowl", "fiesta_salad_bowl", "FstaSldBwl.jpg", "1", "FstaSldBwl.pdf", "This chopped salad with Chimicurri dressing brings a bold and global flair to lunch or dinner. Top with house-made crispy-fried onions for a signature salad that is sure to please. Perfect for a to-go container or in-house dining.", "Lunch|Dinner", "Vegetables", "Seasonal|Bold", "Seasonal Favorites, Bold & Global Flavors"],
        ["Bourbon and Flame-Roasted Fuji Apple Glazed Turkey", "bourbon_and_flame-roasted_fuji_apple_glazed_turkey", "BourbonFlRstdFujiApTurkey.jpg", "1", "BourbonFlRstdFujiApTurkey.pdf", "The perfect on-trend entrée for any holiday table - serve with Bacon and Brussels Mashed and Simplot Culinary Select™ Haricot Blend de Deux.", "Dinner", "Roasted|Vegetables|Fruit|Potatoes", "Alcohol|Seasonal|Sweet", "Alcohol infused flavors, \nSeasonal Favorites,\nSweet & Savory"],
        ["Parisian Carrots in  Brown Butter Sage Sauce with Redskin Mashed  ", "parisian_carrots_in_brown_butter_sage_sauce_with_redskin_mashed", "PrsnCrtsBrnBtrSgScRdsknMshd.jpg  ", "1", "PrsnCrtsBrnBtrSgScRdsknMshd.pdf", "Elevate a roasted chicken dinner with seasonal sides – Parisian carrots tossed in a brown butter sage sauce and garlic flavored redskin mashed potatoes. ", "Side|Dinner", "\nVegetables|Potatoes", "Seasonal|Sweet", "Seasonal Favorites, Sweet & Savory"],
        ["Thanksgiving Sweet Potato Poutine", "thanksgiving_sweet_potato_poutine", "THnksSwetPotPoutine.jpg", "2", "THnksSwetPotPoutine.pdf", "Give the fastest-growing fry application a seasonal twist with this Sweet Potato-based poutine. ", "Lunch|Appetizer", "Potatoes", "Seasonal|Sweet", "Seasonal Favorites, Sweet & Savory"],
        ["Curried Cauliflower", "curried_cauliflower", "CurriedCauliflower.jpg", "1", "CurriedCauliflower.pdf", "A bold, roasted twist to a classic vegetable favorite. Serve alongside Parisian Carrots in Brown Butter Sage Sauce for a sweet and and savory side. ", "Side|Dinner", "Vegetables", "Seasonal|Bold", "Seasonal Favorites, Bold & Global Flavors"],
        ["Roasted Maple Sweet Potatoes with Chili Flakes & Pumpkin Seeds", "roasted_maple_sweet_potatoes_with_chili_flakes_pumpkin_seeds", "RstdMapleSwtPotWthChiliFlksPmpknSds.jpg", "1", "RstdMapleSwtPotWthChiliFlksPmpknSds.pdf", "A sweet-and-spicy take on a classic seasonal side. ", "Side|Dinner", "Potatoes|Roasted", "Seasonal|Bold|Sweet", "Seasonal Favorites, Bold & Global Flavors, Sweet & Savory"],
        ["Bacon and Brussels Mashed with Stout Gravy ", "bacon_and_brussels_mashed_with_stout_gravy ", "BaconBrusselsMshdStGrvy.jpg", "1", "BaconBrusselsMshdStGrvy.pdf", "Flavor-filled mashed potatoes topped with on-trend stout gravy will add seasonal excitement to any table.   ", "Side|Dinner", "\nVegetables|Potatoes", "Alcohol|Seasonal", "Alcohol infused flavors, \nSeasonal Favorites"],
        ["Spicy Sriracha SIDEWINDERS™ ", "spicy_sriracha_sidewinders", "SpicySrirachaSW.jpg ", "1", "SpicySrirachaSW.pdf", "Get bold with your sides or appetizer menu  - SIDEWINDERS tossed in garlic and red chili flakes are perfect for dipping in a spicy house-made sriracha sauce. ", "Appetizer|Side|\nLunch|Dinner", "Potatoes", "Bold", "Bold & Global Flavors"],
        ["J.R. Buffalos® SIDEWINDERS™ with Pork & Mango Kabobs, Slaw and Mango Chutney", "jr_buffalos_sidewinders_with_pork_mango_kabobs,_slaw_and_mango_chutney", "SWPrkMngKbsSlwMngChtny.jpg", "1", "SWPrkMngKbsSlwMngChtny.pdf", "Sweet, spicy and perfectly dippable. Pair pork mango kabobs and SIDEWINDERS with mango chutney and spicy house-made sriracha to give your lunch or appetizer menu a seasonal twist.", "Appetizer|Side|\nLunch|Dinner", "Potatoes", "Seasonal|Bold|Sweet", "Seasonal Favorites, Bold & Global Flavors, Sweet & Savory"],
        ["Roasted Yukon Gold & Reds and Haricot Vert with Ancho Dust", "roasted_yukon_gold_eds_and_haricot_vert_with_ancho_dust", "RstdYknGldRdsHrcotVrtAnchDst.jpg", "2", "RstdYknGldRdsHrcotVrtAnchDst.pdf", "Roasted Yukon gold & redskin potatoes, and premium extra-fine haricot vert green beans are combined with an ancho chili dusting for a bold elevation to a traditional side of the season. ", "Side|Dinner", "\nVegetables|Potatoes", "Seasonal|Bold", "Seasonal Favorites,\nBold & Global Flavors"],
        ["Roasted Salmon with Redskin Mashed, Tri-Colored Carrots & Pesto", "roasted_salmon_with_redskin_mashed_tricolored_carrots_pesto", "RstdSlmnRdsknMshd.jpg", "1", "RstdSlmnRdsknMshd.pdf", "", "", "Potatoes|Vegetables", "Seasonal", "Seasonal Favorites"],
        ["Braised Pork and Roasted Root Vegetables with Fruit Compote", "braised_pork_and_roasted_root_vegetables_with_fruit_compote", "BrsdPrkRootVeg.jpg", "1", "BrsdPrkRootVeg.pdf", "", "", "Vegetables|Potatoes|Fruit|Roasted", "Seasonal|Sweet", "Seasonal Favorites, Sweet & Savory"],
        ["Roasted Sweet Potato Breakfast Hash", "roasted_sweet_potato_breakfast_hash", "RstdSwtPotBrkHsh.jpg", "2", "RstdSwtPotBrkHsh.pdf", "", "", "Vegetables|Potatoes|Roasted", "Seasonal|Sweet", "Seasonal Favorites, Sweet & Savory"],
        ["Haricot de Deux with Raspberry Honey Vinaigrette", "haricot_de_deux_with_raspberry_honey_vinaigrette", "HrctDeDeuxRspbVin.jpg", "1", "HrctDeDeuxRspbVin.pdf", "", "", "Vegetables|Fruit", "Seasonal|Sweet", "Seasonal Favorites, Sweet & Savory"],
        ["Sweetlings® Pecan Pie", "sweetlings_pecan_pie", "SwtlngsPecanPie.jpg", "1", "SwtlngsPecanPie.pdf", "", "", "Vegetables|Potatoes|Roasted", "Seasonal|Sweet", "Seasonal Favorites, Sweet & Savory"],
        ["Salted Caramel Poutine", "salted_caramel_poutine", "SltdCrmPoutine.jpg", "2", "SltdCrmPoutine.pdf", "", "", "Potatoes|Roasted|Fruit", "Seasonal|Sweet", "Seasonal Favorites, Sweet & Savory"],
        ["Harvest Stew", "harvest_stew", "HarvestStew.jpg", "1", "HarvestStew.pdf", "", "", "Potatoes|Vegetables", "Seasonal", "Seasonal Favorites"],
        ["Buffalo Blues", "buffalo_blues", "BuffaloBlues.jpg", "1", "BuffaloBlues.pdf", "", "", "Potatoes", "Bold", "Bold & Global Flavors"],
        ["Chipotle Breakfast Scramble", "chipotle_breakfast _scramble", "ChiptlBrkScrmbl.jpg", "1", "ChiptlBrkScrmbl.pdf", "", "", "Potatoes", "Seasonal|Bold", "Seasonal Favorites, Bold & Global Flavors"],
        ["Pulled Pork Shepherd's Pie", "pulled_pork_shepherds_pie", "PlldPrkShepPie.jpg", "1", "PlldPrkShepPie.pdf", "", "", "Vegetables|Potatoes|Roasted", "Seasonal|Bold", "Seasonal Favorites, Bold & Global Flavors"],
        ["Morel Waffle Mash Stacker with Shrimp, Scallops & Lobster", "morel_waffle_mash_stacker_with_shrimp_scallops_lobster", "MrlWaffMshStck.jpg", "1", "MrlWaffMshStck.pdf", "", "", "Potatoes", "Seasonal|Alcohol", "Seasonal Favorites, Alcohol-Infused Flavors"],
        ["Oktoberfest Platter", "oktoberfest_platter", "OktbrFstPlttr.jpg", "1", "OktbrFstPlttr.pdf", "", "", "Potatoes", "Seasonal|Alcohol|Bold", "Seasonal Favorites, Bold & Global, Alcohol-Infused Flavors"],
        ["Cream of Potato Soup", "cream_of_potato_soup", "CrmofPotSoup.jpg", "1", "CrmofPotSoup.pdf", "", "", "Potatoes|Vegetables", "Seasonal", "Seasonal Favorites"],
        ["South of the Border Mashed", "south_of_the_border_mashed", "SouthBrdMshd.jpg", "1", "SouthBrdMshd.pdf", "", "", "Vegetables|Potatoes|Roasted", "Bold", "Bold & Global Flavors"],
        ["Mashed Potato Flatbread", "mashed_potato_flatbread", "MshdPotFltbrd.jpg", "2", "MshdPotFltbrd.pdf", "", "", "Potatoes|Vegetables", "Seasonal", "Seasonal Favorites"],
        ["Loafer Pop Trio", "banh_mi_meatball_potato_pops", "LoaferPopTrio.jpg", "1", "LoaferPopTrio.pdf", "", "", "Potatoes|Vegetables", "Seasonal|Bold", "Seasonal Favorites, Bold & Global"]
    ].map(function (row) {
        var record = {
            name: row[0],
            reference: row[1],
            image: row[2],
            columns: +row[3],
            download: row[4],
            description: row[5],
            dayparts: row[6].split('|').map(function (str) { return str.trim() }).filter(function (str) { return !!str; }),
            products: row[7].split('|').map(function (str) { return str.trim() }).filter(function (str) { return !!str; }),
            trends: row[8].split('|').map(function (str) { return str.trim() }).filter(function (str) { return !!str; }),
            trendDescriptions: row[9].split(',').map(function (str) { return str.trim() }).filter(function (str) { return !!str; })
        };
        if (record.trends.length !== record.trendDescriptions.length) {
            console.log('warning: trends and descriptions lengths do not match for ' + record.name);
        }
        return record;
    });
}
