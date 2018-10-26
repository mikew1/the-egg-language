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

// run(`
// do(define(pow, fun(base, exp,
//      if(==(exp, 0),
//         1,
//         *(base, pow(base, -(exp, 1)))))),
//    print(pow(2, 10)))
// `);

// higher order function example:
run(`
do(
  print("Create a fn that returns a fn:"),

  print(
    define(timesBy,
        fun(p, define(anon,
            fun(q, *(p, q)) ))
    )),

  print("A fn created at run time:"),

  print(
    define(function_created_at_runtime,
        timesBy(4)
    )),

  print("Call it:"),
  print(function_created_at_runtime(5)),


  print("Create and call immediately (note syntax):"),

  print(timesBy(4)(5))

   )
`);