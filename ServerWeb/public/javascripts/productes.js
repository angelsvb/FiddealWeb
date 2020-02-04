require('./utilities/templates');
require('jquery.nicescroll');
let http_client = require('./utilities/HTTPClient');
let $ = require('jquery');
let Handlebars = require('handlebars');
let Tools = require('./utilities/tools');
let Storage = require('./utilities/storage');
let validations = require('./utilities/validations');
let texts = require('./utilities/texts');

let GetProductsRequest = require('./requests/GetProductsRequest');
let DeleteProductRequest = require('./requests/DeleteProductRequest');
let CreateProductRequest = require('./requests/CreateProductRequest');
let UpdateProductRequest = require('./requests/UpdateProductRequest');

let products_grid_container = undefined;
let products_grid = undefined;
let product_detail = undefined;

let column_name = 1;
let column_reference = 2;
let column_subcategory = 3;
let column_price = 4;
let column_stock = 5;
let column_offer = 6;
let column_visible = 7;
let column_update = 8;

var current_row = undefined;
var products = undefined;

window.initializeBefore = function(){
    Tools.commonInitializationBefore();
};

window.onGridItemSelected = function(column,row,grid){
    row = Math.floor(row/2);
    if (row !== current_row){
        $('.invalid-tooltip').hide();

        //Mostrar mida productes
        products_grid_container.addClass('column_60');
        product_detail.removeClass('hidden');

        //Marcar fila seleccionada
        $('.selected_row').removeClass('selected_row');
        let aux_row = undefined;
        if (row === 0){
            aux_row = "#products_grid tbody tr:nth-child(1)";
        }else if (!isNaN(row)) aux_row = "#products_grid tbody tr:nth-child("+((row*2)+1).toString()+")";

        if (aux_row){
            $(aux_row).addClass('selected_row');
            current_row = row;
        }

        //Modificació mida font
        $('thead th').css("fontSize", "85%");
        $('tbody tr').css("fontSize", "75%");

        //Amagar columna "subcategoria"
        let column_id = "#products_grid tbody tr td:nth-child("+column_subcategory.toString()+")";
        let header_id = "#products_grid thead tr th:nth-child("+column_subcategory.toString()+")";
        $(header_id).hide();
        $(column_id).hide();

        //Ampliar mida oferta
        let header_offer =  "#products_grid tbody tr td:nth-child("+column_offer.toString()+")";
        let offer_c = "#products_grid thead tr th:nth-child("+column_offer.toString()+")";
        $(header_offer).removeClass('column_10').addClass('column_13');
        $(offer_c).removeClass('column_10').addClass('column_13');

        //Ampliar mida referencia
        let header_reference = "#products_grid tbody tr td:nth-child("+column_reference.toString()+")";
        let reference = "#products_grid thead tr th:nth-child("+column_reference.toString()+")";
        $(header_reference).removeClass('column_15').addClass('column_20');
        $(reference).removeClass('column_15').addClass('column_20');

        //Ampliar mida actualització
        let header_update = "#products_grid tbody tr td:nth-child("+column_update.toString()+")";
        let update = "#products_grid thead tr th:nth-child("+column_update.toString()+")";
        $(header_update).addClass('column_15').removeClass('column_10');
        $(update).addClass('column_15').removeClass('column_10');

        //Reduir mida icones
        $('.offer_icon').removeClass('offer_icon').addClass('offer_icon_small');

        //Parseig dades producte
        if (!isNaN(row)) setProductDetail(products[row]);

        $('#main_button').removeClass('clicked');
        disableEditableInputs();
        Tools.switchEditMode(false);
    }
};

window.initializeAfter = function() {
    Handlebars.translatePage("productes");

    let validTokenExecuted = Tools.validateAuth();
    if (validTokenExecuted){
        if (!Storage.getUser()) showUserMissingDataWarning();
        else{
            innerInitialize();
        }
    }else innerInitialize();
};

window.innerInitialize = function(){
    products_grid_container = $('#content');
    products_grid = $('#products_grid');
    Tools.setSmallScroll('#content');
    product_detail = $('#product_detail');
    Tools.setSmallScroll('#product_detail');

    $("#content td").click(function() {
        let column_num = parseInt( $(this).index() ) + 1;
        let row_num = parseInt( $(this).parent().index() )+1;
        onGridItemSelected(column_num,row_num,)
    });

    let name = texts.business_name_placeholder;
    if (Storage.getUser()) name = Storage.getUser().Name;
    Tools.commonInitializationAfter({name:name,current: texts.option_productos});

    setCategoriesCombos('#inputCategory','#inputSubcategory',Storage.getUser().Categories);
    setProductsData();
    disableEditableInputs();
};

window.disableEditableInputs = function(){
    $('input.editable').prop('disabled',true);
    $('textarea.editable').prop('disabled',true);
    $('select.editable').prop('disabled',true);
    $('#inputSubcategory').prop('disabled',true);
    $('#inputExpectedArrival').prop('disabled', true);
};

window.enableEditableInputs = function(newProduct){
    $('select.editable').prop('disabled',false);
    $('input.editable').prop('disabled',false);
    $('textarea.editable').prop('disabled',false);
    if (!newProduct) $('#inputSubcategory').prop('disabled', false);
    let val = $('#inputStockState').val();
    if (Tools.toNumber(val) === 4) {
        $('#inputExpectedArrival').prop('disabled', false);
        $('#inputStock').prop('disabled', true);
    }
};

window.setProductsData = function(){
    let request = new GetProductsRequest();
    http_client.requestGET(request,() => {
        if (request.entity.Count > 0){
            products = request.entity.Products;
            $('#products_grid > tbody').empty();
            $.each(request.entity.Products,function(){
                addProduct(this);
            });
        }else{
            products = [];
            showCenteredActions();
        }
    });
};

window.addProduct = function(product,isDetail = false){
    let row = '<tr class="grid_row"></tr>';
    let col1 = '<td class="column_20">' + product.Name + '</td>';
    let col2 = '<td class="column_15">' + product.Reference + '</td>';
    let category = "N/D";
    let categoryObj = getSubcategory(product.Subcategory);
    if (categoryObj) category = categoryObj.Name;
    let col3 = '<td class="column_15">' + category + '</td>';
    let col4 = '<td class="column_8 centered">' + product.Price + '</td>';
    let col5 = '<td class="column_10 centered">' + product.Stock + '</td>';

    let col6 = undefined;
    if (product.Offer) col6 = '<td class="column_10"><img src="../images/ic_circle_green.svg" class="offer_icon"></td>';
    else col6 = '<td class="column_10"><img src="../images/ic_circle_red.svg" class="offer_icon"></td>';

    let col7 = undefined;
    if (product.IsVisible) col7 = '<td class="column_10"><img src="../images/ic_circle_green.svg" class="offer_icon"></td>';
    else col7 = '<td class="column_10"><img src="../images/ic_circle_red.svg" class="offer_icon"></td>';

    let col8 = '<td class="column_10 centered">' + Tools.unifyDateFormat(product.LastUpdate) + '</td>';
    $('#products_grid > tbody').append(($(row).append(col1,col2,col3,col4,col5,col6,col7,col8)));
    $('#products_grid > tbody').append($('<tr class="spacer_5"> </tr>'));

    $("#content td").click(function() {
        let column_num = parseInt( $(this).index() ) + 1;
        let row_num = parseInt( $(this).parent().index() )+1;
        onGridItemSelected(column_num,row_num)
    });
};

window.getSubcategory = function getSubcategory(subcategoryID){
    let cat = Storage.getUser().Categories;
    let subcategory = undefined;
    cat.find(function(item){
        subcategory = item.Subcategories.find(function(item){
           return item._id === subcategoryID;
        });
        return subcategory;
    });
    return subcategory;
};

window.setCategoriesCombos = function(idCategory,idSubcategory,categories){
    let selector_category = $(idCategory);
    let selector_subcategory = $(idSubcategory);

    selector_category.empty();
    selector_category.append(Tools.getOption(0),"Seleccione una opción...");
    $.each(categories,function(){
        if (this.Subcategories && this.Subcategories.length > 0) selector_category.append(Tools.getOption(this._id,this.Name));
    });
    selector_category[0].onchange = function(){
        let index = this.selectedIndex;
        if (index > 0){
            if (selector_category.is(':enabled')) selector_subcategory.prop('disabled',false);
            selector_subcategory.empty();
            selector_subcategory.append(Tools.getOption(0),texts.default_select_option);

            let current_category = categories.filter(function(item){ return (item.Subcategories && item.Subcategories.length > 0)  })[index-1];
            $.each(current_category.Subcategories,function(){
               selector_subcategory.append(Tools.getOption(this._id,this.Name))
            });
            selector_subcategory.val(0);
        }else{
            selector_subcategory.prop('disabled',true);
            selector_subcategory.val(0);
        }
    };
};

window.hideProductDetail = function(){
    products_grid_container.removeClass('column_60');
    product_detail.addClass('hidden');

    //Modificació mida font
    $('thead th').css("fontSize", "110%");
    $('tbody tr').css("fontSize", "100%");

    //Amagar columna "subcategoria"
    let column_id = "#products_grid tbody tr td:nth-child("+column_subcategory.toString()+")";
    let header_id = "#products_grid thead tr th:nth-child("+column_subcategory.toString()+")";
    $(header_id).show();
    $(column_id).show();

    //Ampliar mida oferta
    let header_offer =  "#products_grid tbody tr td:nth-child("+column_offer.toString()+")";
    let offer_c = "#products_grid thead tr th:nth-child("+column_offer.toString()+")";
    $(header_offer).addClass('column_10').removeClass('column_13');
    $(offer_c).addClass('column_10').removeClass('column_13');

    //Ampliar mida referencia
    let header_reference = "#products_grid tbody tr td:nth-child("+column_reference.toString()+")";
    let reference = "#products_grid thead tr th:nth-child("+column_reference.toString()+")";
    $(header_reference).addClass('column_15').removeClass('column_20');
    $(reference).addClass('column_15').removeClass('column_20');

    //Ampliar mida actualització
    let header_update = "#products_grid tbody tr td:nth-child("+column_update.toString()+")";
    let update = "#products_grid thead tr th:nth-child("+column_update.toString()+")";
    $(header_update).removeClass('column_15').addClass('column_10');
    $(update).removeClass('column_15').addClass('column_10');

    //Reduir mida icones
    $('.offer_icon_small').addClass('offer_icon').removeClass('offer_icon_small');

    $('.selected_row').removeClass('selected_row');
    current_row = undefined;

    $('#inputName').val('');
    $('#inputReference').val('');
    $('#inputSubcategory').val('');
    $('#inputStock').val(0);
    $('#inputStockState').val('');
    $('#inputExpectedArrival').val('');
    $('#inputPrice').val(0);
    $('#inputOutletPrice').val(0);
    $('#inputDescription').val('');
    $('#inputProductID').val('');
    $('#inputOffer').val('');
    $('#inputCreationDate').val('');
    $('#inputUpdateDate').val('');
};

window.setProductDetail = function(product){
    if (product){
        $('#inputName').val(product.Name);
        $('#inputReference').val(product.Reference);

        let subcategory = getSubcategory(product.Subcategory)
        if (subcategory){
            $('#inputCategory').val(subcategory.ParentCategory);
            $('#inputCategory')[0].onchange();
            $('#inputSubcategory').val(product.Subcategory);
        }else{
            $('#inputCategory').val('');
            $('#inputSubcategory').val('');
        }
        $('#inputStock').val(product.Stock);
        $('#inputStockState').val(product.StockState);
        if (product.StockState === 4) $('#inputExpectedArrival').val(Tools.toInputDate(product.ExpectedArrival));
        else $('#inputExpectedArrival').val('');
        $('#inputPrice').val(product.Price);
        $('#inputOutletPrice').val(product.OutletPrice);
        if (product.IsVisible) $('#inputVisible').val(1);
        else $('#inputVisible').val(2);
        $('#inputDescription').val(product.Description);
        $('#inputOffer').val(product.Offer);
        $('#inputCreationDate').val(Tools.unifyDateFormat(product.CreationDate));
        $('#inputUpdateDate').val(Tools.unifyDateFormat(product.LastUpdate));
        $('#inputProductID').val(product._id);
    }
};

window.startEditingProduct = function(){
    enableEditableInputs();
    Tools.switchEditMode(true);
    $('#main_button').removeClass('clicked');
};

window.saveProduct = function(){
    if ($('#inputProductID').val()){
        updateProduct();
    }else{
        createNewProduct();
    }
};

window.createNewProduct = function(){
    let request = new CreateProductRequest();

    request.addBodyParam(CreateProductRequest.NAME,'inputName',validations.notEmpty,'inputName_error');
    request.addBodyParam(CreateProductRequest.REFERENCE,'inputReference',validations.notEmpty,'inputReference_error');
    request.addBodyParam(CreateProductRequest.SUBCATEGORY,'inputSubcategory',validations.notDefaultSelect,'inputSubcategory_error');
    request.addBodyParam(CreateProductRequest.STOCK,'inputStock',() => {
        let val = $('#inputStockState').val();
        switch (Tools.toNumber(val)){
            case 0: return validations.validationOK();
            case 1: return validations.positive(Tools.getViewValue('#inputStock'));
            case 2: return validations.isZero(Tools.getViewValue('#inputStock'));
            case 3: return validations.positive(Tools.getViewValue('#inputStock'));
            case 4: return validations.isZero(Tools.getViewValue('#inputStock'));
            case 5: return validations.isZero(Tools.getViewValue('#inputStock'));
        }
    },'inputStock_error',true);
    request.addBodyParam(CreateProductRequest.STOCK_STATE,'inputStockState',validations.notDefaultSelect, 'inputStockState_error');
    request.addBodyParam(CreateProductRequest.EXPECTED_ARRIVAL,'inputExpectedArrival',() => {
        let val = $('#inputStockState').val();
        switch (Tools.toNumber(val)){
            case 0: return validations.validationOK();
            case 1: return validations.empty(Tools.getViewValue('#inputExpectedArrival'));
            case 2: return validations.empty(Tools.getViewValue('#inputExpectedArrival'));
            case 3: return validations.empty(Tools.getViewValue('#inputExpectedArrival'));
            case 5: return validations.empty(Tools.getViewValue('#inputExpectedArrival'));
            case 4: return validations.olderThanCurrentDate(Tools.getViewValue('#inputExpectedArrival'));
        }
    },'inputExpectedArrival_error',true);
    request.addBodyParam(CreateProductRequest.PRICE,'inputPrice',validations.positive,'inputPrice_error');
    request.addBodyParam(CreateProductRequest.OUTLET_PRICE,'inputOutletPrice',() => {
        Tools.disableInputError('#inputOutletPrice_error');

        let price = Tools.getViewValue('#inputPrice');
        let outlet = Tools.getViewValue('#inputOutletPrice');
        if (price && outlet && outlet !== "" && price !== ""){
            if (isNaN(price)) return validations.validationOK();
            if (isNaN(outlet)) return validations.wrongValidation(texts.validation_nan);

            price = Tools.toDecimal(price);
            outlet = Tools.toDecimal(outlet);

            if (price > outlet) return validations.validationOK();
            else return validations.wrongValidation(texts.validation_too_large(price));
        }else if (!outlet || outlet === ""){
            return validations.wrongValidation(texts.validation_empty_string);
        }else return validations.validationOK();
        },'inputOutletPrice_error',true);
    request.addBodyParam(CreateProductRequest.DESCRIPTION,'inputDescription',validations.notEmpty,'inputDescription_error');
    request.IsVisible = Tools.toNumber(Tools.getViewValue('#inputVisible')) === 1;

    http_client.requestPOST(request,() => {
        products.push(request.entity.product);
        hideProductDetail();
        addProduct(request.entity.product);

        current_row = -1;
        onGridItemSelected(0,(products.length-1)*2,undefined);
        disableEditableInputs();
        Tools.switchEditMode(false);

        $('#action_create').parent().addClass('visible').removeClass('hidden');
        $('#action_edit').parent().addClass('visible').removeClass('hidden');
        $('#action_save').parent().addClass('hidden').removeClass('remove');
        $('#action_delete').parent().addClass('visible').removeClass('hidden');
    });
};

window.updateProduct = function(){
    $('#inputSubcategory').prop('disabled',false);
    let request = new UpdateProductRequest();

    request.addBodyParam(UpdateProductRequest.NAME,'inputName',validations.notEmpty,'inputName_error');
    request.addBodyParam(UpdateProductRequest.REFERENCE,'inputReference',validations.notEmpty,'inputReference_error');
    request.addBodyParam(UpdateProductRequest.SUBCATEGORY,'inputSubcategory',validations.notDefaultSelect,'inputSubcategory_error');
    request.addBodyParam(UpdateProductRequest.STOCK,'inputStock',() => {
        let val = $('#inputStockState').val();
        switch (Tools.toNumber(val)){
            case 0: return validations.validationOK();
            case 1: return validations.positive(Tools.getViewValue('#inputStock'));
            case 2: return validations.isZero(Tools.getViewValue('#inputStock'));
            case 3: return validations.positive(Tools.getViewValue('#inputStock'));
            case 4: return validations.isZero(Tools.getViewValue('#inputStock'));
            case 5: return validations.isZero(Tools.getViewValue('#inputStock'));
        }
    },'inputStock_error',true);
    request.addBodyParam(UpdateProductRequest.STOCK_STATE,'inputStockState',validations.notDefaultSelect, 'inputStockState_error');
    request.addBodyParam(UpdateProductRequest.EXPECTED_ARRIVAL,'inputExpectedArrival',() => {
        let val = $('#inputStockState').val();
        switch (Tools.toNumber(val)){
            case 0: return validations.validationOK();
            case 1: return validations.empty(Tools.getViewValue('#inputExpectedArrival'));
            case 2: return validations.empty(Tools.getViewValue('#inputExpectedArrival'));
            case 3: return validations.empty(Tools.getViewValue('#inputExpectedArrival'));
            case 5: return validations.empty(Tools.getViewValue('#inputExpectedArrival'));
            case 4: return validations.olderThanCurrentDate(Tools.getViewValue('#inputExpectedArrival'));
        }
    },'inputExpectedArrival_error',true);
    request.addBodyParam(UpdateProductRequest.PRICE,'inputPrice',validations.positive,'inputPrice_error');
    request.addBodyParam(UpdateProductRequest.OUTLET_PRICE,'inputOutletPrice',() => {
        Tools.disableInputError('#inputOutletPrice_error');

        let price = Tools.getViewValue('#inputPrice');
        let outlet = Tools.getViewValue('#inputOutletPrice');
        if (price && outlet && outlet !== "" && price !== ""){
            if (isNaN(price)) return validations.validationOK();
            if (isNaN(outlet)) return validations.wrongValidation(texts.validation_nan);

            price = Tools.toDecimal(price);
            outlet = Tools.toDecimal(outlet);

            if (price > outlet) return validations.validationOK();
            else return validations.wrongValidation(texts.validation_too_large(price));
        }else if (!outlet || outlet === ""){
            return validations.wrongValidation(texts.validation_empty_string);
        }else return validations.validationOK();
    },'inputOutletPrice_error',true);
    request.addBodyParam(UpdateProductRequest.DESCRIPTION,'inputDescription',validations.notEmpty,'inputDescription_error');
    request.IsVisible = Tools.toNumber(Tools.getViewValue('#inputVisible')) === 1;
    request.addQueryParam(UpdateProductRequest.PRODUCT_ID,'inputProductID');

    http_client.requestPUT(request,() => {
        let aux = current_row;
        products[current_row] = request.entity.product;
        hideProductDetail();

        replaceRow(request.entity.product,aux);

        current_row = -1;
        onGridItemSelected(0,aux*2,undefined);
        disableEditableInputs();
        Tools.switchEditMode(false);

        $('#action_create').parent().addClass('visible').removeClass('hidden');
        $('#action_edit').parent().addClass('visible').removeClass('hidden');
        $('#action_save').parent().addClass('hidden').removeClass('remove');
        $('#action_delete').parent().addClass('visible').removeClass('hidden');
    });
};

window.startCreateProduct = function(){
    enableEditableInputs();
    Tools.switchEditMode(true);
    $('#inputName').val("");
    $('#inputReference').val("");
    $('#inputCategory').val(0);
    $('#inputSubcategory').val(0);
    $('#inputStock').val(0);
    $('#inputStockState').val(0);
    $('#inputExpectedArrival').val("");
    $('#inputPrice').val("");
    $('#inputOutletPrice').val("");
    $('#inputVisible').val(0);
    $('#inputDescription').val("");
    $('#inputOffer').val("");
    $('#inputCreationDate').val("");
    $('#inputUpdateDate').val("");
    $('#inputProductID').val("");

    $('#action_create').parent().addClass('hidden').removeClass('visible');
    $('#action_edit').parent().addClass('hidden').removeClass('visible');
    $('#action_save').parent().addClass('visible').removeClass('hidden');
    $('#action_delete').parent().addClass('hidden').removeClass('visible');

    $('.selected_row').removeClass('selected_row');
};

window.deleteProduct = function(){
    if (current_row >= 0){
        let request = new DeleteProductRequest();
        request.idProduct = products[current_row]._id;
        http_client.requestDELETE(request,() => {
            if (current_row === 0){
                $('#products_grid tbody tr:nth-child(1)').remove();
                $('#products_grid tbody tr:nth-child(1)').remove();
            }else{
                $('#products_grid tbody tr:nth-child('+(current_row*2)+')').remove();
                $('#products_grid tbody tr:nth-child('+(current_row*2)+')').remove();
            }

            products.splice(current_row,1);

            $('#action_create').parent().addClass('visible').removeClass('hidden');
            $('#action_edit').parent().addClass('visible').removeClass('hidden');
            $('#action_save').parent().addClass('hidden').removeClass('visible');
            $('#action_delete').parent().addClass('visible').removeClass('hidden');

            hideProductDetail();
            if (!products || products.length === 0) showCenteredActions();
        });
    }
};

window.onChangeStockState = function(){
    let val = $('#inputStockState').val();
    switch (Tools.toNumber(val)){
        case 0:{
            $('#inputExpectedArrival').prop('disabled',true).val("");
            $('#inputStock').prop('disabled',false);
            break;
        }case 1:{
            $('#inputExpectedArrival').prop('disabled',true).val("");
            $('#inputStock').prop('disabled',false);
            break;
        }case 2:{
            $('#inputExpectedArrival').prop('disabled',true).val("");
            $('#inputStock').prop('disabled',true).val(0);
            break;
        }case 3:{
            $('#inputExpectedArrival').prop('disabled',true).val("");
            $('#inputStock').prop('disabled',false);
            break;
        }case 4:{
            $('#inputExpectedArrival').prop('disabled',false);
            $('#inputStock').prop('disabled',true).val(0);
            break;
        }case 5:{
            $('#inputExpectedArrival').prop('disabled',true).val("");
            $('#inputStock').prop('disabled',true).val(0);
            break;
        }
    }
};

window.replaceRow = function(product,row_index){
    let col1 = '<td class="column_20">' + product.Name + '</td>';
    let col2 = '<td class="column_15">' + product.Reference + '</td>';
    let col3 = '<td class="column_15">' + getSubcategory(product.Subcategory).Name + '</td>';
    let col4 = '<td class="column_8 centered">' + product.Price + '</td>';
    let col5 = '<td class="column_10 centered">' + product.Stock + '</td>';

    let col6 = undefined;
    if (product.Offer) col6 = '<td class="column_10"><img src="../images/ic_circle_green.svg" class="offer_icon"></td>';
    else col6 = '<td class="column_10"><img src="../images/ic_circle_red.svg" class="offer_icon"></td>';

    let col7 = undefined;
    if (product.IsVisible) col7 = '<td class="column_10"><img src="../images/ic_circle_green.svg" class="offer_icon"></td>';
    else col7 = '<td class="column_10"><img src="../images/ic_circle_red.svg" class="offer_icon"></td>';

    let col8 = '<td class="column_10 centered">' + Tools.unifyDateFormat(product.LastUpdate) + '</td>';

    $('#products_grid > tbody tr:nth-child('+((row_index*2)+1)+')').html(col1+col2+col3+col4+col5+col6+col7+col8)

    $("#content td").click(function() {
        let column_num = parseInt( $(this).index() ) + 1;
        let row_num = parseInt( $(this).parent().index() )+1;
        onGridItemSelected(column_num,row_num)
    });
};

window.newProduct = function(){
    $('#empty_grid').addClass('hidden');
    onGridItemSelected();
    startEditingProduct();
    Tools.switchEditMode(true);
};