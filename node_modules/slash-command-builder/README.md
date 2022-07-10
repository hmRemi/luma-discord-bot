# Slash Command Builder

Create a JSON structure to send to the Discord API and register your Slash Commands. TypeScript supported.

For more information, read [Application Commands](https://discord.com/developers/docs/interactions/application-commands) in the Discord documentation API.

## Features

- [Boolean](#option-boolean)
- [Channel](#option-channel). Including filter by [Channel Types](https://discord.com/developers/docs/resources/channel#channel-object-channel-types).
- [Integer](#option-integer)
- [Mentionable](#option-mentionable)
- [Number](#option-number)
- [Role](#option-role)
- [String](#option-string)
- [User](#option-user)
- [Subcommand](#option-subcommand)
- [SubcommandGroup](#option-subcommandgroup)

Types: `Integer` `Number` `String` with [choices structure](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-choice-structure), this field _(choices)_ using `addChoice()` or `addChoices()` is optional.

Specification in the [Application Command Option Type](https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type) section.

> **Note:** to register subcommands and subcommand groups, read the [nesting support](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups) in the documentation.

## Installation

Node.js 14 or newer is required.

```bash
yarn add slash-command-builder
```

Or with NPM

```bash
npm i -S slash-command-builder
```

## Getting Started

Create a new instance of `SlashCommandBuilder` class:

```typescript
import SlashCommandBuilder from 'slash-command-builder';

const builder: SlashCommandBuilder = new SlashCommandBuilder();

builder.setName('info') // Using `/info`
builder.setDescription('command description')
```

### Registering Application Commands

Using `@discordjs/rest` `discord-api-types` libraries.

```typescript
import { REST } from  '@discordjs/rest';
import { Routes } from  'discord-api-types/v9';

const rest: REST = new REST({ version: '9' }).setToken('BOT_TOKEN');

(async () => {
  // Global Commands
  await rest.put(
    Routes.applicationCommands('BOT_APP_ID'),
    { body: [builder.toJSON()] },
  )

  // Or specific Guild
  await rest.put(
    Routes.applicationGuildCommands('BOT_APP_ID', 'GUILD_ID'),
    { body: [builder.toJSON()] },
  )
})();
```

To register multiple application commands:

```typescript
// ...

const builderCommand_1: SlashCommandBuilder = new SlashCommandBuilder();
const builderCommand_2: SlashCommandBuilder = new SlashCommandBuilder();
const builderCommand_3: SlashCommandBuilder = new SlashCommandBuilder();

// ...

(async () => {
  await rest.put(
    ...,
    {
      body: [
        builderCommand_1.toJSON(),
        builderCommand_2.toJSON(),
        builderCommand_3.toJSON(),
      ],
    },
  )
})();
```

### Add Options

All these options including methods:

- `builder.setName(name: string)` Set a name.
- `builder.setDescription(description: string)` Set a description.
- `builder.setRequired(required: boolean)` (Optional) This option is required or not.

And his respective properties:

- `builder.name`
- `builder.description`
- `builder.required`

> **Note:** Required `options` must be listed before optional options
> 
> Using previous instance `builder`:

#### Option: Boolean

```typescript
import { SlashCommandBooleanOption } from 'slash-command-builder';

builder.addBooleanOption((option: SlashCommandBooleanOption): SlashCommandBooleanOption => (
  option
    .setName('bool')
    .setDescription('Option description')
    // .setRequired(true) // This option is required
));
```

#### Option: Channel

```typescript
import {
  ChannelTypes,
  SlashCommandChannelOption,
} from 'slash-command-builder';

builder.addChannelOption((option: SlashCommandChannelOption): SlashCommandChannelOption => (
  option
    .setName('channel')
    .setDescription('Option description')
    // .setRequired(true) // This option is required

	// Filter channels
    .addFilterBy(ChannelTypes.GUILD_NEWS)
    .addFilterBy(ChannelTypes.GUILD_CATEGORY)

    // Using array
    .addFilterBy([ChannelTypes.GUILD_TEXT])

    // Final result:
    // [ChannelTypes.GUILD_NEWS, ChannelTypes.GUILD_CATEGORY, ChannelTypes.GUILD_TEXT]
));
```

> **Note:** the method `addFilterBy` can be chained multiple times.

#### Option: Integer

```typescript
import { SlashCommandIntegerOption } from 'slash-command-builder';

builder.addIntegerOption((option: SlashCommandIntegerOption): SlashCommandIntegerOption => (
  option
    .setName('integer')
    .setDescription('Option description')
    // .setRequired(true) // This option is required

	// Add choices
    .addChoice('Choice #1', 1)
    .addChoice('Choice #2', 2)

    // Using array
    .addChoices([
      { name: 'Choice #3', value: 3 },
      { name: 'Choice #4', value: 4 },
    ])

    // Final result:
    [
      { name: 'Choice #1', value: 1 },
      { name: 'Choice #2', value: 2 },
      { name: 'Choice #3', value: 3 },
      { name: 'Choice #4', value: 4 },
    ]
));
```

> **Note:** the methods `addChoice` and `addChoices` can be chained multiple times.

#### Option: Mentionable

```typescript
import { SlashCommandMentionableOption } from 'slash-command-builder';

builder.addMentionableOption(
  (option: SlashCommandMentionableOption): SlashCommandMentionableOption => (
    option
      .setName('mentionable')
      .setDescription('Option description')
      // .setRequired(true) // This option is required
  )
);
```

#### Option: Number

```typescript
import { SlashCommandNumberOption } from 'slash-command-builder';

builder.addNumberOption(
  (option: SlashCommandNumberOption): SlashCommandNumberOption => (
    option
      .setName('number')
      .setDescription('Option description')
      // .setRequired(true) // This option is required

	// Add choices
    .addChoice('Choice #1', 1.1)
    .addChoice('Choice #2', 2.2)

    // Using array
    .addChoices([
      { name: 'Choice #3', value: 3.3 },
      { name: 'Choice #4', value: 4.4 },
    ])

    // Final result:
    [
      { name: 'Choice #1', value: 1.1 },
      { name: 'Choice #2', value: 2.2 },
      { name: 'Choice #3', value: 3.3 },
      { name: 'Choice #4', value: 4.4 },
    ]
  )
);
```

#### Option: Role

```typescript
import { SlashCommandRoleOption } from 'slash-command-builder';

builder.addRoleOption(
  (option: SlashCommandRoleOption): SlashCommandRoleOption => (
    option
      .setName('role')
      .setDescription('Option description')
      // .setRequired(true) // This option is required
  )
);
```

#### Option: String

```typescript
import { SlashCommandStringOption } from 'slash-command-builder';

builder.addStringOption((option: SlashCommandStringOption): SlashCommandStringOption => (
  option
    .setName('string')
    .setDescription('Option description')
    // .setRequired(true) // This option is required

	// Add choices
    .addChoice('Choice #1', 'option:1')
    .addChoice('Choice #2', 'option:2')

    // Using array
    .addChoices([
      { name: 'Choice #3', value: 'option:3' },
      { name: 'Choice #4', value: 'option:4' },
    ])

    // Final result:
    [
      { name: 'Choice #1', value: 'option:1' },
      { name: 'Choice #2', value: 'option:2' },
      { name: 'Choice #3', value: 'option:3' },
      { name: 'Choice #4', value: 'option:4' },
    ]
));
```

> **Note:** the methods `addChoice` and `addChoices` can be chained multiple times.

#### Option: User

```typescript
import { SlashCommandUserOption } from 'slash-command-builder';

builder.addUserOption(
  (option: SlashCommandUserOption): SlashCommandUserOption => (
    option
      .setName('user')
      .setDescription('Option description')
      // .setRequired(true) // This option is required
  )
);
```

#### Option: Subcommand

```typescript
import { SlashCommandSubcommand } from 'slash-command-builder';

builder.addSubcommand(
  (sub: SlashCommandSubcommand): SlashCommandSubcommand => (
    sub
      .setName('subcommand')
      .setDescription('subcommand description')

      // Add options
      .addStringOption(...)
      .addUserOption(...)
  )
);
```

#### Option: SubcommandGroup

```typescript
import { SlashCommandSubcommandGroup } from 'slash-command-builder';

builder.addSubcommandGroup(
  (group: SlashCommandSubcommandGroup): SlashCommandSubcommandGroup => (
    group
      .setName('subcommand-group')
      .setDescription('subcommand-group description')

      // Multiple subcommands
      .addSubcommand(
        (sub: SlashCommandSubcommand): SlashCommandSubcommand => (
          sub
            .setName('subcommand-one')
            .setDescription('subcommand-one description')

            // Add options
            .addStringOption(...)
            .addUserOption(...)
      )
      .addSubcommand(
        (sub: SlashCommandSubcommand): SlashCommandSubcommand => (
          sub
            .setName('subcommand-two')
            .setDescription('subcommand-two description')

            // Add options
            .addRoleOption(...)
            .addMentionableOption(...)
      )
    )
  )
);
```

### Interfaces/Types

- ApplicationCommandInteractionDataOptionStructure
- ApplicationCommandJSON
- ApplicationCommandOptionChoiceStructure
- ApplicationCommandOptionStructure
- ApplicationCommandOptionTypes
- ApplicationCommandStructure
- ApplicationCommandTypes
- ChannelTypes
- Choices
- Snowflake

### Contributing

Feel free to report any bug by creating an [Issue](https://github.com/Ciensprog/slash-command-builder/issues) or a [Pull Request](https://github.com/Ciensprog/slash-command-builder/pulls). It will be much appreciated! :D