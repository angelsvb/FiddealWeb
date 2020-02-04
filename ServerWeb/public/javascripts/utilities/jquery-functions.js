function closeModalOnClickOutside(event, id_container, id_form){
    if (!$(event.target).closest(id_form).length) {
        $(id_container).addClass('hidden').removeClass('visible');
    }
};
