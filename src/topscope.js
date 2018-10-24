
/**
 * Add some basic forms (incl. values and functions) to a topScope,
 * with which we'll start our programs.
 * At this point, this includes the boolean values,
 * basic arithmetic functions, and print.
 */

const topScope = Object.create(null);

topScope.true  = true;
topScope.false = false;

topScope["+"]  = Function("a, b", `return a + b`);
topScope["-"]  = Function("a, b", `return a - b`);
topScope["*"]  = Function("a, b", `return a * b`);
topScope["/"]  = Function("a, b", `return a / b`);
topScope["=="] = Function("a, b", `return a == b`);
topScope["<"]  = Function("a, b", `return a < b`);
topScope[">"]  = Function("a, b", `return a > b`);

topScope.print = value => {
    console.log(value);
    return value;
}

// Here, all of these defs do just defer to javascript,
// but we could define them however we like!

// "The evaluator, which determines the meaning of expressions
// in a programming language, is just another program..."

module.exports = {
    topScope: topScope
}