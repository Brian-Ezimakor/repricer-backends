const PriorityQueue = require("./priorityQueue");

const HIGH_INTERVAL = 6 * 60 * 1000;
const MEDIUM_INTERVAL = 15 * 60 * 1000;
const LOW_INTERVAL = 30 * 60 * 1000;

class QueueManager {
  constructor() {
    this.high = new PriorityQueue();
    this.medium = new PriorityQueue();
    this.low = new PriorityQueue();
  }

  getInterval(priority) {
    switch (priority) {
      case "HIGH":
        return HIGH_INTERVAL;
      case "MEDIUM":
        return MEDIUM_INTERVAL;
      case "LOW":
        return LOW_INTERVAL;
      default:
        return null;
    }
  }

  addToQueue(product, priority) {
    switch (priority) {
      case "HIGH":
        this.high.enqueue(product);
        break;
      case "MEDIUM":
        this.medium.enqueue(product);
        break;
      case "LOW":
        this.low.enqueue(product);
        break;
    }
  }

  getNextProduct() {
    if (!this.high.isEmpty()) return this.high.dequeue();
    if (!this.medium.isEmpty()) return this.medium.dequeue();
    if (!this.low.isEmpty()) return this.low.dequeue();
    return null;
  }
}

module.exports = QueueManager;