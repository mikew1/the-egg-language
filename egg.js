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


// Example program in Egg to study parse tree:
// inspect(parse(`
// do(define(x, 10),
//    if(>(x, 5),
//       print("large"),
//       print("small")))
// `));
// Notes
// - parse & parseApply can parse a program string, because they define syntactic rules
//   of the language. What they can't do is recognise the meaning of any of any of the
//   expressions parsed, i.e. evaluate any of them. It's the evaluator that does that.
// - function expressions in Egg are denoted by parens *after* an expression.
//   this is like most common languages, but unlike lisp, where parens comes first.
// - inspect simply lets us see the parse tree before it is evaluated.
//   inspecting it at this point lets us study the behaviour of the parser.





/**
 * Evaluator, special forms & scope.
 * Notes
 * (1) Remember that while a value can be a string or a number, a word is a name
 *     of a binding in egg. That can be a variable that's been defined, or something
 *     that's already in the top scope, which includes both values and functions.
 * (2) Functions will be able to return functions in Egg.
 *     Hence an operator itself needs to be evaluated.
 *     Todo: write a prog that uses h.ord.fn, then change below to make it break.
 *     To do that, need to wait till we implement user definable functions, later.
 */

function evaluate(expr, scope) {
    if        (expr.type == "value") {
        return expr.value;              // a value evaluates to itself
    } else if (expr.type == "word") {
        if (expr.name in scope) {
            return scope[expr.name];    // a word evaluates to its value in curr. scope (1)
        } else {
            throw new ReferenceError(`Undefined binding: ${expr.name}`);
        }
    } else if (expr.type == "apply") {
        let {operator, args} = expr;
        if (operator.type == "word" && operator.name in specialForms) {
            return specialForms[operator.name](expr.args, scope);  // eval as special form
        } else {
                                                    // _now it must be a regular function_
            let op = evaluate(operator, scope);     // evaluate the operator (h.ord.fn. option) (2)
            if (typeof op == "function") {          // once evaluated, op must be a function
                return op(...args.map(arg => evaluate(arg, scope))); // eval each arg & spread
            } else {
                throw new TypeError("Applying a non-function");
            }
        }
    }

}


/**
 * Special forms
 * Special forms play a similar role to functions, but what makes them different
 * is that they do not follow the same evaluation rules as normal functions.
 * When a normal function is evaluated, what happens is all of its arguments are
 * first evaluated, then the function is evaluated using those results.
 * With the special form if, for example, the first argument is evaluated,
 * and depending on the result, either the second or third is evaluated.
 * Each special form has its own variation on the evaluation rule.
 * Notes
 * - if & while are implemented using js if & while. An alternative would be
 *   to use the raw functionality provided by a machine, or a vm.
 * - do is present because Egg doesn't have the concept of a block.
 * - define returns the value that was defined. if a repl for egg existed,
 *   define would look like this. => define(myvar, 3) => 3.
 *   in designing a language, you choose what a special form returns.
 */

const specialForms = Object.create(null);    // prototype we'll add functions to

specialForms.if = (args, scope) => {
    // evaluation rules for if:
    if(args.length != 3) {
        throw new SyntaxError("Wrong number of args to if");
    }
    // just implemented with js if:
    if (evaluate(args[0], scope) !== false) { // no coercion to false in egg
        return evaluate(args[1], scope);
    } else {
        return evaluate(args[2], scope);
    }
}

specialForms.while = (args, scope) => {
    // evaluation rules for while:
    if(args.length != 2) {
        throw new SyntaxError("Wrong number of args to while");
    }
    // just implemented with js while:
    while (evaluate(args[0], scope) !== false) {
        evaluate(args[1], scope);
    }
    return false;
}

specialForms.do = (args, scope) => {
    // evaluation rules for do:
    let value = false;
    // impl. of do is to eval each arg in turn:
    for (let arg of args) {
        value = evaluate(arg, scope);
    }
    return value;  // return the value of its last arg.
}                  // (a specificity of egg - to explore)

specialForms.define = (args, scope) => {
    // evaluation rules for define:
    if (args.length != 2 || args[0].type != "word") {
        throw new SyntaxError("Incorrect Use of define");
    }
    // evaluate the 2nd arg & assign it as value of the 1st.
    let value = evaluate(args[1], scope);
    scope[args[0].name] = value;

    return value;  // return the value assigned
                   // (unlike js, which returns undefined after an assignment)
}



/**
 * Finally, we can now parse and evaluate an egg program.
 */

const {topScope} = require('./topscope.js')

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