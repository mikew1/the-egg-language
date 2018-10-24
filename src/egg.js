/**
 * Parse and evaluate an egg program.
 */

const {parse}    = require('./parse.js');
const {evaluate} = require('./evaluate.js');
const {topScope} = require('./topscope.js');
//const {inspect}  = require('./utils.js');

function run(program) {
    let parseTree = parse(program);
    //inspect(parseTree);
    //macros might come somewhere here
    return evaluate(parseTree, Object.create(topScope));
}

// compute sum of 1 to 10
// change the program below to explore the egg language.
// it's very cumbersome at the moment, but it works!
// there are so many things you'd need; a repl, syntax higlighting...
run(`
do(define(total, 0),
   define(count, 1),
   print("Will now sum the numbers 1 to 10..."),
   while(<(count, 10),
         do(define(total, +(total, count)),
            define(count, +(count, 1)),
            print(total))),
   print("So the total is:"),
   print(total))
`);