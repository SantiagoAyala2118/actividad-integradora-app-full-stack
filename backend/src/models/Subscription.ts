import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute, Sequelize } from 'sequelize';
import { UserModel } from './User';

export class SubscriptionModel extends Model<InferAttributes<SubscriptionModel>, InferCreationAttributes<SubscriptionModel>> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare ticketId: number;
  declare user?: NonAttribute<UserModel>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static initModel(sequelize: Sequelize): void {
    SubscriptionModel.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        userId: { type: DataTypes.INTEGER, allowNull: false },
        ticketId: { type: DataTypes.INTEGER, allowNull: false },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      {
        sequelize,
        tableName: 'subscriptions',
        indexes: [{ unique: true, fields: ['userId', 'ticketId'] }],
      },
    );
  }
}
