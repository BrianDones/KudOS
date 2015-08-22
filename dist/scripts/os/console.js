///<reference path="../globals.ts" />
/* ------------
Console.ts
Requires globals.ts
The OS Console - stdIn and stdOut by default.
Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
------------ */
var TSOS;
(function (TSOS) {
    var Console = (function () {
        function Console(currentFont, currentFontSize, currentXPosition, currentYPosition, buffer, historyList, position) {
            if (typeof currentFont === "undefined") { currentFont = _DefaultFontFamily; }
            if (typeof currentFontSize === "undefined") { currentFontSize = _DefaultFontSize; }
            if (typeof currentXPosition === "undefined") { currentXPosition = 0; }
            if (typeof currentYPosition === "undefined") { currentYPosition = _DefaultFontSize; }
            if (typeof buffer === "undefined") { buffer = ""; }
            if (typeof historyList === "undefined") { historyList = []; }
            if (typeof position === "undefined") { position = 0; }
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
            this.historyList = historyList;
            this.position = position;
        }
        Console.prototype.init = function () {
            this.clearScreen();
            this.resetXY();
        };

        Console.prototype.clearScreen = function () {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        };

        Console.prototype.resetXY = function () {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        };

        Console.prototype.handleInput = function () {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();

                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) {
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    this.addToHistory(this.buffer);
                    this.position = this.historyList.length;

                    // ... and reset our buffer.
                    this.buffer = "";
                } else if (chr === String.fromCharCode(8)) {
                    this.delete(this.buffer[this.buffer.length - 1]);
                    this.buffer = this.buffer.substring(0, this.buffer.length - 1);
                } else if (chr === String.fromCharCode(9)) {
                    var result = _OsShell.tabFill(this.buffer);
                    this.putText(result);
                    this.buffer += result;
                } else if (chr === "UP_Key") {
                    this.commandHistoryScrolling("up");
                    // TODO: change so shift+7 doesn't "up arrow"
                } else if (chr === "DOWN_Key") {
                    this.commandHistoryScrolling("down");
                    // TODO: change so shift+9 doesn't "down arrow"
                } else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);

                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Write a case for Ctrl-C.
            }
        };

        Console.prototype.putText = function (text) {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            if (text !== "") {
                for (var i = 0; i < text.length; i++) {
                    // Draw the text at the current X and Y coordinates.
                    _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text[i]);

                    // Move the current X position.
                    var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text[i]);
                    this.currentXPosition = this.currentXPosition + offset;

                    // Handling line wrapping
                    if (this.currentXPosition >= _Canvas.width - 10) {
                        this.advanceLine();
                    }
                }
            }
        };

        Console.prototype.advanceLine = function () {
            //this.currentXPosition = 0;
            /*
            * Font size measures from the baseline to the highest point in the font.
            * Font descent measures from the baseline to the lowest point in the font.
            * Font height margin is extra spacing between the lines.
            */
            //this.currentYPosition += _DefaultFontSize +
            //                         _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
            //                         _FontHeightMargin;
            // Handles Scrolling
            var offset = _DefaultFontSize + _FontHeightMargin;
            if (this.currentYPosition >= _Canvas.height - offset) {
                var image = _DrawingContext.getImageData(0, offset, _Canvas.width, _Canvas.height);
                _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
                _DrawingContext.putImageData(image, 0, 0);
                this.currentXPosition = 0;
            } else {
                this.currentXPosition = 0;
                this.currentYPosition += offset;
            }
        };

        // Handles Backspacing to delete text.
        Console.prototype.delete = function (text) {
            var textSize = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
            var offset = _DefaultFontSize + _FontHeightMargin;
            _DrawingContext.clearRect(this.currentXPosition - textSize, this.currentYPosition - offset, textSize, 10 + offset);
            this.currentXPosition = this.currentXPosition - textSize;
        };

        // Handles invoking the Blue Screen of Death...
        // who would willingly want to do that?
        Console.prototype.bSoD = function () {
            _DrawingContext.fillStyle = "rgb(0, 0, 255)";
            _DrawingContext.fillRect(0, 0, _Canvas.width, _Canvas.height);
            _StdOut.putText("I'm afraid I can't let you do that David!");
        };

        // Handles adding commands into the command history list.
        Console.prototype.addToHistory = function (text) {
            this.historyList.push(text);
        };

        // TODO: If the same is entered multiple times, only have one occurance
        // of it in the command history.
        // Also, fix the bug with up and arrowing through the history.
        // Handles up and down arrow key scrolling through the command history.
        Console.prototype.commandHistoryScrolling = function (input) {
            if (input.localeCompare("up") == 0) {
                if (this.position >= 0) {
                    this.position--;
                    this.delete(this.buffer);
                    this.putText(this.historyList[this.position]);
                    this.buffer = this.historyList[this.position];
                }
                if (this.position == 0) {
                    this.delete(this.buffer);
                    this.putText(this.historyList[this.position]);
                    this.buffer = this.historyList[this.position];
                }
            } else if (input.localeCompare("down") == 0) {
                if (this.position + 1 <= this.historyList.length) {
                    this.position++;
                    this.delete(this.buffer);
                    this.putText(this.historyList[this.position]);
                    this.buffer = this.historyList[this.position];
                    // handles if the oldest history command is displayed
                    // then do not do anything.
                    /*else if(this.position == this.historyList.length){
                    this.delete(this.buffer);
                    this.putText(this.historyList[this.position]);
                    this.buffer = this.historyList[this.position];
                    }*/
                }
            }
        };
        return Console;
    })();
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
