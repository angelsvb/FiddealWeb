'use strict';

let commons = require('../utilities/common_responses');
let errors = require('../utilities/error_codes');
let texts = require('../utilities/texts');
let PurchaseSchema = require('../models/purchase');
let ProductSchema = require('../models/product');
let tools = require('../utilities/tools');
let moment = require('moment');
let UserMobilSchema = require('../models/user_mobile_protected');
let FidelizationDiscountSchema = require('../models/fidelization_discount');

exports.getSales = function(req,res){
    if (req.CURRENT_USER){
        PurchaseSchema.find({Business:req.CURRENT_USER._id},function(err,data){
            if (err) commons.dbAccesError(res,err.toString());
            else{
                commons.validResponse(res,{Count: data.length, Sales: data})
            }
        })
    }else commons.undefinedErrorResponse(res);
};

exports.getSale = function(req, res) {
    if (req.CURRENT_USER){
        if (req.params.idSale) {
            PurchaseSchema.find({_id: tools.toObjectId(req.params.idSale), Business: req.CURRENT_USER._id})
                .then(function(doc){
                    if (doc) {
                        if (!req.query.returnInfo) commons.validResponse(res, {Sale: doc});
                        else {
                            //TODO: Buscar devolucions d'una compra
                            //Ajuntar ids producte
                            //Camp returned a true
                        }
                    }
                    else commons.errorResponse(res, texts.purchase_not_found, errors.purchase_not_found);
                })
                .catch(function(err){
                    commons.dbAccesError(res, err.toString());
                })
        } else commons.errorResponse(res,texts.purchase_empty_id,errors.params_validation_error);
    } else commons.undefinedErrorResponse(res);
};

exports.getCurrentSales = function(req,res){
    if (req.CURRENT_USER){
        var today = moment().startOf('day');
        var tomorrow = moment(today).endOf('day');
        PurchaseSchema.find({Business:req.CURRENT_USER._id,CreationDate:{$gte: today.toDate(), $lt: tomorrow.toDate()}},function(err,data){
            if (err) commons.dbAccesError(res,err.toString());
            else{
                commons.validResponse(res,{Count: data.length, Sales: data})
            }
        })
    }else commons.undefinedErrorResponse(res);
};

exports.getManualSales = function(req,res){
    if (req.CURRENT_USER){
        PurchaseSchema.find({Business:req.CURRENT_USER._id,IsManual: true},function(err,data){
            if (err) commons.dbAccesError(res,err.toString());
            else{
                commons.validResponse(res,{Count: data.length, Sales: data})
            }
        })
    }else commons.undefinedErrorResponse(res);
};

exports.getPurchases = function(req,res){
    if (req.CURRENT_USER){
        let callback = function(err,data){
            if (err) commons.dbAccesError(res,err.toString());
            else{
                commons.validResponse(res,{Count: data.length, Purchases: data})
            }
        };
        PurchaseSchema.find({User:req.CURRENT_USER._id}).populate([{path:'Products.Product', model:'Product'}, {path: 'Business', model: 'UserWeb'}]).exec(callback);
    }else commons.undefinedErrorResponse(res);
};

exports.getManualPurchases = function(req,res){
    if (req.CURRENT_USER){
        PurchaseSchema.find({User:req.CURRENT_USER._id,IsManual: true},function(err,data){
            if (err) commons.dbAccesError(res,err.toString());
            else{
                commons.validResponse(res,{Count: data.length, Purchases: data})
            }
        });
    }else commons.undefinedErrorResponse(res);
};

exports.denyManualSale = function(req,res){
    if (req.CURRENT_USER){
        if (req.params.idSale){
            if (req.query.comment){
                PurchaseSchema.find({Business:req.CURRENT_USER._id,IsManual:true},function(err,data){
                    if (err) commons.dbAccesError(res,err.toString());
                    else if (data){
                        if (data.length === 1){
                            data[0].AcceptedManual = false;
                            data[0].ManualRevisionDate = moment().toDate();
                            data[0].ManualRevisionComments = req.query.comment;
                            data[0].save(commons.defaultSaveDbCallback(res));
                        }else commons.undefinedErrorResponse(res);
                    }else commons.errorResponse(res,texts.purchase_not_found,errors.purchase_not_found);
                })
            }else commons.errorResponse(res,texts.purchase_empty_manual_comment,errors.params_validation_error);
        }else commons.errorResponse(res,texts.purchase_empty_id,errors.params_validation_error);
    } else commons.undefinedErrorResponse(res);
};

exports.acceptManualSale = function(req,res){
    if (req.CURRENT_USER){
        if (req.params.idSale){
            PurchaseSchema.find({Business:req.CURRENT_USER._id,IsManual:true},function(err,data){
                if (err) commons.dbAccesError(res,err.toString());
                else if (data){
                    if (data.length === 1){
                        data[0].AcceptedManual = true;
                        data[0].ManualRevisionDate = moment().toDate();
                        data[0].save(function(err,data){
                            if (err) commons.dbSaveError(res,err.toString());
                            else addFidelizationDiscount(req,res,data[0],req.CURRENT_USER)
                        });
                    }else commons.undefinedErrorResponse(res);
                }else commons.errorResponse(res,texts.purchase_not_found,errors.purchase_not_found);
            })
        }else commons.errorResponse(res,texts.purchase_empty_id,errors.params_validation_error);
    }else commons.undefinedErrorResponse(res);
};

exports.setManualPurchase = function(req,res){
    if (req.CURRENT_USER){
        if (req.params.idPurchase){
            PurchaseSchema.findById(req.params.idPurchase).populate("User").exec(function(err,purchase){
                if (err) commons.dbAccesError(res,err.toString());
                else if (!purchase) commons.errorResponse(res,texts.purchase_not_found,errors.purchase_not_found);
                else {
                    if (!purchase.User){
                        //TODO: validar coincideix import, data i negoci
                        //Enllaçar
                        purchase.User = req.CURRENT_USER;
                        purchase.IsManual = true;
                        purchase.TicketImg = req.body.TicketImg;
                        purchase.ManualRegistrationDate = moment().toDate();
                        purchase.save(function(err,saved_purchase){
                            if (err) commons.dbSaveError(res,err.toString());
                            else commons.validResponse(commons.defaultSaveDbCallback(res,saved_purchase))
                        });
                    }else if (purchase.User && purchase.IsManual && purchase.ManualRevisionDate){
                        if (purchase.AcceptedManual) commons.errorResponse(res,texts.purchase_already_linked_manually,errors.purchase_already_linked_manually);
                        else {
                            //TODO: validar coincideix import, data i negoci
                            purchase.User = req.CURRENT_USER;
                            purchase.IsManual = true;
                            purchase.ManualRegistrationDate = moment().toDate();
                            purchase.ManualRevisionDate = undefined;
                            purchase.ManualRevisionComments = undefined;
                            purchase.TicketImg = req.body.TicketImg;
                            purchase.save(function(err,saved_purchase){
                                if (err) commons.dbSaveError(res,err.toString());
                                else commons.validResponse(commons.defaultSaveDbCallback(res,saved_purchase))
                            });
                        }
                    }else if (purchase.User && !purchase.IsManual){
                        commons.errorResponse(res,texts.purchase_already_linked_automatically,errors.purchase_already_linked_automatically);
                    }
                    else commons.undefinedErrorResponse(res);
                }
            });
        }else commons.errorResponse(res,texts.purchase_empty_id,errors.params_validation_error)
    }else commons.undefinedErrorResponse(res);
};

exports.newSale = function(req,res){
    if (req.CURRENT_USER){
        let new_purchase = new PurchaseSchema(req.body);
        new_purchase.save(function(err,saved_purchase){
            if (err) commons.dbSaveError(res,err.toString());
            else {
                commons.validResponse(res,{Sale:saved_purchase});
                if (saved_purchase.PurchaseFidelization) setUsedFidelizationDiscount(saved_purchase.PurchaseFidelization,function(){ updateStocks(req,res,saved_purchase); });
                else if (saved_purchase.User) addFidelizationDiscount(req,res,saved_purchase,function(){ updateStocks(req,res,saved_purchase); });
                else updateStocks(req,res,saved_purchase);
            }
        });
    }else commons.undefinedErrorResponse(res);
};

function addFidelizationDiscount(req,res,purchase,next){
    next();

    UserMobilSchema.findById(purchase.User,function(err,data){
        if (data) {
            let businessId = data.Business.find(id => {
                return id.toString() === req.CURRENT_USER._id.toString()
            });
            if (!businessId) {
                data.Business.push(req.CURRENT_USER._id);
                data.save(function (err, savedUser) {
                });
            }
        }
    });

    var today = moment().startOf('day');
    FidelizationDiscountSchema.findOne({User:purchase.User,Business:req.CURRENT_USER._id,Used:false,ExpirationDate:{$gte: today.toDate()}},function(err,data){
        if (err) console.log("error");
        else{
            console.log(data);
            if (!data) {
                let auxData = {
                    Business : req.CURRENT_USER._id,
                    User : purchase.User,
                    LastPurchase: moment().toDate(),
                    Discount : req.CURRENT_USER.FidelizationParams.discountEquivalence * purchase.PurchaseTotal,
                    Purchases : [purchase._id]
                };
                if (req.CURRENT_USER.FidelizationParams.expires){
                    var currentDate = moment();
                    var futureMonth = moment(currentDate).add(req.CURRENT_USER.FidelizationParams.discountLife, 'M');
                    auxData.ExpirationDate = futureMonth.toDate();
                }
                let aux = new FidelizationDiscountSchema(auxData);
                aux.save(function(err){if (err) console.log("error create"); });
            }
            else if(data) {
                if (req.CURRENT_USER.FidelizationParams.expires && req.CURRENT_USER.FidelizationParams.extendOnPurchase){
                    data.Purchases.push(purchase._id);
                    let currentDate = moment(data.ExpirationDate);
                    FidelizationDiscountSchema.updateOne({_id:data._id},{
                        LastPurchase : moment().toDate(),
                        Discount : data.Discount + req.CURRENT_USER.FidelizationParams.discountEquivalence * purchase.PurchaseTotal,
                        Purchases : data.Purchases,
                        ExpirationDate : moment(currentDate).add(req.CURRENT_USER.FidelizationParams.discountLife, 'M').toDate()
                    },function(err){if(err) console.log("error update")});
                }else{
                    data.Purchases.push(purchase._id);
                    FidelizationDiscountSchema.updateOne({_id:data._id},{
                        LastPurchase : moment().toDate(),
                        Discount : data.Discount + req.CURRENT_USER.FidelizationParams.discountEquivalence * purchase.PurchaseTotal,
                        Purchases : data.Purchases
                    },function(err){if(err) console.log("error update")});
                }
            }
        }
    });
}

function updateStocks(req,res,purchase){
    console.log("updating stock");
    purchase.Products.forEach(function(item){
        let productId = item.Product;
        let amount = item.Amount;
        ProductSchema.findById(productId,function(err,product){
           if (product){
               if (product.Stock > amount) product.Stock -= amount;
               else product.Stock = 0;

               if (product.Stock === 0) product.StockState = 5;
               product.save(function(err,saved_product){})
           }
        });
    });
}

function setUsedFidelizationDiscount(fidelizationDiscount,next){
    FidelizationDiscountSchema.update({_id:fidelizationDiscount._id},{
        UseDate : moment().toDate(),
        Used : true
    },function(err){if(err) console.log("error using")});
    next();
}