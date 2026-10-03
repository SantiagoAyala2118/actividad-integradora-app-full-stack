import { User } from "./User.ts";
import { Subscription } from "./Subscription.ts";
import { Role } from "./Role.ts";
import { Product } from "./Product.ts";
import { Permission } from "./Permission.ts";
import { Notification } from "./Notification.ts";

//* Role (1) ------ (N) User
//? Un role pertenece a varios usuarios, pero un usuario tiene un solo rol

Role.hasMany(User, { foreignKey: "roleId", onDelete: "RESTRICT" });
User.belongsTo(Role, { foreignKey: "roleId" });

//! ============================================================
//* Role (N) ------ (M) Permission, con tabla intermedia role_permissions
//? Un rol puede tener varios permisos, y un permiso puede estar asociado a varios roles

Role.belongsToMany(Permission, {
  through: "role_permission",
  foreignKey: "roleId",
  otherKey: "permissionId",
});
Permission.belongsToMany(Role, {
  through: "role_permission",
  foreignKey: "permissionId",
  otherKey: "roleId",
});

//! ============================================================
//* User (1) ------ (N) Subscription (N) ------ (1) Product
//? Un usuario puede tener varias suscripciones, mientras que un producto puede estar asociado a varias suscripciones

User.hasMany(Subscription, { foreignKey: "userId", onDelete: "CASCADE" });
Subscription.belongsTo(User, { foreignKey: "userId" });
Product.hasMany(Subscription, { foreignKey: "productId", onDelete: "CASCADE" });
Subscription.belongsTo(Product, { foreignKey: "productId" });

//! ============================================================
//* User (1) ------ (N) Notifications / Product (1) ------(N) Notification
//? Un usuario puede tener muchas notificaciones, mientras que a su vez, un producto puede tener varias notificaciones
User.hasMany(Notification, { foreignKey: "userId", onDelete: "CASCADE" });
Notification.belongsTo(User, { foreignKey: "userId" });
Product.hasMany(Notification, { foreignKey: "productId", onDelete: "CASCADE" });
Notification.belongsTo(Product, { foreignKey: "productId" });

export { Role, Permission, User, Product, Subscription, Notification };
