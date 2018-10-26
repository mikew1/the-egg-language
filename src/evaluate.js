
/**
 * Evaluator, including special forms
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

specialForms.fun = (args, scope) => {
    if (!args.length) {
        throw new SyntaxError("Functions need a body");
    }
    let body = args[args.length - 1];
    // check all params are words, & map into array of names
    let params = args.slice(0, args.length - 1).map(expr => {
        if (expr.type != "word") {
            throw new SyntaxError("Parameter names must be words");
        }
        return expr.name;
    });
    // return user defined function as declared:
    return function() {
        if (arguments.length != params.length) {  // params above is closed into this fn
            throw new TypeError("Wrong number of arguments");
        }
        let localScope = Object.create(scope);
        for (let i = 0; i < arguments.length; i++) {
            localScope[params[i]] = arguments[i]; // add arguments to localScope
        }
        return evaluate(body, localScope);        // eval using the localScope
    };
};

module.exports = {
    evaluate: evaluate
}
