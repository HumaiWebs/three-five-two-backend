import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Workspace' }], default: [] })  // Changed to string ref
  workspaces: string[];  // Also corrected type to string[] for ObjectIds
}

const UserSchema = SchemaFactory.createForClass(User);

export default UserSchema;
