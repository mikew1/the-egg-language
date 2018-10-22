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
var {skipSpace} = require('./skipSpace');

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
    return expr;                // <- we're returning expr at this pt. solely to test this fn
    //return parseApply(expr, program.slice(match[0].length)); // <- we'll really return this
}

// run 'node egg' on this file to see the output of these calls:
console.log(parseExpression("an example sequence of 6 expressions"));
console.log(parseExpression("this one includes a \"quoted string\""));
console.log(parseExpression("run `node egg` & examine what is produced!"));
// We want to parse these sequences of expressions into their corresponding data structures.
// Note at present our code only parses the first expression for each line above then stops.
// You should see 'an', 'this', and 'run' have been parsed. Next we'll parse the rest.
// Check out the next commit to continue.