'use strict';

let commons = require('../utilities/common_responses');
let errors = require('../utilities/error_codes');
let texts = require('../utilities/texts');
let moment = require('moment');
let ProductCategorySchema = require('../models/product_category');
let ProductSubcategorySchema = require('../models/product_subcategory');
let ProductCategory = require('../models/product');

exports.createCategory = function(req,res){
    if (req.CURRENT_USER){
        let category = req.CURRENT_USER.Categories.find(function(item){
            return item.Name === req.query.categoryName
        });
        if (category) commons.errorResponse(res,texts.categories_already_exists,errors.categories_already_exists);
        else {
            let new_category = new ProductCategorySchema({Name:req.query.categoryName});
            req.CURRENT_USER.Categories.push(new_category);
            req.CURRENT_USER.save(function(err,savedUser){
                if (err) commons.dbSaveError(res);
                else commons.validResponse(res,{Categories: savedUser.Categories});
            });
        }
    }else commons.undefinedErrorResponse(res);
};

exports.updateCategory = function(req,res){
    if (req.CURRENT_USER){
        let category = req.CURRENT_USER.Categories.find(function(item){
            return item.Name === req.query.categoryName
        });
        if (!category) commons.errorResponse(res,texts.categories_category_not_found,errors.categories_category_not_found);
        else {

            if (req.CURRENT_USER.Categories.find(function(item){ return item.Name === req.query.newCategoryName && item._id !== category._id })){
                commons.errorResponse(res,texts.categories_already_exists,errors.categories_already_exists);
            }else{
                category.Name = req.query.newCategoryName;
                req.CURRENT_USER.save(function(err, savedUser){
                    if (err) commons.dbSaveError(res);
                    else commons.validResponse(res, {Categories: savedUser.Categories});
                });
            }
        }
    }else commons.undefinedErrorResponse(res);
};

exports.deleteCategory = function (req, res) {
    if (req.CURRENT_USER) {
        let category = req.CURRENT_USER.Categories.find(function (item) {
            return item.Name === req.query.categoryName
        });
        if (!category) commons.errorResponse(res, texts.categories_category_not_found, errors.categories_category_not_found);
        else {
            let index = req.CURRENT_USER.Categories.indexOf(category);
            if (index > -1) req.CURRENT_USER.Categories.splice(index, 1);
            else {
                commons.errorResponse(res, texts.categories_category_not_found, errors.categories_category_not_found);
                return;
            }

            req.CURRENT_USER.save(function (err, savedUser) {
                if (err) commons.dbSaveError(res);
                else commons.validResponse(res, {Categories: savedUser.Categories});
            });
        }
    } else commons.undefinedErrorResponse(res);
};

exports.createSubcategory = function(req,res){
    if (req.CURRENT_USER){
        let category = req.CURRENT_USER.Categories.find(function(item){
            return item._id.toString() === req.params.categoryId;
        });
        if (!category) commons.errorResponse(res,texts.subcategory_parent_not_found,errors.subcategory_parent_not_found);
        else if (category.Name === req.query.subCategoryName) commons.errorResponse(res,texts.subcategory_name_equal_to_parent,errors.subcategory_name_equal_to_parent);
        else {
            let subcategory = category.Subcategories.find(function(item){
                return item.Name === req.query.subCategoryName
            });
            if (!subcategory){
                let new_subcategory = new ProductSubcategorySchema({Name:req.query.subCategoryName,ParentCategory: req.params.categoryId});
                category.Subcategories.push(new_subcategory);
                req.CURRENT_USER.save(function(err,savedUser){
                    if (err) commons.dbSaveError(res);
                    else commons.validResponse(res,{Categories:savedUser.Categories});
                });
            }else commons.errorResponse(res, texts.subcategory_already_exists,errors.subcategory_already_exists);
        }
    }else commons.undefinedErrorResponse(res);
};

exports.updateSubcategory = function(req,res){
    if (req.CURRENT_USER){
        let category = getCategory(req.CURRENT_USER,req.params.categoryId);
        if (category){
            if (req.query.newParent){
                let subcategory = getSubcategory(category,req.query.subCategoryName);
                if (subcategory){
                    let newCategory = getCategory(req.CURRENT_USER,req.query.newParent);
                    if (newCategory){
                        let name = subcategory.Name;
                        if (req.query.newName) name = req.query.newName;
                        if (subcategoryNameUsed(req.query.newName,newCategory,subcategory)) commons.errorResponse(res,texts.subcategory_duplicated_name,errors.subcategory_duplicated_name);
                        else updateSubcategoryNameAndParent(req,res,name,category,newCategory,subcategory);
                    }
                    else commons.errorResponse(res,texts.subcategory_new_parent_not_found,errors.subcategory_new_parent_not_found);
                }else commons.errorResponse(res,texts.subcategory_not_found,errors.subcategory_not_found);
            }else {
                let subcategory = getSubcategory(category,req.query.subCategoryName);
                if (subcategory) {
                    if (subcategoryNameUsed(req.query.newSubCategoryName,category,subcategory)) commons.errorResponse(res,texts.subcategory_duplicated_name,errors.subcategory_duplicated_name);
                    else updateSubcategoryName(req,res,req.query.newSubCategoryName,subcategory);
                }
                else commons.errorResponse(res,texts.subcategory_not_found,errors.subcategory_not_found);
            }
        }else commons.errorResponse(res,texts.categories_category_not_found,errors.categories_category_not_found);
    }else commons.undefinedErrorResponse(res);
};

function subcategoryNameUsed(name,category,subcategory){
    if (category.Subcategories){
        return category.Subcategories.find(function(item){
            return item.Name === name && item._id !== subcategory._id
        });
    }else return false;
}

function getSubcategory(category,name){
    return category.Subcategories.find(function(item){
        return item.Name === name
    });
}

function getCategory(user,id){
    return user.Categories.find(function(item){
        return item._id.toString() === id;
    });
}

function getCategoryByName(user,name) {
    return user.Categories.find(function (item) {
        return item.Name === name;
    });
}

function updateSubcategoryName(req,res,new_name,subcategory){
    subcategory.Name = new_name;
    req.CURRENT_USER.save(function(err){
        if (err) commons.dbSaveError(res);
        else commons.validResponse(res, { Categories: new_doc.Categories} );
    });
}

function updateSubcategoryNameAndParent(req,res,new_name,currentCategory,newCategory,subcategory){
    let index = currentCategory.Subcategories.indexOf(subcategory);
    if (index > -1){
        currentCategory.Subcategories.splice(index,1);
        newCategory.Subcategories.push(subcategory);
        subcategory.ParentCategory = newCategory._id;
        subcategory.Name = new_name;
        req.CURRENT_USER.save(function(err, new_doc){
            if (err) commons.dbSaveError(res);
            else commons.validResponse(res, { Categories: new_doc.Categories} );
        });
    }else commons.errorResponse(res,texts.subcategory_not_found,errors.subcategory_not_found);
};

exports.deleteSubcategory = function(req,res){
    if (req.CURRENT_USER){
        let category = req.CURRENT_USER.Categories.find(function(item){
            return item._id.toString() === req.params.categoryId;
        });
        if (!category) commons.errorResponse(res,texts.subcategory_parent_not_found,errors.subcategory_parent_not_found);
        else {
            let subcategory = category.Subcategories.find(function(item){
                return item.Name === req.query.subCategoryName;
            });
            if (subcategory){
                let index = category.Subcategories.indexOf(subcategory);
                if (index > -1) category.Subcategories.splice(index,1);
                else {
                    commons.errorResponse(res,texts.subcategory_not_found,errors.subcategory_not_found);
                    return;
                }
                req.CURRENT_USER.save(function(err, savedUser){
                    if (err) commons.dbSaveError(res);
                    else commons.validResponse(res, {Categories: savedUser.Categories});
                })
            }else commons.errorResponse(res, texts.subcategory_not_found,errors.subcategory_not_found);
        }
    }else commons.undefinedErrorResponse(res);
};