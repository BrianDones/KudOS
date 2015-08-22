///<reference path="../globals.ts" />
// Created by: Brian Dones
var TSOS;
(function (TSOS) {
    var ProcessControlBlock = (function () {
        function ProcessControlBlock(pid, baseRegister) {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = true;
            this.instruction = 0;
            this.pid = 0;
            this.baseRegister = 0;
            this.limitRegister = 0;
            this.pid = pid;
            this.baseRegister = baseRegister;
            this.limitRegister = baseRegister + 255;
        }
        ProcessControlBlock.prototype.setPcbStatus = function (PC, Acc, Xreg, Yreg, Zflag, isExecuting, instruction, baseRegister, limitRegister, pid) {
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
            this.instruction = instruction;
            this.baseRegister = baseRegister;
            this.limitRegister = limitRegister;
            this.pid = pid;
        };

        ProcessControlBlock.prototype.setCpuStatus = function () {
            _CPU.PC = this.PC;
            _CPU.Acc = this.Acc;
            _CPU.Xreg = this.Xreg;
            _CPU.Yreg = this.Yreg;
            _CPU.Zflag = this.Zflag;
            _CPU.isExecuting = this.isExecuting;
            _CPU.instruction = this.instruction;
            _CPU.baseRegister = this.baseRegister;
            _CPU.limitRegister = this.limitRegister;
        };
        return ProcessControlBlock;
    })();
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
