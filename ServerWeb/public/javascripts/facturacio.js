let $ = require('jquery');
require('./utilities/templates');
require('jquery.nicescroll');
let Tools = require('./utilities/tools.js');
let Storage = require('./utilities/storage');
let http_client = require('./utilities/HTTPClient');
let GetProductRequest = require('./requests/GetProductRequest');
let GetTodaySalesRequest = require('./requests/GetTodaySalesRequest');
let GetUserRequest = require('./requests/GetUserRequest');
let GetFidelizationDiscountRequest = require('./requests/GetFidelizationDiscountRequest');
let SavePurchaseRequest = require('./requests/SavePurchaseRequest');
let RequestPrint = require('./requests/RequestPrint');
let texts = require('./utilities/texts');
let enums = require('./utilities/enums');
let Handlebars = require('handlebars');
let validations = require('./utilities/validations');

var currentPurchase = undefined;

window.initializeBefore = function(){
    Tools.commonInitializationBefore();
};

window.initializeAfter = function() {
    Handlebars.translatePage("facturacio");

    let validTokenExecuted = Tools.validateAuth();
    if (validTokenExecuted)
        if (!Storage.getUser()) showUserMissingDataWarning();
    let name = texts.business_name_placeholder;
    if (Storage.getUser()) name = Storage.getUser().Name;
    Tools.commonInitializationAfter({name:name,current: texts.option_facturacion});

    Tools.setScroll("#column_buttons");
    Tools.setScroll("#grid_container");
    Tools.setScroll("#grid_header");

    let requestCurrentSales = new GetTodaySalesRequest();
    http_client.requestGET(requestCurrentSales,initData);

    currentPurchase = Storage.getCurrentPurchase();
    if (currentPurchase){
        currentPurchase.products.forEach(function(item) {
            addVisualProduct(item);
        });
    }

    $('#codebar').focus();
    document.addEventListener("keypress", function(e) {
        if ((e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") || (e.target.tagName === "INPUT" && e.target.id === "codebar") || $(e.target).prop('readonly')  || $(e.target).prop('disabled')) {
            if (e.keyCode === 13){
                currentCode = currentCode.replace(/'/g,'-').replace(/\?/g, '_');
                if (!currentCode) return;
                let priceDialog = $('#get_product_price');
                let stockDialog = $('#get_product_stock');
                let manualDialog = $('#manual_product_entry');
                if (priceDialog && priceDialog.is(':visible')){
                    $('#inputCheckPrice').val(currentCode);
                }else if (stockDialog && stockDialog.is(':visible')){
                    $('#inputCheckStock').val(currentCode);
                }
                else if (manualDialog && manualDialog.is(':visible')){
                    $('#inputManualEntry').val(currentCode);
                }
                else  if (!gettingInvoice) {
                    let request = new GetProductRequest();
                    request.productId = currentCode;
                    http_client.requestGET(request,() => { addProduct(request.entity.product); }, () => {
                        Tools.showErrorDialog(texts.product_not_found);
                    });
                }
                currentCode = "";
            }else{
                currentCode = currentCode + e.key;
            }
            e.preventDefault();
            $('#codebar').focus();
        }
    });
};

window.checkProductPrice = function(){
    let value = $('#inputCheckPrice').val();
    let validation = validations.notEmpty(value);
    if (validation.resultOK){
        Tools.disableInputError('#inputCheckPrice_error');
        let request = new GetProductRequest();
        request.productId = value;
        http_client.requestGET(request,(req, data) => {
            $('#price_productName').val(data.Entity.product.Name);
            $('#price_productPrice').val(toCurrency(data.Entity.product.Price));
            $('#price_productRealPrice').val(toCurrency(getPrice(data.Entity.product)));
        }, () => {
            Tools.showErrorDialog(texts.product_not_found);
        });
    }else{
        Tools.setInputError('#inputCheckPrice_error',texts.validation_empty_string);
    }
};

window.checkProductStock = function(){
    let value = $('#inputCheckStock').val();
    let validation = validations.notEmpty(value);
    if (validation.resultOK){
        Tools.disableInputError('#inputCheckStock_error');
        let request = new GetProductRequest();
        request.productId = value;
        http_client.requestGET(request,(req, data) => {
            $('#stock_productName').val(data.Entity.product.Name);
            $('#stock_productStockState').val(enums.getStockStateString(data.Entity.product.StockState, data.Entity.product.ExpectedArrival));
            $('#stock_productStock').val(data.Entity.product.Stock);
        }, () => {
            Tools.showErrorDialog(texts.product_not_found);
        });
    }else{
        Tools.setInputError('#inputCheckStock_error',texts.validation_empty_string);
    }
};

window.addProduct = function(product){
    if (product){
        if (!currentPurchase){
            $('#purchases_grid > tbody').empty();

            currentPurchase = {
                productCount : 0,
                subtotal : 0,
                products : []
            };
            currentPurchase.productCount = 1;
            currentPurchase.subtotal = getPrice(product);
            currentPurchase.products.push(product);
        }else{
            currentPurchase.products.push(product);
            currentPurchase.subtotal += getPrice(product);
            currentPurchase.productCount += 1;
        }

        Storage.setCurrentPurchase(currentPurchase);
        addVisualProduct(product);
    }
};

window.addVisualProduct = function(product){
    $('#info_number').val(currentPurchase.productCount);
    $('#info_subtotal').val(currentPurchase.subtotal.toFixed(2) + " €");

    let row = '<tr class="grid_row"></tr>';
    let col1 = '<td class="column_45">' + product.Name + '</td>';
    let col2 = '<td class="column_25 centered">' + toCurrency(product.Price) + '</td>';
    let col3 = '<td class="column_25 centered">' + toCurrency(getPrice(product)) + '</td>';
    //let col4 = '<td class="gap"><img class="remove_product" src="../images/ic_action_delete.svg"> </td>';
    let col4 = '<td class="column_5"><img class="remove_product" src="../images/ic_action_delete.svg"></td>';

    let jquery_row = $(row).append(col1,col2,col3,col4);
    jquery_row.find('.remove_product').click(function(){
        let row_num = parseInt($(this).parent().parent().index())+1;
        row_num = Math.floor(row_num/2);
        deleteProduct(row_num);
    });
    $('#purchases_grid').append(jquery_row).append($('<tr class="spacer_5"> </tr>'));
    $("#grid_container").getNiceScroll().resize();

    $('#buttonInvoice').prop('disabled',false);
    $('#buttonCancel').prop('disabled',false);
}

window.deleteProduct = function(row){
    if (currentPurchase){
        currentPurchase.productCount -= 1;
        currentPurchase.subtotal -= getPrice(currentPurchase.products[row]);
        currentPurchase.products.splice(row,1);

        Storage.setCurrentPurchase(currentPurchase);

        $('#purchases_grid tr:nth-child('+((row*2)+1)+')').remove();
        $('#purchases_grid tr:nth-child('+((row*2)+1)+')').remove();


        $('#info_subtotal').val(toCurrency(currentPurchase.subtotal));
        $('#info_number').val(currentPurchase.productCount);
        if (currentPurchase.productCount === 0){
            cancelTicket();
        }
        $("#grid_container").getNiceScroll().resize();
    }
};

window.toCurrency = function(value){
    if (!value) return "0.00 €";
    return value.toFixed(2) + " €"
};

window.toPercentage = function(value){
    if (!value) return "0.00 %";
    return value.toFixed(2) + " %"
};

window.getPrice = function(product){
    if (Tools.toNumber(product.StockState) === enums.STOCK_STATE.OUTLET) {
        return product.OutletPrice;
    }
    else {
        return product.Price;
    }
};

var currentCode = "";

window.cancelTicket = function(){
    currentPurchase = undefined;
    Storage.setCurrentPurchase(undefined);
    gettingInvoice = false;
    $('#purchases_grid').empty();
    $('#info_number').val("0");
    $('#info_subtotal').val("0.00 €");
    $('#buttonInvoice').prop('disabled',true);
    $('#buttonCancel').prop('disabled',true);

    $("#grid_container").getNiceScroll().resize();
};

window.checkPrice = function(){
    let dialog = Handlebars.parseTemplate(Handlebars.templateKeys.get_product_price,undefined,undefined,false);
    if (dialog) Handlebars.show(dialog);
};

window.checkStock = function(){
    let dialog = Handlebars.parseTemplate(Handlebars.templateKeys.get_product_stock,undefined,undefined,false);
    if (dialog) Handlebars.show(dialog);
};

window.manualProductEntry = function(){
    let dialog = Handlebars.parseTemplate(Handlebars.templateKeys.manual_product_entry,undefined,undefined,false);
    if (dialog) Handlebars.show(dialog);
};

window.tryManualentry =function(){
    let value = $('#inputManualEntry').val();
    let validation = validations.notEmpty(value);
    if (validation.resultOK){
        Tools.disableInputError('#inputManualEntry_error');
        let request = new GetProductRequest();
        request.productId = value;
        http_client.requestGET(request,() => {
            addProduct(request.entity.product);
            let dialog = $('#'+Handlebars.templateKeys.manual_product_entry);
            if (dialog) Handlebars.hide(dialog);
        }, () => {
            Tools.showErrorDialog(texts.product_not_found);
            let dialog = $('#' + Handlebars.templateKeys.manual_product_entry);
            if (dialog) Handlebars.hide(dialog);
        });
    }else{
        Tools.setInputError('#inputManualEntry_error',texts.validation_empty_string);
    }
};

window.initData = function(request){
    let totalPurchases = request.entity.Sales.length;
    let withUserPurchases = request.entity.Sales.filter(item => item.User).length;
    let totalIncome = 0;
    request.entity.Sales.forEach(function(elem){
       totalIncome += elem.PurchaseTotal;
    });
    let avrgTicket = ((totalIncome*1.0) / totalPurchases);

    $('#salesNumber').val(totalPurchases);
    $('#fidelizationPercentage').val(toPercentage(((withUserPurchases*1.0)/totalPurchases)*100));
    $('#averageTicket').val(toCurrency(avrgTicket));
    $('#totalValue').val(toCurrency(totalIncome));
};

var gettingInvoice = false;

window.getInvoice = function(){
    gettingInvoice = true;
    currentPurchase.user = undefined;
    currentPurchase.discount = undefined;
    let dialog = Handlebars.parseTemplate(Handlebars.templateKeys.dialog_has_card);
    if (dialog) Handlebars.show(dialog);
};

window.invoiceWitCard = function(){
    let dialog_card = $('#'+Handlebars.templateKeys.dialog_has_card);
    if (dialog_card.length) Handlebars.hide(dialog_card);

    let dialog = Handlebars.parseTemplate(Handlebars.templateKeys.dialog_user_card);
    if (dialog) Handlebars.show(dialog);
};

window.invoiceWithoutCard = function(){
    let dialog_card = $('#'+Handlebars.templateKeys.dialog_has_card);
    if (dialog_card.length) Handlebars.hide(dialog_card);

    currentPurchase.total = currentPurchase.subtotal;

    let dialog_card_data = $('#'+ Handlebars.templateKeys.dialog_user_card);
    if (dialog_card_data.length) Handlebars.hide(dialog_card_data);

    let dialog = Handlebars.parseTemplate(Handlebars.templateKeys.dialog_payment_method);
    if (dialog) Handlebars.show(dialog);
};

window.invoiceWithCard = function(){
    let dialog_card = $('#' + Handlebars.templateKeys.dialog_has_card);
    if (dialog_card.length) Handlebars.hide(dialog_card);

    let dialog = Handlebars.parseTemplate(Handlebars.templateKeys.dialog_user_card);
    if (dialog) Handlebars.show(dialog);
};

window.continueInvoiceWithCard = function(){
    if ($('#userName').val()){
        let dialog = $('#'+Handlebars.templateKeys.dialog_user_card);
        if (dialog.length) Handlebars.hide(dialog);

        let requestDiscount = new GetFidelizationDiscountRequest();
        requestDiscount.user = currentPurchase.user._id;
        http_client.requestGET(requestDiscount,() => {
            if (requestDiscount.entity.Discount){
                currentPurchase.discountObject = requestDiscount.entity.Discount;
                let dialog = Handlebars.parseTemplate(Handlebars.templateKeys.dialog_use_discount,{discount:toCurrency(requestDiscount.entity.Discount.Discount)});
                if (dialog) Handlebars.show(dialog);
            }else{
                currentPurchase.discount = 0;
                currentPurchase.total = currentPurchase.subtotal;
                let dialog = Handlebars.parseTemplate(Handlebars.templateKeys.dialog_payment_method);
                if (dialog) Handlebars.show(dialog);
            }
        });
    }else{
        let request = new GetUserRequest();
        request.addQueryParam(GetUserRequest.USER,"inputUserCard",validations.notEmpty,"inputUserCard_error");
        http_client.requestGET(request,() => {
            if (request.entity.User){
                $('#userName').val(request.entity.User.Name+" "+request.entity.User.Surname);
                $("#userCard_continue").html(texts.realizar_cobro);
                currentPurchase.user = request.entity.User;
            }else Tools.showErrorDialog(texts.user_not_found)
        },() => {Tools.showErrorDialog(texts.user_not_found)})
    }
};

window.invoiceWithoutDiscount = function(){
    let aux = $('#'+Handlebars.templateKeys.dialog_use_discount);
    if (aux.length) Handlebars.hide(aux);

    currentPurchase.total = currentPurchase.subtotal;
    currentPurchase.discountObject = undefined;

    let dialog = Handlebars.parseTemplate(Handlebars.templateKeys.dialog_payment_method);
    if (dialog) Handlebars.show(dialog);
};

window.invoiceUseDiscount = function(){
    currentPurchase.total = currentPurchase.subtotal - currentPurchase.discountObject.Discount;
    currentPurchase.discount = currentPurchase.discountObject.Discount;

    let aux = $('#dialog_use_discount');
    if (aux.length) Handlebars.hide(aux);

    let dialog = Handlebars.parseTemplate(Handlebars.templateKeys.dialog_payment_method);
    if (dialog) Handlebars.show(dialog);
};

window.invoiceCash = function(){
    let dialog_method = $('#dialog_payment_method');
    if (dialog_method.length) Handlebars.hide(dialog_method);

    currentPurchase.cash = true;
    let dialog = Handlebars.parseTemplate(Handlebars.templateKeys.dialog_given_cash,{total:toCurrency(currentPurchase.total)});
    if (dialog) Handlebars.show(dialog);
};

window.invoiceCreditCard = function(){
    let dialog_method = $('#'+Handlebars.templateKeys.dialog_payment_method);
    if (dialog_method.length) Handlebars.hide(dialog_method);

    currentPurchase.cash = false;
    finishInvoice();
};

window.cancelUserCard = function(){
    $('#' + Handlebars.templateKeys.dialog_user_card).addClass('hidden').removeClass('visible');
    gettingInvoice = false;
};

window.cancelInvoiceCash = function(){
    $('#' + Handlebars.templateKeys.dialog_given_cash).addClass('hidden').removeClass('visible');
    gettingInvoice = false;
};

window.finishCashInvoice = function(){
    if (Tools.toDecimal($('#inputGivenCash').val()) >= currentPurchase.total){
        let dialog = $('#' + Handlebars.templateKeys.dialog_given_cash);
        if (dialog) Handlebars.hide(dialog);
        currentPurchase.change = Tools.toDecimal($('#inputGivenCash').val()) - currentPurchase.total;
        finishInvoice();
    }else{
        Tools.setInputError('#inputGivenCash_error',texts.validation_too_small);
    }
};

window.cancelInvoiceInfo = function(){
    $('#' + Handlebars.templateKeys.dialog_sale_info).addClass('hidden').removeClass('visible');
    gettingInvoice = false;
};

window.finishInvoice = function(){
    let userName = texts.not_defined;
    let change = texts.not_defined;
    if (currentPurchase.cash) change = toCurrency(currentPurchase.change);
    if (currentPurchase.user) userName = currentPurchase.user.Name + " " + currentPurchase.user.Surname;
    let dialog = Handlebars.parseTemplate(Handlebars.templateKeys.dialog_sale_info,{
        subtotal : toCurrency(currentPurchase.subtotal),
        discount : toCurrency(currentPurchase.discount),
        total : toCurrency(currentPurchase.total),
        user : userName,
        change : change
    });
    if (dialog) Handlebars.show(dialog);
};

window.saveSale = function(){
    let request = new SavePurchaseRequest();
    if (currentPurchase.discountObject){
        request.Subtotal = currentPurchase.subtotal;
        request.Total = currentPurchase.total;
        request.Discount = currentPurchase.discount;
        request.Fidelization = currentPurchase.discountObject._id;
        request.User = currentPurchase.discountObject.User;
    }else{
        request.Subtotal = currentPurchase.subtotal;
        request.Total = currentPurchase.subtotal;
        request.Discount = 0;
        if (currentPurchase.user) request.User = currentPurchase.user._id;
    }

    if (currentPurchase.cash) request.PaymentMethod = 1;
    else request.PaymentMethod = 2;
    request.Business = Storage.getUser()._id;

    request.Products = toPurchasedProducts(currentPurchase.products);

    http_client.requestPOST(request,(request) => {
        let aux = $('#'+Handlebars.templateKeys.dialog_sale_info);
        if (aux.length) Handlebars.hide(aux);

        let requestPrint = new RequestPrint();

        requestPrint.CIF = Storage.getUser().CIF;
        requestPrint.Name = Storage.getUser().Name;
        requestPrint.Address = Storage.getUser().Address;
        requestPrint.Provincia = Storage.getUser().Provincia;

        if (currentPurchase.user) requestPrint.UserID = currentPurchase.user._id;
        requestPrint.TotalDiscount = 0.00;
        requestPrint.ObtainedDiscount = 0.00;
        requestPrint.ExpirationDate = "00/00/0000";

        requestPrint.Subtotal = currentPurchase.subtotal;
        requestPrint.Discount = currentPurchase.discount;
        requestPrint.Total = currentPurchase.total;

        requestPrint.PurchaseID = request.entity.Sale._id;
        requestPrint.PurchaseDate = Tools.unifyDateFormat(request.entity.Sale.CreationDate);

        requestPrint.JSONProducts = JSON.stringify(toPrintableProducts(currentPurchase.products));

        currentPurchase = undefined;

        http_client.requestPOST(requestPrint);

        let requestCurrentSales = new GetTodaySalesRequest();
        http_client.requestGET(requestCurrentSales,initData);
        cancelTicket();
    });
};

window.toPrintableProducts = function(products){
    let oRes = [];
    products.forEach(function(item){
        let obj = oRes.find( it => it.Name === item.Name);
        if (obj) obj.Amount += 1;
        else {
            obj = {
                Amount : 1,
                Price : getPrice(item),
                Name : item.Name
            };
            oRes.push(obj);
        }
    });
    return oRes;
};

window.toPurchasedProducts = function(products){
    let oRes = [];
    products.forEach(function(item){
        let obj = oRes.find( it => it.Product === item._id);
        if (obj) obj.Amount += 1;
        else {
            obj = {
                Amount : 1,
                Price : getPrice(item),
                Product : item._id
            };
            oRes.push(obj);
        }
    });
    return oRes;
};