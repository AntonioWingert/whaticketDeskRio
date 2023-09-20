import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.addColumn("Users", "userStatus", {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Status",
        key: "id"
      }
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.removeColumn("Users", "userStatus");
  }
};
