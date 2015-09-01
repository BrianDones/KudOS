kudOS-2014
============

This is my Fall 2014 Operating Systems class initial project.

Project 1 (DONE!!!)
============
1. ~~Alter the **ver** command to display your own data.~~
2. ~~Add some new shell commands:~~
    * ~~**date** - Display the current date and time.~~
    * ~~**whereami** - Display the user's current location (use your imagination).~~
    * ~~Something else interesting and creative (**Surprise me**).~~
3. ~~Enhance the host display with a graphic task bar that displays:~~
    * ~~the current date and time~~
    * ~~a status message specified by the user using a **status** command~~
4. ~~Implement scrolling in the client OS console/CLI.~~
5. ~~Other console/CLI enhancements:~~
    * ~~Accept and display punctuation characters and symbols~~
    * ~~Handle backspace appropriately~~
    * ~~Implement command completion with the tab key~~
    * ~~Provide command history recall via the up and down keys~~
6. ~~Display a BSOD message (on the CLI) when the kernel traps an OS error.~~
    * ~~Add a shell command to test this **NOTE**: Include this in help~~
7. ~~Add a shell command called **load** to validate the user code in the HTML5 text area (**id ="taProgramInput"**). Only hex digits and spaces are valid.~~
8. ~~[Optional] Implement line-wrap in the CLI.~~

Project 2 (DONE!!!)
============
1. ~~Modify	the	load	command	to	copy	the	6502a	machine	language	op	codes
into	main	memory:~~
  * ~~Put	the	code	at	location	$0000	in	memory~~
  * ~~assign	a	Process	ID	(PID)~~
  * ~~create	a	Process	Control	Block	(PCB)~~
  * ~~return	the	PID	to	the	console.~~
2. ~~Add	a	shell	command,	run	<pid>,	to	run	a	program	already	in	memory.~~
~~Note:	the	user	should	be	able	to	execute	many	load/run	cycles~~
3. ~~Execute	the	running	program	(including	displaying	any	output).	Be	sure	to
synchronize	the	CPU	execution	cycles	with	clock	ticks.~~
4. ~~As	the	programs	executes,	display	Memory	and	the	CPU	status	(program
counter,	instruction	reg,	accumulator,	X	reg,	Y	reg,	Z	Flag)	in	real	time.~~
5. ~~Update	and	display	the	PCB	contents	at	the	end	of	execution.~~
6. ~~Implement	line-wrap	in	the	CLI.	(This	is	not	longer	optional.)~~
7. ~~Optional:	Provide	the	ability	to	single-step	execution.~~
8. ~~Develop	a	PCB	prototype	and	implement	it	in	the	client	OS.~~
9. ~~Develop	a	memory	manager	and	implement	it	in	the	client	OS.~~
10. ~~Develop	a	core	memory	prototype	and	implement	it	in	the	host	OS.~~
11. ~~Develop	a	CPU	prototype	and	implement	it	in	the	host	OS.~~

Project 3 (DONE!!!)
===========
1. ~~Add a shell command, **clearmem**, to clear all memory partitions.~~
2. ~~Allow the user to load three programs into memory at once.~~
3. ~~Add a shell command, **runall**, to execute all the programs at once.~~
4. ~~Add a shell command, **quantum<int>**, to let the user set the Round Robin quantum (measured in clock ticks).~~
5. ~~Display the Ready queue and its (PCB) contents (including process state) in real time.~~
6. ~~Add a shell command, **ps**, to display the PIDs of all active processes.~~
7. ~~Add a shell command, **kill<pid>**, to kill an active process.~~
8. ~~Store multiple programs in memory, each in their own partition, allocated by the client OS (which obviously needs to keep track of available and used partitions).~~
9. ~~Add base and limit Registers to your core memory access code in the host OS and to your PCB object in the client OS.~~
10. ~~Enforce memory partition boundaries at all times.~~
11. ~~Create a Resident list for the loaded processes.~~
12. ~~Create a Ready Queue for the running processes.~~
13. ~~Instantiate a PCB for each loaded program and put it in the Resident list.~~
14. ~~Develop a CPU scheduler in the client OS using Round Robin scheduling with the user-specified quantum measured in clock ticks (default = 6).~~
  * ~~Make the client OS control the host CPU with the client OS CPU scheduler.~~
  * ~~Log all scheduling events.~~
15. ~~Implement context switches with software interrupts. Be sure to update the mode bit (if appropriate), the PCBs, and the Ready queue.~~
16. ~~Detect and gracefully handle errors like invalid op codes, missing operands (if you can detect that), and most importantly, memory out of bounds access attempts.~~

Setup TypeScript/Gulp
=====================

1. Install [npm](https://www.npmjs.org/), if you don't already have it
1. `npm install -g typescript` to get the TypeScript Compiler
1. `npm install gulp` to get the Gulp Task Runner
1. `npm install gulp-tsc` to get the Gulp TypeScript plugin

Your Workflow
=============

Just run `gulp` at the command line in the root directory of this project! Edit your TypeScript files in the source/scripts directory in your favorite editor. Visual Studio has some additional tools that make debugging, syntax highlighting, and more very easy. WebStorm looks like a nice option as well.

Gulp will automatically:

* Watch for changes in your source/scripts/ directory for changes to .ts files and run the TypeScript Compiler on it
* Watch for changes to your source/styles/ directory for changes to .css files and copy them to the dist/ folder

TypeScript FAQs
==================

**What's TypeScript?**
TypeScript is a language that allows you to write in a statically-typed language that outputs standard JS!

**Why should I use it?**
This will be especially helpful for an OS or a Compiler that may need to run in the browser as you will have all of the great benefits of type checking built right into your language.

**Where can I get more info on TypeScript**
[Right this way!](http://www.typescriptlang.org/)

Gulp FAQs
=========

**Why are we using Gulp?**
Gulp is a tool that allows you to automate tons of workflow tasks. In this instance, we want it to watch our directory for changes and automatically run the TypeScript compiler on the source files to output JS to a distribution folder. We also use it to copy over .css files to our distribution folder.

**Copying over CSS files to a dist folder? That seems useless**
Well, in this case, it pretty much is, but it keeps your development consistent. You keep your source in the source directory, and you keep what you want to output to the user in the dist directory. In more mature front-end environments, you may be utilizing a CSS-preprocessor like LESS or SASS. This setup would allow you to keep your .less or .scss files in the source/styles directory, then output the compiled css folders to the dist/styles directory.

**What other cool things can I do with Gulp?**
If you were in a production environment where you wanted to obfuscate your code, you can use Gulp to automatically run things like [Uglify](https://github.com/terinjokes/gulp-uglify) on your JS/CSS. Or if you wanted to [minify your CSS](https://www.npmjs.org/package/gulp-minify-css). It is NOT recommended to do this for this project as you and Alan will need to read and debug this code, and allow GLaDOS to run code against yours.

**Where can I get more info on Gulp?**
[Right this way!](http://gulpjs.com/)
