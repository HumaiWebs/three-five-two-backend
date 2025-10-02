import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import UserSchema, { User } from 'src/schemas/user.schema';

const models = [{ name: User.name, schema: UserSchema }];

const features = [
  MongooseModule.forRoot(process.env.MONGODB_URI!, {
    dbName: 'colab',
  }),
  MongooseModule.forFeature(models),
];

@Global()
@Module({
  imports: [...features],
  exports: [...features],
})
export class DatabaseModule {}
