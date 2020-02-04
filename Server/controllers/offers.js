'use strict';

let commons = require('../utilities/common_responses');
let texts = require('../utilities/texts');
let SchemaOffers = require('../models/offer');
let tools = require('../utilities/tools');
let errors = require('../utilities/error_codes');
let validations = require('../utilities/validations');
let moment = require('moment');

exports.getAllOffers = function(req,res){
    if (req.query.start && req.query.number){
        let offset = 0;
        let number = 50;
        if (!isNaN(res.query.start)) offset = tools.toNumber(req.query.start);
        if (!isNaN(res.query.number)) number = tools.toNumber(req.query.number);
        //TODO: afegir ofertes en establiment amb codi postal "igual"
        //TODO: afegir ofertes en establiments seguits
        SchemaOffers.find({}).sort('ValidSince').skip(number).limit(offset).exec(function(err,data){
            if (err) commons.dbAccesError(res);
            else commons.validationError(res,{Count : data.length,Offers:data})
        });
    }else {
        SchemaOffers.find({}).sort('ValidSince').limit(50).exec(function(err,data){
            if (err) commons.dbAccesError(res);
            else commons.validResponse(res,{Count : data.length,Offers:data})
        });
    }
};

exports.getBusinessOffers = function(req,res){
    if (req.CURRENT_USER){
        if (req.params.id){
            SchemaOffers.find({Business:req.params.id}).populate('Products Business').exec(function(err,data){
                if (err) commons.dbAccesError(res);
                else commons.validResponse(res,{Count : data.length,Offers:data})
            });
        }else commons.paramsValidationError(res,{id:texts.empty_value})
    }else commons.undefinedErrorResponse(res);
};

exports.createOffer = function(req,res){
    if (req.CURRENT_USER){
        req.body.ValidSince = tools.toDate(req.body.ValidSince);
        req.body.ExpirationDate = tools.toDate(req.body.ExpirationDate);
        req.body.MinDiscount = getMinDiscount(req.body.Products);
        req.body.MaxDiscount = getMaxDiscount(req.body.Products);
        req.body.Business = req.CURRENT_USER._id.toString();
        let new_offer = new SchemaOffers(req.body);
        new_offer.save(commons.defaultSaveDbCallback(res));
    }else commons.undefinedErrorResponse(res);
};

function getMinDiscount(products){
    let min = 100;
    products.forEach(function(item){
        if (item.Discount < min) min = item.Discount;
    });
    return min;
}

function getMaxDiscount(products){
    let max = 0;
    products.forEach(function(item){
        if (item.Discount > max) max = item.Discount;
    });
    return max;
}

exports.updateOffer = function(req,res){
    if (req.CURRENT_USER){
        req.body.ValidSince = tools.toDate(req.body.ValidSince);
        req.body.ExpirationDate = tools.toDate(req.body.ExpirationDate);
        SchemaOffers.findOneAndUpdate({_id:req.params.id,Business:req.CURRENT_USER._id.toString()},req.body,{upsert:false},function(err){
            if (err) commons.dbSaveError(res, err.toString());
            else commons.validResponse(res);
        });
    }else commons.undefinedErrorResponse(res);
};

exports.deleteOffer = function(req,res){
    if (req.CURRENT_USER){
        validations.validateOfferExists(req.CURRENT_USER._id.toString(),req.params.id,function(offer){
            if (offer) {
                if (tools.olderThan(moment().toDate(),tools.toDate(offer.ValidSince)) && !tools.olderThan(moment().toDate(),tools.toDate(offer.ExpirationDate))){
                    commons.errorResponse(res,texts.offer_cant_delete_started,errors.offer_cant_delete_started);
                    //TODO: afegir evitar eliminació oferta ja caducada i feta servir
                }else{
                    offer.remove(function(err){
                        if (err) commons.dbDeleteError(res,err.toString());
                        else commons.validResponse(res);
                    })
                }
            }else commons.errorResponse(res,texts.offer_not_found,errors.offer_not_found);
        });
    }else commons.undefinedErrorResponse(res);
};