var Config = require('../config.js');

var optable = [
  'NOP', 'NOP', 'NOP', 'NOP', 'NOP', 'NOP', 'NOP', 'NOP',
  'NOP', 'NOP', 'NOP', 'NOP', 'NOP', 'NOP', 'NOP', 'NOP',
  'NOP', 'NOP', 'NOP', 'NOP', 'NOP', 'NOP', 'NOP', 'NOP',
  'LD', 'ST', 'NOP', 'JMP', 'BEQ', 'BNE', 'NOP', 'LDR',
  'ADD', 'SUB', 'MUL', 'DIV', 'CMPEQ', 'CMPLT', 'CMPLE', 'NOP',
  'AND', 'OR', 'XOR', 'XNOR', 'SHL', 'SHR', 'SRA', 'NOP',
  'ADDC', 'SUBC', 'MULC', 'DIVC', 'CMPEQC', 'CMPLTC', 'CMPLEC', 'NOP',
  'ANDC', 'ORC', 'XORC', 'XNORC', 'SHLC', 'SHRC', 'SRAC', 'NOP'
];

module.exports = {
  disassemble: disassemble
};

function disassemble(output, done) {
  var assembly = '';
  if (output) {

    var instructions = output.replace(/\s+/g, ' ').split(' ');
    for (var i = 0; i < instructions.length; i++) {

      var instruction = parseInt(instructions[i]);
      if (instruction) {

        var opclass = instruction >>> 30;
        var opcode = extract(instruction, 31, 26);
        var op = optable[opcode];

        var Rc = reg(extract(instruction, 25, 21));
        var Ra = reg(extract(instruction, 20, 16));
        var Rb = reg(extract(instruction, 15, 11));
        var literal = hex(extract(instruction, 15, 0));

        var args = '';
        if (op !== 'NOP') {
          if (opclass == 1) {
            args = Ra + ',' + literal + ',' + Rc;
            if (op === 'ST') args = Rc + ',' + literal + ',' + Ra;
            else if (op === 'JMP') args = Ra + ',' + Rc;
            else if (op === 'JMP') args = literal + ',' + Rc;
          }
          else if (opclass == 2) args = Ra + ',' + Rb + ',' + Rc;
          else if (opclass == 3) args = Ra + ',' + literal + ',' + Rc;
        }

        assembly += (op ? op : opcode) + '(' + args + ')\n';

      }

    }
    
  }
  done(undefined, assembly);
}

function extract(instruction, max, min) {
  return (instruction << (31 - max)) >>> (31 - max + min);
}

function reg(r) {
  return 'R' + r;
}

function hex(d) {
  return '0x' + d.toString(16).toUpperCase();
}
