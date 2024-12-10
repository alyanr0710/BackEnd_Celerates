const TransactionRepository = require('../repositories/transactionRepository');
const TransactionItemRepository = require('../repositories/transactionItemRepository');
const cartRepository = require('../repositories/cartRepository');
const cartItemRepository = require('../repositories/cartItemRepository');
const itemRepository = require('../repositories/itemRepository');
const userRoyaltyRepository = require('../repositories/userRoyaltyRepository');
const VoucherRepository = require('../repositories/voucherRepository');
const UserVoucherRepository = require('../repositories/userVoucherRepository');

const createTransaction = require('../usecases/transaction/createTransaction');
const createTransactionItems = require('../usecases/transaction/createTransactionItems');

const { createQrisInvoice, checkPaymentStatus } = require("../utils/midtransHelper");

const Joi = require("joi");
const { check } = require('express-validator');

module.exports = {
    async create(req, res) {
        try {
            const reqSchema = Joi.object({
                voucher_id: Joi.number(),
                address: Joi.string().required(),
                total_amount: Joi.number().required(),
                items: Joi.array().items(Joi.object({
                    items_id: Joi.number().required(),
                    qty: Joi.number().required(),
                    amount: Joi.number().required()
                })).required().min(1)
            });

            const { error } = reqSchema.validate(req.body);

            if (error) {
                return res.status(400).json({
                    "status": "error",
                    "message": error.message
                });
            }

            // cek apakah items_id valid
            const cartItemRepo = new cartItemRepository();
            let cartId;
            req.body.items.forEach(async item => {
                if (item.items_id < 1) {
                    return res.status(400).json({
                        "status": "error",
                        "message": "items_id must be greater than 0"
                    });
                }
                itemCheck = await cartItemRepo.getCartItemByCartItemId(item.items_id);
                if (!itemCheck) {
                    return res.status(400).json({
                        "status": "error",
                        "message": "items_id not found"
                    });
                }
                
                cartId = itemCheck.cart_id;

                if (itemCheck.item.stock < item.qty) {
                    return res.status(400).json({
                        "status": "error",
                        "message": "stock is not enough"
                    });
                }
            });

            // cek cart apakah miliknya
            const user = req.user;
            const cartRepo = new cartRepository();
            const cart = await cartRepo.getCartByUserId(user.id);

            if (!cart) {
                return res.status(400).json({
                    "status": "error",
                    "message": "Cart not found"
                });
            }

            console.log(cartId, cart.id);

            if (cartId !== cart.id) {
                return res.status(400).json({
                    "status": "error",
                    "message": "Cart not found"
                });
            }

            const transactionRepo = new TransactionRepository();
            const createNewTransaction = new createTransaction(transactionRepo);

            // generate 10 digit random number dan string uppercase
            const orderID = Math.random().toString(36).substring(2, 12).toUpperCase();
            const result = await createQrisInvoice( orderID, req.body.total_amount);
            const expireTime = result.expiry_in_minutes;
            const paymentUrl = result.qr_url;
            
            const transaction = await createNewTransaction.execute({
                status: 'pending',
                userId: user.id,
                orderID: orderID,
                payment_method: 'qr',
                payment_url: paymentUrl,
                voucher_id: req.body.voucher_id,
                amount: req.body.total_amount,
                address: req.body.address,
                total_amount: req.body.total_amount
            });
            
            
            const transactionItemRepo = new TransactionItemRepository();
            const createNewTransactionItems = new createTransactionItems(transactionItemRepo);
            

            const items = req.body.items.map(item => {
                return {
                    transaction_id: transaction.id,
                    items_id: item.items_id,
                    qty: item.qty,
                    amount: item.amount
                }
            });

            await createNewTransactionItems.execute(items);

            // decrement stock
            const ItemRepo = new itemRepository();
            req.body.items.forEach(async item => {
                await ItemRepo.decrementStock(item.items_id, item.qty);
                await ItemRepo.incrementPoint(item.items_id, item.qty);
                await ItemRepo.incrementCountSold(item.items_id, item.qty);

                // delete cart item
                await cartItemRepo.deleteCartItemByItemId(item.items_id);
            });

            return res.status(201).json({
                "status": "success",
                "message": "Transaction created",
                "data": {
                    "transaction_id": transaction.id,
                    "qr_url": paymentUrl,
                    "amount": req.body.total_amount,
                    "expiry_in_minutes": expireTime,
                }
            });

         
        } catch (err) {
            return res.status(400).json({ 
                "status": "error",
                "message": "Failed to create transaction",
                'error': err.message
             });
        }
    },

    async checkPaymentStatus(req, res) {
        try {
            const transactionID = req.params.id;
            const transactionRepo = new TransactionRepository();

            const transaction = await transactionRepo.findById(transactionID);
            if (!transaction) {
                return res.status(404).json({
                    "status": "error",
                    "message": "Transaction not found"
                });
            }

            const orderId = transaction.orderID;

            const result = await checkPaymentStatus(orderId);
            if (result.transaction_status === 'settlement') {

                // cek jika userLoyalty sudah ada
                const userRoyaltyRepo = new userRoyaltyRepository();
                const userRoyalty = await userRoyaltyRepo.getUserRoyalty(transaction.userId);
                if (!userRoyalty) {
                    await userRoyaltyRepo.create({
                        user_id: transaction.userId,
                        level: 0,
                        point: 1
                    });
                } else {
                    
                    // 3-6 = level 1 7-14 = level 2 >=15 = level 3

                    let level = 0;
                    if (userRoyalty.point >= 15) {
                        level = 3;
                    } else if (userRoyalty.point >= 7) {
                        level = 2;
                    } else if (userRoyalty.point >= 3) {
                        level = 1;
                    }
                    await userRoyaltyRepo.update({
                        user_id: transaction.userId,
                        point: userRoyalty.point + 1,
                        level: level
                    });
                    const newPoint = userRoyalty.point + 1;
                    if (newPoint == 1 || newPoint == 3 || newPoint == 7 || newPoint == 15) {
                        const voucherRepository = new VoucherRepository();
                        const voucher = await voucherRepository.getVoucherByLevel(level);
                        
                        if (!voucher) {
                            return res.status(404).json({
                                "status": "error",
                                "message": "Voucher not found"
                            }
                            );
                        }
    
                        let userID = req.user.id;
                        let insertVoucher = [];
                        voucher.forEach(v => {
                            insertVoucher.push({
                                user_id: userID,
                                voucher_id: v.id,
                                remaining: 3,
                            });
                        });
    
                        const userVoucherRepository = new UserVoucherRepository();
    
                        const userVoucher = await userVoucherRepository.batchCreateUserVoucher(insertVoucher);
                        if (!userVoucher) {
                            return res.status(404).json({
                                "status": "error",
                                "message": "Voucher not found"
                            }
                            );
                        }
                    }

                }

                await transactionRepo.update(transactionID, {
                    status: 'on process'
                });
            }

            // expired
            if (result.transaction_status === 'expire') {
                await transactionRepo.update(transactionID, {
                    status: 'expired'
                });
            }

            return res.status(200).json({
                "status": "success",
                "message": "Payment status checked",
                "data": {
                    "payment_status": result.transaction_status,
                }
            });
        } catch (err) {
            return res.status(400).json({ 
                "status": "error",
                "message": "Failed to check payment status",
                'error': err.message
             });
        }
    },

    async getTransaction(req, res) {
        try {
            const user = req.user;
            const transactionRepo = new TransactionRepository();
            const transactions = await transactionRepo.findByUserId(user.id);

            const mappedTransactions = transactions.map((transaction) => {
                return {
                    transactionId: transaction.id,
                    status: transaction.status,
                    orderID: transaction.orderID,
                    payment: {
                        method: transaction.payment_method,
                        url: transaction.payment_url,
                    },
                    amountDetails: {
                        total: transaction.total_amount,
                        address: transaction.address,
                    },
                    items: transaction.transactionItems.map((transactionItem) => {
                        return {
                            id: transactionItem.cartItem.item_id,
                            quantity: transactionItem.qty,
                            amount: transactionItem.amount,
                            name: transactionItem.cartItem.item.name,
                            images: transactionItem.cartItem.item.images.map((image) => image.url),
                        };
                    }),
                };
            });
            

            return res.status(200).json({
                "status": "success",
                "data": mappedTransactions
            });
        } catch (err) {
            console.log(err);
            return res.status(400).json({ 
                "status": "error",
                "message": "Failed to get transaction",
                'error': err.message
             });
        }
    },

    async updateTransactionStatus(req, res) {
        try {
            const transactionID = req.params.id;
            // validasi status
            const reqSchema = Joi.object({
                status: Joi.string().valid('di kembalikan', 'selesai', 'batal').required()
            });

            const { error } = reqSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    "status": "error",
                    "message": error.message
                });
            }

            const transactionRepo = new TransactionRepository();
            const transaction = await transactionRepo.findById(transactionID);
            if (!transaction) {
                return res.status(404).json({
                    "status": "error",
                    "message": "Transaction not found"
                });
            }

            const user = req.user;
            if (transaction.userId !== user.id) {
                return res.status(403).json({
                    "status": "error",
                    "message": "Forbidden"
                });
            }

            // kalau pembatalan harus pending kalo dikembalikan dan selesai harus on process
            if (req.body.status === 'batal' && transaction.status !== 'pending') {
                return res.status(400).json({
                    "status": "error",
                    "message": "Can't cancel transaction that is not pending"
                });
            }

            if ((req.body.status === 'di kembalikan' || req.body.status === 'selesai') && transaction.status !== 'on process') {
                return res.status(400).json({
                    "status": "error",
                    "message": "Please Payment first"
                });
            }

            await transactionRepo.updateStatus(transactionID, req.body.status);

            return res.status(200).json({
                "status": "success",
                "message": "Transaction status updated"
            });
        } catch (err) {
            return res.status(400).json({ 
                "status": "error",
                "message": "Failed to update transaction status",
                'error': err.message
             });
        }
    },

    async getAllTransaction(req, res) {
        try {

            // cek start_date end_date di req.query
            // validasi
            console.log(req.query);
            if (req.query.start_date !== '' || req.query.end_date !== '') {
                const reqSchema = Joi.object({
                    start_date: Joi.date().required(),
                    end_date: Joi.date().required()
                });

                const { error } = reqSchema.validate(req.query);
                if (error) {
                    return res.status(400).json({
                        "status": "error",
                        "message": error.message
                    });
                }
            }

            const user = req.user;
            const transactionRepo = new TransactionRepository();
            const transactions = await transactionRepo.getAll(req.query.start_date, req.query.end_date);

            let total = 0;
            let countOnProcess = 0;
            let countSelesai = 0;
            let countBatal = 0;
            let countDiKembalikan = 0;
            const mappedTransactions = transactions.map((transaction) => {
                // nama item di pisah koma
                if (transaction.status === 'on process') {
                    countOnProcess++;
                }
                if (transaction.status === 'selesai') {
                    total += transaction.total_amount;
                    countSelesai++;
                }
                if (transaction.status === 'batal') {
                    countBatal++;
                }
                if (transaction.status === 'di kembalikan') {
                    countDiKembalikan++;
                }
                const itemNames = transaction.transactionItems.map((transactionItem) => transactionItem.cartItem.item.name).join(', ');
                return {
                    transactionId: transaction.id,
                    status: transaction.status,
                    orderID: transaction.orderID,
                    item_name: itemNames,
                    total: transaction.total_amount,
                    nama_user: transaction.user.name,
                    date: transaction.createdAt,
                };
            });


            return res.status(200).json({
                "status": "success",
                "data": {
                    "status_count" : {
                        "on process": countOnProcess,
                        "selesai": countSelesai,
                        "batal": countBatal,
                        "di kembalikan": countDiKembalikan
                    },
                    "total": total,
                    "transactions": mappedTransactions
                }
            });

        } catch (err) {
            console.log(err);
            return res.status(400).json({ 
                "status": "error",
                "message": "Failed to get transaction",
                'error': err.message
             });
        }
    },

    async getTransactionById(req, res) {
        try {
            const transactionID = req.params.id;
            const transactionRepo = new TransactionRepository();
            const transaction = await transactionRepo.findById(transactionID);
            if (!transaction) {
                return res.status(404).json({
                    "status": "error",
                    "message": "Transaction not found"
                });
            }

            const mappedTransaction = {
                transactionId: transaction.id,
                status: transaction.status,
                orderID: transaction.orderID,
                address: transaction.address,
                total: transaction.total_amount,
                payment_methodmethod: transaction.payment_method,
                user: {
                    name: transaction.user.name,
                    email: transaction.user.email,
                    telp_number: transaction.user.telp_number
                },
                items: transaction.transactionItems.map((transactionItem) => {
                    return {
                        id: transactionItem.cartItem.item_id,
                        quantity: transactionItem.qty,
                        amount: transactionItem.amount,
                        name: transactionItem.cartItem.item.name,
                        images: transactionItem.cartItem.item.images.map((image) => image.url),
                    };
                }),
            };

            return res.status(200).json({
                "status": "success",
                "data": mappedTransaction
            });

        } catch (err) {
            console.log(err);
            return res.status(400).json({ 
                "status": "error",
                "message": "Failed to get transaction",
                'error': err.message
             });
        }
    }
};
