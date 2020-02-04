let Storage = require('./storage');

exports.translate = function(data, property){
    if (data && property){
        if (!Storage.languageInitialized()) Storage.initializeLanguage();
        return data[property + "_" + Storage.getLanguage()];
    }
};

exports.common_ca = {
    close: "Tancar",
    actions: "Accions",
    add: "Afegir",
    edit: "Editar",
    save: "Guardar",
    delete: "Eliminar",
    discard: "Descartar",
    finalize: "Finalitzar",
    id_number: "Número identificador",
    compulsory_field: "Camp obligatòri",
    creation_date: "Data de creació",
    update_date: "Data de modificació",
    attention: "ATENCIÓ!",

    monday_uppercase: "DILLUNS",
    tuesday_uppercase: "DIMARTS",
    wednesday_uppercase: "DIMECRES",
    thursday_uppercase: "DIJOUS",
    friday_uppercase: "DIVENDRES",
    saturday_uppercase: "DISSABTE",
    sunday_uppercase: "DIUMENGE",

    default_select_option:"Seleccioni una opció...",
    stock_available: "Disponible",
    stock_discountinued: "Descatalogat",
    stock_outlet: "Outlet",
    stock_arriving: "Per arribar",
    stock_not_available: "No disponible",

    accept: "Acceptar",
    cancel: "Cancel·lar",
    back: "Enrere",
    confirm: "Confirmar",

    max_250_chars: "Màxim 250 caràcters."
};

exports.common_en = {
    close: "Close",
    actions: "Actions",
    add: "Add",
    edit: "Edit",
    save: "Save",
    delete: "Delete",
    discard: "Discard",
    finalize: "End",
    id_number: "Id number",
    compulsory_field: "Compulsory field",
    creation_date: "Creation date",
    update_date: "Update date",
    attention: "ATTENTION!",

    monday_uppercase: "MONDAY",
    tuesday_uppercase: "TUESDAY",
    wednesday_uppercase: "WEDNESDAY",
    thursday_uppercase: "THURSDAY",
    friday_uppercase: "FRIDAY",
    saturday_uppercase: "SATURDAY",
    sunday_uppercase: "SUNDAY",

    default_select_option:"Select an option...",
    stock_available: "Available",
    stock_discountinued: "Discountinued",
    stock_outlet: "Outlet",
    stock_arriving: "Arriving",
    stock_not_available: "Non available",

    accept: "Accept",
    cancel: "Cancel",
    back: "Back",
    confirm: "Confirm",

    max_250_chars: "Max 250 characters."
};

exports.common_es = {
    close: "Cerrar",
    actions: "Acciones",
    add: "Añadir",
    edit: "Editar",
    save: "Guardar",
    delete: "Eliminar",
    discard: "Descartar",
    finalize: "Finalizar",
    id_number: "Número identificador",
    compulsory_field: "Campo obligatório",
    creation_date: "Fecha de creación",
    update_date: "Fecha de actualización",
    attention: "¡ATENCIÓN!",

    monday_uppercase: "LUNES",
    tuesday_uppercase: "MARTES",
    wednesday_uppercase: "MIÉRCOLES",
    thursday_uppercase: "JUEVES",
    friday_uppercase: "VIERNES",
    saturday_uppercase: "SÁBADO",
    sunday_uppercase: "DOMINGO",

    default_select_option:"Seleccione una opción...",
    stock_available: "Disponible",
    stock_discountinued: "Descatalogado",
    stock_outlet: "Outlet",
    stock_arriving: "Por llegar",
    stock_not_available: "No disponible",

    accept: "Aceptar",
    cancel: "Cancelar",
    back: "Atrás",
    confirm: "Confirmar",

    max_250_chars: "Máximo 250 carácteres."
};

exports.template_accept_purchase_confirmation_ca = {
    accept_purchase: "Acceptar compra manual",
    dialog_message: "Esta segur de que vol acceptar la compra registrada manualment? Una vegada acceptada, el client acomularà els punts i no es podrà tornar a denegar.",
};
exports.template_accept_purchase_confirmation_en = {
    accept_purchase: "Accept manual purchase",
    dialog_message: "Are you sure that you want to accept that manual purchase? Once accepted, the customer will receive his points and it won't be possible to reject the purchase back.",
};
exports.template_accept_purchase_confirmation_es = {
    accept_purchase: "Aceptar compra manual",
    dialog_message: "¿Esta seguro de que quiere aceptar esta compra registrada de forma manual? Una vez aceptada, el cliente acomulará sus puntos y no se podrá volver a denegar.",
};

exports.template_activate_account_ca = {
    dialog_title: "Activació del compte",
    label_activation_code: "Codi d'activació",
    label_activate_account: "Activar compte",
    label_send_again: "Tornar a enviar",
    label_cancel_process: "Cancel·lar registre"
};
exports.template_activate_account_en = {
    dialog_title: "Account activation",
    label_activation_code: "Activation code",
    label_activate_account: "Activate account",
    label_send_again: "Send again",
    label_cancel_process: "Cancel sign up"
};
exports.template_activate_account_es = {
    dialog_title: "Activación de cuenta",
    label_activation_code: "Codigo de activación",
    label_activate_account: "Activar cuenta",
    label_send_again: "Volver a mandar",
    label_cancel_process: "Cancelar registro"
};

exports.template_change_password_ca = {
    change_password: "Canviar contrasenya",
    repeat_password: "Repetir contrasenya nova",
    new_password: "Contrasenya nova",
    current_password: "Contrasenya actual",
    dialog_title: "Canviar contrasenya"
};
exports.template_change_password_en = {
    change_password: "Change password",
    repeat_password: "Repeat new password",
    new_password: "New password",
    current_password: "Current password",
    dialog_title: "Change password"
};
exports.template_change_password_es = {
    change_password: "Cambiar contraseña",
    repeat_password: "Repetir contraseña nueva",
    new_password: "Contraseña nueva",
    current_password: "Contraseña actual",
    dialog_title: "Cambiar contraseña"
};

exports.template_dialog_given_cash_ca = {
    dialog_title: "Canvi a donar",
    given: "Entregat",
    total_label: "Total"
};
exports.template_dialog_given_cash_en = {
    dialog_title: "Change to give",
    given: "Given",
    total_label: "Total"
};
exports.template_dialog_given_cash_es = {
    dialog_title: "Cambio a dar",
    given: "Entregado",
    total_label: "Total"
};

exports.template_dialog_has_card_ca = {
    has_card_label: "TARGETA CLIENT",
    hasnt_card_label: "SENSE TARGETA CLIENT"
};
exports.template_dialog_has_card_en = {
    has_card_label: "CUSTOMER CARD",
    hasnt_card_label: "WITHOUT CUSTOMER CARD"
};
exports.template_dialog_has_card_es = {
    has_card_label: "TARJETA CLIENTE",
    hasnt_card_label: "SIN TARJETA CLIENTE"
};

exports.template_dialog_payment_method_ca = {
    label_cash: "EFECTIU",
    label_card: "TARGETA DE CRÈDIT"
};
exports.template_dialog_payment_method_en = {
    label_cash: "CASH",
    label_card: "CREDIT CARD"
};
exports.template_dialog_payment_method_es = {
    label_cash: "EFECTIVO",
    label_card: "TARJETA DE CRÉDITO"
};

exports.template_dialog_sale_info_ca = {
    dialog_title: "Informació de la venta",
    subtotal_label: "Subtotal",
    discount_label: "Descompte",
    total_label: "Total",
    change_label: "A retornar",
    customer_label: "Client"
};
exports.template_dialog_sale_info_en = {
    dialog_title: "Sale information",
    subtotal_label: "Subtotal",
    discount_label: "Discount",
    total_label: "Total",
    change_label: "Change",
    customer_label: "Customer"
};
exports.template_dialog_sale_info_es = {
    dialog_title: "Información de venta",
    subtotal_label: "Subtotal",
    discount_label: "Descuento",
    total_label: "Total",
    change_label: "A devolver",
    customer_label: "Cliente"
};

exports.template_dialog_use_discount_ca = {
    use_discount: "UTILITZAR DESCOMPTE",
    dont_use_discount: "NO UTILITZAR DESCOMPTE"
};
exports.template_dialog_use_discount_en = {
    use_discount: "USE DISCOUNT",
    dont_use_discount: "DON'T USE DISCOUNT"
};
exports.template_dialog_use_discount_es = {
    use_discount: "UTILIZAR DESCUENTO",
    dont_use_discount: "NO UTILIZAR DESCUENTO"
};

exports.template_dialog_user_card_ca = {
    dialog_title: "Escanejar targeta",
    costumer_code: "Codi del client",
    costumer_name: "Nom",
    search_costumer: "Buscar client",
    without_card: "Cobrar sense targeta"
};
exports.template_dialog_user_card_en = {
    dialog_title: "Scan card",
    costumer_code: "Costumer code",
    costumer_name: "Name",
    search_costumer: "Search costumer",
    without_card: "Bill without card"
};
exports.template_dialog_user_card_es = {
    dialog_title: "Escanear tarjeta",
    costumer_code: "Código de cliente",
    costumer_name: "Nombre",
    search_costumer: "Buscar cliente",
    without_card: "Cobrar sin targeta"
};

exports.template_edit_subcategory_ca = {
    dialog_title: "Editar subcategoria",
    subcategory_name: "Nom de la subcategoria",
    main_category: "Categoria principal",
    select_title: "Seleccioni la categoria a la que pertany",
    save_subcategory: "Guardar subcategoria"
};
exports.template_edit_subcategory_en = {
    dialog_title: "Edit subcategory",
    subcategory_name: "Subcategory name",
    main_category: "Main category",
    select_title: "Select the main category",
    save_subcategory: "Save subcategory"
};
exports.template_edit_subcategory_es = {
    dialog_title: "Editar subcategoria",
    subcategory_name: "Nombre de la subcategoria",
    main_category: "Categoria principal",
    select_title: "Seleccione la categoria a la que pertenece",
    save_subcategory: "Guardar subcategoria"
};

exports.template_footer_ca = {
    about_us: "Sobre nosaltres",
    meet_us: "Coneix-nos",
    google_play: "Play Store",
    security: "Seguretat",
    terms_and_conditions: "Termes i condicions",
    privacy_policy: "Política de privacitat",
    contact_us: "Contacta'ns",
    developed_by: "Desenvolupat per ",
    languages: "Idiomes",
    copyright: "Fiddeal | Tots els drets reservats"
};
exports.template_footer_en = {
    about_us: "About us",
    meet_us: "Meet us",
    google_play: "Play Store",
    security: "Security",
    terms_and_conditions: "Terms and conditions",
    privacy_policy: "Privacy policy",
    contact_us: "Contact us",
    developed_by: "Developed by ",
    languages: "Languages",
    copyright: "Fiddeal | All rights reserved"
};
exports.template_footer_es = {
    about_us: "Sobre nosotros",
    meet_us: "Conócenos",
    google_play: "Play Store",
    security: "Seguridad",
    terms_and_conditions: "Términos y condiciones",
    privacy_policy: "Política de privacidad",
    contact_us: "Contáctanos",
    developed_by: "Desarrollado por ",
    languages: "Idiomas",
    copyright: "Fiddeal | Todos los derechos reservados"
};

exports.template_get_product_price_ca = {
    dialog_title: "Consultar preu",
    product_code: "Codi del producte",
    product_name: "Nom",
    product_name_placeholder: "Nom del producte",
    product_price: "Preu",
    product_real_price: "Preu aplicat",
    label_check: "Consultar"
};
exports.template_get_product_price_en = {
    dialog_title: "Check price",
    product_code: "Product code",
    product_name: "Name",
    product_name_placeholder: "Product name",
    product_price: "Price",
    product_real_price: "Price applied",
    label_check: "Check"
};
exports.template_get_product_price_es = {
    dialog_title: "Consultar precio",
    product_code: "Código del producto",
    product_name: "Nombre",
    product_name_placeholder: "Nombre del producto",
    product_price: "Precio",
    product_real_price: "Precio aplicado",
    label_check: "Consultar"
};

exports.template_get_product_stock_ca = {
    dialog_title: "Consultar estoc",
    product_code: "Codi del producte",
    product_name: "Nom",
    product_name_placeholder: "Nom del producte",
    product_stock_state: "Estat de l'estoc",
    product_stock: "Estoc",
    label_check: "Consultar"
};
exports.template_get_product_stock_en = {
    dialog_title: "Check stock",
    product_code: "Product code",
    product_name: "Name",
    product_name_placeholder: "Product name",
    product_stock_state: "Stock state",
    product_stock: "Stock",
    label_check: "Check"
};
exports.template_get_product_stock_es = {
    dialog_title: "Consultar estoc",
    product_code: "Código del producto",
    product_name: "Nombre",
    product_name_placeholder: "Nombre del producto",
    product_stock_state: "Estado de estoc",
    product_stock: "Estoc",
    label_check: "Consultar"
};

exports.template_header_ca = {
    menu_label: "Menú",
    option_profile: "Perfil",
    option_schedule: "Horari",
    option_change_password: "Canviar contrasenya",
    option_billing: "Facturació",
    option_purchases: "Registre de compres",
    option_products: "Gestió de productes",
    option_categories: "Gestió de categories",
    option_customer_service: "Atenció al client",
    option_close_session: "Tancar sessió"
};
exports.template_header_en = {
    menu_label: "Menu",
    option_profile: "Profile",
    option_schedule: "Schedule",
    option_change_password: "Change password",
    option_billing: "Billing",
    option_purchases: "Purchase list",
    option_products: "Products management",
    option_categories: "Categories management",
    option_customer_service: "Customer support service",
    option_close_session: "Log out"
};
exports.template_header_es = {
    menu_label: "Menú",
    option_profile: "Perfil",
    option_schedule: "Horario",
    option_change_password: "Cambiar contraseña",
    option_billing: "Facturación",
    option_purchases: "Registro de compras",
    option_products: "Gestión de productos",
    option_categories: "Gestión de categorias",
    option_customer_service: "Atención al cliente",
    option_close_session: "Cerrar sesión"
};

exports.template_initialize_horari_ca = {};
exports.template_initialize_horari_en = {};
exports.template_initialize_horari_es = {
    dialog_title: "INICIALIZAR HORARIO DE APERTURA",
    from_to_1: "from",
    from_to_2: "to",
    and_from: "and from",
    closed: "Closed",
    opened_24h: "Opened 24H"
};

exports.template_manual_product_entry_ca = {
    dialog_title: "Entrada manual",
    product_code: "Codi del producto"
};
exports.template_manual_product_entry_en = {
    dialog_title: "Manual entry",
    product_code: "Product code"
};
exports.template_manual_product_entry_es = {
    dialog_title: "Entrada manual",
    product_code: "Código del producto"
};

exports.template_new_category_ca = {
    dialog_title: "Crear categoria",
    category_name: "Nom de la categoria",
    save_category: "Guardar categoria",
    category_placeholder: "Electrònica"
};
exports.template_new_category_en = {
    dialog_title: "Create category",
    category_name: "Category name",
    save_category: "Save category",
    category_placeholder: "Electronics"
};
exports.template_new_category_es = {
    dialog_title: "Crear categoria",
    category_name: "Nombre de la categoria",
    save_category: "Guardar categoria",
    category_placeholder: "Electrónica"
};

exports.template_new_subcategory_ca = {
    dialog_title: "Crear subcategoria",
    subcategory_name: "Nom de la subcategoria",
    save_subcategory: "Guardar subcategoria",
    subcategory_placeholder: "TV i so"
};
exports.template_new_subcategory_en = {
    dialog_title: "Save subcategory",
    subcategory_name: "Subcategory name",
    save_subcategory: "Save subcategory",
    subcategory_placeholder: "TV and sound"
};
exports.template_new_subcategory_es = {
    dialog_title: "Crear subcategoria",
    subcategory_name: "Nombre de la subcategoria",
    save_subcategory: "Guardar subcategoria",
    subcategory_placeholder: "TV y sonido"
};

exports.template_recovery_password_ca = {
    dialog_title: "Recuperació de contrasenya",
    recovery_code: "Codi de recuperació",
    new_password: "Contrasenya nova",
    repeat_new_password: "Repetir contrasenya",
    change_password_action: "Canviar contrasenya"
};
exports.template_recovery_password_en = {
    dialog_title: "Password recovery",
    recovery_code: "Recovery code",
    new_password: "New password",
    repeat_new_password: "Repeat new password",
    change_password_action: "Change password"
};
exports.template_recovery_password_es = {
    dialog_title: "Recuperación de contraseña",
    recovery_code: "Código de recuperación",
    new_password: "Contraseña nueva",
    repeat_new_password: "Repetir contraseña nueva",
    change_password_action: "Cambiar contraseña"
};

exports.template_reject_purchase_comment_ca = {
    dialog_title: "Rebutjar compra manual",
    comment: "Comentari",
    comment_placeholder: "Motiu per el que es rebutja la compra."
};
exports.template_reject_purchase_comment_en = {
    dialog_title: "Reject manual purchase",
    comment: "Comment",
    comment_placeholder: "Reason why the purchase is rejected."
};
exports.template_reject_purchase_comment_es = {
    dialog_title: "Rechazar compra manual",
    comment: "Comentario",
    comment_placeholder: "Motivo por el que se rechaza la compra."
};

exports.template_request_recovery_password_ca = {
    dialog_title: "Recuperar contrasenya",
    email_label: "Introdueixi el seu correu electrònic",
    email_placeholder: "Correu electrònic",
    recovery_action: "Recuperar contrasenya"
};
exports.template_request_recovery_password_en = {
    dialog_title: "Recovery password",
    email_label: "Enter your email",
    email_placeholder: "Email",
    recovery_action: "Recovery password"
};
exports.template_request_recovery_password_es = {
    dialog_title: "Recuperar contraseña",
    email_label: "Introduce tu correo electrónico",
    email_placeholder: "Correo electrónico",
    recovery_action: "Recuperar contraseña"
};

exports.template_support_dialog_ca = {
    dialog_title: "Suport tècnic",
    label_category: "Categoria",
    select_default_option_support: "Escollir opció...",
    select_option_1: "Ajuda",
    select_option_2: "Suggerencia",
    select_option_3: "Problemes de funcionament",
    select_option_4: "Altres",
    topic: "Asumpte",
    message: "Missatge",
    send: "Enviar",
    message_placeholder: "Contingut del missatge"
};
exports.template_support_dialog_en = {
    dialog_title: "Customer help service",
    label_category: "Category",
    select_default_option_support: "Choose an option...",
    select_option_1: "Help",
    select_option_2: "Suggestion",
    select_option_3: "Working problems",
    select_option_4: "Others",
    topic: "Topic",
    message: "Message",
    send: "Send",
    message_placeholder: "Message content"
};
exports.template_support_dialog_es = {
    dialog_title: "Soporte técnico",
    label_category: "Categoria",
    select_default_option_support: "Escoger categoria...",
    select_option_1: "Ayuda",
    select_option_2: "Sugerencia",
    select_option_3: "Problemas de funcionamiento",
    select_option_4: "Otros",
    topic: "Asunto",
    message: "Mensaje",
    send: "Enviar",
    message_placeholder: "Contenido del mensaje"
};

exports.template_terms_conditions_modified_ca = {
    dialog_title: "Acceptació legal",
    message_1: "Hem modificat els nostres",
    message_2: "Termes i Condicions d'ús",
    message_3: " i la nostra ",
    message_4: "Política de privacitat",
    message_5: ". Per cumplir amb la llei i poder seguir utilizant el nostre sistema, ha d'indicar-nos que ha llegit i accepta aquests nous termes. Si no els vol acceptar, es tancarà la sessió i serà redirigit a la pàgina d'inici. Gràcies per la seva comprensió."
};
exports.template_terms_conditions_modified_en = {
    dialog_title: "Legal acceptance",
    message_1: "We have modified ours ",
    message_2: "Terms and Conditions",
    message_3: " and our ",
    message_4: "Privacy Policy",
    message_5: ". To comply with the law and to continue using our system, you must indicate that you have read and accept these new terms. If you do not want to accept them, the session will be closed and redirected to the home page. Thanks for your understanding."
};
exports.template_terms_conditions_modified_es = {
    dialog_title: "Aceptación legal",
    message_1: "Hemos modificado nuestros ",
    message_2: "Términos y Condiciones de uso",
    message_3: " y nuestra ",
    message_4: "Política de privacidad",
    message_5: ". Para cumplir con la ley y poder seguir usando nuestro sistema, debe indicarnos que ha leïdo y acepta estos nuevos terminos. Si no quiere aceptar los términos, se cerrará la sesión y sera redirigido a la página de inicio. Gracias por su comprensión."
};

exports.template_ticket_ca = {
    dialog_title: "IMATGE DEL TICKET"
};
exports.template_ticket_en = {
    dialog_title: "TICKET IMAGE"
};
exports.template_ticket_es = {
    dialog_title: "IMAGEN DEL TICKET"
};

exports.productes_ca = {
    column_product: "Producte",
    column_reference: "Referència",
    column_subcategory: "Subcategoria",
    column_price: "Preu",
    column_stock: "Estoc",
    column_in_offer: "En oferta",
    column_visible: "Visible",
    column_update: "Actualització",
    title: "DADES DEL PRODUCTE",
    field_name: "Nom",
    field_reference: "Referència",
    field_category: "Categoria",
    field_subcategory: "Subcategoria",
    field_stock_state: "Estat estoc",
    field_stock: "Estoc",
    field_expected_arrival: "Recepció prevista",
    field_price: "Preu",
    field_price_outlet: "Preu outlet",
    field_product_visible: "Visibilitat del producte",
    product_visible: "Visible",
    product_not_visible: "No visible",
    field_description: "Descripció producte",
    field_product_id: "Identificador producte",
    field_offer_id: "Identificador oferta",
    field_creation_date: "Data de creació",
    field_update_date: "Data d'actualització",
    empty_grid_1: "Encara no ha configurat cap producte. Es tracta del segon pas per poder començar a treballar amb Fiddeal. Això permetrà que els seus clients vegin el que ofereix a través de l'aplicació mòbil, realitzar el cobrament a l'apartat de facturació i gestionar l'estoc.",
    empty_grid_2: "Faci click en el següent icone per començar!"
};

exports.productes_en = {
    column_product: "Product",
    column_reference: "Reference",
    column_subcategory: "Subcategory",
    column_price: "Price",
    column_stock: "Stock",
    column_in_offer: "On offer",
    column_visible: "Visible",
    column_update: "Update",
    title: "PRODUCT INFORMATION",
    field_name: "Name",
    field_reference: "Reference",
    field_category: "Category",
    field_subcategory: "Subcategory",
    field_stock_state: "Stock state",
    field_stock: "Stock",
    field_expected_arrival: "Expected arrival",
    field_price: "Price",
    field_price_outlet: "Outlet price",
    field_product_visible: "Product visibility",
    product_visible: "Visible",
    product_not_visible: "Non visible",
    field_description: "Product description",
    field_product_id: "Product identifier",
    field_offer_id: "Offer identifier",
    field_creation_date: "Creation date",
    field_update_date: "Update date",
    empty_grid_1: "You have not set up any products yet. This is the second step to start working with Fiddeal. This will allow your customers to see what they offer through the mobile application, make the payment in the billing section and manage the stock.",
    empty_grid_2: "Click on the following icon to begin!"
};

exports.perfil_ca = {
    section_profile: "DADES DE L'EMPRESA",
    field_email: "Correu electrònic",
    field_name: "Nom de l'empresa",
    field_cif: "CIF",
    field_country: "Pais",
    field_region: "Provincia",
    field_city: "Municipi",
    field_address: "Direcció",
    field_postal_code: "Codi postal",
    field_phone: "Telèfon",
    field_website: "Pàgina web",
    field_business_type: "Tipus d'empresa",
    field_description: "Descripció de l'empresa",
    section_fidelization_params: "PARÀMETRES DE FIDELITZACIÓ",
    field_discount_ratio: "Descompte acomulat per euro gastat (€)",
    field_discount_months: "Caducitat del descompte (mesos)",
    field_discount_expiring: "Descomptes amb data de caducitat",
    field_discount_extend_expiration: "Ampliar caducitat amb cada compra"
};

exports.perfil_en = {
    section_profile: "BUSINESS INFORMATION",
    field_email: "Email",
    field_name: "Business name",
    field_cif: "CIF",
    field_country: "Country",
    field_region: "Region",
    field_city: "City",
    field_address: "Address",
    field_postal_code: "Postal code",
    field_phone: "Phone",
    field_website: "Website",
    field_business_type: "Business type",
    field_description: "Business description",
    section_fidelization_params: "FIDELIZATION PARAMETERS",
    field_discount_ratio: "Discount per euro spent (€)",
    field_discount_months: "Discount expiration (months)",
    field_discount_expiring: "Discounts with expiration",
    field_discount_extend_expiration: "Extend expiration with every purchase"
};

exports.compres_ca = {
    column_purchase_number: "Número de compra",
    column_date: "Data",
    column_subtotal: "Subtotal",
    column_discount: "Descompte",
    column_total: "Total",
    column_payment_method: "Pagament",
    column_client_id: "ID Client",
    column_manual_purchase: "Compra manual",
    detail_title: "DADES DE LA COMPRA",
    purchase_id: "Número de compra",
    purchase_date: "Data",
    customer_id: "Client",
    subtotal: "Subtotal",
    discount: "Descompte",
    total: "Total",
    payment_method: "Pagament",
    manual_purchase: "Compra manual",
    manual_accepted: "Registre acceptat",
    entry_date: "Data de registre",
    revision_date: "Data de revisió",
    column_detail_product: "Producte",
    column_detail_price: "Preu",
    column_detail_discount: "Descuento",
    column_detail_amount: "Cantidad"
};

exports.compres_en = {
    column_purchase_number: "Purchase number",
    column_date: "Date",
    column_subtotal: "Subtotal",
    column_discount: "Discount",
    column_total: "Total",
    column_payment_method: "Payment",
    column_client_id: "ID Customer",
    column_manual_purchase: "Manual purchase",
    detail_title: "PURCHASE INFORMATION",
    purchase_id: "Purchase number",
    purchase_date: "Date",
    customer_id: "Costumer",
    subtotal: "Subtotal",
    discount: "Discount",
    total: "Total",
    payment_method: "Payment",
    manual_purchase: "Manual purchase",
    manual_accepted: "Accepted registry",
    entry_date: "Registry date",
    revision_date: "Revision date",
    column_detail_product: "Product",
    column_detail_price: "Price",
    column_detail_discount: "Discount",
    column_detail_amount: "Amount"
};

exports.facturacio_ca = {
    title: "INFORMACIÓ",
    number_purchases:"Nº Compres:",
    fidelization_percentage: "Fidelització:",
    average_ticket: "Ticket mig:",
    billed_amount: "Import facturat:",
    actions_uppercase: "ACCIONS",
    bill_ticket: "Cobrar ticket",
    check_price: "Consultar preu",
    check_available: "Consultar disponibilitat",
    change_products: "Canvi de productes",
    cancel_ticket: "Cancelar ticket",
    manual_code: "Codi manual",
    return_product: "Devolució de productes",
    close_day: "Tancament de caixa",
    current_ticket: "TICKET ACTUAL",
    original_price: "Preu original",
    applied_price: "Preu aplicat",
    number_products: "Nº Productes:",
    subtotal: "Subtotal:",
    product: "Producte"
};

exports.facturacio_en = {
    title: "INFORMATION",
    number_purchases:"Nº Purchases:",
    fidelization_percentage: "Fidelization:",
    average_ticket: "Average ticket:",
    billed_amount: "Billed amount:",
    actions_uppercase: "ACTIONS",
    bill_ticket: "Bill ticket",
    check_price: "Check price",
    check_available: "Check availability",
    change_products: "Change productes",
    cancel_ticket: "Cancel ticket",
    manual_code: "Manual code",
    return_product: "Return products",
    close_day: "Close day",
    current_ticket: "CURRENT TICKET",
    original_price: "Original price",
    applied_price: "Applied price",
    number_products: "Nº Products:",
    subtotal: "Subtotal:",
    product: "Product"
};

exports.horari_ca = {
    title: "HORARI D'OBERTURA",
    from_to_1: "de",
    from_to_2: "a",
    and_from: "i de",
    closed: "Tancat",
    opened_24h: "Obert 24H"
};

exports.horari_en = {
    title: "OPENING SCHEDULE",
    from_to_1: "from",
    from_to_2: "to",
    and_from: "and from",
    closed: "Closed",
    opened_24h: "Opened 24H"
};

exports.categories_ca = {
    column_category: "Categoria",
    column_creation: "Creació",
    column_modify: "Modificació",
    column_subcategories_count: "Subcategories",
    detail_title: "DADES CATEGORIA",
    label_name: "Nom",
    detail_subtitle: "Subcategories",
    new_subcategory: "Nova subcategoria",
    new_category: "Nova categoria",
    empty_grid_1: "Encara no ha configurat cap categoria de productes. Es tracta del primer pas per poder començar a treballar amb Fiddeal.",
    empty_grid_2: "Faci click en el següent icone per començar!"
};

exports.categories_en = {
    column_category: "Category",
    column_creation: "Creation",
    column_modify: "Update",
    column_subcategories_count: "Subcategories",
    detail_title: "CATEGORY DATA",
    label_name: "Name",
    detail_subtitle: "Subcategories",
    new_subcategory: "New subcategory",
    new_category: "New category",
    empty_grid_1: "You didn't entered any category of products. It's the first stre to begin to work with Fiddeal.",
    empty_grid_2: "Click in the following icon to begin!"
};

exports.index_ca = {
    login : "INICIAR SESSIÓ",
    email: "Correu electrònic",
    password: "Contrasenya",
    continue: "CONTINUAR",
    password_forgotten: "¿Ha oblidat la contrasenya?",
    no_estoy_registrado: "NO ESTIC REGISTRAT",
    signup_text_1: "Para entrar en el món de la fidelització digital de clients completi el procés de registre del seu negoci",
    signup_text_2: "Aprofiti ara aquesta nova oportunitat de negoci i provi Fiddeal.",
    registrar: "REGISTRAR",
    formulario_registro: "FORMULARI DE REGISTRE",
    nombre_de_empresa: "Nom de l'empresa",
    nombre: "Nom",
    cif: "CIF",
    confirmar_contrasenya: "Confirmar contrasenya",
    prefijo: "Prefix",
    telefono: "Telèfon",
    pagina_web: "Pàgina web",
    tipo_empresa: "Tipus d'empresa",
    seleccione_una_opcion: "Seleccioni una opció...",
    recargue_la_pagina: "Recarregui la pàgina si no disposa d'opcions.",
    ciudad_placeholder: "Barcelona",
    pais: "Pais",
    provincia: "Provinicia",
    municipio: "Municipi",
    codigo_postal: "Codi postal",
    direccion: "Direcció",
    direccion_placeholder: "C/Aragó 5",
    descripcion_empresa: "Descripció de l'empresa",
    descripcion_empresa_hint: "Màxim 250 caràcters. Mínim 30 caràcters.",
    cancelar: "CANCELAR",
    terminos_1: "He llegit i accepto els ",
    terminos_2: "termes i condicions d'ús",
    terminos_3: "de l'aplicació i la seva",
    terminos_4: "política de privacitat."
};

exports.index_en = {
    login : "SIGN IN",
    email: "Email",
    password: "Password",
    continue: "CONTINUE",
    password_forgotten: "¿Forgotten password?",
    no_estoy_registrado: "NOT SIGNED UP",
    signup_text_1: "To enter into client's digital trust fund, complete the registracion process of your business.",
    signup_text_2: "Take advantatge of this new business opportunity and proof of Fiddeal.",
    registrar: "SIGN UP",
    formulario_registro: "SIGN UP FORM",
    nombre_de_empresa: "Business name",
    nombre: "Name",
    cif: "CIF",
    confirmar_contrasenya: "Confirm password",
    prefijo: "Prefix",
    telefono: "Phone",
    pagina_web: "Web page",
    tipo_empresa: "Business type",
    seleccione_una_opcion: "Select an option...",
    recargue_la_pagina: "Reload the page if data is missing.",
    ciudad_placeholder: "London",
    pais: "Country",
    provincia: "Region",
    municipio: "City",
    codigo_postal: "Postal code",
    direccion: "Address",
    direccion_placeholder: "23 Acacia Avenue",
    descripcion_empresa: "Business description",
    descripcion_empresa_hint: "Minimum 250 characters. Maximum 30 characters.",
    cancelar: "CANCEL",
    terminos_1: "I have read and accept the ",
    terminos_2: "terms and conditions of use ",
    terminos_3: "of the application and its",
    terminos_4: "privacy policy."
};