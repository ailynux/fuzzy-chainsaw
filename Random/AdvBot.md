# Advanced Discord Bot Development Guide 🤖

A comprehensive deep-dive into creating sophisticated Discord bots using Discord.js v14+

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Advanced Setup](#advanced-setup)
- [Project Structure](#project-structure)
- [Core Systems](#core-systems)
- [Advanced Features](#advanced-features)
- [Database Integration](#database-integration)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [Scaling & Performance](#scaling--performance)
- [Security Best Practices](#security-best-practices)
- [Advanced Deployment](#advanced-deployment)
- [Monitoring & Maintenance](#monitoring--maintenance)

## Architecture Overview

### Design Patterns
The bot implements several key design patterns:
- Command Pattern for handling user interactions
- Observer Pattern for event handling
- Dependency Injection for service management
- Repository Pattern for data access
- Factory Pattern for creating complex objects

### Core Components
```
src/
├── commands/           # Command implementations
├── events/            # Event handlers
├── services/          # Business logic
├── models/            # Data models
├── database/          # Database connections and queries
├── utils/             # Helper functions
├── config/            # Configuration files
├── types/            # TypeScript type definitions
└── tests/            # Test files
```

## Advanced Setup

### Development Environment

```bash
# Initialize TypeScript project
npm init -y
npm install typescript @types/node --save-dev
npx tsc --init

# Install core dependencies
npm install discord.js @discordjs/rest @discordjs/builders
npm install @discordjs/voice @discordjs/opus
npm install prisma @prisma/client
npm install winston bull ioredis
npm install jest @types/jest ts-jest --save-dev
```

### TypeScript Configuration
**tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}
```

## Project Structure

### Advanced Command Handler
```typescript
// src/types/command.ts
interface Command {
  name: string;
  description: string;
  category: string;
  cooldown?: number;
  permissions?: PermissionResolvable[];
  execute: (interaction: CommandInteraction) => Promise<void>;
}

// src/handlers/CommandHandler.ts
class CommandHandler {
  private commands: Collection<string, Command>;
  private cooldowns: Collection<string, Collection<string, number>>;

  constructor() {
    this.commands = new Collection();
    this.cooldowns = new Collection();
  }

  async loadCommands() {
    const commandFiles = await glob('src/commands/**/*.ts');
    
    for (const file of commandFiles) {
      const command = await import(file);
      this.registerCommand(command);
    }
  }

  private registerCommand(command: Command) {
    this.validateCommand(command);
    this.commands.set(command.name, command);
  }

  private validateCommand(command: Command) {
    // Implement command validation logic
  }

  async handleInteraction(interaction: CommandInteraction) {
    const command = this.commands.get(interaction.commandName);
    
    if (!command) return;

    if (!this.checkPermissions(interaction, command)) {
      return await interaction.reply({
        content: 'You do not have permission to use this command.',
        ephemeral: true
      });
    }

    if (!this.checkCooldown(interaction, command)) {
      return await interaction.reply({
        content: 'Please wait before using this command again.',
        ephemeral: true
      });
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      await this.handleCommandError(interaction, error);
    }
  }
}
```

### Advanced Event System
```typescript
// src/handlers/EventHandler.ts
class EventHandler {
  private client: Client;
  private logger: Logger;

  constructor(client: Client, logger: Logger) {
    this.client = client;
    this.logger = logger;
  }

  async loadEvents() {
    const eventFiles = await glob('src/events/**/*.ts');
    
    for (const file of eventFiles) {
      const event = await import(file);
      this.registerEvent(event);
    }
  }

  private registerEvent(event: Event) {
    if (event.once) {
      this.client.once(event.name, (...args) => this.handleEvent(event, ...args));
    } else {
      this.client.on(event.name, (...args) => this.handleEvent(event, ...args));
    }
  }

  private async handleEvent(event: Event, ...args: any[]) {
    try {
      await event.execute(...args);
    } catch (error) {
      this.logger.error(`Error in event ${event.name}:`, error);
    }
  }
}
```

## Core Systems

### Dependency Injection Container
```typescript
// src/container.ts
import { Container } from 'inversify';
import { TYPES } from './types';

const container = new Container();

container.bind<Database>(TYPES.Database).to(PostgresDatabase);
container.bind<CacheService>(TYPES.Cache).to(RedisCache);
container.bind<Logger>(TYPES.Logger).to(WinstonLogger);

export { container };
```

### Database Integration with Prisma
```typescript
// src/database/prisma.ts
import { PrismaClient } from '@prisma/client';

export class Database {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async connect() {
    await this.prisma.$connect();
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }

  get client() {
    return this.prisma;
  }
}
```

### Caching System with Redis
```typescript
// src/services/cache.ts
import IORedis from 'ioredis';

export class CacheService {
  private redis: IORedis.Redis;

  constructor() {
    this.redis = new IORedis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttl) {
      await this.redis.setex(key, ttl, serialized);
    } else {
      await this.redis.set(key, serialized);
    }
  }
}
```

## Advanced Features

### Voice System Integration
```typescript
// src/services/voice.ts
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus
} from '@discordjs/voice';

export class VoiceService {
  private players: Map<string, AudioPlayer>;

  constructor() {
    this.players = new Map();
  }

  async joinChannel(channel: VoiceChannel): Promise<AudioPlayer> {
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator
    });

    const player = createAudioPlayer();
    connection.subscribe(player);
    this.players.set(channel.guild.id, player);

    return player;
  }

  async playAudio(guildId: string, resource: string) {
    const player = this.players.get(guildId);
    if (!player) throw new Error('No voice connection');

    const audioResource = createAudioResource(resource);
    player.play(audioResource);

    return new Promise((resolve, reject) => {
      player.on(AudioPlayerStatus.Idle, resolve);
      player.on('error', reject);
    });
  }
}
```

### Message Component Handler
```typescript
// src/handlers/ComponentHandler.ts
export class ComponentHandler {
  private components: Collection<string, ComponentHandler>;

  constructor() {
    this.components = new Collection();
  }

  async handleInteraction(interaction: MessageComponentInteraction) {
    const [componentId, ...args] = interaction.customId.split(':');
    const handler = this.components.get(componentId);

    if (!handler) return;

    try {
      await handler.execute(interaction, args);
    } catch (error) {
      await this.handleComponentError(interaction, error);
    }
  }
}
```

## Testing & Quality Assurance

### Jest Configuration
```typescript
// jest.config.ts
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Example Test Suite
```typescript
// src/commands/__tests__/ping.test.ts
describe('Ping Command', () => {
  let command: PingCommand;
  let interaction: CommandInteraction;

  beforeEach(() => {
    command = new PingCommand();
    interaction = createMockInteraction();
  });

  it('should reply with pong', async () => {
    await command.execute(interaction);
    expect(interaction.reply).toHaveBeenCalledWith({
      content: expect.stringContaining('Pong!'),
      ephemeral: false
    });
  });
});
```

## Scaling & Performance

### Clustering
```typescript
// src/cluster.ts
import { ClusterManager } from 'discord.js';
import * as os from 'os';

const manager = new ClusterManager('./dist/index.js', {
  token: process.env.DISCORD_TOKEN,
  totalShards: 'auto',
  totalClusters: os.cpus().length
});

manager.on('clusterCreate', cluster => {
  console.log(`Launched cluster ${cluster.id}`);
});

manager.spawn();
```

### Queue System
```typescript
// src/services/queue.ts
import Queue from 'bull';

export class QueueService {
  private queues: Map<string, Queue.Queue>;

  constructor() {
    this.queues = new Map();
  }

  createQueue(name: string, options?: Queue.QueueOptions): Queue.Queue {
    const queue = new Queue(name, {
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379')
      },
      ...options
    });

    this.queues.set(name, queue);
    return queue;
  }

  async addJob(queueName: string, data: any, options?: Queue.JobOptions) {
    const queue = this.queues.get(queueName);
    if (!queue) throw new Error(`Queue ${queueName} not found`);

    return await queue.add(data, options);
  }
}
```

## Security Best Practices

### Rate Limiting
```typescript
// src/middleware/rateLimit.ts
import { RateLimiter } from 'redis-rate-limiter';

export class RateLimitMiddleware {
  private limiter: RateLimiter;

  constructor(redis: Redis) {
    this.limiter = new RateLimiter({
      redis: redis,
      namespace: 'rate-limit'
    });
  }

  async checkRateLimit(key: string, limit: number, window: number): Promise<boolean> {
    return new Promise((resolve) => {
      this.limiter.attempt(key, { limit, window }, (err, result) => {
        resolve(!err && result.remaining >= 0);
      });
    });
  }
}
```

### Permission System
```typescript
// src/utils/permissions.ts
export class PermissionManager {
  static async checkPermissions(
    member: GuildMember,
    requiredPermissions: PermissionResolvable[]
  ): Promise<boolean> {
    if (member.id === member.guild.ownerId) return true;

    return requiredPermissions.every(permission =>
      member.permissions.has(permission)
    );
  }

  static async checkBotPermissions(
    guild: Guild,
    requiredPermissions: PermissionResolvable[]
  ): Promise<boolean> {
    const botMember = await guild.members.fetch(guild.client.user!.id);
    return requiredPermissions.every(permission =>
      botMember.permissions.has(permission)
    );
  }
}
```

## Advanced Deployment

### Docker Configuration
```dockerfile
# Dockerfile
FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

COPY . .
RUN npm run build

CMD ["npm", "start"]
```

### Docker Compose Setup
```yaml
# docker-compose.yml
version: '3.8'

services:
  bot:
    build: .
    environment:
      - NODE_ENV=production
      - DISCORD_TOKEN=${DISCORD_TOKEN}
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_HOST=redis
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:13
    environment:
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=${DB_NAME}
    volumes:
      - postgres-data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine
    volumes:
      - redis-data:/data

volumes:
  postgres-data:
  redis-data:
```

## Monitoring & Maintenance

### Logging System
```typescript
// src/services/logger.ts
import winston from 'winston';

export class Logger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
      ]
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(new winston.transports.Console({
        format: winston.format.simple()
      }));
    }
  }

  info(message: string, meta?: any) {
    this.logger.info(message, meta);
  }

  error(message: string, error?: Error
