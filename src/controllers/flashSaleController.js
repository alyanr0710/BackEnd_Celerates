const FlashSaleRepository = require('../repositories/flashSaleRepository');
const ItemRepository = require("../repositories/itemRepository");
const CreateFlashSale = require("../usecases/flashsale/createFlashSale");

const flashSaleRepository = new FlashSaleRepository();
const itemRepository = new ItemRepository();
const Joi = require("joi");

module.exports = {
    async create(req, res) {
        try {
            // validasi request body
            const reqSchema = Joi.object({
                item_id: Joi.number().required(),
                flash_price: Joi.number().required(),
                start_time: Joi.date().required(),
                end_time: Joi.date().required(),
            });

            const { error } = reqSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            // cek category_id
            const item = await itemRepository.findById(req.body.item_id);
            if (!item) {
                return res.status(404).json({ message: "Item not found" });
            }

            const createFlashSale = new CreateFlashSale(flashSaleRepository);
            const flashSale = await createFlashSale.execute(req.body);
            return res.status(201).json(flashSale);
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    },
    
    async readActive(req, res) {
        try {
            const flashSales = await flashSaleRepository.findAllActive();
            return res.status(200).json(flashSales);
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    },

    async readById(req, res) {
        try {
            const readItemById = new ReadItemById(itemRepository);
            const item = await readItemById.execute(req.params.id);
            return res.status(200).json(item);
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    },
    
    async update(req, res) {
        try {
           
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    },
    
    async delete(req, res) {
        try {
            
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    },
};
