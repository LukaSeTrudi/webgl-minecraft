import { ItemFactory } from "../world/ItemFactory.js";

export class Inventory {
  
  constructor() {
    this.allItems = new Array(36).fill(null);
    this.selectedIndex = 0;
    this.openedInventory = false;
    window.inventory = this;
    this.changeSelectedIndex(0);
    this.initDom();
  }

  initDom() {
    this.allItems.forEach((item, index) => {
      let dom = document.querySelector('.selectionItem'+index);
      dom.addEventListener("drop", (e) => this.onDrop(e, index));
      dom.addEventListener("dragover", this.dragOver);
    });
  }

  getSelectedItem() {
    return this.allItems[this.selectedIndex];
  }

  subSelected() {
    let item = this.getSelectedItem();
    if(item) {
      item.quantity--;
    }
    if(item.quantity <= 0) {
      this.allItems[this.selectedIndex] = null;
    }
    this.drawItems();
  }

  shiftItem(index) {
    
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
    console.log(_item)
    _item.quantity = Math.floor(Math.random()*64);
    this.allItems.forEach((item, index, arr) => { // try add into existing
      if(item && item.item.id == _item.item.id && _item.quantity > 0) {
        let allowedSpace = item.item.stack - item.quantity;
        let remove = Math.min(allowedSpace, _item.quantity);
        arr[index].quantity+=remove;
        _item.quantity-=remove;
      }
    })
    if(_item.quantity > 0) {
      this.allItems.forEach((item, index, arr) => {
        if(item == null && _item) {
          arr[index] = _item;
          _item = null;
        }
      });
    }
    this.drawItems();
  }

  drawItems() {
    this.allItems.forEach((item, index) => {
      let dom = document.querySelector('.selectionItem'+index);
      let html = '<div></div>';
      if(item) {
        html = '<div class="item" draggable="true" ondragstart="window.inventory.dragStart(event,'+index+')"><img src="./common/items/'+item.item.preview+'"><p>'+item.quantity+'</p></div>';
      }
      dom.innerHTML = html;
      if(index < 9) {
        let domGame = document.querySelector('.gameItem'+index);
        if(item) {
          html = '<img src="./common/items/'+item.item.preview+'"><p>'+item.quantity+'</p>'
        } else {
          html = '';
        }
        domGame.innerHTML = html;
      }
    });
  }

  dragStart(e, index) {
    e.dataTransfer.setData("text/plain", index)
    e.dataTransfer.dropEffect = "move";
  }

  dragOver(e) {
    e.preventDefault();
  }

  onDrop(e, dropIndex) {
    e.preventDefault();
    let oldIndex = parseInt(e.dataTransfer.getData("text/plain"));
    const temp = this.allItems[oldIndex];
    this.allItems[oldIndex] = this.allItems[dropIndex];
    this.allItems[dropIndex] = temp;
    this.drawItems();
  }



}