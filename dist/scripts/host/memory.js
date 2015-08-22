// Created by: Brian Dones
var TSOS;
(function (TSOS) {
    var Memory = (function () {
        //Create instance of memory and fill memory array with default zeros.
        function Memory() {
            this.memory = [];
            for (var i = 0; i < 768; i++) {
                this.memory[i] = "00";
            }
            document.getElementById("memoryDisplay").value = this.memory.join(" ");
        }
        // Method for retrieving memory value at a specific block or bit.
        Memory.prototype.getMemoryAddress = function (location) {
            return this.memory[location];
        };

        // Method for writing a value into a specific block or bit of memory.
        Memory.prototype.setMemoryAddress = function (location, value) {
            // Pads memory value if the value is not two characters.
            if (value.length == 1) {
                value = "0" + value;
            }
            this.memory[location] = value;
            document.getElementById("memoryDisplay").value = this.memory.join(" ");
        };
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
