import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize';

export class NotificationModel extends Model<InferAttributes<NotificationModel>, InferCreationAttributes<NotificationModel>> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare ticketId: number;
  declare message: string;
  declare read: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static initModel(sequelize: Sequelize): void {
    NotificationModel.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        userId: { type: DataTypes.INTEGER, allowNull: false },
        // Sin FK: la notificación se conserva aunque el ticket se elimine.
        ticketId: { type: DataTypes.INTEGER, allowNull: false },
        message: { type: DataTypes.STRING(500), allowNull: false },
        read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      { sequelize, tableName: 'notifications' },
    );
  }
}
