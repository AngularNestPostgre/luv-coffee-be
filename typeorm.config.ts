import { DataSource } from 'typeorm/data-source/DataSource';

// import { Coffee } from './src/modules/coffees/entities/coffee.entity';
// import { Flavor } from './src/modules/coffees/entities/flavor.entity';
// import { UserEntity } from './src/users/entities/user.entity';

import { SchemaSync1643620954485 } from 'src/db/migrations/1643620954485-SchemaSync';
import { SchemaSync1711700291982 } from 'src/db/migrations/1711700291982-SchemaSync';
import { SchemaSync1746189948119 } from 'src/db/migrations/1746189948119-SchemaSync';

export default new DataSource({
  type: 'postgres',
  database: 'postgres',
  username: 'postgres',
  host: 'localhost',
  port: 5432,
  password: 'pass123',
  entities: [], // Insert right entities for migration
  migrations: [
    SchemaSync1643620954485,
    SchemaSync1711700291982,
    SchemaSync1746189948119,
  ], // Insert right migrations for migration run
});
