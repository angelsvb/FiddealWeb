require('./utilities/templates');
let moment = require('moment');
require('jquery.nicescroll');
let $ = require('jquery');

let offers_grid_container = undefined;
let offers_grid = undefined;
let offer_detail = undefined;

let column_name = 1;
let column_reference = 2;
let column_subcategory = 3;
let column_stock = 4;
let column_offer = 5;
let column_visible = 6;
let column_update = 7;

let current_row = undefined;

window.initializeBefore = function(){
};

window.onGridItemSelected = function(column,row,grid){
    if (!current_row && current_row !== 0){
        //Mostrar mida productes
        offers_grid_container.addClass('column_60');
        offer_detail.removeClass('hidden');

        //Marcar fila seleccionada
        let old_row = "#offers_grid tbody tr:nth-child("+row.toString()+")";
        $(old_row).addClass('selected_row');
        current_row = row;

        //Modificació mida font
        $('thead').css("fontSize", "85%");
        $('tbody').css("fontSize", "80%");

        //Reduir mida icones
        $('.offer_icon').removeClass('offer_icon').addClass('offer_icon_small');
    }else{

    }
};

window.initializeAfter = function() {
    Handlebars.translatePage("ofertes");

    $("body").niceScroll({
        cursorcolor: "#454545",
        cursorwidth: "12px",
        cursorborder: "0px"
    });

    offers_grid_container = $('#content');
    offers_grid = $('#offers_grid');
    offers_grid_container.niceScroll({
        cursorcolor: "#454545",
        cursorwidth: "8px",
        cursorborder: "0px"
    });
    offer_detail = $('#offer_detail');
    offer_detail.niceScroll({
        cursorcolor:"#454545",
        cursorwidth:"8px",
        cursorborder: "0px"
    });

    $("#content td").click(function() {
        let column_num = parseInt( $(this).index() ) + 1;
        let row_num = parseInt( $(this).parent().index() )+1;
        onGridItemSelected(column_num,row_num,)
    });

   $('input').prop('disabled', true);
   $('textarea').prop('value','Aprovecha ahora nuestros descuentos en todo nuestro catálogo a lo largo del período de rebajas. Podra obtener descuentos de hasta el 70% en mas de 50 de nuestros productos.');
   $('textarea').prop('disabled', true);

    document.getElementById("inputValidSince").valueAsDate = moment("02/07/2018","DD/MM/YYYY").toDate();
    document.getElementById("inputExpirationDate").valueAsDate = moment("15/08/2018","DD/MM/YYYY").toDate();
    document.getElementById("inputCreationDate").valueAsDate = moment("15/06/2018","DD/MM/YYYY").toDate();
    document.getElementById("inputUpdateDate").valueAsDate = moment("15/06/2018","DD/MM/YYYY").toDate();
};