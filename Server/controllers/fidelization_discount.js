'use strict';

let commons = require('../utilities/common_responses');
let manager = require('../utilities/manager');
let FidelizationDiscountSchema = require('../models/fidelization_discount');
let texts = require('../utilities/texts');
let errors = require('../utilities/error_codes');
let ObjectId = require('mongoose').Types.ObjectId;
let moment = require('moment');

exports.getDiscounts = function(req,res){
    if (req.CURRENT_USER){
        let type = req.CURRENT_USER.Type;
        let callback = function(err,data){
            if (err) commons.dbAccesError(res);
            else commons.validResponse(res,{Count:data.length,Discounts:data});
        };
        if (type === manager.USER_MOBILE){
            FidelizationDiscountSchema.find({User:new ObjectId(req.CURRENT_USER._id)}).populate({path: 'Purchases', populate: [{path:'Products.Product', model:'Product'}, {path: 'Business', model: 'UserWeb'}]}).populate('Business', 'Email Name CIF Description TypeBusiness CP Phone Webpage Address Municipi ProvinciaID CountryID Categories').sort('LastPurchase').exec(callback);
        }else if (type === manager.USER_WEB){
            FidelizationDiscountSchema.find({Business:req.CURRENT_USER._id}).sort('LastPurchase').exec(callback);
        }
    }else commons.undefinedErrorResponse(res);
};

exports.getDiscount = function(req,res){
    if (req.CURRENT_USER){
        let callback = function(err,data){
            if (err) commons.dbAccesError(res);
            else if (data) commons.validResponse(res,{Discount:data});
            else commons.validResponse(res,{});
        };
        var today = moment().startOf('day');
        FidelizationDiscountSchema.findOne({Business:new ObjectId(req.CURRENT_USER._id),User: new ObjectId(req.query.User),Used:false,ExpirationDate:{$gte: today.toDate()}}).sort('LastPurchase').exec(callback);
    }else commons.undefinedErrorResponse(res);
};

exports.setUsedDiscount = function(req,res){
    if (req.CURRENT_USER && req.CURRENT_USER.Type === manager.USER_WEB){
        FidelizationDiscountSchema.findById(req.params.id,function(err,discount){
            if (err) commons.dbAccesError(res);
            else if (!discount) commons.errorResponse(res,texts.fidelization_discount_not_found,errors.fidelization_discount_not_found);
            else {
                if (discount.Used) commons.errorResponse(res,texts.fidelization_discount_already_used,errors.fidelization_discount_already_used);
                else {
                    discount.Used = true;
                    discount.save(commons.defaultSaveDbCallback(res));
                }
            }
        });
    }else commons.undefinedErrorResponse(res);
};