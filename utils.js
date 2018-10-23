
/**
 * The character \S regex means "anything but a whitespace"
 */

function skipSpace(string) {
    let first = string.search(/\S/);  // find first non-whitespace character
    if (first == -1) return "";       // if all whitespace, rtn -1
    return string.slice(first);       // return with leading whitespace removed
}

function inspect(syntaxTree) {
    console.log(require('util').inspect(syntaxTree, false, null, true));
}

module.exports = {
    skipSpace: skipSpace,
    inspect: inspect
};