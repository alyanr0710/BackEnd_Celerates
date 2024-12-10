const VoucherRepository = require('../repositories/voucherRepository');
const UserVoucherRepository = require('../repositories/userVoucherRepository');
const Joi = require("joi");
const { check } = require('express-validator');

module.exports = {
    async getMyVoucher(req, res) {
        try {
            const userVouchersRepo = new UserVoucherRepository
            const userVouchers = await userVouchersRepo.getUserVoucherByUserId(req.user.id);
            
            
            const data = userVouchers.map((userVoucher) => {
                return {
                    id: userVoucher.id,
                    name: userVoucher.voucher.name.split('-')[1].trim(),
                    code: userVoucher.voucher.code,
                    remaining: userVoucher.remaining,
                    disc_type: userVoucher.voucher.disc_type,
                    min_expense: userVoucher.voucher.min_expense,
                }
            })

            return res.status(200).json({
                status: "success",
                message: "Success",
                data: data,
            });
        } catch (error) {
            return res.status(500).json(
                {
                    status: "error",
                    message: error.message,
                }
            );
        }
    },

    async checkVoucher(req, res) {
        try {
            const schema = Joi.object({
                code: Joi.string().required(),
            });
            const { error } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    status: "error",
                    message: error.message,
                });
            }

            const userVoucherRepo = new UserVoucherRepository;
            const userVoucher = await userVoucherRepo.getUserVoucherByVoucherCode(req.user.id, req.body.code);

            if (!userVoucher) {
                return res.status(400).json({
                    status: "error",
                    message: "Voucher not found",
                });
            }

            if (userVoucher.remaining <= 0) {
                return res.status(400).json({
                    status: "error",
                    message: "Voucher has been used up",
                });
            }

            return res.status(200).json({
                status: "success",
                message: "Success",
                data: {
                    id: userVoucher.id,
                    name: userVoucher.voucher.name,
                    remaining: userVoucher.remaining,
                    disc_type: userVoucher.voucher.disc_type,
                    min_expense: userVoucher.voucher.min_expense,
                    disc: userVoucher.voucher.disc,
                },
            });

        } catch (error) {
            return res.status(500).json(
                {
                    status: "error",
                    message: error.message,
                }
            );
        }
    }
};
