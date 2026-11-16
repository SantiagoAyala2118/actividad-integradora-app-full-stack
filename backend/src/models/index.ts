import { Sequelize } from 'sequelize';
import { NotificationModel } from './Notification';
import { PermissionModel } from './Permission';
import { RoleModel } from './Role';
import { SubscriptionModel } from './Subscription';
import { TicketModel } from './Ticket';
import { UserModel } from './User';

let initialized = false;

/** Inicializa todos los modelos y sus asociaciones sobre la instancia de Sequelize recibida. */
export function initModels(sequelize: Sequelize): void {
  if (initialized) return;

  PermissionModel.initModel(sequelize);
  RoleModel.initModel(sequelize);
  UserModel.initModel(sequelize);
  TicketModel.initModel(sequelize);
  SubscriptionModel.initModel(sequelize);
  NotificationModel.initModel(sequelize);

  RoleModel.belongsToMany(PermissionModel, { through: 'role_permissions', as: 'permissions', timestamps: false });
  PermissionModel.belongsToMany(RoleModel, { through: 'role_permissions', as: 'roles', timestamps: false });

  RoleModel.hasMany(UserModel, { foreignKey: 'roleId', as: 'users' });
  UserModel.belongsTo(RoleModel, { foreignKey: 'roleId', as: 'role' });

  UserModel.hasMany(SubscriptionModel, { foreignKey: 'userId', onDelete: 'CASCADE' });
  SubscriptionModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' });

  TicketModel.hasMany(SubscriptionModel, { foreignKey: 'ticketId', onDelete: 'CASCADE' });
  SubscriptionModel.belongsTo(TicketModel, { foreignKey: 'ticketId', as: 'ticket' });

  UserModel.hasMany(NotificationModel, { foreignKey: 'userId', onDelete: 'CASCADE' });
  NotificationModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' });

  initialized = true;
}

export { NotificationModel, PermissionModel, RoleModel, SubscriptionModel, TicketModel, UserModel };
