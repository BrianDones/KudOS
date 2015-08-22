///<reference path="../globals.ts" />
// Created by: Brian Dones

module TSOS {

    export class ProcessControlBlock {

        public PC: number     = 0;
        public Acc: number    = 0;
        public Xreg: number   = 0;
        public Yreg: number   = 0;
        public Zflag: number  = 0;
        public isExecuting: boolean = true;
        public instruction: number = 0;
        public pid: number = 0;
        public baseRegister: number = 0;
        public limitRegister: number = 0;


        constructor(pid, baseRegister) {
            this.pid = pid;
            this.baseRegister = baseRegister;
            this.limitRegister = baseRegister + 255;
        }

        public setPcbStatus(PC, Acc, Xreg, Yreg, Zflag, isExecuting, instruction, baseRegister, limitRegister, pid): void {
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
        }

        public setCpuStatus(): void {
            _CPU.PC =     this.PC;
            _CPU.Acc =    this.Acc;
            _CPU.Xreg =   this.Xreg;
            _CPU.Yreg =   this.Yreg;
            _CPU.Zflag =  this.Zflag;
            _CPU.isExecuting =    this.isExecuting;
            _CPU.instruction =    this.instruction;
            _CPU.baseRegister =   this.baseRegister;
            _CPU.limitRegister =  this.limitRegister;
        }
    }
}
