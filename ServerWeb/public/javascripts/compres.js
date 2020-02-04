require('./utilities/templates');
require('jquery.nicescroll');
let http_client = require('./utilities/HTTPClient');
let $ = require('jquery');
let Handlebars = require('handlebars');
let Tools = require('./utilities/tools.js');
let Storage = require('./utilities/storage');
let GetSalesRequest = require('./requests/GetSalesRequest');
let enums = require('./utilities/enums');
let Texts = require('./utilities/texts');

let purchases_grid_container = undefined;
let purchases_grid = undefined;
let purchase_detail = undefined;

let current_row = undefined;

var purchases = undefined;

window.initializeBefore = function(){
    Tools.commonInitializationBefore();
};

window.onGridItemSelected = function(column,row,grid) {
    //Mostrar mida productes
    purchases_grid_container.addClass('column_60');
    purchase_detail.removeClass('hidden');

    //Marcar fila seleccionada
    $('.selected_row').removeClass('selected_row');

    let old_row = "#purchases_grid tbody tr:nth-child(" + row.toString() + ")";
    $(old_row).addClass('selected_row');
    current_row = row;

    //Modificació mida font
    $('thead').css("font-size", "0.7em");
    $('tbody').css("font-size", "0.7em");

    //Reduir mida icones
    $('.offer_icon').removeClass('offer_icon').addClass('offer_icon_small');
    $('.payment_icon').removeClass('payment_icon').addClass('payment_icon_small');

    parsePurchaseData(purchases[Math.floor(row/2)]);
};

window.parsePurchaseData = function(purchase){
    $('#inputPurchaseID').val(purchase._id);
    $('#inputPurchaseDate').val(Tools.unifyDateFormat(purchase.CreationDate));
    if (purchase.User) $('#inputPurchaseUser').val(purchase.User);
    else $('#inputPurchaseUser').val("N/D");
    $('#inputSubtotal').val(toCurrency(purchase.PurchaseSubtotal));
    $('#inputDiscount').val(toCurrency(purchase.PurchaseDiscount));
    $('#inputTotal').val(toCurrency(purchase.PurchaseTotal));

    if (purchase.PaymentMethod === 1) $('#inputPaymentMethod').val(Texts.payment_method_cash);
    else $('#inputPaymentMethod').val(Texts.payment_method_card);

    if (purchase.IsManual) {
        $('#inputManual').val(Texts.yes);
        if (purchase.AcceptedManual) $('#inputAccepted').val(Texts.yes);
        else $('#inputAccepted').val(Texts.no);
        $('#inputRegistrationDate').val(Tools.unifyDateFormat(purchase.ManualRegistrationDate));
        $('#inputRevisionDate').val(Tools.unifyDateFormat(purchase.ManualRevisionDate));
    }else{
        $('#inputManual').val(Texts.no);
        $('#inputAccepted').val(Texts.not_defined);
        $('#inputRegistrationDate').val(Texts.not_defined);
        $('#inputRevisionDate').val(Texts.not_defined);
    }

    $('#products_grid tbody').empty();
    $.each(purchase.Products,function(){
        addPurchasedProduct(this);
    });
};

window.addPurchasedProduct = function(product){
    if (product){
        let row = '<tr class="grid_row"></tr>';

        let col1 = undefined;
        if (product.Product.Name) col1 = '<td class="column_25">' + product.Product.Name + '</td>';
        else col1 = '<td class="column_40">' + product.Product + '</td>';

        let col2 = '<td class="column_20 centered">' + toCurrency(product.Price) + '</td>';
        let col3 = '<td class="column_20 centered"> 0.00 € </td>';
        let col4 = '<td class="column_20 centered">' + product.Amount + '</td>';

        $('#products_grid > tbody').append($(row).append(col1,col2,col3,col4));
        $('#products_grid > tbody').append($('<tr class="spacer_5"> </tr>'));
    }
};

window.hidePurchaseDetail = function(){
    purchases_grid_container.removeClass('column_60');
    purchase_detail.addClass('hidden');

    $('.selected_row').removeClass('selected_row');

    //Modificació mida font
    $('thead th').css("font-size", "110%");
    $('tbody tr').css("font-size", "100%");

    //Reduir mida icones
    $('.offer_icon').addClass('offer_icon').removeClass('offer_icon_small');
    $('.payment_icon').addClass('payment_icon').removeClass('payment_icon_small');
};

window.initializeAfter = function() {
    Handlebars.translatePage("compres");

    let validTokenExecuted = Tools.validateAuth();
    if (validTokenExecuted){
        if (!Storage.getUser()) showUserMissingDataWarning();
    }
    let name = Texts.business_name_placeholder;
    if (Storage.getUser()) name = Storage.getUser().Name;
    Tools.commonInitializationAfter({name:name,current: Texts.option_registro_compras});

    purchases_grid_container = $('#content');
    Tools.setSmallScroll('#content');
    purchases_grid = $('#purchases_grid');
    purchase_detail = $('#purchase_detail');
    Tools.setSmallScroll('#purchase_detail');
    Tools.setSmallScroll('#purchase_grid');

    $("#content td").click(function() {
        let column_num = parseInt( $(this).index() ) + 1;
        let row_num = parseInt( $(this).parent().index() )+1;
        onGridItemSelected(column_num,row_num)
    });

    $('input').prop('disabled', true);

    let request = new GetSalesRequest();
    http_client.requestGET(request,loadPurchasesData);
};

window.loadPurchasesData = function(request){
    $('#purchases_grid tbody').empty();

    if (Tools.toNumber(request.entity.Count) > 0 ){
        purchases = request.entity.Sales;
        $.each(request.entity.Sales,function(){
            addSale(this);
        });
    }else{
        Tools.showErrorDialog(texts.empty_purchases_alert);
    }
};

window.addSale = function(sale){
    if (sale){
        let row = '<tr class="grid_row"></tr>';
        let col1 = '<td class="column_25">' + sale._id + '</td>';
        let col2 = '<td class="column_10 centered">' + Tools.unifyDateFormat(sale.CreationDate) + '</td>';
        let col3 = '<td class="column_10 centered">' + toCurrency(sale.PurchaseSubtotal) + '</td>';
        let col4 = '<td class="column_10 centered">' + toCurrency(sale.PurchaseDiscount) + '</td>';
        let col5 = '<td class="column_10 centered">' + toCurrency(sale.PurchaseTotal) + '</td>';

        let col6 = undefined;
        if (sale.User) col6 = '<td class="column_10 centered">' + sale.User + '</td>';
        else col6 = '<td class="column_10 centered"> N/D </td>';

        let col7 = undefined;
        if (sale.PaymentMethod === 1) col7 = '<td class="column_10 centered"><img src="../images/ic_cash.svg" class="offer_icon"></td>';
        else col7 = '<td class="column_10 centered"><img src="../images/ic_credit_card.svg" class="offer_icon"></td>';

        let col8 = undefined;
        if (sale.IsManual) col8 = '<td class="column_12 centered"><img src="../images/ic_circle_green.svg" class="offer_icon"></td>';
        else col8 = '<td class="column_12 centered"><img src="../images/ic_circle_red.svg" class="offer_icon"></td>';

        $('#purchases_grid tbody').append($(row).append(col1,col2,col3,col4,col5,col7,col6,col8));
        $('#purchases_grid tbody').append($('<tr class="spacer_5"> </tr>'));
        $("#content td").click(function() {
            let column_num = parseInt( $(this).index() ) + 1;
            let row_num = parseInt( $(this).parent().index() )+1;
            onGridItemSelected(column_num,row_num)
        });
    }
};


window.toCurrency = function(value){
    if (!value) return "0.00 €";
    return value.toFixed(2) + " €"
};

window.getPrice = function(product){
    if (Tools.toNumber(product.StockState) === enums.STOCK_STATE.OUTLET) {
        return product.OutletPrice;
    }
    else {
        return product.Price;
    }
};