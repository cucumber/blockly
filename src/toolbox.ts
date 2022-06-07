import { Suggestion } from '@cucumber/language-service'

export function toolbox(suggestions: readonly Suggestion[]): string {
  return `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="feature"/>
  <block type="rule"/>
  <block type="background"/>
  <block type="scenario"/>
  <block type="step"/>
  ${suggestions.map((suggestion) => `<block type="${suggestion.label}"/>`)}
</xml>
`
}
