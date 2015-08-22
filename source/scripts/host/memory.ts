// Created by: Brian Dones

module TSOS {

    export class Memory {

        private memory = [];

        //Create instance of memory and fill memory array with default zeros.
        constructor() {
          for (var i = 0; i < 768; i++) { // 768 is three 256 blocks of memory
              this.memory[i] = "00";
            }
            (<HTMLInputElement>document.getElementById("memoryDisplay")).value = this.memory.join(" ");
        }

        // Method for retrieving memory value at a specific block or bit.
        public getMemoryAddress(location): string {
            return this.memory[location];
        }

        // Method for writing a value into a specific block or bit of memory.
        public setMemoryAddress(location, value): void {
            // Pads memory value if the value is not two characters.
            if (value.length == 1) {
                value = "0" + value;
            }
            this.memory[location] = value;
            (<HTMLInputElement>document.getElementById("memoryDisplay")).value = this.memory.join(" ");
        }
    }
}
