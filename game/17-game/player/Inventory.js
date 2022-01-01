import { ItemFactory } from "../world/ItemFactory.js";

export class Inventory {
  
  constructor() {
    this.allItems = new Array(45).fill(null);
    this.selectedIndex = 0;
    this.openedInventory = false;
    window.inventory = this;
    this.changeSelectedIndex(0);
  }

  getSelectedItem() {

  }

  changeSelectedIndex(ind) {
    let elements = document.getElementsByClassName('selected');
    while(elements.length > 0) {
      elements[0].classList.remove('selected');
    }
    this.selectedIndex = ind;
    document.querySelector('.gameItem'+ind).classList.add('selected');
  }

  toggleInventory() {
    if(this.openedInventory) {
      document.querySelector('.overlay').classList.add('hidden');
      document.querySelector("canvas").requestPointerLock();
    } else {
      document.querySelector('.overlay').classList.remove('hidden');
      document.exitPointerLock();
    }
    this.openedInventory = !this.openedInventory;
  }

  addToItems(id) {
    let item = ItemFactory.getItem(id);
    if(item) {
      this.addItem(item);
    }
  }

  addItem(_item) {
    this.allItems.forEach(item => { // try add into existing
      if(item && item.item.id == _item.item.id) {
        let allowedSpace = item.item.stack - item.quantity;
        let remove = Math.min(allowedSpace, _item.quantity);
        item.quantity+=remove;
        _item.quantity-=remove;
        if(_item.quantity <= 0) return;
      }
    })
    this.allItems(item => {
      if(item == null) {
        item = _item;
      }
      console.log(item);
    });
    console.log(this.allItems);
  }



}