require('./utilities/templates');
require('jquery.nicescroll');

let $ = require('jquery');
let Handlebars = require('handlebars');
let Storage = require('./utilities/storage');
let Tools = require('./utilities/tools');
let http_client = require('./utilities/HTTPClient');
let CreateCategoryRequest = require('./requests/CreateCategoryRequest');
let UpdateCategoryRequest = require('./requests/UpdateCategoryRequest');
let DeleteCategoryRequest = require('./requests/DeleteCategoryRequest');
let CreateSubcategoryRequest = require('./requests/CreateSubcategoryRequest');
let UpdateSubcategoryRequest = require('./requests/UpdateSubcategoryRequest');
let DeleteSubcategoryRequest = require('./requests/DeleteSubcategoryRequest');
let validations = require('./utilities/validations');
let Texts = require('./utilities/texts');

let manual_purchases_grid_container = undefined;
let manual_purchases_grid = undefined;
let manual_purchase_detail = undefined;

let current_row = undefined;

let edit_mode = false;

window.onGridItemSelected = function(column,row){
    row = Math.floor(row/2);
    if (row !== current_row){
        $('#main_button').removeClass('clicked');
        $('.invalid-tooltip').hide();
        showDetail();

        //Marcar fila seleccionada
        let aux_row = "#categories_grid tbody tr:nth-child("+((row*2)+1).toString()+")";
        $(aux_row).addClass('selected_row');
        current_row = row;

        //Parseig dades categoria
        let user = Storage.getUser();

        $('#inputCategoryName').val(user.Categories[row].Name).prop('disabled',true);
        $('#inputCategoryID').val(user.Categories[row]._id);
        $('#inputCreationDate').val(Tools.unifyDateFormat(user.Categories[row].CreationDate));
        $('#inputLastUpdate').val(Tools.unifyDateFormat(user.Categories[row].LastUpdate));
        setSubcategoriesData(user.Categories[row].Subcategories);
    }
};

window.discardEditedCategory = function(){
    let user = Storage.getUser();

    $('#inputCategoryName').val(user.Categories[current_row].Name).prop('disabled',true);
    $('#inputCategoryID').val(user.Categories[current_row]._id);
    $('#inputCreationDate').val(Tools.unifyDateFormat(user.Categories[current_row].CreationDate));
    $('#inputLastUpdate').val(Tools.unifyDateFormat(user.Categories[current_row].LastUpdate));
    setSubcategoriesData(user.Categories[current_row].Subcategories);

    disableEditableInputs();
}

window.initializeBefore = function(){
    Tools.commonInitializationBefore();
};

window.initializeAfter = function() {
    Handlebars.translatePage("categories");

    let validTokenExecuted = Tools.validateAuth();
    if (validTokenExecuted){
        if (!Storage.getUser()) showUserMissingDataWarning();
        else{
            innerInitialize();
        }
    }else innerInitialize();
};

window.innerInitialize = function(){
    let name = Texts.business_name_placeholder;
    if (Storage.getUser()) name = Storage.getUser().Name;
    Tools.commonInitializationAfter({name:name,current: Texts.option_categorias});

    manual_purchases_grid_container = $('#content');
    manual_purchases_grid = $('#categories_grid');
    manual_purchase_detail = $('#category_detail');

    Tools.setSmallScroll('#content');
    //Tools.setSmallScroll('#grid_scroll_container');
    Tools.setSmallScroll('#category_detail', '#container_detail');

    setCategoriesData(Storage.getUser().Categories);

    //Accio a executar en click a grid
    $("#content td").click(function() {
        let column_num = parseInt( $(this).index() ) + 1;
        let row_num = parseInt( $(this).parent().index() )+1;
        onGridItemSelected(column_num,row_num)
    });

    disableEditableInputs();
};

window.hideDetail = function(){
    $('#category_detail').removeClass('visible').addClass('hidden');
    manual_purchases_grid_container.removeClass('column_60');

    let old_row = "#categories_grid tbody tr:nth-child("+current_row.toString()+")";
    $(old_row).removeClass('selected_row');
    current_row = undefined;

    $('#main_button').removeClass('clicked');

    //Modificació mida font
    $('thead th').css("fontSize", "130%");
    $('tbody tr').css("fontSize", "110%");
};

window.showDetail = function(){
    //Mostrar mida productes
    manual_purchases_grid_container.addClass('column_60');
    manual_purchase_detail.removeClass('hidden');

    //Eliminar fila seleccionada
    $('.selected_row').removeClass('selected_row');

    //Modificació mida font
    $('.content thead th').css("fontSize", "95%");
    $('.content tbody tr').css("fontSize", "80%");
};

window.setCategoriesData = function(categories){
    $("#categories_grid > tbody").empty();
    if (categories && categories.length > 0){
        $.each(categories,function(){
            addCategory(this);
        });
    }else{
        showCenteredActions();
    }
    if (current_row >= 0) {
        let aux_row = "#categories_grid tbody tr:nth-child("+((current_row*2)+1).toString()+")";
        $(aux_row).addClass('selected_row');
    }
};

window.setSubcategoriesData = function(subcategories){
    $('#subcategories_grid > tbody').empty();
    $("#category_detail").getNiceScroll().resize();
    let index =0;
    $.each(subcategories,function(){
        addSubcategory(this,index);
        index += 1;
    });
};

window.newCategory = function(){
    let newCategory = $('#'+Handlebars.templateKeys.new_category);
    if (newCategory.length) Handlebars.show(newCategory);
    else{
        newCategory = Handlebars.parseTemplate(Handlebars.templateKeys.new_category,{createCategory:Tools.toHandlebarsFunction(saveNewCategory)});
        if (newCategory) Handlebars.show(newCategory);
    }
    $('#new_category .invalid-tooltip').hide();
};

window.saveNewCategory = function saveNewCategory(){
    let request = new CreateCategoryRequest();
    request.addQueryParam(CreateCategoryRequest.NAME,'category_name',validations.notEmpty,'category_name_error');
    http_client.requestPOST(request,() => {
        //AMAGAR DIÀLEG GRID BUIT
        $('#empty_grid').addClass('hidden');

        //AMAGAR DIÀLEG CREACIÓ
        let dialog = $('#new_category');
        if (dialog) Handlebars.hide(dialog);
        $('#category_name').val('');

        //ACTUALITZAR DADES
        let newUser = Storage.getUser();
        newUser.Categories = request.entity.Categories;
        if (!newUser.Categories) newUser.Categories = [];
        Storage.setUser(newUser);

        //Carregar dades categories
        setCategoriesData(Storage.getUser().Categories);

        //Seleccionar categoria nova
        onGridItemSelected(0, getCategoryIndex(request.queryObject[CreateCategoryRequest.NAME]) * 2);
    })
};

window.getCategoryIndex = function getCategoryIndex(categoryName){
    let categories = Storage.getUser().Categories;
    if (categories){
        return categories.findIndex(function(item){
            return item.Name === categoryName;
        });
    }else return -1;
}

window.getCategoryIndexById = function getCategoryIndexById(categoryId){
    let categories = Storage.getUser().Categories;
    if (categories){
        return categories.findIndex(function(item){
            return item._id === categoryId;
        });
    }else return -1;
}

window.addCategory = function(category){
    let nSubcategories = 0;
    if (category.Subcategories) nSubcategories = category.Subcategories.length;
    let row = '<tr class="grid_row"></tr>';
    let col1 = '<td class="column_30">' + category.Name + '</td>';
    let col2 = '<td class="column_25 centered">' + Tools.unifyDateFormat(category.CreationDate) + '</td>';
    let col3 = '<td class="column_25 centered">' + Tools.unifyDateFormat(category.LastUpdate) + '</td>';
    let col4 = '<td class="column_17 centered">' + nSubcategories + '</td>';
    $('#categories_grid > tbody').append($(row).append(col1,col2,col3,col4)).append($('<tr class="spacer_5"> </tr>'));

    $("#content td").click(function() {
        let column_num = parseInt( $(this).index() ) + 1;
        let row_num = parseInt( $(this).parent().index() )+1;
        onGridItemSelected(column_num,row_num,)
    });
};

window.addSubcategory = function(subcategory,rowIndex){
    let row = '<tr class="grid_row"></tr>';
    let col1 = '<td class="">' + subcategory.Name + '</td>';
    let col2 = '<td class="detail_grid_icon"><img src="../images/ic_action_edit.svg" class="offer_icon subgrid_icon" onclick="editSubcategory('+rowIndex+')"></td>' ;
    let col3 = '<td class="detail_grid_icon"><img src="../images/ic_action_delete.svg" class="offer_icon subgrid_icon" onclick="deleteSubcategory('+rowIndex+')"></td>';
    $('#subcategories_grid > tbody').append($(row).append(col1,col3,col2)).append($('<tr class="spacer_5"> </tr>'));

    if (rowIndex >= 5) {
        $("#category_detail").getNiceScroll().show();
        $("#category_detail").getNiceScroll().resize();
    }
};

window.saveEditedCategory = function(){
    let request = new UpdateCategoryRequest();
    request.oldName = Storage.getUser().Categories[current_row].Name;
    request.addQueryParam(UpdateCategoryRequest.NEW_NAME,'inputCategoryName',validations.notEmpty,'inputCategoryName_error');
    http_client.requestPUT(request,() => {
        disableEditableInputs();
        setNonEditMode();

        //ACTUALITZAR DADES
        let newUser = Storage.getUser();
        newUser.Categories = request.entity.Categories;
        if (!newUser.Categories) newUser.Categories = [];
        Storage.setUser(newUser);


        setCategoriesData(newUser.Categories);
        let currentCategoryRow = getCategoryIndex(request.queryObject[UpdateCategoryRequest.NEW_NAME]);
        current_row = -1;
        onGridItemSelected(0, currentCategoryRow * 2);
    });
};

window.startEditingCategory = function(){
    enableEditableInputs();
    setEditMode();
    $('#main_button').removeClass('clicked');
};

window.disableEditableInputs = function(){
    $('#subcategories_grid img').removeClass('hoverable_column');
    $('#inputCategoryName').prop('disabled',true);

    $('.button_secondary_second.edit').removeClass('hidden');
    $('.button_secondary_second.confirm_edit').addClass('hidden');

    $('.button_secondary_third.delete').removeClass('hidden');
    $('.button_secondary_third.discard_edit').addClass('hidden');
};

window.enableEditableInputs = function(){
    $('#subcategories_grid img').addClass('hoverable_column');
    $('#inputCategoryName').prop('disabled',false);

    $('.button_secondary_second.edit').addClass('hidden');
    $('.button_secondary_second.confirm_edit').removeClass('hidden');

    $('.button_secondary_third.delete').addClass('hidden');
    $('.button_secondary_third.discard_edit').removeClass('hidden');
};

window.setNonEditMode = function(){
    edit_mode = false;
    $('#action_edit').parent().addClass('visible').removeClass('hidden');
    $('#action_save').parent().addClass('hidden').removeClass('visible');
};


window.setEditMode = function(){
    edit_mode = true;
    $('#action_edit').parent().addClass('hidden').removeClass('visible');
    $('#action_save').parent().addClass('visible').removeClass('hidden');
};

window.deleteCategory = function(){
    let request = new DeleteCategoryRequest();
    request.addQueryParam(DeleteCategoryRequest.NAME,'inputCategoryName',validations.notEmpty,'inputCategoryName_error');
    http_client.requestDELETE(request,(request, data) => {
        //ELIMINAR ASPECTE FILA SELECCIONADA
        $('.selected_row').removeClass('selected_row');
        manual_purchases_grid_container.removeClass('column_60');
        manual_purchase_detail.addClass('hidden');
        $('thead th').css("fontSize", "130%");
        $('tbody tr').css("fontSize", "110%");
        current_row = -1;

        //CARREGAR DADES
        let currentUser = Storage.getUser()
        currentUser.Categories = data.Entity.Categories;
        if (!currentUser.Categories) currentUser.Categories = [];
        Storage.setUser(currentUser);

        //PINTAR CATEGORIES
        setCategoriesData(currentUser.Categories);
    });
};

window.newSubcategory = function(){
    let new_subcategory = $('#'+Handlebars.templateKeys.new_subcategory);
    if (new_subcategory.length) Handlebars.show(new_subcategory);
    else{
        new_subcategory = Handlebars.parseTemplate(Handlebars.templateKeys.new_subcategory,{action:Tools.toHandlebarsFunction(createSubcategory)});
        if (new_subcategory) Handlebars.show(new_subcategory);
    }
};

var editConfig = undefined;
window.editSubcategory = function(rowIndex){
    let category = Storage.getUser().Categories[current_row];
    let config = {
        action:Tools.toHandlebarsFunction(saveEditedSubcategory),
        Categories: Storage.getUser().Categories,
        CurrentName: category.Subcategories[rowIndex].Name
    };

    let auxIndex = config.Categories.findIndex(function(item){ return item._id === category._id})
    if (auxIndex >= 0) config.Categories[auxIndex]["Current"] = true;

    editConfig = config;

    let edit_subcategory = Handlebars.parseTemplate(Handlebars.templateKeys.edit_subcategory, config);
    if (edit_subcategory) Handlebars.show(edit_subcategory);
};

window.saveEditedSubcategory = function saveEditedSubcategory(){
    let request = new UpdateSubcategoryRequest();

    request.addQueryParam(UpdateSubcategoryRequest.NEW_NAME, "subcategory_name", validations.notEmpty, 'subcategory_name_error');
    request.addQueryParam(UpdateSubcategoryRequest.NEW_PARENT, "subcategory_parent", validations.notDefaultSelect, 'subcategory_parent_error');

    request.currentName = editConfig.CurrentName;
    request.currentParent = editConfig.Categories.find(function(item) { return item.Current === true })._id;

    http_client.requestPUT(request, (req, data) => {
        //Amagar dialeg
        let new_subcategory = $('#' + Handlebars.templateKeys.edit_subcategory);
        if (new_subcategory.length) Handlebars.hide(new_subcategory);

        //Actualitzar usuari
        let currentUser = Storage.getUser()
        currentUser.Categories = data.Entity.Categories;
        if (!currentUser.Categories) currentUser.Categories = [];
        Storage.setUser(currentUser);

        //Actualitzar dades
        let currentCategory = Storage.getUser().Categories[current_row];
        if (currentCategory._id !== req.queryObject[UpdateSubcategoryRequest.NEW_PARENT]){
            var tempRow = getCategoryIndexById(req.queryObject[UpdateSubcategoryRequest.NEW_PARENT]);
            if (tempRow) {
                current_row = tempRow;
                currentCategory = currentUser.Categories[current_row];
            }
        }

        setCategoriesData(currentUser.Categories);
        setSubcategoriesData(currentCategory.Subcategories);
    });
};

window.getSubcategory = function getSubcategory(subcategoryID){
    let cat = Storage.getUser().Categories;
    let subcategory = undefined;
    cat.find(function(item){
        subcategory = item.Subcategories.find(function(item){
            return item._id === subcategoryID;
        });
        if (subcategory) return true;
        else return false;
    });
    return subcategory;
};

window.deleteSubcategory = function(rowIndex){
    let currentCategory = Storage.getUser().Categories[current_row];
    let request = new DeleteSubcategoryRequest();
    request.parentCategory = currentCategory._id;
    request.subcategory = currentCategory.Subcategories[rowIndex].Name;
    http_client.requestDELETE(request,(req, data) => {
        let currentUser = Storage.getUser()
        currentUser.Categories = data.Entity.Categories;
        if (!currentUser.Categories) currentUser.Categories = [];
        Storage.setUser(currentUser);

        setCategoriesData(currentUser.Categories);
        let currentCategory = Storage.getUser().Categories[current_row];
        setSubcategoriesData(currentCategory.Subcategories);
    });
};

window.createSubcategory = function createSubcategory(){
    let request = new CreateSubcategoryRequest();
    request.parentCategory = Storage.getUser().Categories[current_row]._id;
    request.addQueryParam(CreateSubcategoryRequest.NAME,'subcategory_name',validations.notEmpty,'subcategory_name_error');
    http_client.requestPOST(request,(req, data) => {
        //Amagar dialeg
        let new_subcategory = $('#' + Handlebars.templateKeys.new_subcategory);
        if (new_subcategory.length) Handlebars.hide(new_subcategory);
        $('#subcategory_name').val('');

        //Actualitzar usuari
        let currentUser = Storage.getUser();
        currentUser.Categories = data.Entity.Categories;
        if (!currentUser.Categories) currentUser.Categories = [];
        Storage.setUser(currentUser);

        //Carregar dades
        let currentCategoryIndex = getCategoryIndexById(req.parentCategory);
        current_row = -1;
        setCategoriesData(Storage.getUser().Categories);
        onGridItemSelected(0, currentCategoryIndex * 2);
    });
};
