/**
 * Minor comment on functional programming
 * A parser (esp. a compiler) is a type of program that can be a pure function.
 * This implementation doesn't look like that; we see an assignment in the very
 * first line. But that said, it needn't. What we need to see there, as what this
 * program could really be doing, is threading that argument through a series of fns,
 * the first of which would be skipSpace. This kind of thinking is better done in
 * languages other than javascript, though, which have cleaner syntax for doing that.
 */

/**
 * parseExpression
 * In Egg, expressions are separated by (any amount of) whitespace. So, first, we skip
 * all leading whitespace so we can be sure an expr begins at index 0 of the prog string.
 * At 1, 2 & 3 we match valid expressions in the language & create the corresponding
 * data structure for the matched expression.
 * _regex reminders_  ^ is start of line; [] is character class, () is matched group.
 * 1st regex: match a dble quoted thing cont. char class not dbl quotes.
 * 2nd regex: match any num decimals followed by word boundary
 * 3rd regex: match any seq of neg. defined char class.
 *            excl: white space,bracket, comma, space char, hash, dbl quote.
 * Qu: why does 1st regex also match zero, i.e. ""
 * Qu: why does 1st regex use match[1] & others match[0] (a typo?) -WORKS WITH EITHER!-
 * Ans: do console.log(match) to see exactly what the re match array contains & will see.
 * Qu: why does 2nd regex require a word boundary \b & others dont.
 * Note: 3rd also catches number value, but 2nd regex will have caught it prior.
 * At this point, the function can be tested by simply returning expr.
 * Then, to add the rest of our program, we return the return value of the function
 * parseApply(), -this will be _mutual recursion_-, with the formed expr as its first
 * argument. The second argument is the remainder of the unparsed program string.
 */
const {skipSpace, inspect} = require('./utils');

function parseExpression(program) {
    program = skipSpace(program);
    let match, expr;
    if        (match = /^"([^"]*)"/.exec(program)) {       // (1) match string in egg
        expr = {type: "value", value: match[1]        };
    } else if (match = /^\d+\b/.exec(program)) {           // (2) match number in egg
        expr = {type: "value", value: Number(match[0])};
    } else if (match = /^[^\s(), #"]+/.exec(program)) {    // (3) match word in egg
        expr = {type: "word", name: match[0]          };    // (aka name of a binding)
    } else {
        throw new SyntaxError("Unexpected syntax: " + program);
    }
    //console.log(match);       // to examine regex output in detail, uncomment this.
    //return expr;              // to test function in isolation, uncomment this.
    return parseApply(expr, program.slice(match[0].length)); // <- we'll really return this
}

/**
 * Second recursive function. Checks whether the expression just parsed is an application.
 * i.e., is it followed by an opening parens. If it is, parse the list of arguments.
 * This function must return result of calling itself, not just of parseExpression,
 * because remaining program after it has parsed one application could be another application.
 * That is, we allow a return value to be a function itself, which could take arguments.
 * Todo: try parsing a prog like that, then change rtn statement blw to make it break.
 */
function parseApply(expr, program) {
    program = skipSpace(program);
    if (program[0] != "(") {                          // base case. if expr just parsed
        return {expr: expr, rest: program};           // was not an application, return an
    }                                                 // _object_ representing the parse tree.

    program = skipSpace(program.slice(1));            // remove opening parens
    expr = {type: "apply", operator: expr, args: []}; // prepare what to rtn
    while (program[0] != ")") {
        let arg = parseExpression(program);           // parse the contents as an expression

        expr.args.push(arg.expr);                     // push result to args array

        program = skipSpace(arg.rest);                // skip space
        if (program[0] == ",") {                      // allow comma
            program = skipSpace(program.slice(1));
        } else if (program[0] != ")") {
            throw new SyntaxError("Expected ',', or ')'");
        }
    }
    return parseApply(expr, program.slice(1));        // return parsed result of the rest
}

/**
 * Finally, we just need a convenient parse function to check the end of the input string
 * has been reached.
 * Note: the strings we used previously above were just sequences of words for illustration.
 *       as we move to using parse, below, they will no longer be legal program strings.
 *       The Egg language is taking shape!
 */
function parse(program) {
    let {expr, rest} = parseExpression(program);
    if(skipSpace(rest).length > 0) {
        throw new SyntaxError("Unexpected text after program");
    }
    return expr;
}

// Using backticks lets us lay out our programs in egg more clearly.
// Wrapping in inspect() lets us examine the parse tree to its full depth.
// Note inspect simply lets us see the parse tree. What we'll really want to do,
// next, is send this parse tree off to the evaluator.
// But at this point, its worth pausing to make sure we understand the parsing process.

// An example of a program in Egg
// (comment this out when exploring your own program below)
inspect(parse(`
do(define(x, 10),
   if(>(x, 5),
      print("large"),
      print("small")))
`));
// Notes on above
// Note, function expressions in Egg are denoted by parens *after* an expression.
// This is like most common languages, but unlike lisp, where parens comes first.
// Note, 'if', 'do' & 'define' are actually special forms, not functions, we'll
// add them in the next commit.  print is an ordinary function, which we'll also
// add in the next commit. We can, right now, parse this program, becase we've
// defined the syntactic rules for our language. But we can't yet recognise or
// evaluate any of these special forms or functions, because our program doesn't
// yet know how to do that. We'll add this ability in the next commit.

// Change this to something of your own & inspect the parse tree:
inspect(parse(`
now(we,will,use,this,
    method(instead,to,test))
`));

// In the next commit, we'll have to do three things: add the evaluator, add special forms,
// (do, define, if, while), plus add our built-in arithmetic functions like '>'.
// This should get us to the basic stage where we can execute a program in Egg!