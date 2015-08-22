///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
///<reference path="../utils.ts" />
///<reference path="../globals.ts" />

/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";
        public date = new Date();

        public counter = 0;

        constructor() {

        }

        public init() {
            var sc = null;
            //
            // Load the command list.

      // help
      sc = new ShellCommand(this.shellHelp,
                  "help",
                  "- This is the help command. Seek help.");
      this.commandList[this.commandList.length] = sc;

      // status
      sc = new ShellCommand(this.shellStatus,
                  "status",
                  "<string> -Displays status in the Welcome Log.");
      this.commandList[this.commandList.length] = sc;

      // ver
      sc = new ShellCommand(this.shellVer,
                  "ver",
                  "- Displays the current version data.");
      this.commandList[this.commandList.length] = sc;

			// date
			sc = new ShellCommand(this.shellDate,
								  "date",
								  "- displays the current time and date.");
			this.commandList[this.commandList.length] = sc;

			// whereami
			sc = new ShellCommand(this.shellWhereAmI,
								  "whereami",
								  "- displays the users current location.");
			this.commandList[this.commandList.length] = sc;

			// rupertholmes
			sc = new ShellCommand(this.shellRupertHolmes,
								  "rupertholmes",
								  "- Do you like pina coladas?");
			this.commandList[this.commandList.length] = sc;

      //bsod command
      sc = new ShellCommand(this.shellBsod,
                  "bsod",
                  "- displays a BSOD message.");
      this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down kudOS.");
                                  //"- Shuts down the virtual OS but leaves the underlying hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            // load
            sc = new ShellCommand(this.shellLoad,
                                  "load",
                                  "- Loads in the user program input.");
            this.commandList[this.commandList.length] = sc;

            // run
            sc = new ShellCommand(this.shellRun,
                                  "run",
                                  "- runs a program in memory with a given pid.");
            this.commandList[this.commandList.length] = sc;

            // clrmem
            sc = new ShellCommand(this.shellClearmem,
                                  "clearmem",
                                  "- clears memory of all programs written to memory.");
            this.commandList[this.commandList.length] = sc;
            // processes - list the running processes and their IDs
            // kill <id> - kills the specified process id.

            // runall
            sc = new ShellCommand(this.shellRunall,
                                  "runall",
                                  "- runs all the programs that are in memory.");
            this.commandList[this.commandList.length] = sc;

            // ps
            sc = new ShellCommand(this.shellPs,
                                  "ps",
                                  "- displays the PIDs of all active processes.");
            this.commandList[this.commandList.length] = sc;

            // kill <pid>
            sc = new ShellCommand(this.shellKill,
                                  "kill",
                                  "- kills a processes given a PID.");
            this.commandList[this.commandList.length] = sc;

            // quantum <int>
            sc = new ShellCommand(this.shellQuantum,
                                  "quantum",
                                  "- sets the Round Robin quantum (measured in clock ticks).");
            this.commandList[this.commandList.length] = sc;

            //
            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = new UserCommand();
            userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // JavaScript may not support associative arrays in all browsers so we have to
            // iterate over the command list in attempt to find a match.  TODO: Is there a better way? Probably.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses. {
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {    // Check for apologies. {
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // args is an option parameter, ergo the ? which allows TypeScript to understand that
        public execute(fn, args?) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        }

        public parseInput(buffer) {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        //
        // Shell Command Functions.  Again, not part of Shell() class per se', just called from there.
        //

        public tabFill(text): String{
          var listOfCommands = [];
          var command;


          for(var i = 0; i < this.commandList.length; i++){
            command = this.commandList[i].command;
          // If the user doesn't enter any text and hits tab, default to
          // auto-filling with the help command.
            if(text.localeCompare(command.substring(0, text.length)) == 0){
              listOfCommands.push(command);
            }
          }
          // If there is more than one command in the list then return the
          // first command in the list.
          if(listOfCommands.length > 1){

            return listOfCommands[0].substring(text.length, listOfCommands[0].length);

          }
          // If there is only one command in the list... well the rest is obvious.
          else {

            return listOfCommands[0].substring(text.length, listOfCommands[0].length);

          }
        }

        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Duh. Go back to your Speak & Spell.");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("Okay. I forgive you. This time.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }
        //TODO: Account for a maximum character length of the status.
        public shellStatus(args) {
          var currentTime = new Date;
          var statusMessage : string = "";
          for(var index = 0; index < args.length; index++){
            statusMessage = statusMessage + " " + args[index];
          }
            _OSstatus = statusMessage;
          }

        public shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }

        public shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
              var lineLength = "  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description;
              // Handles if the description of the command goes off the screen.
              /*
              if(){
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + "  ");
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].description);
              } else {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
              }*/
              _StdOut.advanceLine();
              _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellDate(args) {
          var daDate = _OsShell.date.toLocaleDateString();
          var daTime = _OsShell.date.toLocaleTimeString();
          //var daTime =
          _StdOut.putText(daDate);
          _StdOut.advanceLine();
          _StdOut.putText(daTime);
        }
        public shellWhereAmI(args) {
          _StdOut.putText("I'm afraid I can't tell you that dave.");
        }

        public shellRupertHolmes(args) {
          _StdOut.putText("Do you like pina coladas... and dancing in the rain?");
          window.open('http://www.youtube.com/watch?v=Fsj2wdFDmLk', '_newtab');
        }

        public shellBsod(args){

          _Kernel.krnTrapError("I'm afraid I can't let you do that David!");

        }

        public shellLoad(args) {
          _Program = (<HTMLInputElement>document.getElementById("taProgramInput")).value.toLowerCase().split(" ");
          var hex:string = "0123456789abcdef";

          // Initial check to see if the User put in something into the text area to load.
          if (_Program[0] == "" && _Counter < 1) {
              _Console.putText("But... you didn't put in any code... you didn't even try.");
              _Counter++;
              return;
          }

          if (_Program[0] == "" && _Counter == 1) {
              _Console.putText("You still haven't put in any code! GIVE ME SOME CODE!");
              _Counter++;
              return;
          }

          if (_Program[0] == "" && _Counter > 1) {
              _Counter++;
              _Console.putText("You've failed " + _Counter + " times! -__-");
              return;
          }

          // Loops through the Program input and checks to see if the input is in fact valid hex code.
          for (var i = 0; i < _Program.length; i++) {

              if (hex.indexOf(_Program[i][0]) == -1 || hex.indexOf(_Program[i][1]) == -1) {
                  _Console.putText("Invalid hex code input. Try again.");
                  return;
              }
          }
          // Check to make sure that the program isn't too big for memory.
          if (_Program.length > 256) {
              _StdOut.putText("Program not loaded. Couldn't not fit in memory.");
              return;
          }
          var pid = _Kernel.loadProgram(_Program);
          if (pid == -1) {
              _StdOut.putText("All memory blocks are filled!");
          } else {
              _Counter = 0;
              _StdOut.putText("Program loaded into Memory.");
              _Console.advanceLine();
              _StdOut.putText("PID: " + pid);
          }
        }

        public shellShutdown(args) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        }

        public shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }

        public shellMan(args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, dumbass.");
                        } else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }

                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        // TODO: Handle bug with changing the prompt with a space in the prompt.
        public shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }

        public shellRun(args) {
            if (args.length == 0) {
              _StdOut.putText("Run <PID> ... you forgot the PID.");
            }
            if (args.length > 0) {
                _Kernel.runProgram(args);
            }
        }

        public shellClearmem(args) {
            _MemManager.clearMemory();
        }

        public shellRunall(args) {
            _Kernel.runAllPrograms();
        }

        public shellPs(args) {
            _Scheduler.assistPsCommand();
        }

        public shellKill(args) {
            if (args.length > 0) {
                _Kernel.killTheProcess(args);
            } else {
                _StdOut.putText("kill <PID> ... please provide a PID.");
                _StdOut.advanceLine();
            }
        }

        public shellQuantum(args) {
            if (args.length > 0) {
                _Scheduler.setQuantum(args);
            } else {
                _StdOut.putText("quantum <int> ... please provide a quantum value.");
            }
        }

    }
}
