'use strict';

let commons = require('../utilities/common_responses');
let errors = require('../utilities/error_codes');
let texts = require('../utilities/texts');
let ProductSchema = require('../models/product');
let tools = require('../utilities/tools');
let manager = require('../utilities/manager');
let ObjectId = require('mongoose').Types.ObjectId;

exports.getBusinessProducts = function(req,res){
    if (req.CURRENT_USER){
        let type = tools.toNumber(req.CURRENT_USER.Type);
        let callback = function(err,data){
            if (err) commons.dbAccesError(res,err.toString());
            else {
                commons.validResponse(res,{
                    Count : data.length,
                    Products : data
                })
            }
        };
        try{
            if (type === manager.USER_WEB){
                ProductSchema.find({
                    Business : new ObjectId(req.params.businessId)
                }, callback);
            }else if (type === manager.USER_MOBILE){
                ProductSchema.find({
                    Business: new ObjectId(req.params.businessId),
                    IsVisible: true
                },callback)
            }
        }catch (err){
            commons.undefinedErrorResponse(res);
        }
    }else commons.undefinedErrorResponse(res);
};

exports.updateProduct = function(req,res){
    if (req.CURRENT_USER){
        ProductSchema.findOneAndUpdate({_id : req.query.idProduct },req.body,{new: true},function(err,updatedProduct){
            if (err) commons.dbSaveError(res,err.toString());
            else commons.validResponse(res,{product:updatedProduct});
        });
    }else commons.undefinedErrorResponse(res);
};

exports.createProduct = function(req,res){
    if (req.CURRENT_USER){
        let new_product = new ProductSchema(req.body);
        new_product._doc.Business = req.CURRENT_USER._id;
        new_product.save(function(err,product){
            if (err) commons.dbSaveError(res,err.toString());
            else {
                if (product) {
                    req.CURRENT_USER.Productes.push(product._id);
                    req.CURRENT_USER.save(function(err,user){
                        if (err) {
                            product.remove(function(err){});
                            commons.dbSaveError(res);
                        }else commons.validResponse(res,{product:product});
                    });
                }
                else commons.undefinedErrorResponse(res);
            }
        });
    }else commons.undefinedErrorResponse(res);
};

exports.deleteProduct = function(req,res){
    if (req.CURRENT_USER){
        //TODO: AFEGIR MIRAR SI EXISTEIX EN ALGUNA COMPRA/OFERTA I SI EXISTEIX CANCELAR ELIMINACIO
        //SI NO ES CANCELA, BORRAR DE PARE
        ProductSchema.findByIdAndRemove(req.params.idProduct,function(err,product){
            if (err) commons.dbAccessError(res,err.toString());
            else if (!product) {
                commons.errorResponse(res,texts.product_not_found,errors.product_not_found);
            }else {
                if (tools.deleteFromArray(req.CURRENT_USER.Productes,product._id)){
                    commons.validResponse(res);
                }else {
                    product.save(function(err,saved_product){});
                    commons.dbDeleteError(res);
                }
            }
        })
    }else commons.undefinedErrorResponse(res);
};

exports.getProduct = function(req,res){
  if (req.CURRENT_USER){
      if (req.params.idProduct){
          ProductSchema.find({Business:req.CURRENT_USER._id,Reference:req.params.idProduct},function(err,data){
              if (err) commons.dbAccesError(res,err.toString());
              else{
                  if (data.length === 1) commons.validResponse(res,{product:data[0]});
                  else if (data.length === 0){
                      if (tools.validID(req.params.idProduct)){
                          ProductSchema.find({Business:req.CURRENT_USER._id,_id:req.params.idProduct},function(err,data){
                              if (err) commons.dbAccesError(res,err.toString());
                              else{
                                  if (data) commons.validResponse(res,{product:data[0]});
                                  else commons.errorResponse(res,texts.product_not_found,errors.product_not_found);
                              }
                          });
                      }else commons.errorResponse(res,texts.product_not_found,errors.product_not_found);
                  }else commons.undefinedErrorResponse(res);
              }
          });
      }
  }else commons.undefinedErrorResponse(res);
};