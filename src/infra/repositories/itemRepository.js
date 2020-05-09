const DB = require('./inMemDB')
const { Ok } = require('buchu')
const { Item } = require('../../domain/entities/item')

module.exports = class ItemListRepositoy {
  constructor() {
    this.table = 'item'
  }

  async save(item) {
    const ret = await DB.set(this.table, item.id, item)
    return Ok(Item.fromJSON(ret))
  }

  async geItemByListID(id) {
    const ret = await DB.get(this.table)
    const itemListArray = []
    for (var i = 0, len = ret.length; i < len; i++) {
      if (ret[i] === undefined || ret.idList !== id) continue
      itemListArray.push(Item.fromJSON(ret[i]))
    }
    return Ok(itemListArray)
  }

  async getItemByID(id) {
    const ret = await DB.getMany(this.table, id)
    let item = undefined
    for (var i = 0, len = ret.length; i < len; i++) {
      if (ret[i] === undefined ) continue
      item = Item.fromJSON(ret[i])
    }
    return Ok(item)
  }
}
