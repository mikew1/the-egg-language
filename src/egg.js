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

// run(`
// do(define(total, 0),
//    define(count, 1),
//    print("Will now sum the numbers 1 to 10..."),
//    while(<(count, 10),
//          do(define(total, +(total, count)),
//             define(count, +(count, 1)),
//             print(total))),
//    print("So the total is:"),
//    print(total))
// `);

run(`
do(define(pow, fun(base, exp,
     if(==(exp, 0),
        1,
        *(base, pow(base, -(exp, 1)))))),
   print(pow(2, 10)))
`);