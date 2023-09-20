import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Unique,
  BelongsToMany,
  HasMany
} from "sequelize-typescript";

import User from "./User";
import StatusQueue from "./StatusQueue";

@Table({ tableName: "Status" })
class Status extends Model<Status> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Unique
  @Column
  name: string;

  @BelongsToMany(() => User, () => StatusQueue, "status")
  users: Array<User & { StatusQueue: StatusQueue }>;

  @HasMany(() => StatusQueue)
  statusQueue: Array<StatusQueue>;
}

export default Status;
