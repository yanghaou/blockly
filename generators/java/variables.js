/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating Java for variable blocks.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

goog.provide('Blockly.Java.variables');

goog.require('Blockly.Java');


Blockly.Java['variables_get'] = function(block) {
  // Variable getter.
  var code = Blockly.Java.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return [code, Blockly.Java.ORDER_ATOMIC];
};

Blockly.Java['variables_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.Java.valueToCode(block, 'VALUE',
      Blockly.Java.ORDER_NONE) || '0';
  var varName = Blockly.Java.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  // See if we have to handle the case where the type of the variable doesn't
  // match the type of what is being assigned.
  var sourceType = Blockly.Java.getValueType(block, 'VALUE');
  var destType = Blockly.Java.GetBlocklyType(block.getFieldValue('VAR'));
  var compatible = false;
  for (var i = 0; i < sourceType.length; i++) {
    if (sourceType[i] === destType) {
      compatible = true;
      break;
    }
  }
  if (destType === 'String' && !compatible) {
    argument0 = Blockly.Java.toStringCode(argument0);
  }
  return varName + ' = ' + argument0 + ';\n';
};

Blockly.Java['hash_variables_get'] = function(block) {
  // Variable getter.
  var getter = 'getString';
  var parent = block.getParent();
  // Look at our parents to see if we know the type that we are assigning to
  if (parent) {
    var func = parent.getVars;
    if (func) {
      var blockVariables = func.call(parent);
      for (var y = 0; y < blockVariables.length; y++) {
        var varName = blockVariables[y];
        // Variable name may be null if the block is only half-built.
        if (varName) {
          var vartype = Blockly.Java.GetVariableType(varName);

          if (vartype === 'JsonArray') {
            getter = 'getJsonArray';
          } else if (vartype === 'JsonObject') {
            getter = 'getJsonObject';
          }
        }
      }
    }
  }
  var code = Blockly.Java.variableDB_.getName(block.getFieldValue('VAR'),
             Blockly.Variables.NAME_TYPE) + '.' + getter + '('+
             Blockly.Java.quote_(block.getFieldValue('HASHKEY')) + ')' ;
  return [code, Blockly.Java.ORDER_ATOMIC];
};

Blockly.Java['hash_parmvariables_get'] = function(block) {
  // Variable getter.
  var getter = 'getString';
  var parent = block.getParent();
  // Look at our parents to see if we know the type that we are assigning to
  if (parent) {
    var func = parent.getVars;
    if (func) {
      var blockVariables = func.call(parent);
      for (var y = 0; y < blockVariables.length; y++) {
        var varName = blockVariables[y];
        // Variable name may be null if the block is only half-built.
        if (varName) {
          var vartype = Blockly.Java.GetVariableType(varName);

          if (vartype === 'JsonArray') {
            getter = 'getJsonArray';
          } else if (vartype === 'JsonObject') {
            getter = 'getJsonObject';
          }
        }
      }
    } else {
    }
  }
  var argument0 = Blockly.Java.valueToCode(block, 'VAR',
      Blockly.Java.ORDER_NONE) || '0';
  var code = argument0 + '.' + getter + '('+
             Blockly.Java.quote_(block.getFieldValue('HASHKEY')) + ')' ;
  return [code, Blockly.Java.ORDER_ATOMIC];
};


Blockly.Java['hash_variables_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.Java.valueToCode(block, 'VALUE',
      Blockly.Java.ORDER_NONE) || '0';
  var varName = Blockly.Java.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return varName + '{' + block.getFieldValue('HASHKEY') + '}' +
                     ' = ' + argument0 + ';\n';
};
