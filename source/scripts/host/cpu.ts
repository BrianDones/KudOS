///<reference path="../globals.ts" />

/* ------------
     CPU.ts
     Requires global.ts.
     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.
     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false,
                    public instruction: number = 0,
                    public baseRegister: number = 0,
                    public limitRegister: number = 0,
                    public pid: number = 0) {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
            this.instruction = 0;
            this.baseRegister = 0;
            this.limitRegister = 0;
            this.pid = 0;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            this.instruction = _MemManager.getMemoryAddress(this.PC);
            this.PC++;
            // Handles instructional execution for 6502alan Machine Lanaguage Instruction Sets.
            // For more information regarding the operation codes please refer to the following:
            // http://www.labouseur.com/commondocs/6502alan-instruction-set.pdf

            if (this.instruction == 0xA9) {
                this.loadConstant();
                this.PC++;
            } else if (this.instruction == 0xAD) {
                this.loadFromMemory();
                this.PC++;
                this.PC++;
            } else if (this.instruction == 0x8D) {
                this.storeAcc();
                this.PC++;
                this.PC++;
            } else if (this.instruction == 0x6D) {
                this.addWithCarry();
                this.PC++;
                this.PC++;
            } else if (this.instruction == 0xA2) {
                this.loadXWithConstant();
                this.PC++;
            } else if (this.instruction == 0xAE) {
                this.loadXFromMemory();
                this.PC++;
                this.PC++;
            } else if (this.instruction == 0xA0) {
                this.loadYWithConstant();
                this.PC++;
            } else if (this.instruction == 0xAC) {
                this.loadYFromMemory();
                this.PC++;
                this.PC++;
            } else if (this.instruction == 0xEA) {

            } else if (this.instruction == 0x00) {
                this.breakSystemCall();
            } else if (this.instruction == 0xEC) {
                this.compareToXReg();
                this.PC++;
                this.PC++;
            } else if (this.instruction == 0xD0) {
                this.branchNBytes();
                this.PC++;
            } else if (this.instruction == 0xEE) {
                this.incrementZeByte();
                this.PC++;
                this.PC++;
            } else if (this.instruction == 0xFF) {
                this.systemCall();
            }
        }
        // Loads the accumulator with a constant.
        public loadConstant(): void {
            this.Acc = _MemManager.getMemoryAddress(this.PC);
        }
        // Loads the accumulator from memory.
        public loadFromMemory(): void {
            this.Acc = _MemManager.getMemoryAddress(_MemManager.getMemoryAddress(this.PC));
        }
        // Stores the accumulator in memory.
        public storeAcc(): void {
            _MemManager.setMemoryAddress(_MemManager.getMemoryAddress(this.PC), this.Acc);
        }
        // Adds contents of an address to the contents of the accumulator and keeps the result in the accumulator.
        public addWithCarry(): void {
            this.Acc += _MemManager.getMemoryAddress(_MemManager.getMemoryAddress(this.PC));
        }
        // Loads the X Register with a constant.
        public loadXWithConstant(): void {
            this.Xreg = _MemManager.getMemoryAddress(this.PC);
        }
        // Loads the X  Register from memory.
        public loadXFromMemory(): void {
            this.Xreg = _MemManager.getMemoryAddress(_MemManager.getMemoryAddress(this.PC));
        }
        // Loads the Y Register with a constant.
        public loadYWithConstant(): void {
            this.Yreg = _MemManager.getMemoryAddress(this.PC);
        }
        // Loads the Y Register from memory.
        public loadYFromMemory(): void {
            this.Yreg = _MemManager.getMemoryAddress(_MemManager.getMemoryAddress(this.PC));
        }
        // Calls the Break System Call.
        public breakSystemCall(): void {
            this.PC = 0;
            /*while (this.PC < 256) {
                _MemManager.setMemoryAddress(this.PC, 0);
                this.PC++;
            }
            this.PC = 0;
            if (_Kernel.running.baseRegister == 0) {
                _MemManager.blocks[0] = true;
            } else if (_Kernel.running.baseRegister == 256) {
                _MemManager.blocks[1] = true;
            } else if (_Kernel.running.baseRegister == 512) {
                _MemManager.blocks[2] = true;
            }*/
            _MemManager.clearMemoryBlock(_Kernel.running.baseRegister);
            _KernelInterruptQueue.enqueue(new Interrupt(BREAK_IRQ, []));
        }
        // Compares a byte in memory to the X Register and sets the Z flag if equal.
        public compareToXReg(): void {
            if (_MemManager.getMemoryAddress(_MemManager.getMemoryAddress(this.PC)) == this.Xreg) {
                this.Zflag = 1;
            } else {
                this.Zflag = 0;
            }
        }
        // Branches n bytes if the Z flag equals 0.
        public branchNBytes(): void {
            if (this.Zflag == 0) {
                this.PC = (this.PC + _MemManager.getMemoryAddress(this.PC)) % 256;
            }
        }
        // Increments "ze" value of a byte.
        public incrementZeByte(): void {
            _MemManager.setMemoryAddress(_MemManager.getMemoryAddress(this.PC), _MemManager.getMemoryAddress(_MemManager.getMemoryAddress(this.PC)) + 1);
        }
        // System Call
        public systemCall(): void {
            _KernelInterruptQueue.enqueue(new Interrupt(SOFTWARE_IRQ, [this.Xreg, this.Yreg]));
       }
    }
}
