const AddressRepository = require('../repositories/addressRepository');

const updateAddress = require('../usecases/address/updateAddress');
const createAddress = require('../usecases/address/createAddress');

const addressRepository = new AddressRepository();
const Joi = require("joi");

module.exports = {
    async create(req, res) {
        try {
            const reqSchema = Joi.object({
                nama_alamat: Joi.string().required(),
                alamat: Joi.string().required(),
                no_telpon: Joi.string().required(),
                penerima: Joi.string().required(),
            });

            const { error } = reqSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    "status": "invalid_request",
                    "message": error.message
                 });
            }

            const userId = req.user.id;
            if (!userId) {
                return res.status(401).json({ 
                    "status": "unauthorized",
                    "message": "Unauthorized"
                 });
            }
            const data = {
                address_name: req.body.nama_alamat,
                address: req.body.alamat,
                phone_number: req.body.no_telpon,
                user_id: userId,
                recipient: req.body.penerima
            };

            const addresses = await addressRepository.getAddressByUserId(userId);
            if (addresses !== null) {
                if (addresses.length >= 5) {
                    return res.status(400).json({ 
                        "status": "invalid_request",
                        "message": "You have reached the maximum limit of addresses"
                    });
                }
            }
            
            const address = new createAddress(addressRepository);
            await address.execute(data);
            return res.status(201).json({ 
                "status": "success",
                "message": "Address created successfully",
            });
            
        } catch (err) {
            console.log(err);
            return res.status(400).json({ 
                "status": "error",
                "message": "Failed to create address",
                'error': err.message
             });
        }
    },
    async getById(req, res) {
        try {
            const id = req.params.id;
            const userId = req.user.id;
            if (!userId) {
                return res.status(401).json({ 
                    "status": "unauthorized",
                    "message": "Unauthorized"
                 });
            }

            const addressData = await addressRepository.getAddressById(id);
            if (!addressData) {
                return res.status(404).json({ 
                    "status": "not_found",
                    "message": "Address not found"
                 });
            }

            if (addressData.user_id !== userId) {
                return res.status(401).json({ 
                    "status": "unauthorized",
                    "message": "Unauthorized"
                 });
            }

            return res.status(200).json({ 
                "status": "success",
                "data": addressData
             });
        } catch (err) {
            console.log(err);
            return res.status(400).json({ 
                "status": "error",
                "message": "Failed to get address",
                'error': err.message
             });
        }
    },
    async getAll(req, res) {
        try {
            const userId = req.user.id;
            if (!userId) {
                return res.status(401).json({ 
                    "status": "unauthorized",
                    "message": "Unauthorized"
                 });
            }

            const addressData = await addressRepository.getAddressByUserId(userId);
            return res.status(200).json({ 
                "status": "success",
                "data": addressData
             });
        }
        catch (err) {
            console.log(err);
            return res.status(400).json({ 
                "status": "error",
                "message": "Failed to get address",
                'error': err.message
             });
        }
    },
    async update(req, res) {
        try {
            const reqSchema = Joi.object({
                nama_alamat: Joi.string().required(),
                alamat: Joi.string().required(),
                no_telpon: Joi.string().required(),
                penerima: Joi.string().required(),
            });

            const { error } = reqSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    "status": "invalid_request",
                    "message": error.message
                 });
            }

            const id = req.params.id;
            const userId = req.user.id;
            if (!userId) {
                return res.status(401).json({ 
                    "status": "unauthorized",
                    "message": "Unauthorized"
                 });
            }

            const addressData = await addressRepository.getAddressById(id);
            if (!addressData) {
                return res.status(404).json({ 
                    "status": "not_found",
                    "message": "Address not found"
                 });
            }

            if (addressData.user_id !== userId) {
                return res.status(401).json({ 
                    "status": "unauthorized",
                    "message": "Unauthorized"
                 });
            }

            const data = {
                id: id,
                address_name: req.body.nama_alamat,
                address: req.body.alamat,
                phone_number: req.body.no_telpon,
                recipient: req.body.penerima
            };

            const address = new updateAddress(addressRepository);
            await address.execute(data);
            return res.status(200).json({ 
                "status": "success",
                "message": "Address updated successfully",
            });
            
        } catch (err) {
            console.log(err);
            return res.status(400).json({ 
                "status": "error",
                "message": "Failed to update address",
                'error': err.message
             });
        }
    },
    async delete(req, res) {
        try {
            const id = req.params.id;
            const userId = req.user.id;
            if (!userId) {
                return res.status(401).json({ 
                    "status": "unauthorized",
                    "message": "Unauthorized"
                 });
            }

            const addressData = await addressRepository.getAddressById(id);
            if (!addressData) {
                return res.status(404).json({ 
                    "status": "not_found",
                    "message": "Address not found"
                 });
            }

            if (addressData.user_id !== userId) {
                return res.status(401).json({ 
                    "status": "unauthorized",
                    "message": "Unauthorized"
                 });
            }

            await addressRepository.deleteAddress(id);
            return res.status(200).json({ 
                "status": "success",
                "message": "Address deleted successfully",
            });
            
        } catch (err) {
            console.log(err);
            return res.status(400).json({ 
                "status": "error",
                "message": "Failed to delete address",
                'error': err.message
             });
        }
    }
};
