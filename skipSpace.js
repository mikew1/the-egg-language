
/**
 * The character \S regex means "anything but a whitespace"
 */

function skipSpace(string) {
    let first = string.search(/\S/);  // find first non-whitespace character
    if (first == -1) return "";       // if all whitespace, rtn -1
    return string.slice(first);       // return with leading whitespace removed
}

module.exports = {
    skipSpace: skipSpace
};