///<reference path="deviceDriver.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/* ----------------------------------
DeviceDriverKeyboard.ts
Requires deviceDriver.ts
The Kernel Keyboard Device Driver.
---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var DeviceDriverKeyboard = (function (_super) {
        __extends(DeviceDriverKeyboard, _super);
        function DeviceDriverKeyboard() {
            // Override the base method pointers.
            _super.call(this, this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
        }
        DeviceDriverKeyboard.prototype.krnKbdDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        };

        DeviceDriverKeyboard.prototype.krnKbdDispatchKeyPress = function (params) {
            // Parse the params.    TODO: Check that they are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            var capLock = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";

            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) || ((keyCode >= 97) && (keyCode <= 123))) {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);

                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }

                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            } else if (((keyCode >= 48) && (keyCode <= 57)) || (keyCode == 32) || (keyCode == 13)) {
                if ((isShifted) && (keyCode == 48)) {
                    keyCode = 41;
                    chr = ")";
                } else if ((isShifted) && (keyCode == 49)) {
                    keyCode = 33;
                    chr = "!";
                } else if ((isShifted) && (keyCode == 50)) {
                    keyCode = 64;
                    chr = "@";
                } else if ((isShifted) && (keyCode == 51)) {
                    keyCode = 35;
                    chr = "#";
                } else if ((isShifted) && (keyCode == 52)) {
                    keyCode = 36;
                    chr = "$";
                } else if ((isShifted) && (keyCode == 53)) {
                    keyCode = 37;
                    chr = "%";
                } else if ((isShifted) && (keyCode == 54)) {
                    keyCode = 94;
                    chr = "^";
                } else if ((isShifted) && (keyCode == 55)) {
                    keyCode = 38;
                    chr = "&";
                } else if ((isShifted) && (keyCode == 56)) {
                    keyCode = 42;
                    chr = "*";
                } else if ((isShifted) && (keyCode == 57)) {
                    keyCode = 40;
                    chr = "(";
                }
                if ((chr === "&") || (chr === "(")) {
                    _KernelInputQueue.enqueue(chr);
                } else {
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
            } else if ((keyCode >= 186) && (keyCode <= 192) || (keyCode >= 219) && (keyCode <= 222) || (keyCode == 8) || (keyCode == 9) || (keyCode == 38) || (keyCode == 40)) {
                if ((isShifted) && (keyCode == 186)) {
                    keyCode = 58;
                } else if ((isShifted == false) && (keyCode == 186)) {
                    keyCode = 59;
                } else if ((isShifted) && (keyCode == 187)) {
                    keyCode = 43;
                } else if ((isShifted == false) && (keyCode == 187)) {
                    keyCode = 61;
                } else if ((isShifted) && (keyCode == 188)) {
                    keyCode = 60;
                } else if ((isShifted == false) && (keyCode == 188)) {
                    keyCode = 44;
                } else if ((isShifted) && (keyCode == 189)) {
                    keyCode = 95;
                } else if ((isShifted == false) && (keyCode == 189)) {
                    keyCode = 45;
                } else if ((isShifted) && (keyCode == 190)) {
                    keyCode = 62;
                } else if ((isShifted == false) && (keyCode == 190)) {
                    keyCode = 46;
                } else if ((isShifted) && (keyCode == 191)) {
                    keyCode = 63;
                } else if ((isShifted == false) && (keyCode == 191)) {
                    keyCode = 47;
                } else if ((isShifted) && (keyCode == 192)) {
                    keyCode = 126;
                } else if ((isShifted == false) && (keyCode == 192)) {
                    keyCode = 96;
                } else if ((isShifted) && (keyCode == 219)) {
                    keyCode = 123;
                } else if ((isShifted == false) && (keyCode == 219)) {
                    keyCode = 91;
                } else if ((isShifted) && (keyCode == 220)) {
                    keyCode = 124;
                } else if ((isShifted == false) && (keyCode == 220)) {
                    keyCode = 92;
                } else if ((isShifted) && (keyCode == 221)) {
                    keyCode = 125;
                } else if ((isShifted == false) && (keyCode == 221)) {
                    keyCode = 93;
                } else if ((isShifted) && (keyCode == 222)) {
                    keyCode = 34;
                } else if ((isShifted == false) && (keyCode == 222)) {
                    keyCode = 39;
                }
                if (keyCode == 38) {
                    chr = "UP_Key";
                    _KernelInputQueue.enqueue(chr);
                } else if (keyCode == 40) {
                    chr = "DOWN_Key";
                    _KernelInputQueue.enqueue(chr);
                } else {
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
            }
        };
        return DeviceDriverKeyboard;
    })(TSOS.DeviceDriver);
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
