///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var Scheduler = (function () {
        function Scheduler() {
            this.quantum = 6;
            this.clockTick = 0;
        }
        Scheduler.prototype.setQuantum = function (quantum) {
            this.quantum = quantum;
        };

        Scheduler.prototype.roundRobinSchedule = function () {
            if (_Kernel.readyQueue.length > 0) {
                _Kernel.running.setPcbStatus(_CPU.PC, _CPU.Acc, _CPU.Xreg, _CPU.Yreg, _CPU.Zflag, _CPU.isExecuting, _CPU.instruction, _CPU.baseRegister, _CPU.limitRegister, _CPU.pid);
                _Kernel.readyQueue.push(_Kernel.running);
                _Kernel.running = _Kernel.readyQueue.shift();
                _Kernel.running.setCpuStatus();

                // Log all context switches and Log which PID we switched to.
                _Kernel.krnTrace("Context switching instances found. PID = " + _Kernel.running.pid);

                // Display the Ready queue and its (PCB) contents
                // (including process state) in real time.
                var pcbContent = "";
                for (var i = 0; i < _Kernel.readyQueue.length; i++) {
                    pcbContent += "PID: " + _Kernel.readyQueue[i].pid + " Base Register: " + _Kernel.readyQueue[i].baseRegister + " PC: " + _Kernel.readyQueue[i].PC + " IR: " + _Kernel.readyQueue[i].instruction.toString(16).toUpperCase() + " Acc: " + _Kernel.readyQueue[i].Acc + " Xreg: " + _Kernel.readyQueue[i].Xreg + " Yreg: " + _Kernel.readyQueue[i].Yreg + " ZFlag: " + _Kernel.readyQueue[i].Zflag + "\n";
                }

                document.getElementById("readyQueue").value = pcbContent;
            }
        };

        Scheduler.prototype.changeClockTick = function () {
            this.clockTick++;
            if (this.clockTick > this.quantum) {
                this.clockTick = 0;
                this.roundRobinSchedule();
            }
        };

        Scheduler.prototype.assistPsCommand = function () {
            // Prints out the PIDs of the running program and all other
            // active processes.
            var activeProcesses = "Active Processes: ";

            // If there is only one process that is being run, show only the
            // running program's PID.
            if (_Kernel.readyQueue.length < 1 && _Kernel.running != undefined) {
                activeProcesses += _Kernel.running.pid;
            } else {
                activeProcesses += _Kernel.running.pid;
                for (var i = 0; i < _Kernel.readyQueue.length; i++) {
                    activeProcesses += ", " + _Kernel.readyQueue[i].pid;
                }
            }
            _StdOut.putText(activeProcesses);
        };
        return Scheduler;
    })();
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
