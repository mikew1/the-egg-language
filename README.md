## What

Implement, explore & perhaps extend [The Egg Language](http://eloquentjavascript.net/12_language.html) as described by Marijn Haverbeke in [Eloquent Javascript](http://eloquentjavascript.net/index.html).

Grasp the little known fact that every computer language is implemented in some other computer language.

Here we use javascript to write Egg.  That it's javascript is incidental.

Here's an Egg program. It defines the higher order function, `timesBy`. It doesn't do anything else.

```
define(timesBy,
    fun(p, define(anon,
        fun(q, *(p, q))
    ))
)
```

## Why

In Marijn's own words:

> Building your own programming language is surprisingly easy
> (as long as you do not aim too high) and very enlightening.

[Eloquent Javascript](http://eloquentjavascript.net/index.html) is a wonderful book, by the way!  The role of this repository is to consolidate the code which Marijn has provided in Chapter 12, then explore & extend it.

My own __why__ do this right now is that writing a [DSL](https://en.wikipedia.org/wiki/Domain-specific_language)/language like this helps build a strong foundation for Lisp/Clojure, which I'm currently learning (it's amazing).

## How

Clone the repo & check out the commit history to see the language being constructed and probed in various ways.

## Prerequisites

Be OK with [regular expressions](http://eloquentjavascript.net/09_regexp.html) & recursion and/or willing to refresh.

Want to know how a programming language is created!


## What to try to break

Everything!


## Remaining todos

- [ ] allow comments     (easy)
- [ ] add arrays         (easy)
- [ ] consider how to convert it to a compiler
- [ ] consider where macros would fit if this was a Lisp
- [ ] consider how to make a REPL

