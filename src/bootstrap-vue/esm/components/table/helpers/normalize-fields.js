import { identity } from '../../../utils/identity';
import { isArray, isFunction, isObject, isString } from '../../../utils/inspect';
import { clone, keys } from '../../../utils/object';
import { startCase } from '../../../utils/string';
import { IGNORED_FIELD_KEYS } from './constants'; // Private function to massage field entry into common object format

var processField = function processField(key, value) {
  var field = null;

  if (isString(value)) {
    // Label shortcut
    field = {
      key: key,
      label: value
    };
  } else if (isFunction(value)) {
    // Formatter shortcut
    field = {
      key: key,
      formatter: value
    };
  } else if (isObject(value)) {
    field = clone(value);
    field.key = field.key || key;
  } else if (value !== false) {
    // Fallback to just key

    /* istanbul ignore next */
    field = {
      key: key
    };
  }

  return field;
}; // We normalize fields into an array of objects
// [ { key:..., label:..., ...}, {...}, ..., {..}]


export var normalizeFields = function normalizeFields(origFields, items) {
  var fields = [];

  if (isArray(origFields)) {
    // Normalize array Form
    origFields.filter(identity).forEach(function (f) {
      if (isString(f)) {
        fields.push({
          key: f,
          label: startCase(f)
        });
      } else if (isObject(f) && f.key && isString(f.key)) {
        // Full object definition. We use assign so that we don't mutate the original
        fields.push(clone(f));
      } else if (isObject(f) && keys(f).length === 1) {
        // Shortcut object (i.e. { 'foo_bar': 'This is Foo Bar' }
        var key = keys(f)[0];
        var field = processField(key, f[key]);

        if (field) {
          fields.push(field);
        }
      }
    });
  } // If no field provided, take a sample from first record (if exits)


  if (fields.length === 0 && isArray(items) && items.length > 0) {
    var sample = items[0];
    keys(sample).forEach(function (k) {
      if (!IGNORED_FIELD_KEYS[k]) {
        fields.push({
          key: k,
          label: startCase(k)
        });
      }
    });
  } // Ensure we have a unique array of fields and that they have String labels


  var memo = {};
  return fields.filter(function (f) {
    if (!memo[f.key]) {
      memo[f.key] = true;
      f.label = isString(f.label) ? f.label : startCase(f.key);
      return true;
    }

    return false;
  });
};