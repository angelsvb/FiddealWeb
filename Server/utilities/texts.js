'use strict';
let manager = require("./manager");
let enums = require('./enums');

//region "altres"
exports.label_connected_to_server = "App initialized correctly. Waiting for requests on port "+manager.server_port;
exports.label_connected_to_db = "Connected to db with name "+manager.dbName+" on the following URL: "+manager.dbURL;
exports.request_executed_ok = "Request OK";
//endregion

//region "Textos d'error"
exports.body_validation_errors = "Unexpected values in body.";
exports.json_format_error = "Unexpected JSON recived. Check the format.";
exports.unexpected_request_error = "Unexpected request. Check the request PATH";
exports.invalid_or_missing_token = "Token no valido.";
exports.invalid_confirmation_password = "Contraseña de confirmación no coincide";
exports.error_db_acces = "Error accessing db. Check if service is available.";
exports.error_db_save = "Error saving db. Check if service is available.";
exports.error_db_delete = "Error deleting db. Check if service is available";
exports.wrong_query_params = "Query params wrong validation";
exports.error_not_valid_param = function(param_name){
    return "Error: not valid param ["+ param_name.toString() + "] value."
};
exports.error_missing_param = function(param_name){
    return "Error missing ["+param_name.toString()+"] parameter in URL.";
};
exports.error_missing_body_property = function(prop_name){
  return "Error missing ["+prop_name.toString()+"] in request body.";
};
exports.error_creating_transporter = "Error creating transporter instance for sending email";
exports.error_sending_mail = "Error sending mail";
exports.undefined_error_sending_mail = "Unexpected error sending mail";
exports.error_creating_mail = "Error creating mail instance";
exports.empty_body = "Empty request body";
//endregion

//region "Tipus de categoria de correu de soporte"
exports.support_category_others = "Otros";
exports.support_category_help = "Ayuda";
exports.support_category_suggestion = "Sugerencias";
exports.support_category_software_problem = "Problema de funcionamiento";
exports.support_category_business_problem = "Problema con un establecimiento";
exports.support_category_undefined = "Indefinido";
exports.support_confirmation_subject = "Copia contacto a soporte";
exports.support_undefined_user_type = "INDEFINIDO";
exports.support_mobile_user_type = "MOBIL";
exports.support_web_user_type = "WEB";
//endregion

//region "Enllaços"
exports.link_terms_and_conditions = "";
exports.link_privacy_policy = "";
//endregion

//region "Peticions /user"
exports.user_cif_not_valid ="Formato de CIF incorrecto.";
exports.user_empty_body = "Empty user data recived";
exports.user_invalid_password = "Contraseña incorrecta";
exports.user_not_found = "Usuario no encontrado";
exports.user_not_valid_business_type = "Tipo de establecimiento no vàlido";
exports.user_not_valid_cp = "Formato de CP no válido.";
exports.user_not_valid_dni = "Formato de DNI / NIE no valido.";
exports.user_password_not_safe = "La contraseña debe contener almenos un dígito y una letra";
exports.user_password_too_long = "Longitud máxima de 50 carácteres.";
exports.user_password_too_short = "Longitud mínima de 8 carácteres.";
exports.user_empty_user_id = "No se ha indicado id de usuario a consultar";
//endregion

//region "Validation messages"
exports.empty_mail = "Correo electronico vacio";
exports.empty_array = "Lista vacía";
exports.empty_buffer = "Imagen no enviada.";
exports.invalid_mail = "Correo electronico en formato no valido";
exports.empty_text = "El campo no puede estar vacío";
exports.non_text = "Valor no valido para un texto";
exports.invalid_age ="Edad no suficiente";
exports.invalid_date_format = "Formato de fecha no valido";
exports.empty_date = "Fecha vacia";
exports.policy_not_accepted = "Política de privacidad no aceptada";
exports.existing_user = "Correo electrónico ya registrado";
exports.not_a_number = "Formato no valido";
exports.empty_value = "Campo obligatório";
exports.too_short_phone = "Longitud mínima no válida.";
exports.country_not_found = "Datos país no encontrados";
exports.provincia_not_found = "Datos provincia no encontrados";
exports.not_valid_url = "Formato no válido";
exports.negative_value = "Valor negativo no admitido.";
exports.cant_compare_with_nan = "No se puede comparar con un valor no numèrico.";
exports.cant_compare_with_empty = "No se puede comparar con valor vacio";
exports.invalid_length = "Longitud del valor no válida"
exports.cant_be_greater_than = function(prop){
    return "No puede ser superior a "+prop;
};
exports.unexpected_value = "Valor no esperado.";
exports.must_be_non_expired_date = "Fecha ya pasada";
exports.not_valid_id = "Identificador no válido.";
//endregion

//region "Credentials
exports.user_credentials_recovery_code_not_valid = "El código de recuperación no és valido.";
exports.user_credentials_wrong_password = "La contraseña no coincide con la actual.";
exports.user_credentials_cant_have_same_password = "La contraseña nueva no puede ser igual a la anterior.";
exports.user_credentials_message = "Buenos días, hemos recibido una petición de recuperación de contraseña asociada a este correo electrònico. En caso de que no haya sido usted, ignore este mensaje." +
                                    "También queremos recordarle que el codigo tiene una caducidad de 24 horas y una vez superado el plazo, deberá repetir el proceso.";
exports.user_credentials_expired_code = "Còdigo de recuperación caducado.";
exports.user_credentials_recovery_password = "Recuperación de contraseña";
exports.user_credentials_error_generating_code = "Error generando código de recuperación";
exports.user_credentials_cant_be_equals = "La contraseña no puede ser igual a la anterior.";
exports.user_credentials_type = function(type){
    if (type === 1) return "Cliente";
    else if (type === 2) return "Empresario";
    else return "";
};
//endregion

//region "Request activate user"
exports.activate_user_invalid_password = "Contrasenya incorrecta";
exports.activate_user_not_valid_code = "Código incorrecto";
exports.activate_user_not_found = "Usuario no encontrado";
exports.activate_user_subject = "Confirmación de registro";
exports.activate_user_cant_delete_active = "No es posible eliminar un usuari ya activo";
exports.activate_user_web_already_active = "El usuario que corresponde a esta cuenta de correo electrónico ya ha sido activado para su uso en nuestra página web. Acceda a ella con su contraseña o utilice el sistema de recuperación de contrasenya.";
exports.activate_user_mobile_already_active = "El usuario que corresponde a esta cuenta de correo electrónico ya ha sido activado para su uso en nuestra aplicacion móbil. Acceda a ella con su contraseña o utilice el sistema de recuperación de contrasenya.";
exports.activate_user_mobile_message = "Gracias por elegir Fiddeal. A partir de hoy, le ofreceremos contacto directo con sus establecimientos, ofertas en todo tipo de productos y descuentos personales por sus compras. Para acceder a su cuenta, introduzca el código que aparece a continuación una vez haya completado el registro o haya iniciado sesión.";
exports.activate_user_web_message = "Gracias por elegir Fiddeal como su software de facturación y fidelización. A partir de hoy podrà realizar el cobro a sus clientes en cualquier moment y forma gracias a nuestra página web, ofrecerles ofertas y también programas de fidelización.";
//endregion

//region "Categories"
exports.categories_already_exists = "Category already exists";
exports.categories_category_not_found = "Category not found";
exports.subcategory_already_exists = "Subcategory already exists";
exports.subcategory_parent_not_found = "Parent category not found";
exports.subcategory_name_equal_to_parent = "Subcategory name can't be the same as parent";
exports.subcategory_not_found = "Subcategory not found";
exports.category_duplicated_name = "Category name already in use";
exports.subcategory_duplicated_name= "Subcategory name already in use";
exports.subcategory_new_parent_not_found = "New subcategory parent not found";
exports.error_subcategory_in_use = "Subcategory already being used. Can't delete.";
exports.error_category_in_use = "Category already begin used. Can't delete.";
//endregion

//region "Schedule"
exports.schedule_invalid_body_openingDays = "Missing OpeningDays property in request body";
exports.schedule_empty_body = "Missing body in request";
exports.schedule_invalid_body_dayNumber = "Missing dayNumber property in request body";
exports.schedule_not_initialized = "Can't update uninitalized schedule.";
exports.schedule_already_initialized = "Can't reinitialize schedule. Please, use update request.";
exports.schedule_duplicated_day_number = function(dayNumber){
    return enums.getDayString(dayNumber) + " schedule already defined previously.";
};
exports.schedule_opening_day_empty_info = "Empty day ranges information.";
exports.schedule_not_well_formed_range = function(begin,end,index){
    let beginError = getBeginError(begin);
    let endError = getEndError(end);
    return "Range not well formed. Begin value: "+beginError+" - End value: "+endError+". Day number: "+index;
};
function getBeginError(begin){
    if (!begin) return "undefined";
    else if (isNaN(begin)) return "Nan";
    else return begin;
}

function getEndError(end){
    if (!end) return "undefined";
    else if (isNaN(end)) return "Nan";
    else return end;
}
//endregion


//region "Fidelization params"
exports.fidelization_params_empty_body = "Empty request body recived.";
exports.fidelization_params_min_discount_error = "Minimum value must be "+manager.minDiscountEquivalence;
exports.fidelization_params_max_discount_error = "Maximum value must be "+manager.maxDiscountEquivalence;
exports.fidelization_params_invalid_life = "Minimum discount life is "+manager.minDiscountLife+". You can algo set that it doesn't expires.";
//endregion

//region "Products"
exports.product_cant_set_arrival_date_with_stock = "Si dispone de stock no puede indicar fecha de llegada.";
exports.product_stock_non_available_with_units = "Producto no disponible con unidades registradas.";
exports.product_stock_available_without_units = "Producto disponible sin unidades registradas.";
exports.product_stock_deprecated_with_units = "Producto descatalogado con unidades.";
exports.product_stock_outlet_without_units = "Producto outlet sin unidades.";
exports.product_stock_to_arrive_with_units = "Producto por llegar con unidades.";
exports.product_cant_set_arrival_date_without_to_arrive_state = "No puede indicar fecha de llegada si el producto no se encuentra agotado.";
exports.product_duplicated_reference = "Referència ya existente.";
exports.product_duplicated_name = "Nombre ya existente.";
exports.product_not_found = "Producto no encontrado";
exports.product_some_products_not_found = "Algunos productos no encontrados";
exports.offer_product_in_other_offer = "Productos añadidos prèviamente a otras ofertas vigentes en el mismo rango de dias.";
//endregion

//region "Offers"
exports.offer_not_found = "Oferta no encontrada.";
exports.offer_undefined_error = "Error inesperado.";
exports.offer_invalid_offer_type = "Tipo de oferta no válido.";
exports.offer_cant_update_expired = "No se puede actualizar una oferta ya terminada.";
exports.offer_cant_update_valid_since_started = "No se puede modificar la fecha de inicio de una oferta ya iniciada.";
exports.offer_cant_be_older = function(prop1,prop2){
    return prop1 + " no puede ser posterior a "+prop2;
};
exports.offer_cant_be_older_or_equal = function(prop1,prop2){
    return prop1 + " no puede ser posterior o igual a "+prop2;
};
exports.offer_duplicated_product = "Productos duplicados en la oferta.";
exports.offer_invalid_products_id = "Identificadores de productos no vàlidos en la oferta.";
exports.offer_cant_delete_started = "No se puede eliminar una oferta vigente.";
//endregion

//region "Fidelization discount"
exports.fidelization_discount_not_found = "Descuento no encontrado.";
exports.fidelization_discount_already_used = "Descuento ya usado.";
//endregion

//region "Compres/vendes"
exports.purchase_not_found = "Compra no encontrada.";
exports.purchase_empty_id = "Identificador de compra vacío.";
exports.purchase_empty_manual_comment = "Comentario denegación vacío.";
exports.purchase_already_linked_automatically = "Compra ya enlazada a un usuario en el local.";
exports.purchase_already_linked_manually = "Compra ya enlazada a un usuario de forma manual.";
exports.purchase_inconsistent_total = "Valor del subtotal no coincide con el total.";
//endregion

exports.subscription_not_found = "Suscripción no encontrada.";