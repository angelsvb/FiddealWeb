//region "Errors genèrics"
exports.request_ok = 0;
exports.undefined_error = 1;
exports.db_acces_error = 2;
exports.invalid_or_missing_token_error = 3;
exports.missing_param_type = 4;
exports.not_valid_type_error = 5;
exports.params_validation_error = 6;
exports.body_validation_error = 7;
exports.empty_body_error = 8;
exports.user_not_found = 9;
exports.json_format_error = 10;
exports.unexpected_request_error = 11;
//endregion

//region "Errors path /support"
exports.support_error_sending_mail = 15;
exports.support_undefined_error_sending_mail = 14;
exports.support_error_creating_mail = 13;
exports.support_error_creating_transporter = 12;
//endregion

//region "Errors path /user"
exports.user_already_exists = 12;
exports.user_invalid_password = 13;
//endregion

//region "Errors path /activation"
exports.activate_user_not_found = 12;
exports.activate_user_cant_delete_active = 13;
exports.activate_user_not_valid_code = 14;
//endregion

//region "Errors /credentials"
exports.user_credentials_error_generating_code = 12;
exports.user_credentials_not_found_user = 13;
//endregion

//region "Categories"
exports.categories_already_exists = 12;
exports.categories_category_not_found = 13;
exports.subcategory_already_exists = 14;
exports.subcategory_parent_not_found = 15;
exports.subcategory_not_found = 16;
exports.subcategory_name_equal_to_parent = 17;
exports.category_duplicated_name = 18;
exports.subcategory_duplicated_name = 19;
exports.subcategory_new_parent_not_found = 20;
exports.subcategory_in_use = 21;
exports.category_in_use = 22;
//endregion

//region "Schedule"
exports.schedule_already_initialized = 12;
exports.schedule_not_initialized = 13;
exports.schedule_invalid_body_dayNumber = 14;
exports.schedule_duplicated_day_number = 15;
exports.schedule_opening_day_empty_info = 16;
exports.schedule_not_well_formed_range = 17;
//endregion

//region "Products"
exports.product_not_found = 12;
exports.product_cant_delete_purchased = 13;
//endregion

//region "Fidelization discounts"
exports.fidelization_discount_not_found = 12;
exports.fidelization_discount_already_used = 13;
//endregion

//region "Ofertes"
exports.offer_cant_update_expired = 12;
exports.offer_cant_delete_started = 13;
exports.offer_not_found = 14;
//endregion

//region "Purchases/Sales"
exports.purchase_not_found = 12;
exports.purchase_already_linked_automatically = 13;
exports.purchase_already_linked_manually = 14;
//endregion

exports.subscription_not_found = 12;