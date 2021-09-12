import { Generator, Block } from 'blockly'

declare module Blockly {
  class Generator {
    [key: string]: (block: Block) => string
  }
}

const generator = new Generator('Cucumber')

generator['scenario'] = (block: Block) => {
  return `Scenario: ${block.getFieldValue('SCENARIO_NAME')}\n`
}

generator['given'] = (block: Block) => {
  return 'Given '
}

generator['when'] = (block: Block) => {
  return 'When '
}

generator['i_have__int__cukes_in_my__word_'] = (block: Block) => {
  return "I have some cukes..."
}

export default generator
