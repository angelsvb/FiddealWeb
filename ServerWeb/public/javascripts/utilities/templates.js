let Handlebars = require('handlebars');
require('jquery-ui');
let Tools = require('../utilities/tools');
let Storage = require('../utilities/storage');
let Translations = require('../utilities/translations');
let Texts = require('../utilities/texts');

Handlebars.getTemplate = function(name) {
    if (Handlebars.templates === undefined) Handlebars.templates = {};
    if (Handlebars.templates[name] === undefined) {
        let URL = Storage.serverIP()+'/templates/' + name + '.hbs';
        $.ajax({
            url : URL,
            crossDomain : true,
            success : function(data) {
                Handlebars.templates[name] = Handlebars.compile(data);
            },
            error : function(err){ },
            async : false
        });
    }
    return Handlebars.templates[name];
};

///Template name: nom de la plantilla a carregar
///Data: dades que parsejara Handlebars a la plantilla
///ParentId: indica l'ID del div on s'ha de posar la plantilla. En cas de que no n'hi hagi, es crearà
///Draggable: permet que sigui un modal arrossegable
///CloseOnClickOutside: fa que el modal es tanqui si es fa click a fora
Handlebars.parseTemplate = function(template_name,data,parentId,draggable = false,closeOnClickOutside=true){
    try{
        let auxElem = document.createElement('div');
        auxElem.id = 'aux_div_'+template_name;
        let auxTemplate = Handlebars.getTemplate(template_name);

        let hbsObject;

        let translationProperty = "template_"+template_name+"_"+Storage.getLanguage();
        let commonTranslationProperty = "common_"+Storage.getLanguage();
        let translationObject = Translations[translationProperty];
        let commonTranslationObject = Translations[commonTranslationProperty];

        if (data && translationObject) hbsObject = {...data, ...translationObject, ...commonTranslationObject};
        else if (data) hbsObject = {...data, ...commonTranslationObject};
        else if (translationObject) hbsObject = {...translationObject, ...commonTranslationObject};
        else hbsObject = commonTranslationObject;

        auxElem.innerHTML = auxTemplate(hbsObject);
        if (!parentId) {
            let auxDoc = document.getElementById(auxElem.id);
            if (!auxDoc) document.body.appendChild(auxElem);
            else document.body.replaceChild(auxElem,auxDoc);
        }
        else {
            let auxDoc = document.getElementById(auxElem.id);
            if (!auxDoc) document.getElementById(parentId).appendChild(auxElem);
            else document.body.replaceChild(auxElem,auxDoc);
        }
        if (draggable) $('#'+auxElem.id).draggable();
        if (closeOnClickOutside) {
            let modalId = '#' + $('#'+auxElem.id)[0].id;
            let parentId = '#' + $(modalId).parent()[0].id;
            $(parentId).on('click', function(event){ closeModalOnClickOutside(event, parentId, modalId)})
        }
        Tools.setScrollWhite('#'+template_name);
        return document.getElementById(template_name);
    }catch (err){
        return undefined;
    }
};

Handlebars.translatePage = function(page){
    if (!Storage.languageInitialized()) Storage.initializeLanguage();
    if (Storage.getLanguage() !== Storage.SPANISH){
        let auxTemplate = Handlebars.getTemplate("translations/" + page);
        let propertyName = page+"_"+Storage.getLanguage();
        let commonPropertyName = "common_"+Storage.getLanguage();

        let aux1 = Translations[propertyName];
        let aux2 = Translations[commonPropertyName];
        let translationObject = { ...aux1, ...aux2 };

        document.body.innerHTML = auxTemplate(translationObject);
    }
};

Handlebars.hide = function(elem){
    if (elem.length) $("#"+elem[0].id).addClass('hidden').removeClass('visible').css("z-index", 0);
    else if (elem.id) $("#"+elem.id).addClass('hidden').removeClass('visible').css("z-index", 0);
    else throw Texts.exception_unable_hide_without_id;
};

Handlebars.show = function(elem){
    if (elem.length) $("#"+elem[0].id).removeClass('hidden').addClass('visible').css("z-index", getMaxZIndex()+1);
    else if (elem.id) $("#"+elem.id).removeClass('hidden').addClass('visible').css("z-index", getMaxZIndex()+1);
    else throw Texts.exception_unable_show_without_id;
};

function getMaxZIndex(){
    var elems = $(".modal"); //document.getElementsByClassName("modal");
    var highest = 0;
    for (var i = 0; i < elems.length; i++) {
        var zindex=$(elems[i.toString()]).css("z-index");
        /*AFEGIR SI ES VOL IGNORAR EL MODAL DE LOADING =>  && */
        if ((zindex > highest) && (zindex !== 'auto') && $(elems[i.toString()]).id !== templateKeys.loading) {
            highest = zindex;
        }
    }
    return highest;
}

Handlebars.loadHeader = function(name,beforeOfId,context){
    let header = $('header');
    if (!header.length){
        $('body').prepend(document.createElement("HEADER"));
    }
    header = $('header');
    let auxTemplate = Handlebars.getTemplate(name);

    let translationProperty = "template_"+name+"_"+Storage.getLanguage();
    let commonTranslationProperty = "common_"+Storage.getLanguage();
    let translationObject = Translations[translationProperty];
    let commonTranslationObject = Translations[commonTranslationProperty];

    let hbsObject;
    if (context && translationObject) hbsObject = {...context, ...translationObject, ...commonTranslationObject};
    else if (context) hbsObject = {...context, ...commonTranslationObject};
    else if (translationObject) hbsObject = {...translationObject, ...commonTranslationObject};
    else hbsObject = commonTranslationObject;

    let html = auxTemplate(hbsObject);
    header.html(html);
};

Handlebars.loadFooter = function(name){
    let footer = $('footer');
    if (!footer.length){
        document.body.appendChild(document.createElement("FOOTER"));
    }
    footer = $('footer');
    let auxTemplate = Handlebars.getTemplate(name);

    let translationProperty = "template_"+name+"_"+Storage.getLanguage();
    let commonTranslationProperty = "common_"+Storage.getLanguage();
    let translationObject = Translations[translationProperty];
    let commonTranslationObject = Translations[commonTranslationProperty];

    let hbsObject;
    let auxObject = { app_version : Storage.version() };
    if (translationObject) hbsObject = {...translationObject, ...commonTranslationObject, ...auxObject};
    else hbsObject = {...commonTranslationObject, ...auxObject};

    let html = auxTemplate(hbsObject);
    footer.html(html);
};

let templateKeys = {
    accept_purchase_confirmation : "accept_purchase_confirmation",
    activate_account : "activate_account",
    change_password: "change_password",
    close_session: "close_session",
    dialog_given_cash: "dialog_given_cash",
    dialog_has_card: "dialog_has_card",
    dialog_payment_method: "dialog_payment_method",
    dialog_sale_info: "dialog_sale_info",
    dialog_use_discount: "dialog_use_discount",
    dialog_user_card: "dialog_user_card",
    edit_subcategory: "edit_subcategory",
    footer: "footer",
    get_product_price: "get_product_price",
    get_product_stock: "get_product_stock",
    header: "header",
    information: "information",
    initialize_horari: "initialize_horari",
    loading: "loading",
    manual_product_entry: "manual_product_entry",
    new_category: "new_category",
    new_subcategory: "new_subcategory",
    recovery_password: "recovery_password",
    reject_purchase_comment: "reject_purchase_comment",
    request_recovery_password: "request_recovery_password",
    support_dialog: "support_dialog",
    terms_conditions_modified: "terms_conditions_modified",
    ticket: "ticket",
    warning: "warning"
};

Handlebars.templateKeys = templateKeys;
