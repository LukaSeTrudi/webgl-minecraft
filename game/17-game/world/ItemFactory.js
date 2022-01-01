export class ItemFactory {
  static items = [];

  static getItem(id) {
    return ItemFactory.items.find(x => x.item.id == id).clone();
  }

}