const _ = require('lodash');
const { v4 } = require('uuid');

class GameExchange {
  constructor(exchange) {
    this.uuid = _.get(exchange, 'uuid') || v4();
    this.name = _.get(exchange, 'name');
    //this.image = _.get(exchange, 'image');
    //this.iconImage = _.get(exchange, 'iconImage') || '';
    //this.squareImage = _.get(exchange, 'squareImage') || '';
    this.description = _.get(exchange, 'description') || '';
  }
}

module.exports = GameExchange;