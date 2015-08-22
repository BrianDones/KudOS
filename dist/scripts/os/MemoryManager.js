///<reference path="../globals.ts" />
///<reference path="../host/memory.ts" />
// Created by: Brian Dones
var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager() {
            this.memory = new TSOS.Memory();
            this.blocks = [true, true, true];
        }
        // Method for identifying which block of memory we are in.
        MemoryManager.prototype.getBlock = function () {
            for (var i = 0; i < this.blocks.length; i++) {
                if (this.blocks[i]) {
                    this.blocks[i] = false;
                    return i * 256;
                }
            }
            return -1;
        };

        // Method that allows the Memory Manager to gain access to read memory.
        MemoryManager.prototype.getMemoryAddress = function (location) {
            // Checks other memory blocks if more than one program has been loaded in memory.
            if (_Kernel.running != undefined) {
                location += _Kernel.running.baseRegister;
            }

            // Checks to see if we are trying to retrieve from memory out of bound from the memory block.
            if (location > _Kernel.running.limitRegister) {
                _StdOut.putText("You've reach the limit of the memory block.");
                _CPU.breakSystemCall();
            }
            return parseInt(this.memory.getMemoryAddress(location), 16);
        };

        // Method that allows the Memory Manager to gain access to write to memory.
        MemoryManager.prototype.setMemoryAddress = function (location, value) {
            // Checks other memory blocks if more than one program has been loaded in memory.
            if (_Kernel.running != undefined) {
                location += _Kernel.running.baseRegister;

                // Checks to see if we are trying to write to memory that is out of bound from the memory block.
                if (location > _Kernel.running.limitRegister) {
                    _StdOut.putText("You've reach the limit of the memory block.");
                    _CPU.breakSystemCall();
                    return;
                }
            }
            this.memory.setMemoryAddress(location, value.toString(16));
        };

        // Method to handle loading in a program into memory.
        MemoryManager.prototype.loadProgram = function (program) {
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
        };

        // Method that... well... clears memory.
        MemoryManager.prototype.clearMemory = function () {
            for (var i = 0; i < 768; i++) {
                this.setMemoryAddress(i, 0);
                this.memory.setMemoryAddress(i, "0");
            }

            // Resets blocks to true so that the memory manager knows that
            // the memory block is now available.
            this.blocks = [true, true, true];

            // Also, we have to empty out the resident List.
            _Kernel.residentList.splice(0, (_Kernel.residentList.length));
        };

        MemoryManager.prototype.clearMemoryBlock = function (location) {
            for (var i = 0; i < 256; i++) {
                this.memory.setMemoryAddress(i + location, "0");
            }
            this.blocks[location / 256] = true;
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
