import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize';
import { TICKET_STATUSES, TicketStatus } from '../types/domain';

export class TicketModel extends Model<InferAttributes<TicketModel>, InferCreationAttributes<TicketModel>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare description: string;
  declare status: CreationOptional<TicketStatus>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static initModel(sequelize: Sequelize): void {
    TicketModel.init(
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        title: { type: DataTypes.STRING(150), allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
        status: { type: DataTypes.ENUM(...TICKET_STATUSES), allowNull: false, defaultValue: 'ABIERTO' },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
      },
      { sequelize, tableName: 'tickets' },
    );
  }
}
