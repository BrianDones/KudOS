///<reference path="../globals.ts" />
///<reference path="../host/memory.ts" />
// Created by: Brian Dones

module TSOS {

    export class MemoryManager {

        memory = new Memory();

        public blocks: boolean[] = [true, true, true]; // Variable to keep track of each block of memory.

        // Method for identifying which block of memory we are in.
        public getBlock(): number {
            for (var i = 0; i < this.blocks.length; i++) {
                if (this.blocks[i]) {
                    this.blocks[i] = false;
                    return i * 256;
                }
            }
            return -1;
        }

        // Method that allows the Memory Manager to gain access to read memory.
        public getMemoryAddress(location): number {
            // Checks other memory blocks if more than one program has been loaded in memory.
            if(_Kernel.running != undefined) {
                location += _Kernel.running.baseRegister;
            }
            // Checks to see if we are trying to retrieve from memory out of bound from the memory block.
            if (location > _Kernel.running.limitRegister) {
                _StdOut.putText("You've reach the limit of the memory block.");
                _CPU.breakSystemCall();
            }
            return parseInt(this.memory.getMemoryAddress(location), 16);
        }

        // Method that allows the Memory Manager to gain access to write to memory.
        public setMemoryAddress(location, value): void {
            // Checks other memory blocks if more than one program has been loaded in memory.
            if(_Kernel.running != undefined) {
                location += _Kernel.running.baseRegister;
                // Checks to see if we are trying to write to memory that is out of bound from the memory block.
                if (location > _Kernel.running.limitRegister) {
                    _StdOut.putText("You've reach the limit of the memory block.");
                    _CPU.breakSystemCall();
                    return;
                }
            }
            this.memory.setMemoryAddress(location, value.toString(16));
        }

        // Method to handle loading in a program into memory.
        public loadProgram(program): number {
            var baseReg = this.getBlock();
            if (baseReg == -1) {
                return -1;
            }
            var i = 0;
            while (i < program.length) {
                this.memory.setMemoryAddress(baseReg + i, program[i]);
                i++;
            }
            return baseReg;
        }

        // Method that... well... clears memory.
        public clearMemory(): void {
            for (var i = 0; i < 768; i++) {
                this.setMemoryAddress(i, 0);
                this.memory.setMemoryAddress(i, "0");
            }
            // Resets blocks to true so that the memory manager knows that
            // the memory block is now available.
            this.blocks = [true, true, true];

            // Also, we have to empty out the resident List.
            _Kernel.residentList.splice(0, (_Kernel.residentList.length));
        }

        public clearMemoryBlock(location): void {
            for (var i = 0; i < 256; i++) {
                this.memory.setMemoryAddress(i + location, "0");
            }
            this.blocks[location/256] = true;
        }
    }
}
