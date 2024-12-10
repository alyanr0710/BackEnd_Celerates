const RatingRepository = require("../repositories/ratingRepository");
const ItemRepository = require("../repositories/itemRepository");
const CartItemRepository = require("../repositories/cartItemRepository");
const Joi = require("joi");

const fs = require('fs');
const path = require('path');

const ratingRepository = new RatingRepository();
const itemRepository = new ItemRepository();
const cartItemRepository = new CartItemRepository();

module.exports = {
    async addrating(req, res) {
        try {
            // Validasi request body
            const reqSchema = Joi.object({
                item_id: Joi.number().required(),
                rating: Joi.number().min(1).max(5).required(),
                desc: Joi.string(),
            });
    
            const { error } = reqSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    status: "invalid_request",
                    message: error.message,
                });
            }
    
            const userId = req.user.id;
            const { item_id, rating, desc } = req.body;
    
            // Cek apakah item valid
            const item = await itemRepository.findById(item_id);
            if (!item) {
                return res.status(404).json({
                    status: "not_found",
                    message: "Item not found",
                });
            }
    
            // Cek apakah user sudah memberikan rating untuk item ini
            const existingRating = await ratingRepository.getRatingByItemIdAndUserId(item_id, userId);
            if (existingRating) {
                return res.status(400).json({
                    status: "bad_request",
                    message: "You have already rated this item",
                });
            }
    
            // Tambahkan rating baru
            const newRating = await ratingRepository.createRating({
                item_id,
                user_id: userId,
                rating,
                desc,
            });
    
            // Ambil semua rating untuk item ini setelah menambahkan yang baru
            const ratings = await ratingRepository.getRatingByItemId(item_id);
    
            // Hitung rata-rata rating terbaru
            const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
            const rataRataRating = ratings.length > 0 ? totalRating / ratings.length : rating;
    
            // Perbarui rata-rata rating di item
            await itemRepository.updateRating(item_id, rataRataRating);
    
            return res.json({
                status: "success",
                data: newRating,
            });
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: "internal_error",
                message: "Internal server error",
            });
        }
    },
    

    async getRatingByItemId(req, res) {
        try {

            // menerima custom rating
            if (req.body.rating) {
                const reqSchema = Joi.object({
                    rating: Joi.number().min(1).max(5),
                });
                const { error } = reqSchema.validate(req.body);
                if (error) {
                    return res.status(400).json(
                        {
                            "status": "invalid_request",
                            "message": error.message
                        }
                    );
                }
            }

            const itemId = req.params.itemId;

            const item = await itemRepository.findById(itemId);
            if (!item) {
                return res.status(404).json(
                    {
                        "status": "not_found",
                        "message": "Item not found"
                    }
                );
            }

            // cek jika ada rating custom
            let ratings = [];
            const allRatings = await ratingRepository.getRatingByItemId(itemId);
            if (req.body.rating) {
                const rating = parseInt(req.body.rating);
                ratings = await ratingRepository.getRatingByItemIdFilterRating(itemId, rating);
            } else {
                ratings = allRatings;
            }


            const countRatingPerStar = [0, 0, 0, 0, 0];
            allRatings.forEach(rating => {
                countRatingPerStar[Math.floor(rating.rating) - 1]++;
            });

            const mappedRatings = ratings.map(rating => {
                let profileImage = "http://localhost:3000/uploads/profile_" + rating.user.id + ".png";
                // cek apakah file ada
                if (!fs.existsSync(path.join(__dirname, '../../uploads/profile_' + rating.user.id + '.png'))) {
                    profileImage = "http://localhost:3000/uploads/profile_" + rating.user.id + ".jpg";
                    if (!fs.existsSync(path.join(__dirname, '../../uploads/profile_' + rating.user.id + '.jpg'))) {
                    profileImage = "http://localhost:3000/uploads/profile_" + rating.user.id + ".jpeg";
                    if (!fs.existsSync(path.join(__dirname, '../../uploads/profile_' + rating.user.id + '.jpeg'))) {
                        profileImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                    }
                    }       
                }
                return {
                    "id": rating.id,
                    "name": rating.user.name,
                    "rating": rating.rating,
                    "desc": rating.desc,
                    "profile_image": profileImage
                };
            });

            return res.json(
                {
                    "status": "success",
                    "data": {
                        "rating_count": {
                            "1": countRatingPerStar[0],
                            "2": countRatingPerStar[1],
                            "3": countRatingPerStar[2],
                            "4": countRatingPerStar[3],
                            "5": countRatingPerStar[4]
                        },
                        "item_rating": item.rating + "/5",
                        "ratings": mappedRatings
                    }
                }
            );
        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                "status": "internal_error",
                "message": "Internal server error"
             });
        }
    },

    async getItemHasBuyed(req, res) {
        try {
            const userId = req.user.id;

            const cartItems = await cartItemRepository.getHiddenCartItemByUserId(userId);

            // pilih yang unik aja
            const uniqueCartItems = [];
            const uniqueItemIds = [];
            cartItems.forEach(cartItem => {
                if (!uniqueItemIds.includes(cartItem.item_id)) {
                    uniqueItemIds.push(cartItem.item_id);
                    uniqueCartItems.push(cartItem);
                }
            });


            return res.json(
                {
                    "status": "success",
                    "data": {
                        "items": uniqueCartItems
                    }
                }
            );
        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                "status": "internal_error",
                "message": "Internal server error"
             });
        }
    },

    async getAllRatings(req, res) {
        try {

            // jika ada limit di request
            let limit = req.body.limit || null;
            if (limit) {
                const reqSchema = Joi.object({
                    limit: Joi.number().min(1).required(),
                });
                const { error } = reqSchema.validate(req.body);
                if (error) {
                    return res.status(400).json(
                        {
                            "status": "invalid_request",
                            "message": error.message
                        }
                    );
                }
            }

            let ratings = [];
            if (limit) {
                limit = parseInt(limit);
                ratings = await ratingRepository.getAllRatingWithLimit(limit);
            } else {
                ratings = await ratingRepository.getAllRatings();
            }

            const mappedRatings = ratings.map(rating => {
                let profileImage = "http://localhost:3000/uploads/profile_" + rating.user.id + ".png";
                // cek apakah file ada
                if (!fs.existsSync(path.join(__dirname, '../../uploads/profile_' + rating.user.id + '.png'))) {
                    profileImage = "http://localhost:3000/uploads/profile_" + rating.user.id + ".jpg";
                    if (!fs.existsSync(path.join(__dirname, '../../uploads/profile_' + rating.user.id + '.jpg'))) {
                    profileImage = "http://localhost:3000/uploads/profile_" + rating.user.id + ".jpeg";
                    if (!fs.existsSync(path.join(__dirname, '../../uploads/profile_' + rating.user.id + '.jpeg'))) {
                        profileImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                    }
                    }       
                }
                
                return {
                    "id": rating.id,
                    "name": rating.user.name,
                    "rating": rating.rating,
                    "desc": rating.desc,
                    "profile_image": profileImage,
                };
            });
            


            return res.json(
                {
                    "status": "success",
                    "data": {
                        "ratings": mappedRatings
                    }
                }
            );
        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                "status": "internal_error",
                "message": "Internal server error"
             });
        }
    }
};
