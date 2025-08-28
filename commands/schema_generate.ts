import fs from 'node:fs'
import path from 'node:path'
import { BaseCommand, args } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'

function parseModelToType(modelContent: string) {
  const classMatch = RegExp(/class\s+(\w+)/).exec(modelContent)
  const className = classMatch ? classMatch[1] : 'UnknownModel'

  const columnRegex = /@column(?:\([^)]*\))?\s+declare\s+(\w+):\s*([^;\n]+)/g
  const columns = []

  let match
  while ((match = columnRegex.exec(modelContent)) !== null) {
    const [, propertyName, propertyType] = match
    columns.push({
      name: propertyName,
      type: propertyType.trim(),
    })
  }

  const relationRegex =
    /@(belongsTo|hasOne|hasMany|manyToMany)(?:\([^)]*\))?\s+declare\s+(\w+):\s*([^;\n]+)/g
  const relations = []

  while ((match = relationRegex.exec(modelContent)) !== null) {
    const [, relationType, propertyName, propertyType] = match

    let tsType = propertyType.trim()
    if (relationType === 'belongsTo' || relationType === 'hasOne') {
      tsType = tsType.replace(/^(HasOne|BelongsTo)<([^>]+)>/, '$2 | null')
    }

    if (relationType === 'hasMany' || relationType === 'manyToMany') {
      tsType = tsType.replace(/^(HasMany|ManyToMany)<([^>]+)>/, '$2[]')
    }

    relations.push({
      name: propertyName,
      type: tsType,
      relation: relationType,
    })
  }

  const allProperties = [...columns, ...relations]

  const typeDefinition = `export type ${className} = {
${allProperties.map((prop) => `  ${prop.name}: ${prop.type}`).join('\n')}
}`

  return typeDefinition
}

function parseModelsInDirectory(modelsDir: string, outputFile: string) {
  const modelFiles = fs
    .readdirSync(modelsDir)
    .filter((file) => file.endsWith('.ts') || file.endsWith('.js'))

  let allTypes = ''
  modelFiles.forEach((file) => {
    const filePath = path.join(modelsDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')

    // Skip files that don't have @column decorators
    if (!content.includes('@column')) return

    const typeDefinition = parseModelToType(content)
    allTypes += typeDefinition + '\n\n'
  })

  fs.writeFileSync(outputFile, allTypes.trim())
  console.log(`Generated types written to ${outputFile}`)
}

export default class SchemaGenerate extends BaseCommand {
  static readonly commandName = 'schema:generate'
  static readonly description = 'Generate inertia/types.ts for type definition in front end.'

  static readonly options: CommandOptions = {}

  @args.string({
    description: 'Directory that contains models',
    required: false,
    default: './app/models',
  })
  declare modelsDir: string

  @args.string({
    description: 'Inertia model types',
    required: false,
    default: './inertia/types.ts',
  })
  declare outputFile: string

  async run() {
    const cmdArgs = this.parsed.args as unknown as string[]
    parseModelsInDirectory(cmdArgs[0], cmdArgs[1])
  }
}
