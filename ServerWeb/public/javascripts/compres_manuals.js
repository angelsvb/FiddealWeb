let $ = require('jquery');
require('./utilities/templates');
require('jquery.nicescroll');
let Tools = require('./utilities/tools.js');
let Storage = require('./utilities/storage');
let http_client = require('./utilities/HTTPClient');
let GetManualSalesRequest = require('./requests/GetManualSalesRequest');
let AcceptManualPurchaseRequest = require('./requests/AcceptManualPurchaseRequest');
let RejectManualPurchaseRequest = require('./requests/RejectManualPurchaseRequest');
let Handlebars = require('handlebars');
let validations = require('./utilities/validations');

let manual_purchases_grid_container = undefined;
let manual_purchases_grid = undefined;
let manual_purchase_detail = undefined;

let current_row = undefined;

let purchases = undefined;

window.initializeBefore = function(){
    Tools.commonInitializationBefore();
};

window.hidePurchaseDetail = function(){
    manual_purchases_grid_container.removeClass('column_60');
    manual_purchase_detail.addClass('hidden');

    $('.selected_row').removeClass('selected_row');

    //Modificació mida font
    $('thead th').css("fontSize", "110%");
    $('tbody tr').css("fontSize", "100%");

    //Reduir mida icones
    $('.offer_icon').addClass('offer_icon').removeClass('offer_icon_small');
    $('.payment_icon').addClass('payment_icon').removeClass('payment_icon_small');
};

window.onGridItemSelected = function(column,row,grid){
    row = Math.floor(row/2);

    //Mostrar mida productes
    manual_purchases_grid_container.addClass('column_60');
    manual_purchase_detail.removeClass('hidden');

    //Marcar fila seleccionada
    $('.selected_row').removeClass('selected_row');

    let aux_row = "#manual_purchases_grid tbody tr:nth-child("+((row*2)+1)+")";
    $(aux_row).addClass('selected_row');
    current_row = row;

    //Modificació mida font
    $('thead').css("fontSize", "85%");
    $('tbody').css("fontSize", "80%");

    //Reduir mida icones
    $('.offer_icon').removeClass('offer_icon').addClass('offer_icon_small');
    parsePurchaseData(purchases[row]);
};

window.parsePurchaseData = function(purchase){
    if (purchase.ManualRevisionDate){
        $('#action_accept').parent().addClass('hidden').removeClass('visible');
        $('#action_reject').parent().addClass('hidden').removeClass('visible');
    }

    $('#inputPurchaseID').val(purchase._id);
    $('#inputPurchaseDate').val(Tools.unifyDateFormat(purchase.CreationDate));
    if (purchase.User) $('#inputPurchaseUser').val(purchase.User);
    else $('#inputPurchaseUser').val("");
    $('#inputSubtotal').val(purchase.PurchaseSubtotal);
    $('#inputDiscount').val(purchase.PurchaseDiscount);
    $('#inputTotal').val(purchase.PurchaseTotal);

    if (purchase.PaymentMethod === 1) $('#inputPaymentMethod').val("EFECTIVO");
    else $('#inputPaymentMethod').val("TARJETA");

    if (purchase.IsManual) {
        $('#inputManual').val("SI");
        if (purchase.AcceptedManual) $('#inputAccepted').val("SI");
        else $('#inputAccepted').val("NO");
        $('#inputRegistrationDate').val(Tools.unifyDateFormat(purchase.ManualRegistrationDate));
        $('#inputRevisionDate').val(Tools.unifyDateFormat(purchase.ManualRevisionDate));
        $('#inputDescription').val(purchase.ManualRevisionComments);
    }else{
        $('#inputManual').val("NO");
        $('#inputAccepted').val("N/D");
        $('#inputRegistrationDate').val("N/D");
        $('#inputRevisionDate').val("N/D");
        $('#inputDescription').val("N/D");
    }

    $('#products_grid tbody').empty();
    $.each(purchase.Products,function(){
        addPurchasedProduct(this);
    });
};

window.addPurchasedProduct = function(product){
    if (product){
        let row = '<tr class="grid_row"></tr>';

        let col1 = '<td class="column_25">' + product.product.Name + '</td>';
        let col2 = '<td class="column_10 centered">' + toCurrency(getPrice(product.Product)) + '</td>';
        let col3 = '<td class="column_10 centered"> 0.00 € </td>';
        let col4 = '<td class="column_10 centered">' + product.Amount + '</td>';

        $('#products_grid').append($(row).append(col1,col2,col3,col4).append($('<tr class="spacer_5"> </tr>')));
    }
};

let ticketDialog = undefined;
window.showTicket = function(){
    if (!ticketDialog){
        ticketDialog = Handlebars.parseTemplate("ticket");
        if (ticketDialog) ticketDialog.style.display = "block";
    }else ticketDialog.style.display = "block";
};

window.initializeAfter = function() {
    Handlebars.translatePage("compres_manuals");

    let validTokenExecuted = Tools.validateAuth();
    if (validTokenExecuted){
        if (!Storage.getUser()) showUserMissingDataWarning();
    }
    let name = "< Nombre empresa >";
    if (Storage.getUser()) name = Storage.getUser().Name;
    Tools.commonInitializationAfter({name:name,current:"Gestión de compras manuales"});

    manual_purchases_grid_container = $('#content');
    Tools.setSmallScroll('#content');

    manual_purchases_grid = $('#manual_purchases_grid');

    manual_purchase_detail = $('#manual_purchase_detail');
    Tools.setSmallScroll('#manual_purchase_detail');

    $("#content td").click(function() {
        let column_num = parseInt( $(this).index() ) + 1;
        let row_num = parseInt( $(this).parent().index() )+1;
        onGridItemSelected(column_num,row_num,)
    });

    $('input').prop('disabled', true);
    $('textarea').prop('disabled', true);

    let request = new GetManualSalesRequest();
    http_client.requestGET(request,loadPurchasesData);
};

window.loadPurchasesData = function(request){
    $('#purchases_grid').empty();
    if (Tools.toNumber(request.entity.Count) > 0 ){
        purchases = request.entity.Sales;
        $.each(request.entity.Sales,function(){
            addSale(this);
        });
    }else{
        Tools.showErrorDialog("No se dispone aún de compras registradas manualmente en la aplicación");
    }
};

window.addSale = function(sale){
    if (sale){
        let row = '<tr class="grid_row"></tr>';
        let col1 = '<td class="column_25">' + sale._id + '</td>';
        let col2 = '<td class="column_12 centered">' + sale.CreationDate + '</td>';
        let col3 = '<td class="column_10 centered">' + sale.PurchaseTotal + '</td>';
        let col4 = '<td class="column_10 centered">' + sale.User + '</td>';
        let col5 = '<td class="column_10 centered">' + sale.ManualRegistrationDate + '</td>';

        let col6 = undefined;
        if (sale.ManualRevisionDate) col6 = '<td class="column_15 centered"><img src="../images/ic_circle_green.svg" class="offer_icon"></td>';
        else col6 = '<td class="column_15 centered"><img src="../images/ic_circle_red.svg" class="offer_icon"></td>';

        let col7 = undefined;
        if (sale.AcceptedManual) col7 = '<td class="column_15 centered"><img src="../images/ic_circle_green.svg" class="offer_icon"></td>';
        else col7 = '<td class="column_15 centered"><img src="../images/ic_circle_red.svg" class="offer_icon"></td>';

        $('#purchases_grid').append($(row).append(col1,col2,col3,col4,col5,col6,col7).append($('<tr class="spacer_5"> </tr>')));
    }
};

window.acceptManualPurchase = function(){
    let dialog = Handlebars.parseTemplate('accept_purchase_confirmation');
    if (dialog) Handlebars.show(dialog);
};

window.rejectManualPurchase = function(){
    let dialog = Handlebars.parseTemplate('reject_purchase_comment');
    if (dialog) Handlebars.show(dialog);
};

window.saveNewManualPurchase = function(){
    try{
        let request = new AcceptManualPurchaseRequest();
        request.idSale = purchases[current_row]._id;
        http_client.requestPUT(request,() => {
            let aux = current_row;

            let dialog = $('#accept_purchase_confirmation');
            if (dialog.length) Handlebars.hide(dialog);

            hideProductDetail();
            replaceRow(request.entity.data,aux);
            onGridItemSelected(0,aux,undefined);
        },() => {
            let dialog = $('#accept_purchase_confirmation');
            if (dialog.length) Handlebars.hide(dialog);
        });
    }catch(err){
        let dialog = $('#accept_purchase_confirmation');
        if (dialog.length) Handlebars.hide(dialog);
        throw err;
    }
};

window.saveRejectedPurchase = function(){
    try{
        let request = new RejectManualPurchaseRequest();
        request.addQueryParam(RejectManualPurchaseRequest.COMMENT,'inputComment',validations.notEmpty,'inputComment_error');
        request.idSale = purchase[current_row]._id;
        http_client.requestDELETE(request,() => {
            let aux = current_row;

            let dialog = $('#reject_purchase_comment');
            if (dialog.length) Handlebars.hide(dialog);

            hideProductDetail();
            replaceRow(request.entity.data,aux);
            onGridItemSelected(0,aux,undefined);
        },() => {
            let dialog = $('#reject_purchase_comment');
            if (dialog.length) Handlebars.hide(dialog);
        });
    }catch(err){
        let dialog = $('#reject_purchase_comment');
        if (dialog.length) Handlebars.hide(dialog);
        throw err;
    }
};

window.replaceRow = function(sale,rowIndex){
    let col1 = '<td class="column_25">' + sale._id + '</td>';
    let col2 = '<td class="column_12 centered">' + sale.CreationDate + '</td>';
    let col3 = '<td class="column_10 centered">' + sale.PurchaseTotal + '</td>';
    let col4 = '<td class="column_10 centered">' + sale.User + '</td>';
    let col5 = '<td class="column_10 centered">' + sale.ManualRegistrationDate + '</td>';

    let col6 = undefined;
    if (sale.ManualRevisionDate) col6 = '<td class="column_15 centered"><img src="../images/ic_circle_green.svg" class="offer_icon"></td>';
    else col6 = '<td class="column_15 centered"><img src="../images/ic_circle_red.svg" class="offer_icon"></td>';

    let col7 = undefined;
    if (sale.AcceptedManual) col7 = '<td class="column_15 centered"><img src="../images/ic_circle_green.svg" class="offer_icon"></td>';
    else col7 = '<td class="column_15 centered"><img src="../images/ic_circle_red.svg" class="offer_icon"></td>';

    $('#purchases_grid tr:nth-child('+((rowIndex*2)+1)+')').html(col1+col2,col3+col4+col5+col6+col7);
    purchases[rowIndex] = sale;
};

window.toCurrency = function(value){
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