## Goals for this repo

Implement, explore & perhaps extend [The Egg Language](http://eloquentjavascript.net/12_language.html) as described by Marijn Haverbeke in [Eloquent Javascript](http://eloquentjavascript.net/index.html).

See and experience how any computer language<sup>*</sup> is in fact implemented... _in some other computer language!_

Here, Egg is written in javascript (javascript is perhaps an uncommon choice for this kind of thing, but it doesn't matter).

Here's a quick introduction to Egg.

To set a variable: 

```
define(word, 2)
``` 

Note assignment is not done with `=`, it's `define` that does that, which can be confusing. 

It's worth pausing to let that sink in.

To get the variable back:

```
print(word)
> 2
```

Now something much harder. Here's a function definition for `timesBy`, a higher order function, which returns a function. 
Function defininitions take the form `fun(args... body)`, with however many args you want. The thing we define below, `timesBy`, is a function (`fun`), that has one arg, `howMuch`. Its body, which is the same as its return value, then follows, in the form of a function definition. So, `timesBy` is function which makes functions which timesBy `howMuch` you specify.

Define `timesBy`:
```
define(timesBy,
    fun(howMuch, define(anon, 
                   fun(byWhat, *(howMuch, byWhat))
                 )
        )
)
```

Call `timesBy` to get a function back:
```
define(timesBy4, timesBy(4))
```
Call the function just made: 
```
print(timesBy4(5))
> 20
```
Or do both steps at once, i.e. call the factory then immediately call the resulting function.

You might have seen this form in javascript.
```
print(timesBy(4)(5))
> 20
```
To reiterate, if you ended the line after the `(4)` above, what you'd have is a function, so the `(5)` after that is another invocation.

Higher order functions are by no means the meat and potatoes of the language implementation. They're pretty incidental, and I don't think Marijn even pointed out that Egg supported them. The interesting stuff is a lot simpler than that. I just wanted turn up the gas for the introduction.

## Why write some other language in javascript?

In Marijn's own words:

> Building your own programming language is surprisingly easy
> (as long as you do not aim too high) and very enlightening.

[Eloquent Javascript](http://eloquentjavascript.net/index.html) is a wonderful book, by the way!  The role of this repository is to consolidate the code which Marijn has provided in Chapter 12, then explore & extend it.

My own __why__ do this right now is that writing a [DSL](https://en.wikipedia.org/wiki/Domain-specific_language)/language like this helps build a strong foundation for Lisp/Clojure, which I'm currently learning.

## How to explore

Clone the repo & check out the commit history to see the language being constructed.

## Recommended prerequisites

Be OK with [regular expressions](http://eloquentjavascript.net/09_regexp.html) & recursion and/or willing to refresh.

Want to know how a programming language is created!


## What to try to break/change

Everything. There's loads of scope to modify the code here.


## Todos

- [ ] allow comments     (easy)
- [ ] add arrays         (easy)
- [ ] consider how to convert it to a compiler
- [ ] consider where macros would fit if this was a Lisp
- [ ] consider how to make a REPL
- [ ] write a little text adventure in egg based on a Lisp/Scheme example.
- [ ] since egg is already in [PN](https://en.wikipedia.org/wiki/Polish_notation), why not move the first opening parens to the left, to be closer to [S-expr](https://en.wikipedia.org/wiki/S-expression) & more lispish. Am finding the half-way house syntax rather unreadable. Have never seen a language quite like this!
- [ ] shorten `define` to `def` & `function` to `fn`

current syntax:
```
do(
   define(x, 10),
   if(>(x, 5),
     print("large"),
     print("small")))
```

consider change to new syntax:
```
(do 
  (def x, 10),
  (if (> x, 5),
    (print "large"),
    (print "small")))
```
- [ ] if above works, remove commas or make them optional, to get:

```
(do 
  (def x 10)
  (if (> x 5)
    (print "large")
    (print "small")))
```

- [ ] consider `anon` functions. If name is "anon", make actually anonymous, unreferencable? So, how is `lambda` defined?

<sup>*</sup> except hardware.
