
let Translations = require("./translations");

let inner_texts_request = {
    request_error_missing_path_key: "request_error_missing_path",
    request_error_missing_path_es: "No se ha especificado la ruta de la petición.",
    request_error_missing_path_ca: "No s'ha especificat la ruta de la petició.",
    request_error_missing_path_en: "Request route not specified.",

    request_error_missing_base_url_key: "request_error_missing_base_url",
    request_error_missing_base_url_es: "No se ha especificado la URL del servidor.",
    request_error_missing_base_url_ca: "No s'ha especificat la URL del servidor.",
    request_error_missing_base_url_en: "Server URL not specified.",

    request_error_invalid_timeout_key: "request_error_invalid_timeout",
    request_error_invalid_timeout_es: "Tiempo máximo de espera no valido.",
    request_error_invalid_timeout_ca: "Temps màxim d'espera no vàlid.",
    request_error_invalid_timeout_en: "Invalid maximum request time",

    request_error_parsing_values_key: "request_error_parsing_values",
    request_error_parsing_values_es: "Error construyendo cuerpo y/o cabecera de la petición.",
    request_error_parsing_values_ca: "Error construint cos i/o capçalera de la petició.",
    request_error_parsing_values_en: "Error building request body and header.",

    request_error_executing_request_key: "request_error_executing_request",
    request_error_executing_request_es: "Error ejecutando la petición.",
    request_error_executing_request_ca: "Error executant la petició.",
    request_error_executing_request_en: "Error executing request.",

    request_error_connection_key: "request_error_connection",
    request_error_connection_es: "Error conectando con el servidor. Compruebe su conexión a internet. En caso de disponer de conexión, contacte con el servició de atención al cliente para comprobar la disponibilidad del servicio.",
    request_error_connection_ca: "Error conectant amb el servidor. Comprovi la conexió a internet. En cas de disposar de conexió, contacti amb el servei d'atenció al client per comprovar la disponibilitat del servei.",
    request_error_connection_en: "Error conecting with the server. Check your internet connection. If connection is available, contact with the customer service to check if the service is available.",

    request_error_redirectioning_key: "request_error_redirectioning",
    request_error_redirectioning_es: "Petición no disponible. Requiere redireccionamiento.",
    request_error_redirectioning_ca: "Petició no disponible. Requereix redireccionament.",
    request_error_redirectioning_en: "Request not available. Redirection required.",

    request_error_client_http_key: "request_error_client_http",
    request_error_client_http_es: "Petición inexistente o no autorizada. Compruebe la acción que quiere realizar.",
    request_error_client_http_ca: "Petició no existent o no autoritzada. Comprovi la acció que vol realitzar.",
    request_error_client_http_en: "Request forbidden or not existing. Check the action that you want to do.",

    request_error_unexpected_key: "request_error_unexpected",
    request_error_unexpected_es: "Ooops, se ha producido un error inesperado.",
    request_error_unexpected_ca: "Ooops, s'ha produït un error inesperat.",
    request_error_unexpected_en: "Ooops, an unexpected error happened.",

    request_errorcode_not_treated_key: "request_errorcode_not_treated",
    request_errorcode_not_treated_es: "No se han especificado los textos de error.",
    request_errorcode_not_treated_en: "No s'han especificat els textes d'error.",
    request_errorcode_not_treated_ca: "Error texts not specified.",
};

exports.request_error_missing_path = Translations.translate(inner_texts_request, inner_texts_request.request_error_missing_path_key);
exports.request_error_missing_base_url = Translations.translate(inner_texts_request, inner_texts_request.request_error_missing_base_url_key);
exports.request_error_invalid_timeout = Translations.translate(inner_texts_request, inner_texts_request.request_error_invalid_timeout_key);
exports.request_error_parsing_values = Translations.translate(inner_texts_request, inner_texts_request.request_error_parsing_values_key);
exports.request_error_executing_request = Translations.translate(inner_texts_request, inner_texts_request.request_error_executing_request_key);
exports.request_error_connection = Translations.translate(inner_texts_request, inner_texts_request.request_error_connection_key);
exports.request_error_redirectioning = Translations.translate(inner_texts_request, inner_texts_request.request_error_redirectioning_key);
exports.request_error_client_http = Translations.translate(inner_texts_request, inner_texts_request.request_error_client_http_key);
exports.request_error_unexpected = Translations.translate(inner_texts_request, inner_texts_request.request_error_unexpected_key);
exports.request_errorcode_not_treated = Translations.translate(inner_texts_request, inner_texts_request.request_errorcode_not_treated_key);

let common_errors = {
    error_dialog_title_key: "error_dialog_title",
    error_dialog_title_es: "Atención",
    error_dialog_title_ca: "Atenció",
    error_dialog_title_en: "Attention",

    information_dialog_title_key: "information_dialog_title",
    information_dialog_title_es: "Atención",
    information_dialog_title_ca: "Atenció",
    information_dialog_title_en: "Attention",

    error_line_key: "error_line",
    error_line_es: "Línea",
    error_line_ca: "Linia",
    error_line_en: "Line",

    support_message_sent_key: "support_message_sent",
    support_message_sent_es: "Mensaje a atención al cliente enviado correctamente. En la mayor brevedad posible, alguien del departamento de soporte se pondrà en contacto con su establecimiento. Dispone de una cópia del mensaje enviado en la bandeja de entrada de su correo electrónico.",
    support_message_sent_ca: "Missatge a atenció al client enviat correctament. En la major brevetat possible algú del departament de suport es posarà en contacte amb el seu establiment. Disposa d'una copia del missatge enviat en la safata d'entrada del seu correu electrònic.",
    support_message_sent_en: "Customer service message sent. As soon as possible, someone from the support deparment will contact your establishment. You have a copy of the message in your email inbox.",
};

exports.error_dialog_title = Translations.translate(common_errors, common_errors.error_dialog_title_key);
exports.information_dialog_title = Translations.translate(common_errors, common_errors.information_dialog_title_key);
exports.error_line = Translations.translate(common_errors, common_errors.error_line);
exports.support_message_sent = Translations.translate(common_errors, common_errors.support_message_sent);

let auth_texts = {
    invalid_login_credentials_key: "invalid_login_credentials",
    invalid_login_credentials_es: "Nombre de usuario y/o contraseña no validos. Por favor, revise los datos de acceso introducidos.",
    invalid_login_credentials_ca: "Nom d'usuari i/o contrasenya no vàlids. Sisplau, revisi les dades d'accés introduïdes.",
    invalid_login_credentials_en: "Wrong username and/or password. Please, check the credentials introduced.",

    user_not_active_key: "user_not_active",
    user_not_active_es: "El usuario con el que ha iniciado sesión no ha sido activado. Por favor, introduzca el código que recibió en su correo electrónico durante el proceso de registro o solicite uno nuevo.",
    user_not_active_ca: "L'usuari amb el que ha iniciat sessión no ha estat activat. Sisplau, introdueixi el codi que va rebre en el seu correu electrónic durant el procés de registre o soliciti'n un de nou.",
    user_not_active_en: "The logged user hasn't been activate. Please, enter the activation code that you received during the sign up process or ask for another one.",

    missing_auth_data_key: "missing_auth_data",
    missing_auth_data_es: "Las credenciales del usuario no son válidas o han caducado. No dispone de permiso para acceder a esta opción. Será redirigido a la pantalla de inicio de sesión para verificar su identidad.",
    missing_auth_data_ca: "Les credencials de l'usuari no von vàlides o han caducat. No disposa de permís per accedir a aquesta opció. Serà redirigit a la pantalla d'inici de sessió per verificar la seva identitat.",
    missing_auth_data_en: "The user credentials expired or aren't valid anymore. You don't have access for this option. You'll be redirected to the sign in screen to verify your identity.",

    error_getting_user_data_key: "error_getting_user_data",
    error_getting_user_data_es: "No se ha podido acceder a los datos del usuario. La pagina volverá a cargar para repetir el proceso e intentar corregir el error. Si persiste, contacte con el servicio de atención al cliente.",
    error_getting_user_data_ca: "No s'ha pogut accedir a les dades de l'usuari. La pàgina tornarà a carregar per repetir el procés i corregir l'error. Si persisteix, contacti amb el servei d'atenció al client.",
    error_getting_user_data_en: "The user data is unaccessible. The page will refresh to retry the process and correct the error. If it persists, contact with the customer help service.",

    signup_successfull_key: "signup_successfull",
    signup_successfull_es: "Registro completado correctamente. Por favor, introduzca el código que ha recibido en su correo electrónico. Si no lo ha recibido compruebe su bandeja de SPAM o pida un reenvio.",
    signup_successfull_ca: "Registre completat correctament. Sisplau, introdueixi el codi que ha rebut al seu correu electrònic. Si no l'ha rebut, comprovi la safata de SPAM o soliciti un reenviament.",
    signup_successfull_en: "Sign up completed. Please, enter the activation code that was sent to your email. If you didn't received it, check your SPAM or ask for a new one.",

    confirm_close_session_key: "confirm_close_session",
    confirm_close_session_es: "¿Esta seguro de que desea cerrar la sesión?",
    confirm_close_session_ca: "Està segur de que vol tancar la sessió?",
    confirm_close_session_en: "Are you sure you want to logout?",

    password_changed_key: "password_changed",
    password_changed_es: "Contraseña modificada correctamente.",
    password_changed_ca: "Contrasenya modificada correctament.",
    password_changed_en: "Password update successful.",
};

exports.invalid_login_credentials = Translations.translate(auth_texts, auth_texts.invalid_login_credentials_key);
exports.user_not_active = Translations.translate(auth_texts, auth_texts.user_not_active_key);
exports.missing_auth_data = Translations.translate(auth_texts, auth_texts.missing_auth_data_key);
exports.error_getting_user_data = Translations.translate(auth_texts, auth_texts.error_getting_user_data_key);
exports.signup_successfull = Translations.translate(auth_texts, auth_texts.signup_successfull_key);
exports.confirm_close_session = Translations.translate(auth_texts, auth_texts.confirm_close_session_key);
exports.password_changed = Translations.translate(auth_texts, auth_texts.password_changed_key);

let error_code_texts = {
    errors_not_assigned_key: "errors_not_assigned",
    errors_not_assigned_es: "La petición ha devuelto errores de validación pero estos no se han podido asignar a su campo correspondiente.",
    errors_not_assigned_ca: "La petició ha retornat errors de validació però no s'han pogut assignar al camp corresponent.",
    errors_not_assigned_en: "The request returned some validation errors, but they hasn't been assigned to their field.",

    error_code_ok_key: "error_code_ok",
    error_code_ok_es: "Petición ejecutada correctamente. Recibido código de error 0 como respuesta.",
    error_code_ok_ca: "Petició executada correctament. Rebut codi d'error 0 com a resposta.",
    error_code_ok_en: "Request successful. Received error code 0.",

    error_code_undefined_key: "error_code_undefined",
    error_code_undefined_es: "Ooops, se ha producido un error inesperado en el servidor.",
    error_code_undefined_ca: "Ooops, s'ha produït un error inesperat en el servidor.",
    error_code_undefined_en: "Ooops. An unexpected error happened in the server.",

    error_code_db_access_key: "error_code_db_access",
    error_code_db_access_es: "Se ha producido un error accediendo a la base de datos. Si el error persiste contacte con el servicio de atención al cliente.",
    error_code_db_access_ca: "S'ha produït un error accedint a la base de dades. Si l'error persisteix contacti amb el servei d'atenció al client.",
    error_code_db_access_en: "An error happened accessing the database. If the error persists, contact the customer help service.",

    error_code_invalid_token_key: "error_code_invalid_token",
    error_code_invalid_token_es: "Las credenciales del usuario no són vàlidas. Será redirigido a la página de inicio para volver a iniciar sesión.",
    error_code_invalid_token_ca: "Les credencials de l'usuari no son vàlides. Serà redirigit a la pàgina d'inici per tornar a iniciar sessió.",
    error_code_invalid_token_en: "The user credentials aren't valid. You'll be redirected to the main page for logging in again.",

    error_code_missing_param_type_key: "error_code_missing_param_type",
    error_code_missing_param_type_es: "No se ha enviado el tipo de usuario. La petición no puede ser validada.",
    error_code_missing_param_type_ca: "No s'ha enviat el tipus d'usuari. La petició no pot ser validada.",
    error_code_missing_param_type_en: "User type not sent. The request couldn't be validated.",

    error_code_not_valid_type_key: "error_code_not_valid_type",
    error_code_not_valid_type_es: "El tipo de usuario que utiliza no tiene permiso para realizar esta operación.",
    error_code_not_valid_type_ca: "El tipus d'usuari que fa servir no té permís per realitzar aquesta operació.",
    error_code_not_valid_type_en: "Your user type doesn't have permission to make that action.",

    error_code_params_validation_error_key: "error_code_params_validation_error",
    error_code_params_validation_error_es: "Se ha producido un error en la validación de los valores enviados en la cabecera.",
    error_code_params_validation_error_ca: "S'ha produït un error en la validació dels paràmetres de capçalera.",
    error_code_params_validation_error_en: "An error happened validating header params.",

    error_code_body_validation_error_key: "error_code_body_validation_error",
    error_code_body_validation_error_es: "Se ha producido un error en la validación de los valores enviados en el cuerpo.",
    error_code_body_validation_error_ca: "S'ha produït un error en la validació dels paràmetres del cos.",
    error_code_body_validation_error_en: "An error happened validating body params.",

    error_code_empty_body_key: "error_code_empty_body",
    error_code_empty_body_es: "El servidor no ha recibido los datos necesários para ejecutar la petición.",
    error_code_empty_body_ca: "El servidor no ha rebut les dades necessàries per executar la petició.",
    error_code_empty_body_en: "The server didn't recived the minimum data for executing the request.",

    error_code_user_not_found_key: "error_code_user_not_found",
    error_code_user_not_found_es: "Usuario no encontrado.",
    error_code_user_not_found_ca: "Usuari no trobat.",
    error_code_user_not_found_en: "User not found.",

    error_code_json_format_error_key: "error_code_json_format_error",
    error_code_json_format_error_es: "El formato de los datos enviados no era valido.",
    error_code_json_format_error_ca: "El format de les dades no és vàlid.",
    error_code_json_format_error_en: "Unexpected data format",

    error_code_unexpected_request_error_key: "error_code_unexpected_request_error",
    error_code_unexpected_request_error_es: "Se ha intentado ejecutar una petición que no se encuentra entre las acciones disponibles. Por favor, contacte con el servicio de atención al cliente.",
    error_code_unexpected_request_error_ca: "S'ha intentat executar una petició que no es troba entre les accions disponibles. Sisplau, concacti amb el servei d'atenció al client.",
    error_code_unexpected_request_error_en: "You tried to execute an action that's not included in the valid actions set. Please, contact with the customer help service.",

    error_code_not_defined_key: "error_code_not_defined",
    error_code_not_defined_es: "Código de error no esperado. Compruebe la implementación de la petición.",
    error_code_not_defined_ca: "Codi d'error no especificat. Comprovi l'implementació de la petició.",
    error_code_not_defined_en: "Error code non specified. Check the request implementation. ",

    error_code_user_already_exists_key: "error_code_user_already_exists",
    error_code_user_already_exists_es: "Correo electrónico ya registrado. Por favor, inicie sesión con sus credenciales de acceso.",
    error_code_user_already_exists_ca: "Correu electrònic ja registrat. Sisplau, entri amb les seves credencials d'accés.",
    error_code_user_already_exists_en: "Email already in use. Please, enter with your sign in credentials.",

    error_code_invalid_password_key: "error_code_invalid_password",
    error_code_invalid_password_es: "Contraseña incorrecta o con un formato no valido.",
    error_code_invalid_password_ca: "Contrasenya incorrecta o amb un format no vàlid.",
    error_code_invalid_password_en: "Wrong password or invalid format.",

    empty_error_code_key: "empty_error_code",
    empty_error_code_es: "Código de error no especificado. Contacte con atención al cliente.",
    empty_error_code_ca: "Codi d'error no especificat. Concati amb atenció al client.",
    empty_error_code_en: "Error code non specified. Contact with customer help service.",
};

exports.errors_not_assigned = Translations.translate(error_code_texts, error_code_texts.errors_not_assigned_key);
exports.error_code_ok = Translations.translate(error_code_texts, error_code_texts.error_code_ok_key);
exports.error_code_undefined = Translations.translate(error_code_texts, error_code_texts.error_code_undefined_key);
exports.error_code_db_access = Translations.translate(error_code_texts, error_code_texts.error_code_db_access_key);
exports.error_code_invalid_token = Translations.translate(error_code_texts, error_code_texts.error_code_invalid_token_key);
exports.error_code_missing_param_type = Translations.translate(error_code_texts, error_code_texts.error_code_missing_param_type_key);
exports.error_code_not_valid_type = Translations.translate(error_code_texts, error_code_texts.error_code_not_valid_type_key);
exports.error_code_params_validation_error = Translations.translate(error_code_texts, error_code_texts.error_code_params_validation_error_key);
exports.error_code_body_validation_error = Translations.translate(error_code_texts, error_code_texts.error_code_body_validation_error_key);
exports.error_code_empty_body = Translations.translate(error_code_texts, error_code_texts.error_code_empty_body_key);
exports.error_code_user_not_found = Translations.translate(error_code_texts, error_code_texts.error_code_user_not_found_key);
exports.error_code_json_format_error = Translations.translate(error_code_texts, error_code_texts.error_code_json_format_error_key);
exports.error_code_unexpected_request_error = Translations.translate(error_code_texts, error_code_texts.error_code_unexpected_request_error_key);
exports.error_code_not_defined = Translations.translate(error_code_texts, error_code_texts.error_code_not_defined_key);
exports.error_code_user_already_exists = Translations.translate(error_code_texts, error_code_texts.error_code_user_already_exists_key);
exports.error_code_invalid_password = Translations.translate(error_code_texts, error_code_texts.error_code_invalid_password_key);
exports.empty_error_code = Translations.translate(error_code_texts, error_code_texts.empty_error_code_key);

let user_credentials_texts = {
    user_credentials_user_not_found_key : "user_credentials_user_not_found",
    user_credentials_user_not_found_es: "Usuari no encontrado en el sistema. Por favor, complete el proceso de registro para poder utilizar la página web.",
    user_credentials_user_not_found_ca: "Usuari no trobat en el sistema. Sisplau, completi el procés de registre per poder utilitzar la pàgina web.",
    user_credentials_user_not_found_en: "User not found. Please, complete the sign up process for being able to use the website.",

    user_credentials_error_generating_code_key : "user_credentials_error_generating_code",
    user_credentials_error_generating_code_es: "Error generando código de recuperación. Por favor, contacte con el servicio de atención al cliente.",
    user_credentials_error_generating_code_ca: "Error generant el codi de recuperació. Sisplau, contacti amb el servei d'atenció al client.",
    user_credentials_error_generating_code_en: "Error creating recovery code. Please, contact with customer help service.",

    user_credentials_recovery_sent_key : "user_credentials_recovery_sent",
    user_credentials_recovery_sent_es: "Se ha mandado un correo electrónico con un código de recuperación de contraseña. Por favor, entre el código en la siguiente ventana y establezca una nueva contraseña. Recuerde que el código caduca dentro de 24 horas y deberá repetir el proceso si no lo utiliza en ese plazo.",
    user_credentials_recovery_sent_ca: "S'ha enviat un correu electrònic amb un codi de recuperació de contrasenya. Sisplau, introdueixi el codi a la següent finestra i configuri una nova contrasenya. Recordi que el codi caduca en 24 hores i que haurà de repetir el procés si no l'utilitza en aquest plaç.",
    user_credentials_recovery_sent_en: "A mail has been sent with a recovery code. Please, enter the code in the following dialog and configure a new password. The code lasts for 24 hours and if you don't use it, you'll have to ask for another one.",

    user_credentials_recovery_success_key : "user_credentials_recovery_success",
    user_credentials_recovery_success_es: "Contraseña modificada correctamente. Ya puede iniciar sesión en la página web.",
    user_credentials_recovery_success_ca: "Contrasenya modificada correctament. Ja pot iniciar sessió a la pàgina web.",
    user_credentials_recovery_success_en: "Password update successful. You can enter now in the website.",

    user_credentials_activate_mail_sent_key : "user_credentials_activate_mail_sent",
    user_credentials_activate_mail_sent_es: "Correo de activación enviado. Por favor, compruebe su bandeja de entrada y la bandeja de correo electrónico no deseado.",
    user_credentials_activate_mail_sent_ca: "Correu d'activació enviat. Sisplau, comprovi la seva safata d'entrada i la la safata de correu no desitjat.",
    user_credentials_activate_mail_sent_en: "Activation mail sent. Please, check your inbox mail and your SPAM folder.",

    user_credentials_user_deleted_key : "user_credentials_user_deleted",
    user_credentials_user_deleted_es: "El proceso de registro se ha cancelado correctamente. El usuario especificado ya no se encuentra en nuestro sistema y puede volver a registrarlo si lo cree conveniente.",
    user_credentials_user_deleted_ca: "Procés de registre cancel·lat correctament. L'usuari especificat ja no es troba en el nostre sistema.",
    user_credentials_user_deleted_en: "Sign up process cancelled. The user has been deleted from the system.",
};

exports.user_credentials_user_not_found = Translations.translate(user_credentials_texts, user_credentials_texts.user_credentials_user_not_found_key);
exports.user_credentials_error_generating_code = Translations.translate(user_credentials_texts, user_credentials_texts.user_credentials_error_generating_code_key);
exports.user_credentials_recovery_sent = Translations.translate(user_credentials_texts, user_credentials_texts.user_credentials_recovery_sent_key);
exports.user_credentials_recovery_success = Translations.translate(user_credentials_texts, user_credentials_texts.user_credentials_recovery_success_key);
exports.user_credentials_activate_mail_sent = Translations.translate(user_credentials_texts, user_credentials_texts.user_credentials_activate_mail_sent_key);
exports.user_credentials_user_deleted = Translations.translate(user_credentials_texts, user_credentials_texts.user_credentials_user_deleted_key);

let user_activation_texts = {
    user_activation_not_found_key : "user_activation_not_found",
    user_activation_not_found_es: "El usuario introducido no existe en el sistema.",
    user_activation_not_found_ca: "L'usuari introduït no existeix en el sistema.",
    user_activation_not_found_en: "The entered user doesn't exist in the system.",

    user_activation_cant_delete_active_key : "user_activation_cant_delete_active",
    user_activation_cant_delete_active_es: "El usuario introducido ya ha sido activado, no puede cancelar su proceso de registro.",
    user_activation_cant_delete_active_ca: "L'usuari ja ha estat activat, no pot cancel·lar el seu procés de registre.",
    user_activation_cant_delete_active_en: "The user is already active, it's not possible to cancel the sign up process.",

    user_activation_not_valid_code_key : "user_activation_not_valid_code",
    user_activation_not_valid_code_es: "Código de activación no valido. Compruebe el valor introducido o solicite otro código.",
    user_activation_not_valid_code_ca: "Codi d'activació no vàlid. Comprovi el valor introduït o soliciti un altre codi.",
    user_activation_not_valid_code_en: "Wrong activation code. Check the value or ask for a new one.",
};

exports.user_activation_not_found = Translations.translate(user_activation_texts, user_activation_texts.user_activation_not_found_key);
exports.user_activation_cant_delete_active = Translations.translate(user_activation_texts, user_activation_texts.user_activation_cant_delete_active_key);
exports.user_activation_not_valid_code = Translations.translate(user_activation_texts, user_activation_texts.user_activation_not_valid_code_key);

let validation_texts = {
    validation_empty_string_key: "validation_empty_string",
    validation_empty_string_es: "Valor obligatório.",
    validation_empty_string_ca: "Valor obligatòri.",
    validation_empty_string_en: "Compulsory value.",

    validation_too_large_key: "validation_too_large",
    validation_too_large_es: "Valor demasiado grande. Máximo: ",
    validation_too_large_ca: "Valor massa gran. Màxim: ",
    validation_too_large_en: "Too large value. Max: ",

    validation_too_small_key: "validation_too_small",
    validation_too_small_es: "Valor demasiado pequeño. Mínimo: ",
    validation_too_small_ca: "Valor massa petit. Mínim: ",
    validation_too_small_en: "Too small value. Min:",

    validation_non_string_key: "validation_non_string",
    validation_non_string_es: "Formato no valido.",
    validation_non_string_ca: "Format no vàlid.",
    validation_non_string_en: "Invalid format.",

    validation_email_format_key: "validation_email_format",
    validation_email_format_es: "Correo electrónico no valido.",
    validation_email_format_ca: "Correu electrònic no vàlid.",
    validation_email_format_en: "Invalid email format.",

    validation_too_short_key: "validation_too_short",
    validation_too_short_es: "Longitud mínima no superada.",
    validation_too_short_ca: "Longitud mínima no superada.",
    validation_too_short_en: "Not enough length.",

    validation_too_long_key: "validation_too_long",
    validation_too_long_es: "Longitud máxima superada.",
    validation_too_long_ca: "Longitud màxima superada.",
    validation_too_long_en: "Length overflow.",

    validation_nan_key: "validation_nan",
    validation_nan_es: "Valor no numérico.",
    validation_nan_ca: "Valor no numèric.",
    validation_nan_en: "Non numeric value.",

    validation_non_safe_password_key: "validation_non_safe_password",
    validation_non_safe_password_es: "La contraseña debe contener almenos un dígito y una letra.",
    validation_non_safe_password_ca: "La contrasenya ha de tenir com a mínim un dígit i una lletra.",
    validation_non_safe_password_en: "The password must contain at least a number and a letter.",

    validation_non_equal_confirmation_key: "validation_non_equal_confirmation",
    validation_non_equal_confirmation_es: "Las contraseñas no coinciden.",
    validation_non_equal_confirmation_ca: "Las contrasenyes no coincideixen.",
    validation_non_equal_confirmation_en: "Confirmation password non equal.",

    validation_must_check_key: "validation_must_check",
    validation_must_check_es: "Tiene que aceptar los terminos y condiciones para completar el registro.",
    validation_must_check_ca: "Ha d'acceptar els termes i condicions per completar el registre.",
    validation_must_check_en: "You must accept terms and conditions to complete the sign up process.",

    validation_CP_format_key: "validation_CP_format",
    validation_CP_format_es: "Código postal no valido.",
    validation_CP_format_ca: "Codi postal no vàlid.",
    validation_CP_format_en: "Invalid postal code.",

    cif_not_valid_key: "cif_not_valid",
    cif_not_valid_es: "Formato de CIF no valido.",
    cif_not_valid_ca: "Format de CIF no vàlid.",
    cif_not_valid_en: "Wrong CIF format.",

    validation_not_text_key: "validation_not_text",
    validation_not_text_es: "Dígitos y símbolos no admitidos.",
    validation_not_text_ca: "Digits i símbols no admesos.",
    validation_not_text_en: "Digits and symbols not allowed.",

    validation_select_option_key: "validation_select_option",
    validation_select_option_es: "Seleccione una opción",
    validation_select_option_ca: "Seleccioni una opció",
    validation_select_option_en: "Select an option"
};

exports.validation_empty_string = Translations.translate(validation_texts, validation_texts.validation_empty_string_key);
exports.validation_too_large = function(max) {
    return Translations.translate(validation_texts, validation_texts.validation_too_large_key) + max;
};

exports.validation_too_small = function(min) {
    return Translations.translate(validation_texts, validation_texts.validation_too_small_key) + min;
};
exports.validation_non_string = Translations.translate(validation_texts, validation_texts.validation_non_string_key);
exports.validation_email_format = Translations.translate(validation_texts, validation_texts.validation_email_format_key);
exports.validation_too_short = Translations.translate(validation_texts, validation_texts.validation_too_short_key);
exports.validation_too_long = Translations.translate(validation_texts, validation_texts.validation_too_long_key);
exports.validation_nan = Translations.translate(validation_texts, validation_texts.validation_nan_key);
exports.validation_non_safe_password = Translations.translate(validation_texts, validation_texts.validation_non_safe_password_key);
exports.validation_non_equal_confirmation = Translations.translate(validation_texts, validation_texts.validation_non_equal_confirmation_key);
exports.validation_must_check = Translations.translate(validation_texts, validation_texts.validation_must_check_key);
exports.validation_CP_format = Translations.translate(validation_texts, validation_texts.validation_CP_format_key);
exports.cif_not_valid = Translations.translate(validation_texts, validation_texts.cif_not_valid_key);
exports.validation_not_text = Translations.translate(validation_texts, validation_texts.validation_not_text_key);
exports.validation_select_option = Translations.translate(validation_texts, validation_texts.validation_select_option_key);

let schedule_texts = {
    schedule_already_initialized_key: "schedule_already_initialized",
    schedule_already_initialized_es: "Horario ya inicializado. Por favor, modifiquelo en la opción correspondiente.",
    schedule_already_initialized_ca: "Horari ja inicialitzat. Sisplau, modifiqui'l en l'opció corresponent.",
    schedule_already_initialized_en: "Schedule already initialized. You can modify it in the corresponding option.",

    schedule_not_initialized_key: "schedule_not_initialized",
    schedule_not_initialized_es: "Horari no inicializado. Indique el horari del establecimiento.",
    schedule_not_initialized_ca: "Horari no inicialitzat. Indiqui l'horari de l'establiment.",
    schedule_not_initialized_en: "Schedule not initialized. Enter the establishment schedule.",

    schedule_invalid_body_dayNumber_key: "schedule_invalid_body_dayNumber",
    schedule_invalid_body_dayNumber_es: "Día de la semana no valido.",
    schedule_invalid_body_dayNumber_ca: "Dia de la setmana no vàlid.",
    schedule_invalid_body_dayNumber_en: "Invalid weekday.",

    schedule_duplicated_day_number_key: "schedule_duplicated_day_number",
    schedule_duplicated_day_number_es: "Día de la semana duplicado.",
    schedule_duplicated_day_number_ca: "Dia de la setmana duplicat.",
    schedule_duplicated_day_number_en: "Duplicated weekday.",

    schedule_opening_day_empty_info_key: "schedule_opening_day_empty_info",
    schedule_opening_day_empty_info_es: "Información de día de apertura vacía.",
    schedule_opening_day_empty_info_ca: "Informació del dia d'obertura buida.",
    schedule_opening_day_empty_info_en: "Opening day information empty.",

    schedule_not_well_formed_range_key: "schedule_not_well_formed_range",
    schedule_not_well_formed_range_es: "Rango no valido.",
    schedule_not_well_formed_range_ca: "Rang no vàlid.",
    schedule_not_well_formed_range_en: "Invalid range.",

    schedule_cant_close_allways_key: "schedule_cant_close_allways",
    schedule_cant_close_allways_es: "Debe marcar almenos un día como abierto.",
    schedule_cant_close_allways_ca: "Ha de marcar almenys un dia com a obert.",
    schedule_cant_close_allways_en: "At least one day must be opened."
};

exports.schedule_already_initialized = Translations.translate(schedule_texts, schedule_texts.schedule_already_initialized_key);
exports.schedule_not_initialized = Translations.translate(schedule_texts, schedule_texts.schedule_not_initialized_key);
exports.schedule_invalid_body_dayNumber = Translations.translate(schedule_texts, schedule_texts.schedule_invalid_body_dayNumber_key);
exports.schedule_duplicated_day_number = Translations.translate(schedule_texts, schedule_texts.schedule_duplicated_day_number_key);
exports.schedule_opening_day_empty_info = Translations.translate(schedule_texts, schedule_texts.schedule_opening_day_empty_info_key);
exports.schedule_not_well_formed_range = Translations.translate(schedule_texts, schedule_texts.schedule_not_well_formed_range_key);
exports.schedule_cant_close_allways = Translations.translate(schedule_texts, schedule_texts.schedule_cant_close_allways_key);

let unclassified_errors = {
    non_positive_number_key: "non_positive_number",
    non_positive_number_es: "El valor debe ser positivo.",
    non_positive_number_ca: "El valor ha de ser positiu.",
    non_positive_number_en: "The value must be positive.",

    non_zero_numb_key: "non_zero_numb",
    non_zero_numb_es: "El valor debe ser 0.",
    non_zero_numb_ca: "El valor ha de ser 0.",
    non_zero_numb_en: "The value must be 0.",

    non_empty_value_key: "non_empty_value",
    non_empty_value_es: "El valor debe ser vacío.",
    non_empty_value_ca: "El valor ha de ser buit.",
    non_empty_value_en: "The value must be empty.",

    date_too_small_key: "date_too_small",
    date_too_small_es: "Fecha demasiado pequeña.",
    date_too_small_ca: "Data massa petita.",
    date_too_small_en: "Too small date.",

    invalid_date_format_key: "invalid_date_format",
    invalid_date_format_es: "Formato de fecha no valido. ",
    invalid_date_format_ca: "Format de data no válid. ",
    invalid_date_format_en: "Incorrect date format.",

    product_not_found_key: "product_not_found",
    product_not_found_es: "Producto no encontrado. Por favor, vuelva a escaner el código de barras o introduzcalo manualmente.",
    product_not_found_ca: "Producte no trobat. Sisplau, torni a escanejar el codi de barres o entri'l manualment.",
    product_not_found_en: "Product not found. Please, scan again the barcode of enter it manually.",

    user_not_found_key: "user_not_found",
    user_not_found_es: "Usuario no encontrado, por favor, verifique el código de usuario introducido.",
    user_not_found_ca: "Usuari no trobat. Sisplau, verifiqui el codi d'usuari entrat.",
    user_not_found_en: "User not found. Please, check the entered code.",

    subcategory_not_found_key: "subcategory_not_found",
    subcategory_not_found_es: "Subcategoria no encontrada.",
    subcategory_not_found_ca: "Subcategoria no trobada.",
    subcategory_not_found_en: "Subcategory not found.",

    subcategory_name_equal_parent_key: "subcategory_name_equal_parent",
    subcategory_name_equal_parent_es: "El nombre de la subcategoria no puede ser el mismo que el de la categoria padre.",
    subcategory_name_equal_parent_ca: "El nom de la subcategoria no pot ser el mateix que el de la categoria pare.",
    subcategory_name_equal_parent_en: "The subcategory name can't be the same as the parent.",

    category_not_found_key: "category_not_found",
    category_not_found_es: "Categoria no encontrada.",
    category_not_found_ca: "Categoria no trobada.",
    category_not_found_en: "Category not found.",

    category_already_exists_key: "category_already_exists",
    category_already_exists_es: "Ya hay una categoria con este nombre. Por favor, introduzca otro valor.",
    category_already_exists_ca: "Ja hi ha una categoria amb aquest nom. Sisplau, introdueixi un altre valor.",
    category_already_exists_en: "There is already a category with that name. Please, choose an other name.",

    subcategory_already_exists_key: "subcategory_already_exists",
    subcategory_already_exists_es: "Ya hay una subcategoria con este nombre. Por favor, introduzca otro valor.",
    subcategory_already_exists_ca: "Ja hi ha una subcategoria amb aquest nom. Sisplau, introdueixi un altre valor.",
    subcategory_already_exists_en: "There is already a subcategory with that name. Please, choose an other name.",

    product_cant_delete_purchased_key: "product_cant_delete_purchased",
    product_cant_delete_purchased_es: "Producto ya utilizado en una venta. No se puede eliminar.",
    product_cant_delete_purchased_ca: "Producte ja utilitzat en una venta. No es pot eliminar.",
    product_cant_delete_purchased_en: "Product already used in a sale. Delete not allowed.",

    category_in_use_key: "category_in_use",
    category_in_use_es: "Categoria en uso. No se puede eliminar.",
    category_in_use_ca: "Categoria en us. No es pot eliminar.",
    category_in_use_en: "Category in use. Delete not allowed.",

    subcategory_in_use_key: "subcategory_in_use",
    subcategory_in_use_es: "Subcategoria en uso. No se puede eliminar.",
    subcategory_in_use_ca: "Subcategoria en us. No es pot eliminar.",
    subcategory_in_use_en: "Subcategory in use. Delete not allowed."
};

exports.non_positive_number = Translations.translate(unclassified_errors, unclassified_errors.non_positive_number_key);
exports.non_zero_numb = Translations.translate(unclassified_errors, unclassified_errors.non_zero_numb_key);
exports.non_empty_value = Translations.translate(unclassified_errors, unclassified_errors.non_empty_value_key);
exports.date_too_small = Translations.translate(unclassified_errors, unclassified_errors.date_too_small_key);
exports.invalid_date_format = Translations.translate(unclassified_errors, unclassified_errors.invalid_date_format_key);
exports.product_not_found = Translations.translate(unclassified_errors, unclassified_errors.product_not_found_key);
exports.product_cant_delete_purchased = Translations.translate(unclassified_errors, unclassified_errors.product_cant_delete_purchased_key);
exports.user_not_found = Translations.translate(unclassified_errors, unclassified_errors.user_not_found_key);
exports.subcategory_not_found = Translations.translate(unclassified_errors, unclassified_errors.subcategory_not_found_key);
exports.subcategory_name_equal_parent = Translations.translate(unclassified_errors, unclassified_errors.subcategory_name_equal_parent_key);
exports.category_not_found = Translations.translate(unclassified_errors, unclassified_errors.category_not_found_key);
exports.category_already_exists = Translations.translate(unclassified_errors, unclassified_errors.category_already_exists_key);
exports.subcategory_already_exists = Translations.translate(unclassified_errors, unclassified_errors.subcategory_already_exists_key);
exports.subcategory_in_use = Translations.translate(unclassified_errors, unclassified_errors.subcategory_in_use_key);
exports.category_in_use = Translations.translate(unclassified_errors, unclassified_errors.category_in_use_key);

let exception_errors = {
    exception_unable_show_without_id_key : "exception_unable_show_without_id",
    exception_unable_show_without_id_es : "Error: no se puede mostrar el elemento sin un id",
    exception_unable_show_without_id_ca : "Error: no es pot mostrar l'element sense un id",
    exception_unable_show_without_id_en : "Error: unable to show elem without id",

    exception_unable_hide_without_id_key : "exception_unable_hide_without_id",
    exception_unable_hide_without_id_es : "Error: no se puede ocultar el elemento sin un id",
    exception_unable_hide_without_id_ca : "Error: no es pot ocultar l'element sense un id",
    exception_unable_hide_without_id_en : "Error: unable to hide elem without id",

    exception_anonimous_function_key : "exception_anonimous_function",
    exception_anonimous_function_es : "Error: función anónima recibida",
    exception_anonimous_function_ca : "Error: funció anònima rebuda",
    exception_anonimous_function_en : "Error: Anonimous function recived",

    exception_undefined_validation_result_key : "exception_undefined_validation_result",
    exception_undefined_validation_result_es : "Error: resultado de validación sin definir con el id -> ",
    exception_undefined_validation_result_ca : "Error: resultat de la validació sense definir amb el id -> ",
    exception_undefined_validation_result_en : "Error: undefined validation result of input with id -> ",

    exception_undefined_view_id_or_not_found_key : "exception_undefined_view_id_or_not_found",
    exception_undefined_view_id_or_not_found_es : "Error: identificador sin definir o input no encontrado -> ",
    exception_undefined_view_id_or_not_found_ca : "Error: identificador sin definir o input no encontrado -> ",
    exception_undefined_view_id_or_not_found_en : "Error: undefined view id or input not found -> ",

    exception_duplicated_query_param_key : "exception_duplicated_query_param",
    exception_duplicated_query_param_es : "Error: parametro query duplicado",
    exception_duplicated_query_param_ca : "Error: paràmetre query duplicat",
    exception_duplicated_query_param_en : "Error: duplicated query param",

    exception_duplicated_body_param_key : "exception_unable_show_without_id",
    exception_duplicated_body_param_es : "Error: parametro body duplicado",
    exception_duplicated_body_param_ca : "Error: paràmetre body duplicat",
    exception_duplicated_body_param_en : "Error: duplicated param in body"
};

exports.exception_unable_show_without_id = Translations.translate(exception_errors, exception_errors.exception_unable_show_without_id_key);
exports.exception_unable_hide_without_id = Translations.translate(exception_errors, exception_errors.exception_unable_hide_without_id_key);
exports.exception_anonimous_function = Translations.translate(exception_errors, exception_errors.exception_anonimous_function_key);
exports.exception_undefined_validation_result = Translations.translate(exception_errors, exception_errors.exception_undefined_validation_result_key);
exports.exception_undefined_view_id_or_not_found = Translations.translate(exception_errors, exception_errors.exception_undefined_view_id_or_not_found_key);
exports.exception_duplicated_query_param = Translations.translate(exception_errors, exception_errors.exception_duplicated_query_param_key);
exports.exception_duplicated_body_param = Translations.translate(exception_errors, exception_errors.exception_duplicated_body_param_key);

let business_type = {
    business_type_commerce_key : "business_type_commerce",
    business_type_commerce_es : "Comercio",
    business_type_commerce_ca : "Comerç",
    business_type_commerce_en : "Commerce",

    business_type_restaurant_key : "business_type_restaurant",
    business_type_restaurant_es : "Restaurante",
    business_type_restaurant_ca : "Restaurant",
    business_type_restaurant_en : "Restaurant",

    business_type_hair_key : "business_type_hair",
    business_type_hair_es : "Perruqueria",
    business_type_hair_ca : "Perruquería",
    business_type_hair_en : "Hairdressing",

    business_type_veterinary_key : "business_type_veterinary",
    business_type_veterinary_es : "Veterinario",
    business_type_veterinary_ca : "Veterinari",
    business_type_veterinary_en : "Veterinary"
};

exports.business_type_commerce = Translations.translate(business_type, business_type.business_type_commerce_key);
exports.business_type_restaurant = Translations.translate(business_type, business_type.business_type_restaurant_key);
exports.business_type_hair = Translations.translate(business_type, business_type.business_type_hair_key);
exports.business_type_veterinary = Translations.translate(business_type, business_type.business_type_veterinary_key);

let stock_state = {
    stock_state_undefined_key : "stock_state_undefined",
    stock_state_undefined_es : "N/D",
    stock_state_undefined_ca : "N/D",
    stock_state_undefined_en : "N/D",

    stock_state_available_key : "stock_state_available",
    stock_state_available_es : "DISPONIBLE",
    stock_state_available_ca : "DISPONIBLE",
    stock_state_available_en : "AVAILABLE",

    stock_state_descatalogado_key : "stock_state_descatalogado_key",
    stock_state_descatalogado_es : "DESCATALOGADO",
    stock_state_descatalogado_ca : "DESCATALOGAT",
    stock_state_descatalogado_en : "DISCONTINUED",

    stock_state_outlet_key : "stock_state_outlet",
    stock_state_outlet_es : "OUTLET",
    stock_state_outlet_ca : "OUTLET",
    stock_state_outlet_en : "OUTLET",

    stock_state_non_available_key : "business_type_veterinary",
    stock_state_non_available_es : "NO DISPONIBLE",
    stock_state_non_available_ca : "NO DISPONIBLE",
    stock_state_non_available_en : "NON AVAILABLE",

    stock_state_arriving_key : "stock_state_arriving",
    stock_state_arriving_es : "POR LLEGAR",
    stock_state_arriving_ca : "PER ARRIBAR",
    stock_state_arriving_en : "ARRIVING"
};

exports.stock_state_undefined = Translations.translate(stock_state, stock_state.stock_state_undefined_key);
exports.stock_state_available = Translations.translate(stock_state, stock_state.stock_state_available_key);
exports.stock_state_descatalogado = Translations.translate(stock_state, stock_state.stock_state_descatalogado_key);
exports.stock_state_outlet = Translations.translate(stock_state, stock_state.stock_state_outlet_key);
exports.stock_state_non_available = Translations.translate(stock_state, stock_state.stock_state_non_available_key);
exports.stock_state_arriving = Translations.translate(stock_state, stock_state.stock_state_arriving_key);

let general = {
    default_select_option_key : "default_select_option",
    default_select_option_es : "Seleccione una opción...",
    default_select_option_ca : "Seleccioni una opció...",
    default_select_option_en : "Select an option...",

    payment_method_cash_key : "payment_method_cash",
    payment_method_cash_es : "EFECTIVO",
    payment_method_cash_ca : "EFECTIU",
    payment_method_cash_en : "CASH",

    payment_method_card_key : "payment_method_card",
    payment_method_card_es : "TARJETA",
    payment_method_card_ca : "TARGETA",
    payment_method_card_en : "CARD",

    empty_purchases_alert_key : "empty_purchases_alert",
    empty_purchases_alert_es : "No se dispone aún de compras registradas en la aplicación.",
    empty_purchases_alert_ca : "Encara no es disposa de compres registrades en l'aplicació.",
    empty_purchases_alert_en : "No purchases registered in the application.",

    yes_key : "yes",
    yes_es : "SI",
    yes_ca : "SI",
    yes_en : "YES",

    no_key : "no",
    no_es : "NO",
    no_ca : "NO",
    no_en : "NO",

    not_defined_key : "not_defined",
    not_defined_es : "N/D",
    not_defined_ca : "N/D",
    not_defined_en : "N/D",

    business_name_placeholder_key : "business_name_placeholder",
    business_name_placeholder_es : "<Nombre Empresa>",
    business_name_placeholder_ca : "<Nom Empresa>",
    business_name_placeholder_en : "<Business Name>",

    realizar_cobro_key : "realizar_cobro",
    realizar_cobro_es : "Realizar cobro",
    realizar_cobro_ca : "Realitzar cobrament",
    realizar_cobro_en : "Collect",

    for_each_key : "for_each",
    for_each_es : "por cada",
    for_each_ca : "per cada",
    for_each_en : "for each",

    cookies_message_key: "cookies_message",
    cookies_message_es: "Este sitio web utiliza cookies para garantizar una mejor experiéncia en nuestro sitio web. Si continua navegando acepta nuestra política de cookies.",
    cookies_message_ca: "Aquest lloc web utilitza cookies per garantir la millor experiència al nostre lloc web. En continuar la navegació entenem que s’accepta la nostra política de cookies.",
    cookies_message_en: "This website uses cookies to ensure a better experience on our website. If you continue browsing, you accept our cookies policy.",

    cookies_accept_key: "cookies_accept",
    cookies_accept_es: "Acepta",
    cookies_accept_ca: "Accepta",
    cookies_accept_en: "Accept"
};


exports.payment_method_cash = Translations.translate(general, general.payment_method_cash_key);
exports.payment_method_card = Translations.translate(general, general.payment_method_card_key);
exports.empty_purchases_alert = Translations.translate(general, general.empty_purchases_alert_key);
exports.yes = Translations.translate(general, general.yes_key);
exports.no = Translations.translate(general, general.no_key);
exports.not_defined = Translations.translate(general, general.not_defined_key);
exports.business_name_placeholder = Translations.translate(general, general.business_name_placeholder_key);
exports.realizar_cobro = Translations.translate(general, general.realizar_cobro_key);
exports.for_each = Translations.translate(general, general.for_each_key);
exports.default_select_option = Translations.translate(general, general.default_select_option_key);
exports.cookies_message = Translations.translate(general, general.cookies_message_key);
exports.cookies_accept = Translations.translate(general, general.cookies_accept_key);
exports.appname = "Fiddeal";

let options = {
    option_categorias_key : "option_categorias",
    option_categorias_es : "Categorias",
    option_categorias_ca : "Categories",
    option_categorias_en : "Categories",

    option_registro_compras_key : "option_registro_compras",
    option_registro_compras_es : "Registro de compras",
    option_registro_compras_ca : "Registre de compres",
    option_registro_compras_en : "Purchases list",

    option_facturacion_key : "option_facturacion",
    option_facturacion_es : "Facturación",
    option_facturacion_ca : "Facturació",
    option_facturacion_en : "Billing",

    option_schedule_key : "option_schedule",
    option_schedule_es : "Horario",
    option_schedule_ca : "Horari",
    option_schedule_en : "Schedule",

    option_perfil_key : "option_perfil",
    option_perfil_es : "Perfil",
    option_perfil_ca : "Perfil",
    option_perfil_en : "Profile"
};

exports.option_categorias = Translations.translate(options, options.option_categorias_key);
exports.option_registro_compras = Translations.translate(options, options.option_registro_compras_key);
exports.option_facturacion = Translations.translate(options, options.option_facturacion_key);
exports.option_schedule = Translations.translate(options, options.option_schedule_key);
exports.option_perfil = Translations.translate(options, options.option_perfil_key);