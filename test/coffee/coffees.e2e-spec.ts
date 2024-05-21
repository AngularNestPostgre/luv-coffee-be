import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';

import { CoffeesModule } from '../../src/modules/coffees/coffees.module';
import { CreateCoffeeDto } from '../../src/modules/coffees/dto/create-coffee.dto';

describe('[Feature] Coffees - /coffees', () => {
  const coffee = {
    name: 'Shipwreck Roast',
    brand: 'Buddy Brew',
    flavors: ['chocolate', 'vanilla'],
  };

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          database: process.env.DB_NAME,
          username: process.env.DB_USER,
          host: process.env.DB_HOST,
          port: +process.env.DB_PORT,
          password: process.env.DB_PASSWORD,
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Create [POST /]', () => {
    return request(app.getHttpServer())
      .post('/coffees')
      .set('Authorization', process.env.API_KEY) // TODO: change auth. API_KEY is obsolete
      .send(coffee as CreateCoffeeDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        const expectedCoffee = jasmine.objectContaining({
          ...coffee,
          flavors: jasmine.arrayContaining(
            coffee.flavors.map((name) => jasmine.objectContaining({ name })),
          ),
        });

        expect(body).toEqual(expectedCoffee);
      });
  });

  it('Get All [Get /coffees]', () => {
    return request(app.getHttpServer())
      .get('/coffees')
      .set('Authorization', process.env.API_KEY) // TODO: change auth. API_KEY is obsolete
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        console.log(body);

        expect(true).toEqual(true);
      });
  });

  it.todo('Get one [Get /:id]');
  it.todo('Update one [Patch /:id]');
  it.todo('Delete one [DELETE /:id]');
});
