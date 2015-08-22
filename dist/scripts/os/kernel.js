/* ------------
Kernel.ts
Requires globals.ts
Routines for the Operating System, NOT the host.
This code references page numbers in the text book:
Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
------------ */
var TSOS;
(function (TSOS) {
    var Kernel = (function () {
        function Kernel() {
            this.readyQueue = [];
            this.residentList = [];
            this.pid = 0;
            this.murderCount = 0;
        }
        Kernel.prototype.loadProgram = function (program) {
            var baseReg = _MemManager.loadProgram(program);
            if (baseReg == -1) {
                return -1;
            }
            var pcb = new TSOS.ProcessControlBlock(this.pid, baseReg);
            this.residentList.push(pcb);
            this.pid++;
            return this.pid - 1;
        };

        Kernel.prototype.runProgram = function (programID) {
            var i = 0;
            while (i < this.residentList.length) {
                if (programID == this.residentList[i].pid) {
                    this.running = this.residentList[i];
                    this.residentList.splice(i, 1);
                    this.running.setCpuStatus();
                }
                i++;
            }

            var queueCheck = false;

            for (var i = 0; i < this.readyQueue.length; i++) {
                if (programID == this.readyQueue[i].pid) {
                    queueCheck = true;
                }
                break;
            }

            // Goes through the resident List all looks for a matching PID. If
            // there is a matching PID, puts that program into the ready Queue
            // and removes that program from the resident List.
            if (!queueCheck) {
                while (i < this.residentList.length) {
                    if (programID == this.residentList[i].pid) {
                        this.readyQueue.push(this.residentList[i]);
                        this.residentList.splice(i, 1);
                    }
                    i++;
                }
            }
        };

        Kernel.prototype.runAllPrograms = function () {
            while (this.residentList.length > 0) {
                this.readyQueue.push(this.residentList.shift());
            }
        };

        Kernel.prototype.killTheProcess = function (PID) {
            if (this.running == undefined) {
                _StdOut.putText("I can't kill what doesn't exist!");
            } else if (this.running.pid == PID && this.readyQueue.length == 0) {
                var b = this.running.baseRegister;
                this.running.isExecuting = false;
                _MemManager.clearMemoryBlock(b);
                _CPU.init();
                this.running.setPcbStatus(_CPU.PC, _CPU.Acc, _CPU.Xreg, _CPU.Yreg, _CPU.Zflag, _CPU.isExecuting, _CPU.instruction, _CPU.baseRegister, _CPU.limitRegister, _CPU.pid);
                document.getElementById("pcb").value = "PC: " + this.running.PC + " IR: " + this.running.instruction.toString(16).toUpperCase() + " Acc: " + this.running.Acc + " Xreg: " + this.running.Xreg + " Yreg: " + this.running.Yreg + " ZFlag: " + this.running.Zflag;
                this.murderCount++;
                _StdOut.putText("*kills process " + PID + "* shh shh shh... its all over now.");
                _StdOut.advanceLine();
                _StdOut.putText("Murder Count: " + this.murderCount);
            }
        };

        //
        // OS Startup and Shutdown Routines
        //
        Kernel.prototype.krnBootstrap = function () {
            _MemManager = new TSOS.MemoryManager();
            _Scheduler = new TSOS.Scheduler();
            TSOS.Control.hostLog("bootstrap", "host"); // Use hostLog because we ALWAYS want this, even if _Trace is off.

            // Initialize our global queues.
            _KernelInterruptQueue = new TSOS.Queue(); // A (currently) non-priority queue for interrupt requests (IRQs).
            _KernelBuffers = new Array(); // Buffers... for the kernel.
            _KernelInputQueue = new TSOS.Queue(); // Where device input lands before being processed out somewhere.
            _Console = new TSOS.Console(); // The command line interface / console I/O device.

            // Initialize the console.
            _Console.init();

            // Initialize standard input and output to the _Console.
            _StdIn = _Console;
            _StdOut = _Console;

            // Load the Keyboard Device Driver
            this.krnTrace("Loading the keyboard device driver.");
            _krnKeyboardDriver = new TSOS.DeviceDriverKeyboard(); // Construct it.
            _krnKeyboardDriver.driverEntry(); // Call the driverEntry() initialization routine.
            this.krnTrace(_krnKeyboardDriver.status);

            //
            // ... more?
            //
            // Enable the OS Interrupts.  (Not the CPU clock interrupt, as that is done in the hardware sim.)
            this.krnTrace("Enabling the interrupts.");
            this.krnEnableInterrupts();

            // Launch the shell.
            this.krnTrace("Creating and Launching the shell.");
            _OsShell = new TSOS.Shell();
            _OsShell.init();

            // Finally, initiate testing.
            if (_GLaDOS) {
                _GLaDOS.afterStartup();
            }
        };

        Kernel.prototype.krnShutdown = function () {
            this.krnTrace("begin shutdown OS");

            // TODO: Check for running processes.  Alert if there are some, alert and stop.  Else...
            // ... Disable the Interrupts.
            this.krnTrace("Disabling the interrupts.");
            this.krnDisableInterrupts();

            //
            // Unload the Device Drivers?
            // More?
            //
            this.krnTrace("end shutdown OS");
        };

        Kernel.prototype.krnOnCPUClockPulse = function () {
            /* This gets called from the host hardware sim every time there is a hardware clock pulse.
            This is NOT the same as a TIMER, which causes an interrupt and is handled like other interrupts.
            This, on the other hand, is the clock pulse from the hardware (or host) that tells the kernel
            that it has to look for interrupts and process them if it finds any.                           */
            if (this.running == undefined && this.readyQueue.length > 0) {
                this.running = this.readyQueue.shift();
                this.running.setCpuStatus();
                _Scheduler.clockTick = 0;
            }

            // Displays CPU Components in real time.
            document.getElementById("cpu").value = "PC: " + _CPU.PC + " IR: " + _CPU.instruction.toString(16).toUpperCase() + " Acc: " + _CPU.Acc + " Xreg: " + _CPU.Xreg + " Yreg: " + _CPU.Yreg + " ZFlag: " + _CPU.Zflag;

            // Check for an interrupt, are any. Page 560
            if (_KernelInterruptQueue.getSize() > 0) {
                // Process the first interrupt on the interrupt queue.
                // TODO: Implement a priority queue based on the IRQ number/id to enforce interrupt priority.
                var interrupt = _KernelInterruptQueue.dequeue();
                this.krnInterruptHandler(interrupt.irq, interrupt.params);
            } else if (_CPU.isExecuting) {
                _CPU.cycle();
                _Scheduler.changeClockTick();
            } else {
                this.krnTrace("Idle");
            }
        };

        //
        // Interrupt Handling
        //
        Kernel.prototype.krnEnableInterrupts = function () {
            // Keyboard
            TSOS.Devices.hostEnableKeyboardInterrupt();
            // Put more here.
        };

        Kernel.prototype.krnDisableInterrupts = function () {
            // Keyboard
            TSOS.Devices.hostDisableKeyboardInterrupt();
            // Put more here.
        };

        Kernel.prototype.krnInterruptHandler = function (irq, params) {
            // This is the Interrupt Handler Routine.  Pages 8 and 560. {
            // Trace our entrance here so we can compute Interrupt Latency by analyzing the log file later on.  Page 766.
            this.krnTrace("Handling IRQ~" + irq);

            switch (irq) {
                case TIMER_IRQ:
                    this.krnTimerISR(); // Kernel built-in routine for timers (not the clock).
                    break;
                case KEYBOARD_IRQ:
                    _krnKeyboardDriver.isr(params); // Kernel mode device driver
                    _StdIn.handleInput();
                    break;
                case BREAK_IRQ:
                    this.running.setPcbStatus(_CPU.PC, _CPU.Acc, _CPU.Xreg, _CPU.Yreg, _CPU.Zflag, _CPU.isExecuting, _CPU.instruction, _CPU.baseRegister, _CPU.limitRegister, _CPU.pid);
                    document.getElementById("pcb").value = "PC: " + this.running.PC + " IR: " + this.running.instruction.toString(16).toUpperCase() + " Acc: " + this.running.Acc + " Xreg: " + this.running.Xreg + " Yreg: " + this.running.Yreg + " ZFlag: " + this.running.Zflag;
                    _CPU.isExecuting = false;
                    if (this.readyQueue.length == 0) {
                        _Console.putText(" Finished.");
                        document.getElementById("readyQueue").value = "Ready Queue is empty.";
                        _Console.advanceLine();
                        _CPU.init();
                    }
                    this.running = undefined;
                    break;
                case SOFTWARE_IRQ:
                    console.log(params);
                    if (params[0] == 1) {
                        _StdOut.putText(params[1].toString());
                    } else if (params[0] == 2) {
                        var str = [];
                        while (_MemManager.getMemoryAddress(params[1]) != 0) {
                            str.push(String.fromCharCode(_MemManager.getMemoryAddress(params[1])));
                            params[1]++;
                        }
                        _StdOut.putText(str);
                    }
                    break;
                default:
                    this.krnTrapError("Invalid Interrupt Request. irq=" + irq + " params=[" + params + "]");
            }
        };

        Kernel.prototype.krnTimerISR = function () {
            // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver). {
            // Check multiprogramming parameters and enforce quanta here. Call the scheduler / context switch here if necessary.
        };

        //
        // System Calls... that generate software interrupts via tha Application Programming Interface library routines.
        //
        // Some ideas:
        // - ReadConsole
        // - WriteConsole
        // - CreateProcess
        // - ExitProcess
        // - WaitForProcessToExit
        // - CreateFile
        // - OpenFile
        // - ReadFile
        // - WriteFile
        // - CloseFile
        //
        // OS Utility Routines
        //
        Kernel.prototype.krnTrace = function (msg) {
            // Check globals to see if trace is set ON.  If so, then (maybe) log the message.
            if (_Trace) {
                if (msg === "Idle") {
                    // We can't log every idle clock pulse because it would lag the browser very quickly.
                    if (_OSclock % 10 == 0) {
                        // Check the CPU_CLOCK_INTERVAL in globals.ts for an
                        // idea of the tick rate and adjust this line accordingly.
                        TSOS.Control.hostLog(msg, "OS");
                    }
                } else {
                    TSOS.Control.hostLog(msg, "OS");
                }
            }
        };

        Kernel.prototype.krnTrapError = function (msg) {
            TSOS.Control.hostLog("OS ERROR - TRAP: " + msg);

            // TODO: Display error on console, perhaps in some sort of colored screen. (Perhaps blue?)
            _Console.bSoD();
            this.krnShutdown();
        };
        return Kernel;
    })();
    TSOS.Kernel = Kernel;
})(TSOS || (TSOS = {}));
