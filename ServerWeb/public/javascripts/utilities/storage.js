
let Languages = require('acceptedlanguages');
//NO TOCAR EL FORMAT DE LES DOS LINIES SEGUENTS - L'ORDRE SI ES POT TOCAR
let inLocalDeveloptment = true;
let version = "0.1.2";

exports.version = function(){
    return "beta-" + version;
};

exports.apiURL = function(){
    if (inLocalDeveloptment) return "http://localhost:8080/api";
    else return "https://api.fiddeal.com/api";
};

exports.printURL = function(){
    return "http://localhost:8084";
};

exports.serverIP = function(){
    if (inLocalDeveloptment) return "http://localhost:8082";
    else return "https://app.fiddeal.com";
};

exports.getToken = function(){
    return localStorage.getItem("token");
};

exports.getSessionToken = function(){
    return sessionStorage.getItem("token");
};

exports.setSessionToken = function(token){
    if (token) sessionStorage.setItem("token",token);
    else sessionStorage.removeItem("token");
};

exports.setToken = function setToken(token){
    if (token) localStorage.setItem("token",token);
    else localStorage.removeItem("token");
};

exports.getUser = function(){
    let object = sessionStorage.getItem("user");
    if (object) return JSON.parse(object);
    else return undefined;
};

exports.setUser = function(user){
    if (user) {
        if (user.Categories) user.Categories = sortCategories(user.Categories);
        sessionStorage.setItem("user",JSON.stringify(user))
    }
    else sessionStorage.removeItem("user")
};

function sortCategories(categories){
    if (categories){
        let result = categories.sort(function(item1, item2){
            if (item1.Name.toUpperCase() < item2.Name.toUpperCase()) return -1;
            else if (item2.Name.toUpperCase() < item1.Name.toUpperCase()) return 1;
            else return 0;
        });

        for(index = 0; index<result.length;index++){
            result[index].Subcategories = result[index].Subcategories.sort(function(item1, item2){
                if (item1.Name.toUpperCase() < item2.Name.toUpperCase()) return -1;
                else if (item2.Name.toUpperCase() < item1.Name.toUpperCase()) return 1;
                else return 0;
            });
        };

        return result;
    }
}
exports.sortCategories = sortCategories;

exports.clearStorage = function(){
    sessionStorage.clear();
    localStorage.clear();
};

exports.setCurrentPurchase = function(purchase){
    if (purchase) sessionStorage.setItem("currentPurchase", JSON.stringify(purchase));
    else sessionStorage.removeItem("currentPurchase");
};

exports.getCurrentPurchase = function(){
    let object = sessionStorage.getItem("currentPurchase");
    if (object) return JSON.parse(object);
    else return undefined;
};

const SPANISH = "es";
const ENGLISH = "en";
const CATALAN = "ca";
exports.SPANISH = SPANISH;
exports.initializeLanguage = function(){
    let accepted_array = Languages.accepted;

    for (i=0; i<accepted_array.length;i++){
        switch (accepted_array[i].toUpperCase()) {
            case SPANISH.toUpperCase():
                setLanguage(SPANISH);
                break;
            case ENGLISH.toUpperCase():
                setLanguage(ENGLISH);
                break;
            case CATALAN.toUpperCase():
                setLanguage(CATALAN);
                break;
        }
        if (languageInitialized()) break;
    }
};

function languageInitialized(){
    return !!getLanguage();
}
exports.languageInitialized = languageInitialized;

function setLanguage(language){
    if (language) localStorage.setItem("language",language);
    else localStorage.removeItem("language");
}
exports.setLanguage = setLanguage;

function getLanguage(){
    return localStorage.getItem("language");
}
exports.getLanguage = getLanguage;
