// PriorityQueue.js

class PriorityQueue {
    constructor() {
        this.heap = [];
    }

    parentIndex(index) {
        return Math.floor((index - 1) / 2);
    }

    leftChildIndex(index) {
        return 2 * index + 1;
    }

    rightChildIndex(index) {
        return 2 * index + 2;
    }

    swap(index1, index2) {
        [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
    }

    enqueue(pair) {
        this.heap.push(pair);
        this.heapifyUp();
    }

    dequeue() {
        if (this.heap.length === 0) {
            return null;
        }
        if (this.heap.length === 1) {
            return this.heap.pop();
        }
        const root = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown();
        return root;
    }

    heapifyUp() {
        let index = this.heap.length - 1;
        while (index > 0) {
            let parentIndex = this.parentIndex(index);
            if (this.heap[parentIndex][0] >= this.heap[index][0]) { 
                break;
            }
            this.swap(parentIndex, index);
            index = parentIndex;
        }
    }

    heapifyDown() {
        let index = 0;
        while (this.leftChildIndex(index) < this.heap.length) {
            let largerChildIndex = this.leftChildIndex(index);
            if (this.rightChildIndex(index) < this.heap.length && this.heap[this.rightChildIndex(index)][0] > this.heap[largerChildIndex][0]) {
                largerChildIndex = this.rightChildIndex(index);
            }
            if (this.heap[index][0] >= this.heap[largerChildIndex][0]) { 
                break;
            }
            this.swap(index, largerChildIndex);
            index = largerChildIndex;
        }
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    peek() {
        return this.heap.length === 0 ? null : this.heap[0];
    }
}

export default PriorityQueue;
