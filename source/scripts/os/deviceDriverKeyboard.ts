///<reference path="deviceDriver.ts" />

/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverKeyboard extends DeviceDriver {

        constructor() {
            // Override the base method pointers.
            super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
        }

        public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnKbdDispatchKeyPress(params) {
            // Parse the params.    TODO: Check that they are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            var capLock = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) ||   // A..Z
                ((keyCode >= 97) && (keyCode <= 123))) {  // a..z {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);
                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }

                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            } else if (((keyCode >= 48) && (keyCode <= 57))   || // digits
                        (keyCode == 32)                       || // space
                        (keyCode == 13)) {                       // enter

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
                  if((chr === "&") ||
                    (chr === "(")){
                    _KernelInputQueue.enqueue(chr);
                  }
                  else{
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                  }
            }
            else if ((keyCode >= 186) && (keyCode <= 192) || // Symbols and punctuation
                     (keyCode >= 219) && (keyCode <= 222) || // Symbols and puncuation
                     (keyCode == 8)                       || // Backspacing
                     (keyCode == 9)                      || // Tabbing
                     (keyCode == 38)                      || // UP Arrow
                     (keyCode == 40))                        // Down Arrow
                     {

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
                if(keyCode == 38){
                  chr = "UP_Key";
                  _KernelInputQueue.enqueue(chr);
                }
                else if(keyCode == 40){
                  chr = "DOWN_Key";
                  _KernelInputQueue.enqueue(chr);
                }
                else{
                  chr = String.fromCharCode(keyCode);
                  _KernelInputQueue.enqueue(chr);
                }
            }
        }
    }
}
