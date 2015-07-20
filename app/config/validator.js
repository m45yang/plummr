// dependencies
var validator = require('validator');

validator.extend('isValidSlug', function (str) {
  return (
    (str.charAt(0) !== '-') && // first character is not hyphen
    (str.charAt(str.length-1) !== '-') && // last character is not hyphen
    (/^[0-9a-z\-]+$/i.test(str)) // contains only alphanumeric characters and hyphens
  );
});

validator.extend('isValidPassword', function (str) {
  return (
    (str.length >= 6) && // password is at least 6 characters long
    (/[0-9]/i.test(str)) && // contains a number
    (/[a-z]/i.test(str)) // contains a letter
  );
});
