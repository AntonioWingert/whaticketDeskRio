import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("StatusQueues", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      alteredUserId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: { model: "Users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      lastStatusId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: { model: "Status", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      actualStatusId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: { model: "Status", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      date: {
        allowNull: true,
        type: DataTypes.DATE
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("StatusQueues");
  }
};
