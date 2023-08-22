import {
  Table,
  Column,
  Model,
  ForeignKey,
  Default,
  BelongsTo,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt
} from "sequelize-typescript";
import User from "./User";
import Status from "./Status";

@Table
class StatusQueue extends Model<StatusQueue> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => User)
  @Column
  alteredUserId: number;

  @ForeignKey(() => Status)
  @Column
  lastStatusId: number;

  @ForeignKey(() => Status)
  @Column
  actualStatusId: number;

  @Default(null)
  @Column
  date: Date;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => User, "userId")
  user: User;

  @BelongsTo(() => User, "alteredUserId")
  alteredUser: User;

  @BelongsTo(() => Status, "lastStatusId")
  lastStatus: Status;

  @BelongsTo(() => Status, "actualStatusId")
  actualStatus: Status;
}

export default StatusQueue;
