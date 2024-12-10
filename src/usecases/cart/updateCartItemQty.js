class updateCartItemQty {
  constructor({ cartItemRepository }) {
    this.cartItemRepository = cartItemRepository;
  }

  async execute(cartItemId, addQty) {
    return this.cartItemRepository.updateCartItem(cartItemId, addQty);
  }
}

module.exports = updateCartItemQty;
  