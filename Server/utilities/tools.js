'use strict';

let Handlebars = require('handlebars');
let fs = require('fs');
let moment = require('moment');
let mongoose = require('mongoose');
let ObjectId = mongoose.Types.ObjectId;
let manager = require('./manager');
let crypto = require('crypto');
let resolve = require('path').resolve;

module.exports = {
    isUndefined: function(_object){
        return typeof _object === 'undefined';
    },
    isNumber: function(_number) { return !isNaN(parseFloat(_number)) && !isNaN(_number - 0) },
    toNumber : function(_number){ return parseInt(_number);},
    toDecimal : function(_number){ return parseFloat(_number);},
    olderThan : function(date1,date2){
        let d1 = moment(date1);
        let d2 = moment(date2);
        return d1 > d2;
    },
    getRandom : function(min,max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getHTMLTemplate : function(file_name,object){
        try{
            let path = __dirname+'/../views/'+file_name+'.hbs';
            //let path = "Server/views/"+file_name+".hbs";
            let source = fs.readFileSync(path,'utf-8');
            let template = Handlebars.compile(source);
            return template(object);
        }catch (err) {
            console.log("ERROR CREATING TEMPLATE HANDLEBARS "+file_name);
            console.log(err);
            return "";
        }
    },
    deleteProperty : function(obj,propName){
        try{ if (obj[propName] || obj[propName] === false) delete obj[propName] }
        catch (err){
            console.log("Error deleting property ->" + propName + " from -> "+obj.constructor.name); }
    },
    add24Hours : function(date){
        return moment(date).add(1, 'days').toDate();
    },
    containsChar : function(value){
        let strValue = value.toString();
        if (!strValue) return false;
        else {
            let strWithCharRegex = /.*[a-zA-z].*/;
            return value.match(strWithCharRegex);
        }
    },
    containsDigit : function(value){
        let strValue = value.toString();
        if (!strValue) return false;
        else {
            let strWithDigitRegex = /.*[0-9].*/;
            return value.match(strWithDigitRegex);
        }
    },
    deleteFromArray : function(array,item){
        let index = array.indexOf(item);
        if (index > -1) {
            array.splice(index,1);
            return true;
        }else return false;
    },hourToInt : function(value){
        if (value.indexOf(':') > -1){
            if (value && value.indexOf(":")){
                let array = value.split(":");
                return parseInt(array[0])*60+parseInt(array[1]);
            }else return undefined;
        }else if (!isNaN(value)) return parseInt(value);
        else return undefined;

    },convertIds : function(array) {
        let oRes = [];
        let hasInvalid = false;
        if (array){
            array.forEach(function(item){
                try{
                    let id = mongoose.Types.ObjectId(item);
                    if (oRes.indexOf(id) < 0) oRes.push(id);
                }catch (err){
                    hasInvalid = true;
                }
            });
        }
        return {ids:oRes,invalidIds:hasInvalid};
    },
    sameDay: function(date1,date2){
        return moment(date1).diff(moment(date2),'days') === 0;
    },
    toDate : function(date){
        return moment(date,manager.dateFormat);
    },
    now : function(){
        return moment().format(manager.dateFormat);
    },
    validID: function(id){
        if (id) {
            let regEx = new RegExp("^[0-9a-fA-F]{24}$");
            return regEx.test(id);
        } else return false;
    },
    encryptPassword: function(password){
        return crypto.createHash('sha256').update(password).digest('base64');
    },
    getImagePath: function(relative_path){
        if (manager.HTTPSActive()) return "https://"+manager.publicHost+":"+manager.server_port+relative_path;
        else return "http://"+manager.publicHost+":"+manager.server_port+relative_path;
    },
    validObjectID: function(value){
        if(ObjectId.isValid(value)){
            return new ObjectId(value).toString() === value;
        } else return false
    },
    toObjectId: function(value){
        return new ObjectId(value);
    },
    getSubcategoryId: function(user, categoryId, subcategoryName){
        if (user && categoryId && subcategoryName) {
            if (user.Categories && user.Categories.length > 0){
                let category = user.Categories.find(item => item._id.toString() === categoryId);
                let subcategory = category.Subcategories.find(item => item.Name === subcategoryName);
                return subcategory ? subcategory._id.toString() : undefined;
            } else return undefined;
        } else return undefined;
    },
    getCategory: function(user, categoryName){
        if (user && categoryName) {
            if (user.Categories && user.Categories.length > 0)
                return  user.Categories.find(item => item.Name === categoryName);
            else return undefined;
        } else return undefined;
    }
};

