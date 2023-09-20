import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("Status", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING
      }
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("Status");
  }
};
